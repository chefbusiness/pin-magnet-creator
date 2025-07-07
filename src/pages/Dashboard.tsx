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
          <h1 className="text-3xl font-bold mb-2">Mi Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Gestiona y descarga todos tus pines generados
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Image className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pines</p>
                    <p className="text-2xl font-bold">{pins.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Este Mes</p>
                    <p className="text-2xl font-bold">{profile?.pins_generated_this_month || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Restantes</p>
                    <p className="text-2xl font-bold">{getRemainingPins()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pins Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pins.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes pines aún</h3>
              <p className="text-muted-foreground mb-4">
                Comienza generando tu primer pin desde la página principal
              </p>
              <Button asChild>
                <a href="/">Generar Mi Primer Pin</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pins.map((pin) => (
              <Card key={pin.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {pin.image_url ? (
                    <img
                      src={pin.image_url}
                      alt={pin.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Badge 
                    variant={pin.status === 'completed' ? 'default' : 'secondary'}
                    className="absolute top-2 right-2"
                  >
                    {pin.status === 'completed' ? 'Listo' : 'Procesando'}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{pin.title}</h3>
                  {pin.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {pin.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{formatDate(pin.created_at)}</span>
                    {pin.template_style && (
                      <Badge variant="outline" className="text-xs">
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
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={deletingId === pin.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar pin?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El pin será eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(pin.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
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