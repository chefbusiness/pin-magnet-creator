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
            <div className="absolute inset-0 bg-gradient-hero rounded-3xl opacity-20 blur-3xl transform rotate-6"></div>
            
            {/* Collage de pines en formato nube */}
            <div className="relative w-full max-w-lg mx-auto h-96 lg:h-[500px]">
              {/* Pin 1 - Fitness (centro-izquierda, más grande) */}
              <div className="absolute top-8 left-4 w-20 lg:w-24 transform -rotate-12 hover:scale-110 transition-all duration-300 shadow-2xl z-20">
                <img 
                  src={pinFitness} 
                  alt="Fitness Pin" 
                  className="rounded-2xl aspect-[9/16] object-cover shadow-primary/20"
                />
              </div>
              
              {/* Pin 2 - Interior (centro, principal) */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 rotate-6 w-28 lg:w-32 hover:scale-110 transition-all duration-300 shadow-2xl z-30">
                <img 
                  src={pinInterior} 
                  alt="Interior Design Pin" 
                  className="rounded-2xl aspect-[9/16] object-cover shadow-primary/20"
                />
              </div>
              
              {/* Pin 3 - Travel (centro-derecha) */}
              <div className="absolute top-12 right-4 w-20 lg:w-24 transform rotate-12 hover:scale-110 transition-all duration-300 shadow-2xl z-20">
                <img 
                  src={pinTravel} 
                  alt="Travel Pin" 
                  className="rounded-2xl aspect-[9/16] object-cover shadow-primary/20"
                />
              </div>
              
              {/* Pin 4 - Business (abajo-izquierda) */}
              <div className="absolute bottom-8 left-8 w-22 lg:w-26 transform rotate-3 hover:scale-110 transition-all duration-300 shadow-2xl z-25">
                <img 
                  src={pinBusiness} 
                  alt="Business Pin" 
                  className="rounded-2xl aspect-[9/16] object-cover shadow-primary/20"
                />
              </div>
              
              {/* Pin 5 - Recipes (abajo-derecha) */}
              <div className="absolute bottom-4 right-8 w-20 lg:w-24 transform -rotate-8 hover:scale-110 transition-all duration-300 shadow-2xl z-25">
                <img 
                  src={pinRecipes} 
                  alt="Recipes Pin" 
                  className="rounded-2xl aspect-[9/16] object-cover shadow-primary/20"
                />
              </div>
              
              {/* Elementos decorativos flotantes */}
              <div className="absolute top-20 right-16 w-3 h-3 bg-primary/60 rounded-full animate-pulse"></div>
              <div className="absolute bottom-20 left-16 w-2 h-2 bg-primary/40 rounded-full animate-pulse delay-700"></div>
              <div className="absolute top-1/3 right-6 w-1 h-1 bg-primary/30 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}