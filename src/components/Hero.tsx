import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import pinFitness from "@/assets/pin-fitness.jpg";
import pinInterior from "@/assets/pin-interior.jpg";
import pinTravel from "@/assets/pin-travel.jpg";
import pinBusiness from "@/assets/pin-business.jpg";
import pinRecipes from "@/assets/pin-recipes.jpg";

export function Hero() {
  const { t } = useLanguage();
  
  return (
    <section id="home" className="relative overflow-hidden py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-hero bg-clip-text text-transparent">
                {t('hero.title')}
              </h1>
              <h2 className="text-2xl lg:text-3xl text-foreground/80">
                {t('hero.subtitle')} <span className="text-primary font-semibold">1 {t('hero.subtitle').includes('Minute') ? 'Minute' : 'Minuto'}</span>
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                {t('hero.cta')}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                {t('hero.tutorial')}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">🤖</div>
                <div className="text-sm text-muted-foreground mt-2">{t('hero.feature1')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">✨</div>
                <div className="text-sm text-muted-foreground mt-2">{t('hero.feature2')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">📅</div>
                <div className="text-sm text-muted-foreground mt-2">{t('hero.feature3')}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Collage organizado con imagen central */}
            <div className="relative w-full max-w-md mx-auto h-80 lg:h-96">
              
              {/* Pin Central (Interior Design) - Imagen principal */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 lg:w-28 z-30 hover:scale-110 transition-all duration-300">
                <img 
                  src={pinInterior} 
                  alt="Interior Design Pin" 
                  className="rounded-xl aspect-[9/16] object-cover shadow-2xl shadow-primary/20"
                />
              </div>
              
              {/* Pin Fitness - Esquina superior izquierda */}
              <div className="absolute top-4 left-4 w-20 lg:w-22 transform -rotate-12 z-20 hover:scale-110 transition-all duration-300">
                <img 
                  src={pinFitness} 
                  alt="Fitness Pin" 
                  className="rounded-xl aspect-[9/16] object-cover shadow-xl shadow-primary/15"
                />
              </div>
              
              {/* Pin Travel - Esquina superior derecha */}
              <div className="absolute top-6 right-4 w-20 lg:w-22 transform rotate-15 z-20 hover:scale-110 transition-all duration-300">
                <img 
                  src={pinTravel} 
                  alt="Travel Pin" 
                  className="rounded-xl aspect-[9/16] object-cover shadow-xl shadow-primary/15"
                />
              </div>
              
              {/* Pin Business - Esquina inferior izquierda */}
              <div className="absolute bottom-4 left-6 w-18 lg:w-20 transform rotate-8 z-25 hover:scale-110 transition-all duration-300">
                <img 
                  src={pinBusiness} 
                  alt="Business Pin" 
                  className="rounded-xl aspect-[9/16] object-cover shadow-xl shadow-primary/15"
                />
              </div>
              
              {/* Pin Recipes - Esquina inferior derecha */}
              <div className="absolute bottom-6 right-6 w-18 lg:w-20 transform -rotate-10 z-25 hover:scale-110 transition-all duration-300">
                <img 
                  src={pinRecipes} 
                  alt="Recipes Pin" 
                  className="rounded-xl aspect-[9/16] object-cover shadow-xl shadow-primary/15"
                />
              </div>
              
              {/* Elementos decorativos sutiles */}
              <div className="absolute top-16 right-12 w-2 h-2 bg-primary/40 rounded-full animate-pulse"></div>
              <div className="absolute bottom-16 left-12 w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse delay-700"></div>
              <div className="absolute top-1/2 right-2 w-1 h-1 bg-primary/20 rounded-full animate-pulse delay-1000"></div>
              
              {/* Fondo sutil con gradiente */}
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl opacity-5 blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}