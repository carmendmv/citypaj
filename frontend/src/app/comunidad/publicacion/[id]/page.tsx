'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReportModal from '@/components/ui/ReportModal';
import NombreModal from '@/components/comunidad/NombreModal';
import { MOTIVOS_REPORTE } from '@/lib/comunidad';

const NOMBRE_STORAGE_KEY = 'citypaj_nombre_comunidad';

interface Comentario {
  id: number;
  contenido: string;
  usuario_nombre?: string;
  creado_at: string;
  likes_count: number;
}

interface Publicacion {
  id: number;
  titulo: string;
  contenido: string;
  provincia: string;
  tema: string;
  usuario_nombre?: string;
  creado_at: string;
  likes_count: number;
  respuestas_count: number;
  me_gusta: boolean;
  comentarios: Comentario[];
}

export default function PublicacionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [reportarAbierto, setReportarAbierto] = useState(false);
  const [reportarRespuestaId, setReportarRespuestaId] = useState<number | null>(null);
  const [reportarLoading, setReportarLoading] = useState(false);
  const [nombre, setNombre] = useState<string | null>(null);
  const [pedirNombre, setPedirNombre] = useState(false);

  const id = params.id;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNombre(localStorage.getItem(NOMBRE_STORAGE_KEY));
    }
  }, []);

  const cargar = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/comunidad/publicacion/${id}`);
      const data = await res.json();
      if (data.success) {
        setPublicacion(data.data);
      } else {
        setError(data.error || 'No se ha podido cargar la conversación.');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [id]);

  const guardarNombre = (n: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(NOMBRE_STORAGE_KEY, n);
    }
    setNombre(n);
    setPedirNombre(false);
  };

  const toggleLike = async () => {
    if (!publicacion) return;
    setLikeLoading(true);
    const method = publicacion.me_gusta ? 'DELETE' : 'POST';
    try {
      const res = await fetch(`/api/comunidad/publicaciones/${publicacion.id}/like`, { method });
      const data = await res.json();
      if (data.success) {
        setPublicacion({
          ...publicacion,
          me_gusta: !publicacion.me_gusta,
          likes_count: data.data?.total || publicacion.likes_count
        });
      }
    } catch {
      alert('Error al actualizar el apoyo.');
    } finally {
      setLikeLoading(false);
    }
  };

  const enviarRespuesta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicacion) return;

    if (!nombre) {
      setPedirNombre(true);
      return;
    }

    const limpia = respuesta.trim();
    if (limpia.length < 3) {
      alert('La respuesta es demasiado corta.');
      return;
    }

    setEnviandoRespuesta(true);
    try {
      const res = await fetch(`/api/comunidad/publicaciones/${publicacion.id}/respuestas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: limpia, nombre_usuario: nombre })
      });
      const data = await res.json();
      if (data.success) {
        setRespuesta('');
        await cargar();
      } else {
        alert(data.error || 'No se ha podido publicar la respuesta.');
      }
    } catch {
      alert('Error de conexión al responder.');
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  const reportar = async (motivo: string, descripcion: string) => {
    const objetoId = reportarRespuestaId || publicacion?.id;
    if (!objetoId) return;
    const endpoint = reportarRespuestaId
      ? `/api/comunidad/respuestas/${objetoId}/reportar`
      : `/api/comunidad/publicaciones/${objetoId}/reportar`;
    setReportarLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo, descripcion })
      });
      const data = await res.json();
      if (data.success) {
        setReportarAbierto(false);
        setReportarRespuestaId(null);
      } else {
        alert(data.error || 'No se pudo enviar el reporte.');
      }
    } catch {
      alert('Error al enviar el reporte.');
    } finally {
      setReportarLoading(false);
    }
  };

  const abrirReportarPublicacion = () => {
    setReportarRespuestaId(null);
    setReportarAbierto(true);
  };

  const abrirReportarRespuesta = (respuestaId: number) => {
    setReportarRespuestaId(respuestaId);
    setReportarAbierto(true);
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Link href="/comunidad" className="text-sm text-blue-600 hover:underline">← Volver a comunidad</Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div className="h-32 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 border border-red-100 rounded-2xl">{error}</div>
        ) : !publicacion ? (
          <div className="p-8 text-center text-gray-500 border border-gray-100 rounded-2xl">Conversación no encontrada.</div>
        ) : (
          <>
            <article className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  {publicacion.tema}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  {publicacion.provincia}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{publicacion.titulo}</h1>
              <p className="text-sm text-gray-500 mb-6">
                Por {publicacion.usuario_nombre || 'Anónimo'} · {formatFecha(publicacion.creado_at)}
              </p>
              <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                {publicacion.contenido}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={toggleLike}
                  disabled={likeLoading}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    publicacion.me_gusta
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {publicacion.me_gusta ? 'Te interesa' : 'Me interesa'}
                  {publicacion.likes_count > 0 && (
                    <span className="font-semibold">({publicacion.likes_count})</span>
                  )}
                </button>

                <button
                  onClick={abrirReportarPublicacion}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  Reportar
                </button>
              </div>
            </article>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {publicacion.comentarios.length} {publicacion.comentarios.length === 1 ? 'respuesta' : 'respuestas'}
              </h2>

              {publicacion.comentarios.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-2xl text-sm text-gray-600">
                  Aún no hay respuestas. Sé el primero en aportar tu punto de vista.
                </div>
              ) : (
                <div className="space-y-4">
                  {publicacion.comentarios.map((c) => (
                    <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                      <p className="text-sm font-medium text-gray-900 mb-1">{c.usuario_nombre || 'Anónimo'}</p>
                      <p className="text-xs text-gray-400 mb-2">{formatFecha(c.creado_at)}</p>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{c.contenido}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        {c.likes_count > 0 && <span className="text-gray-500">{c.likes_count} apoyos</span>}
                        <button
                          onClick={() => abrirReportarRespuesta(c.id)}
                          className="text-orange-600 hover:underline"
                        >
                          Reportar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-gray-50 rounded-2xl p-5 sm:p-6">
              <form onSubmit={enviarRespuesta}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Añadir respuesta</label>
                <textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                  required
                  minLength={3}
                />
                <div className="mt-3 flex items-center justify-between">
                  {nombre ? (
                    <p className="text-xs text-gray-500">
                      Como <span className="font-semibold">{nombre}</span>
                      <button type="button" onClick={() => setPedirNombre(true)} className="ml-2 text-blue-600 hover:underline">Cambiar</button>
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">Se te pedirá un nombre antes de publicar.</p>
                  )}
                  <button
                    type="submit"
                    disabled={enviandoRespuesta}
                    className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition-colors disabled:opacity-60"
                  >
                    {enviandoRespuesta ? 'Publicando...' : 'Publicar respuesta'}
                  </button>
                </div>
              </form>
            </section>
          </>
        )}
      </main>
      <Footer />

      <ReportModal
        isOpen={reportarAbierto}
        onClose={() => { setReportarAbierto(false); setReportarRespuestaId(null); }}
        onSubmit={reportar}
        loading={reportarLoading}
      />

      <NombreModal
        isOpen={pedirNombre}
        onClose={() => setPedirNombre(false)}
        onSubmit={guardarNombre}
      />
    </div>
  );
}
