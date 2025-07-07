import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  es: {
    // Header
    'nav.home': 'Inicio',
    'nav.features': 'Características',
    'nav.pricing': 'Precios',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Perfil',
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    
    // Hero
    'hero.title': 'Crea 1 Mes de Contenido para Pinterest',
    'hero.subtitle': 'En 1 Minuto',
    'hero.description': 'Crear pines atractivos solía tomar horas. Hemos reducido el proceso a segundos. Simplemente ingresa la URL de tu contenido y genera múltiples variaciones profesionales.',
    'hero.cta': 'Generar Mis Pines',
    'hero.tutorial': 'Ver Tutorial (1 min)',
    'hero.feature1': 'Automatización completa',
    'hero.feature2': 'IA text writer',
    'hero.feature3': 'Programación masiva',
    
    // Pin Generator
    'generator.title': 'Generador de Pines',
    'generator.subtitle': 'Convierte cualquier URL en múltiples pines atractivos',
    'generator.placeholder': 'Pega aquí la URL de tu artículo o contenido...',
    'generator.button': 'Generar Pines',
    
    // Features
    'features.title': 'Todo lo que necesitas para dominar Pinterest',
    'features.subtitle': 'Herramientas poderosas para crear contenido que convierte',
    
    // Pricing
    'pricing.title': 'Planes diseñados para crecer contigo',
    'pricing.subtitle': 'Desde emprendedores hasta agencias, tenemos el plan perfecto',
    
    // Footer
    'footer.description': 'La plataforma más avanzada para generar contenido de Pinterest que convierte.',
    'footer.product': 'Producto',
    'footer.company': 'Empresa',
    'footer.support': 'Soporte',
    'footer.rights': 'Todos los derechos reservados.',
    
    // Pinterest Guide
    'guide.badge': 'Guía Completa de Pinterest',
    'guide.title': 'Lista Ampliada de Sectores para',
    'guide.titleHighlight': 'Imágenes de PIN',
    'guide.description': 'Pinterest es una plataforma visual con más de 433 millones de usuarios activos mensuales que buscan inspiración, ideas y productos. Los PINs se organizan en categorías y nichos específicos que atienden a diferentes intereses y necesidades.',
    'guide.topSectors': '🏆 Top 10 Sectores Más Populares',
    'guide.otherSectors': '📈 Otros Sectores Importantes',
    'guide.nicheSectors': '🎯 Nichos Especializados',
    'guide.conclusion': '💡 Conclusión',
    'guide.conclusionText': 'Pinterest ofrece oportunidades prácticamente ilimitadas para crear contenido visual atractivo en una amplia variedad de sectores. Desde los nichos más populares como decoración del hogar y recetas, hasta especializaciones como tecnología o sostenibilidad, cada sector tiene su audiencia específica y potencial de engagement.',
    'guide.subcategories': 'Subcategorías:',
    
    // Sectors
    'sector.homeDecor': 'Decoración del Hogar y DIY',
    'sector.recipes': 'Recetas y Comida',
    'sector.fashion': 'Moda Femenina',
    'sector.beauty': 'Belleza y Cuidado Personal',
    'sector.weddings': 'Bodas y Eventos',
    'sector.maternity': 'Maternidad y Bebés',
    'sector.travel': 'Viajes y Aventuras',
    'sector.fitness': 'Fitness y Ejercicio',
    'sector.health': 'Salud y Bienestar',
    'sector.photography': 'Fotografía e Inspiración',
    'sector.business': 'Negocios y Emprendimiento',
    'sector.education': 'Educación y Aprendizaje',
    'sector.art': 'Arte y Creatividad',
    'sector.technology': 'Tecnología y Gadgets',
    'sector.garden': 'Jardín y Plantas',
    'sector.gifts': 'Regalos y Ocasiones',
    'sector.pets': 'Mascotas y Animales',
    'sector.automotive': 'Automóviles y Transporte',
    'sector.sports': 'Deportes Específicos',
    'sector.music': 'Música e Instrumentos',
    'sector.literature': 'Literatura y Escritura',
    'sector.gaming': 'Gaming y Esports',
    'sector.techGadgets': 'Tecnología y Gadgets',
    'sector.history': 'Historia y Cultura',
    'sector.sustainability': 'Sostenibilidad y Vida Eco-Friendly',
    'sector.photographyNiche': 'Fotografía',
    'sector.planning': 'Planificación y Organización',
    'sector.psychology': 'Psicología y Desarrollo Personal',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    
    // Hero
    'hero.title': 'Create 1 Month of Pinterest Content',
    'hero.subtitle': 'In 1 Minute',
    'hero.description': 'Creating engaging pins used to take hours. We\'ve reduced the process to seconds. Simply enter your content URL and generate multiple professional variations.',
    'hero.cta': 'Generate My Pins',
    'hero.tutorial': 'Watch Tutorial (1 min)',
    'hero.feature1': 'Complete automation',
    'hero.feature2': 'AI text writer',
    'hero.feature3': 'Bulk scheduling',
    
    // Pin Generator
    'generator.title': 'Pin Generator',
    'generator.subtitle': 'Convert any URL into multiple engaging pins',
    'generator.placeholder': 'Paste your article or content URL here...',
    'generator.button': 'Generate Pins',
    
    // Features
    'features.title': 'Everything you need to master Pinterest',
    'features.subtitle': 'Powerful tools to create content that converts',
    
    // Pricing
    'pricing.title': 'Plans designed to grow with you',
    'pricing.subtitle': 'From entrepreneurs to agencies, we have the perfect plan',
    
    // Footer
    'footer.description': 'The most advanced platform for generating Pinterest content that converts.',
    'footer.product': 'Product',
    'footer.company': 'Company',
    'footer.support': 'Support',
    'footer.rights': 'All rights reserved.',
    
    // Pinterest Guide
    'guide.badge': 'Complete Pinterest Guide',
    'guide.title': 'Expanded List of Sectors for',
    'guide.titleHighlight': 'PIN Images',
    'guide.description': 'Pinterest is a visual platform with over 433 million monthly active users searching for inspiration, ideas and products. PINs are organized into specific categories and niches that cater to different interests and needs.',
    'guide.topSectors': '🏆 Top 10 Most Popular Sectors',
    'guide.otherSectors': '📈 Other Important Sectors',
    'guide.nicheSectors': '🎯 Specialized Niches',
    'guide.conclusion': '💡 Conclusion',
    'guide.conclusionText': 'Pinterest offers virtually unlimited opportunities to create attractive visual content in a wide variety of sectors. From the most popular niches like home decor and recipes, to specializations like technology or sustainability, each sector has its specific audience and engagement potential.',
    'guide.subcategories': 'Subcategories:',
    
    // Sectors
    'sector.homeDecor': 'Home Decoration and DIY',
    'sector.recipes': 'Recipes and Food',
    'sector.fashion': 'Women\'s Fashion',
    'sector.beauty': 'Beauty and Personal Care',
    'sector.weddings': 'Weddings and Events',
    'sector.maternity': 'Maternity and Babies',
    'sector.travel': 'Travel and Adventures',
    'sector.fitness': 'Fitness and Exercise',
    'sector.health': 'Health and Wellness',
    'sector.photography': 'Photography and Inspiration',
    'sector.business': 'Business and Entrepreneurship',
    'sector.education': 'Education and Learning',
    'sector.art': 'Art and Creativity',
    'sector.technology': 'Technology and Gadgets',
    'sector.garden': 'Garden and Plants',
    'sector.gifts': 'Gifts and Occasions',
    'sector.pets': 'Pets and Animals',
    'sector.automotive': 'Automotive and Transportation',
    'sector.sports': 'Specific Sports',
    'sector.music': 'Music and Instruments',
    'sector.literature': 'Literature and Writing',
    'sector.gaming': 'Gaming and Esports',
    'sector.techGadgets': 'Technology and Gadgets',
    'sector.history': 'History and Culture',
    'sector.sustainability': 'Sustainability and Eco-Friendly Living',
    'sector.photographyNiche': 'Photography',
    'sector.planning': 'Planning and Organization',
    'sector.psychology': 'Psychology and Personal Development',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}