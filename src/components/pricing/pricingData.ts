import { PricingPlan } from "./PricingCard";

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    originalPrice: "$19",
    launchPrice: "$13",
    savings: "$6",
    period: "/mes",
    description: "Ideal para bloggers y emprendedores",
    features: [
      "25 pines únicos por mes",
      "Imágenes generadas con IA",
      "Textos optimizados con GPT",
      "Descarga en alta resolución",
      "Soporte por email"
    ],
    popular: false,
    isLaunchOffer: true
  },
  {
    name: "Pro",
    originalPrice: "$49",
    launchPrice: "$34",
    savings: "$15",
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
    popular: true,
    isLaunchOffer: true
  },
  {
    name: "Agency",
    originalPrice: "$149",
    launchPrice: "$112",
    savings: "$37",
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
    popular: false,
    isLaunchOffer: true
  }
];