import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PinGenerator() {
  const { t } = useLanguage();
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!url) return;
    
    setIsGenerating(true);
    // Simulamos la generación por ahora
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <section className="py-20 px-4 bg-background/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('generator.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('generator.subtitle')}
          </p>
        </div>

        <Card className="shadow-card border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{t('generator.title')}</CardTitle>
            <CardDescription>
              {t('generator.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Input
                placeholder={t('generator.placeholder')}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="text-lg h-12"
              />
              <Button 
                variant="gradient" 
                size="lg" 
                onClick={handleGenerate}
                disabled={!url || isGenerating}
                className="px-8"
              >
                {isGenerating ? "Generando..." : t('generator.button')}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "🎨", title: "Creador de plantillas", desc: "Diseños únicos" },
                { icon: "✏️", title: "Editor múltiple", desc: "Edita varios pines" },
                { icon: "$", title: "Generaciones gratuitas", desc: "Prueba sin límites" },
                { icon: "🔗", title: "Perfiles ilimitados", desc: "Conecta todas tus cuentas" }
              ].map((feature, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-background/50">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <div className="font-semibold text-sm">{feature.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{feature.desc}</div>
                </div>
              ))}
            </div>

            {isGenerating && (
              <div className="bg-gradient-primary/10 rounded-lg p-6 border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-semibold">Generando tus pines...</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>✓ Analizando contenido de la URL</div>
                  <div>✓ Extrayendo títulos y texto relevante</div>
                  <div>⏳ Generando múltiples variaciones...</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[9/16] bg-gradient-secondary rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div>
                      <Badge className="bg-white/20 text-white mb-2">Ejemplo {i}</Badge>
                      <h3 className="font-bold text-lg leading-tight">
                        Tu Título Aquí
                      </h3>
                    </div>
                    <div className="text-xs opacity-80">
                      tudominio.com
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}