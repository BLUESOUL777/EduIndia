import { useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'mar';

interface I18nData {
  [key: string]: any;
}

const translations: Record<Language, I18nData> = {
  en: {},
  hi: {},
  mar: {}
};

// Load translations dynamically
const loadTranslations = async () => {
  try {
    const [enData, hiData, marData] = await Promise.all([
      import('../i18n/en.json'),
      import('../i18n/hi.json'),
      import('../i18n/mar.json')
    ]);
    
    translations.en = enData.default;
    translations.hi = hiData.default;
    translations.mar = marData.default;
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
};

// Initialize translations
loadTranslations();

export const useI18n = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('eduindia_language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('eduindia_language', language);
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    // Fallback to English if translation not found
    if (language !== 'en') {
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
      }
      if (typeof value === 'string') {
        return value;
      }
    }
    
    return fallback || key;
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return {
    language,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
      { code: 'mar', name: 'Marathi', nativeName: 'मराठी' }
    ] as const
  };
};