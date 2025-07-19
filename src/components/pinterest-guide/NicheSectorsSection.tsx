
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useHybridNicheData } from "@/hooks/useHybridNicheData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

export function NicheSectorsSection() {
  const { t } = useLanguage();
  const { getNicheSectorsWithStatus, isLoading } = useHybridNicheData();

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">{t('guide.nicheSectors')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const sectors = getNicheSectorsWithStatus();
  
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <Globe className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold">{t('guide.nicheSectors')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectors.map((sector) => (
          <Card key={sector.titleKey} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground text-sm">{sector.emoji}</span>
                </div>
                <span className="text-lg">{t(sector.titleKey)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  {sector.subcategoriesKeys.slice(0, 8).map((subcategory: any) => (
                    <div
                      key={subcategory.key}
                      className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors group p-1 rounded hover:bg-accent/50"
                    >
                      <span className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {subcategory.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Soon
                      </Badge>
                    </div>
                  ))}
                  {sector.subcategoriesKeys.length > 8 && (
                    <p className="text-xs text-muted-foreground px-2 pt-2">
                      +{sector.subcategoriesKeys.length - 8} nichos más...
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
