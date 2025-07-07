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