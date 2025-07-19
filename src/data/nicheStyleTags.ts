
export interface StyleTag {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
}

export interface NicheStyleTags {
  [key: string]: StyleTag[];
}

export const nicheStyleTags: NicheStyleTags = {
  // Home & Decor
  'home-decor': [
    {
      id: 'scandinavian',
      name: 'Escandinavo',
      description: 'Estilo nórdico minimalista',
      promptModifier: 'scandinavian minimalist style, light woods, neutral colors, clean lines'
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
      promptModifier: 'modern industrial style, metal accents, concrete, exposed brick, urban aesthetic'
    },
    {
      id: 'vintage-retro',
      name: 'Vintage',
      description: 'Estilo retro y vintage',
      promptModifier: 'vintage retro style, antique furniture, nostalgic elements, warm lighting'
    },
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
    }
  ],
  
  // Food & Recipes
  'food-recipes': [
    {
      id: 'food-photography',
      name: 'Fotografía Gastronómica',
      description: 'Fotos profesionales de comida',
      promptModifier: 'professional food photography, appetizing presentation, studio lighting'
    },
    {
      id: 'flat-lay-food',
      name: 'Flat Lay',
      description: 'Vista cenital de ingredientes',
      promptModifier: 'flat lay food styling, top-down view, ingredient arrangement, clean background'
    },
    {
      id: 'lifestyle-cooking',
      name: 'Lifestyle Cocina',
      description: 'Escenas de cocina lifestyle',
      promptModifier: 'lifestyle cooking scene, homey kitchen atmosphere, natural lighting'
    },
    {
      id: 'macro-closeup',
      name: 'Macro Close-up',
      description: 'Primeros planos detallados',
      promptModifier: 'macro close-up food photography, detailed texture, shallow depth of field'
    },
    {
      id: 'illustration-food',
      name: 'Ilustración Comida',
      description: 'Estilo ilustrado cartoon',
      promptModifier: 'food illustration, cartoon style, colorful and playful food art'
    },
    {
      id: 'hyperrealistic',
      name: 'Hiperrealista',
      description: 'Imágenes ultra realistas',
      promptModifier: 'hyperrealistic food rendering, ultra-detailed, photorealistic quality'
    }
  ],
  
  // Fashion & Beauty
  'fashion-beauty': [
    {
      id: 'model-photography',
      name: 'Fotografía con Modelo',
      description: 'Fotos con modelos',
      promptModifier: 'fashion model photography, professional styling, portrait lighting'
    },
    {
      id: 'flat-lay-fashion',
      name: 'Flat Lay Moda',
      description: 'Vista cenital de outfits',
      promptModifier: 'fashion flat lay, outfit arrangement, styling composition, clean background'
    },
    {
      id: 'street-style',
      name: 'Street Style',
      description: 'Estilo urbano casual',
      promptModifier: 'street style fashion, urban setting, candid lifestyle photography'
    },
    {
      id: 'editorial-fashion',
      name: 'Editorial',
      description: 'Estilo editorial de revista',
      promptModifier: 'editorial fashion photography, high-fashion styling, dramatic lighting'
    },
    {
      id: 'vintage-fashion',
      name: 'Vintage Fashion',
      description: 'Estilo retro y vintage',
      promptModifier: 'vintage fashion style, retro clothing, nostalgic aesthetic, film photography'
    },
    {
      id: 'beauty-closeup',
      name: 'Beauty Close-up',
      description: 'Primeros planos de belleza',
      promptModifier: 'beauty close-up photography, skincare focus, natural lighting, minimal makeup'
    }
  ],
  
  // Health & Wellness
  'health-wellness': [
    {
      id: 'lifestyle-wellness',
      name: 'Lifestyle Wellness',
      description: 'Escenas de vida saludable',
      promptModifier: 'wellness lifestyle photography, natural lighting, peaceful atmosphere'
    },
    {
      id: 'product-photography',
      name: 'Fotografía Producto',
      description: 'Fotos de productos wellness',
      promptModifier: 'clean product photography, minimalist background, professional lighting'
    },
    {
      id: 'illustration-health',
      name: 'Ilustración Salud',
      description: 'Gráficos e ilustraciones',
      promptModifier: 'health illustration, informative graphics, clean design, medical accuracy'
    },
    {
      id: 'natural-organic',
      name: 'Natural Orgánico',
      description: 'Estilo natural y orgánico',
      promptModifier: 'natural organic style, earth tones, botanical elements, eco-friendly aesthetic'
    }
  ],
  
  // Default fallback for any niche
  'default': [
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
    },
    {
      id: 'minimalist',
      name: 'Minimalista',
      description: 'Estilo limpio y minimalista',
      promptModifier: 'minimalist design, clean aesthetic, simple composition'
    }
  ]
};

export const getStyleTagsForNiche = (categorySlug: string): StyleTag[] => {
  // Map category slugs to style tag categories
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
