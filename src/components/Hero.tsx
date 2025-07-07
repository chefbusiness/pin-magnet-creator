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
            {/* Collage orgánico estilo Pinterest */}
            <div className="relative w-full max-w-lg mx-auto h-80 lg:h-96">
              
              {/* Pin 1 - Interior (principal, centro-derecha) */}
              <div className="absolute top-12 right-16 w-20 lg:w-24 transform rotate-12 z-30 hover:scale-105 transition-all duration-300">
                <img 
                  src={pinInterior} 
                  alt="Interior Design Pin" 
                  className="rounded-lg aspect-[9/16] object-cover shadow-xl"
                />
              </div>
              
              {/* Pin 2 - Travel (superpuesto sobre interior, arriba) */}
              <div className="absolute top-4 right-20 w-18 lg:w-20 transform -rotate-6 z-35 hover:scale-105 transition-all duration-300">
                <img 
                  src={pinTravel} 
                  alt="Travel Pin" 
                  className="rounded-lg aspect-[9/16] object-cover shadow-lg"
                />
              </div>
              
              {/* Pin 3 - Fitness (izquierda, parcialmente detrás) */}
              <div className="absolute top-8 left-12 w-22 lg:w-26 transform -rotate-15 z-25 hover:scale-105 transition-all duration-300">
                <img 
                  src={pinFitness} 
                  alt="Fitness Pin" 
                  className="rounded-lg aspect-[9/16] object-cover shadow-lg"
                />
              </div>
              
              {/* Pin 4 - Business (centro-izquierda, superpuesto) */}
              <div className="absolute top-20 left-20 w-19 lg:w-22 transform rotate-8 z-32 hover:scale-105 transition-all duration-300">
                <img 
                  src={pinBusiness} 
                  alt="Business Pin" 
                  className="rounded-lg aspect-[9/16] object-cover shadow-lg"
                />
              </div>
              
              {/* Pin 5 - Recipes (abajo centro) */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 rotate-3 w-21 lg:w-24 z-28 hover:scale-105 transition-all duration-300">
                <img 
                  src={pinRecipes} 
                  alt="Recipes Pin" 
                  className="rounded-lg aspect-[9/16] object-cover shadow-lg"
                />
              </div>
              
              {/* Pin duplicado 6 - Fitness pequeño (esquina superior izquierda) */}
              <div className="absolute top-2 left-4 w-16 lg:w-18 transform -rotate-20 z-20 hover:scale-105 transition-all duration-300">
                <img 
                  src={pinFitness} 
                  alt="Fitness Pin Small" 
                  className="rounded-lg aspect-[9/16] object-cover shadow-md opacity-90"
                />
              </div>
              
              {/* Pin duplicado 7 - Interior pequeño (abajo derecha) */}
              <div className="absolute bottom-4 right-8 w-17 lg:w-19 transform rotate-18 z-26 hover:scale-105 transition-all duration-300">
                <img 
                  src={pinInterior} 
                  alt="Interior Pin Small" 
                  className="rounded-lg aspect-[9/16] object-cover shadow-md opacity-85"
                />
              </div>
              
              {/* Pin duplicado 8 - Travel muy pequeño (centro-superior) */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -rotate-12 w-14 lg:w-16 z-22 hover:scale-105 transition-all duration-300">
                <img 
                  src={pinTravel} 
                  alt="Travel Pin Tiny" 
                  className="rounded-lg aspect-[9/16] object-cover shadow-sm opacity-80"
                />
              </div>
              
              {/* Fondo sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}