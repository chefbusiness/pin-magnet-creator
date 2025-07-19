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

  // Función para verificar si una subcategoría está implementada en BD
  const isSubcategoryImplemented = (categoryTitleKey: string, subcategoryKey: string) => {
    if (!dbCategories) return false;

    // Mapear las keys a los slugs de la BD
    const categoryMap: Record<string, string> = {
      'sector.homeDecor': 'decoracion-del-hogar',
      'sector.recipes': 'recetas-y-comida',
      'sector.fashion': 'moda-femenina',
      'sector.beauty': 'belleza-y-cuidado-personal',
      'sector.weddings': 'bodas-y-eventos'
    };

    const categorySlug = categoryMap[categoryTitleKey];
    if (!categorySlug) return false;

    const dbCategory = dbCategories.find(cat => cat.slug === categorySlug);
    if (!dbCategory) return false;

    // Verificar si existe la subcategoría en la BD
    return dbCategory.niche_subcategories?.some((sub: any) => sub.is_active) || false;
  };

  // Función para obtener el link de la subcategoría si está implementada
  const getSubcategoryLink = (categoryTitleKey: string, subcategoryKey: string) => {
    if (!isSubcategoryImplemented(categoryTitleKey, subcategoryKey)) return null;

    const categoryMap: Record<string, string> = {
      'sector.homeDecor': 'decoracion-del-hogar',
      'sector.recipes': 'recetas-y-comida', 
      'sector.fashion': 'moda-femenina',
      'sector.beauty': 'belleza-y-cuidado-personal',
      'sector.weddings': 'bodas-y-eventos'
    };

    const categorySlug = categoryMap[categoryTitleKey];
    if (!categorySlug) return null;

    const dbCategory = dbCategories?.find(cat => cat.slug === categorySlug);
    const dbSubcategory = dbCategory?.niche_subcategories?.[0]; // Tomar la primera implementada

    if (!dbSubcategory) return null;

    return `/niche/${categorySlug}/${dbSubcategory.slug}`;
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