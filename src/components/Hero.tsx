import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import pinFitness from "@/assets/pin-fitness.jpg";
import pinInterior from "@/assets/pin-interior.jpg";
import pinTravel from "@/assets/pin-travel.jpg";
import pinBusiness from "@/assets/pin-business.jpg";
import pinRecipes from "@/assets/pin-recipes.jpg";
import pinFashion from "@/assets/pin-fashion.jpg";
import pinWorkspace from "@/assets/pin-workspace.jpg";
import pinTech from "@/assets/pin-tech.jpg";
import pinArt from "@/assets/pin-art.jpg";

export function Hero() {
  const { t } = useLanguage();
  
  return (
    <section id="home" className="relative overflow-hidden py-12 sm:py-16 lg:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="space-y-3 lg:space-y-4 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-hero bg-clip-text text-transparent">
                {t('hero.title')}
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/80">
                {t('hero.subtitle')} <span className="text-primary font-semibold">1 {t('hero.subtitle').includes('Minute') ? 'Minute' : 'Minuto'}</span>
              </h2>
            </div>
            
            <p className="text-base lg:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6">
                {t('hero.cta')}
              </Button>
              <Button variant="outline" size="lg" className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6">
                {t('hero.tutorial')}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:gap-8 pt-6 lg:pt-8">
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-primary">🤖</div>
                <div className="text-xs lg:text-sm text-muted-foreground mt-1 lg:mt-2">{t('hero.feature1')}</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-primary">✨</div>
                <div className="text-xs lg:text-sm text-muted-foreground mt-1 lg:mt-2">{t('hero.feature2')}</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-primary">📅</div>
                <div className="text-xs lg:text-sm text-muted-foreground mt-1 lg:mt-2">{t('hero.feature3')}</div>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            {/* Mobile/Tablet: Solo 1 pin destacado */}
            <div className="block lg:hidden">
              <div className="max-w-xs mx-auto">
                <div className="relative bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src={pinInterior} 
                    alt="Pinterest Pin Example" 
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-lg font-bold text-white leading-tight mb-2">Ideas de Decoración Moderna</h4>
                    <p className="text-sm text-white/80">Ejemplo de pin generado</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-medium">Pinterest</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Collage completo */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                
                {/* Pin 1 - Interior Design (Spanish) */}
                <div className="col-span-1 transform rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite] group">
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <img 
                      src={pinInterior} 
                      alt="Interior Design" 
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white leading-tight">Ideas de Decoración Moderna</h4>
                    </div>
                  </div>
                </div>

                {/* Pin 2 - Fitness (English) */}
                <div className="col-span-1 transform -rotate-1 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_0.5s] group">
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <img 
                      src={pinFitness} 
                      alt="Fitness Workout" 
                      className="w-full h-60 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white leading-tight">30-Min Home Workout</h4>
                    </div>
                  </div>
                </div>

                {/* Pin 3 - Travel (Spanish) */}
                <div className="col-span-1 transform rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_1s] group">
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <img 
                      src={pinTravel} 
                      alt="Travel Destination" 
                      className="w-full h-50 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white leading-tight">Destinos Increíbles</h4>
                    </div>
                  </div>
                </div>

                {/* Pin 4 - Recipes (English) */}
                <div className="col-span-1 transform -rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_1.5s] group">
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <img 
                      src={pinRecipes} 
                      alt="Healthy Recipe" 
                      className="w-full h-58 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white leading-tight">Quick Healthy Recipes</h4>
                    </div>
                  </div>
                </div>

                {/* Pin 5 - Business (Spanish) */}
                <div className="col-span-1 transform rotate-1 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_2s] group">
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <img 
                      src={pinBusiness} 
                      alt="Business Tips" 
                      className="w-full h-54 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white leading-tight">Tips de Productividad</h4>
                    </div>
                  </div>
                </div>

                {/* Pin 6 - Workspace (English) */}
                <div className="col-span-1 transform -rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_0.8s] group">
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <img 
                      src={pinWorkspace} 
                      alt="Workspace Setup" 
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white leading-tight">Work From Home</h4>
                    </div>
                  </div>
                </div>

                {/* Pin 7 - Fashion (English) */}
                <div className="col-span-1 transform rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_1.2s] group">
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <img 
                      src={pinFashion} 
                      alt="Fashion Style" 
                      className="w-full h-60 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white leading-tight">Style Inspiration</h4>
                    </div>
                  </div>
                </div>

                {/* Pin 8 - Tech (Spanish) */}
                <div className="col-span-1 transform -rotate-1 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_1.8s] group">
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <img 
                      src={pinTech} 
                      alt="Tech Gadgets" 
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white leading-tight">Gadgets Tecnológicos</h4>
                    </div>
                  </div>
                </div>

                {/* Pin 9 - Art (Spanish) */}
                <div className="col-span-1 transform rotate-1 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_2.3s] group">
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <img 
                      src={pinArt} 
                      alt="Art Supplies" 
                      className="w-full h-58 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white leading-tight">Arte y Creatividad</h4>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}