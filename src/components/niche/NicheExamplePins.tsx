
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NicheExamplePinsProps {
  nicheName: string;
  categorySlug: string;
  categoryEmoji: string;
}

interface ExamplePin {
  title: string;
  description: string;
  imageUrl?: string;
  style: string;
  error?: string;
}

const getPlaceholderExamples = (categorySlug: string, nicheName: string) => {
  // Ejemplos específicos para decoración de sala de estar
  if (categorySlug === 'home-decor' && nicheName.toLowerCase().includes('sala')) {
    return [
      {
        title: "Sala de Estar Escandinava: 7 Ideas que Transformarán tu Hogar",
        description: "Descubre cómo crear una sala acogedora con estilo nórdico. Muebles de madera clara, textiles suaves y plantas naturales.",
        tags: ["Escandinavo", "Fotografía Real"],
        style: "Imagen de una sala moderna con sofá beige, mesa de madera clara, plantas verdes y luz natural, con overlay de texto elegante en la esquina superior."
      },
      {
        title: "Decoración de Sala Pequeña: Maximiza tu Espacio con Estilo",
        description: "Ideas inteligentes para salas compactas. Soluciones de almacenaje y trucos visuales que amplían el espacio.",
        tags: ["Pequeña", "Aesthetic"],
        style: "Fotografía de sala compacta con muebles multifuncionales, colores claros y espejo grande, texto overlay discreto en esquina inferior."
      },
      {
        title: "Tendencia 2024: Salas Bohemias con Plantas y Texturas",
        description: "El estilo boho está de vuelta. Cojines étnicos, plantas colgantes y alfombras texturizadas para crear un oasis urbano.",
        tags: ["Bohemio", "Con Plantas"],
        style: "Imagen de sala boho con macramé, plantas abundantes, cojines coloridos y texturas naturales, con texto integrado sutilmente."
      }
    ];
  }

  // Ejemplos para otras categorías de comida
  if (categorySlug === 'food' || categorySlug === 'comida') {
    return [
      {
        title: "Receta Viral: Pasta Cremosa en 15 Minutos",
        description: "La receta que arrasa en TikTok. Ingredientes simples, resultado espectacular. ¡Perfecta para cenas rápidas!",
        tags: ["Fotografía Gastronómica", "Comfort Food"],
        style: "Foto profesional de pasta cremosa con queso derretido, hierbas frescas, texto overlay elegante sin cubrir el plato."
      },
      {
        title: "Desayuno Healthy: Bowl de Açaí Aesthetic",
        description: "Desayuno nutritivo y fotogénico. Superfood, frutas frescas y toppings crujientes para empezar el día con energía.",
        tags: ["Flat Lay", "Saludable"],
        style: "Vista cenital de bowl colorido con frutas, granola y flores comestibles, texto minimalista en esquina."
      },
      {
        title: "Repostería Casera: Cookies Perfectas Paso a Paso",
        description: "Secretos de repostería profesional. Masa, cocción y decoración para cookies que conquistan Instagram.",
        tags: ["Close-up", "Lifestyle"],
        style: "Primer plano de cookies artesanales con textura detallada, ambiente hogareño, overlay discreto."
      }
    ];
  }

  // Ejemplos genéricos como fallback
  return [
    {
      title: `Guía Completa: Todo sobre ${nicheName}`,
      description: "Los mejores consejos y trucos que necesitas conocer. Información actualizada y práctica para todos los niveles.",
      tags: ["Fotografía", "Aesthetic"],
      style: "Imagen profesional relacionada con el nicho, con texto overlay bien integrado."
    },
    {
      title: `${nicheName}: Tendencias 2024 que Debes Conocer`,
      description: "Las últimas tendencias que marcarán este año. Mantente al día con las novedades más relevantes del sector.",
      tags: ["Minimalista", "Tendencias"],
      style: "Diseño moderno y limpio con elementos visuales del nicho, texto elegante y legible."
    },
    {
      title: `Secretos de ${nicheName} que los Expertos No Comparten`,
      description: "Tips exclusivos y técnicas avanzadas. Información valiosa para destacar y obtener mejores resultados.",
      tags: ["Ilustración", "Profesional"],
      style: "Composición ilustrada con elementos gráficos, texto destacado pero sin dominar la imagen."
    }
  ];
};

export const NicheExamplePins = ({ nicheName, categorySlug, categoryEmoji }: NicheExamplePinsProps) => {
  const [examplePins, setExamplePins] = useState<ExamplePin[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  
  const placeholderExamples = getPlaceholderExamples(categorySlug, nicheName);

  const generateExamples = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-niche-examples', {
        body: {
          categorySlug,
          nicheName
        }
      });

      if (error) {
        console.error('Error generating examples:', error);
        return;
      }

      setExamplePins(data.data.examples);
      setHasGenerated(true);
    } catch (error) {
      console.error('Error generating examples:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <span>{categoryEmoji}</span>
          Ejemplos de Pines para {nicheName}
        </h2>
        <p className="text-muted-foreground mb-4">
          {hasGenerated 
            ? "Pines de ejemplo generados con IA usando las mismas especificaciones que tus pines reales"
            : "Inspiración basada en pines exitosos de Pinterest para tu nicho específico"
          }
        </p>
        
        {!hasGenerated && (
          <Button
            onClick={generateExamples}
            disabled={isGenerating}
            className="mb-6"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando Ejemplos Reales...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generar Ejemplos Reales con IA
              </>
            )}
          </Button>
        )}

        {hasGenerated && (
          <Button
            onClick={generateExamples}
            disabled={isGenerating}
            variant="outline"
            className="mb-6"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Regenerando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerar Ejemplos
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {(hasGenerated ? examplePins : placeholderExamples).map((example, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 relative">
              {hasGenerated && example.imageUrl ? (
                <img 
                  src={example.imageUrl} 
                  alt={example.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                  <div className="text-white">
                    <div className="text-xs opacity-80 mb-1">Ejemplo de diseño:</div>
                    <div className="text-sm font-medium leading-tight">
                      {hasGenerated ? example.style : (placeholderExamples[index]?.style || 'Diseño personalizado')}
                    </div>
                  </div>
                </div>
              )}
              
              {hasGenerated && example.error && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <div className="text-sm font-medium">Error generando imagen</div>
                    <div className="text-xs opacity-80">{example.error}</div>
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                {example.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {example.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {hasGenerated ? (
                  <Badge variant="default" className="text-xs">
                    IA Generado
                  </Badge>
                ) : (
                  (placeholderExamples[index]?.tags || []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {hasGenerated 
            ? "✨ Estos son ejemplos reales generados con las mismas especificaciones que usarás para tus pines"
            : "💡 Genera ejemplos reales para ver cómo se verán tus pines con las especificaciones actuales"
          }
        </p>
      </div>
    </div>
  );
};
