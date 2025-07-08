import { PricingPlan } from "./PricingCard";

export const createPricingPlans = (t: (key: string) => string): PricingPlan[] => [
  {
    name: t('pricing.planStarter'),
    originalPrice: "$19",
    launchPrice: "$13",
    savings: "$6",
    period: t('pricing.perMonth'),
    description: t('pricing.starterDesc'),
    features: [
      `25 ${t('pricing.feature1')}`,
      t('pricing.feature2'),
      t('pricing.feature3'),
      t('pricing.feature4'),
      t('pricing.feature5')
    ],
    popular: false,
    isLaunchOffer: true
  },
  {
    name: t('pricing.planPro'),
    originalPrice: "$49",
    launchPrice: "$34",
    savings: "$15",
    period: t('pricing.perMonth'),
    description: t('pricing.proDesc'),
    features: [
      `150 ${t('pricing.feature1')}`,
      t('pricing.feature2'),
      t('pricing.feature3'),
      t('pricing.feature6'),
      t('pricing.feature7'),
      t('pricing.feature8')
    ],
    popular: true,
    isLaunchOffer: true
  },
  {
    name: t('pricing.planAgency'),
    originalPrice: "$149",
    launchPrice: "$112",
    savings: "$37",
    period: t('pricing.perMonth'),
    description: t('pricing.agencyDesc'),
    features: [
      `500 ${t('pricing.feature1')}`,
      t('pricing.feature2'),
      t('pricing.feature3'),
      t('pricing.feature9'),
      t('pricing.feature10'),
      t('pricing.feature11'),
      t('pricing.feature12')
    ],
    popular: false,
    isLaunchOffer: true
  }
];