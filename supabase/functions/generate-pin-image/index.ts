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

    // Validación de título para mejor calidad en español
    const validateTitle = (title: string): string => {
      if (title.length > 45) {
        console.warn(`Title too long (${title.length} chars): ${title}`);
        return title.substring(0, 42) + '...';
      }
      return title;
    };

    const validatedTitle = validateTitle(title);

    // Create Pinterest-optimized prompt for Ideogram with Spanish optimization
    const stylePrompts = {
      modern: 'clean modern typography, minimalist design, professional layout, Spanish-friendly fonts',
      creative: 'artistic typography, creative visual elements, vibrant colors, readable Spanish text',
      elegant: 'elegant serif fonts, sophisticated layout, luxury aesthetic, Spanish character support',
      bold: 'bold typography, high contrast, eye-catching design, clear Spanish readability',
      lifestyle: 'lifestyle photography style, warm colors, instagram aesthetic, Spanish text optimized'
    };

    const selectedStyle = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.modern;
    
    const prompt = `Create a professional Pinterest pin image (736x1104 aspect ratio) with clear, readable Spanish text:

TÍTULO PRINCIPAL: "${validatedTitle}"
${description ? `DESCRIPCIÓN: "${description.substring(0, 120)}"` : ''}
DOMINIO: "${domain}" (DEBE aparecer en el pie de la imagen)

REQUISITOS CRÍTICOS PARA TEXTO EN ESPAÑOL:
- Usar fuentes que soporten caracteres españoles (ñ, á, é, í, ó, ú)
- Texto debe ser perfectamente legible en móvil
- Alto contraste entre texto y fondo
- Evitar fondos complejos que interfieran con la lectura
- Espaciado adecuado para palabras en español
- Tamaño de fuente apropiado para títulos cortos

DOMINIO EN EL PIE (CRÍTICO):
- El dominio "${domain}" DEBE aparecer en la esquina inferior derecha
- Texto súper legible con fondo semitransparente si es necesario
- Color contrastante (blanco sobre oscuro o negro sobre claro)
- Tamaño legible pero no dominante
- Estilo profesional y limpio

JERARQUÍA VISUAL:
1. Título principal (más prominente)
2. Descripción (tamaño medio)
3. Dominio en pie (pequeño pero súper legible)

Estilo visual:
- ${selectedStyle}
- Formato Pinterest vertical (736x1104)
- Tipografía profesional y limpia
- Paleta de colores moderna con excelente contraste
- Fondo atractivo pero simple
- Optimizado para audiencia hispana

El título debe aparecer exactamente como se proporciona, sin modificaciones.`;

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