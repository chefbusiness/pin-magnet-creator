import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

const BillingCanceled = () => {
  const canonical = useMemo(() => (typeof window !== 'undefined' ? `${window.location.origin}/billing/canceled` : '/billing/canceled'), []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>Pago cancelado | PinCraft</title>
        <meta name="description" content="El proceso de pago se canceló. Puedes intentarlo de nuevo cuando quieras." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-3">Pago cancelado</h1>
        <p className="text-muted-foreground mb-8">No se ha realizado ningún cargo. Puedes volver a intentarlo.</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => (window.location.href = '/#pricing')}>Volver a precios</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>Ir al inicio</Button>
        </div>
      </main>
    </div>
  );
};

export default BillingCanceled;
