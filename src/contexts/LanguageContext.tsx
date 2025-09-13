import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'bn' | 'kn' | 'ml' | 'pa' | 'or' | 'as' | 'raj' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: readonly {
    code: Language;
    name: string;
    nativeName: string;
    flag: string;
  }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('eduindia_language');
    return (saved as Language) || 'hi'; // Default to Hindi
  });

  const [translations, setTranslations] = useState<Record<Language, any>>({} as Record<Language, any>);

  useEffect(() => {
    localStorage.setItem('eduindia_language', language);
  }, [language]);

  // Load translations dynamically
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const [enData, hiData, marData] = await Promise.all([
          import('../i18n/en.json'),
          import('../i18n/hi.json'),
          import('../i18n/mar.json')
        ]);
        
        setTranslations({
          en: enData.default,
          hi: hiData.default,
          mr: marData.default,
          // Add other languages with fallback to Hindi/English
          gu: hiData.default, // Gujarati fallback to Hindi
          ta: enData.default, // Tamil fallback to English
          te: hiData.default, // Telugu fallback to Hindi
          bn: hiData.default, // Bengali fallback to Hindi
          kn: enData.default, // Kannada fallback to English
          ml: enData.default, // Malayalam fallback to English
          pa: hiData.default, // Punjabi fallback to Hindi
          or: hiData.default, // Odia fallback to Hindi
          as: hiData.default, // Assamese fallback to Hindi
          raj: hiData.default, // Rajasthani fallback to Hindi
          ur: hiData.default, // Urdu fallback to Hindi
        });
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    loadTranslations();
  }, []);

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

  const availableLanguages = [
    { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr' as Language, name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'gu' as Language, name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'ta' as Language, name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te' as Language, name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn' as Language, name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
    { code: 'kn' as Language, name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml' as Language, name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa' as Language, name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'or' as Language, name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'as' as Language, name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
    { code: 'raj' as Language, name: 'Rajasthani', nativeName: 'राजस्थानी', flag: '🇮🇳' },
    { code: 'ur' as Language, name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳' },
  ] as const;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};