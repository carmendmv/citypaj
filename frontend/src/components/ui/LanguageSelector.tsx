'use client';

import React, { useState, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

// Lista de idiomas principales
const LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

interface LanguageSelectorProps {
  isMobile?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isMobile = false }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LANGUAGES[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Cargar idioma guardado
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = LANGUAGES.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  useEffect(() => {
    // Prevenir el banner de Google Translate
    const preventGoogleBanner = () => {
      // Ocultar el banner si aparece
      const banner = document.querySelector('.goog-te-banner-frame');
      if (banner) {
        (banner as HTMLElement).style.display = 'none';
      }
      
      // Resetear el body para prevenir desplazamiento
      document.body.style.marginTop = '0px';
      document.body.style.position = '';
      document.documentElement.style.marginTop = '0px';
    };

    // Ejecutar inmediatamente y periódicamente
    preventGoogleBanner();
    const interval = setInterval(preventGoogleBanner, 100);
    
    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setIsOpen(false);
    localStorage.setItem('selectedLanguage', language.code);
    
    // Usar Google Translate de forma simple
    translateWithGoogle(language.code);
  };

  const translateWithGoogle = (targetLang: string) => {
    console.log('🔄 Iniciando traducción a:', targetLang);
    
    // Si es español, recargar la página original
    if (targetLang === 'es') {
      console.log('📚 Restaurando español - recargando página');
      window.location.reload();
      return;
    }

    // Función para inicializar Google Translate
    const initGoogleTranslate = () => {
      console.log('🚀 Inicializando Google Translate');
      
      // Asegurarse de que el contenedor existe
      let container = document.getElementById('google_translate_element');
      if (!container) {
        container = document.createElement('div');
        container.id = 'google_translate_element';
        container.style.display = 'none';
        document.body.appendChild(container);
      }
      
      // Crear el elemento de traducción con todos los idiomas
      try {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'es',
          includedLanguages: LANGUAGES.map(lang => lang.code).join(','),
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true
        }, 'google_translate_element');
        
        console.log('✅ Google Translate inicializado');
        
        // Esperar a que cargue y cambiar el idioma
        setTimeout(() => {
          const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          console.log('🔍 Buscando select:', select ? 'encontrado' : 'no encontrado');
          
          if (select && select.options.length > 1) {
            console.log('📝 Opciones disponibles:', Array.from(select.options).map(o => o.value));
            
            select.value = targetLang;
            select.dispatchEvent(new Event('change'));
            console.log('✅ Idioma cambiado a:', targetLang);
            
            // Ocultar el banner inmediatamente después del cambio
            setTimeout(() => {
              const banner = document.querySelector('.goog-te-banner-frame');
              if (banner) {
                (banner as HTMLElement).style.display = 'none';
                console.log('🚫 Banner ocultado');
              }
              document.body.style.marginTop = '0px';
            }, 100);
          } else {
            console.log('❌ No se encontró el select o no hay opciones');
          }
        }, 1000);
      } catch (error) {
        console.error('❌ Error al inicializar Google Translate:', error);
      }
    };

    // Verificar si Google Translate ya está cargado
    if ((window as any).google && (window as any).google.translate) {
      console.log('✅ Google Translate ya está cargado');
      
      // Si ya está cargado, cambiar el idioma directamente
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        console.log('📝 Cambiando idioma directamente');
        select.value = targetLang;
        select.dispatchEvent(new Event('change'));
      } else {
        console.log('🔄 No hay select, reinicializando');
        initGoogleTranslate();
      }
    } else {
      console.log('📥 Cargando script de Google Translate');
      
      // Si no está cargado, cargar el script
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        
        // Definir función global
        (window as any).googleTranslateElementInit = initGoogleTranslate;
        
        document.head.appendChild(script);
        console.log('✅ Script añadido al head');
      } else {
        console.log('⚠️ Script ya existe');
      }
    }
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
              {currentLanguage.name}
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
              {LANGUAGES.map((language) => (
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
                    {language.name}
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

      {/* Elemento oculto para Google Translate */}
      <div id="google_translate_element" style={{ display: 'none' }} />
    </div>
  );
};

export default LanguageSelector;
