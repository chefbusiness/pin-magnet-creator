import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { getOtherSectors } from "@/data/pinterestSectors";
import { useLanguage } from "@/contexts/LanguageContext";

export function OtherSectorsSection() {
  const { t } = useLanguage();
  const sectors = getOtherSectors(t);
  
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <Target className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold">{t('guide.otherSectors')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectors.map((sector, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
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
                {sector.subcategoriesKeys.map((sub, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {t(sub)}
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