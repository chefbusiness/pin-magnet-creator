import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock } from "lucide-react";

export function AuthRequiredSection() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-primary/10 rounded-lg p-6 border border-primary/20 text-center">
      <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
      <h3 className="text-xl font-semibold mb-2">{t('pinGenerator.authTitle')}</h3>
      <p className="text-muted-foreground mb-4">
        {t('pinGenerator.authDesc')}
      </p>
      <Button variant="gradient" size="lg" onClick={() => window.location.href = '/auth'}>
        {t('pinGenerator.authButton')}
      </Button>
    </div>
  );
}