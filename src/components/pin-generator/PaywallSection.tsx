import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export function PaywallSection() {
  return (
    <div className="bg-gradient-primary/10 rounded-lg p-8 border border-primary/20 text-center">
      <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
      <h3 className="text-xl font-semibold mb-2">Suscripción requerida</h3>
      <p className="text-muted-foreground mb-6">
        Para generar pines necesitas una suscripción activa. No ofrecemos plan gratuito.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="gradient" size="lg" onClick={() => (window.location.href = '/#pricing')}>
          Ver planes y suscribirme
        </Button>
      </div>
    </div>
  );
}
