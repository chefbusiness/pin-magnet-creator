
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ExternalLink } from "lucide-react";
import { useNicheCategories } from "@/hooks/useNicheCategories";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function NicheSectorsSection() {
  const { t } = useLanguage();
  const { data: allCategories, isLoading, error } = useNicheCategories();
  
  // Show categories after the top 5
  const categories = allCategories?.slice(5) || [];

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">{t('guide.nicheSectors')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
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
          <Globe className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">{t('guide.nicheSectors')}</h2>
        </div>
        <p className="text-muted-foreground text-center py-8">
          No hay nichos especializados disponibles
        </p>
      </section>
    );
  }
  
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <Globe className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold">{t('guide.nicheSectors')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground text-sm">{category.emoji}</span>
                </div>
                <span className="text-lg">{category.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
                <div className="space-y-1">
                  {category.niche_subcategories?.slice(0, 4).map((subcategory: any) => (
                    <Link
                      key={subcategory.id}
                      to={`/niche/${category.slug}/${subcategory.slug}`}
                      className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors group p-1 rounded hover:bg-accent/50"
                    >
                      <span className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {subcategory.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {subcategory.is_premium && (
                          <Badge variant="outline" className="text-xs">
                            Premium
                          </Badge>
                        )}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                  {(category.niche_subcategories?.length || 0) > 4 && (
                    <p className="text-xs text-muted-foreground px-2">
                      +{(category.niche_subcategories?.length || 0) - 4} nichos más...
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
