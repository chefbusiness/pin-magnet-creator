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
    const { url, userId = null } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('Starting pin generation process for:', url);

    // Step 1: Analyze URL
    console.log('Step 1: Analyzing URL...');
    const analyzeResponse = await supabase.functions.invoke('analyze-url', {
      body: { url }
    });

    if (analyzeResponse.error) {
      throw new Error(`URL analysis failed: ${analyzeResponse.error.message}`);
    }

    const urlAnalysis = analyzeResponse.data.data;
    console.log('URL analysis completed:', urlAnalysis.title);

    // Step 2: Generate text variations
    console.log('Step 2: Generating text variations...');
    const textResponse = await supabase.functions.invoke('generate-pin-text', {
      body: { urlAnalysis }
    });

    if (textResponse.error) {
      throw new Error(`Text generation failed: ${textResponse.error.message}`);
    }

    const textVariations = textResponse.data.data.variations;
    console.log('Text variations generated:', textVariations.length);
    console.log('Text variation titles:', textVariations.map(v => v.title));
    
    // Validar que las variaciones son diferentes
    const titles = textVariations.map(v => v.title);
    const uniqueTitles = new Set(titles);
    if (uniqueTitles.size < titles.length) {
      console.warn('WARNING: Some text variations are identical!');
    }

    // Extract domain from URL for branding
    const domain = new URL(url).hostname.replace('www.', '');
    console.log('Extracted domain for branding:', domain);

    // Step 3: Generate images for each text variation
    console.log('Step 3: Generating pin images...');
    const imagePromises = textVariations.map(async (variation: any, index: number) => {
      try {
        const imageResponse = await supabase.functions.invoke('generate-pin-image', {
          body: {
            title: variation.title,
            description: variation.description,
            domain: domain,
            style: ['modern', 'creative', 'elegant'][index] || 'modern'
          }
        });

        if (imageResponse.error) {
          console.error(`Image generation failed for variation ${index}:`, imageResponse.error);
          return null;
        }

        // Create pin record in database
        const pinData = {
          user_id: userId,
          url: url,
          title: variation.title,
          description: variation.description,
          image_url: imageResponse.data.data.imageUrl,
          image_prompt: imageResponse.data.data.prompt,
          template_style: ['modern', 'creative', 'elegant'][index] || 'modern',
          status: 'completed'
        };

        const { data: pin, error: pinError } = await supabase
          .from('pins')
          .insert(pinData)
          .select()
          .single();

        if (pinError) {
          console.error('Error saving pin to database:', pinError);
        }

        return {
          ...variation,
          imageUrl: imageResponse.data.data.imageUrl,
          style: ['modern', 'creative', 'elegant'][index] || 'modern',
          pinId: pin?.id
        };
      } catch (error) {
        console.error(`Error processing variation ${index}:`, error);
        return null;
      }
    });

    const results = await Promise.allSettled(imagePromises);
    const pins = results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => (result as PromiseFulfilledResult<any>).value);

    if (pins.length === 0) {
      throw new Error('Failed to generate any pins');
    }

    console.log(`Pin generation completed: ${pins.length} pins created`);

    return new Response(
      JSON.stringify({ 
        data: {
          pins,
          urlAnalysis,
          count: pins.length
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