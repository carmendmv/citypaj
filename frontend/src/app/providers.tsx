'use client';

import { ReactNode, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ComunidadProvider } from '@/hooks/useComunidad';
import { HeaderVisibilityProvider } from '@/context/HeaderVisibilityContext';
import { CustomTranslationProvider } from '@/contexts/CustomTranslationContext';
import Header from '@/components/layout/Header';

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Actualizar idioma del documento
    document.documentElement.lang = 'es';
    document.documentElement.dir = 'ltr';
  }, []);

  return (
    <AuthProvider>
      <CustomTranslationProvider>
        <ComunidadProvider>
          <HeaderVisibilityProvider>
            <Header />
            {children}
          </HeaderVisibilityProvider>
        </ComunidadProvider>
      </CustomTranslationProvider>
    </AuthProvider>
  );
}
