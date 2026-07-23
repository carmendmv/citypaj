import { useState, useEffect, useCallback, useRef } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  googleCode: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
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

interface TranslationCache {
  [key: string]: {
    [targetLang: string]: string;
  };
}

export const useAITranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslationReady, setIsTranslationReady] = useState(false);
  const translationCache = useRef<TranslationCache>({});
  const originalTexts = useRef<Map<string, string>>(new Map());

  // Inicializar sistema de traducción
  useEffect(() => {
    initializeTranslation();
  }, []);

  const initializeTranslation = () => {
    // Cargar idioma guardado
    const savedLanguage = localStorage.getItem('citypaj-language');
    if (savedLanguage) {
      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }

    // Prevenir Google Translate banner
    preventGoogleTranslateBanner();
    
    // Cargar script de Google Translate
    loadGoogleTranslateScript();
  };

  const hideGoogleTranslateBanner = () => {
    const banner = document.querySelector('.goog-te-banner-frame');
    if (banner) {
      (banner as HTMLElement).style.display = 'none';
    }
    document.body.style.marginTop = '0px';
    document.body.style.position = '';
    document.documentElement.style.marginTop = '0px';
  };

  const preventGoogleTranslateBanner = () => {
    hideGoogleTranslateBanner();
    const interval = setInterval(hideGoogleTranslateBanner, 100);
    return () => clearInterval(interval);
  };

  const loadGoogleTranslateScript = () => {
    if ((window as any).google && (window as any).google.translate) {
      setIsTranslationReady(true);
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    
    (window as any).googleTranslateElementInit = () => {
      setIsTranslationReady(true);
      
      // Crear elemento oculto para Google Translate
      const container = document.getElementById('google_translate_element');
      if (!container) {
        const element = document.createElement('div');
        element.id = 'google_translate_element';
        element.style.display = 'none';
        document.body.appendChild(element);
      }

      // Inicializar Google Translate
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'es',
        includedLanguages: SUPPORTED_LANGUAGES.map(lang => lang.googleCode).join(','),
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        multilanguagePage: true
      }, 'google_translate_element');
    };

    document.head.appendChild(script);
  };

  const extractTextFromElement = (element: Element): string => {
    // Extraer texto visible de un elemento
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          // Ignorar scripts, estilos y elementos ocultos
          if (parent.tagName === 'SCRIPT' || 
              parent.tagName === 'STYLE' ||
              parent.style.display === 'none' ||
              parent.hidden) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let text = '';
    let node;
    while (node = walker.nextNode()) {
      const nodeText = node.textContent?.trim();
      if (nodeText && nodeText.length > 0) {
        text += nodeText + ' ';
      }
    }
    
    return text.trim();
  };

  const translateTextWithAI = useCallback(async (text: string, targetLang: string): Promise<string> => {
    if (!text || text.trim() === '') return text;
    
    // Verificar caché
    const cacheKey = text.toLowerCase();
    if (translationCache.current[cacheKey]?.[targetLang]) {
      return translationCache.current[cacheKey][targetLang];
    }

    // Si es español, devolver texto original
    if (targetLang === 'es') {
      return text;
    }

    try {
      // Usar Google Translate API directamente
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await response.json();
      
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        const translatedText = data[0][0][0];
        
        // Guardar en caché
        if (!translationCache.current[cacheKey]) {
          translationCache.current[cacheKey] = {};
        }
        translationCache.current[cacheKey][targetLang] = translatedText;
        
        return translatedText;
      }
    } catch (error) {
      console.error('Error en traducción AI:', error);
    }

    return text; // Fallback al texto original
  }, []);

  const translatePage = useCallback(async (targetLanguage: Language) => {
    if (!isTranslationReady) {
      console.log('🔄 Esperando a que Google Translate esté listo...');
      return;
    }

    setIsLoading(true);

    try {
      // Guardar textos originales si no están guardados
      if (originalTexts.current.size === 0) {
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, a, label, option, li, td, th');
        
        textElements.forEach((element, index) => {
          const text = extractTextFromElement(element);
          if (text && text.length > 0) {
            originalTexts.current.set(`element_${index}`, text);
          }
        });
      }

      // Si es español, restaurar textos originales
      if (targetLanguage.code === 'es') {
        restoreOriginalTexts();
        setIsLoading(false);
        return;
      }

      // Traducir elementos usando Google Translate UI
      const applyLanguage = () => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (select && select.options.length > 1) {
          select.value = targetLanguage.googleCode;
          select.dispatchEvent(new Event('change'));

          // Esperar a que se complete la traducción
          setTimeout(() => {
            hideGoogleTranslateBanner();
            setIsLoading(false);
          }, 1500);
          return true;
        }
        return false;
      };

      if (!applyLanguage()) {
        let attempts = 0;
        const maxAttempts = 20;
        const poll = setInterval(() => {
          attempts += 1;
          if (applyLanguage() || attempts >= maxAttempts) {
            clearInterval(poll);
            if (attempts >= maxAttempts) {
              setIsLoading(false);
            }
          }
        }, 250);
      }

    } catch (error) {
      console.error('Error traduciendo página:', error);
      setIsLoading(false);
    }
  }, [isTranslationReady, translateTextWithAI]);

  const restoreOriginalTexts = () => {
    // Restaurar textos originales eliminando la traducción de Google
    const googleFrame = document.querySelector('.goog-te-banner-frame');
    if (googleFrame) {
      (googleFrame as HTMLElement).remove();
    }

    // Limpiar elementos traducidos
    const translatedElements = document.querySelectorAll('[style*="font-family"]');
    translatedElements.forEach(element => {
      (element as HTMLElement).style.fontFamily = '';
    });

    // Recargar página para restaurar estado original
    window.location.reload();
  };

  const changeLanguage = useCallback(async (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('citypaj-language', language.code);
    
    await translatePage(language);
    
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language, code: language.code } 
    }));
  }, [translatePage]);

  // Traducir automáticamente cuando el widget esté listo y haya un idioma distinto al español guardado
  useEffect(() => {
    if (isTranslationReady && currentLanguage.code !== 'es') {
      translatePage(currentLanguage);
    }
  }, [isTranslationReady, currentLanguage, translatePage]);

  const translateText = useCallback(async (text: string, targetLang?: string): Promise<string> => {
    const language = targetLang || currentLanguage.googleCode;
    return await translateTextWithAI(text, language);
  }, [currentLanguage, translateTextWithAI]);

  return {
    currentLanguage,
    languages: SUPPORTED_LANGUAGES,
    isLoading,
    isTranslationReady,
    changeLanguage,
    translateText,
    translatePage,
  };
};
