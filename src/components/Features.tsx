import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Features() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: "🎯",
      title: t('features.feature1Title'),
      description: t('features.feature1Desc')
    },
    {
      icon: "🎨",
      title: t('features.feature2Title'),
      description: t('features.feature2Desc')
    },
    {
      icon: "📱",
      title: t('features.feature3Title'),
      description: t('features.feature3Desc')
    },
    {
      icon: "⚡",
      title: t('features.feature4Title'),
      description: t('features.feature4Desc')
    },
    {
      icon: "🔄",
      title: t('features.feature5Title'),
      description: t('features.feature5Desc')
    },
    {
      icon: "📊",
      title: t('features.feature6Title'),
      description: t('features.feature6Desc')
    }
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card border-0 bg-card/80 backdrop-blur-sm hover:shadow-primary/10 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-primary rounded-3xl p-8 lg:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                {t('features.ctaTitle')}
              </h3>
              <p className="text-xl opacity-90 mb-6">
                {t('features.ctaSubtitle')}
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>{t('features.ctaFeature1')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>{t('features.ctaFeature2')}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{t('features.stat1')}</div>
                <div className="text-sm opacity-80">{t('features.stat1Label')}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{t('features.stat2')}</div>
                <div className="text-sm opacity-80">{t('features.stat2Label')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}