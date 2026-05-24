'use client';

import React, { useState, memo, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAITranslation } from '@/lib/ai-translation';
import { Search, Menu, X, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const COMUNIDADES_AUTONOMAS = [
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
  'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña',
  'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid',
  'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
];

const IDIOMAS = [
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

interface HeaderProps {
  onComunidadChange?: (comunidad: string) => void;
  onSearch?: (codigo: string) => void;
  onCategoriaChange?: (categoria: string) => void;
  onPublicar?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
}

const MENU_PRINCIPAL = [
  {
    categoria: 'ocio',
    label: 'Ocio',
    descripcion: 'Eventos, conciertos y cultura',
    href: '/ocio'
  },
  {
    categoria: 'servicios',
    label: 'Servicios',
    descripcion: 'Transporte, salud y vivienda',
    href: '/servicios'
  },
  {
    categoria: 'educacion',
    label: 'Formación',
    descripcion: 'Cursos, talleres y becas',
    href: '/formacion'
  },
  {
    categoria: 'empleo',
    label: 'Empleo',
    descripcion: 'Ofertas laborales y prácticas',
    href: '/empleo'
  }
];

const Header: React.FC<HeaderProps> = memo(({
  onComunidadChange,
  onSearch,
  onCategoriaChange,
  onPublicar,
  onLogin,
  onLogout
}) => {
  const router = useRouter();
  const { t, currentLanguage, changeLanguage, getAvailableLanguages } = useAITranslation();
  const { user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchCodigo, setSearchCodigo] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = useCallback(() => {
    if (searchCodigo.trim()) {
      if (onSearch) {
        onSearch(searchCodigo.trim());
      } else {
        router.push(`/?buscar=${encodeURIComponent(searchCodigo.trim())}`);
        setIsMobileMenuOpen(false);
      }
    }
  }, [searchCodigo, onSearch, router]);

  const handleComunidadSelect = useCallback(
    (comunidad: string) => {
      onComunidadChange?.(comunidad);
      setIsMobileMenuOpen(false);
    },
    [onComunidadChange]
  );

  const handleCategoriaSelect = useCallback(
    (categoria: string) => {
      onCategoriaChange?.(categoria);
      setIsMobileMenuOpen(false);
    },
    [onCategoriaChange]
  );

  const handleLogout = useCallback(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      void logout();
    }
  }, [onLogout, logout]);

  
  const dateLocale = useMemo(() => {
    const lng = (currentLanguage || 'es').toLowerCase();
    if (lng.startsWith('en')) return 'en-GB';
    if (lng.startsWith('fr')) return 'fr-FR';
    if (lng.startsWith('de')) return 'de-DE';
    if (lng.startsWith('it')) return 'it-IT';
    if (lng.startsWith('pt')) return 'pt-PT';
    if (lng.startsWith('pl')) return 'pl-PL';
    if (lng.startsWith('ru')) return 'ru-RU';
    if (lng.startsWith('zh')) return 'zh-CN';
    if (lng.startsWith('hi')) return 'hi-IN';
    if (lng.startsWith('ar')) return 'ar';
    return 'es-ES';
  }, [currentLanguage]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen(!isUserMenuOpen);
  }, [isUserMenuOpen]);

  return (
    <header 
      className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black"
      role="banner"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="hidden md:block py-2">
          <div className="flex justify-between items-center text-xs font-sans text-gray-600">
            <time dateTime={new Date().toISOString()}>
              {new Date().toLocaleDateString(dateLocale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }).toUpperCase()}
            </time>
            <span className="text-gray-600">LISTADO DE ANUNCIOS</span>
          </div>
        </div>

        <nav className="py-4" role="navigation" aria-label="Menú principal">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center">
              <Link
                className="logo-link text-xl md:text-5xl font-serif tracking-tight text-black hover:text-orange-500 transition-colors"
                href="/"
              >
                CityPaj
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              {MENU_PRINCIPAL.map((item) => (
                <Link
                  key={item.categoria}
                  title={item.descripcion}
                  className="text-base font-serif text-black hover:text-orange-500 hover:underline underline-offset-8 decoration-2"
                  href={item.href}
                  onClick={() => handleCategoriaSelect(item.categoria)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/buzon-sugerencias"
                className="text-base font-serif text-black hover:text-orange-500 hover:underline underline-offset-8 decoration-2"
              >
                Buzón de Sugerencias
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchCodigo}
                    onChange={(e) => setSearchCodigo(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-48 lg:w-56 pl-3 pr-9 py-2 text-sm font-sans border border-black bg-white focus:outline-none"
                    aria-label="Buscar"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-orange-500"
                    aria-label="Buscar"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Link
                href="/publicar"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hidden md:inline-flex items-center justify-center border border-black bg-black text-white px-3 py-2 text-sm font-sans hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-colors"
              >
                Publicar
              </Link>

              <div className="hidden md:block">
                <select
                  value={currentLanguage}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    changeLanguage(newLang);
                    // Forzar actualización inmediata
                    setTimeout(() => {
                      window.location.reload();
                    }, 50);
                  }}
                  className="w-40 border border-black bg-white px-2 py-2 text-sm font-sans text-black focus:outline-none cursor-pointer"
                  aria-label="Idioma"
                >
                  {getAvailableLanguages().map(idioma => (
                    <option key={idioma.code} value={idioma.code}>
                      {idioma.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative hidden md:block">
                <button
                  onClick={toggleUserMenu}
                  className="inline-flex items-center justify-center w-9 h-9 border border-black text-black hover:text-orange-500"
                  aria-label="Zona de usuario"
                  aria-expanded={isUserMenuOpen}
                >
                  <User className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 border border-black bg-white shadow-sm">
                    <div className="px-4 py-2 border-b border-black font-sans text-xs text-gray-600">
                      ZONA DE USUARIO
                    </div>

                    <div className="py-1">
                      {!user ? (
                        <Link
                          href="/acceder"
                          className="block px-4 py-2 font-sans text-sm text-black hover:bg-orange-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Acceder / Registrarse
                        </Link>
                      ) : null}

                      <Link
                        href="/mi-perfil"
                        className="block px-4 py-2 font-sans text-sm text-black hover:bg-orange-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mi perfil
                      </Link>

                      <Link
                        href="/mis-anuncios"
                        className="block px-4 py-2 font-sans text-sm text-black hover:bg-orange-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mis anuncios
                      </Link>

                      {user ? (
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 font-sans text-sm text-black hover:bg-orange-50"
                        >
                          Cerrar sesión
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={toggleMobileMenu}
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 border border-black text-black"
                aria-label="Toggle menú móvil"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 border-t border-black pt-4">
              <div className="space-y-4">
                <div>
                  <div className="font-sans text-xs text-gray-600 mb-2">COMUNIDAD AUTÓNOMA</div>
                  <div className="flex items-center gap-2">
                    <select
                      id="comunidad-mobile"
                      className="flex-1 px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none"
                      defaultValue="Todas"
                      onChange={(e) => handleComunidadSelect(e.target.value)}
                    >
                      <option value="Todas">Todas</option>
                      {COMUNIDADES_AUTONOMAS.map((comunidad) => (
                        <option key={comunidad} value={comunidad}>
                          {comunidad}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      handleComunidadSelect('Todas');
                      setIsMobileMenuOpen(false);
                    }}
                    className="mt-2 w-full bg-black text-white border border-black px-4 py-2 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
                  >
                    Buscar
                  </button>
                </div>

                <div className="pt-3 border-t border-black">
                  <Link
                    href="/publicar"
                    onClick={() => {
                      handleComunidadSelect('Todas');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full bg-black text-white border border-black px-4 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors text-center"
                  >
                    Publicar anuncio
                  </Link>
                </div>

                <div className="pt-3 border-t border-black">
                  <div className="font-sans text-xs text-gray-600 mb-2">SECCIONES</div>
                  <div className="space-y-2">
                    {MENU_PRINCIPAL.map((item) => (
                      <Link
                        key={item.categoria}
                        href={item.href}
                        className="block w-full text-left"
                        onClick={() => handleCategoriaSelect(item.categoria)}
                      >
                        <div className="text-base font-serif text-black hover:text-orange-500">{item.label}</div>
                        <div className="mt-1 font-sans text-xs text-gray-600">{item.descripcion}</div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-black">
                  <div className="font-sans text-xs text-gray-600 mb-2">ZONA DE USUARIO</div>
                  <div className="space-y-2">
                    {!user ? (
                      <Link
                        href="/acceder"
                        className="block font-sans text-sm text-black hover:text-orange-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Acceder / Registrarse
                      </Link>
                    ) : null}

                    <Link
                      href="/mi-perfil"
                      className="block font-sans text-sm text-black hover:text-orange-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mi perfil
                    </Link>

                    <Link
                      href="/mis-anuncios"
                      className="block font-sans text-sm text-black hover:text-orange-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mis anuncios
                    </Link>

                    {user ? (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left font-sans text-sm text-black hover:text-orange-500"
                      >
                        Cerrar sesión
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="pt-3 border-t border-black">
                  <div className="font-sans text-xs text-gray-600 mb-2">IDIOMA</div>
                  <select
                    id="idioma-mobile"
                    className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none cursor-pointer"
                    value={currentLanguage}
                    onChange={(e) => {
                      const lang = e.target.value;
                      changeLanguage(lang);
                      setIsMobileMenuOpen(false);
                      // Forzar actualización inmediata
                      setTimeout(() => {
                        window.location.reload();
                      }, 50);
                    }}
                  >
                    {getAvailableLanguages().map(idioma => (
                      <option key={idioma.code} value={idioma.code}>
                        {idioma.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
