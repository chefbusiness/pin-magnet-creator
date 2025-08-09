import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const BillingStatus = () => {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ subscribed: boolean; tier?: string | null; periodEnd?: string | null }>({ subscribed: false });
  const canonical = useMemo(() => (typeof window !== 'undefined' ? `${window.location.origin}/billing/status` : '/billing/status'), []);
  const formatTier = (tier?: string | null) => {
    const key = (tier || '').toLowerCase();
    if (key === 'business') return 'Agency';
    if (key === 'starter') return 'Starter';
    if (key === 'pro') return 'Pro';
    return tier || '';
  };

  const check = async () => {
    setLoading(true);
    setError(null);
    try {
      if (user) {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        if (error) throw new Error(error.message);
        const subscribed = Boolean((data as any)?.subscribed ?? (data as any)?.hasActive);
        const tier = (data as any)?.subscription_tier ?? (data as any)?.planType ?? null;
        const periodEnd = (data as any)?.subscription_end ?? (data as any)?.current_period_end ?? null;
        setStatus({ subscribed, tier, periodEnd });
        await refreshProfile();
      }
    } catch (e: any) {
      setError(e?.message || 'No se pudo comprobar el estado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>Estado de suscripción | PinCraft</title>
        <meta name="description" content="Consulta y refresca el estado de tu suscripción a PinCraft." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-3">Estado de suscripción</h1>
        <p className="text-muted-foreground mb-8">Comprueba si tu suscripción está activa y su próxima renovación.</p>

        {loading ? (
          <div className="rounded-lg border border-border p-6 bg-card text-card-foreground">Comprobando estado...</div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 p-6 bg-destructive/10 text-destructive">{error}</div>
        ) : (
          <div className="rounded-lg border border-border p-6 bg-card text-card-foreground space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estado</span>
              <span className={`font-medium ${status.subscribed ? 'text-green-600' : 'text-orange-600'}`}>{status.subscribed ? 'Activa' : 'Inactiva'}</span>
            </div>
            {status.tier && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="font-medium">{formatTier(status.tier)}</span>
              </div>
            )}
            {status.periodEnd && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Próxima renovación</span>
                <span className="font-medium">{new Date(status.periodEnd).toLocaleDateString('es-ES')}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-8">
          <Button onClick={check}>Refrescar estado</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/profile')}>Ir a Perfil</Button>
        </div>
      </main>
    </div>
  );
};

export default BillingStatus;
