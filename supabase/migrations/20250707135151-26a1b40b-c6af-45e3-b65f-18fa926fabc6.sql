-- Create tables for PinCraft Pin Generator MVP

-- Table to store generated pins
CREATE TABLE public.pins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_prompt TEXT,
  template_style TEXT,
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'completed', 'error')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to cache URL analysis results
CREATE TABLE public.url_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  meta_keywords TEXT[],
  content_summary TEXT,
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days')
);

-- Enable Row Level Security
ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.url_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pins table
CREATE POLICY "Users can view their own pins" 
ON public.pins 
FOR SELECT 
USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can create pins" 
ON public.pins 
FOR INSERT 
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can update their own pins" 
ON public.pins 
FOR UPDATE 
USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can delete their own pins" 
ON public.pins 
FOR DELETE 
USING (user_id IS NULL OR auth.uid() = user_id);

-- RLS Policies for url_analysis table (public read, system write)
CREATE POLICY "Anyone can read URL analysis" 
ON public.url_analysis 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage URL analysis" 
ON public.url_analysis 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pins_updated_at
  BEFORE UPDATE ON public.pins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_pins_user_id ON public.pins(user_id);
CREATE INDEX idx_pins_created_at ON public.pins(created_at DESC);
CREATE INDEX idx_url_analysis_url ON public.url_analysis(url);
CREATE INDEX idx_url_analysis_expires_at ON public.url_analysis(expires_at);

-- Create storage bucket for pin images
INSERT INTO storage.buckets (id, name, public) VALUES ('pin-images', 'pin-images', true);

-- Create policies for pin images storage
CREATE POLICY "Pin images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pin-images');

CREATE POLICY "Users can upload pin images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pin-images');

CREATE POLICY "Users can update pin images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'pin-images');

CREATE POLICY "Users can delete pin images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'pin-images');