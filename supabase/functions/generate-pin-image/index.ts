
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
    const { title, description, style, url, imageStylePrompt, pinIndex = 0 } = await req.json();
    
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
    if (title.length > 60) {
      // For very long titles, truncate intelligently
      const words = title.split(' ');
      if (words.length > 10) {
        displayTitle = words.slice(0, 10).join(' ') + '...';
      }
    }

    // Extract visual concept from description, NOT the text content
    let visualConcept = 'interior design scene';
    
    // Extract key visual concepts without including text content
    if (description.toLowerCase().includes('sala') || description.toLowerCase().includes('living')) {
      visualConcept = 'modern living room interior';
    } else if (description.toLowerCase().includes('cocina') || description.toLowerCase().includes('kitchen')) {
      visualConcept = 'modern kitchen interior';
    } else if (description.toLowerCase().includes('dormitorio') || description.toLowerCase().includes('bedroom')) {
      visualConcept = 'bedroom interior design';
    } else if (description.toLowerCase().includes('baño') || description.toLowerCase().includes('bathroom')) {
      visualConcept = 'bathroom interior design';
    }

    // CREATE VISUAL VARIATIONS BASED ON PIN INDEX - 3 DISTINCT STYLES
    const visualVariations = [
      // Pin 1: Wide angle room view
      {
        angle: 'wide-angle room view',
        perspective: 'spacious full room perspective showing complete layout',
        lighting: 'bright natural lighting from large windows, airy atmosphere'
      },
      // Pin 2: Cozy corner focus  
      {
        angle: 'intimate cozy corner detail',
        perspective: 'focused on comfortable seating area or reading nook',
        lighting: 'warm ambient lighting, golden hour soft glow'
      },
      // Pin 3: Modern minimalist
      {
        angle: 'clean minimalist architectural view',
        perspective: 'geometric symmetry and clean lines, magazine-style composition',
        lighting: 'crisp professional lighting, bright and clean'
      }
    ];

    const currentVariation = visualVariations[pinIndex % 3];

    // OPTIMIZED PROMPT STRUCTURE - VISUAL CONCEPT + CLEAR TEXT POSITIONING
    let basePrompt = `Pinterest pin 9:16 vertical format. 

BACKGROUND IMAGE: Full-screen ${visualConcept} photograph, high-quality interior design image.
VISUAL STYLE: ${currentVariation.angle}, ${currentVariation.perspective}, ${currentVariation.lighting}.
COMPOSITION: Complete uncut scene, full room visible, no cropping or partial elements.`;

    // Add style specifications if provided
    if (imageStylePrompt) {
      basePrompt += ` ${imageStylePrompt} style.`;
    }

    // CLEAR TEXT POSITIONING INSTRUCTIONS + ANTI-PARAGRAPH RULES
    basePrompt += `

TEXT OVERLAY POSITIONING:
- Title "${displayTitle}" positioned at TOP of image with transparent background
- Domain "${websiteDomain}" positioned at BOTTOM of image with transparent background  
- Text directly overlaid on background image, NO solid background panels

CRITICAL RESTRICTIONS:
- NO paragraphs or article text in the image
- NO body text content or descriptions in the image
- NO text blocks, sentences, or content snippets
- NO background boxes, panels, or frames around text
- Complete background image fills entire 9:16 frame
- Image NOT cropped, bordered, or partially cut off
- Full scene visible with all elements complete
- Only title at top and domain at bottom as text overlays`;

    console.log('=== GENERATING IMAGE WITH IDEOGRAM V3-TURBO ===');
    console.log(`Pin Variation ${pinIndex + 1}/3: ${currentVariation.angle}`);
    console.log('Optimized Prompt:', basePrompt);

    try {
      // IDEOGRAM V3-TURBO DIRECT STRUCTURE (NO INPUT WRAPPER)
      const requestBody = {
        prompt: basePrompt,
        resolution: "None",
        style_type: "None", 
        aspect_ratio: "9:16",
        magic_prompt_option: "Auto"
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

      // Return single image with variation info
      return new Response(
        JSON.stringify({ 
          data: {
            images: [{
              imageUrl: publicUrl,
              fileName: fileName,
              model: 'ideogram-v3-turbo',
              variation: `${currentVariation.angle} (Pin ${pinIndex + 1}/3)`
            }],
            totalGenerated: 1
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (ideogramError) {
      console.error('=== IDEOGRAM FAILED, TRYING FLUX FALLBACK ===');
      console.error('Ideogram error:', ideogramError.message);
      
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
                model: 'flux-schnell-fallback',
                variation: `${currentVariation.angle} (Pin ${pinIndex + 1}/3) - Fallback`
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
