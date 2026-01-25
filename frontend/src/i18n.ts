import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Recursos de traducción con UTF-8 correcto
const resources = {
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
        user_zone: "Zona de usuario",
        login_register: "Acceder / Registrarse",
        my_profile: "Mi perfil",
        my_ads: "Mis anuncios",
        logout: "Cerrar sesión",
        publish: "Publicar"
      },
      home: {
        hero_title: "CityPaj",
        hero_subtitle: "Tu ciudad, tus anuncios, tu comunidad",
        filter_button: "Buscar",
        latest_ads: "Últimos anuncios",
        no_ads: "No hay anuncios para este filtro.",
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
      }
    }
  },
  ca: {
    translation: {
      menu: {
        ocio: "Oci",
        servicios: "Serveis",
        formacion: "Formació",
        empleo: "Feina",
        comunidad: "Comunitat",
        viviendas_trabajo: "Allotjament + feina",
        noticias: "Notícies"
      },
      common: {
        back: "Tornar",
        cancel: "Cancel·lar",
        loading: "Carregant...",
        searching: "Cercant...",
        edition: "EDICIÓ CATALANA",
        language: "Idioma",
        search: "Cercar...",
        user_zone: "Zona d'usuari",
        login_register: "Accedir / Registrar-se",
        my_profile: "El meu perfil",
        my_ads: "Els meus anuncis",
        logout: "Tancar sessió",
        publish: "Publicar"
      },
      home: {
        hero_title: "CityPaj",
        hero_subtitle: "La teva ciutat, els teus anuncis, la teva comunitat",
        filter_button: "Cercar",
        latest_ads: "Últims anuncis",
        no_ads: "No hi ha anuncis per aquest filtre.",
        spain: "Espanya"
      }
    }
  },
  va: {
    translation: {
      menu: {
        ocio: "Oci",
        servicios: "Serveis",
        formacion: "Formació",
        empleo: "Feina",
        comunidad: "Comunitat",
        viviendas_trabajo: "Allotjament + feina",
        noticias: "Notícies"
      },
      common: {
        back: "Tornar",
        cancel: "Cancel·lar",
        loading: "Carregant...",
        searching: "Buscant...",
        edition: "EDICIÓ VALENCIANA",
        language: "Idioma",
        search: "Buscar...",
        user_zone: "Zona d'usuari",
        login_register: "Accedir / Registrar-se",
        my_profile: "El meu perfil",
        my_ads: "Els meus anuncis",
        logout: "Tancar sessió",
        publish: "Publicar"
      },
      home: {
        hero_title: "CityPaj",
        hero_subtitle: "La teua ciutat, els teus anuncis, la teua comunitat",
        filter_button: "Buscar",
        latest_ads: "Últims anuncis",
        no_ads: "No hi ha anuncis per a este filtre.",
        spain: "Espanya"
      }
    }
  },
  gl: {
    translation: {
      menu: {
        ocio: "Ocio",
        servicios: "Servizos",
        formacion: "Formación",
        empleo: "Emprego",
        comunidad: "Comunidade",
        viviendas_trabajo: "Vivendas + traballo",
        noticias: "Noticias"
      },
      common: {
        back: "Volver",
        cancel: "Cancelar",
        loading: "Cargando...",
        searching: "Buscando...",
        edition: "EDICIÓN GALEGA",
        language: "Idioma",
        search: "Buscar...",
        user_zone: "Zona de usuario",
        login_register: "Acceder / Rexistrarse",
        my_profile: "O meu perfil",
        my_ads: "Os meus anuncios",
        logout: "Pechar sesión",
        publish: "Publicar"
      },
      home: {
        hero_title: "CityPaj",
        hero_subtitle: "A túa cidade, os teus anuncios, a túa comunidade",
        filter_button: "Buscar",
        latest_ads: "Últimos anuncios",
        no_ads: "Non hai anuncios para este filtro.",
        spain: "España"
      }
    }
  },
  eu: {
    translation: {
      menu: {
        ocio: "Ocioa",
        servicios: "Zerbitzuak",
        formacion: "Hezkuntza",
        empleo: "Lana",
        comunidad: "Komunitatea",
        viviendas_trabajo: "Etxebizitzak + lana",
        noticias: "Berriak"
      },
      common: {
        back: "Itzuli",
        cancel: "Utzi",
        loading: "Kargatzen...",
        searching: "Bilatzen...",
        edition: "EDICIÓN EUSKERA",
        language: "Hizkuntza",
        search: "Bilatu...",
        user_zone: "Erabiltzailearen area",
        login_register: "Sartu / Erregistratu",
        my_profile: "Nire profila",
        my_ads: "Nire iragarkiak",
        logout: "Saioa itxi",
        publish: "Argitaratu"
      },
      home: {
        hero_title: "CityPaj",
        hero_subtitle: "Zure hiria, zure iragarkiak, zure komunitatea",
        filter_button: "Bilatu",
        latest_ads: "Azken iragarkiak",
        no_ads: "Ez dago iragarkirik filtro honentzat.",
        spain: "Espainia"
      }
    }
  },
  ar: {
    translation: {
      menu: {
        ocio: "ترفيه",
        servicios: "خدمات",
        formacion: "تكوين",
        empleo: "توظيف",
        comunidad: "مجتمع",
        viviendas_trabajo: "سكن + عمل",
        noticias: "أخبار"
      },
      common: {
        back: "عودة",
        cancel: "إلغاء",
        loading: "جاري التحميل...",
        searching: "جاري البحث...",
        edition: "الطبعة الإسبانية",
        language: "اللغة",
        search: "بحث...",
        user_zone: "منطقة المستخدم",
        login_register: "دخول / تسجيل",
        my_profile: "ملفي الشخصي",
        my_ads: "إعلاناتي",
        logout: "إغلاق الجلسة",
        publish: "نشر"
      },
      home: {
        hero_title: "سيتي باج",
        hero_subtitle: "مدينتك، إعلاناتك، مجتمعك",
        filter_button: "بحث",
        latest_ads: "آخر الإعلانات",
        no_ads: "لا توجد إعلانات لهذا الفلتر.",
        spain: "إسبانيا"
      }
    }
  },
  ro: {
    translation: {
      menu: {
        ocio: "Divertisment",
        servicios: "Servicii",
        formacion: "Formare",
        empleo: "Angajare",
        comunidad: "Comunitate",
        viviendas_trabajo: "Locuințe + muncă",
        noticias: "Știri"
      },
      common: {
        back: "Înapoi",
        cancel: "Anulează",
        loading: "Se încarcă...",
        searching: "Se caută...",
        edition: "EDIȚIA SPANIA",
        language: "Limba",
        search: "Caută...",
        user_zone: "Zonă utilizator",
        login_register: "Accesare / Înregistrare",
        my_profile: "Profilul meu",
        my_ads: "Anunțurile mele",
        logout: "Închide sesiunea",
        publish: "Publică"
      },
      home: {
        hero_title: "CityPaj",
        hero_subtitle: "Orașul tău, anunțurile tale, comunitatea ta",
        filter_button: "Caută",
        latest_ads: "Ultimele anunțuri",
        no_ads: "Nu există anunțuri pentru acest filtru.",
        spain: "Spania"
      }
    }
  },
  en: {
    translation: {
      menu: {
        ocio: "Leisure",
        servicios: "Services",
        formacion: "Education",
        empleo: "Jobs",
        comunidad: "Community",
        viviendas_trabajo: "Housing + jobs",
        noticias: "News"
      },
      common: {
        back: "Back",
        cancel: "Cancel",
        loading: "Loading...",
        searching: "Searching...",
        edition: "SPAIN EDITION",
        language: "Language",
        search: "Search...",
        user_zone: "User area",
        login_register: "Sign in / Sign up",
        my_profile: "My profile",
        my_ads: "My ads",
        logout: "Log out",
        publish: "Publish"
      },
      home: {
        hero_title: "CityPaj",
        hero_subtitle: "Your city, your listings, your community",
        filter_button: "Search",
        latest_ads: "Latest listings",
        no_ads: "No listings for this filter.",
        spain: "Spain"
      }
    }
  },
  fr: {
    translation: {
      menu: {
        ocio: "Loisirs",
        servicios: "Services",
        formacion: "Formation",
        empleo: "Emploi",
        comunidad: "Communauté",
        viviendas_trabajo: "Logement + travail",
        noticias: "Actualités"
      },
      common: {
        back: "Retour",
        cancel: "Annuler",
        loading: "Chargement...",
        searching: "Recherche...",
        edition: "ÉDITION ESPAGNE",
        language: "Langue",
        search: "Rechercher...",
        user_zone: "Zone utilisateur",
        login_register: "Se connecter / S'inscrire",
        my_profile: "Mon profil",
        my_ads: "Mes annonces",
        logout: "Fermer la session",
        publish: "Publier"
      },
      home: {
        hero_title: "CityPaj",
        hero_subtitle: "Votre ville, vos annonces, votre communauté",
        filter_button: "Rechercher",
        latest_ads: "Dernières annonces",
        no_ads: "Pas d'annonces pour ce filtre.",
        spain: "Espagne"
      }
    }
  },
  zh: {
    translation: {
      menu: {
        ocio: "休闲",
        servicios: "服务",
        formacion: "培训",
        empleo: "就业",
        comunidad: "社区",
        viviendas_trabajo: "住房 + 工作",
        noticias: "新闻"
      },
      common: {
        back: "返回",
        cancel: "取消",
        loading: "加载中...",
        searching: "搜索中...",
        edition: "西班牙版",
        language: "语言",
        search: "搜索...",
        user_zone: "用户区域",
        login_register: "登录 / 注册",
        my_profile: "我的个人资料",
        my_ads: "我的广告",
        logout: "关闭会话",
        publish: "发布"
      },
      home: {
        hero_title: "城市广场",
        hero_subtitle: "你的城市，你的广告，你的社区",
        filter_button: "搜索",
        latest_ads: "最新广告",
        no_ads: "此筛选器没有广告。",
        spain: "西班牙"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es",
    fallbackLng: "es",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
