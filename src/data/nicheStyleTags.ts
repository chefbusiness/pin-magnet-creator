
export interface StyleTag {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
}

export interface TrendTag {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
}

export interface NicheStyleTags {
  [key: string]: {
    visualStyles: StyleTag[];
    trends: TrendTag[];
  };
}

export const nicheStyleTags: NicheStyleTags = {
  // Home & Decor
  'home-decor': {
    visualStyles: [
      {
        id: 'real-photography',
        name: 'Fotografía Real',
        description: 'Imágenes fotográficas reales',
        promptModifier: 'high-quality interior photography, realistic lighting, professional home staging'
      },
      {
        id: 'illustration-style',
        name: 'Ilustración',
        description: 'Estilo ilustrado y artístico',
        promptModifier: 'illustrated home decor, artistic rendering, stylized interior design'
      },
      {
        id: 'hyperrealistic',
        name: 'Hiperrealista',
        description: 'Imágenes ultra detalladas',
        promptModifier: 'hyperrealistic interior rendering, ultra-detailed, photorealistic quality'
      }
    ],
    trends: [
      {
        id: 'scandinavian',
        name: 'Escandinavo',
        description: 'Estilo nórdico minimalista',
        promptModifier: 'scandinavian nordic style, light woods, neutral colors, hygge aesthetic'
      },
      {
        id: 'bohemian',
        name: 'Bohemio',
        description: 'Estilo boho con texturas',
        promptModifier: 'bohemian boho style, macrame, plants, warm textures, earthy tones'
      },
      {
        id: 'modern-industrial',
        name: 'Industrial Moderno',
        description: 'Estilo industrial contemporáneo',
        promptModifier: 'modern industrial style, metal accents, concrete, exposed brick'
      },
      {
        id: 'vintage-retro',
        name: 'Vintage',
        description: 'Estilo retro y nostálgico',
        promptModifier: 'vintage retro style, antique furniture, nostalgic elements'
      },
      {
        id: 'minimalist-modern',
        name: 'Moderna',
        description: 'Tendencia moderna y limpia',
        promptModifier: 'modern contemporary style, clean lines, sleek furniture'
      },
      {
        id: 'aesthetic-cozy',
        name: 'Aesthetic',
        description: 'Estilo aesthetic acogedor',
        promptModifier: 'aesthetic cozy vibes, soft lighting, Instagram-worthy'
      },
      {
        id: 'small-space',
        name: 'Pequeña',
        description: 'Optimizada para espacios pequeños',
        promptModifier: 'small space optimization, compact living, space-saving solutions'
      },
      {
        id: 'plant-filled',
        name: 'Con Plantas',
        description: 'Decoración con plantas abundantes',
        promptModifier: 'plant-filled space, indoor jungle, botanical decor'
      },
      {
        id: 'rustic-charm',
        name: 'Rústica',
        description: 'Encanto rústico y natural',
        promptModifier: 'rustic charm, natural materials, farmhouse style'
      },
      {
        id: 'simple-minimal',
        name: 'Sencilla',
        description: 'Decoración sencilla y funcional',
        promptModifier: 'simple minimal decor, functional design, uncluttered'
      }
    ]
  },
  
  // Food & Recipes
  'food-recipes': {
    visualStyles: [
      {
        id: 'food-photography',
        name: 'Fotografía Gastronómica',
        description: 'Fotos profesionales de comida',
        promptModifier: 'professional food photography, appetizing presentation, studio lighting'
      },
      {
        id: 'illustration-food',
        name: 'Ilustración Comida',
        description: 'Estilo ilustrado cartoon',
        promptModifier: 'food illustration, cartoon style, colorful and playful food art'
      },
      {
        id: 'hyperrealistic-food',
        name: 'Hiperrealista',
        description: 'Comida ultra realista',
        promptModifier: 'hyperrealistic food rendering, ultra-detailed, photorealistic quality'
      }
    ],
    trends: [
      {
        id: 'flat-lay-food',
        name: 'Flat Lay',
        description: 'Vista cenital de ingredientes',
        promptModifier: 'flat lay food styling, top-down view, ingredient arrangement'
      },
      {
        id: 'lifestyle-cooking',
        name: 'Lifestyle',
        description: 'Escenas de cocina lifestyle',
        promptModifier: 'lifestyle cooking scene, homey kitchen atmosphere'
      },
      {
        id: 'macro-closeup',
        name: 'Close-up',
        description: 'Primeros planos detallados',
        promptModifier: 'macro close-up food photography, detailed texture'
      },
      {
        id: 'healthy-aesthetic',
        name: 'Saludable',
        description: 'Comida saludable aesthetic',
        promptModifier: 'healthy food aesthetic, fresh ingredients, clean eating'
      },
      {
        id: 'comfort-food',
        name: 'Comfort Food',
        description: 'Comida reconfortante',
        promptModifier: 'comfort food vibes, cozy home cooking, hearty meals'
      }
    ]
  },
  
  // Fashion & Beauty
  'fashion-beauty': {
    visualStyles: [
      {
        id: 'model-photography',
        name: 'Fotografía con Modelo',
        description: 'Fotos con modelos',
        promptModifier: 'fashion model photography, professional styling, portrait lighting'
      },
      {
        id: 'illustration-fashion',
        name: 'Ilustración Fashion',
        description: 'Ilustraciones de moda',
        promptModifier: 'fashion illustration, stylized clothing art, editorial drawing'
      }
    ],
    trends: [
      {
        id: 'flat-lay-fashion',
        name: 'Flat Lay',
        description: 'Vista cenital de outfits',
        promptModifier: 'fashion flat lay, outfit arrangement, styling composition'
      },
      {
        id: 'street-style',
        name: 'Street Style',
        description: 'Estilo urbano casual',
        promptModifier: 'street style fashion, urban setting, candid lifestyle'
      },
      {
        id: 'vintage-fashion',
        name: 'Vintage',
        description: 'Moda retro y vintage',
        promptModifier: 'vintage fashion style, retro clothing, nostalgic aesthetic'
      },
      {
        id: 'minimalist-chic',
        name: 'Minimalista',
        description: 'Estilo minimalista chic',
        promptModifier: 'minimalist chic fashion, clean aesthetic, simple elegance'
      }
    ]
  },
  
  // Health & Wellness
  'health-wellness': {
    visualStyles: [
      {
        id: 'lifestyle-wellness',
        name: 'Lifestyle',
        description: 'Escenas de vida saludable',
        promptModifier: 'wellness lifestyle photography, natural lighting, peaceful atmosphere'
      },
      {
        id: 'illustration-health',
        name: 'Ilustración',
        description: 'Gráficos e ilustraciones',
        promptModifier: 'health illustration, informative graphics, clean design'
      }
    ],
    trends: [
      {
        id: 'natural-organic',
        name: 'Natural',
        description: 'Estilo natural y orgánico',
        promptModifier: 'natural organic style, earth tones, botanical elements'
      },
      {
        id: 'self-care-aesthetic',
        name: 'Self Care',
        description: 'Aesthetic de autocuidado',
        promptModifier: 'self care aesthetic, spa vibes, wellness routine'
      },
      {
        id: 'fitness-motivation',
        name: 'Fitness',
        description: 'Motivación fitness',
        promptModifier: 'fitness motivation, active lifestyle, workout aesthetic'
      }
    ]
  },
  
  // Default fallback
  'default': {
    visualStyles: [
      {
        id: 'photography',
        name: 'Fotografía',
        description: 'Estilo fotográfico real',
        promptModifier: 'high-quality photography, professional lighting, realistic style'
      },
      {
        id: 'illustration',
        name: 'Ilustración',
        description: 'Estilo ilustrado',
        promptModifier: 'illustration style, artistic rendering, stylized design'
      }
    ],
    trends: [
      {
        id: 'minimalist',
        name: 'Minimalista',
        description: 'Estilo limpio y minimalista',
        promptModifier: 'minimalist design, clean aesthetic, simple composition'
      },
      {
        id: 'aesthetic',
        name: 'Aesthetic',
        description: 'Estilo aesthetic moderno',
        promptModifier: 'aesthetic style, Instagram-worthy, trendy design'
      }
    ]
  }
};

export const getStyleTagsForNiche = (categorySlug: string) => {
  const categoryMap: { [key: string]: string } = {
    'home-decor': 'home-decor',
    'decoracion-hogar': 'home-decor',  
    'food': 'food-recipes',
    'comida': 'food-recipes',
    'recipes': 'food-recipes',
    'recetas': 'food-recipes',
    'fashion': 'fashion-beauty',
    'moda': 'fashion-beauty',
    'beauty': 'fashion-beauty',
    'belleza': 'fashion-beauty',
    'health': 'health-wellness',
    'salud': 'health-wellness',
    'wellness': 'health-wellness',
    'bienestar': 'health-wellness'
  };
  
  const styleCategory = categoryMap[categorySlug] || 'default';
  return nicheStyleTags[styleCategory] || nicheStyleTags.default;
};
