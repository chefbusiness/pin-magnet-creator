import { esTranslations } from './es';
import { enTranslations } from './en';

export type Language = 'es' | 'en';

export const translations = {
  es: esTranslations,
  en: enTranslations,
} as const;

export type TranslationKey = keyof typeof esTranslations;