import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, CreditCard, Settings, Crown } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, profile, refreshProfile, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [manageLoading, setManageLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || user?.email || ''
  });

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          email: formData.email
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: "Perfil actualizado",
        description: "Tu información se ha guardado correctamente",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setManageLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No se pudo generar el enlace de gestión');
      }
    } catch (error: any) {
      console.error('Error accessing customer portal:', error);
      const description = error?.message || 'Error al acceder al portal de gestión. Asegúrate de tener una suscripción activa.';
      toast({
        title: 'Error',
        description,
        variant: 'destructive',
      });
    } finally {
      setManageLoading(false);
    }
  };
  
  const [refreshLoading, setRefreshLoading] = useState(false);

  const handleRefreshSubscription = async () => {
    setRefreshLoading(true);
    try {
      const { error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      await refreshProfile();
      toast({ title: 'Estado actualizado', description: 'Tu suscripción ha sido sincronizada.' });
    } catch (error: any) {
      console.error('Error refreshing subscription:', error);
      toast({ title: 'Error', description: error?.message || 'No se pudo actualizar el estado.', variant: 'destructive' });
    } finally {
      setRefreshLoading(false);
    }
  };
  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'starter': return 'bg-blue-500';
      case 'pro': return 'bg-purple-500';
      case 'business': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanName = (planType: string) => {
    switch (planType) {
      case 'starter': return 'Starter';
      case 'pro': return 'Pro';
      case 'business': return 'Agency';
      default: return planType;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nombre Completo</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Suscripción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isSuperAdmin() ? (
                  <div className="text-center">
                    <Badge className="bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold px-4 py-2 mb-4">
                      <Crown className="h-4 w-4 mr-1" />
                      SUPER ADMIN
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Acceso ilimitado a todas las funciones
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <Badge className={`${getPlanColor(profile?.plan_type || '')} text-white font-semibold px-4 py-2 mb-2`}>
                        Plan {profile?.subscription_status === 'active' ? getPlanName(profile?.plan_type || '') : 'Sin plan'}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {profile?.pins_generated_this_month || 0} / {profile?.monthly_limit || 0} pines usados
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Estado:</span>
                        <span className={profile?.subscription_status === 'active' ? 'text-green-600' : 'text-orange-600'}>
                          {profile?.subscription_status === 'active' ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      
                      {profile?.current_period_end && (
                        <div className="flex justify-between text-sm">
                          <span>Renovación:</span>
                          <span className="text-muted-foreground">
                            {new Date(profile.current_period_end).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="space-y-3">
                  <Button 
                    onClick={handleManageSubscription}
                    disabled={manageLoading}
                    variant="outline" 
                    className="w-full"
                  >
                    {manageLoading ? 'Cargando...' : 'Gestionar Suscripción'}
                  </Button>
                  <Button 
                    onClick={handleRefreshSubscription}
                    disabled={refreshLoading}
                    className="w-full"
                  >
                    {refreshLoading ? 'Actualizando…' : 'Actualizar estado'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>ID de Usuario:</span>
                  <span className="text-muted-foreground font-mono text-xs">
                    {user?.id.slice(0, 8)}...
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Cuenta creada:</span>
                  <span className="text-muted-foreground">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                  </span>
                </div>
                
                {profile?.stripe_customer_id && (
                  <div className="flex justify-between">
                    <span>Cliente Stripe:</span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {profile.stripe_customer_id.slice(0, 8)}...
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;