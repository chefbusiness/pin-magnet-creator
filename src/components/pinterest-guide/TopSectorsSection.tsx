
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ExternalLink } from "lucide-react";
import { useHybridNicheData } from "@/hooks/useHybridNicheData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function TopSectorsSection() {
  const { t } = useLanguage();
  const { getTopSectorsWithStatus, isLoading } = useHybridNicheData();

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">{t('guide.topSectors')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(10)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  const sectors = getTopSectorsWithStatus();
  
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold">{t('guide.topSectors')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sectors.map((sector, index) => (
          <Card key={sector.titleKey} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">{index + 1}</span>
                </div>
                <span className="text-xl">{index + 1}. {t(sector.titleKey)}</span>
                <span className="text-2xl">{sector.emoji}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    {t('guide.subcategories')} ({sector.subcategoriesKeys.length})
                  </p>
                  <div className="space-y-2">
                    {sector.subcategoriesKeys.map((subcategory: any) => (
                      <div
                        key={subcategory.key}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors group/sub"
                      >
                        {subcategory.isImplemented && subcategory.link ? (
                          <Link
                            to={subcategory.link}
                            className="flex items-center justify-between w-full group/link"
                          >
                            <span className="text-sm text-muted-foreground group-hover/link:text-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {subcategory.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <Badge variant="default" className="text-xs bg-primary hover:bg-primary/80">
                                Generate Pins
                              </Badge>
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </div>
                          </Link>
                        ) : (
                          <>
                            <span className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {subcategory.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              Soon
                            </Badge>
                          </>
                        )}
                      </div>
                    ))}
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
