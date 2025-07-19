
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, ExternalLink } from "lucide-react";
import { getOtherSectors } from "@/data/pinterestSectors";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

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
                  <li key={idx} className="text-sm text-muted-foreground flex items-center justify-between hover:text-foreground transition-colors group p-1 rounded hover:bg-accent/50">
                    <span className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {t(sub)}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        Próximamente
                      </span>
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
