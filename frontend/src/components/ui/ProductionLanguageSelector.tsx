'use client';

import React, { useState, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  googleCode: string;
}

const LANGUAGES: Language[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', googleCode: 'es' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', googleCode: 'en' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', googleCode: 'fr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', googleCode: 'it' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', googleCode: 'de' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', googleCode: 'nl' },
  { code: 'de-ch', name: 'Swiss German', nativeName: 'Schweizerdeutsch', flag: '🇨🇭', googleCode: 'de' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', googleCode: 'ar' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', googleCode: 'zh-CN' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', googleCode: 'ja' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', googleCode: 'pt' },
];

interface ProductionLanguageSelectorProps {
  isMobile?: boolean;
  variant?: 'dropdown' | 'flags' | 'compact';
  showNames?: boolean;
  className?: string;
}

const ProductionLanguageSelector: React.FC<ProductionLanguageSelectorProps> = ({
  isMobile = false,
  variant = 'dropdown',
  showNames = true,
  className = ''
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LANGUAGES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  // Inicializar al montar
  useEffect(() => {
    initializeLanguage();
    setupGoogleTranslate();
  }, []);

  const initializeLanguage = () => {
    // Cargar idioma guardado
    const savedLanguage = localStorage.getItem('citypaj-language');
    if (savedLanguage) {
      const language = LANGUAGES.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
        applyLanguage(language);
      }
    } else {
      // Detectar idioma del navegador
      const browserLang = navigator.language.split('-')[0];
      const detectedLanguage = LANGUAGES.find(lang => lang.code === browserLang);
      if (detectedLanguage) {
        setCurrentLanguage(detectedLanguage);
        applyLanguage(detectedLanguage);
      }
    }
  };

  const setupGoogleTranslate = () => {
    // Prevenir banner de Google Translate
    const preventBanner = () => {
      const banner = document.querySelector('.goog-te-banner-frame');
      if (banner) {
        (banner as HTMLElement).style.display = 'none';
      }
      document.body.style.marginTop = '0px';
      document.body.style.position = '';
      document.documentElement.style.marginTop = '0px';
    };

    // Ejecutar periódicamente
    preventBanner();
    const interval = setInterval(preventBanner, 500);
    
    // Verificar si Google Translate está disponible
    const checkGoogleReady = () => {
      if ((window as any).google && (window as any).google.translate) {
        setIsGoogleReady(true);
        clearInterval(interval);
      }
    };
    
    checkGoogleReady();
    const readyInterval = setInterval(checkGoogleReady, 1000);
    
    // Limpiar intervalos
    setTimeout(() => {
      clearInterval(interval);
      clearInterval(readyInterval);
    }, 10000);
  };

  const applyLanguage = (language: Language) => {
    if (language.code === 'es') {
      // Restaurar español
      restoreSpanish();
    } else {
      // Aplicar traducción con Google Translate
      applyGoogleTranslation(language);
    }
  };

  const restoreSpanish = () => {
    // Eliminar elementos de Google Translate
    const googleFrame = document.querySelector('.goog-te-banner-frame');
    if (googleFrame) {
      (googleFrame as HTMLElement).remove();
    }

    // Limpiar estilos de traducción
    const translatedElements = document.querySelectorAll('[style*="font-family"]');
    translatedElements.forEach(element => {
      (element as HTMLElement).style.fontFamily = '';
    });

    // Recargar para restaurar completamente
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const applyGoogleTranslation = (language: Language) => {
    setIsLoading(true);

    // Crear elemento de Google Translate si no existe
    let container = document.getElementById('google_translate_element');
    if (!container) {
      container = document.createElement('div');
      container.id = 'google_translate_element';
      container.style.display = 'none';
      document.body.appendChild(container);
    }

    // Inicializar Google Translate si está listo
    if (isGoogleReady) {
      try {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'es',
          includedLanguages: LANGUAGES.map(lang => lang.googleCode).join(','),
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true
        }, 'google_translate_element');

        // Esperar y cambiar idioma
        setTimeout(() => {
          const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (select) {
            select.value = language.googleCode;
            select.dispatchEvent(new Event('change'));
            
            // Ocultar banner después del cambio
            setTimeout(() => {
              preventGoogleTranslateBanner();
              setIsLoading(false);
            }, 1500);
          } else {
            setIsLoading(false);
          }
        }, 1000);
      } catch (error) {
        console.error('Error aplicando traducción:', error);
        setIsLoading(false);
      }
    } else {
      // Si Google Translate no está listo, cargar script
      loadGoogleTranslateScript(language);
    }
  };

  const loadGoogleTranslateScript = (language: Language) => {
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      
      (window as any).googleTranslateElementInit = () => {
        setIsGoogleReady(true);
        applyGoogleTranslation(language);
      };
      
      document.head.appendChild(script);
    } else {
      setIsLoading(false);
    }
  };

  const preventGoogleTranslateBanner = () => {
    const banner = document.querySelector('.goog-te-banner-frame');
    if (banner) {
      (banner as HTMLElement).style.display = 'none';
    }
    document.body.style.marginTop = '0px';
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setIsOpen(false);
    localStorage.setItem('citypaj-language', language.code);
    applyLanguage(language);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.production-language-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Variante de banderas
  if (variant === 'flags') {
    return (
      <div className={`production-language-selector flex items-center gap-2 ${className}`}>
        <span className="text-sm font-medium text-gray-600">
          {isLoading ? '🔄' : '🌐'}
        </span>
        <div className="flex flex-wrap gap-1">
          {LANGUAGES.map((language) => (
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

  // Variante dropdown por defecto
  return (
    <div className={`production-language-selector relative ${className}`}>
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
              {LANGUAGES.map((language) => (
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

export default ProductionLanguageSelector;
