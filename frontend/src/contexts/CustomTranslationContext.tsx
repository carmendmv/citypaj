'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import {
  getKeyTranslation,
  getTextTranslation,
  SUPPORTED_LANGUAGES,
  Language,
  SupportedLang,
} from '@/lib/translations';

interface CustomTranslationContextType {
  currentLanguage: Language;
  currentLanguageCode: SupportedLang;
  changeLanguage: (language: Language) => void;
  isLoading: boolean;
  t: (key: string, fallback?: string) => string;
  translateText: (text: string, fallback?: string) => string;
}

const defaultLanguage = SUPPORTED_LANGUAGES[0];

const defaultValue: CustomTranslationContextType = {
  currentLanguage: defaultLanguage,
  currentLanguageCode: defaultLanguage.code as SupportedLang,
  changeLanguage: () => {},
  isLoading: false,
  t: (key: string, fallback?: string) => getKeyTranslation('es', key, fallback),
  translateText: (text: string, fallback?: string) => getTextTranslation('es', text, fallback),
};

const CustomTranslationContext = createContext<CustomTranslationContextType>(defaultValue);

export const CustomTranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CustomTranslationContext.Provider value={defaultValue}>
      {children}
    </CustomTranslationContext.Provider>
  );
};

export const useCustomTranslation = (): CustomTranslationContextType => {
  return useContext(CustomTranslationContext);
};
