'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

type Comentario = {
  id: number;
  contenido: string;
  creado_at: string;
  usuario_nombre?: string;
};

type Publicacion = {
  id: number;
  titulo: string;
  contenido: string;
  provincia: string;
  tema: string;
  creado_at: string;
  usuario_nombre?: string;
  comentarios?: Comentario[];
};

function formatFecha(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ComunidadPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { user } = useAuth();

  const [post, setPost] = useState<Publicacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargarPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/comunidad/${id}`);
      const data = await res.json();
      if (data.success) {
        setPost(data.data);
      } else {
        setError(data.error || 'No se pudo cargar la publicación');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPost();
  }, [id]);

  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    setEnviando(true);
    try {
      const res = await fetch(`/api/comunidad/${id}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: user?.id, contenido: nuevoComentario.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNuevoComentario('');
        await cargarPost();
      } else {
        setError(data.error || 'No se pudo enviar el comentario');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-[80%] max-w-6xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <Link
            href="/comunidad"
            className="inline-block font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4"
          >
            Volver a Comunidad
          </Link>

          {loading ? (
            <div className="mt-6 border border-black p-6">
              <p className="font-sans text-sm text-[#666666]">Cargando...</p>
            </div>
          ) : error ? (
            <div className="mt-6 border border-black p-6">
              <p className="font-sans text-sm text-red-600">{error}</p>
            </div>
          ) : post ? (
            <>
              <h1 className="mt-6 font-serif text-3xl sm:text-4xl font-bold text-black">{post.titulo}</h1>
              <div className="mt-3 font-sans text-sm text-[#666666]">
                {formatFecha(post.creado_at)} · {post.provincia} · {post.tema}
              </div>
              <div className="mt-2 font-sans text-sm text-gray-500">
                Publicado por {post.usuario_nombre || 'Anónimo'}
              </div>
            </>
          ) : (
            <div className="mt-6 border border-black p-6">
              <p className="font-sans text-sm text-[#666666]">Tema no encontrado.</p>
            </div>
          )}
        </div>

        {post && (
          <section className="mt-10 border border-black p-6">
            <h2 className="font-serif text-xl font-bold text-black">Contenido</h2>
            <p className="mt-4 font-sans text-base text-black/80 leading-relaxed whitespace-pre-line">{post.contenido}</p>
          </section>
        )}

        {post && (
          <section className="mt-10">
            <h2 className="font-serif text-2xl font-bold text-black mb-6">Comentarios</h2>

            {post.comentarios && post.comentarios.length > 0 ? (
              <div className="space-y-4">
                {post.comentarios.map((c) => (
                  <div key={c.id} className="border border-gray-200 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">{c.usuario_nombre || 'Anónimo'} · {formatFecha(c.creado_at)}</p>
                    <p className="text-gray-800 whitespace-pre-line">{c.contenido}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aún no hay comentarios. Sé el primero.</p>
            )}

            <div className="mt-8 border border-gray-200 rounded-xl p-4">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                rows={4}
                placeholder={user ? 'Escribe tu comentario...' : 'Inicia sesión para comentar'}
                disabled={!user || enviando}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none disabled:bg-gray-100"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={enviarComentario}
                  disabled={!user || !nuevoComentario.trim() || enviando}
                  className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {enviando ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
