'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAITranslation } from '@/hooks/useAITranslation';

interface TranslationContextType {
  currentLanguage: any;
  isLoading: boolean;
  isTranslationReady: boolean;
  changeLanguage: (language: any) => Promise<void>;
  translateText: (text: string, targetLang?: string) => Promise<string>;
  t: (key: string, fallback?: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Diccionario de traducciones base (fallback)
const TRANSLATIONS: {[lang: string]: {[key: string]: string}} = {
  es: {
    // Navegación
    'nav.home': 'Inicio',
    'nav.anuncios': 'Anuncios',
    'nav.servicios': 'Servicios',
    'nav.comunidad': 'Comunidad',
    'nav.instituciones': 'Instituciones',
    'nav.login': 'Iniciar sesión',
    'nav.register': 'Registrarse',
    
    // Hero
    'hero.title': 'CityPAJ',
    'hero.subtitle': 'Plataforma de Anuncios Juvenil',
    'hero.description': 'Conectando jóvenes con oportunidades en su comunidad',
    
    // Categorías
    'cat.vivienda': 'Vivienda',
    'cat.empleo': 'Empleo',
    'cat.formacion': 'Formación',
    'cat.ocio': 'Ocio',
    'cat.comunidad': 'Comunidad',
    'cat.transporte': 'Transporte',
    
    // Acciones
    'btn.search': 'Buscar',
    'btn.publish': 'Publicar anuncio',
    'btn.save': 'Guardar',
    'btn.share': 'Compartir',
    'btn.contact': 'Contactar',
    
    // Estados
    'state.loading': 'Cargando...',
    'state.no_results': 'No hay resultados',
    'state.error': 'Error',
    'state.success': 'Éxito',
    
    // Anuncios
    'ad.title': 'Título',
    'ad.description': 'Descripción',
    'ad.category': 'Categoría',
    'ad.location': 'Ubicación',
    'ad.date': 'Fecha',
    'ad.views': 'Vistas',
    'ad.contact': 'Contacto',
    
    // Formularios
    'form.required': 'Campo requerido',
    'form.email': 'Email',
    'form.password': 'Contraseña',
    'form.name': 'Nombre',
    'form.phone': 'Teléfono',
    'form.message': 'Mensaje',
    'form.submit': 'Enviar',
    'form.cancel': 'Cancelar',
    
    // Footer
    'footer.about': 'Acerca de',
    'footer.contact': 'Contacto',
    'footer.terms': 'Términos',
    'footer.privacy': 'Privacidad',
    'footer.social': 'Redes sociales',
    
    // General
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.close': 'Cerrar',
    'common.back': 'Volver',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.more': 'Más',
    'common.less': 'Menos',
    'common.all': 'Todos',
    'common.none': 'Ninguno',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.refresh': 'Actualizar',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.anuncios': 'Listings',
    'nav.servicios': 'Services',
    'nav.comunidad': 'Community',
    'nav.instituciones': 'Institutions',
    'nav.login': 'Sign In',
    'nav.register': 'Sign Up',
    
    // Hero
    'hero.title': 'CityPAJ',
    'hero.subtitle': 'Youth Listings Platform',
    'hero.description': 'Connecting youth with opportunities in their community',
    
    // Categories
    'cat.vivienda': 'Housing',
    'cat.empleo': 'Jobs',
    'cat.formacion': 'Education',
    'cat.ocio': 'Leisure',
    'cat.comunidad': 'Community',
    'cat.transporte': 'Transport',
    
    // Actions
    'btn.search': 'Search',
    'btn.publish': 'Post Listing',
    'btn.save': 'Save',
    'btn.share': 'Share',
    'btn.contact': 'Contact',
    
    // States
    'state.loading': 'Loading...',
    'state.no_results': 'No results',
    'state.error': 'Error',
    'state.success': 'Success',
    
    // Listings
    'ad.title': 'Title',
    'ad.description': 'Description',
    'ad.category': 'Category',
    'ad.location': 'Location',
    'ad.date': 'Date',
    'ad.views': 'Views',
    'ad.contact': 'Contact',
    
    // Forms
    'form.required': 'Required field',
    'form.email': 'Email',
    'form.password': 'Password',
    'form.name': 'Name',
    'form.phone': 'Phone',
    'form.message': 'Message',
    'form.submit': 'Submit',
    'form.cancel': 'Cancel',
    
    // Footer
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy',
    'footer.social': 'Social Media',
    
    // General
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.more': 'More',
    'common.less': 'Less',
    'common.all': 'All',
    'common.none': 'None',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.refresh': 'Refresh',
  }
};

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const { currentLanguage, isLoading, isTranslationReady, changeLanguage, translateText } = useAITranslation();
  const [translatedTexts, setTranslatedTexts] = useState<{[key: string]: string}>({});

  // Traducir textos base cuando cambia el idioma
  useEffect(() => {
    const translateBaseTexts = async () => {
      if (!currentLanguage || currentLanguage.code === 'es') {
        setTranslatedTexts(TRANSLATIONS.es);
        return;
      }

      const translated: {[key: string]: string} = {};
      const baseTexts = TRANSLATIONS.es;
      
      for (const [key, text] of Object.entries(baseTexts)) {
        try {
          translated[key] = await translateText(text, currentLanguage.googleCode);
        } catch (error) {
          console.error(`Error translating ${key}:`, error);
          translated[key] = text; // Fallback
        }
      }
      
      setTranslatedTexts(translated);
    };

    if (isTranslationReady) {
      translateBaseTexts();
    }
  }, [currentLanguage, isTranslationReady, translateText]);

  // Función de traducción simple
  const t = (key: string, fallback?: string): string => {
    const translated = translatedTexts[key];
    if (translated) return translated;
    
    // Fallback al español
    const spanishFallback = TRANSLATIONS.es[key];
    if (spanishFallback) return spanishFallback;
    
    // Fallback personalizado o key
    return fallback || key;
  };

  const value: TranslationContextType = {
    currentLanguage,
    isLoading,
    isTranslationReady,
    changeLanguage,
    translateText,
    t,
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

// Hook para traducir componentes individuales
export const useTranslateText = () => {
  const { translateText, currentLanguage } = useTranslation();
  
  return {
    translate: async (text: string, targetLang?: string) => {
      return await translateText(text, targetLang || currentLanguage?.googleCode);
    },
    currentLang: currentLanguage?.code || 'es',
  };
};
