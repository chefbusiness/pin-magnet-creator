import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { usePins } from '@/hooks/usePins';
import { useLanguage } from '@/contexts/LanguageContext';
import { Download, Trash2, Calendar, Image, ExternalLink } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, profile, getRemainingPins } = useAuth();
  const { pins, loading, deletePin, downloadImage } = usePins();
  const { t } = useLanguage();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleDelete = async (pinId: string) => {
    setDeletingId(pinId);
    const success = await deletePin(pinId);
    setDeletingId(null);
  };

  const handleDownload = async (imageUrl: string, title: string) => {
    if (imageUrl) {
      await downloadImage(imageUrl, title);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mb-6 text-sm md:text-base">
            {t('dashboard.subtitle')}
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-2">
                  <Image className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">{t('dashboard.totalPins')}</p>
                    <p className="text-xl md:text-2xl font-bold">{pins.length}</p>
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
                    <p className="text-xl md:text-2xl font-bold">{profile?.pins_generated_this_month || 0}</p>
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
                    <p className="text-xl md:text-2xl font-bold">{getRemainingPins()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pins Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 md:h-48 w-full" />
                <CardContent className="p-3 md:p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pins.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {pins.map((pin) => (
              <Card key={pin.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                        onClick={() => handleDownload(pin.image_url, pin.title)}
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
                          disabled={deletingId === pin.id}
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
                            onClick={() => handleDelete(pin.id)}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;