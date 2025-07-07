import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Pricing() {
  const { t } = useLanguage();
  
  const plans = [
    {
      name: "Starter",
      price: "$19",
      period: "/mes",
      description: "Ideal para bloggers y emprendedores",
      features: [
        "25 pines únicos por mes",
        "Imágenes generadas con IA",
        "Textos optimizados con GPT",
        "Descarga en alta resolución",
        "Soporte por email"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$49",
      period: "/mes",
      description: "Para marketers y agencias pequeñas",
      features: [
        "150 pines únicos por mes",
        "Imágenes generadas con IA",
        "Textos optimizados con GPT",
        "Múltiples estilos visuales",
        "Análisis de rendimiento",
        "Soporte prioritario"
      ],
      popular: true
    },
    {
      name: "Agency",
      price: "$149",
      period: "/mes",
      description: "Para agencias y equipos grandes",
      features: [
        "500 pines únicos por mes",
        "Imágenes generadas con IA",
        "Textos optimizados con GPT",
        "API access completo",
        "Gestión multi-cliente",
        "Branding personalizado",
        "Soporte dedicado 24/7"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-background/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`shadow-card border-0 relative ${
                plan.popular 
                  ? 'bg-gradient-primary text-white scale-105 shadow-2xl' 
                  : 'bg-card/80 backdrop-blur-sm hover:shadow-primary/10 transition-all duration-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-white text-primary font-semibold px-4 py-1">
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className={`text-2xl ${plan.popular ? 'text-white' : ''}`}>
                  {plan.name}
                </CardTitle>
                <div className="py-4">
                  <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-primary'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {plan.period}
                  </span>
                </div>
                <CardDescription className={plan.popular ? 'text-white/90' : ''}>
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.popular ? 'bg-white/20' : 'bg-primary/20'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          plan.popular ? 'bg-white' : 'bg-primary'
                        }`}></div>
                      </div>
                      <span className={`text-sm ${
                        plan.popular ? 'text-white' : 'text-foreground'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "secondary" : "gradient"}
                  size="lg"
                >
                  {plan.popular ? "Comenzar Ahora" : "Probar Gratis"}
                </Button>
                
                <p className={`text-xs text-center ${
                  plan.popular ? 'text-white/70' : 'text-muted-foreground'
                }`}>
                  Sin compromiso • Cancela cuando quieras
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            ¿Necesitas más de 500 pines por mes? 
          </p>
          <Button variant="outline" size="lg">
            Contactar Ventas para Plan Enterprise
          </Button>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-4 py-2 border border-primary/20">
            <span className="text-sm font-medium">🤖 Generado con IA</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-sm font-medium">✨ Textos con GPT</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-sm font-medium">🎨 Imágenes únicas</span>
          </div>
        </div>
      </div>
    </section>
  );
}