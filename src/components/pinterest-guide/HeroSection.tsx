import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();
  
  return (
    <div className="text-center mb-12">
      <Badge variant="secondary" className="mb-4">
        {t('guide.badge')}
      </Badge>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        {t('guide.title')} 
        <span className="bg-gradient-primary bg-clip-text text-transparent"> {t('guide.titleHighlight')}</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        {t('guide.description')}
      </p>
    </div>
  );
}