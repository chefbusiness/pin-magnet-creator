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
      modern: 'modern food photography background, clean white text with bold sans-serif typography, geometric shapes, bright professional lighting, high-end restaurant aesthetic',
      creative: 'vibrant colorful food background, artistic hand-lettered typography, watercolor elements, fresh ingredients, dynamic composition with visual hierarchy',
      elegant: 'luxury dark background with gold accents, sophisticated serif typography, premium food styling, marble textures, upscale restaurant ambiance',
      bold: 'dramatic high-contrast background, extra bold typography with shadows, striking color palette, eye-catching visual elements, attention-grabbing design',
      lifestyle: 'warm cozy kitchen background, friendly handwritten-style typography, natural lighting, homestyle cooking aesthetic, inviting atmosphere'
    };

    const selectedStyle = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.modern;
    
    const prompt = `Create a stunning Pinterest pin (736x1104 vertical format) that will go viral. Design requirements:

MAIN TEXT: "${title}" (make this text HUGE, bold, and impossible to ignore)
${description ? `SECONDARY TEXT: "${description.substring(0, 80)}"` : ''}

Visual Style: ${selectedStyle}

CRITICAL DESIGN REQUIREMENTS:
- Background: Beautiful, appetizing food/restaurant photography that relates to the content topic
- Typography: Use LARGE, BOLD, high-contrast text that pops against the background
- Color scheme: Eye-catching colors that work well on Pinterest (bright, vibrant, but professional)
- Layout: Top 1/3 for background image, middle section for main text overlay, bottom for subtitle/branding
- Text treatment: Add subtle shadows or outlines to text for maximum readability
- Professional quality: This should look like it was designed by a top Pinterest marketing agency
- Visual hierarchy: Main title should be the dominant element, supporting text smaller but still readable
- Pinterest optimization: Bright, scroll-stopping visual that makes people want to click and save

The final result should be so attractive that Pinterest users can't scroll past it without clicking!`;

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