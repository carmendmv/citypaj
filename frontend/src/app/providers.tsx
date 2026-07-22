'use client';

import { ReactNode, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ComunidadProvider } from '@/hooks/useComunidad';
import '@/i18n';

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Actualizar idioma del documento
    document.documentElement.lang = 'es';
    document.documentElement.dir = 'ltr';
  }, []);

  return (
    <AuthProvider>
      <ComunidadProvider>
        {children}
      </ComunidadProvider>
    </AuthProvider>
  );
}
