import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { getTopSectors } from "@/data/pinterestSectors";
import { useLanguage } from "@/contexts/LanguageContext";

export function TopSectorsSection() {
  const { t } = useLanguage();
  const sectors = getTopSectors(t);
  
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold">{t('guide.topSectors')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sectors.map((sector, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <sector.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl">{index + 1}. {t(sector.titleKey)}</span>
                <span className="text-2xl">{sector.emoji}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium text-muted-foreground mb-3">{t('guide.subcategories')}</p>
                <ul className="space-y-1">
                  {sector.subcategoriesKeys.map((sub, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}