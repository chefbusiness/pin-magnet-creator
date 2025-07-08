import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-pins.jpg";

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
                <span className="inline-flex items-center gap-2">
                  <span className="text-primary">⚡🤖</span>
                  <span className="relative inline-block">
                    <span className="relative z-10 px-3 py-1 rounded-full text-foreground font-semibold">
                      {t('hero.subtitle')}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/80 to-orange-400/80 rounded-full animate-pulse"></span>
                  </span>
                </span>
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