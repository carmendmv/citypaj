'use client';

import React from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

// Configuración directa de idiomas para AutoTranslate
const supportedLanguages = ['es', 'en', 'fr', 'de', 'it', 'pt'] as const;
const languageNames: Record<string, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português'
};
const languageFlags: Record<string, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹'
};

interface LanguageSelectorProps {
  className?: string;
}

export const ProfessionalLanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, isLoading } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    if (lang !== currentLanguage && !isLoading) {
      changeLanguage(lang);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        disabled={isLoading}
      >
        {supportedLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {languageFlags[lang]} {languageNames[lang]}
          </option>
        ))}
      </select>
      
      {/* Flecha personalizada */}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isLoading && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

// Botones de idioma individuales (alternativa al select)
export const LanguageButtons: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, isLoading } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    if (lang !== currentLanguage && !isLoading) {
      changeLanguage(lang);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {supportedLanguages.map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          disabled={isLoading}
          className={`
            px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${currentLanguage === lang 
              ? 'bg-blue-500 text-white shadow-md transform scale-105' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={languageNames[lang]}
        >
          <span className="mr-1">{languageFlags[lang]}</span>
          <span className="hidden sm:inline">{languageNames[lang]}</span>
        </button>
      ))}
    </div>
  );
};

// Componente de banderas para navegación
export const LanguageFlags: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, isLoading } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    if (lang !== currentLanguage && !isLoading) {
      changeLanguage(lang);
    }
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      {supportedLanguages.map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          disabled={isLoading}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-200
            ${currentLanguage === lang 
              ? 'ring-2 ring-blue-500 ring-offset-2 transform scale-110' 
              : 'hover:scale-105'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={languageNames[lang]}
        >
          {languageFlags[lang]}
        </button>
      ))}
    </div>
  );
};

export default ProfessionalLanguageSelector;
