'use client';

import React, { useState, useEffect } from 'react';
import { useAITranslation, SUPPORTED_LANGUAGES } from '@/hooks/useAITranslation';

interface AdvancedLanguageSelectorProps {
  isMobile?: boolean;
  variant?: 'dropdown' | 'flags' | 'compact';
  showNames?: boolean;
  className?: string;
}

const AdvancedLanguageSelector: React.FC<AdvancedLanguageSelectorProps> = ({
  isMobile = false,
  variant = 'dropdown',
  showNames = true,
  className = ''
}) => {
  const { currentLanguage, languages, isLoading, changeLanguage } = useAITranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.advanced-language-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLanguageChange = async (language: typeof SUPPORTED_LANGUAGES[0]) => {
    setIsOpen(false);
    await changeLanguage(language);
  };

  // Variante de banderas horizontales
  if (variant === 'flags') {
    return (
      <div className={`advanced-language-selector flex items-center gap-2 ${className}`}>
        <span className="text-sm font-medium text-gray-600 mr-2">
          {isLoading ? '🔄' : '🌐'}
        </span>
        <div className="flex flex-wrap gap-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                currentLanguage.code === language.code
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
              title={`${language.nativeName} (${language.name})`}
              disabled={isLoading}
            >
              <span className="text-lg">{language.flag}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Variante compacta (solo bandera actual)
  if (variant === 'compact') {
    return (
      <div className={`advanced-language-selector relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
            isMobile ? 'w-full justify-center' : ''
          }`}
          disabled={isLoading}
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          {showNames && (
            <span className="text-sm font-medium text-gray-700">
              {currentLanguage.nativeName}
            </span>
          )}
          {isLoading && <span className="text-xs text-orange-500">🔄</span>}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className={`absolute top-full right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto ${
            isMobile ? 'left-0 right-0 w-full' : ''
          }`}>
            <div className="p-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    currentLanguage.code === language.code
                      ? 'bg-orange-500 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  disabled={isLoading}
                >
                  <span className="text-xl">{language.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-xs opacity-75">{language.name}</div>
                  </div>
                  {currentLanguage.code === language.code && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Variante dropdown por defecto
  return (
    <div className={`advanced-language-selector relative ${className}`}>
      <div className="border border-gray-300 bg-white rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            isMobile ? 'py-4 text-base' : 'py-3'
          }`}
          aria-label="Seleccionar idioma"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={isLoading}
        >
          <span className="flex items-center gap-3">
            <span className="text-xl">{currentLanguage.flag}</span>
            <div className="text-left">
              <div className="font-medium">{currentLanguage.nativeName}</div>
              <div className="text-xs text-gray-500">{currentLanguage.name}</div>
            </div>
          </span>
          <div className="flex items-center gap-2">
            {isLoading && <span className="text-orange-500 animate-spin">🔄</span>}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className={`absolute top-full left-0 right-0 bg-white border border-gray-300 shadow-lg z-50 max-h-80 overflow-y-auto ${
            isMobile ? 'max-h-96' : 'max-h-80'
          }`}>
            <div className="py-2" role="listbox">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language)}
                  className={`w-full px-4 py-3 text-left transition-colors duration-200 flex items-center gap-3 focus:outline-none focus:bg-gray-100 ${
                    currentLanguage.code === language.code
                      ? 'bg-orange-50 text-orange-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  role="option"
                  aria-selected={currentLanguage.code === language.code}
                  disabled={isLoading}
                >
                  <span className="text-xl">{language.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-xs text-gray-500">{language.name}</div>
                  </div>
                  {currentLanguage.code === language.code && (
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Elemento oculto para Google Translate */}
      <div id="google_translate_element" style={{ display: 'none' }} />
    </div>
  );
};

export default AdvancedLanguageSelector;
