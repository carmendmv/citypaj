'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, MessageSquare, FileText, Users, LogOut, AlertTriangle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

const ROL_MODERADOR = ['admin', 'moderador'];

interface PanelStats {
  anunciosPendientes: number;
  anunciosReportados: number;
  sugerencias: number;
  publicacionesComunidad: number;
  reportes: number;
}

export default function ModeradorPanelPage() {
  const router = useRouter();
  const { user, accessToken, logout } = useAuth();

  const [stats, setStats] = useState<PanelStats>({
    anunciosPendientes: 0,
    anunciosReportados: 0,
    sugerencias: 0,
    publicacionesComunidad: 0,
    reportes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/moderador/login');
      return;
    }
    if (!ROL_MODERADOR.includes(user.rol || '')) {
      // Usuario sin permisos: no redirigir automáticamente, mostrar mensaje claro
      return;
    }

    const cargar = async () => {
      setLoading(true);
      setError(null);
      const headers: Record<string, string> = {};
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      try {
        const [resAnuncios, resSugerencias, resComunidad, resReportes] = await Promise.allSettled([
          fetch('/api/anuncios/moderacion', { headers }),
          fetch('/api/sugerencias', { headers }),
          fetch('/api/comunidad?limit=1'),
          fetch('/api/reportes', { headers }),
        ]);

        const nuevoEstado: Partial<PanelStats> = {};

        if (resAnuncios.status === 'fulfilled' && resAnuncios.value.ok) {
          const anunciosJson = await resAnuncios.value.json();
          const anuncios = Array.isArray(anunciosJson?.data) ? anunciosJson.data : [];
          nuevoEstado.anunciosPendientes = anuncios.filter((a: any) => a.estado_moderacion === 'pending' || a.estado_moderacion === 'flagged').length;
          nuevoEstado.anunciosReportados = anuncios.filter((a: any) => (a.reportes || 0) > 0).length;
        } else {
          nuevoEstado.anunciosPendientes = 0;
          nuevoEstado.anunciosReportados = 0;
        }

        if (resSugerencias.status === 'fulfilled' && resSugerencias.value.ok) {
          const sugerenciasJson = await resSugerencias.value.json();
          const sugerencias = Array.isArray(sugerenciasJson?.data) ? sugerenciasJson.data : [];
          nuevoEstado.sugerencias = sugerencias.length;
        } else {
          nuevoEstado.sugerencias = 0;
        }

        if (resComunidad.status === 'fulfilled' && resComunidad.value.ok) {
          const comunidadJson = await resComunidad.value.json();
          const publicaciones = Array.isArray(comunidadJson?.data) ? comunidadJson.data : [];
          nuevoEstado.publicacionesComunidad = publicaciones.length;
        } else {
          nuevoEstado.publicacionesComunidad = 0;
        }

        if (resReportes.status === 'fulfilled' && resReportes.value.ok) {
          const reportesJson = await resReportes.value.json();
          const reportes = Array.isArray(reportesJson?.data) ? reportesJson.data : [];
          nuevoEstado.reportes = reportes.length;
        } else {
          nuevoEstado.reportes = 0;
        }

        setStats((prev) => ({ ...prev, ...nuevoEstado }));
      } catch (err) {
        setError('Error cargando el panel');
      } finally {
        setLoading(false);
      }
    };

    void cargar();
  }, [user, accessToken, router]);

  const handleLogout = () => {
    logout().then(() => router.push('/'));
  };

  if (!user) {
    return null;
  }

  if (!ROL_MODERADOR.includes(user.rol || '')) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-16">
          <div className="border border-black p-8 text-center">
            <AlertTriangle className="w-10 h-10 mx-auto text-red-500 mb-4" />
            <h1 className="font-serif text-2xl font-bold text-black mb-2">Acceso denegado</h1>
            <p className="font-sans text-sm text-gray-700 mb-6">
              No tienes permisos para acceder al panel de moderación.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
              >
                Volver al inicio
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center border border-black px-6 py-3 font-sans text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="border-b border-black pb-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-black flex items-center gap-2">
                <Shield className="w-8 h-8" />
                Panel de moderación
              </h1>
              <p className="font-sans text-sm text-gray-600 mt-1">
                Bienvenido, <span className="font-medium text-black">{user.nombre || user.email}</span> — rol: {user.rol}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center border border-black px-4 py-2 font-sans text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 border border-red-500 p-4 text-red-700 text-sm font-sans">
            {error}
          </div>
        )}

        {loading ? (
          <div className="border border-black p-6 font-sans text-sm">Cargando panel...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/anuncios"
              className="border border-black p-5 hover:bg-black hover:text-white transition-colors group"
            >
              <FileText className="w-6 h-6 mb-3 text-orange-500 group-hover:text-orange-400" />
              <div className="font-serif text-lg font-bold">Anuncios pendientes</div>
              <div className="font-sans text-sm opacity-70 mt-1">
                {stats.anunciosPendientes} anuncio{stats.anunciosPendientes !== 1 ? 's' : ''} pendiente{stats.anunciosPendientes !== 1 ? 's' : ''}
              </div>
            </Link>

            <Link
              href="/admin/anuncios"
              className="border border-black p-5 hover:bg-black hover:text-white transition-colors group"
            >
              <AlertTriangle className="w-6 h-6 mb-3 text-red-500 group-hover:text-red-400" />
              <div className="font-serif text-lg font-bold">Anuncios reportados</div>
              <div className="font-sans text-sm opacity-70 mt-1">
                {stats.anunciosReportados} reporte{stats.anunciosReportados !== 1 ? 's' : ''}
              </div>
            </Link>

            <Link
              href="/admin/sugerencias"
              className="border border-black p-5 hover:bg-black hover:text-white transition-colors group"
            >
              <MessageSquare className="w-6 h-6 mb-3 text-blue-500 group-hover:text-blue-400" />
              <div className="font-serif text-lg font-bold">Sugerencias</div>
              <div className="font-sans text-sm opacity-70 mt-1">
                {stats.sugerencias} sugerencia{stats.sugerencias !== 1 ? 's' : ''}
              </div>
            </Link>

            <Link
              href="/comunidad"
              className="border border-black p-5 hover:bg-black hover:text-white transition-colors group"
            >
              <Users className="w-6 h-6 mb-3 text-green-500 group-hover:text-green-400" />
              <div className="font-serif text-lg font-bold">Comunidad</div>
              <div className="font-sans text-sm opacity-70 mt-1">
                {stats.publicacionesComunidad} publicación{stats.publicacionesComunidad !== 1 ? 'es' : ''}
              </div>
            </Link>

            <Link
              href="/admin/anuncios"
              className="border border-black p-5 hover:bg-black hover:text-white transition-colors group"
            >
              <AlertTriangle className="w-6 h-6 mb-3 text-yellow-500 group-hover:text-yellow-400" />
              <div className="font-serif text-lg font-bold">Reportes</div>
              <div className="font-sans text-sm opacity-70 mt-1">
                {stats.reportes} reporte{stats.reportes !== 1 ? 's' : ''}
              </div>
            </Link>
          </div>
        )}

        <div className="mt-10 border border-black p-6">
          <h2 className="font-serif text-xl font-bold text-black mb-4">Herramientas de moderación</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/anuncios"
              className="inline-flex items-center justify-center bg-black text-white border border-black px-4 py-2 font-sans text-sm hover:bg-orange-500 hover:text-black transition-colors"
            >
              Revisar anuncios
            </Link>
            <Link
              href="/admin/sugerencias"
              className="inline-flex items-center justify-center border border-black px-4 py-2 font-sans text-sm hover:bg-black hover:text-white transition-colors"
            >
              Ver sugerencias
            </Link>
            <Link
              href="/comunidad"
              className="inline-flex items-center justify-center border border-black px-4 py-2 font-sans text-sm hover:bg-black hover:text-white transition-colors"
            >
              Comunidad
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
