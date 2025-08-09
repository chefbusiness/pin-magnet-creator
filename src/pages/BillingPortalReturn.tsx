import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const BillingPortalReturn = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ subscribed: boolean; tier?: string | null; periodEnd?: string | null }>({ subscribed: false });
  const [seconds, setSeconds] = useState(3);
  const canonical = useMemo(() => (typeof window !== 'undefined' ? `${window.location.origin}/billing/portal-return` : '/billing/portal-return'), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (user) {
          const { data, error } = await supabase.functions.invoke('check-subscription');
          if (error) throw new Error(error.message);
          const subscribed = Boolean((data as any)?.subscribed ?? (data as any)?.hasActive);
          const tier = (data as any)?.subscription_tier ?? (data as any)?.planType ?? null;
          const periodEnd = (data as any)?.subscription_end ?? (data as any)?.current_period_end ?? null;
          if (!mounted) return;
          setStatus({ subscribed, tier, periodEnd });
          await refreshProfile();
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'No se pudo actualizar el estado.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user, refreshProfile]);

  useEffect(() => {
    if (!loading && !error) {
      const interval = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
      const timer = setTimeout(() => navigate('/profile'), 3000);
      return () => { clearInterval(interval); clearTimeout(timer); };
    }
  }, [loading, error, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>Estado actualizado | PinCraft</title>
        <meta name="description" content="Has vuelto del portal de cliente de Stripe. El estado de tu suscripción se ha actualizado." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-3">Estado de suscripción</h1>
        <p className="text-muted-foreground mb-2">Hemos actualizado tu estado al regresar del portal.</p>
        {!loading && !error && (
          <p className="text-xs text-muted-foreground mb-6">Volviendo al perfil en {seconds}s…</p>
        )}

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
                <span className="font-medium capitalize">{status.tier}</span>
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
          <Button onClick={() => navigate('/profile')}>Ir al perfil</Button>
          <Button variant="outline" onClick={() => navigate('/billing/status')}>Ver estado</Button>
        </div>
      </main>
    </div>
  );
};

export default BillingPortalReturn;
