
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ExternalLink } from "lucide-react";
import { useTopNicheCategories } from "@/hooks/useNicheCategories";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function TopSectorsSection() {
  const { t } = useLanguage();
  const { data: categories, isLoading, error } = useTopNicheCategories();

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">{t('guide.topSectors')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error || !categories.length) {
    return (
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">{t('guide.topSectors')}</h2>
        </div>
        <p className="text-muted-foreground text-center py-8">
          Error cargando las categorías principales
        </p>
      </section>
    );
  }
  
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold">{t('guide.topSectors')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <Card key={category.id} className="hover:shadow-lg transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">{index + 1}</span>
                </div>
                <span className="text-xl">{index + 1}. {category.name}</span>
                <span className="text-2xl">{category.emoji}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-3">
                  {category.description}
                </p>
                
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    {t('guide.subcategories')} ({category.niche_subcategories?.length || 0})
                  </p>
                  <div className="grid gap-2 max-h-32 overflow-y-auto">
                    {category.niche_subcategories?.slice(0, 6).map((subcategory: any) => (
                      <Link
                        key={subcategory.id}
                        to={`/niche/${category.slug}/${subcategory.slug}`}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors group/sub"
                      >
                        <span className="text-sm text-muted-foreground group-hover/sub:text-foreground">
                          {subcategory.name}
                        </span>
                        <div className="flex items-center gap-1">
                          {subcategory.is_premium && (
                            <Badge variant="secondary" className="text-xs">
                              Premium
                            </Badge>
                          )}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ))}
                    {(category.niche_subcategories?.length || 0) > 6 && (
                      <p className="text-xs text-muted-foreground px-2">
                        +{(category.niche_subcategories?.length || 0) - 6} más...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
