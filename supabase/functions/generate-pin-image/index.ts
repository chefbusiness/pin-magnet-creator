
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

    // Enhanced prompt for Pinterest pin generation with mandatory text overlay
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

    // MANDATORY text overlay instructions - more specific and forceful
    basePrompt += `\n\nMANDATORY TEXT OVERLAY REQUIREMENTS (CRITICAL):
- YOU MUST add visible text overlay with the title: "${title}"
- The text MUST be clearly readable and professionally styled
- Position text in upper third, lower third, or corner - NEVER in center blocking main subject
- Use elegant, Pinterest-style typography with high contrast
- Text should occupy 20-35% of image height maximum
- Add subtle semi-transparent background behind text (blur, shadow, or colored overlay)
- Text color must contrast sharply with background (white text on dark overlay, or dark text on light overlay)  
- Use modern sans-serif or serif fonts typical of Pinterest pins
- Text must be large enough to read on mobile devices
- EXAMPLE STYLES: White bold text with dark semi-transparent background, or dark text with light semi-transparent background
- The background image must remain the primary visual focus
- Text overlay is MANDATORY - do not create pin without visible text

IMPORTANT: This is a Pinterest pin, so text overlay is ESSENTIAL for engagement. Do not generate without clear, readable text overlay.`;

    basePrompt += `\n\nFINAL OUTPUT: Pinterest pin with mandatory text overlay, ready for publishing, optimized for engagement and clicks`;

    console.log('Generating Pinterest pin with enhanced text overlay prompt:', basePrompt);

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
