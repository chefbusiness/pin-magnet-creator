import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePinGeneration, type GenerationResult } from "@/hooks/usePinGeneration";
import { Download, ExternalLink, Lock } from "lucide-react";

export function PinGenerator() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<GenerationResult | null>(null);
  const { generatePins, isGenerating, progress } = usePinGeneration();

  const handleGenerate = async () => {
    if (!url) return;
    
    const result = await generatePins(url, user);
    if (result) {
      setResults(result);
    }
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
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
                {isGenerating ? (progress || "Generando...") : t('generator.button')}
              </Button>
            </div>

            {!user ? (
              <div className="bg-gradient-primary/10 rounded-lg p-6 border border-primary/20 text-center">
                <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Autenticación Requerida</h3>
                <p className="text-muted-foreground mb-4">
                  Inicia sesión para generar pines únicos con IA. Sin pruebas gratuitas - solo resultados premium.
                </p>
                <Button variant="gradient" size="lg" onClick={() => window.location.href = '/auth'}>
                  Iniciar Sesión
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: "🤖", title: "IA Generativa", desc: "Imágenes únicas" },
                  { icon: "✨", title: "GPT Optimizado", desc: "Textos perfectos" },
                  { icon: "🎯", title: "Pinterest Ready", desc: "Listos para subir" },
                  { icon: "📈", title: "Alta Conversión", desc: "Más engagement" }
                ].map((feature, index) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-background/50">
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <div className="font-semibold text-sm">{feature.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{feature.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {isGenerating && (
              <div className="bg-gradient-primary/10 rounded-lg p-6 border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-semibold">{progress || "Generando tus pines..."}</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className={progress.includes('Analizando') ? 'text-primary' : 'opacity-50'}>
                    {progress.includes('Analizando') ? '⏳' : '✓'} Analizando contenido de la URL
                  </div>
                  <div className={progress.includes('texto') ? 'text-primary' : 'opacity-50'}>
                    {progress.includes('texto') ? '⏳' : progress.includes('Generando') ? '✓' : '○'} Generando texto optimizado
                  </div>
                  <div className={progress.includes('imagen') ? 'text-primary' : 'opacity-50'}>
                    {progress.includes('imagen') ? '⏳' : progress.includes('exitosa') ? '✓' : '○'} Creando imágenes profesionales
                  </div>
                </div>
              </div>
            )}

            {results && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    🎉 ¡{results.count} pines generados!
                  </h3>
                  <Badge variant="secondary">
                    URL: {results.urlAnalysis.title || 'Contenido analizado'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.pins.map((pin, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-[9/16] relative">
                        <img 
                          src={pin.imageUrl} 
                          alt={pin.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzM2IiBoZWlnaHQ9IjExMDQiIHZpZXdCb3g9IjAgMCA3MzYgMTEwNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjczNiIgaGVpZ2h0PSIxMTA0IiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjM2OCIgeT0iNTUyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPkVycm9yIGFsIGNhcmdhciBpbWFnZW48L3RleHQ+Cjwvc3ZnPg==';
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="bg-white/90">
                            {pin.style}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                          {pin.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {pin.description}
                        </p>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadImage(pin.imageUrl, `pin-${index + 1}-${pin.style}.png`)}
                            className="flex-1"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Descargar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(pin.imageUrl, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    💡 <strong>Tip:</strong> Descarga las imágenes y súbelas a Pinterest con sus respectivos títulos y descripciones para mejores resultados.
                  </p>
                </div>
              </div>
            )}

            {!results && !isGenerating && (
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
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}