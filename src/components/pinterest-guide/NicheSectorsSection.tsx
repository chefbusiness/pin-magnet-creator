import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { nicheSectors } from "@/data/pinterestSectors";

export function NicheSectorsSection() {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <Globe className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold">🎯 Nichos Especializados</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nicheSectors.map((sector, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                  <sector.icon className="h-4 w-4 text-accent-foreground" />
                </div>
                <span className="text-lg">{sector.title}</span>
                <span className="text-xl">{sector.emoji}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {sector.subcategories.map((sub, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {sub}
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