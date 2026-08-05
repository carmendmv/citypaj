'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface RouteProtectionProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function RouteProtection({ 
  children, 
  requireAuth = true, 
  redirectTo = '/acceder' 
}: RouteProtectionProps) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Si la ruta requiere autenticación y el usuario no está logueado
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // Si el usuario está logueado y trata de acceder a la página de login
    if (!requireAuth && user && redirectTo === '/acceder') {
      router.push('/perfil');
      return;
    }
  }, [user, requireAuth, redirectTo, router]);

  // Si la ruta requiere autenticación y el usuario no está logueado, no renderizar nada
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Si el usuario está logueado y trata de acceder a login, no renderizar nada
  if (!requireAuth && user && redirectTo === '/acceder') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
