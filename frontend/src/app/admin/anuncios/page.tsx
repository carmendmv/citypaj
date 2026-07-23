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
  const [accionId, setAccionId] = useState<string | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
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

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-md mx-auto border border-black p-6">
            <h2 className="font-serif text-xl font-bold text-black mb-4">Acceso de moderador</h2>
            <p className="font-sans text-sm text-gray-700 mb-4">
              Usa el usuario demo para acceder:
            </p>
            <div className="space-y-2 font-sans text-sm text-black mb-6 border border-gray-200 p-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">demo@citypaj.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contraseña:</span>
                <span className="font-medium">Demo1234!</span>
              </div>
            </div>
            <Link
              href="/acceder"
              className="block w-full text-center bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
            >
              Ir a acceder
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const moderar = async (id: string, accion: 'aprobar' | 'rechazar') => {
    try {
      const res = await fetch(`/api/anuncios/${id}/moderar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken || ''}`,
        },
        body: JSON.stringify({ accion, motivo_rechazo: accion === 'rechazar' ? motivoRechazo : undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setAccionId(null);
        setMotivoRechazo('');
        await cargar();
      } else {
        setError(data.error || 'Error al moderar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const moderarIA = async (id: string) => {
    try {
      const res = await fetch(`/api/anuncios/${id}/moderar-ia`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken || ''}` },
      });
      const data = await res.json();
      if (data.success) {
        await cargar();
      } else {
        setError(data.error || 'Error al revisar con IA');
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
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anuncio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reportes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {anuncios.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{a.titulo}</div>
                      <div className="text-xs text-gray-500 line-clamp-2 max-w-xs">{a.descripcion}</div>
                      <div className="text-xs text-gray-400 mt-1">{a.categoria} · {a.comunidad_autonoma} · {formatearFecha(a.creado_at)}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {a.usuario_nombre || 'Anónimo'}<br />
                      <span className="text-xs text-gray-400">{a.usuario_email}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        a.estado_moderacion === 'approved' ? 'bg-green-100 text-green-800' :
                        a.estado_moderacion === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {a.estado_moderacion}
                      </span>
                      {a.motivo_rechazo ? <p className="text-xs text-red-600 mt-1 max-w-xs">{a.motivo_rechazo}</p> : null}
                    </td>
                    <td className="px-4 py-4">
                      {a.reportes > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          {a.reportes}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => moderar(a.id, 'aprobar')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 rounded hover:bg-green-200"
                        >
                          <CheckCircle className="w-3 h-3" /> Aprobar
                        </button>
                        <button
                          onClick={() => setAccionId(a.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-100 text-red-800 rounded hover:bg-red-200"
                        >
                          <XCircle className="w-3 h-3" /> Rechazar
                        </button>
                        <button
                          onClick={() => moderarIA(a.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                        >
                          <Shield className="w-3 h-3" /> Revisar IA
                        </button>
                        {a.reportes > 0 ? (
                          <button
                            onClick={() => verReportes(a.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                          >
                            <MessageSquare className="w-3 h-3" /> Ver reportes
                          </button>
                        ) : null}
                        <Link
                          href={`/anuncios/${a.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                        >
                          <Eye className="w-3 h-3" /> Ver
                        </Link>
                      </div>

                      {accionId === a.id ? (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Motivo del rechazo</label>
                          <input
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded mb-2"
                            placeholder="Opcional"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => moderar(a.id, 'rechazar')}
                              className="px-3 py-1.5 text-xs bg-red-600 text-white rounded"
                            >
                              Confirmar rechazo
                            </button>
                            <button
                              onClick={() => { setAccionId(null); setMotivoRechazo(''); }}
                              className="px-3 py-1.5 text-xs border border-gray-300 rounded"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
