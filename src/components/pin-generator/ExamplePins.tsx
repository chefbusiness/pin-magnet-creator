import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export function ExamplePins() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="aspect-[9/16] bg-gradient-secondary rounded-lg p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 h-full flex flex-col justify-between text-white">
            <div>
              <Badge className="bg-white/20 text-white mb-2">{t('pinGenerator.example')} {i}</Badge>
              <h3 className="font-bold text-lg leading-tight">
                {t('pinGenerator.titlePlaceholder')}
              </h3>
            </div>
            <div className="text-xs opacity-80">
              tudominio.com
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}