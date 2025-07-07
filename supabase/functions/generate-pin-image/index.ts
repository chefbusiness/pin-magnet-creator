import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Replicate from "https://esm.sh/replicate@0.25.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, style = 'modern' } = await req.json();
    
    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Title is required for image generation' }),
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

    const replicate = new Replicate({
      auth: replicateApiKey,
    });

    // Create Pinterest-optimized prompt for Ideogram
    const stylePrompts = {
      modern: 'clean modern typography, minimalist design, professional layout',
      creative: 'artistic typography, creative visual elements, vibrant colors',
      elegant: 'elegant serif fonts, sophisticated layout, luxury aesthetic',
      bold: 'bold typography, high contrast, eye-catching design',
      lifestyle: 'lifestyle photography style, warm colors, instagram aesthetic'
    };

    const selectedStyle = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.modern;
    
    const prompt = `Create a Pinterest pin image (736x1104 aspect ratio) with the following text prominently displayed:

TITLE: "${title}"
${description ? `SUBTITLE: "${description.substring(0, 100)}"` : ''}

Style requirements:
- ${selectedStyle}
- Pinterest pin format (vertical 736x1104)
- High contrast text for readability
- Professional typography
- Attractive background that doesn't compete with text
- Leave space for text overlay
- Colors: modern palette with good contrast
- Must include the exact title text clearly readable

Typography style: Sans-serif, bold, hierarchical text layout`;

    console.log('Generating Pinterest pin image with Ideogram...');
    console.log('Prompt:', prompt);

    const output = await replicate.run(
      "ideogram-ai/ideogram-v2",
      {
        input: {
          prompt: prompt,
          aspect_ratio: "10:16", // Pinterest pin ratio
          model: "V_2",
          magic_prompt_option: "Auto"
        }
      }
    );

    console.log('Ideogram response:', output);

    if (!output || (Array.isArray(output) && output.length === 0)) {
      throw new Error('No image generated from Ideogram');
    }

    const imageUrl = Array.isArray(output) ? output[0] : output;

    return new Response(
      JSON.stringify({ 
        data: { 
          imageUrl,
          prompt: prompt.substring(0, 200) + '...'
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