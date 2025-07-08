import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { PricingCard } from "./pricing/PricingCard";
import { createPricingPlans } from "./pricing/pricingDataTranslated";

export function Pricing() {
  const { t } = useLanguage();
  const pricingPlans = createPricingPlans(t);

  return (
    <section id="pricing" className="py-20 px-4 bg-background/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            {t('pricing.enterpriseQuestion')}
          </p>
          <Button variant="outline" size="lg">
            {t('pricing.contactSales')}
          </Button>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-4 py-2 border border-primary/20">
            <span className="text-sm font-medium">{t('pricing.aiGenerated')}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-sm font-medium">{t('pricing.gptTexts')}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-sm font-medium">{t('pricing.uniqueImages')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}