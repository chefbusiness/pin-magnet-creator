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
            {/* Pinterest Wall Collage */}
            <div className="grid grid-cols-3 gap-3 lg:gap-4 max-w-sm mx-auto">
              
              {/* Pin 1 - Interior Design */}
              <div className="col-span-1 transform rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite] group">
                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                  <img 
                    src={pinInterior} 
                    alt="Interior Design" 
                    className="w-full h-32 lg:h-36 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">Modern Living Room Design</h4>
                    <p className="text-xs text-gray-600 mt-1">Interior • 2.4k saves</p>
                  </div>
                </div>
              </div>

              {/* Pin 2 - Fitness */}
              <div className="col-span-1 transform -rotate-1 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_0.5s] group">
                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                  <img 
                    src={pinFitness} 
                    alt="Fitness Workout" 
                    className="w-full h-40 lg:h-44 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">30-Min Home Workout</h4>
                    <p className="text-xs text-gray-600 mt-1">Fitness • 5.1k saves</p>
                  </div>
                </div>
              </div>

              {/* Pin 3 - Travel */}
              <div className="col-span-1 transform rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_1s] group">
                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                  <img 
                    src={pinTravel} 
                    alt="Travel Destination" 
                    className="w-full h-28 lg:h-32 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">Hidden Gems Europe</h4>
                    <p className="text-xs text-gray-600 mt-1">Travel • 8.2k saves</p>
                  </div>
                </div>
              </div>

              {/* Pin 4 - Recipes */}
              <div className="col-span-1 transform -rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_1.5s] group">
                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                  <img 
                    src={pinRecipes} 
                    alt="Healthy Recipe" 
                    className="w-full h-36 lg:h-40 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">Quick Pasta Recipe</h4>
                    <p className="text-xs text-gray-600 mt-1">Food • 3.7k saves</p>
                  </div>
                </div>
              </div>

              {/* Pin 5 - Business */}
              <div className="col-span-2 transform rotate-1 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_2s] group">
                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                  <img 
                    src={pinBusiness} 
                    alt="Business Tips" 
                    className="w-full h-24 lg:h-28 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">Productivity Tips for Entrepreneurs</h4>
                    <p className="text-xs text-gray-600 mt-1">Business • 6.9k saves</p>
                  </div>
                </div>
              </div>

              {/* Pin 6 - Interior (small) */}
              <div className="col-span-1 transform -rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_0.8s] group">
                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                  <img 
                    src={pinInterior} 
                    alt="Minimalist Decor" 
                    className="w-full h-32 lg:h-36 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">Minimalist Bedroom</h4>
                    <p className="text-xs text-gray-600 mt-1">Decor • 4.3k saves</p>
                  </div>
                </div>
              </div>

              {/* Pin 7 - Travel (wide) */}
              <div className="col-span-2 transform rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-300 animate-[float_3s_ease-in-out_infinite_1.2s] group">
                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                  <img 
                    src={pinTravel} 
                    alt="Beach Vacation" 
                    className="w-full h-28 lg:h-32 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">Best Beach Destinations 2024</h4>
                    <p className="text-xs text-gray-600 mt-1">Travel • 12.5k saves</p>
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