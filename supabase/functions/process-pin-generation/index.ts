
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
    const { 
      url, 
      customContent, 
      userId = null, 
      nicheId,
      specializedPrompt,
      imageStylePrompt 
    } = await req.json();
    
    if (!url && !customContent) {
      return new Response(
        JSON.stringify({ error: 'URL or custom content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Starting pin generation process for: ${url ? `URL: ${url}` : 'custom content'} (userId: ${userId})`);

    let urlAnalysis;

    if (url) {
      // Step 1: Analyze URL
      console.log('Step 1: Analyzing URL...');
      const analyzeResponse = await supabase.functions.invoke('analyze-url', {
        body: { url }
      });

      if (analyzeResponse.error) {
        throw new Error(`URL analysis failed: ${analyzeResponse.error.message}`);
      }

      urlAnalysis = analyzeResponse.data.data;
      console.log('URL analysis completed:', urlAnalysis.title);
    } else {
      // Create analysis object from custom content
      urlAnalysis = {
        title: 'Contenido Personalizado',
        description: customContent.substring(0, 150) + '...',
        content_summary: customContent,
        url: null
      };
      console.log('Using custom content for generation');
    }

    // Step 2: Generate text variations with specialized prompts
    console.log('Step 2: Generating text variations...');
    const textResponse = await supabase.functions.invoke('generate-pin-text', {
      body: { 
        urlAnalysis,
        specializedPrompt,
        nicheId
      }
    });

    if (textResponse.error) {
      throw new Error(`Text generation failed: ${textResponse.error.message}`);
    }

    const textVariations = textResponse.data.data.variations;
    console.log('Text variations generated:', textVariations.length);

    // Step 3: Generate images for each text variation with user-selected styles
    console.log('Step 3: Generating pin images...');
    const imagePromises = textVariations.map(async (variation: any, index: number) => {
      try {
        // Generate style names based on imageStylePrompt content and user selection
        let styleName = 'personalizado';
        
        if (imageStylePrompt) {
          // Extract meaningful style indicators from the prompt
          if (imageStylePrompt.includes('plant-filled') || imageStylePrompt.includes('botanical')) {
            styleName = 'botanico-plantas';
          } else if (imageStylePrompt.includes('scandinavian') || imageStylePrompt.includes('nordic')) {
            styleName = 'escandinavo-nordico';
          } else if (imageStylePrompt.includes('bohemian') || imageStylePrompt.includes('boho')) {
            styleName = 'bohemio-ethnic';
          } else if (imageStylePrompt.includes('industrial')) {
            styleName = 'industrial-moderno';
          } else if (imageStylePrompt.includes('vintage') || imageStylePrompt.includes('retro')) {
            styleName = 'vintage-retro';
          } else if (imageStylePrompt.includes('aesthetic') || imageStylePrompt.includes('cozy')) {
            styleName = 'aesthetic-acogedor';
          } else if (imageStylePrompt.includes('minimalist') || imageStylePrompt.includes('minimal')) {
            styleName = 'minimalista-limpio';
          } else if (imageStylePrompt.includes('rustic') || imageStylePrompt.includes('farmhouse')) {
            styleName = 'rustico-campestre';
          } else {
            // Generate different style variations for each pin
            const styleVariations = [
              'estilo-especializado-1',
              'tendencia-pinterest-2', 
              'personalizado-optimizado-3'
            ];
            styleName = styleVariations[index] || 'personalizado-unico';
          }
        }

        const imageResponse = await supabase.functions.invoke('generate-pin-image', {
          body: {
            title: variation.title,
            description: variation.description,
            style: styleName,
            url: url || null,
            imageStylePrompt
          }
        });

        if (imageResponse.error) {
          console.error(`Image generation failed for variation ${index}:`, imageResponse.error);
          return null;
        }

        // Handle multiple images response from generate-pin-image
        const images = imageResponse.data.data.images || [];
        
        if (images.length === 0) {
          console.error(`No images generated for variation ${index}`);
          return null;
        }

        // Create pins for each generated image
        const pinsForVariation = [];
        
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const pinStyleName = `${styleName}-v${i + 1}`;
          
          // Create pin record in database
          const pinData = {
            user_id: userId,
            url: url || 'custom-content',
            title: variation.title,
            description: variation.description,
            image_url: image.imageUrl,
            image_prompt: `Generated with ${image.model || 'AI'}`,
            template_style: pinStyleName,
            status: 'completed'
          };

          const { data: pin, error: pinError } = await supabase
            .from('pins')
            .insert(pinData)
            .select()
            .single();

          if (pinError) {
            console.error('Error saving pin to database:', pinError);
            continue;
          }

          pinsForVariation.push({
            title: variation.title,
            description: variation.description,
            imageUrl: image.imageUrl,
            style: pinStyleName,
            pinId: pin?.id,
            model: image.model || 'unknown'
          });
        }

        return pinsForVariation;
      } catch (error) {
        console.error(`Error processing variation ${index}:`, error);
        return null;
      }
    });

    const results = await Promise.allSettled(imagePromises);
    const allPins = results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => (result as PromiseFulfilledResult<any>).value)
      .flat(); // Flatten the array since each variation now returns multiple pins

    if (allPins.length === 0) {
      throw new Error('Failed to generate any pins');
    }

    console.log(`Pin generation completed: ${allPins.length} pins created`);

    return new Response(
      JSON.stringify({ 
        data: {
          pins: allPins,
          urlAnalysis,
          count: allPins.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-pin-generation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
