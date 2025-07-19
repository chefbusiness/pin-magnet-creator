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
    const { categorySlug, nicheName } = await req.json();
    
    if (!categorySlug || !nicheName) {
      return new Response(
        JSON.stringify({ error: 'Category slug and niche name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Generating example pins for: ${nicheName} (${categorySlug})`);

    // Define examples based on category
    let examples = [];
    
    if (categorySlug === 'home-decor' && nicheName.toLowerCase().includes('sala')) {
      examples = [
        {
          title: "Sala de Estar Escandinava: 7 Ideas que Transformarán tu Hogar",
          description: "Descubre cómo crear una sala acogedora con estilo nórdico. Muebles de madera clara, textiles suaves y plantas naturales.",
          imageStylePrompt: "Interior design, living room, modern decor, cozy atmosphere, elegant furniture, warm lighting, high-quality interior photography, realistic lighting, professional home staging, scandinavian nordic style, light woods, neutral colors, hygge aesthetic"
        },
        {
          title: "Decoración de Sala Pequeña: Maximiza tu Espacio con Estilo", 
          description: "Ideas inteligentes para salas compactas. Soluciones de almacenaje y trucos visuales que amplían el espacio.",
          imageStylePrompt: "Interior design, living room, modern decor, cozy atmosphere, elegant furniture, warm lighting, high-quality interior photography, realistic lighting, professional home staging, small space optimization, compact living, space-saving solutions, aesthetic cozy vibes, soft lighting"
        },
        {
          title: "Tendencia 2024: Salas Bohemias con Plantas y Texturas",
          description: "El estilo boho está de vuelta. Cojines étnicos, plantas colgantes y alfombras texturizadas para crear un oasis urbano.",
          imageStylePrompt: "Interior design, living room, modern decor, cozy atmosphere, elegant furniture, warm lighting, high-quality interior photography, realistic lighting, professional home staging, bohemian boho style, macrame, plants, warm textures, earthy tones, plant-filled space, indoor jungle, botanical decor"
        }
      ];
    } else if (categorySlug === 'food' || categorySlug === 'comida') {
      examples = [
        {
          title: "Receta Viral: Pasta Cremosa en 15 Minutos",
          description: "La receta que arrasa en TikTok. Ingredientes simples, resultado espectacular. ¡Perfecta para cenas rápidas!",
          imageStylePrompt: "professional food photography, appetizing presentation, studio lighting, comfort food vibes, cozy home cooking, hearty meals"
        },
        {
          title: "Desayuno Healthy: Bowl de Açaí Aesthetic",
          description: "Desayuno nutritivo y fotogénico. Superfood, frutas frescas y toppings crujientes para empezar el día con energía.",
          imageStylePrompt: "professional food photography, appetizing presentation, studio lighting, flat lay food styling, top-down view, ingredient arrangement, healthy food aesthetic, fresh ingredients, clean eating"
        },
        {
          title: "Repostería Casera: Cookies Perfectas Paso a Paso",
          description: "Secretos de repostería profesional. Masa, cocción y decoración para cookies que conquistan Instagram.",
          imageStylePrompt: "professional food photography, appetizing presentation, studio lighting, macro close-up food photography, detailed texture, lifestyle cooking scene, homey kitchen atmosphere"
        }
      ];
    } else {
      // Generic examples
      examples = [
        {
          title: `Guía Completa: Todo sobre ${nicheName}`,
          description: "Los mejores consejos y trucos que necesitas conocer. Información actualizada y práctica para todos los niveles.",
          imageStylePrompt: "high-quality photography, professional lighting, realistic style, minimalist design, clean aesthetic, simple composition"
        },
        {
          title: `${nicheName}: Tendencias 2024 que Debes Conocer`,
          description: "Las últimas tendencias que marcarán este año. Mantente al día con las novedades más relevantes del sector.",
          imageStylePrompt: "aesthetic style, Instagram-worthy, trendy design, minimalist design, clean aesthetic, simple composition"
        },
        {
          title: `Secretos de ${nicheName} que los Expertos No Comparten`,
          description: "Tips exclusivos y técnicas avanzadas. Información valiosa para destacar y obtener mejores resultados.",
          imageStylePrompt: "illustration style, artistic rendering, stylized design, high-quality photography, professional lighting, realistic style"
        }
      ];
    }

    // Generate images for each example
    const imagePromises = examples.map(async (example, index) => {
      try {
        console.log(`Generating image ${index + 1}: ${example.title}`);
        
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
          console.error(`Failed to generate image ${index + 1}:`, imageResponse.error);
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
        console.error(`Error generating image ${index + 1}:`, error);
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

    console.log(`Generated ${examplePins.length} example pins for ${nicheName}`);

    return new Response(
      JSON.stringify({ 
        data: {
          examples: examplePins,
          nicheName,
          categorySlug,
          count: examplePins.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-niche-examples function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});