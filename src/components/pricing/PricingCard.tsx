import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { PricingBadge } from "./PricingBadge";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export interface PricingPlan {
  name: string;
  originalPrice: string;
  launchPrice: string;
  savings: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  isLaunchOffer: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const isAgency = /^\s*(agency|agencia)\s*$/i.test(plan.name);
  const showStartNow = plan.popular || isAgency;

  const planKey = useMemo(() => {
    const name = plan.name.toLowerCase();
    return name.includes('agency') || name.includes('agencia')
      ? 'agency'
      : name.includes('pro')
        ? 'pro'
        : 'starter';
  }, [plan.name]);

  const currentPlanKey = useMemo(() => {
    if (!profile) return null;
    if (profile.plan_type === 'business') return 'agency';
    if (profile.plan_type === 'pro') {
      if ((profile.monthly_limit || 0) <= 25) return 'starter';
      return 'pro';
    }
    return null; // free
  }, [profile]);

  const isCurrent = currentPlanKey === planKey;

  const handleCheckout = async () => {
    try {
      // If not authenticated, store desired plan and redirect to /auth
      const name = plan.name.toLowerCase();
      const selectedPlan = name.includes('agency') || name.includes('agencia')
        ? 'agency'
        : name.includes('pro')
          ? 'pro'
          : 'starter';

      if (!user) {
        localStorage.setItem('pendingPlan', selectedPlan);
        toast({
          title: t('pricing.loginRequired') || 'Inicia sesión para continuar',
          description: t('pricing.loginToContinue') || 'Por favor inicia sesión para completar la suscripción.',
        });
        window.location.href = '/auth';
        return;
      }

      setLoading(true);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: selectedPlan },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No se recibió URL de Stripe');
      }
    } catch (err: any) {
      console.error('Checkout error', err);
      toast({
        title: t('common.error') || 'Error',
        description: err?.message || 'No se pudo iniciar el checkout',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card 
      className={`shadow-card border relative ${
        plan.popular 
          ? 'bg-gradient-primary text-white scale-105 shadow-2xl border-yellow-400/30' 
          : 'bg-card/95 backdrop-blur-sm hover:shadow-primary/10 transition-all duration-300 border-border/50'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <PricingBadge type="popular" />
        </div>
      )}
      {isCurrent && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary/15 text-primary border border-primary/20">Tu plan actual</Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-2 pt-6">
        <CardTitle className={`text-2xl ${plan.popular ? 'text-white' : ''}`}>
          {plan.name}
        </CardTitle>
        <div className="py-4">
          {plan.isLaunchOffer && (
            <div className="mb-2">
              <span className={`text-lg line-through ${plan.popular ? 'text-white/60' : 'text-muted-foreground'}`}>
                {plan.originalPrice}{plan.period}
              </span>
            </div>
          )}
          <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-primary'}`}>
            {plan.isLaunchOffer ? plan.launchPrice : plan.originalPrice}
          </span>
          <span className={`text-lg ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>
            {plan.period}
          </span>
        </div>
        <CardDescription className={plan.popular ? 'text-white/90' : ''}>
          {plan.description}
        </CardDescription>
        <p className={`text-xs mt-2 ${plan.popular ? 'text-white/70' : 'text-muted-foreground'}`}>
          {t('pricing.limitedTimeOffer')}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                plan.popular ? 'bg-white/20' : 'bg-primary/20'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  plan.popular ? 'bg-white' : 'bg-primary'
                }`}></div>
              </div>
              <span className={`text-sm ${
                plan.popular ? 'text-white' : 'text-foreground'
              }`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
        
        <Button 
          className={`w-full ${plan.popular ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold' : ''}`}
          variant={plan.popular ? "secondary" : "gradient"}
          size="lg"
          onClick={handleCheckout}
          disabled={loading || isCurrent}
        >
          {loading
            ? t('common.loading') || 'Cargando…'
            : isCurrent
              ? 'Plan actual'
              : (showStartNow ? t('pricing.getStartedNow') : t('pricing.startFree'))}
        </Button>
        
        <p className={`text-xs text-center ${
          plan.popular ? 'text-white/70' : 'text-muted-foreground'
        }`}>
          {t('pricing.noCommitment')}
        </p>
      </CardContent>
    </Card>
  );
}