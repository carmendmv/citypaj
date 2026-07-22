'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useComunidad } from '@/hooks/useComunidad';
import Pagination from '@/components/ui/Pagination';

type Anuncio = {
  id: string;
  titulo: string;
  descripcion: string;
  creado: string;
  autor?: string;
};

type NoticiaComunitaria = {
  id: string;
  titulo: string;
  contenido: string;
  categoria: 'evento' | 'anuncio' | 'servicio' | 'cultura' | 'deporte' | 'educacion';
  creado: string;
  autor: string;
  comunidad_autonoma: string;
  destacada?: boolean;
};

type PaginationMeta = {
  pagina: number;
  limite: number;
  total: number;
  total_paginas: number;
};

const BLOG_STORAGE_KEY = 'citypaj_blog_posts';

export default function ComunidadPage() {
  const [loading, setLoading] = useState(true);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<NoticiaComunitaria[]>([]);
  const { comunidadAutonoma, setComunidadAutonoma } = useComunidad();

  const fetchListado = async (pagina: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        categoria: 'intercambios',
        orden: 'fecha_desc',
        limite: '30',
        pagina: pagina.toString(),
      });

      if (comunidadAutonoma) params.set('comunidad_autonoma', comunidadAutonoma);

      const res = await fetch(`/api/anuncios?${params.toString()}`);
      const json = await res.json();
      setAnuncios(json?.data || []);
      setPaginationMeta(json?.meta || null);
    } catch {
      setAnuncios([]);
      setPaginationMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchListado(currentPage);
  }, [comunidadAutonoma, currentPage]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BLOG_STORAGE_KEY);
      if (!raw) {
        setPosts([]);
        return;
      }
      const parsed = JSON.parse(raw) as NoticiaComunitaria[];
      setPosts(Array.isArray(parsed) ? parsed : []);
    } catch {
      setPosts([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-[80%] max-w-6xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Noticias comunitarias de {comunidadAutonoma || 'España'}</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">
            Información relevante y actual de tu comunidad autónoma. Espacio para noticias moderadas.
          </p>
        </div>

        <section className="mt-10 border border-black p-6">
          <h2 className="font-serif text-xl font-bold text-black">Últimas Noticias</h2>
          <p className="mt-4 font-sans text-sm text-black/80">
            Mantente informado sobre eventos, anuncios y servicios importantes en tu comunidad.
          </p>
        </section>

        <section className="mt-10 border border-black p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="font-serif text-xl font-bold text-black">Noticias Publicadas</h2>
            <Link
              href="/comunidad/nuevo"
              className="inline-flex items-center justify-center bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-colors"
            >
              Publicar noticia
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="mt-4 font-sans text-sm text-black/80">
              Aún no hay noticias publicadas. Sé el primero en compartir información relevante de tu comunidad.
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              {posts
                .slice()
                .sort((a, b) => new Date(b.creado).getTime() - new Date(a.creado).getTime())
                .map((p) => (
                  <div
                    key={p.id}
                    className="border border-black p-6 hover:border-orange-500 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            p.categoria === 'evento' ? 'bg-blue-100 text-blue-800' :
                            p.categoria === 'anuncio' ? 'bg-green-100 text-green-800' :
                            p.categoria === 'servicio' ? 'bg-purple-100 text-purple-800' :
                            p.categoria === 'cultura' ? 'bg-pink-100 text-pink-800' :
                            p.categoria === 'deporte' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {p.categoria.charAt(0).toUpperCase() + p.categoria.slice(1)}
                          </span>
                          {p.destacada && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Destacada
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {p.comunidad_autonoma}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-black mb-3">
                          {p.titulo}
                        </h3>
                        <p className="font-sans text-sm text-gray-700 leading-relaxed mb-4">
                          {p.contenido.length > 200 ? `${p.contenido.slice(0, 197)}...` : p.contenido}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Por: {p.autor}</span>
                          <span>{new Date(p.creado).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/comunidad/${p.id}`}
                          className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-all font-light text-sm text-center"
                        >
                          Leer más
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>


        {loading ? (
          <div className="mt-10 border border-black px-6 py-4 font-sans text-sm text-gray-700 inline-block">Cargando...</div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {anuncios.map((a) => (
              <Link
                key={a.id}
                href={`/anuncios/${a.id}`}
                className="group block border border-black p-5 hover:border-orange-500 transition-colors"
              >
                <h3 className="font-serif text-xl font-bold text-black group-hover:text-orange-500 transition-colors">
                  {a.titulo}
                </h3>
                <p className="mt-3 font-sans text-sm text-black/80">{a.descripcion}</p>
              </Link>
            ))}
          </div>
        )}

        {paginationMeta && paginationMeta.total_paginas > 1 && (
          <div className="mt-8 flex justify-end">
            <Pagination currentPage={paginationMeta.pagina} totalPages={paginationMeta.total_paginas} baseUrl="/comunidad" />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
