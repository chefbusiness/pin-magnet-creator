import { useLanguage } from "@/contexts/LanguageContext";

interface GenerationProgressProps {
  progress: string;
}

export function GenerationProgress({ progress }: GenerationProgressProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-primary/10 rounded-lg p-6 border border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="font-semibold">{progress || t('pinGenerator.generating')}</span>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className={progress.includes('Analizando') ? 'text-primary' : 'opacity-50'}>
          {progress.includes('Analizando') ? '⏳' : '✓'} {t('pinGenerator.analyzing')}
        </div>
        <div className={progress.includes('texto') ? 'text-primary' : 'opacity-50'}>
          {progress.includes('texto') ? '⏳' : progress.includes('Generando') ? '✓' : '○'} {t('pinGenerator.generatingText')}
        </div>
        <div className={progress.includes('imagen') ? 'text-primary' : 'opacity-50'}>
          {progress.includes('imagen') ? '⏳' : progress.includes('exitosa') ? '✓' : '○'} {t('pinGenerator.creatingImages')}
        </div>
      </div>
    </div>
  );
}