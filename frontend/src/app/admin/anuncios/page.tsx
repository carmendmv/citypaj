'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, CheckCircle, XCircle, AlertTriangle, MessageSquare, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface AnuncioModeracion {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  comunidad_autonoma: string;
  provincia: string;
  estado_moderacion: string;
  motivo_rechazo: string | null;
  visible: number;
  creado_at: string;
  usuario_nombre: string | null;
  usuario_email: string | null;
  reportes: number;
}

interface Reporte {
  id: string;
  motivo: string;
  descripcion: string | null;
  estado: string;
  creado: string;
}

export default function AdminAnunciosPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const [anuncios, setAnuncios] = useState<AnuncioModeracion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notas, setNotas] = useState<Record<string, string>>({});
  const [estados, setEstados] = useState<Record<string, string>>({});
  const [reportesModal, setReportesModal] = useState<{ id: string; reportes: Reporte[] } | null>(null);

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/anuncios/moderacion', {
        headers: { Authorization: `Bearer ${accessToken || ''}` },
      });
      const data = await res.json();
      if (data.success) {
        setAnuncios(data.data || []);
      } else {
        setError(data.error || 'Error cargando anuncios');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    cargar();
  }, [user, accessToken]);

  useEffect(() => {
    if (anuncios.length === 0) return;
    const n: Record<string, string> = {};
    const e: Record<string, string> = {};
    anuncios.forEach((a) => {
      n[a.id] = a.motivo_rechazo || '';
      e[a.id] = a.estado_moderacion;
    });
    setNotas(n);
    setEstados(e);
  }, [anuncios]);

  const esModerador = user && (user.rol === 'admin' || user.rol === 'moderador');

  if (!esModerador) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
          <div className="max-w-md w-full border border-black p-8 text-center">
            <Shield className="w-10 h-10 mx-auto text-orange-500 mb-4" />
            <h2 className="font-serif text-2xl font-bold text-black mb-2">Acceso restringido</h2>
            <p className="font-sans text-sm text-gray-700 mb-6">
              Esta área es solo para moderadores. Inicia sesión en el portal exclusivo de moderación.
            </p>
            <Link
              href="/moderador/login"
              className="inline-flex items-center justify-center bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:text-black transition-colors"
            >
              Ir al login de moderadores
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const moderar = async (id: string, estadoForzado?: string) => {
    const estado = estadoForzado || estados[id] || anuncios.find((a) => a.id === id)?.estado_moderacion;
    if (!estado || !['approved', 'rejected', 'pending', 'flagged'].includes(estado)) {
      setError('Estado no válido');
      return;
    }
    try {
      const res = await fetch(`/api/anuncios/${id}/moderar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken || ''}`,
        },
        body: JSON.stringify({ estado, notas: notas[id] || '' }),
      });
      const data = await res.json();
      if (data.success) {
        await cargar();
      } else {
        setError(data.error || 'Error al moderar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const verReportes = async (id: string) => {
    try {
      const res = await fetch(`/api/anuncios/${id}/reportes`, {
        headers: { Authorization: `Bearer ${accessToken || ''}` },
      });
      const data = await res.json();
      if (data.success) {
        setReportesModal({ id, reportes: data.data || [] });
      }
    } catch (err) {
      setError('Error cargando reportes');
    }
  };

  const formatearFecha = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-ES');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-7 h-7" />
              Moderación de anuncios
            </h1>
            <p className="text-gray-600 mt-1">Revisa anuncios reportados y pendientes de publicación.</p>
          </div>
          <Link
            href="/admin/sugerencias"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Volver a sugerencias
          </Link>
        </div>

        {error ? <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div> : null}

        {loading ? (
          <div className="text-center py-12 text-gray-600">Cargando...</div>
        ) : anuncios.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-600">No hay anuncios pendientes ni reportados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anuncios.map((a) => (
              <div key={a.id} className="border border-black p-4 bg-white">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-serif text-lg font-bold text-black">{a.titulo}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        a.estado_moderacion === 'approved' ? 'bg-green-100 text-green-800' :
                        a.estado_moderacion === 'rejected' ? 'bg-red-100 text-red-800' :
                        a.estado_moderacion === 'flagged' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {a.estado_moderacion === 'flagged' ? 'En revisión' : a.estado_moderacion}
                      </span>
                      {a.reportes > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          {a.reportes}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-gray-700 break-words mb-3">{a.descripcion}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                      <span className="font-medium">{a.categoria}</span>
                      <span>{a.comunidad_autonoma}{a.provincia ? ` / ${a.provincia}` : ''}</span>
                      <span>{formatearFecha(a.creado_at)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      <span className="font-medium">{a.usuario_nombre || 'Anónimo'}</span>
                      {a.usuario_email ? <span> · {a.usuario_email}</span> : null}
                    </div>
                    {a.motivo_rechazo ? (
                      <p className="text-xs text-gray-500 italic">Notas previas: {a.motivo_rechazo}</p>
                    ) : null}
                  </div>

                  <div className="lg:w-72 flex flex-col gap-2">
                    <label className="text-xs font-medium text-gray-600">Estado</label>
                    <select
                      value={estados[a.id] || a.estado_moderacion}
                      onChange={(e) => setEstados({ ...estados, [a.id]: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="flagged">En revisión</option>
                      <option value="approved">Aprobado</option>
                      <option value="rejected">Rechazado</option>
                    </select>

                    <label className="text-xs font-medium text-gray-600">Notas</label>
                    <textarea
                      value={notas[a.id] || ''}
                      onChange={(e) => setNotas({ ...notas, [a.id]: e.target.value })}
                      rows={2}
                      placeholder="Notas internas o motivo"
                      className="w-full px-2 py-1.5 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none resize-y"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => moderar(a.id, 'approved')}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-black text-white border border-black hover:bg-orange-500 hover:text-black transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" /> Aprobar
                      </button>
                      <button
                        onClick={() => moderar(a.id, 'rejected')}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-white text-black border border-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                      >
                        <XCircle className="w-3 h-3" /> Rechazar
                      </button>
                      <button
                        onClick={() => moderar(a.id)}
                        className="col-span-2 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-white text-black border border-black hover:bg-gray-100 transition-colors"
                      >
                        Guardar estado
                      </button>
                    </div>

                    <div className="flex gap-2">
                      {a.reportes > 0 ? (
                        <button
                          onClick={() => verReportes(a.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                        >
                          <MessageSquare className="w-3 h-3" /> Reportes
                        </button>
                      ) : null}
                      <Link
                        href={`/anuncios/${a.id}`}
                        target="_blank"
                        className={`inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200 ${a.reportes > 0 ? 'flex-1' : 'w-full'}`}
                      >
                        <Eye className="w-3 h-3" /> Ver
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {reportesModal ? (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-black max-w-lg w-full p-6 max-h-[80vh] overflow-auto">
              <h3 className="font-serif text-xl font-bold text-black mb-4">Reportes del anuncio</h3>
              {reportesModal.reportes.length === 0 ? (
                <p className="text-sm text-gray-600">No hay reportes.</p>
              ) : (
                <div className="space-y-3">
                  {reportesModal.reportes.map((r) => (
                    <div key={r.id} className="border border-gray-200 p-3 rounded">
                      <div className="text-sm font-medium text-gray-900">{r.motivo}</div>
                      {r.descripcion ? <p className="text-xs text-gray-600 mt-1">{r.descripcion}</p> : null}
                      <div className="text-xs text-gray-400 mt-1">{r.estado} · {formatearFecha(r.creado)}</div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setReportesModal(null)}
                className="mt-6 w-full px-4 py-2 bg-black text-white text-sm hover:bg-orange-500 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
