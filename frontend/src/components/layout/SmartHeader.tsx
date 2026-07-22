'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/components/ui/TranslationProvider';
import AdvancedLanguageSelector from '@/components/ui/AdvancedLanguageSelector';

interface SmartHeaderProps {
  className?: string;
}

const SmartHeader: React.FC<SmartHeaderProps> = ({ className = '' }) => {
  const { t, currentLanguage, isLoading } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.anuncios', href: '/anuncios' },
    { key: 'nav.servicios', href: '/servicios' },
    { key: 'nav.comunidad', href: '/comunidad' },
    { key: 'nav.instituciones', href: '/instituciones' },
  ];

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🏙️</span>
              <span className="text-xl font-bold text-gray-900">
                {t('hero.title', 'CityPAJ')}
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          {/* Right side - Language selector and Auth */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <AdvancedLanguageSelector 
              variant="compact" 
              showNames={false}
              className="hidden sm:block"
            />

            {/* Auth buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <button className="text-gray-700 hover:text-orange-500 px-4 py-2 text-sm font-medium transition-colors duration-200">
                {t('nav.login')}
              </button>
              <button className="bg-orange-500 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors duration-200">
                {t('nav.register')}
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-gray-700 hover:text-orange-500 px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(item.key)}
                </a>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="px-3 py-2">
                <AdvancedLanguageSelector 
                  variant="dropdown"
                  isMobile={true}
                />
              </div>
              
              {/* Mobile Auth buttons */}
              <div className="px-3 py-2 space-y-2">
                <button className="w-full text-gray-700 hover:text-orange-500 px-4 py-2 text-base font-medium border border-gray-300 rounded-lg transition-colors duration-200">
                  {t('nav.login')}
                </button>
                <button className="w-full bg-orange-500 text-white px-4 py-2 text-base font-medium rounded-lg hover:bg-orange-600 transition-colors duration-200">
                  {t('nav.register')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500 animate-pulse">
          <div className="h-full bg-orange-600 animate-pulse"></div>
        </div>
      )}
    </header>
  );
};

export default SmartHeader;
