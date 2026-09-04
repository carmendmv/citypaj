'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, AlertTriangle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

interface LogEntry {
  id: string;
  usuario_id: string;
  accion: string;
  entidad: string;
  entidad_id: string;
  detalles: string;
  creado_at: string;
  nombre: string | null;
  email: string | null;
  rol: string | null;
}

export default function AdminHistorialPage() {
  const router = useRouter();
  const { user, accessToken, isLoading } = useAuth();

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [total, setTotal] = useState(0);
  const [entidad, setEntidad] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.rol === 'admin';
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchLogs = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(p));
      params.set('limit', String(limit));
      if (entidad.trim()) params.set('entidad', entidad.trim());

      const res = await fetch(`/api/admin/logs?${params.toString()}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || 'Error cargando logs');
        setLogs([]);
        return;
      }
      setLogs(json.data || []);
      setTotal(json.meta?.total || 0);
      setPage(p);
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/acceder');
      return;
    }
    if (!isAdmin) return;
    fetchLogs(1);
  }, [isLoading, user, isAdmin, accessToken, router, entidad]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full border border-black p-8 text-center">
          <AlertTriangle className="w-10 h-10 mx-auto text-red-500 mb-4" />
          <h1 className="font-serif text-2xl font-bold text-black mb-2">Acceso denegado</h1>
          <p className="font-sans text-sm text-gray-700 mb-6">Esta sección es solo para administradores.</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:text-black transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={true} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black flex items-center gap-2">
                <Activity className="w-7 h-7" />
                Historial de actividad
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Registro de acciones realizadas por administradores y moderadores.
              </p>
            </div>
            <button
              onClick={() => fetchLogs(page)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-black text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>

          {error && (
            <div className="mb-4 border border-red-500 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="bg-white border border-black p-4 mb-4 flex flex-col sm:flex-row gap-3">
            <input
              value={entidad}
              onChange={(e) => setEntidad(e.target.value)}
              placeholder="Filtrar por entidad: anuncios, usuarios, comunidad..."
              className="flex-1 px-3 py-2 text-sm border border-black bg-white"
            />
            <button
              onClick={() => fetchLogs(1)}
              className="px-4 py-2 bg-black text-white text-sm border border-black hover:bg-orange-500 hover:text-black"
            >
              Buscar
            </button>
          </div>

          {loading ? (
            <div className="border border-black bg-white p-8 text-center text-gray-600">Cargando logs...</div>
          ) : logs.length === 0 ? (
            <div className="border border-black bg-white p-8 text-center text-gray-600">No hay logs registrados.</div>
          ) : (
            <div className="bg-white border border-black overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-black text-white text-left">
                  <tr>
                    <th className="px-4 py-3 font-sans font-medium">Fecha</th>
                    <th className="px-4 py-3 font-sans font-medium">Usuario</th>
                    <th className="px-4 py-3 font-sans font-medium">Acción</th>
                    <th className="px-4 py-3 font-sans font-medium">Entidad</th>
                    <th className="px-4 py-3 font-sans font-medium">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {new Date(l.creado_at).toLocaleString('es-ES')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-black">{l.nombre || '—'}</div>
                        <div className="text-xs text-gray-500">{l.email || l.usuario_id}</div>
                        <div className="text-xs text-gray-400">{l.rol}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{l.accion}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {l.entidad}
                        <div className="text-xs text-gray-400">{l.entidad_id}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-md truncate" title={l.detalles}>
                        {l.detalles}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 bg-white border border-black p-3">
              <button
                onClick={() => fetchLogs(page - 1)}
                disabled={page <= 1 || loading}
                className="inline-flex items-center gap-1 px-3 py-1 border border-black text-sm hover:bg-black hover:text-white disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {page} de {totalPages} ({total} resultados)
              </span>
              <button
                onClick={() => fetchLogs(page + 1)}
                disabled={page >= totalPages || loading}
                className="inline-flex items-center gap-1 px-3 py-1 border border-black text-sm hover:bg-black hover:text-white disabled:opacity-50"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
