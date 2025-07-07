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

    // Optimización inteligente de títulos para Ideogram
    const optimizeTitle = (title: string): string => {
      // Límite estricto para mejor calidad en Ideogram
      const MAX_LENGTH = 45;
      
      if (title.length <= MAX_LENGTH) return title;
      
      // Truncate inteligente en palabras completas
      const words = title.split(' ');
      let optimized = '';
      
      for (const word of words) {
        if ((optimized + word).length <= MAX_LENGTH) {
          optimized += (optimized ? ' ' : '') + word;
        } else {
          break;
        }
      }
      
      return optimized || title.substring(0, MAX_LENGTH).trim();
    };

    const optimizedTitle = optimizeTitle(sourceTitle);

    const prompt = `Como experto en Pinterest marketing especializado en español, crea 3 variaciones de texto optimizado para pines de Pinterest basado en este contenido:

Título original: "${sourceTitle}"
Descripción: "${sourceDescription}"

IMPORTANTE - Requisitos específicos para generación de imágenes:
- Títulos MÁXIMO 45 caracteres (crítico para calidad visual)
- Usar palabras simples y directas en español
- Evitar palabras muy largas o complejas
- Priorizar claridad sobre originalidad
- NO usar símbolos especiales o caracteres complicados

Requisitos para cada variación:
- Título llamativo y CONCISO (máximo 45 caracteres)
- Descripción persuasiva de máximo 400 caracteres
- Usar palabras clave relevantes para SEO
- Incluir call-to-action atractivo
- Tono emocional que genere engagement
- Optimizado para audiencia hispana
- Palabras fáciles de renderizar visualmente

Responde SOLO con un JSON válido en este formato:
{
  "variations": [
    {
      "title": "Título optimizado 1",
      "description": "Descripción persuasiva con CTA 1"
    },
    {
      "title": "Título optimizado 2", 
      "description": "Descripción persuasiva con CTA 2"
    },
    {
      "title": "Título optimizado 3",
      "description": "Descripción persuasiva con CTA 3"
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
            content: 'Eres un experto en marketing de Pinterest. Siempre respondes con JSON válido sin texto adicional.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1000,
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
      // Fallback optimizado con títulos cortos
      const optimizedFallbackTitle = optimizeTitle(sourceTitle);
      textVariations = {
        variations: [
          {
            title: optimizedFallbackTitle,
            description: `Descubre ${sourceDescription.substring(0, 300)}... ¡No te lo pierdas!`
          },
          {
            title: optimizeTitle(`✨ ${sourceTitle}`),
            description: `${sourceDescription.substring(0, 350)} 💫 ¡Click para saber más!`
          },
          {
            title: optimizeTitle(`🔥 ${sourceTitle}`),
            description: `Todo lo que necesitas saber: ${sourceDescription.substring(0, 320)} ⬇️`
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