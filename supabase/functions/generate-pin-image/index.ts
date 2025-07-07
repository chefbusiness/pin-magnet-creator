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
    const { title, description, domain, style = 'modern' } = await req.json();
    
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

    // Validación súper estricta de título
    const validateTitle = (title: string): string => {
      if (title.length > 35) {
        console.warn(`Title too long (${title.length} chars): ${title}`);
        return title.substring(0, 32) + '...';
      }
      
      // Limpiar caracteres problemáticos para Ideogram
      return title
        .replace(/[""''«»]/g, '"')
        .replace(/[…]/g, '...')
        .replace(/[–—]/g, '-')
        .trim();
    };

    const validatedTitle = validateTitle(title);

    const prompt = `Pinterest pin design. Clean text layout.

Title: "${validatedTitle}"
Domain: ${domain}

Simple design, readable text, professional look.`;

    console.log('Generating Pinterest pin image with Ideogram...');
    console.log('Prompt:', prompt);

    const output = await replicate.run(
      "ideogram-ai/ideogram-v2",
      {
        input: {
          prompt: prompt,
          aspect_ratio: "10:16", // Pinterest pin ratio
          model: "V_2"
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