
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
    const { title, description, style, url, imageStylePrompt, noTextOverlay = false } = await req.json();
    
    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: 'Title and description are required' }),
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Extract domain from URL if provided
    let websiteDomain = '';
    if (url) {
      try {
        const urlObj = new URL(url);
        websiteDomain = urlObj.hostname.replace('www.', '');
      } catch (error) {
        console.log('Could not extract domain from URL:', url);
      }
    }

    // Optimize title length for better visual balance
    let displayTitle = title;
    if (title.length > 60) {
      const words = title.split(' ');
      if (words.length > 10) {
        displayTitle = words.slice(0, 10).join(' ') + '...';
      }
    }

    // Build prompt based on noTextOverlay setting
    let basePrompt;
    
    if (noTextOverlay) {
      // NO TEXT OVERLAY VERSION - Clean image with optional domain at bottom
      basePrompt = `High-end Pinterest vertical photo (9:16). Background: interior design bedroom photography. ${imageStylePrompt || 'interior design photography'}. Ultra-detailed, realistic materials and textures, professional lighting, soft natural light, global illumination, cinematic color grading, clean composition. Avoid watermarks, logos, distorted or blurry text, deformed hands/faces, artifacts.`;
      if (websiteDomain) {
        basePrompt += ` Subtly show \"${websiteDomain}\" at bottom corner.`;
      }
    } else {
      // WITH TEXT OVERLAY - Ask the model to render the exact title text visibly
      basePrompt = `High-end Pinterest vertical composition (9:16). Background: interior design bedroom photo. ${imageStylePrompt || 'interior design photography'}. Include the exact headline text at the top: \"${displayTitle}\". Use large, bold, clean sans-serif typography, high contrast over the background, center-aligned, safe margins, crisp and legible on mobile. Do not paraphrase, do not misspell, do not add extra quotes. ${websiteDomain ? `Add \"${websiteDomain}\" very small and subtle at the bottom.` : ''} Ultra-detailed, realistic textures, professional lighting, soft natural light, clean layout. Avoid illegible text, watermarks, logos.`; 
    }

    console.log('=== GENERATING IMAGE WITH IDEOGRAM V3-TURBO ===');
    console.log(`Mode: ${noTextOverlay ? 'NO TEXT OVERLAY' : 'WITH TEXT OVERLAY'}`);
    console.log('Prompt:', basePrompt);

    try {
      // Generate image with Ideogram v3-turbo with proper input wrapper
      const requestBody = {
        input: {
          prompt: basePrompt,
          aspect_ratio: "9:16",
          style_type: noTextOverlay ? "None" : "Typography",
          resolution: "High",
          magic_prompt_option: noTextOverlay ? "Auto" : "Disabled"
        }
      };

      console.log('Ideogram request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://api.replicate.com/v1/models/ideogram-ai/ideogram-v3-turbo/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${replicateApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Ideogram response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ideogram API error:', response.status, errorText);
        throw new Error(`Ideogram API error: ${response.status} - ${errorText}`);
      }

      const prediction = await response.json();
      console.log('Ideogram prediction created:', prediction.id);

      // Poll for completion
      let result = prediction;
      let pollCount = 0;
      const maxPolls = 60;
      
      while (result.status === 'starting' || result.status === 'processing') {
        if (pollCount >= maxPolls) {
          throw new Error('Ideogram generation timeout after 60 seconds');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
          headers: { 'Authorization': `Token ${replicateApiKey}` },
        });
        
        if (!pollResponse.ok) {
          throw new Error(`Polling error: ${pollResponse.status}`);
        }
        
        result = await pollResponse.json();
        console.log('Ideogram status:', result.status);
        pollCount++;
      }

      if (result.status === 'failed') {
        console.error('Ideogram generation failed:', result.error);
        throw new Error(`Ideogram generation failed: ${result.error || 'Unknown error'}`);
      }

      if (!result.output) {
        console.error('Ideogram no valid output:', result);
        throw new Error('No image generated by Ideogram - empty output');
      }

      const ideogramImageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
      console.log('Ideogram generated URL:', ideogramImageUrl);

      // Download and upload to Supabase
      const imageResponse = await fetch(ideogramImageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download Ideogram image: ${imageResponse.status}`);
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `pin-ideogram-${timestamp}-${randomId}.png`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pin-images')
        .upload(fileName, imageBlob, {
          contentType: 'image/png',
          cacheControl: '3600'
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Failed to upload: ${uploadError.message}`);
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('pin-images')
        .getPublicUrl(fileName);
      
      console.log('=== IDEOGRAM SUCCESS ===');
      console.log('Final URL:', publicUrl);

      return new Response(
        JSON.stringify({ 
          data: {
            images: [{
              imageUrl: publicUrl,
              fileName: fileName,
              model: 'ideogram-v3-turbo'
            }],
            totalGenerated: 1
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (ideogramError) {
      console.error('=== IDEOGRAM ERROR (NO FALLBACK) ===');
      console.error('Ideogram error:', (ideogramError as any).message || ideogramError);
      throw ideogramError;
    }

  } catch (error) {
    console.error('=== FINAL ERROR ===');
    console.error('Error in generate-pin-image function:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for detailed error information'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
