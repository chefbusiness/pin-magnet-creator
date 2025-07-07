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

    // Optimización inteligente de títulos para Ideogram - MÁS AGRESIVA
    const optimizeTitle = (title: string): string => {
      // Límite MÁS estricto para evitar errores tipográficos
      const MAX_LENGTH = 35;
      
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

    const prompt = `Crea 3 variaciones COMPLETAMENTE DIFERENTES de texto para pines de Pinterest. Cada una debe ser ÚNICA y diferente de las otras.

Contenido base:
Título: "${sourceTitle}"
Descripción: "${sourceDescription}"

REGLAS CRÍTICAS:
- Cada variación debe tener un ENFOQUE DIFERENTE
- Títulos máximo 35 caracteres (súper importante)
- Solo palabras simples en español, sin tildes complicadas
- Evita símbolos especiales (comillas raras, guiones largos)
- Cada descripción debe ser 420-450 caracteres EXACTOS

VARIACIÓN 1: Enfoque directo y práctico
VARIACIÓN 2: Enfoque emocional y aspiracional  
VARIACIÓN 3: Enfoque urgente y exclusivo

Cada variación debe:
- Título corto y directo (máximo 35 caracteres)
- Descripción completa (420-450 caracteres)
- Incluir call-to-action
- Ser COMPLETAMENTE diferente a las otras

JSON válido solamente:
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
        temperature: 0.95,
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
      // Fallbacks DIVERSOS con títulos súper cortos
      const baseTitle = optimizeTitle(sourceTitle);
      const desc = sourceDescription.substring(0, 250);
      
      textVariations = {
        variations: [
          {
            title: baseTitle,
            description: `Descubre ${desc}. Información completa y actualizada que necesitas conocer. Click para ver todos los detalles y aprovechar esta oportunidad única. No te lo pierdas, contenido valioso te espera. Guía práctica con consejos efectivos. ¡Empieza ahora!`
          },
          {
            title: optimizeTitle("Guía Completa"),
            description: `Todo sobre ${desc}. Consejos profesionales que funcionan de verdad. Transforma tu perspectiva con esta información exclusiva. Estrategias probadas para conseguir resultados. Contenido premium al alcance de un click. ¡Aprovecha ya!`
          },
          {
            title: optimizeTitle("Secretos Revelados"),
            description: `Secretos de ${desc}. Técnicas avanzadas que pocos conocen. Información privilegiada para destacar del resto. Métodos eficaces para obtener mejores resultados. Click para acceder al contenido completo. ¡Oportunidad limitada!`
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