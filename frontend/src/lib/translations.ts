// Textos en español para la interfaz de CityPaj
// La aplicación es monolingüe; se mantiene el helper t() para no romper componentes.

export const resources = {
  es: {
    translation: {
      menu: {
        ocio: "Ocio",
        servicios: "Servicios",
        formacion: "Formación",
        empleo: "Empleo",
        comunidad: "Comunidad",
        viviendas_trabajo: "Viviendas + trabajo",
        noticias: "Noticias"
      },
      common: {
        back: "Volver",
        cancel: "Cancelar",
        loading: "Cargando...",
        searching: "Buscando...",
        edition: "LISTADO DE ANUNCIOS",
        language: "Idioma",
        search: "Buscar...",
        search_action: "Buscar",
        user_zone: "Zona de usuario",
        login_register: "Acceder / Registrarse",
        my_profile: "Mi perfil",
        my_ads: "Mis anuncios",
        my_saved: "Mis guardados",
        logout: "Cerrar sesión",
        publish: "Publicar",
        publish_ad: "Publicar anuncio",
        all: "Todas",
        sections: "SECCIONES",
        delete_account: "Eliminar cuenta"
      },
      home: {
        hero_title: "CityPaj",
        hero_subtitle: "Tu ciudad, tus anuncios, tu comunidad",
        filter_button: "Buscar",
        latest_ads: "Últimos anuncios",
        no_ads: "No hay anuncios para este filtro.",
        no_ads_text: "Sé el primero en publicar una oportunidad en tu provincia.",
        spain: "España",
        edit_ad: "Editar",
        delete_ad: "Eliminar",
        ad_code: "Código de anuncio:",
        offer: "Oferta",
        demand: "Demanda",
        offer_demand: "Oferta/Demanda"
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
      publish: {
        community: "Comunidad Autónoma"
      }
    }
  }
};

export type SupportedLang = keyof typeof resources;

const flatten = (
  obj: Record<string, any>,
  prefix = '',
  result: Record<string, string> = {}
): Record<string, string> => {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      result[newKey] = value;
    } else if (value && typeof value === 'object') {
      flatten(value, newKey, result);
    }
  }
  return result;
};

const flatResources: Record<SupportedLang, Record<string, string>> = {} as any;
for (const lang of Object.keys(resources) as SupportedLang[]) {
  flatResources[lang] = flatten(resources[lang]?.translation || resources[lang] || {});
}

export const getKeyTranslation = (
  lang: SupportedLang,
  key: string,
  fallback?: string
): string => {
  const flat = flatResources[lang];
  if (flat && flat[key]) return flat[key];
  return fallback ?? key;
};

export const getTextTranslation = (
  lang: SupportedLang,
  text: string,
  fallback?: string
): string => {
  if (lang === 'es') return text;
  return fallback ?? text;
};

export interface Language {
  code: SupportedLang;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', nativeName: 'Español', flag: 'ES' },
];
