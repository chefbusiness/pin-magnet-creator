import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Image, ExternalLink } from 'lucide-react';

interface StatsCardsProps {
  totalPins: number;
  pinsThisMonth: number;
  remainingPins: number;
}

export function StatsCards({ totalPins, pinsThisMonth, remainingPins }: StatsCardsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center space-x-2">
            <Image className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">{t('dashboard.totalPins')}</p>
              <p className="text-xl md:text-2xl font-bold">{totalPins}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">{t('dashboard.thisMonth')}</p>
              <p className="text-xl md:text-2xl font-bold">{pinsThisMonth}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="sm:col-span-2 lg:col-span-1">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center space-x-2">
            <ExternalLink className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">{t('dashboard.remaining')}</p>
              <p className="text-xl md:text-2xl font-bold">{remainingPins}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}