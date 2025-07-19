import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Pin {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  url: string;
  template_style: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const usePins = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPins = async (page = 1, limit = 12, append = false) => {
    if (!user) return;

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('pins')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (append) {
        setPins(prev => [...prev, ...(data || [])]);
      } else {
        setPins(data || []);
      }
      setTotalCount(count || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching pins:', error);
      toast({
        title: "Error",
        description: "Error al cargar el historial de pines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePins = async () => {
    const nextPage = currentPage + 1;
    await fetchPins(nextPage, 12, true);
  };

  const deletePin = async (pinId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('pins')
        .delete()
        .eq('id', pinId)
        .eq('user_id', user.id);

      if (error) throw error;

      setPins(prev => prev.filter(pin => pin.id !== pinId));
      setTotalCount(prev => prev - 1);
      
      toast({
        title: "Pin eliminado",
        description: "El pin se ha eliminado correctamente",
      });

      return true;
    } catch (error) {
      console.error('Error deleting pin:', error);
      toast({
        title: "Error",
        description: "Error al eliminar el pin",
        variant: "destructive",
      });
      return false;
    }
  };

  const downloadImage = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Descarga iniciada",
        description: "La imagen se está descargando",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Error",
        description: "Error al descargar la imagen",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchPins();
    }
  }, [user]);

  const hasMorePins = pins.length < totalCount;

  return {
    pins,
    loading,
    loadingMore,
    totalCount,
    hasMorePins,
    fetchPins,
    loadMorePins,
    deletePin,
    downloadImage,
  };
};