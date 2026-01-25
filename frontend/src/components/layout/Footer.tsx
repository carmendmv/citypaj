'use client';

/**
 * Footer Component - Componente de pie de página moderno y minimalista
 * 
 * Propósito: Proporcionar navegación secundaria, información legal y branding
 * Arquitectura: Componente funcional con diseño limpio y moderno
 * Optimización: Memoizado y estructura semántica SEO
 * Accesibilidad: Navegación con ARIA labels y estructura clara
 * 
 * @component Footer
 * @returns {JSX.Element} Footer moderno con diseño minimalista
 */

import React, { memo } from 'react';
import Link from 'next/link';

/**
 * Componente Footer - Pie de página moderno y elegante
 * 
 * Características principales:
 * - Diseño minimalista y moderno
 * - Gradiente sutil de fondo
 * - Enlaces con hover effects mejorados
 * - Espaciado optimizado
 * - Branding del TFG
 * - Diseño responsive y accesible
 */
const Footer: React.FC = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-gradient-to-br from-gray-900 to-black text-gray-200 border-t border-gray-800"
      role="contentinfo"
      aria-label="Pie de página de CityPaj"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Contenido principal del footer - Horizontal responsive */}
        <div className="py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Branding y descripción */}
            <div className="flex flex-col gap-3">
              <h3 className="font-serif text-2xl font-bold text-white">CityPaj</h3>
              <p className="text-sm font-sans text-gray-400 max-w-sm">
                Plataforma juvenil de anuncios clasificados para toda España. 
                Conectando oportunidades y comunidad en un solo lugar.
              </p>
            </div>

            {/* Navegación */}
            <nav aria-label="Footer" className="flex flex-col gap-4">
              <h4 className="font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Explorar
              </h4>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <Link href="/ocio" className="text-sm font-sans text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  Ocio
                </Link>
                <Link href="/servicios" className="text-sm font-sans text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  Servicios
                </Link>
                <Link href="/empleo" className="text-sm font-sans text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  Empleo
                </Link>
                <Link href="/formacion" className="text-sm font-sans text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  Formación
                </Link>
                <Link href="/comunidad" className="text-sm font-sans text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  Comunidad
                </Link>
              </div>
            </nav>

            {/* Legal y contacto */}
            <div className="flex flex-col gap-4">
              <h4 className="font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Legal
              </h4>
              <div className="flex flex-col gap-2">
                <Link href="/contacto" className="text-sm font-sans text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  Contacto
                </Link>
                <Link href="/terminos" className="text-sm font-sans text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  Términos y condiciones
                </Link>
                <Link href="/privacidad" className="text-sm font-sans text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  Política de privacidad
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="py-6 border-t border-gray-800">
          <div className="text-center">
            <div className="text-xs font-sans text-gray-400">
              © {currentYear} CityPaj. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

// DisplayName para debugging
Footer.displayName = 'Footer';

export default Footer;
