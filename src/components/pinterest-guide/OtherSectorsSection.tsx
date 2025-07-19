
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { useHybridNicheData } from "@/hooks/useHybridNicheData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

export function OtherSectorsSection() {
  const { t } = useLanguage();
  const { getOtherSectorsWithStatus, isLoading } = useHybridNicheData();

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Target className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">{t('guide.otherSectors')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const sectors = getOtherSectorsWithStatus();
  
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <Target className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold">{t('guide.otherSectors')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectors.map((sector, index) => (
          <Card key={sector.titleKey} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-8 w-8 bg-secondary rounded-lg flex items-center justify-center">
                  <sector.icon className="h-4 w-4 text-secondary-foreground" />
                </div>
                <span className="text-lg">{t(sector.titleKey)}</span>
                <span className="text-xl">{sector.emoji}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {sector.subcategoriesKeys.map((subcategory: any, idx: number) => (
                  <li key={subcategory.key} className="text-sm text-muted-foreground flex items-center justify-between hover:text-foreground transition-colors group p-1 rounded hover:bg-accent/50">
                    <span className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {subcategory.name}
                    </span>
                    <div className="opacity-100 transition-opacity">
                      <Badge variant="outline" className="text-xs">
                        Soon
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
