import { useLanguage } from "@/contexts/LanguageContext";

export function FeatureShowcase() {
  const { t } = useLanguage();

  const features = [
    { icon: "🤖", title: t('pinGenerator.aiFeature1'), desc: t('pinGenerator.aiFeature1Desc') },
    { icon: "✨", title: t('pinGenerator.aiFeature2'), desc: t('pinGenerator.aiFeature2Desc') },
    { icon: "🎯", title: t('pinGenerator.aiFeature3'), desc: t('pinGenerator.aiFeature3Desc') },
    { icon: "📈", title: t('pinGenerator.aiFeature4'), desc: t('pinGenerator.aiFeature4Desc') }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {features.map((feature, index) => (
        <div key={index} className="text-center p-4 rounded-lg bg-background/50">
          <div className="text-3xl mb-2">{feature.icon}</div>
          <div className="font-semibold text-sm">{feature.title}</div>
          <div className="text-xs text-muted-foreground mt-1">{feature.desc}</div>
        </div>
      ))}
    </div>
  );
}