import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-pins.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-hero bg-clip-text text-transparent">
                Crea 1 Mes de Contenido para Pinterest
              </h1>
              <h2 className="text-2xl lg:text-3xl text-foreground/80">
                En <span className="text-primary font-semibold">1 Minuto</span>
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Crear pines atractivos solía tomar horas. Hemos reducido el proceso a segundos. 
              Simplemente ingresa la URL de tu contenido y genera múltiples variaciones profesionales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Generar Mis Pines
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Ver Tutorial (1 min)
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">🤖</div>
                <div className="text-sm text-muted-foreground mt-2">Automatización completa</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">✨</div>
                <div className="text-sm text-muted-foreground mt-2">IA text writer</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">📅</div>
                <div className="text-sm text-muted-foreground mt-2">Programación masiva</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero rounded-3xl opacity-20 blur-3xl transform rotate-6"></div>
            <img 
              src={heroImage} 
              alt="Pinterest Pin Generator Preview" 
              className="relative rounded-3xl shadow-2xl w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}