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
    const { urlAnalysis, specializedPrompt, nicheId } = await req.json();
    
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

    let basePrompt = `Como experto en Pinterest marketing, crea 3 variaciones de texto optimizado para pines de Pinterest basado en este contenido:

Título original: "${sourceTitle}"
Descripción: "${sourceDescription}"

Requisitos para cada variación:
- Título llamativo de máximo 100 caracteres
- Descripción persuasiva de máximo 400 caracteres
- Usar palabras clave relevantes para SEO
- Incluir call-to-action atractivo
- Tone emocional que genere engagement
- Adaptar para audiencia hispana`;

    // Add specialized prompt if provided
    if (specializedPrompt) {
      basePrompt += `\n\nIMPORTANTE - ESPECIALIZACIÓN: ${specializedPrompt}`;
    }

    const prompt = basePrompt + `

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
    if (specializedPrompt) {
      console.log('Using specialized prompt for niche:', nicheId);
    }

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
      textVariations = {
        variations: [
          {
            title: sourceTitle.substring(0, 100),
            description: `Descubre ${sourceDescription.substring(0, 300)}... ¡No te lo pierdas!`
          },
          {
            title: `✨ ${sourceTitle.substring(0, 95)}`,
            description: `${sourceDescription.substring(0, 350)} 💫 ¡Click para saber más!`
          },
          {
            title: `🔥 ${sourceTitle.substring(0, 95)}`,
            description: `Todo lo que necesitas saber: ${sourceDescription.substring(0, 320)} ⬇️`
          }
        ]
      };
    }

    console.log('Generated text variations:', textVariations);

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