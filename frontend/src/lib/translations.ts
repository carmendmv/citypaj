export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: 'ES' },
  { code: 'en', name: 'English', nativeName: 'English', flag: 'GB' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: 'FR' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: 'IT' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'DE' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: 'PT' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: 'ES' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: 'ES' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: 'ES' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: 'SA' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: 'RO' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: 'CN' },
];

export type LangCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

const resources: Record<LangCode, Record<string, Record<string, string>>> = {
  es: {
    common: {
      search: 'Buscar...',
      back: 'Volver',
      cancel: 'Cancelar',
      loading: 'Cargando...',
      user_zone: 'Zona de usuario',
      login_register: 'Acceder / Registrarse',
      my_profile: 'Mi perfil',
      my_ads: 'Mis anuncios',
      my_saved: 'Mis guardados',
      logout: 'Cerrar sesión',
      publish: 'Publicar',
      publish_ad: 'Publicar anuncio',
      language: 'Idioma',
      searching: 'Buscando...',
    },
    human: {
      title: 'Verificación humana',
      disabled: 'La verificación automática está desactivada en este entorno.',
      verified: 'Verificado',
      required: 'Requerido',
      hint: 'Marca la casilla para continuar.',
    },
    publish: {
      title: 'Publicar anuncio',
      subtitle: 'Comparte tu anuncio con la comunidad juvenil',
      ad_title: 'Título del anuncio',
      description: 'Descripción detallada',
      category: 'Categoría',
      name: 'Nombre',
      community: 'Comunidad Autónoma',
      email: 'Correo electrónico',
      phone: 'Teléfono (opcional)',
      rules_title: 'Normas de publicación',
      rules_text: 'Al publicar un anuncio, aceptas que el contenido sea apropiado y cumpla con las normas de la comunidad. Nos reservamos el derecho de eliminar contenido inapropiado.',
      accept_rules: 'Acepto las normas de publicación',
      publishing: 'Publicando...',
      publish: 'Publicar anuncio',
      received_title: 'Anuncio recibido',
      received_text: 'Revisado por IA interna. Se publicará en breve.',
      code: 'Código',
      email_label: 'Correo',
      view_ad: 'Ver anuncio',
      home: 'Volver al inicio',
    },
    nav: {
      employment: 'Empleo',
      community: 'Comunidad',
      help: 'Ayudas',
      suggestions_box: 'Buzón de Sugerencias',
    },
    home: {
      latest_ads: 'Últimos anuncios',
      explore_categories: 'Explora por categorías',
      view_all: 'Ver todos',
      no_ads: 'Aún no hay anuncios',
      no_ads_text: 'Sé el primero en publicar un anuncio en tu provincia.',
    },
  },
  en: {
    common: {
      search: 'Search...',
      back: 'Back',
      cancel: 'Cancel',
      loading: 'Loading...',
      user_zone: 'User area',
      login_register: 'Login / Register',
      my_profile: 'My profile',
      my_ads: 'My ads',
      my_saved: 'My saved',
      logout: 'Log out',
      publish: 'Publish',
      publish_ad: 'Publish ad',
      language: 'Language',
      searching: 'Searching...',
    },
    human: {
      title: 'Human verification',
      disabled: 'Automatic verification is disabled in this environment.',
      verified: 'Verified',
      required: 'Required',
      hint: 'Check the box to continue.',
    },
    publish: {
      title: 'Publish ad',
      subtitle: 'Share your ad with the youth community',
      ad_title: 'Ad title',
      description: 'Detailed description',
      category: 'Category',
      name: 'Name',
      community: 'Autonomous Community',
      email: 'Email address',
      phone: 'Phone (optional)',
      rules_title: 'Publication rules',
      rules_text: 'By publishing an ad, you agree that the content is appropriate and complies with community rules. We reserve the right to remove inappropriate content.',
      accept_rules: 'I accept the publication rules',
      publishing: 'Publishing...',
      publish: 'Publish ad',
      received_title: 'Ad received',
      received_text: 'Reviewed by internal AI. It will be published shortly.',
      code: 'Code',
      email_label: 'Email',
      view_ad: 'View ad',
      home: 'Back to home',
    },
    nav: {
      employment: 'Employment',
      community: 'Community',
      help: 'Aid',
      suggestions_box: 'Suggestion box',
    },
    home: {
      latest_ads: 'Latest ads',
      explore_categories: 'Explore by category',
      view_all: 'View all',
      no_ads: 'No ads yet',
      no_ads_text: 'Be the first to publish an ad in your province.',
    },
  },
  fr: {
    common: {
      search: 'Rechercher...',
      back: 'Retour',
      cancel: 'Annuler',
      loading: 'Chargement...',
      user_zone: 'Espace utilisateur',
      login_register: 'Connexion / Inscription',
      my_profile: 'Mon profil',
      my_ads: 'Mes annonces',
      my_saved: 'Mes favoris',
      logout: 'Déconnexion',
      publish: 'Publier',
      publish_ad: 'Publier une annonce',
      language: 'Langue',
      searching: 'Recherche...',
    },
    human: {
      title: 'Vérification humaine',
      disabled: 'La vérification automatique est désactivée dans cet environnement.',
      verified: 'Vérifié',
      required: 'Requis',
      hint: 'Cochez la case pour continuer.',
    },
    publish: {
      title: 'Publier une annonce',
      subtitle: 'Partagez votre annonce avec la communauté jeunesse',
      ad_title: 'Titre de l\'annonce',
      description: 'Description détaillée',
      category: 'Catégorie',
      name: 'Nom',
      community: 'Communauté autonome',
      email: 'Adresse email',
      phone: 'Téléphone (optionnel)',
      rules_title: 'Règles de publication',
      rules_text: 'En publiant une annonce, vous acceptez que le contenu soit approprié et respecte les règles de la communauté. Nous nous réservons le droit de supprimer le contenu inapproprié.',
      accept_rules: 'J\'accepte les règles de publication',
      publishing: 'Publication...',
      publish: 'Publier l\'annonce',
      received_title: 'Annonce reçue',
      received_text: 'Examinée par IA interne. Elle sera publiée sous peu.',
      code: 'Code',
      email_label: 'Email',
      view_ad: 'Voir l\'annonce',
      home: 'Retour à l\'accueil',
    },
    nav: {
      employment: 'Emploi',
      community: 'Communauté',
      help: 'Aide',
      suggestions_box: 'Boîte à suggestions',
    },
    home: {
      latest_ads: 'Dernières annonces',
      explore_categories: 'Explorer par catégorie',
      view_all: 'Voir tout',
      no_ads: 'Pas encore d\'annonces',
      no_ads_text: 'Soyez le premier à publier une annonce dans votre province.',
    },
  },
  it: { common: { search: 'Cerca...', back: 'Indietro', cancel: 'Annulla', loading: 'Caricamento...', user_zone: 'Area utente', login_register: 'Accedi / Registrati', my_profile: 'Il mio profilo', my_ads: 'I miei annunci', my_saved: 'I miei salvati', logout: 'Esci', publish: 'Pubblica', publish_ad: 'Pubblica annuncio', language: 'Lingua', searching: 'Ricerca...' } },
  de: { common: { search: 'Suchen...', back: 'Zurück', cancel: 'Abbrechen', loading: 'Wird geladen...', user_zone: 'Benutzerbereich', login_register: 'Anmelden / Registrieren', my_profile: 'Mein Profil', my_ads: 'Meine Anzeigen', my_saved: 'Meine Favoriten', logout: 'Abmelden', publish: 'Veröffentlichen', publish_ad: 'Anzeige veröffentlichen', language: 'Sprache', searching: 'Suche...' } },
  pt: { common: { search: 'Pesquisar...', back: 'Voltar', cancel: 'Cancelar', loading: 'Carregando...', user_zone: 'Área do usuário', login_register: 'Entrar / Registrar', my_profile: 'Meu perfil', my_ads: 'Meus anúncios', my_saved: 'Meus salvos', logout: 'Sair', publish: 'Publicar', publish_ad: 'Publicar anúncio', language: 'Idioma', searching: 'Pesquisando...' } },
  ca: { common: { search: 'Cercar...', back: 'Tornar', cancel: 'Cancel·lar', loading: 'Carregant...', user_zone: 'Zona d\'usuari', login_register: 'Accedir / Registrar-se', my_profile: 'El meu perfil', my_ads: 'Els meus anuncis', my_saved: 'Els meus desats', logout: 'Tancar sessió', publish: 'Publicar', publish_ad: 'Publicar anunci', language: 'Idioma', searching: 'Cercant...' } },
  gl: { common: { search: 'Buscar...', back: 'Volver', cancel: 'Cancelar', loading: 'Cargando...', user_zone: 'Zona de usuario', login_register: 'Acceder / Rexistrarse', my_profile: 'O meu perfil', my_ads: 'Os meus anuncios', my_saved: 'Os meus gardados', logout: 'Pechar sesión', publish: 'Publicar', publish_ad: 'Publicar anuncio', language: 'Idioma', searching: 'Buscando...' } },
  eu: { common: { search: 'Bilatu...', back: 'Itzuli', cancel: 'Utzi', loading: 'Kargatzen...', user_zone: 'Erabiltzaile gunea', login_register: 'Sartu / Erregistratu', my_profile: 'Nire profila', my_ads: 'Nire iragarkiak', my_saved: 'Nire gordetakoak', logout: 'Itxi saioa', publish: 'Argitaratu', publish_ad: 'Iragarkia argitaratu', language: 'Hizkuntza', searching: 'Bilatzen...' } },
  ar: { common: { search: 'بحث...', back: 'عودة', cancel: 'إلغاء', loading: 'جار التحميل...', user_zone: 'منطقة المستخدم', login_register: 'تسجيل الدخول / التسجيل', my_profile: 'ملفي الشخصي', my_ads: 'إعلاناتي', my_saved: 'محفوظاتي', logout: 'تسجيل الخروج', publish: 'نشر', publish_ad: 'نشر إعلان', language: 'اللغة', searching: 'جاري البحث...' } },
  ro: { common: { search: 'Caută...', back: 'Înapoi', cancel: 'Anulează', loading: 'Se încarcă...', user_zone: 'Zona utilizatorului', login_register: 'Autentificare / Înregistrare', my_profile: 'Profilul meu', my_ads: 'Anunțurile mele', my_saved: 'Salvatele mele', logout: 'Deconectare', publish: 'Publică', publish_ad: 'Publică anunț', language: 'Limbă', searching: 'Căutare...' } },
  zh: { common: { search: '搜索...', back: '返回', cancel: '取消', loading: '加载中...', user_zone: '用户区域', login_register: '登录 / 注册', my_profile: '我的个人资料', my_ads: '我的广告', my_saved: '我的收藏', logout: '退出', publish: '发布', publish_ad: '发布广告', language: '语言', searching: '搜索中...' } },
};

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
    } else if (typeof value === 'object' && value !== null) {
      flatten(value, newKey, result);
    }
  }
  return result;
};

const flatResources: Record<LangCode, Record<string, string>> = {} as any;
for (const lang of Object.keys(resources) as LangCode[]) {
  flatResources[lang] = flatten(resources[lang] || {});
}

export const getTranslation = (
  lang: LangCode,
  key: string,
  fallback?: string
): string => {
  const flat = flatResources[lang];
  if (flat && flat[key]) return flat[key];
  const spanish = flatResources['es'];
  if (spanish && spanish[key]) return spanish[key];
  return fallback ?? key;
};
