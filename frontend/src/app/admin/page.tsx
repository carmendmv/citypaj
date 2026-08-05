'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  Activity,
  Server,
  Database,
  Globe,
  ArrowRight,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';
import DashboardAcciones from '@/components/admin/DashboardAcciones';

interface ResumenData {
  usuarios: number;
  anuncios: number;
  anuncios_activos: number;
  anuncios_pendientes: number;
  anuncios_rechazados: number;
  anuncios_ocultos: number;
  sugerencias: number;
  publicaciones_comunidad: number;
  reportes_pendientes: number;
  reportes_total: number;
  usuarios_verificados: number;
  staff: number;
  db_conectada: boolean;
  backend_status: string;
  version: string;
  ultima_actualizacion: string;
}

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}

interface DbData {
  connected: boolean;
  database: string;
  timestamp: string;
}

const frontendLinks = [
  { href: '/', label: 'Home' },
  { href: '/anuncios', label: 'Anuncios' },
  { href: '/comunidad', label: 'Comunidad' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/propuestas', label: 'Propuestas' },
  { href: '/buzon-sugerencias', label: 'Sugerencias' },
  { href: '/instituciones', label: 'Instituciones' },
  { href: '/ayudas', label: 'Recursos / Ayudas' },
  { href: '/acceder', label: 'Login / Registro' },
];

const backendModules = [
  'Autenticación',
  'Usuarios',
  'Anuncios',
  'Comunidad',
  'Sugerencias',
  'Reportes',
  'Moderación',
  'Recursos',
  'Eventos',
  'Propuestas',
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, accessToken, logout } = useAuth();
  const [resumen, setResumen] = useState<ResumenData | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [db, setDb] = useState<DbData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.rol === 'admin';
  const isModerador = user?.rol === 'admin' || user?.rol === 'moderador';

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resResumen, resHealth, resDb] = await Promise.allSettled([
        fetch('/api/admin/resumen', { headers }),
        fetch('/api/health'),
        fetch('/api/test-db'),
      ]);

      if (resResumen.status === 'fulfilled' && resResumen.value.ok) {
        const json = await resResumen.value.json();
        if (json.success) setResumen(json.data);
      } else if (resResumen.status === 'fulfilled') {
        const err = await resResumen.value.json().catch(() => ({}));
        setError(err.error || 'Error cargando resumen');
      }

      if (resHealth.status === 'fulfilled' && resHealth.value.ok) {
        setHealth(await resHealth.value.json());
      }

      if (resDb.status === 'fulfilled' && resDb.value.ok) {
        const dbJson = await resDb.value.json();
        setDb(dbJson);
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace('/admin/acceder');
      return;
    }
    if (!isModerador) {
      return;
    }
    fetchData();
  }, [user, router, isModerador, accessToken]);

  if (!user) return null;

  if (!isModerador) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-black p-8 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h1 className="font-serif text-2xl font-bold text-black mb-2">Acceso denegado</h1>
          <p className="text-sm text-gray-700 mb-6">No tienes permisos para acceder al panel de administración.</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-black text-white border border-black px-6 py-3 text-sm hover:bg-orange-500 hover:text-black transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const StatCard = ({
    label,
    value,
    icon: Icon,
    color = 'text-black',
  }: {
    label: string;
    value: number | string;
    icon: React.ElementType;
    color?: string;
  }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-3xl font-bold text-black">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black flex items-center gap-2">
                <LayoutDashboard className="w-7 h-7" />
                Panel de administración
              </h1>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                Bienvenido, <span className="font-medium text-black">{user.nombre || user.email}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  user.rol === 'admin'
                    ? 'bg-orange-100 text-orange-700'
                    : user.rol === 'moderador'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {user.rol}
                </span>
              </p>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-black text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {loading && !resumen ? (
            <div className="p-8 text-center text-gray-600 border border-gray-200 bg-white rounded-xl">
              Cargando datos reales del panel...
            </div>
          ) : (
            <>
              <section className="mb-8">
                <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Resumen del ecosistema
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Usuarios" value={resumen?.usuarios ?? 0} icon={Users} color="text-blue-500" />
                  <StatCard label="Anuncios" value={resumen?.anuncios ?? 0} icon={FileText} color="text-orange-500" />
                  <StatCard
                    label="Anuncios activos"
                    value={resumen?.anuncios_activos ?? 0}
                    icon={FileText}
                    color="text-green-500"
                  />
                  <StatCard
                    label="Anuncios pendientes"
                    value={resumen?.anuncios_pendientes ?? 0}
                    icon={FileText}
                    color="text-yellow-500"
                  />
                  <StatCard label="Sugerencias" value={resumen?.sugerencias ?? 0} icon={Lightbulb} color="text-purple-500" />
                  <StatCard
                    label="Publicaciones comunidad"
                    value={resumen?.publicaciones_comunidad ?? 0}
                    icon={MessageSquare}
                    color="text-pink-500"
                  />
                  <StatCard
                    label="Reportes pendientes"
                    value={resumen?.reportes_pendientes ?? 0}
                    icon={AlertTriangle}
                    color="text-red-500"
                  />
                  <StatCard
                    label="Reportes totales"
                    value={resumen?.reportes_total ?? 0}
                    icon={AlertTriangle}
                    color="text-red-400"
                  />
                  <StatCard
                    label="Anuncios rechazados"
                    value={resumen?.anuncios_rechazados ?? 0}
                    icon={FileText}
                    color="text-red-600"
                  />
                  <StatCard
                    label="Anuncios ocultos"
                    value={resumen?.anuncios_ocultos ?? 0}
                    icon={FileText}
                    color="text-gray-500"
                  />
                  <StatCard
                    label="Usuarios verificados"
                    value={resumen?.usuarios_verificados ?? 0}
                    icon={Users}
                    color="text-green-500"
                  />
                  <StatCard label="Admin/Moderadores" value={resumen?.staff ?? 0} icon={Shield} color="text-gray-700" />
                </div>
              </section>

              <DashboardAcciones />

              <section className="mb-8">
                <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Estado del sistema
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <h3 className="font-medium text-black">Backend</h3>
                    </div>
                    <p className="text-sm text-gray-600">Estado: {health?.status || 'ok'}</p>
                    <p className="text-sm text-gray-600">Entorno: {health?.environment || '—'}</p>
                    <p className="text-sm text-gray-600">Uptime: {Math.floor(health?.uptime || 0)} s</p>
                    <p className="text-sm text-gray-600">Versión: {health?.version || resumen?.version || '—'}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${db?.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                      <h3 className="font-medium text-black">Base de datos</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Conexión: {db?.connected ? 'Conectada' : 'Error'}
                    </p>
                    <p className="text-sm text-gray-600">Base: {db?.database || '—'}</p>
                    <p className="text-sm text-gray-600">
                      Última actualización: {resumen?.ultima_actualizacion
                        ? new Date(resumen.ultima_actualizacion).toLocaleString('es-ES')
                        : '—'}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-4 h-4 text-orange-500" />
                      <h3 className="font-medium text-black">Frontend</h3>
                    </div>
                    <p className="text-sm text-gray-600">Estado: Operativo</p>
                    <p className="text-sm text-gray-600 truncate">Origen: {typeof window !== 'undefined' ? window.location.origin : '—'}</p>
                    <p className="text-sm text-gray-600">Puerto: 3001</p>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <section>
                  <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Secciones del frontend
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {frontendLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {link.label}
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Módulos del backend
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {backendModules.map((mod) => (
                        <li
                          key={mod}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700"
                        >
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          {mod}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>

              <section className="mb-8">
                <h2 className="text-lg font-bold text-black mb-4">Herramientas de moderación</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link
                    href="/admin/anuncios"
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-500 transition-colors"
                  >
                    <FileText className="w-6 h-6 text-orange-500 mb-3" />
                    <h3 className="font-medium text-black">Gestión de anuncios</h3>
                    <p className="text-sm text-gray-600 mt-1">Revisar, aprobar y moderar anuncios.</p>
                  </Link>
                  <Link
                    href="/admin/comunidad"
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-500 transition-colors"
                  >
                    <MessageSquare className="w-6 h-6 text-blue-500 mb-3" />
                    <h3 className="font-medium text-black">Comunidad</h3>
                    <p className="text-sm text-gray-600 mt-1">Publicaciones, respuestas y reportes.</p>
                  </Link>
                  <Link
                    href="/admin/sugerencias"
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-500 transition-colors"
                  >
                    <Lightbulb className="w-6 h-6 text-purple-500 mb-3" />
                    <h3 className="font-medium text-black">Sugerencias</h3>
                    <p className="text-sm text-gray-600 mt-1">Ver el buzón de propuestas juveniles.</p>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin/usuarios"
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-500 transition-colors"
                    >
                      <Users className="w-6 h-6 text-green-500 mb-3" />
                      <h3 className="font-medium text-black">Usuarios</h3>
                      <p className="text-sm text-gray-600 mt-1">Listar usuarios y gestionar roles.</p>
                    </Link>
                  )}
                </div>
              </section>

              <div className="text-right">
                <button
                  onClick={() => logout().then(() => router.push('/'))}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-black hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
