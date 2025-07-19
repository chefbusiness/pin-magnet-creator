
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthRequiredSection } from "@/components/pin-generator/AuthRequiredSection";
import NicheGenerator from "@/components/NicheGenerator";
import { Skeleton } from "@/components/ui/skeleton";
import { NicheBreadcrumbs } from "@/components/niche/NicheBreadcrumbs";

const NichePage = () => {
  const { category, subcategory } = useParams();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  const { data: nicheData, isLoading, error } = useQuery({
    queryKey: ['niche', category, subcategory],
    queryFn: async () => {
      if (!category || !subcategory) return null;
      
      const { data, error } = await supabase
        .from('niche_subcategories')
        .select(`
          *,
          niche_categories!inner(*)
        `)
        .eq('slug', subcategory)
        .eq('niche_categories.slug', category)
        .eq('is_active', true)
        .eq('niche_categories.is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!category && !!subcategory
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !nicheData) {
    return <Navigate to="/404" replace />;
  }

  const category_data = nicheData.niche_categories;
  const isAuthRequired = nicheData.is_premium && !user;

  return (
    <>
      <Helmet>
        <title>{nicheData.meta_title || `${nicheData.name} - PinCraft`}</title>
        <meta 
          name="description" 
          content={nicheData.meta_description || nicheData.description} 
        />
        <meta property="og:title" content={nicheData.meta_title || `${nicheData.name} - PinCraft`} />
        <meta property="og:description" content={nicheData.meta_description || nicheData.description} />
        <link rel="canonical" href={`https://pincraft.pro/niche/${category}/${subcategory}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <NicheBreadcrumbs
            categoryName={category_data.name}
            categorySlug={category_data.slug}
            categoryEmoji={category_data.emoji || ''}
            subcategoryName={nicheData.name}
          />

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">{category_data.emoji}</span>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {nicheData.name}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {nicheData.description}
            </p>
            {nicheData.is_premium && (
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  ✨ Premium
                </span>
              </div>
            )}
          </div>

          {/* Pin Generator or Auth Required */}
          {isAuthRequired ? (
            <AuthRequiredSection />
          ) : (
            <NicheGenerator 
              nicheData={nicheData}
              categoryData={category_data}
            />
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NichePage;
