
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
    const { title, description, style, url, imageStylePrompt } = await req.json();
    
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

    // Enhanced prompt for Pinterest pin generation with mandatory text overlay
    let basePrompt = `Create a Pinterest pin image (736x1104 pixels, vertical format) with the following specifications:

MAIN CONTENT: "${title}"
CONTEXT: "${description}"

VISUAL REQUIREMENTS:
- High-quality, Pinterest-optimized design
- Vertical aspect ratio (736x1104)
- Eye-catching and shareable
- Professional photography or illustration style`;

    // Add specialized image style if provided
    if (imageStylePrompt) {
      basePrompt += `\nSTYLE SPECIFICATION: ${imageStylePrompt}`;
    }

    // MANDATORY text overlay instructions - more specific and forceful
    basePrompt += `\n\nMANDATORY TEXT OVERLAY REQUIREMENTS (CRITICAL):
- YOU MUST add visible text overlay with the title: "${title}"
- The text MUST be clearly readable and professionally styled
- Position text in upper third, lower third, or corner - NEVER in center blocking main subject
- Use elegant, Pinterest-style typography with high contrast
- Text should occupy 20-35% of image height maximum
- Add subtle semi-transparent background behind text (blur, shadow, or colored overlay)
- Text color must contrast sharply with background (white text on dark overlay, or dark text on light overlay)  
- Use modern sans-serif or serif fonts typical of Pinterest pins
- Text must be large enough to read on mobile devices
- EXAMPLE STYLES: White bold text with dark semi-transparent background, or dark text with light semi-transparent background
- The background image must remain the primary visual focus
- Text overlay is MANDATORY - do not create pin without visible text

IMPORTANT: This is a Pinterest pin, so text overlay is ESSENTIAL for engagement. Do not generate without clear, readable text overlay.`;

    basePrompt += `\n\nFINAL OUTPUT: Pinterest pin with mandatory text overlay, ready for publishing, optimized for engagement and clicks`;

    console.log('Generating Pinterest pin with enhanced text overlay prompt:', basePrompt);

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "da0feef18eddd6df0a5b39bf552a77e5b2e04f7bdc3b47fb96e6f98f2b6b0e45",
        input: {
          prompt: basePrompt,
          model: "ideogram-ai/ideogram-v3-turbo",
          width: 736,
          height: 1104,
          output_format: "png",
          output_quality: 95,
          num_inference_steps: 20
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.status}`);
    }

    const prediction = await response.json();
    console.log('Replicate prediction created:', prediction.id);

    // Poll for completion
    let result = prediction;
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          'Authorization': `Token ${replicateApiKey}`,
        },
      });
      
      result = await pollResponse.json();
      console.log('Polling result:', result.status);
    }

    if (result.status === 'failed') {
      throw new Error(`Image generation failed: ${result.error}`);
    }

    if (!result.output || result.output.length === 0) {
      throw new Error('No image generated');
    }

    const replicateImageUrl = result.output[0];
    console.log('Generated image URL from Replicate:', replicateImageUrl);

    // Download image from Replicate and upload to Supabase
    console.log('Downloading image from Replicate...');
    const imageResponse = await fetch(replicateImageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileName = `pin-${timestamp}-${randomId}.png`;
    
    console.log('Uploading image to Supabase Storage:', fileName);
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pin-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600'
      });
    
    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(`Failed to upload to Supabase: ${uploadError.message}`);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('pin-images')
      .getPublicUrl(fileName);
    
    console.log('Image uploaded successfully. Public URL:', publicUrl);

    return new Response(
      JSON.stringify({ 
        data: {
          imageUrl: publicUrl,
          prompt: basePrompt,
          fileName: fileName
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
