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

    console.log('=== STARTING GENERATION OF 3 IMAGES ===');
    console.log('Prompt being sent:', basePrompt);

    // Generate 3 images in parallel
    const imagePromises = [];
    for (let i = 0; i < 3; i++) {
      imagePromises.push(generateSingleImage(basePrompt, replicateApiKey, supabaseUrl, supabaseKey, i + 1));
    }

    const results = await Promise.allSettled(imagePromises);
    
    const successfulImages = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    
    if (successfulImages.length === 0) {
      throw new Error('Failed to generate any images');
    }

    console.log(`Successfully generated ${successfulImages.length} images`);
    
    return new Response(
      JSON.stringify({ 
        data: {
          images: successfulImages,
          totalGenerated: successfulImages.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

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

// Helper function to generate a single image
async function generateSingleImage(prompt: string, replicateApiKey: string, supabaseUrl: string, supabaseKey: string, imageNumber: number) {
  console.log(`=== GENERATING IMAGE ${imageNumber} ===`);
  
  try {
    const requestBody = {
      input: {
        prompt: prompt,
        aspect_ratio: "9:16"
      }
    };

    console.log(`Image ${imageNumber} - Request body:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.replicate.com/v1/models/ideogram-ai/ideogram-v3-turbo/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`Image ${imageNumber} - Replicate response status:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Image ${imageNumber} - Replicate API error: ${response.status} - ${errorText}`);
      throw new Error(`Replicate API error: ${response.status} - ${errorText}`);
    }

    const prediction = await response.json();
    console.log(`Image ${imageNumber} - Prediction created:`, prediction.id);

    // Poll for completion
    let result = prediction;
    let pollCount = 0;
    const maxPolls = 60;
    
    while (result.status === 'starting' || result.status === 'processing') {
      if (pollCount >= maxPolls) {
        throw new Error('Image generation timeout');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { 'Authorization': `Token ${replicateApiKey}` },
      });
      
      if (!pollResponse.ok) {
        throw new Error(`Polling error: ${pollResponse.status}`);
      }
      
      result = await pollResponse.json();
      console.log(`Image ${imageNumber} - Status:`, result.status);
      pollCount++;
    }

    if (result.status === 'failed') {
      console.error(`Image ${imageNumber} - Generation failed:`, result.error);
      throw new Error(`Image generation failed: ${result.error || 'Unknown error'}`);
    }

    if (!result.output || !Array.isArray(result.output) || result.output.length === 0) {
      console.error(`Image ${imageNumber} - No valid output:`, result);
      throw new Error('No image generated - empty output');
    }

    const replicateImageUrl = result.output[0];
    console.log(`Image ${imageNumber} - Generated URL:`, replicateImageUrl);

    // Download and upload to Supabase
    const imageResponse = await fetch(replicateImageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileName = `pin-ideogram-${imageNumber}-${timestamp}-${randomId}.png`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pin-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600'
      });
    
    if (uploadError) {
      console.error(`Image ${imageNumber} - Upload error:`, uploadError);
      throw new Error(`Failed to upload: ${uploadError.message}`);
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('pin-images')
      .getPublicUrl(fileName);
    
    console.log(`Image ${imageNumber} - SUCCESS - URL: ${publicUrl}`);

    return {
      imageUrl: publicUrl,
      fileName: fileName,
      model: 'ideogram-v3-turbo',
      imageNumber: imageNumber
    };

  } catch (ideogramError) {
    console.error(`Image ${imageNumber} - Ideogram failed, trying Flux fallback:`, ideogramError.message);
    
    // Fallback to Flux
    try {
      const fluxResponse = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${replicateApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            prompt: prompt,
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
      const fluxFileName = `pin-flux-${imageNumber}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.png`;
      
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
      
      console.log(`Image ${imageNumber} - Flux fallback SUCCESS`);

      return {
        imageUrl: fluxPublicUrl,
        fileName: fluxFileName,
        model: 'flux-schnell',
        imageNumber: imageNumber
      };

    } catch (fluxError) {
      console.error(`Image ${imageNumber} - Both models failed:`, fluxError.message);
      throw new Error(`Both Ideogram and Flux failed for image ${imageNumber}`);
    }
  }
}