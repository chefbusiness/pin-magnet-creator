
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Enhanced prompt for Pinterest pin generation with better text overlay
    let basePrompt = `Create a Pinterest pin image (736x1104 pixels, vertical format) with the following specifications:

MAIN CONTENT: "${title}"
CONTEXT: "${description}"

VISUAL REQUIREMENTS:
- High-quality, Pinterest-optimized design
- Vertical aspect ratio (736x1104)
- Eye-catching and shareable
- Professional photography or illustration style`;

    // Add specialized image style if provided
    if (imageStylePrompt) {
      basePrompt += `\nSTYLE SPECIFICATION: ${imageStylePrompt}`;
    }

    // Enhanced text overlay instructions
    basePrompt += `\n\nTEXT OVERLAY REQUIREMENTS:
- Add elegant text overlay with the title: "${title}"
- Text should be clearly readable but NOT dominate the entire image
- Position text in corner or strategic location (not center)
- Use professional typography with good contrast
- Text overlay should occupy maximum 30% of the image
- Background image must remain the main visual focus
- Use subtle background blur or shadow behind text for readability
- Modern, Pinterest-style text treatment
- Color scheme should be cohesive and appealing`;

    basePrompt += `\n\nFINAL OUTPUT: Pinterest pin ready for publishing, optimized for engagement and clicks`;

    console.log('Generating Pinterest pin with prompt:', basePrompt);

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
        input: {
          prompt: basePrompt,
          go_fast: true,
          megapixels: "1",
          num_outputs: 1,
          aspect_ratio: "9:16",
          output_format: "png",
          output_quality: 90,
          num_inference_steps: 4
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.status}`);
    }

    const prediction = await response.json();
    console.log('Replicate prediction created:', prediction.id);

    // Poll for completion
    let result = prediction;
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          'Authorization': `Token ${replicateApiKey}`,
        },
      });
      
      result = await pollResponse.json();
      console.log('Polling result:', result.status);
    }

    if (result.status === 'failed') {
      throw new Error(`Image generation failed: ${result.error}`);
    }

    if (!result.output || result.output.length === 0) {
      throw new Error('No image generated');
    }

    const imageUrl = result.output[0];
    console.log('Generated image URL:', imageUrl);

    return new Response(
      JSON.stringify({ 
        data: {
          imageUrl,
          prompt: basePrompt
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-pin-image function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
