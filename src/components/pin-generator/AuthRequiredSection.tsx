import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, Sparkles } from "lucide-react";

export function AuthRequiredSection() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-primary/10 rounded-lg p-8 border border-primary/20 text-center">
      <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
      <h3 className="text-xl font-semibold mb-2">{t('pinGenerator.authTitle')}</h3>
      <p className="text-muted-foreground mb-6">
        {t('pinGenerator.authDesc')}
      </p>
      
      {/* Pricing info */}
      <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-primary/5 rounded-lg">
        <Sparkles className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium">
          Planes desde $13/mes • Sin período de prueba gratuito
        </span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="gradient" size="lg" onClick={() => window.location.href = '/auth'}>
          {t('pinGenerator.authButton')}
        </Button>
        <Button variant="outline" size="lg" onClick={() => window.location.href = '/#pricing'}>
          Ver Planes
        </Button>
      </div>
    </div>
  );
}