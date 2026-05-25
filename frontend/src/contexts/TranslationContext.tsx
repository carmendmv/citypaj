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

  // Detectar idioma al montar y mantener traducción
  useEffect(() => {
    const savedLanguage = localStorage.getItem('citypaj_language');
    const language = savedLanguage || 'es'; // Español por defecto
    setCurrentLanguage(language);
    
    // Si hay un idioma guardado y no es español, traducir automáticamente
    if (savedLanguage && savedLanguage !== 'es') {
      setTimeout(() => {
        // Traducir directamente sin llamar a changeLanguage para evitar referencia circular
        translatePageContent(savedLanguage);
      }, 1000); // Esperar a que la página cargue
    }
  }, []);

  // Efecto para mantener traducción durante navegación
  useEffect(() => {
    // Escuchar cambios de ruta para mantener traducción
    const handleRouteChange = () => {
      if (currentLanguage !== 'es') {
        setTimeout(() => {
          translatePageContent(currentLanguage);
        }, 500);
      }
    };

    // Escuchar eventos de navegación
    window.addEventListener('popstate', handleRouteChange);
    
    // También escuchar cambios en el pushState
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
    };
  }, [currentLanguage]);

  // Efecto para observar cambios en el DOM y traducir nuevos anuncios
  useEffect(() => {
    if (currentLanguage === 'es') return;

    // Crear un MutationObserver para detectar nuevos elementos
    const observer = new MutationObserver((mutations) => {
      let shouldTranslate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Verificar si se agregaron nuevos nodos que podrían ser anuncios
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Buscar clases o atributos de anuncios
              if (element.matches('.ad, .anuncio, .post, .listing, .item, [class*="ad"], [class*="anuncio"]') ||
                  element.querySelector('.ad, .anuncio, .post, .listing, .item')) {
                shouldTranslate = true;
              }
            }
          });
        }
      });
      
      if (shouldTranslate) {
        console.log('🔄 Detectados nuevos anuncios, traduciendo...');
        setTimeout(() => {
          translatePageContent(currentLanguage);
        }, 100);
      }
    });

    // Observar cambios en todo el body
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, [currentLanguage]);

  // Función separada para traducir la página
  const translatePageContent = async (targetLang: string) => {
    setIsLoading(true);
    
    try {
      console.log(`🔄 Restaurando traducción a ${targetLang}`);
      
      // Mapeo de idiomas para Google Translate
      const langMap: Record<string, string> = {
        'es': 'es',
        'en': 'en', 
        'fr': 'fr',
        'de': 'de',
        'it': 'it',
        'pt': 'pt'
      };
      
      const sourceLang = 'es'; // Siempre desde español
      const targetLangCode = langMap[targetLang] || 'en';
      
      // Función simple de traducción
      const translateText = async (text: string): Promise<string> => {
        if (!text || text.trim() === '') return text;
        if (text.includes('CityPaj')) return text;
        if (text.length < 2) return text;
        
        try {
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLangCode}&dt=t&q=${encodeURIComponent(text)}`;
          const response = await fetch(url);
          
          if (!response.ok) return text;
          
          const data = await response.json();
          if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
          }
        } catch (error) {
          console.warn('❌ Error traduciendo:', text);
        }
        
        return text;
      };
      
      // Obtener TODOS los elementos de texto - MÁS AGRESIVO
      const allElements = document.querySelectorAll('*');
      let translatedCount = 0;
      
      console.log(`🔍 Procesando ${allElements.length} elementos totales...`);
      
      Array.from(allElements).forEach(async (element) => {
        // Traducir textContent directamente
        if (element.textContent && element.children.length === 0) {
          const text = element.textContent?.trim();
          if (text && text.length > 1 && !text.includes('CityPaj') && !/^\d+$/.test(text)) {
            const translated = await translateText(text);
            if (translated !== text) {
              element.textContent = translated;
              translatedCount++;
              console.log(`✅ Texto traducido: "${text}" → "${translated}"`);
            }
          }
        }
        
        // Traducir innerHTML para elementos con hijos pero texto simple
        if (element.innerHTML && !element.querySelector('script, style, img, svg, input, select, textarea')) {
          const htmlText = element.innerHTML.trim();
          if (htmlText && htmlText.length > 1 && !htmlText.includes('<') && !htmlText.includes('CityPaj')) {
            const translated = await translateText(htmlText);
            if (translated !== htmlText) {
              element.innerHTML = translated;
              translatedCount++;
              console.log(`✅ HTML traducido: "${htmlText}" → "${translated}"`);
            }
          }
        }
      });
      
      // Traducir placeholders
      const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
      Array.from(inputs).forEach(async (input) => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder && placeholder.length > 1) {
          const translated = await translateText(placeholder);
          if (translated !== placeholder) {
            input.setAttribute('placeholder', translated);
            translatedCount++;
            console.log(`✅ Placeholder traducido: "${placeholder}" → "${translated}"`);
          }
        }
      });
      
      // Traducir títulos (title attributes)
      const elementsWithTitle = document.querySelectorAll('[title]');
      Array.from(elementsWithTitle).forEach(async (element) => {
        const title = element.getAttribute('title');
        if (title && title.length > 1) {
          const translated = await translateText(title);
          if (translated !== title) {
            element.setAttribute('title', translated);
            translatedCount++;
            console.log(`✅ Title traducido: "${title}" → "${translated}"`);
          }
        }
      });
      
      // Traducir valores de botones (value attributes)
      const buttonsWithValue = document.querySelectorAll('button[value], input[type="button"][value], input[type="submit"][value]');
      Array.from(buttonsWithValue).forEach(async (element) => {
        const value = element.getAttribute('value');
        if (value && value.length > 1) {
          const translated = await translateText(value);
          if (translated !== value) {
            element.setAttribute('value', translated);
            translatedCount++;
            console.log(`✅ Value traducido: "${value}" → "${translated}"`);
          }
        }
      });
      
      // Traducir datos específicos de la zona de usuario
      const userElements = document.querySelectorAll('[data-user], [data-profile], [data-account]');
      Array.from(userElements).forEach(async (element) => {
        const text = element.textContent?.trim();
        if (text && text.length > 1 && !text.includes('CityPaj')) {
          const translated = await translateText(text);
          if (translated !== text) {
            element.textContent = translated;
            translatedCount++;
            console.log(`✅ Elemento de usuario traducido: "${text}" → "${translated}"`);
          }
        }
      });
      
      // TRADUCCIÓN ESPECÍFICA DE ANUNCIOS - MÁS AGRESIVA
      console.log('🔍 Buscando anuncios para traducir...');
      
      // Buscar anuncios por clases y selectores comunes
      const adSelectors = [
        '.ad', '.advertisement', '.anuncio', '.post', '.listing', '.item',
        '[class*="ad"]', '[class*="anuncio"]', '[class*="post"]', '[class*="item"]',
        '[data-ad]', '[data-post]', '[data-listing]', '[data-item]',
        '.card', '.product', '.service', '.offer'
      ];
      
      adSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          console.log(`🔍 Encontrados ${elements.length} elementos con selector: ${selector}`);
          
          Array.from(elements).forEach(async (element) => {
            // Traducir todo el texto dentro del anuncio
            const textNodes = [];
            const walker = document.createTreeWalker(
              element,
              NodeFilter.SHOW_TEXT,
              null
            );
            
            let node;
            while (node = walker.nextNode()) {
              const text = node.textContent?.trim();
              if (text && text.length > 1 && !text.includes('CityPaj') && !/^\d+$/.test(text)) {
                textNodes.push(node);
              }
            }
            
            // Traducir cada nodo de texto
            for (const textNode of textNodes) {
              const originalText = textNode.textContent?.trim();
              if (originalText) {
                const translated = await translateText(originalText);
                if (translated !== originalText) {
                  textNode.textContent = translated;
                  translatedCount++;
                  console.log(`✅ Anuncio traducido: "${originalText}" → "${translated}"`);
                }
              }
            }
          });
        } catch (error) {
          console.warn(`❌ Error con selector ${selector}:`, error);
        }
      });
      
      // Buscar textos que parecen anuncios por contenido
      const adKeywords = [
        'vendo', 'compro', 'alquilo', 'busco', 'oferto', 'necesito',
        'precio', '€', 'euros', 'contacto', 'teléfono', 'email',
        'oportunidad', 'oferta', 'promoción', 'descuento', 'nuevo', 'usado',
        'coche', 'casa', 'piso', 'trabajo', 'curso', 'servicio'
      ];
      
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let textNode;
      while (textNode = walker.nextNode()) {
        const nodeText = textNode.textContent?.trim();
        if (nodeText && nodeText.length > 10) {
          const hasAdKeywords = adKeywords.some(keyword => 
            nodeText.toLowerCase().includes(keyword)
          );
          
          if (hasAdKeywords && !nodeText.includes('CityPaj')) {
            const translated = await translateText(nodeText);
            if (translated !== nodeText) {
              textNode.textContent = translated;
              translatedCount++;
              console.log(`✅ Contenido de anuncio traducido: "${nodeText.substring(0, 50)}..."`);
            }
          }
        }
      }
      
      // Traducir textos específicos que podrían no ser detectados
      const specificTexts = [
        'Cómo funciona',
        'Últimos anuncios de',
        'Mi perfil',
        'Mis anuncios',
        'Configuración',
        'Cerrar sesión',
        'Bienvenido',
        'Usuario',
        'Contraseña',
        'Email',
        'Nombre',
        'Apellidos',
        'Teléfono',
        'Dirección',
        'Guardar',
        'Cancelar',
        'Editar',
        'Eliminar',
        'Publicar',
        'Buscar',
        'Filtrar',
        'Ordenar',
        'Anterior',
        'Siguiente',
        'Página',
        'de',
        'Resultados',
        'No hay resultados',
        'Cargando...',
        'Error',
        'Éxito',
        'Confirmar',
        'Aceptar',
        'Rechazar'
      ];
      
      // Buscar y traducir textos específicos en toda la página
      specificTexts.forEach(async (specificText) => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let textNode;
        while (textNode = walker.nextNode()) {
          const nodeText = textNode.textContent?.trim();
          if (nodeText && nodeText.includes(specificText)) {
            const translated = await translateText(specificText);
            if (translated !== specificText) {
              const newText = nodeText.replace(specificText, translated);
              if (newText !== nodeText) {
                textNode.textContent = newText;
                translatedCount++;
                console.log(`✅ Texto específico traducido: "${specificText}" → "${translated}"`);
              }
            }
          }
        }
      });
      
      console.log(`✅ Traducción restaurada: ${translatedCount} elementos traducidos`);
      
    } catch (error) {
      console.error('❌ Error restaurando traducción:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cambiar idioma - versión simplificada
  const changeLanguage = async (lang: string) => {
    if (lang === currentLanguage) return;

    console.log(`🌍 Cambiando idioma a ${lang}`);
    
    // Guardar idioma inmediatamente
    localStorage.setItem('citypaj_language', lang);
    setCurrentLanguage(lang);
    
    // Si es español, recargar la página para volver al estado original
    if (lang === 'es') {
      window.location.reload();
      return;
    }
    
    // Para otros idiomas, traducir
    await translatePageContent(lang);
  };

  const value: TranslationContextType = {
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

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

