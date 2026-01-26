'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type Anuncio = {
  id: string;
  titulo: string;
  descripcion: string;
  creado: string;
};

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const q = useMemo(() => (searchParams.get('q') || '').trim(), [searchParams]);

  const [loading, setLoading] = useState(false);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!q) {
        setAnuncios([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/anuncios/search?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        setAnuncios(json?.data || []);
      } catch {
        setAnuncios([]);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [q]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-[90%] sm:max-w-7xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Buscar</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">
            {q ? `Resultados para: "${q}"` : 'Introduce un término de búsqueda desde la barra superior.'}
          </p>
        </div>

        {loading ? (
          <div className="mt-10 border border-black px-6 py-4 font-sans text-sm text-gray-700 inline-block">Buscando...</div>
        ) : (
          <>
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

            {q && anuncios.length === 0 ? (
              <div className="mt-12 border border-black p-6">
                <p className="font-sans text-sm text-[#666666]">No hay resultados.</p>
              </div>
            ) : null}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
