'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminSeccionPlaceholderPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const ruta = Array.isArray(params?.seccion) ? params.seccion.join('/') : '';

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/admin/acceder');
    } else if (user.rol !== 'admin' && user.rol !== 'moderador') {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return null;

  const rol = user.rol;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={rol === 'admin'} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-black p-8 text-center">
            <ClipboardList className="w-12 h-12 mx-auto text-orange-500 mb-4" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black mb-2">
              Sección en desarrollo
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              La sección <span className="font-mono text-black">/{ruta}</span> aún no está implementada.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Próximamente se habilitará su funcionalidad completa. Mientras tanto puedes volver al dashboard o seguir gestionando anuncios y usuarios.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm border border-black hover:bg-orange-500 hover:text-black"
              >
                Volver al dashboard
              </Link>
              <Link
                href="/admin/anuncios"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm border border-black hover:bg-gray-100"
              >
                Gestionar anuncios
              </Link>
            </div>
          </div>

          <div className="mt-6 border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>
              Si necesitas esta sección con urgencia, indícalo y se priorizará su implementación.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
