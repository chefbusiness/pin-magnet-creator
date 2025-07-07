import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Features() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: "🎯",
      title: "Extracción Automática",
      description: "Analiza automáticamente el contenido de tu URL y extrae los elementos más importantes para crear pines efectivos."
    },
    {
      icon: "🎨",
      title: "Múltiples Variaciones",
      description: "Genera hasta 10 diseños diferentes del mismo contenido con estilos, colores y layouts únicos."
    },
    {
      icon: "📱",
      title: "Optimizado para Pinterest",
      description: "Todos los pines se crean en formato 9:16 optimizado para máximo engagement en Pinterest."
    },
    {
      icon: "⚡",
      title: "Generación Instantánea",
      description: "De URL a pines listos en menos de 30 segundos. Sin esperas, sin complicaciones."
    },
    {
      icon: "🔄",
      title: "Programación Automática",
      description: "Programa tus pines para publicarse automáticamente en el mejor momento para tu audiencia."
    },
    {
      icon: "📊",
      title: "Analytics Integrado",
      description: "Trackea el rendimiento de tus pines y optimiza tu estrategia de contenido."
    }
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card border-0 bg-card/80 backdrop-blur-sm hover:shadow-primary/10 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-primary rounded-3xl p-8 lg:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                ¿Listo para 10x tu Tráfico de Pinterest?
              </h3>
              <p className="text-xl opacity-90 mb-6">
                Únete a miles de creators que ya están generando más tráfico con menos esfuerzo.
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Resultados en 24h</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">2.5M+</div>
                <div className="text-sm opacity-80">Pines generados</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">150%</div>
                <div className="text-sm opacity-80">Aumento promedio de tráfico</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}