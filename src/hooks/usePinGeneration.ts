
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PinResult {
  title: string;
  description: string;
  imageUrl: string;
  style: string;
  pinId?: string;
}

export interface GenerationResult {
  pins: PinResult[];
  urlAnalysis: any;
  count: number;
}

export const usePinGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [generatedPins, setGeneratedPins] = useState<PinResult[]>([]);
  const { toast } = useToast();

  const generatePins = async (params: { 
    url?: string; 
    customContent?: string; 
    nicheId?: string; 
    specializedPrompt?: string; 
    imageStylePrompt?: string; 
    noTextOverlay?: boolean;
  }, user?: any): Promise<GenerationResult | null> => {
    if (!params.url && !params.customContent) {
      toast({
        title: "Error",
        description: "Por favor ingresa una URL o contenido personalizado",
        variant: "destructive",
      });
      return null;
    }

    // Require authentication for all pin generation
    if (!user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para generar pines de Pinterest",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    setProgress('Iniciando generación...');

    try {
      // Validate URL format if URL is provided
      if (params.url) {
        try {
          new URL(params.url);
        } catch {
          throw new Error('Por favor ingresa una URL válida (ej: https://ejemplo.com)');
        }
      }

      setProgress(params.url ? 'Analizando contenido de la URL...' : 'Procesando contenido personalizado...');
      
      const { data, error } = await supabase.functions.invoke('process-pin-generation', {
        body: { 
          url: params.url,
          customContent: params.customContent,
          nicheId: params.nicheId,
          specializedPrompt: params.specializedPrompt,
          imageStylePrompt: params.imageStylePrompt,
          noTextOverlay: params.noTextOverlay || false,
          userId: user.id 
        }
      });

      if (error) {
        throw new Error(error.message || 'Error al generar los pines');
      }

      if (!data?.data?.pins || data.data.pins.length === 0) {
        throw new Error('No se pudieron generar pines para esta URL');
      }

      setProgress('¡Pines generados exitosamente!');
      setGeneratedPins(data.data.pins);
      
      toast({
        title: "¡Éxito!",
        description: `Se generaron ${data.data.count} pines de Pinterest`,
      });

      return data.data;

    } catch (error) {
      console.error('Error generating pins:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al generar los pines';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    } finally {
      setIsGenerating(false);
      setProgress('');
    }
  };

  const reset = () => {
    setGeneratedPins([]);
    setProgress('');
  };

  return {
    generatePins,
    isGenerating,
    progress,
    generatedPins,
    reset
  };
};
