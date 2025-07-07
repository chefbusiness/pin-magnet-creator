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
  const { toast } = useToast();

  const generatePins = async (url: string, user?: any): Promise<GenerationResult | null> => {
    if (!url) {
      toast({
        title: "Error",
        description: "Por favor ingresa una URL válida",
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
      // Validate URL format
      try {
        new URL(url);
      } catch {
        throw new Error('Por favor ingresa una URL válida (ej: https://ejemplo.com)');
      }

      setProgress('Analizando contenido de la URL...');
      
      const { data, error } = await supabase.functions.invoke('process-pin-generation', {
        body: { url }
      });

      if (error) {
        throw new Error(error.message || 'Error al generar los pines');
      }

      if (!data?.data?.pins || data.data.pins.length === 0) {
        throw new Error('No se pudieron generar pines para esta URL');
      }

      setProgress('¡Pines generados exitosamente!');
      
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

  return {
    generatePins,
    isGenerating,
    progress
  };
};