import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Download, Trash2, Image } from 'lucide-react';

interface Pin {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  status: string;
  created_at: string;
  template_style?: string;
}

interface PinCardProps {
  pin: Pin;
  onDownload: (imageUrl: string, title: string) => void;
  onDelete: (pinId: string) => void;
  isDeleting: boolean;
  formatDate: (dateString: string) => string;
}

export function PinCard({ pin, onDownload, onDelete, isDeleting, formatDate }: PinCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {pin.image_url ? (
          <img
            src={pin.image_url}
            alt={pin.title}
            className="w-full h-64 md:h-80 object-contain bg-muted"
          />
        ) : (
          <div className="w-full h-64 md:h-80 bg-muted flex items-center justify-center">
            <Image className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
          </div>
        )}
        <Badge 
          variant={pin.status === 'completed' ? 'default' : 'secondary'}
          className="absolute top-2 right-2 text-xs"
        >
          {pin.status === 'completed' ? t('dashboard.ready') : t('dashboard.processing')}
        </Badge>
      </div>
      
      <CardContent className="p-3 md:p-4">
        <h3 className="font-semibold mb-2 text-sm md:text-base truncate">{pin.title}</h3>
        {pin.description && (
          <p className="text-xs md:text-sm text-muted-foreground mb-3 truncate">
            {pin.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 md:mb-4">
          <span className="truncate">{formatDate(pin.created_at)}</span>
          {pin.template_style && (
            <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
              {pin.template_style}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          {pin.image_url && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload(pin.image_url!, pin.title)}
              className="flex-1 text-xs md:text-sm px-2 md:px-3"
            >
              <Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <span className="hidden sm:inline">{t('dashboard.download')}</span>
              <span className="sm:hidden">DL</span>
            </Button>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                disabled={isDeleting}
                className="px-2 md:px-3"
              >
                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="mx-4 max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base md:text-lg">{t('dashboard.deleteTitle')}</AlertDialogTitle>
                <AlertDialogDescription className="text-sm">
                  {t('dashboard.deleteDesc')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="w-full sm:w-auto">{t('dashboard.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(pin.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                >
                  {t('dashboard.delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}