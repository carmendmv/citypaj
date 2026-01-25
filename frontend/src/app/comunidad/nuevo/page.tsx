'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HumanVerification from '@/components/forms/HumanVerification';

type BlogPost = {
  id: string;
  titulo: string;
  contenido: string;
  creado: string;
};

const BLOG_STORAGE_KEY = 'citypaj_blog_posts';

export default function ComunidadNuevoPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  const requiresCaptcha = useMemo(() => Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY), []);

  const save = () => {
    setError(null);

    if (requiresCaptcha && !turnstileToken) return;

    if (titulo.trim().length < 5) {
      setError('El título es obligatorio (mínimo 5 caracteres).');
      return;
    }

    if (contenido.trim().length < 20) {
      setError('El contenido es obligatorio (mínimo 20 caracteres).');
      return;
    }

    const post: BlogPost = {
      id: crypto.randomUUID(),
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      creado: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem(BLOG_STORAGE_KEY);
      const prev = raw ? (JSON.parse(raw) as BlogPost[]) : [];
      const next = Array.isArray(prev) ? [post, ...prev] : [post];
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(next));
      router.push(`/comunidad/${post.id}`);
    } catch {
      setError('No se pudo guardar el tema.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-[80%] max-w-6xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Publicar tema</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Crea una entrada para el blog comunitario</p>
        </div>

        <section className="mt-10 border border-black p-6">
          <div className="space-y-4">
            <div>
              <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="titulo">
                Título
              </label>
              <input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none hover:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="contenido">
                Contenido
              </label>
              <textarea
                id="contenido"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none hover:border-orange-500"
              />
            </div>

            <HumanVerification token={turnstileToken} onToken={(tok) => setTurnstileToken(tok)} />

            {error ? (
              <div className="border border-black p-3 font-sans text-sm text-black">{error}</div>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={save}
                disabled={requiresCaptcha && !turnstileToken}
                className="flex-1 bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-colors"
              >
                Publicar tema
              </button>
              <Link
                href="/comunidad"
                className="flex-1 text-center bg-white text-black border border-black px-6 py-3 font-sans text-sm hover:border-orange-500 hover:text-orange-500 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
