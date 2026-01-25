'use client';

// Sistema de Traducción por IA para CityPaj - SIMPLE Y FUNCIONAL
import { useState, useEffect } from 'react';

interface TranslationKeys {
  // Navegación y Header
  header: {
    title: string;
    subtitle: string;
    search_placeholder: string;
    language: string;
    user_zone: string;
    login_register: string;
    my_profile: string;
    my_ads: string;
    logout: string;
    publish: string;
  };
  
  // Menú principal
  menu: {
    ocio: string;
    servicios: string;
    formacion: string;
    empleo: string;
    comunidad: string;
    viviendas_trabajo: string;
    noticias: string;
  };
  
  // Página principal
  home: {
    hero_title: string;
    hero_subtitle: string;
    select_community: string;
    how_it_works: string;
    latest_ads: string;
    no_ads: string;
    spain: string;
  };
  
  // Formulario publicar
  publish_form: {
    title: string;
    subtitle: string;
    fields: {
      title: string;
      description: string;
      category: string;
      offer_demand: string;
      name: string;
      community: string;
      province: string;
      email_required: string;
      phone_optional: string;
    };
    categories: {
      ocio: string;
      servicios: string;
      educacion: string;
      empleo: string;
      intercambios: string;
      oferta: string;
      demanda: string;
    };
    rules: {
      title: string;
      text: string;
      accept: string;
      required: string;
    };
    posting: string;
    post: string;
    failed: string;
    api_error: string;
  };
  
  // Mis anuncios
  my_ads: {
    title: string;
    no_ads: string;
    edit: string;
    delete: string;
    code: string;
  };
  
  // Comunes
  common: {
    back: string;
    cancel: string;
    loading: string;
    searching: string;
    edition: string;
    search: string;
    publish_new: string;
    volver: string;
  };
}

// Traducciones por idioma
const translations: Record<string, TranslationKeys> = {
  es: {
    header: {
      title: "CityPaj",
      subtitle: "Tu ciudad, tus anuncios, tu comunidad",
      search_placeholder: "Buscar...",
      language: "Español",
      user_zone: "Zona de usuario",
      login_register: "Acceder / Registrarse",
      my_profile: "Mi perfil",
      my_ads: "Mis anuncios",
      logout: "Cerrar sesión",
      publish: "Publicar"
    },
    menu: {
      ocio: "Ocio",
      servicios: "Servicios",
      formacion: "Formación",
      empleo: "Empleo",
      comunidad: "Comunidad",
      viviendas_trabajo: "Viviendas + trabajo",
      noticias: "Noticias"
    },
    home: {
      hero_title: "CityPaj",
      hero_subtitle: "Tu ciudad, tus anuncios, tu comunidad",
      select_community: "Selecciona tu comunidad",
      how_it_works: "Cómo funciona CityPaj",
      latest_ads: "Últimos anuncios",
      no_ads: "No hay anuncios para este filtro.",
      spain: "España"
    },
    publish_form: {
      title: "Publicar anuncio",
      subtitle: "Comparte tu oportunidad con la comunidad",
      fields: {
        title: "Título del anuncio *",
        description: "Descripción detallada *",
        category: "Categoría *",
        offer_demand: "Tipo de anuncio *",
        name: "Nombre *",
        community: "Comunidad Autónoma *",
        province: "Provincia *",
        email_required: "Email de contacto *",
        phone_optional: "Teléfono (opcional)"
      },
      categories: {
        ocio: "Ocio",
        servicios: "Servicios",
        educacion: "Formación",
        empleo: "Empleo",
        intercambios: "Comunidad",
        oferta: "Oferta",
        demanda: "Demanda"
      },
      rules: {
        title: "Reglas y condiciones",
        text: "Al publicar un anuncio, aceptas cumplir con nuestras normas de conducta y términos de servicio. Los anuncios inapropiados serán eliminados.",
        accept: "Acepto las reglas y condiciones",
        required: "Debes aceptar las reglas y condiciones"
      },
      posting: "Publicando...",
      post: "Publicar anuncio",
      failed: "Error al publicar. Intenta de nuevo.",
      api_error: "Error al publicar el anuncio"
    },
    my_ads: {
      title: "Mis anuncios",
      no_ads: "No tienes anuncios publicados",
      edit: "Editar",
      delete: "Eliminar",
      code: "Código de anuncio:"
    },
    common: {
      back: "Volver",
      cancel: "Cancelar",
      loading: "Cargando...",
      searching: "Buscando...",
      edition: "LISTADO DE ANUNCIOS",
      search: "Buscar...",
      publish_new: "Publicar nuevo",
      volver: "Volver"
    }
  },
  
  en: {
    header: {
      title: "CityPaj",
      subtitle: "Your city, your ads, your community",
      search_placeholder: "Search...",
      language: "English",
      user_zone: "User area",
      login_register: "Login / Register",
      my_profile: "My profile",
      my_ads: "My ads",
      logout: "Logout",
      publish: "Publish"
    },
    menu: {
      ocio: "Leisure",
      servicios: "Services",
      formacion: "Training",
      empleo: "Employment",
      comunidad: "Community",
      viviendas_trabajo: "Housing + work",
      noticias: "News"
    },
    home: {
      hero_title: "CityPaj",
      hero_subtitle: "Your city, your ads, your community",
      select_community: "Select your community",
      how_it_works: "How CityPaj works",
      latest_ads: "Latest ads",
      no_ads: "No ads for this filter.",
      spain: "Spain"
    },
    publish_form: {
      title: "Publish ad",
      subtitle: "Share your opportunity with the community",
      fields: {
        title: "Ad title *",
        description: "Detailed description *",
        category: "Category *",
        offer_demand: "Ad type *",
        name: "Name *",
        community: "Autonomous Community *",
        province: "Province *",
        email_required: "Contact email *",
        phone_optional: "Phone (optional)"
      },
      categories: {
        ocio: "Leisure",
        servicios: "Services",
        educacion: "Training",
        empleo: "Employment",
        intercambios: "Community",
        oferta: "Offer",
        demanda: "Demand"
      },
      rules: {
        title: "Rules and conditions",
        text: "By publishing an ad, you agree to comply with our conduct rules and terms of service. Inappropriate ads will be removed.",
        accept: "I accept the rules and conditions",
        required: "You must accept the rules and conditions"
      },
      posting: "Publishing...",
      post: "Publish ad",
      failed: "Error publishing. Try again.",
      api_error: "Error publishing the ad"
    },
    my_ads: {
      title: "My ads",
      no_ads: "You have no published ads",
      edit: "Edit",
      delete: "Delete",
      code: "Ad code:"
    },
    common: {
      back: "Back",
      cancel: "Cancel",
      loading: "Loading...",
      searching: "Searching...",
      edition: "AD LISTING",
      search: "Search...",
      publish_new: "Publish new",
      volver: "Back"
    }
  },

  ca: {
    header: {
      title: "CityPaj",
      subtitle: "La teva ciutat, els teus anuncis, la teva comunitat",
      search_placeholder: "Cercar...",
      language: "Català",
      user_zone: "Zona d'usuari",
      login_register: "Accedir / Registrar-se",
      my_profile: "El meu perfil",
      my_ads: "Els meus anuncis",
      logout: "Tancar sessió",
      publish: "Publicar"
    },
    menu: {
      ocio: "Oci",
      servicios: "Serveis",
      formacion: "Formació",
      empleo: "Ocupació",
      comunidad: "Comunitat",
      viviendas_trabajo: "Allotjaments + treball",
      noticias: "Notícies"
    },
    home: {
      hero_title: "CityPaj",
      hero_subtitle: "La teva ciutat, els teus anuncis, la teva comunitat",
      select_community: "Selecciona la teva comunitat",
      how_it_works: "Com funciona CityPaj",
      latest_ads: "Últims anuncis",
      no_ads: "No hi ha anuncis per aquest filtre.",
      spain: "Espanya"
    },
    publish_form: {
      title: "Publicar anunci",
      subtitle: "Comparteix la teva oportunitat amb la comunitat",
      fields: {
        title: "Títol de l'anunci *",
        description: "Descripció detallada *",
        category: "Categoria *",
        offer_demand: "Tipus d'anunci *",
        name: "Nom *",
        community: "Comunitat Autònoma *",
        province: "Província *",
        email_required: "Email de contacte *",
        phone_optional: "Telèfon (opcional)"
      },
      categories: {
        ocio: "Oci",
        servicios: "Serveis",
        educacion: "Formació",
        empleo: "Ocupació",
        intercambios: "Comunitat",
        oferta: "Oferta",
        demanda: "Demanda"
      },
      rules: {
        title: "Normes i condicions",
        text: "En publicar un anunci, acceptes complir amb les nostres normes de conducta i termes de servei. Els anuncis inadequats seran eliminats.",
        accept: "Accepto les normes i condicions",
        required: "Has d'acceptar les normes i condicions"
      },
      posting: "Publicant...",
      post: "Publicar anunci",
      failed: "Error al publicar. Intenta de nou.",
      api_error: "Error al publicar l'anunci"
    },
    my_ads: {
      title: "Els meus anuncis",
      no_ads: "No tens anuncis publicats",
      edit: "Editar",
      delete: "Eliminar",
      code: "Codi d'anunci:"
    },
    common: {
      back: "Tornar",
      cancel: "Cancel·lar",
      loading: "Carregant...",
      searching: "Cercant...",
      edition: "LLISTAT D'ANUNCIS",
      search: "Cercar...",
      publish_new: "Publicar nou",
      volver: "Tornar"
    }
  }
};

// Hook de traducción por IA - SIMPLE
export function useAITranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('es');
  
  // Obtener idioma guardado o detectar del navegador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('citypaj_language');
      
      if (saved && translations[saved]) {
        setCurrentLanguage(saved);
        document.documentElement.lang = saved;
      } else {
        // Detectar idioma del navegador
        const browserLang = navigator.language.split('-')[0];
        
        if (translations[browserLang]) {
          setCurrentLanguage(browserLang);
          document.documentElement.lang = browserLang;
        }
      }
    }
  }, []);
  
  // Cambiar idioma con traducción automática
  const changeLanguage = (lang: string) => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('citypaj_language', lang);
        document.documentElement.lang = lang;
        
        // Reload para asegurar traducción completa
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }
  };
  
  // Función de traducción
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Si no encuentra la traducción, devuelve la clave
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  // Obtener idiomas disponibles
  const getAvailableLanguages = () => {
    return [
      { code: 'es', name: 'Español' },
      { code: 'ca', name: 'Catalán' },
      { code: 'va', name: 'Valenciano' },
      { code: 'gl', name: 'Gallego' },
      { code: 'eu', name: 'Euskera (vasco)' },
      { code: 'oc', name: 'Aranés (occitano)' },
      { code: 'ar', name: 'Árabe' },
      { code: 'ro', name: 'Rumano' },
      { code: 'en', name: 'Inglés' },
      { code: 'fr', name: 'Francés' },
      { code: 'zh', name: 'Chino' },
      { code: 'ja', name: 'Japonés' }
    ];
  };
  
  return {
    t,
    currentLanguage,
    changeLanguage,
    getAvailableLanguages,
    isReady: true
  };
}

// Exportar traducciones para uso directo
export { translations };
export type { TranslationKeys };
