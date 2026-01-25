'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type BlogPost = {
  id: string;
  titulo: string;
  contenido: string;
  creado: string;
};

const BLOG_STORAGE_KEY = 'citypaj_blog_posts';

export default function ComunidadPostPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [post, setPost] = useState<BlogPost | null>(null);

  const formatFecha = useMemo(() => {
    return (iso: string) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '';
      return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BLOG_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as BlogPost[]) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      const found = list.find((p) => p.id === id) || null;
      setPost(found);
    } catch {
      setPost(null);
    }
  }, [id]);

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

          {post ? (
            <>
              <h1 className="mt-6 font-serif text-3xl sm:text-4xl font-bold text-black">{post.titulo}</h1>
              <div className="mt-3 font-sans text-sm text-[#666666]">{formatFecha(post.creado)}</div>
            </>
          ) : (
            <div className="mt-6 border border-black p-6">
              <p className="font-sans text-sm text-[#666666]">Tema no encontrado.</p>
            </div>
          )}
        </div>

        {post ? (
          <section className="mt-10 border border-black p-6">
            <h2 className="font-serif text-xl font-bold text-black">Contenido</h2>
            <p className="mt-4 font-sans text-base text-black/80 leading-relaxed whitespace-pre-line">{post.contenido}</p>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
