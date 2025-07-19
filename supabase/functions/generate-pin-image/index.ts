
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, style, url, imageStylePrompt } = await req.json();
    
    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: 'Title and description are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const replicateApiKey = Deno.env.get('REPLICATE_API_KEY');
    if (!replicateApiKey) {
      return new Response(
        JSON.stringify({ error: 'Replicate API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract domain from URL if provided
    let websiteDomain = '';
    if (url) {
      try {
        const urlObj = new URL(url);
        websiteDomain = urlObj.hostname.replace('www.', '');
      } catch (error) {
        console.log('Could not extract domain from URL:', url);
      }
    }

    // Simplified prompt optimized for Pinterest pins
    let basePrompt = `Create a Pinterest pin image (vertical format, 9:16 aspect ratio) with the following content:

TITLE: "${title}"
DESCRIPTION: "${description}"

VISUAL REQUIREMENTS:
- High-quality Pinterest pin design
- Vertical format optimized for Pinterest
- Eye-catching and professional
- Clean, readable layout`;

    // Add style specification if provided
    if (imageStylePrompt) {
      basePrompt += `\nSTYLE: ${imageStylePrompt}`;
    }

    // Add mandatory text overlay requirements
    basePrompt += `\n\nTEXT OVERLAY REQUIREMENTS:
- Add clear, readable text overlay with the title: "${title}"
- Use professional Pinterest-style typography
- High contrast text (white on dark background or dark on light background)
- Position text strategically (top, bottom, or side)
- Make text large enough to read on mobile
- Add subtle background behind text for readability`;

    // Add website credit if available
    if (websiteDomain) {
      basePrompt += `\n\nWEBSITE CREDIT:
- Include small website credit: "${websiteDomain}"
- Place in corner or bottom area
- Keep it professional and readable`;
    }

    basePrompt += `\n\nFINAL OUTPUT: Professional Pinterest pin ready for engagement and clicks`;

    console.log('=== DETAILED LOGGING START ===');
    console.log('Prompt being sent:', basePrompt);
    console.log('API Key exists:', !!replicateApiKey);
    console.log('=== ATTEMPTING REPLICATE API CALL ===');

    // Use correct parameters for ideogram-v3-turbo
    const requestBody = {
      input: {
        prompt: basePrompt,
        aspect_ratio: "9:16",
        model: "v_3_turbo",
        magic_prompt_option: "Auto"
      }
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch('https://api.replicate.com/v1/models/ideogram-ai/ideogram-v3-turbo/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${replicateApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Replicate response status:', response.status);
      console.log('Replicate response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      if (!response.ok) {
        console.error(`Replicate API error: ${response.status}`);
        throw new Error(`Replicate API error: ${response.status} - ${responseText}`);
      }

      let prediction;
      try {
        prediction = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid JSON response from Replicate API');
      }

      console.log('Parsed prediction:', prediction);

      if (!prediction.id) {
        console.error('No prediction ID in response');
        throw new Error('Invalid prediction response - missing ID');
      }

      console.log('Replicate prediction created:', prediction.id);

      // Poll for completion with detailed logging
      let result = prediction;
      let pollCount = 0;
      const maxPolls = 60; // 60 seconds timeout
      
      while (result.status === 'starting' || result.status === 'processing') {
        if (pollCount >= maxPolls) {
          throw new Error('Image generation timeout');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
          headers: {
            'Authorization': `Token ${replicateApiKey}`,
          },
        });
        
        if (!pollResponse.ok) {
          const pollErrorText = await pollResponse.text();
          console.error('Polling error:', pollResponse.status, pollErrorText);
          throw new Error(`Polling error: ${pollResponse.status}`);
        }
        
        const pollText = await pollResponse.text();
        console.log('Poll response text:', pollText);
        
        try {
          result = JSON.parse(pollText);
        } catch (pollParseError) {
          console.error('Failed to parse poll response:', pollParseError);
          throw new Error('Invalid JSON in poll response');
        }
        
        console.log('Polling result status:', result.status);
        pollCount++;
      }

      console.log('Final result:', result);

      if (result.status === 'failed') {
        console.error('Generation failed:', result.error);
        throw new Error(`Image generation failed: ${result.error || 'Unknown error'}`);
      }

      if (!result.output || !Array.isArray(result.output) || result.output.length === 0) {
        console.error('No valid output received:', result);
        throw new Error('No image generated - empty output');
      }

      const replicateImageUrl = result.output[0];
      console.log('Generated image URL from Replicate:', replicateImageUrl);

      // Detailed URL validation
      if (!replicateImageUrl || 
          typeof replicateImageUrl !== 'string' || 
          replicateImageUrl.length < 10 ||
          !replicateImageUrl.startsWith('http')) {
        console.error('Invalid image URL received:', replicateImageUrl);
        throw new Error(`Invalid image URL: ${replicateImageUrl}`);
      }

      // Test URL accessibility
      try {
        new URL(replicateImageUrl);
        console.log('URL validation passed');
      } catch (urlError) {
        console.error('Malformed URL:', replicateImageUrl);
        throw new Error('Malformed image URL received from Replicate');
      }

      // Download and upload to Supabase
      console.log('Downloading image from Replicate...');
      const imageResponse = await fetch(replicateImageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status}`);
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
      
      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `pin-${timestamp}-${randomId}.png`;
      
      console.log('Uploading image to Supabase Storage:', fileName);
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pin-images')
        .upload(fileName, imageBlob, {
          contentType: 'image/png',
          cacheControl: '3600'
        });
      
      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error(`Failed to upload to Supabase: ${uploadError.message}`);
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pin-images')
        .getPublicUrl(fileName);
      
      console.log('Image uploaded successfully. Public URL:', publicUrl);
      console.log('=== SUCCESS - DETAILED LOGGING END ===');

      return new Response(
        JSON.stringify({ 
          data: {
            imageUrl: publicUrl,
            prompt: basePrompt,
            fileName: fileName
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (replicateError) {
      console.error('=== REPLICATE API ERROR ===');
      console.error('Error details:', replicateError);
      console.error('Error message:', replicateError.message);
      console.error('Error stack:', replicateError.stack);
      
      // Fallback to Flux model if Ideogram fails
      console.log('=== TRYING FALLBACK TO FLUX MODEL ===');
      
      const fluxResponse = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${replicateApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            prompt: basePrompt,
            go_fast: true,
            megapixels: "1",
            num_outputs: 1,
            aspect_ratio: "9:16",
            output_format: "png",
            output_quality: 80
          }
        }),
      });

      if (!fluxResponse.ok) {
        const fluxErrorText = await fluxResponse.text();
        console.error('Flux API also failed:', fluxResponse.status, fluxErrorText);
        throw new Error(`Both Ideogram and Flux APIs failed. Last error: ${fluxErrorText}`);
      }

      const fluxPrediction = await fluxResponse.json();
      console.log('Flux prediction created:', fluxPrediction.id);

      // Poll Flux result
      let fluxResult = fluxPrediction;
      let fluxPollCount = 0;
      
      while (fluxResult.status === 'starting' || fluxResult.status === 'processing') {
        if (fluxPollCount >= 60) {
          throw new Error('Flux generation timeout');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const fluxPollResponse = await fetch(`https://api.replicate.com/v1/predictions/${fluxResult.id}`, {
          headers: { 'Authorization': `Token ${replicateApiKey}` },
        });
        
        fluxResult = await fluxPollResponse.json();
        console.log('Flux polling result:', fluxResult.status);
        fluxPollCount++;
      }

      if (fluxResult.status === 'failed' || !fluxResult.output?.[0]) {
        throw new Error('Flux generation also failed');
      }

      const fluxImageUrl = fluxResult.output[0];
      console.log('Flux generated image URL:', fluxImageUrl);

      // Download and upload Flux image
      const fluxImageResponse = await fetch(fluxImageUrl);
      const fluxImageBuffer = await fluxImageResponse.arrayBuffer();
      const fluxImageBlob = new Blob([fluxImageBuffer], { type: 'image/png' });
      
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const fluxFileName = `pin-flux-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.png`;
      
      const { error: fluxUploadError } = await supabase.storage
        .from('pin-images')
        .upload(fluxFileName, fluxImageBlob, {
          contentType: 'image/png',
          cacheControl: '3600'
        });
      
      if (fluxUploadError) {
        throw new Error(`Failed to upload Flux image: ${fluxUploadError.message}`);
      }
      
      const { data: { publicUrl: fluxPublicUrl } } = supabase.storage
        .from('pin-images')
        .getPublicUrl(fluxFileName);
      
      console.log('=== FLUX FALLBACK SUCCESS ===');

      return new Response(
        JSON.stringify({ 
          data: {
            imageUrl: fluxPublicUrl,
            prompt: basePrompt,
            fileName: fluxFileName,
            model: 'flux-schnell' // Indicate fallback was used
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('=== FINAL ERROR ===');
    console.error('Error in generate-pin-image function:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for detailed error information'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
