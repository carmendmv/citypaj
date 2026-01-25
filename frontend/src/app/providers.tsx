'use client';

import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { AuthProvider } from '@/context/AuthContext';
import { ComunidadProvider } from '@/hooks/useComunidad';

const LANG_STORAGE_KEY = 'citypaj_lang';

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored && stored !== i18n.language) {
        void i18n.changeLanguage(stored);
      }
    } catch {
    }

    const update = (lng: string) => {
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    };

    update(i18n.language);

    const handler = (lng: string) => {
      update(lng);
      try {
        localStorage.setItem(LANG_STORAGE_KEY, lng);
      } catch {
      }
    };
    i18n.on('languageChanged', handler);

    return () => {
      i18n.off('languageChanged', handler);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <ComunidadProvider>{children}</ComunidadProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}
