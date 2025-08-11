
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
      imageStylePrompt,
      noTextOverlay = false
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

    console.log(`Starting pin generation process for: ${url ? `URL: ${url}` : 'custom content'} (userId: ${userId}, noTextOverlay: ${noTextOverlay})`);

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

    // Step 3: Generate exactly ONE image for each text variation (total: 3 images)
    console.log('Step 3: Generating pin images...');
    const imagePromises = textVariations.map(async (variation: any, index: number) => {
      try {
        console.log(`Generating image ${index + 1}/3 for variation: ${variation.title}`);
        
        // Detect theme from user inputs to enforce visual divergence
        const detectionText = `${variation.title} ${variation.description} ${customContent || ''} ${specializedPrompt || ''}`.toLowerCase();
        const isKids = /(niñ|hija|hijo|kid|kids|infantil|beb[eé]s?|nursery|cuna|juguet|princesa)/i.test(detectionText);
        const isPregnancy = /(embarazada|maternidad|novia embarazada|pareja embarazada)/i.test(detectionText);

        // Composition presets to guarantee different camera angles per variation
        const compositionPresets = [
          'wide-angle bedroom shot, bed centered, symmetrical composition, natural window light',
          'corner perspective from doorway, strong depth, bedside table and lamp visible, plants near window',
          'close-up on headboard and bedding textures, shallow depth of field, styled pillows in foreground',
          'reading nook with armchair and floor lamp, partial view of bed, cozy corner composition',
          'from foot of bed looking toward headboard and wall art, balanced framing'
        ];

        // Theme palettes depending on detection
        const kidsPalettes = [
          'children bedroom, pastel palette (mint, peach, soft pink), wall decals, canopy, star lights, rounded safe furniture, Montessori-inspired, toys neatly arranged, whimsical details, child-friendly proportions',
          'kids room theme, soft colors, fun shapes, bunting garland, animal prints, storage cubes, plush rug'
        ];
        const adultPregnancyPalettes = [
          'serene adult master bedroom for pregnancy, warm neutrals (beige, sand, terracotta), cozy textures (linen, wool), minimal clutter, eucalyptus branches, calm lighting',
          'modern cozy master bedroom, earthy palette, natural wood, soft lighting, elegant and soothing'
        ];

        const themePrompt = isKids
          ? kidsPalettes[index % kidsPalettes.length]
          : isPregnancy
            ? adultPregnancyPalettes[index % adultPregnancyPalettes.length]
            : '';

        const negativePrompt = isKids
          ? 'avoid romantic adult styling, no candles on bedside, no bar carts, no alcohol, no provocative elements'
          : isPregnancy
            ? 'avoid childish toys, no cartoon decals, no kids motifs'
            : '';

        const compositionPrompt = compositionPresets[index % compositionPresets.length];

        // Compose a per-variation image style prompt (base + theme + composition + negatives)
        const perVariationStylePrompt = [
          imageStylePrompt,
          themePrompt,
          compositionPrompt,
          negativePrompt
        ].filter(Boolean).join(', ');
        
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
            // Generate different style label per pin
            const styleVariations = [
              'estilo-especializado-1',
              'tendencia-pinterest-2', 
              'personalizado-optimizado-3'
            ];
            styleName = styleVariations[index] || 'personalizado-unico';
          }
        }

        console.log('Per-variation style prompt:', perVariationStylePrompt);

        const imageResponse = await supabase.functions.invoke('generate-pin-image', {
          body: {
            title: variation.title,
            description: variation.description,
            style: styleName,
            url: url || null,
            imageStylePrompt: perVariationStylePrompt,
            noTextOverlay
          }
        });

        if (imageResponse.error) {
          console.error(`Image generation failed for variation ${index + 1}:`, imageResponse.error);
          return null;
        }

        // The updated generate-pin-image now returns exactly 1 image
        const imageData = imageResponse.data.data.images[0];
        
        if (!imageData) {
          console.error(`No image generated for variation ${index + 1}`);
          return null;
        }

        // Create pin record in database
        const pinData = {
          user_id: userId,
          url: url || 'custom-content',
          title: variation.title,
          description: variation.description,
          image_url: imageData.imageUrl,
          image_prompt: `Generated with ${imageData.model || 'AI'}${noTextOverlay ? ' (no text overlay)' : ''}`,
          template_style: styleName,
          status: 'completed'
        };

        const { data: pin, error: pinError } = await supabase
          .from('pins')
          .insert(pinData)
          .select()
          .single();

        if (pinError) {
          console.error('Error saving pin to database:', pinError);
          return null;
        }

        console.log(`Successfully generated pin ${index + 1}/3 with ${imageData.model}${noTextOverlay ? ' (no text overlay)' : ''}`);

        return {
          title: variation.title,
          description: variation.description,
          imageUrl: imageData.imageUrl,
          style: styleName,
          pinId: pin?.id,
          model: imageData.model || 'unknown'
        };

      } catch (error) {
        console.error(`Error processing variation ${index + 1}:`, error);
        return null;
      }
    });

    const results = await Promise.allSettled(imagePromises);
    const successfulPins = results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => (result as PromiseFulfilledResult<any>).value);

    if (successfulPins.length === 0) {
      throw new Error('Failed to generate any pins');
    }

    console.log(`Pin generation completed: ${successfulPins.length} pins created${noTextOverlay ? ' (no text overlay)' : ''}`);

    return new Response(
      JSON.stringify({ 
        data: {
          pins: successfulPins,
          urlAnalysis,
          count: successfulPins.length
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
