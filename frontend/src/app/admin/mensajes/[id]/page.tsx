'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft, Archive, Trash2, Check, Send, Paperclip } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

interface Entidad {
  entidad_tipo: string;
  entidad_id: string;
  titulo?: string;
}

interface Adjunto {
  id: number;
  nombre_original: string;
  tamano: number;
  tipo_mime: string;
}

interface Mensaje {
  id: number;
  asunto: string;
  cuerpo: string;
  remitente_id: string;
  destinatario_id: string | null;
  remitente_nombre?: string;
  remitente_email?: string;
  destinatario_nombre?: string;
  destinatario_email?: string;
  creado_at: string;
  leido: number;
  entidades?: Entidad[];
  adjuntos?: Adjunto[];
}

export default function AdminMensajeDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const id = params.id as string;

  const [mensaje, setMensaje] = useState<Mensaje | null>(null);
  const [respuesta, setRespuesta] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mensajeOk, setMensajeOk] = useState<string | null>(null);

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const isAdmin = user?.rol === 'admin';
  const isStaff = user?.rol === 'admin' || user?.rol === 'moderador';

  const fetchMensaje = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/mensajes/${id}`, { headers });
      const json = await res.json();
      if (json.success) {
        setMensaje(json.data as Mensaje);
        if (json.data.leido === 0) {
          await fetch(`/api/admin/mensajes/${id}/leido`, { method: 'PATCH', headers });
        }
      } else {
        setError(json.error || 'Mensaje no encontrado');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace('/admin/acceder');
      return;
    }
    if (id) fetchMensaje();
  }, [user, id, router]);

  const responder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!respuesta.trim()) return;
    setEnviando(true);
    try {
      const res = await fetch(`/api/admin/mensajes/${id}/responder`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ cuerpo: respuesta.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setRespuesta('');
        setMensajeOk('Respuesta enviada');
        setTimeout(() => setMensajeOk(null), 3000);
        fetchMensaje();
      } else {
        setError(json.error || 'Error enviando respuesta');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setEnviando(false);
    }
  };

  const archivar = async () => {
    try {
      await fetch(`/api/admin/mensajes/${id}/archivar`, { method: 'PATCH', headers });
      setMensajeOk('Mensaje archivado');
      setTimeout(() => router.push('/admin/mensajes'), 1000);
    } catch {
      setError('Error archivando mensaje');
    }
  };

  const eliminar = async () => {
    if (!confirm('¿Eliminar este mensaje?')) return;
    try {
      await fetch(`/api/admin/mensajes/${id}`, { method: 'DELETE', headers });
      router.push('/admin/mensajes');
    } catch {
      setError('Error eliminando mensaje');
    }
  };

  if (!user) return null;

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-black p-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-black mb-2">Acceso denegado</h1>
          <p className="text-sm text-gray-700 mb-6">No tienes permisos para ver este mensaje.</p>
          <button onClick={() => router.push('/admin/mensajes')} className="px-6 py-2 bg-black text-white hover:bg-orange-500 transition-colors">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/admin/mensajes"
              className="inline-flex items-center gap-1 text-sm text-gray-700 hover:text-black"
            >
              <ArrowLeft className="w-4 h-4" />
              Mensajes
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
          )}
          {mensajeOk && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">{mensajeOk}</div>
          )}

          {loading ? (
            <div className="p-8 text-center text-gray-600 bg-white border border-gray-200 rounded-xl">Cargando mensaje...</div>
          ) : !mensaje ? (
            <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">Mensaje no encontrado.</div>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-orange-500" />
                    <h1 className="font-serif text-2xl font-bold text-black">{mensaje.asunto}</h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={archivar}
                      title="Archivar"
                      className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 border border-gray-200"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={eliminar}
                      title="Eliminar"
                      className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 border border-gray-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-slate-600 mb-4">
                  <p><span className="font-medium">De:</span> {mensaje.remitente_nombre || mensaje.remitente_email || '—'}</p>
                  <p><span className="font-medium">Para:</span> {mensaje.destinatario_nombre || mensaje.destinatario_email || '—'}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(mensaje.creado_at).toLocaleString('es-ES')}</p>
                </div>

                <p className="text-sm text-gray-800 whitespace-pre-wrap mb-4">{mensaje.cuerpo}</p>

                {mensaje.entidades && mensaje.entidades.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1">
                      <Paperclip className="w-3 h-3" /> Entidades adjuntas
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mensaje.entidades.map((ent, idx) => (
                        <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {ent.entidad_tipo}: {ent.titulo || ent.entidad_id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {mensaje.adjuntos && mensaje.adjuntos.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1">
                      <Paperclip className="w-3 h-3" /> Archivos adjuntos
                    </div>
                    <ul className="space-y-1">
                      {mensaje.adjuntos.map((a) => (
                        <li key={a.id} className="text-sm">
                          <a
                            href={`/api/admin/mensajes/adjuntos/${a.id}/descargar`}
                            className="text-orange-600 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {a.nombre_original} ({(a.tamano / 1024).toFixed(1)} KB)
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <form onSubmit={responder} className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="font-serif text-lg font-bold text-black mb-4">Responder</h2>
                <textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  rows={4}
                  placeholder="Escribe tu respuesta..."
                  className="w-full px-3 py-2 text-sm border border-black bg-white mb-4"
                  required
                />
                <button
                  type="submit"
                  disabled={enviando || !respuesta.trim()}
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 text-sm hover:bg-orange-500 hover:text-black transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {enviando ? 'Enviando...' : 'Enviar respuesta'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
