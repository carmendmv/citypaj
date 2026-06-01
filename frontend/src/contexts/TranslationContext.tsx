'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TranslationContextType {
  changeLanguage: (lang: string) => void;
  currentLanguage: string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('es');
  const [isLoading, setIsLoading] = useState(false);

  // Detectar idioma al montar
  useEffect(() => {
    const savedLanguage = localStorage.getItem('citypaj_language') || 'es';
    setCurrentLanguage(savedLanguage);
  }, []);

  const changeLanguage = (lang: string) => {
    setIsLoading(true);
    setCurrentLanguage(lang);
    localStorage.setItem('citypaj_language', lang);
    setIsLoading(false);
  };

  const value = {
    changeLanguage,
    currentLanguage,
    isLoading
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
