'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ROLES_PERMITIDOS = ['admin', 'moderador'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/acceder') return;
    if (!user) {
      router.replace('/admin/acceder');
    }
  }, [user, router, pathname]);

  if (pathname === '/admin/acceder') {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  if (!ROLES_PERMITIDOS.includes(user.rol || '')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-black p-8 text-center bg-white">
          <h1 className="text-2xl font-bold text-black mb-2">Acceso denegado</h1>
          <p className="text-gray-700 mb-6">
            No tienes permisos para acceder a este panel.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-black text-white hover:bg-orange-500 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
