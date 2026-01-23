'use client';

/**
 * Header Component - Componente principal de navegación
 * 
 * Propósito: Proporcionar navegación principal y branding de CityPaj
 * Arquitectura: Componente funcional con hooks de estado para interactividad
 * Optimización: Memoizado para evitar re-renders innecesarios
 * Accesibilidad: Navegación semántica con ARIA labels
 */

import React, { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, User } from 'lucide-react';

// Constantes para comunidades autónomas - optimización de rendimiento
const COMUNIDADES_AUTONOMAS = [
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
  'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña',
  'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid',
  'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
];

// Interfaces TypeScript para tipado estricto
interface HeaderProps {
  onComunidadChange?: (comunidad: string) => void;
  onSearch?: (codigo: string) => void;
  onCategoriaChange?: (categoria: string) => void;
  onPublicar?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
}

/**
 * Componente Header - Navegación principal con funcionalidades avanzadas
 */
const Header: React.FC<HeaderProps> = memo(({
  onComunidadChange,
  onSearch,
  onCategoriaChange,
  onPublicar,
  onLogin,
  onLogout
}) => {
  const router = useRouter();

  // Estados locales para controlar interactividad
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchCodigo, setSearchCodigo] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const MENU_PRINCIPAL = [
    {
      label: 'Ocio',
      categoria: 'ocio',
      href: '/ocio',
      descripcion: 'Eventos, conciertos, cultura y planes juveniles en tu comunidad.',
    },
    {
      label: 'Servicios',
      categoria: 'servicios',
      href: '/servicios',
      descripcion: 'Transporte, salud juvenil, vivienda, ayudas y trámites.',
    },
    {
      label: 'Formación',
      categoria: 'educacion',
      href: '/formacion',
      descripcion: 'Cursos, talleres, becas y recursos educativos.',
    },
    {
      label: 'Empleo',
      categoria: 'empleo',
      href: '/empleo',
      descripcion: 'Ofertas, prácticas, voluntariado y oportunidades laborales.',
    },
    {
      label: 'Comunidad',
      categoria: 'intercambios',
      href: '/comunidad',
      descripcion: 'Espacio participativo: intercambio, propuestas y colaboración.',
    },
  ] as const;

  /**
   * Manejador de búsqueda de anuncios por código
   */
  const handleSearch = useCallback(() => {
    if (searchCodigo.trim()) {
      if (onSearch) {
        onSearch(searchCodigo.trim());
      } else {
        router.push(`/buscar?q=${encodeURIComponent(searchCodigo.trim())}`);
        setIsMobileMenuOpen(false);
      }
    }
  }, [searchCodigo, onSearch, router]);

  /**
   * Manejador de selección de comunidad autónoma
   */
  const handleComunidadSelect = useCallback((comunidad: string) => {
    onComunidadChange?.(comunidad);
  }, [onComunidadChange]);

  /**
   * Manejador de menú móvil
   */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((v) => !v);
  }, []);

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
    onLogout?.();
  }, [onLogout]);

  return (
    <header 
      className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black"
      role="banner"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Barra superior con información contextual */}
        <div className="hidden md:block py-2">
          <div className="flex justify-between items-center text-xs font-sans text-gray-600">
            <time dateTime={new Date().toISOString()}>
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }).toUpperCase()}
            </time>
            <span className="text-gray-600">EDICION ESPANA</span>
          </div>
        </div>

        {/* Navegación principal */}
        <nav className="py-4" role="navigation" aria-label="Menú principal">
          <div className="flex items-center justify-between gap-6">
            {/* Logo y branding */}
            <div className="flex items-center">
              <Link
                className="logo-link text-xl md:text-5xl font-serif tracking-tight text-black hover:text-orange-500 transition-colors"
                href="/"
              >
                CityPaj
              </Link>
            </div>

            {/* Navegación desktop - Links estilo NYT */}
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
            </div>

            {/* Acciones derecha */}
            <div className="flex items-center gap-3">
              {/* Búsqueda */}
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

              {/* Publicar */}
              <Link
                href="/publicar"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hidden md:inline-flex items-center justify-center border border-black bg-black text-white px-3 py-2 text-sm font-sans hover:bg-orange-500 hover:border-orange-500 transition-colors"
              >
                Publicar
              </Link>

              {/* Perfil */}
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
                      <Link
                        href="/acceder"
                        className="block px-4 py-2 font-sans text-sm text-black hover:bg-orange-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Acceder / Registrarse
                      </Link>

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

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 font-sans text-sm text-black hover:bg-orange-50"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón menú móvil */}
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

          {/* Menú móvil */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 border-t border-black pt-4">
              <div className="space-y-3">
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

                <div className="pt-3 border-t border-black">
                  <div className="font-sans text-xs text-gray-600 mb-2">ZONA DE USUARIO</div>
                  <div className="space-y-2">
                    <Link
                      href="/acceder"
                      className="block font-sans text-sm text-black hover:text-orange-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Acceder / Registrarse
                    </Link>

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

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left font-sans text-sm text-black hover:text-orange-500"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-black">
                  <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="comunidad-mobile">
                    Comunidad autónoma
                  </label>
                  <select
                    id="comunidad-mobile"
                    className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none"
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

                <div className="pt-3 border-t border-black">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchCodigo}
                      onChange={(e) => setSearchCodigo(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1 px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none"
                      aria-label="Buscar"
                    />
                    <button
                      onClick={handleSearch}
                      className="inline-flex items-center justify-center w-10 h-10 border border-black text-black"
                      aria-label="Buscar"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href="/publicar"
                    onClick={() => {
                      handleComunidadSelect('Todas');
                      onPublicar?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block text-center w-full border border-black bg-black text-white py-2 text-sm font-sans hover:bg-orange-500 hover:border-orange-500"
                  >
                    Publicar
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
 });

// DisplayName para debugging
Header.displayName = 'Header';

export default Header;
