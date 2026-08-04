'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TEMAS_COMUNIDAD } from '@/lib/comunidad';

interface PublicacionAdmin {
  id: number;
  titulo: string;
  contenido: string;
  provincia: string;
  tema: string;
  usuario_nombre?: string;
  visible: number;
  estado_moderacion: string;
  creado_at: string;
  respuestas_count: number;
  likes_count: number;
  reportes_pendientes: number;
  reportes_total: number;
  ip?: string;
  usuario_ultima_ip?: string;
}

interface ReporteAdmin {
  id: number;
  tipo: string;
  objeto_id: number;
  motivo: string;
  descripcion: string;
  estado: string;
  creado: string;
  usuario_nombre?: string;
  contenido_objeto: string;
}

export default function AdminComunidadPage() {
  const { accessToken } = useAuth();
  const [publicaciones, setPublicaciones] = useState<PublicacionAdmin[]>([]);
  const [reportes, setReportes] = useState<ReporteAdmin[]>([]);
  const [tab, setTab] = useState<'publicaciones' | 'reportes'>('publicaciones');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ provincia: '', tema: '', estado: '', reportados: false });

  useEffect(() => {
    if (tab === 'publicaciones') cargarPublicaciones();
    else cargarReportes();
  }, [tab, filters]);

  const cargarPublicaciones = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.provincia) params.set('provincia', filters.provincia);
      if (filters.tema) params.set('tema', filters.tema);
      if (filters.estado) params.set('estado_moderacion', filters.estado);
      if (filters.reportados) params.set('reportados', 'true');

      const res = await fetch(`/api/admin/comunidad?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${accessToken || ''}` }
      });
      const data = await res.json();
      if (data.success) setPublicaciones(data.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const cargarReportes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/comunidad/reportes', {
        headers: { 'Authorization': `Bearer ${accessToken || ''}` }
      });
      const data = await res.json();
      if (data.success) setReportes(data.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const actualizarPublicacion = async (id: number, visible: boolean, estado: string) => {
    try {
      const res = await fetch(`/api/admin/comunidad/publicaciones/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || ''}`
        },
        body: JSON.stringify({ visible, estado_moderacion: estado })
      });
      if (res.ok) await cargarPublicaciones();
    } catch {}
  };

  const revisarReporte = async (id: number, estado: string, nota: string) => {
    try {
      const res = await fetch(`/api/admin/comunidad/reportes/${id}/revisar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || ''}`
        },
        body: JSON.stringify({ estado, nota_moderacion: nota })
      });
      if (res.ok) await cargarReportes();
    } catch {}
  };

  return (<>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Moderación de Comunidad</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('publicaciones')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${tab === 'publicaciones' ? 'bg-black text-white' : 'bg-white text-gray-700'}`}
          >
            Publicaciones
          </button>
          <button
            onClick={() => setTab('reportes')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${tab === 'reportes' ? 'bg-black text-white' : 'bg-white text-gray-700'}`}
          >
            Reportes
          </button>
        </div>

        {tab === 'publicaciones' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                placeholder="Provincia"
                value={filters.provincia}
                onChange={(e) => setFilters({ ...filters, provincia: e.target.value })}
                className="px-3 py-2 border rounded-xl"
              />
              <select
                value={filters.tema}
                onChange={(e) => setFilters({ ...filters, tema: e.target.value })}
                className="px-3 py-2 border rounded-xl"
              >
                <option value="">Todos los temas</option>
                {TEMAS_COMUNIDAD.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={filters.estado}
                onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                className="px-3 py-2 border rounded-xl"
              >
                <option value="">Todos los estados</option>
                <option value="approved">Aprobadas</option>
                <option value="pending">Pendientes</option>
                <option value="rejected">Rechazadas</option>
                <option value="flagged">Marcadas</option>
              </select>
            </div>
            <label className="flex items-center gap-2 mb-4 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={filters.reportados}
                onChange={(e) => setFilters({ ...filters, reportados: e.target.checked })}
              />
              Solo con reportes pendientes
            </label>

            {loading ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {publicaciones.map((p) => (
                  <div key={p.id} className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{p.titulo}</p>
                        <p className="text-xs text-gray-500 mb-1">{p.provincia} · {p.tema} · {p.usuario_nombre || 'Anónimo'}</p>
                        {(p.ip || p.usuario_ultima_ip) && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {p.ip ? `IP publicación: ${p.ip}` : ''}
                            {p.ip && p.usuario_ultima_ip ? ' · ' : ''}
                            {p.usuario_ultima_ip ? `IP usuario: ${p.usuario_ultima_ip}` : ''}
                          </p>
                        )}
                        <p className="text-sm text-gray-700 line-clamp-2">{p.contenido}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {p.respuestas_count} respuestas · {p.likes_count} likes · {p.reportes_pendientes} reportes pendientes
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          onClick={() => actualizarPublicacion(p.id, !p.visible, p.estado_moderacion)}
                          className={`px-3 py-1.5 text-xs rounded-full font-medium ${p.visible ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}
                        >
                          {p.visible ? 'Ocultar' : 'Restaurar'}
                        </button>
                        <select
                          value={p.estado_moderacion}
                          onChange={(e) => actualizarPublicacion(p.id, !!p.visible, e.target.value)}
                          className="px-3 py-1.5 text-xs border rounded-full"
                        >
                          <option value="approved">Aprobada</option>
                          <option value="pending">Pendiente</option>
                          <option value="rejected">Rechazada</option>
                          <option value="flagged">Marcada</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                {publicaciones.length === 0 && <p className="text-sm text-gray-500">No hay publicaciones.</p>}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            {loading ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {reportes.map((r) => (
                  <div key={r.id} className="py-4">
                    <p className="text-sm font-semibold text-gray-900">{r.tipo} #{r.objeto_id}</p>
                    <p className="text-xs text-gray-500">{r.usuario_nombre || 'Anónimo'} · {r.motivo}</p>
                    <p className="text-sm text-gray-700 mt-1">{r.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-1">{r.contenido_objeto}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => revisarReporte(r.id, 'revisado', '')}
                        className="px-3 py-1.5 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        Revisar
                      </button>
                      <button
                        onClick={() => revisarReporte(r.id, 'descartado', '')}
                        className="px-3 py-1.5 text-xs bg-gray-100 text-gray-800 rounded-full"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                ))}
                {reportes.length === 0 && <p className="text-sm text-gray-500">No hay reportes.</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </>);
}
