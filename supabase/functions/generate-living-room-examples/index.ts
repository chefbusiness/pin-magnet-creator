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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Generating fixed example pins for living room decor...');

    // Define the 3 examples with proper prompts for Ideogram
    const examples = [
      {
        title: "Sala de Estar Escandinava: 7 Ideas que Transformarán tu Hogar",
        description: "Descubre cómo crear una sala acogedora con estilo nórdico. Muebles de madera clara, textiles suaves y plantas naturales.",
        imageStylePrompt: "Interior design, living room, modern decor, cozy atmosphere, elegant furniture, warm lighting, high-quality interior photography, realistic lighting, professional home staging, scandinavian nordic style, light woods, neutral colors, hygge aesthetic",
        fileName: "living-room-scandinavian.png"
      },
      {
        title: "Decoración de Sala Pequeña: Maximiza tu Espacio con Estilo", 
        description: "Ideas inteligentes para salas compactas. Soluciones de almacenaje y trucos visuales que amplían el espacio.",
        imageStylePrompt: "Interior design, living room, modern decor, cozy atmosphere, elegant furniture, warm lighting, high-quality interior photography, realistic lighting, professional home staging, small space optimization, compact living, space-saving solutions, aesthetic cozy vibes, soft lighting",
        fileName: "living-room-small-space.png"
      },
      {
        title: "Tendencia 2024: Salas Bohemias con Plantas y Texturas",
        description: "El estilo boho está de vuelta. Cojines étnicos, plantas colgantes y alfombras texturizadas para crear un oasis urbano.",
        imageStylePrompt: "Interior design, living room, modern decor, cozy atmosphere, elegant furniture, warm lighting, high-quality interior photography, realistic lighting, professional home staging, bohemian boho style, macrame, plants, warm textures, earthy tones, plant-filled space, indoor jungle, botanical decor",
        fileName: "living-room-bohemian.png"
      }
    ];

    // Generate images using the existing generate-pin-image function
    const imagePromises = examples.map(async (example, index) => {
      try {
        console.log(`Generating example ${index + 1}: ${example.title}`);
        
        const imageResponse = await supabase.functions.invoke('generate-pin-image', {
          body: {
            title: example.title,
            description: example.description,
            style: `ejemplo-${index + 1}`,
            url: null,
            imageStylePrompt: example.imageStylePrompt
          }
        });

        if (imageResponse.error) {
          console.error(`Failed to generate example ${index + 1}:`, imageResponse.error);
          return {
            ...example,
            imageUrl: null,
            error: imageResponse.error.message
          };
        }

        return {
          ...example,
          imageUrl: imageResponse.data.data.imageUrl,
          style: `ejemplo-${index + 1}`
        };
      } catch (error) {
        console.error(`Error generating example ${index + 1}:`, error);
        return {
          ...example,
          imageUrl: null,
          error: error.message
        };
      }
    });

    const results = await Promise.allSettled(imagePromises);
    const examplePins = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);

    console.log(`Generated ${examplePins.length} example pins with Ideogram v3-turbo`);

    return new Response(
      JSON.stringify({ 
        data: {
          examples: examplePins,
          count: examplePins.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-living-room-examples function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});