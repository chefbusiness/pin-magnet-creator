import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Image } from 'lucide-react';

export function EmptyState() {
  const { t } = useLanguage();

  return (
    <Card className="text-center py-8 md:py-12 mx-4 md:mx-0">
      <CardContent className="px-4">
        <Image className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-base md:text-lg font-semibold mb-2">{t('dashboard.noPinsTitle')}</h3>
        <p className="text-muted-foreground mb-4 text-sm md:text-base">
          {t('dashboard.noPinsDesc')}
        </p>
        <Button asChild size="sm">
          <a href="/">{t('dashboard.generateFirst')}</a>
        </Button>
      </CardContent>
    </Card>
  );
}