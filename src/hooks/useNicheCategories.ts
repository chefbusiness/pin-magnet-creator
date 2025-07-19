
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNicheCategories = () => {
  return useQuery({
    queryKey: ['niche-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('niche_categories')
        .select(`
          *,
          niche_subcategories(*)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTopNicheCategories = () => {
  const { data, isLoading, error } = useNicheCategories();
  
  return {
    data: data?.slice(0, 5) || [], // Top 5 categories
    isLoading,
    error
  };
};
