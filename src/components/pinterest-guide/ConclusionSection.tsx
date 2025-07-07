import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export function ConclusionSection() {
  const { t } = useLanguage();
  
  return (
    <section className="text-center">
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-4">{t('guide.conclusion')}</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('guide.conclusionText')}
          </p>
          <div className="mt-6">
            <Badge variant="outline" className="mx-2">433M+ usuarios activos</Badge>
            <Badge variant="outline" className="mx-2">Múltiples nichos</Badge>
            <Badge variant="outline" className="mx-2">Alto engagement</Badge>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}