
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import livingRoomScandinavian from "@/assets/examples/living-room-scandinavian.png";
import livingRoomSmallSpace from "@/assets/examples/living-room-small-space.png";
import livingRoomBohemian from "@/assets/examples/living-room-bohemian.png";

interface NicheExamplePinsProps {
  nicheName: string;
  categorySlug: string;
  categoryEmoji: string;
}

const getExamplesForNiche = (categorySlug: string, nicheName: string) => {
  // Ejemplos específicos para decoración de sala de estar
  if (categorySlug === 'home-decor' && nicheName.toLowerCase().includes('sala')) {
    return [
      {
        title: "Sala de Estar Escandinava: 7 Ideas que Transformarán tu Hogar",
        description: "Descubre cómo crear una sala acogedora con estilo nórdico. Muebles de madera clara, textiles suaves y plantas naturales.",
        tags: ["Escandinavo", "Fotografía Real"],
        imageUrl: livingRoomScandinavian
      },
      {
        title: "Decoración de Sala Pequeña: Maximiza tu Espacio con Estilo",
        description: "Ideas inteligentes para salas compactas. Soluciones de almacenaje y trucos visuales que amplían el espacio.",
        tags: ["Pequeña", "Aesthetic"],
        imageUrl: livingRoomSmallSpace
      },
      {
        title: "Tendencia 2024: Salas Bohemias con Plantas y Texturas",
        description: "El estilo boho está de vuelta. Cojines étnicos, plantas colgantes y alfombras texturizadas para crear un oasis urbano.",
        tags: ["Bohemio", "Con Plantas"],
        imageUrl: livingRoomBohemian
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
        imageUrl: null // TODO: Crear imágenes para comida
      },
      {
        title: "Desayuno Healthy: Bowl de Açaí Aesthetic",
        description: "Desayuno nutritivo y fotogénico. Superfood, frutas frescas y toppings crujientes para empezar el día con energía.",
        tags: ["Flat Lay", "Saludable"],
        imageUrl: null // TODO: Crear imágenes para comida
      },
      {
        title: "Repostería Casera: Cookies Perfectas Paso a Paso",
        description: "Secretos de repostería profesional. Masa, cocción y decoración para cookies que conquistan Instagram.",
        tags: ["Close-up", "Lifestyle"],
        imageUrl: null // TODO: Crear imágenes para comida
      }
    ];
  }

  // Ejemplos genéricos como fallback
  return [
    {
      title: `Guía Completa: Todo sobre ${nicheName}`,
      description: "Los mejores consejos y trucos que necesitas conocer. Información actualizada y práctica para todos los niveles.",
      tags: ["Fotografía", "Aesthetic"],
      imageUrl: null // TODO: Crear imágenes genéricas
    },
    {
      title: `${nicheName}: Tendencias 2024 que Debes Conocer`,
      description: "Las últimas tendencias que marcarán este año. Mantente al día con las novedades más relevantes del sector.",
      tags: ["Minimalista", "Tendencias"],
      imageUrl: null // TODO: Crear imágenes genéricas
    },
    {
      title: `Secretos de ${nicheName} que los Expertos No Comparten`,
      description: "Tips exclusivos y técnicas avanzadas. Información valiosa para destacar y obtener mejores resultados.",
      tags: ["Ilustración", "Profesional"],
      imageUrl: null // TODO: Crear imágenes genéricas
    }
  ];
};

export const NicheExamplePins = ({ nicheName, categorySlug, categoryEmoji }: NicheExamplePinsProps) => {
  const examples = getExamplesForNiche(categorySlug, nicheName);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <span>{categoryEmoji}</span>
          Ejemplos de Pines para {nicheName}
        </h2>
        <p className="text-muted-foreground">
          Inspiración basada en pines exitosos de Pinterest para tu nicho específico
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {examples.map((example, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 relative">
              {example.imageUrl ? (
                <img 
                  src={example.imageUrl} 
                  alt={example.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <div className="text-sm font-medium">Próximamente</div>
                    <div className="text-xs opacity-80">Imagen de ejemplo</div>
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
                {example.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          💡 Estos ejemplos muestran cómo se verán tus pines para este nicho específico
        </p>
      </div>
    </div>
  );
};
