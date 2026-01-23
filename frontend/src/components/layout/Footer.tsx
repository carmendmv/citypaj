'use client';

/**
 * Footer Component - Componente de pie de página profesional NY Times
 * 
 * Propósito: Proporcionar navegación secundaria, información legal y branding
 * Arquitectura: Componente funcional con enlaces organizados por secciones
 * Optimización: Memoizado y estructura semántica SEO
 * Accesibilidad: Navegación con ARIA labels y estructura clara
 * 
 * @component Footer
 * @returns {JSX.Element} Footer profesional con múltiples secciones
 */

import React, { memo } from 'react';
import { Mail, Phone, MapPin, Twitter, Instagram, Linkedin, Facebook, GraduationCap } from 'lucide-react';

/**
 * Componente Footer - Pie de página corporativo con información completa
 * 
 * Características principales:
 * - Estructura en 4 columnas informativas estilo NY Times
 * - Información de contacto y redes sociales
 * - Enlaces legales y de ayuda
 * - Branding del TFG
 * - Diseño responsive y accesible
 */
 const Footer: React.FC = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-[#111] text-gray-200"
      role="contentinfo"
      aria-label="Pie de página de CityPaj"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Contenido principal del footer - Horizontal responsive */}
        <div className="py-12 border-t border-black">
          {/* Layout horizontal para desktop, vertical para móvil */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-10">
            
            {/* Sección principal - Branding y descripción */}
            <div className="flex-1 lg:max-w-md">
              <h3 className="font-serif font-bold text-white text-lg tracking-tight">
                CityPaj
              </h3>
              <p className="text-sm font-sans text-gray-300 mt-3 mb-6 leading-relaxed">
                Plataforma líder de anuncios juvenil para el siglo XXI. 
                Conectando jóvenes de toda España con oportunidades únicas.
              </p>
              
              {/* Contacto */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <span className="text-sm font-sans text-gray-300">hola@citypaj.es</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <span className="text-sm font-sans text-gray-300">900 123 456</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <span className="text-sm font-sans text-gray-300">España</span>
                </div>
              </div>
            </div>

            {/* Enlaces organizados horizontalmente */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
              
              {/* Servicios */}
              <nav aria-label="Servicios">
                <h4 className="text-xs font-sans tracking-widest text-gray-400">NOTICIAS</h4>
                <ul className="mt-4 space-y-2">
                  <li><a href="#news" className="text-sm font-sans text-gray-300 hover:text-orange-400">News</a></li>
                  <li><a href="#opinion" className="text-sm font-sans text-gray-300 hover:text-orange-400">Opinion</a></li>
                  <li><a href="#science" className="text-sm font-sans text-gray-300 hover:text-orange-400">Science</a></li>
                  <li><a href="#health" className="text-sm font-sans text-gray-300 hover:text-orange-400">Health</a></li>
                </ul>
              </nav>

              {/* Ayuda */}
              <nav aria-label="Suscripciones">
                <h4 className="text-xs font-sans tracking-widest text-gray-400">SUSCRIPCIONES</h4>
                <ul className="mt-4 space-y-2">
                  <li><a href="#suscripciones" className="text-sm font-sans text-gray-300 hover:text-orange-400">Suscripciones</a></li>
                  <li><a href="#newsletter" className="text-sm font-sans text-gray-300 hover:text-orange-400">Newsletter</a></li>
                  <li><a href="#cuenta" className="text-sm font-sans text-gray-300 hover:text-orange-400">Cuenta</a></li>
                  <li><a href="#ayuda" className="text-sm font-sans text-gray-300 hover:text-orange-400">Ayuda</a></li>
                </ul>
              </nav>

              {/* Legal */}
              <nav aria-label="Legal">
                <h4 className="text-xs font-sans tracking-widest text-gray-400">LEGAL</h4>
                <ul className="mt-4 space-y-2">
                  <li><a href="#privacidad" className="text-sm font-sans text-gray-300 hover:text-orange-400">Privacidad</a></li>
                  <li><a href="#terminos" className="text-sm font-sans text-gray-300 hover:text-orange-400">Términos</a></li>
                  <li><a href="#cookies" className="text-sm font-sans text-gray-300 hover:text-orange-400">Cookies</a></li>
                  <li><a href="#rgpd" className="text-sm font-sans text-gray-300 hover:text-orange-400">RGPD</a></li>
                </ul>
              </nav>
            </div>

            {/* Redes sociales - alineado a la derecha en desktop */}
            <div>
              <h4 className="text-xs font-sans tracking-widest text-gray-400 mb-4">REDES</h4>
              <div className="flex gap-3">
                <a 
                  href="#twitter" 
                  className="inline-flex items-center justify-center w-9 h-9 border border-gray-700 text-gray-200 hover:text-orange-400 hover:border-orange-400"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="#instagram" 
                  className="inline-flex items-center justify-center w-9 h-9 border border-gray-700 text-gray-200 hover:text-orange-400 hover:border-orange-400"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#linkedin" 
                  className="inline-flex items-center justify-center w-9 h-9 border border-gray-700 text-gray-200 hover:text-orange-400 hover:border-orange-400"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="#facebook" 
                  className="inline-flex items-center justify-center w-9 h-9 border border-gray-700 text-gray-200 hover:text-orange-400 hover:border-orange-400"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
                {/* Bottom bar - copyright y branding */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            {/* Copyright */}
            <div className="text-xs font-sans text-gray-400">
              © {currentYear} CityPaj. Todos los derechos reservados.
            </div>
            
            {/* Branding TFG */}
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-orange-400" aria-hidden="true" />
              <span className="text-xs font-sans text-gray-400">
                TFG 2DAW - Desarrollo de Aplicaciones Web
              </span>
            </div>
            
            {/* Estado plataforma */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs font-sans text-green-400">
                PLATAFORMA OPERATIVA
              </span>
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
