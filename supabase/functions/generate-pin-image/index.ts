
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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

    // Optimize title length for better visual balance
    let displayTitle = title;
    if (title.length > 50) {
      // For long titles, truncate or use key words
      const words = title.split(' ');
      if (words.length > 8) {
        displayTitle = words.slice(0, 8).join(' ') + '...';
      }
    }

    // Optimized prompt for Ideogram v3-turbo with better text/image balance
    let basePrompt = `Create a professional Pinterest pin image (vertical 9:16 format) with:

MAIN TITLE: "${displayTitle}"

VISUAL COMPOSITION:
- Background image should be the main visual focus (60% prominence)
- High-quality, eye-catching background related to the topic
- Professional Pinterest pin aesthetic`;

    // Add niche-specific style if provided
    if (imageStylePrompt) {
      basePrompt += `\nSTYLE AESTHETIC: ${imageStylePrompt}`;
    }

    // Optimized text overlay instructions for better visibility
    basePrompt += `\n\nTEXT OVERLAY REQUIREMENTS:
- Medium-sized, elegant title text: "${displayTitle}"
- Use modern, readable typography (not too bold/thick)
- Position text at top or bottom third of image (not center)
- Semi-transparent background behind text for readability
- Ensure background image remains clearly visible
- Text should enhance, not dominate the visual`;

    // Title length optimization
    if (title.length > 50) {
      basePrompt += `\n- Use thinner, more elegant font for long titles
- Prioritize readability while keeping text compact`;
    }

    // Prominent but elegant website credit
    if (websiteDomain) {
      basePrompt += `\n\nWEBSITE BRANDING:
- Display "${websiteDomain}" at bottom corner
- Small, elegant text that doesn't interfere with main design
- Subtle but visible branding placement`;
    }

    // Final optimization instructions
    basePrompt += `\n\nFINAL OPTIMIZATION:
- Vertical 9:16 aspect ratio for Pinterest
- Background image should be clearly visible and attractive
- Text overlay should be readable but not overpowering
- Professional, eye-catching design that drives clicks
- Mobile-friendly text size and contrast`;

    console.log('=== GENERATING IMAGE WITH IDEOGRAM V3-TURBO ===');
    console.log('Prompt:', basePrompt);

    try {
      // Generate image with Ideogram v3-turbo (using correct API format)
      const requestBody = {
        input: {
          prompt: basePrompt,
          aspect_ratio: "9:16",
          style_type: "None",
          resolution: "None", 
          magic_prompt_option: "Auto"
        }
      };

      console.log('Ideogram request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://api.replicate.com/v1/models/ideogram-ai/ideogram-v3-turbo/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${replicateApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Ideogram response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ideogram API error:', response.status, errorText);
        throw new Error(`Ideogram API error: ${response.status} - ${errorText}`);
      }

      const prediction = await response.json();
      console.log('Ideogram prediction created:', prediction.id);

      // Poll for completion
      let result = prediction;
      let pollCount = 0;
      const maxPolls = 60; // 60 seconds timeout
      
      while (result.status === 'starting' || result.status === 'processing') {
        if (pollCount >= maxPolls) {
          throw new Error('Ideogram generation timeout after 60 seconds');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
          headers: { 'Authorization': `Token ${replicateApiKey}` },
        });
        
        if (!pollResponse.ok) {
          throw new Error(`Polling error: ${pollResponse.status}`);
        }
        
        result = await pollResponse.json();
        console.log('Ideogram status:', result.status);
        pollCount++;
      }

      if (result.status === 'failed') {
        console.error('Ideogram generation failed:', result.error);
        throw new Error(`Ideogram generation failed: ${result.error || 'Unknown error'}`);
      }

      if (!result.output) {
        console.error('Ideogram no valid output:', result);
        throw new Error('No image generated by Ideogram - empty output');
      }

      // Ideogram v3-turbo returns output as a single URL string, not an array
      const ideogramImageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
      console.log('Ideogram generated URL:', ideogramImageUrl);

      // Download and upload to Supabase
      const imageResponse = await fetch(ideogramImageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download Ideogram image: ${imageResponse.status}`);
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `pin-ideogram-${timestamp}-${randomId}.png`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pin-images')
        .upload(fileName, imageBlob, {
          contentType: 'image/png',
          cacheControl: '3600'
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Failed to upload: ${uploadError.message}`);
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('pin-images')
        .getPublicUrl(fileName);
      
      console.log('=== IDEOGRAM SUCCESS ===');
      console.log('Final URL:', publicUrl);

      // Return single image (not multiple)
      return new Response(
        JSON.stringify({ 
          data: {
            images: [{
              imageUrl: publicUrl,
              fileName: fileName,
              model: 'ideogram-v3-turbo'
            }],
            totalGenerated: 1
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (ideogramError) {
      console.error('=== IDEOGRAM FAILED, TRYING FLUX FALLBACK ===');
      console.error('Ideogram error:', ideogramError.message);
      
      // Fallback to Flux only if Ideogram fails
      try {
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
          throw new Error(`Flux API failed: ${fluxResponse.status}`);
        }

        const fluxPrediction = await fluxResponse.json();
        
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
          fluxPollCount++;
        }

        if (fluxResult.status === 'failed' || !fluxResult.output?.[0]) {
          throw new Error('Flux generation also failed');
        }

        // Upload Flux image
        const fluxImageResponse = await fetch(fluxResult.output[0]);
        const fluxImageBuffer = await fluxImageResponse.arrayBuffer();
        const fluxImageBlob = new Blob([fluxImageBuffer], { type: 'image/png' });
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        const fluxFileName = `pin-flux-fallback-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.png`;
        
        const { error: fluxUploadError } = await supabase.storage
          .from('pin-images')
          .upload(fluxFileName, fluxImageBlob, {
            contentType: 'image/png',
            cacheControl: '3600'
          });
        
        if (fluxUploadError) {
          throw new Error(`Failed to upload Flux fallback image: ${fluxUploadError.message}`);
        }
        
        const { data: { publicUrl: fluxPublicUrl } } = supabase.storage
          .from('pin-images')
          .getPublicUrl(fluxFileName);
        
        console.log('=== FLUX FALLBACK SUCCESS ===');

        return new Response(
          JSON.stringify({ 
            data: {
              images: [{
                imageUrl: fluxPublicUrl,
                fileName: fluxFileName,
                model: 'flux-schnell-fallback'
              }],
              totalGenerated: 1
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (fluxError) {
        console.error('=== BOTH MODELS FAILED ===');
        console.error('Flux error:', fluxError.message);
        throw new Error(`Both Ideogram and Flux failed: ${fluxError.message}`);
      }
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
