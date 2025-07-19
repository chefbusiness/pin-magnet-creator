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
    const { url, customContent, nicheId, specializedPrompt, imageStylePrompt, userId } = await req.json();
    
    if (!url && !customContent) {
      return new Response(
        JSON.stringify({ error: 'URL or custom content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting pin generation process for: ${url ? `URL: ${url}` : 'Custom content'} (userId: ${userId})`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Analyze URL or use custom content
    console.log(url ? 'Step 1: Analyzing URL...' : 'Step 1: Processing custom content...');
    
    let urlAnalysis;
    if (url) {
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-url', {
        body: { url }
      });

      if (analysisError) {
        throw new Error(`URL analysis failed: ${analysisError.message}`);
      }

      urlAnalysis = analysisData;
      console.log('URL analysis completed:', urlAnalysis.title);
    } else {
      // For custom content, create a mock analysis
      urlAnalysis = {
        title: 'Contenido Personalizado',
        description: customContent,
        content: customContent,
        url: null
      };
      console.log('Custom content processed');
    }

    // Step 2: Generate text variations
    console.log('Step 2: Generating text variations...');
    
    const { data: textData, error: textError } = await supabase.functions.invoke('generate-pin-text', {
      body: { 
        title: urlAnalysis.title, 
        description: urlAnalysis.description || urlAnalysis.content || customContent,
        url: url,
        nicheId: nicheId,
        specializedPrompt: specializedPrompt
      }
    });

    if (textError) {
      throw new Error(`Text generation failed: ${textError.message}`);
    }

    console.log('Text variations generated:', textData.variations.length);

    // Step 3: Generate pin images with variations
    console.log('Step 3: Generating pin images...');
    
    const pins = [];
    const styles = ['profesional-elegante', 'moderno-llamativo', 'aesthetic-tendencia'];
    
    for (let i = 0; i < textData.variations.length && i < 3; i++) {
      const variation = textData.variations[i];
      const style = styles[i % styles.length];
      
      console.log(`Generating image ${i + 1}/3 for variation: ${variation.title}`);
      
      try {
        const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-pin-image', {
          body: {
            title: variation.title,
            description: variation.description,
            style: style,
            url: url,
            imageStylePrompt: imageStylePrompt,
            pinIndex: i // Pass the index for visual variation
          }
        });

        if (imageError) {
          console.error(`Failed to generate image ${i + 1}:`, imageError);
          continue;
        }

        if (imageData?.data?.images?.[0]) {
          pins.push({
            title: variation.title,
            description: variation.description,
            imageUrl: imageData.data.images[0].imageUrl,
            style: style,
            pinId: `pin-${Date.now()}-${i}`
          });
          
          const modelUsed = imageData.data.images[0].model || 'unknown';
          const variationInfo = imageData.data.images[0].variation || `Pin ${i + 1}`;
          console.log(`Successfully generated pin ${i + 1}/3 with ${modelUsed} - ${variationInfo}`);
        }
      } catch (error) {
        console.error(`Error generating pin ${i + 1}:`, error);
        continue;
      }
    }

    if (pins.length === 0) {
      throw new Error('Failed to generate any pins');
    }

    console.log(`Pin generation completed: ${pins.length} pins created`);

    // Return the generated pins
    return new Response(
      JSON.stringify({
        data: {
          pins: pins,
          urlAnalysis: urlAnalysis,
          count: pins.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-pin-generation function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for detailed error information'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
