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
    const { urlAnalysis } = await req.json();
    
    if (!urlAnalysis) {
      return new Response(
        JSON.stringify({ error: 'URL analysis data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { title, og_title, description, og_description, content_summary } = urlAnalysis;
    
    const sourceTitle = og_title || title || 'Contenido interesante';
    const sourceDescription = og_description || description || content_summary?.substring(0, 200) || '';

    // Optimización de títulos para mejor legibilidad
    const optimizeTitle = (title: string): string => {
      // Límite razonable para Pinterest
      const MAX_LENGTH = 45;
      
      // Limpiar caracteres problemáticos
      let cleanTitle = title
        .replace(/[""''«»]/g, '"')  // Normalizar comillas
        .replace(/[…]/g, '...')     // Normalizar puntos suspensivos
        .replace(/[–—]/g, '-')      // Normalizar guiones
        .trim();
      
      if (cleanTitle.length <= MAX_LENGTH) return cleanTitle;
      
      // Truncate inteligente en palabras completas
      const words = cleanTitle.split(' ');
      let optimized = '';
      
      for (const word of words) {
        if ((optimized + ' ' + word).trim().length <= MAX_LENGTH) {
          optimized += (optimized ? ' ' : '') + word;
        } else {
          break;
        }
      }
      
      return optimized || cleanTitle.substring(0, MAX_LENGTH).trim();
    };

    const optimizedTitle = optimizeTitle(sourceTitle);

    const prompt = `Crea 3 variaciones diferentes de texto para pines de Pinterest basadas en este contenido:

Título: "${sourceTitle}"
Descripción: "${sourceDescription}"

Requisitos:
- Títulos: máximo 45 caracteres
- Descripciones: 350-400 caracteres
- Cada variación con enfoque diferente
- Texto claro y directo en español

Genera 3 enfoques:
1. Informativo y directo
2. Inspiracional 
3. Práctico con beneficios

Responde solo con JSON válido:
{
  "variations": [
    {
      "title": "Título directo 1",
      "description": "Descripción práctica completa de 420-450 caracteres..."
    },
    {
      "title": "Título emocional 2", 
      "description": "Descripción emocional completa de 420-450 caracteres..."
    },
    {
      "title": "Título urgente 3",
      "description": "Descripción urgente completa de 420-450 caracteres..."
    }
  ]
}`;

    console.log('Generating Pinterest text variations...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Eres un experto en Pinterest marketing. Crea contenido DIVERSO y ÚNICO. Responde SOLO con JSON válido.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content.trim();
    
    console.log('Raw OpenAI response:', generatedContent);

    // Parse JSON response
    let textVariations;
    try {
      textVariations = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      // Fallback variations
      // Fallbacks diversos y únicos
      const baseTitle = optimizeTitle(sourceTitle);
      const shortDesc = sourceDescription.substring(0, 150);
      
      textVariations = {
        variations: [
          {
            title: baseTitle,
            description: `Toda la información sobre ${shortDesc}. Descubre detalles importantes y consejos útiles. Contenido actualizado y verificado. Explora más sobre este tema interesante y aprovecha al máximo la información disponible. ¡Haz clic para saber más!`
          },
          {
            title: optimizeTitle("Aprende Más"),
            description: `Transforma tu conocimiento con ${shortDesc}. Guía práctica con estrategias efectivas. Información valiosa que marcará la diferencia. Obtén resultados reales siguiendo estos consejos. ¡Empieza tu transformación hoy mismo!`
          },
          {
            title: optimizeTitle("Tips Exclusivos"),
            description: `Técnicas probadas para ${shortDesc}. Métodos que realmente funcionan y dan resultados. Información privilegiada al alcance de todos. Mejora tus habilidades con estos consejos especializados. ¡Accede al contenido completo!`
          }
        ]
      };
    }

    // Validación final de calidad
    textVariations.variations = textVariations.variations.map(variation => ({
      ...variation,
      title: optimizeTitle(variation.title)
    }));

    console.log('Generated and optimized text variations:', textVariations);

    return new Response(
      JSON.stringify({ data: textVariations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-pin-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});