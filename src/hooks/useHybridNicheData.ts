
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getTopSectors, getOtherSectors, getNicheSectors } from "@/data/pinterestSectors";
import { useLanguage } from "@/contexts/LanguageContext";

// Hook para obtener datos híbridos: todos los sectores del archivo original
// marcando cuáles tienen páginas implementadas en la BD
export const useHybridNicheData = () => {
  const { t } = useLanguage();

  const { data: dbCategories, isLoading } = useQuery({
    queryKey: ['niche-categories-db'],
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
    staleTime: 5 * 60 * 1000,
  });

  // Mapeo correcto de keys de traducción a slugs de BD
  const categoryMap: Record<string, string> = {
    'sector.homeDecor': 'home-decor',
    'sector.recipes': 'recipes',
    'sector.fashion': 'fashion',
    'sector.beauty': 'beauty',
    'sector.weddings': 'weddings',
    'sector.maternity': 'maternity',
    'sector.travel': 'travel',
    'sector.fitness': 'fitness',
    'sector.health': 'health',
    'sector.photography': 'photography'
  };

  // Mapeo específico de subcategorías (keys de traducción → slugs de BD)
  const subcategoryMap: Record<string, Record<string, string>> = {
    'sector.homeDecor': {
      'subcategory.livingRoomDecoration': 'living-room-decor',
      'subcategory.bedroomDesign': 'bedroom-decor'
      // Agregar más subcategorías aquí según se vayan implementando
    },
    'sector.recipes': {
      // Agregar subcategorías de recetas cuando estén implementadas
    },
    'sector.fashion': {
      // Agregar subcategorías de moda cuando estén implementadas
    },
    'sector.beauty': {
      // Agregar subcategorías de belleza cuando estén implementadas
    },
    'sector.weddings': {
      // Agregar subcategorías de bodas cuando estén implementadas
    }
  };

  // Función para verificar si una subcategoría está implementada en BD
  const isSubcategoryImplemented = (categoryTitleKey: string, subcategoryKey: string) => {
    if (!dbCategories) return false;

    const categorySlug = categoryMap[categoryTitleKey];
    if (!categorySlug) return false;

    // Verificar si existe mapeo específico para esta subcategoría
    const subcategorySlug = subcategoryMap[categoryTitleKey]?.[subcategoryKey];
    if (!subcategorySlug) return false;

    const dbCategory = dbCategories.find(cat => cat.slug === categorySlug);
    if (!dbCategory) return false;

    // Verificar si existe la subcategoría específica en la BD
    return dbCategory.niche_subcategories?.some((sub: any) => 
      sub.is_active && sub.slug === subcategorySlug
    ) || false;
  };

  // Función para obtener el link de la subcategoría si está implementada
  const getSubcategoryLink = (categoryTitleKey: string, subcategoryKey: string) => {
    if (!isSubcategoryImplemented(categoryTitleKey, subcategoryKey)) return null;

    const categorySlug = categoryMap[categoryTitleKey];
    const subcategorySlug = subcategoryMap[categoryTitleKey]?.[subcategoryKey];
    
    if (!categorySlug || !subcategorySlug) return null;

    return `/niche/${categorySlug}/${subcategorySlug}`;
  };

  const getTopSectorsWithStatus = () => {
    const sectors = getTopSectors(t);
    return sectors.map(sector => ({
      ...sector,
      subcategoriesKeys: sector.subcategoriesKeys.map(subKey => ({
        key: subKey,
        name: t(subKey),
        isImplemented: isSubcategoryImplemented(sector.titleKey, subKey),
        link: getSubcategoryLink(sector.titleKey, subKey)
      }))
    }));
  };

  const getOtherSectorsWithStatus = () => {
    const sectors = getOtherSectors(t);
    return sectors.map(sector => ({
      ...sector,
      subcategoriesKeys: sector.subcategoriesKeys.map(subKey => ({
        key: subKey,
        name: t(subKey),
        isImplemented: false, // Ninguno de "otros sectores" está implementado aún
        link: null
      }))
    }));
  };

  const getNicheSectorsWithStatus = () => {
    const sectors = getNicheSectors(t);
    return sectors.map(sector => ({
      ...sector,
      subcategoriesKeys: sector.subcategoriesKeys.map(subKey => ({
        key: subKey,
        name: t(subKey),
        isImplemented: false, // Ninguno de "nichos" está implementado aún
        link: null
      }))
    }));
  };

  return {
    getTopSectorsWithStatus,
    getOtherSectorsWithStatus,
    getNicheSectorsWithStatus,
    isLoading
  };
};
