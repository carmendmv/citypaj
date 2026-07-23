'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { getTranslation, SUPPORTED_LANGUAGES, Language, LangCode } from '@/lib/translations';

interface CustomTranslationContextType {
  currentLanguage: Language;
  currentLanguageCode: LangCode;
  changeLanguage: (language: Language) => void;
  isLoading: boolean;
  t: (key: string, fallback?: string) => string;
}

const STORAGE_KEY = 'citypaj-language';

const CustomTranslationContext = createContext<CustomTranslationContextType | undefined>(undefined);

export const CustomTranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const found = SUPPORTED_LANGUAGES.find((lang) => lang.code === saved);
        if (found) {
          setCurrentLanguage(found);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const changeLanguage = useCallback((language: Language) => {
    setIsLoading(true);
    setCurrentLanguage(language);
    try {
      localStorage.setItem(STORAGE_KEY, language.code);
      document.documentElement.lang = language.code;
    } catch {
      // ignore
    }
    // Simula un pequeño retardo para dar feedback visual
    setTimeout(() => setIsLoading(false), 150);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => {
      return getTranslation(currentLanguage.code as LangCode, key, fallback);
    },
    [currentLanguage]
  );

  return (
    <CustomTranslationContext.Provider
      value={{
        currentLanguage,
        currentLanguageCode: currentLanguage.code as LangCode,
        changeLanguage,
        isLoading,
        t,
      }}
    >
      {children}
    </CustomTranslationContext.Provider>
  );
};

export const useCustomTranslation = (): CustomTranslationContextType => {
  const context = useContext(CustomTranslationContext);
  if (!context) {
    throw new Error('useCustomTranslation must be used within a CustomTranslationProvider');
  }
  return context;
};
