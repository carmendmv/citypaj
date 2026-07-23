'use client';

import React, { useState, useEffect } from 'react';
import { useCustomTranslation } from '@/contexts/CustomTranslationContext';
import { SUPPORTED_LANGUAGES, Language } from '@/lib/translations';

interface LanguageSelectorProps {
  isMobile?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isMobile = false }) => {
  const { currentLanguage, changeLanguage, isLoading } = useCustomTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language: Language) => {
    setIsOpen(false);
    void changeLanguage(language);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !event.target || !(event.target as Element).closest('.language-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`language-selector relative ${isMobile ? 'w-full' : 'w-40'}`}>
      {/* Caja con border-box */}
      <div className="border border-black bg-white box-border">
        {/* Botón principal */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 text-sm font-sans text-black bg-white cursor-pointer focus:outline-none flex items-center justify-between ${
            isMobile ? 'py-3' : 'py-2'
          }`}
          aria-label="Seleccionar idioma"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="flex items-center gap-2">
            <span className="text-base">{currentLanguage.flag}</span>
            <span className={`font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}>
              {currentLanguage.nativeName}
            </span>
          </span>
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown absoluto */}
        {isOpen && (
          <div className={`absolute top-full left-0 right-0 border border-black bg-white shadow-lg z-50 max-h-60 overflow-y-auto ${
            isMobile ? 'max-h-80' : 'max-h-60'
          }`}>
            <div className="py-1" role="listbox">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language)}
                  className={`w-full px-3 py-2 text-left text-sm font-sans bg-white hover:text-orange-500 transition-colors duration-200 focus:outline-none focus:text-orange-500 flex items-center gap-2 ${
                    currentLanguage.code === language.code ? 'text-orange-500' : 'text-black'
                  }`}
                  role="option"
                  aria-selected={currentLanguage.code === language.code}
                >
                  <span className="text-base">{language.flag}</span>
                  <span className={`font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}>
                    {language.nativeName}
                  </span>
                  {currentLanguage.code === language.code && (
                    <svg className="w-3 h-3 ml-auto flex-shrink-0 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isLoading && <span className="sr-only">Cargando traducción...</span>}
    </div>
  );
};

export default LanguageSelector;
