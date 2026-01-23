'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface AnuncioDetalle {
  id: string;
  titulo: string;
  descripcion: string;
  comunidad_autonoma: string;
  provincia: string;
  creado: string;
  autor?: string;
  email?: string;
  telefono?: string;
}

export default function AnuncioDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [anuncio, setAnuncio] = useState<AnuncioDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      try {
        const response = await fetch(`/api/anuncios/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setError('No se ha podido cargar el anuncio.');
          setAnuncio(null);
          return;
        }

        const json = await response.json();
        const data = json?.data as AnuncioDetalle | undefined;

        if (!cancelled) {
          setAnuncio(data || null);
        }
      } catch {
        if (!cancelled) {
          setError('No se ha podido cargar el anuncio.');
          setAnuncio(null);
        }
      } finally {
        clearTimeout(timeoutId);
        if (!cancelled) setLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="border-b border-black pb-6">
          <Link
            href="/"
            className="inline-block font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4"
          >
            Volver a anuncios
          </Link>

          {loading ? (
            <div className="mt-6 border border-black px-6 py-4 font-sans text-sm text-gray-700 inline-block">
              Cargando...
            </div>
          ) : error ? (
            <div className="mt-6 border border-black p-6">
              <p className="font-sans text-sm text-[#666666]">{error}</p>
            </div>
          ) : anuncio ? (
            <>
              <h1 className="mt-6 font-serif text-3xl sm:text-4xl font-bold text-black leading-tight">
                {anuncio.titulo}
              </h1>

              <div className="mt-3 font-sans text-sm text-[#666666]">
                <span>{formatFecha(anuncio.creado)}</span>
                {anuncio.comunidad_autonoma ? <span> · {anuncio.comunidad_autonoma}</span> : null}
                {anuncio.provincia ? <span> · {anuncio.provincia}</span> : null}
              </div>
            </>
          ) : (
            <div className="mt-6 border border-black p-6">
              <p className="font-sans text-sm text-[#666666]">Anuncio no encontrado.</p>
            </div>
          )}
        </div>

        {!loading && !error && anuncio ? (
          <div className="py-10">
            <section className="border border-black p-6">
              <h2 className="font-serif text-xl font-bold text-black">Descripción</h2>
              <p className="mt-4 font-sans text-base text-black/80 leading-relaxed whitespace-pre-line">
                {anuncio.descripcion}
              </p>
            </section>

            <section className="mt-8 border border-black p-6">
              <h2 className="font-serif text-xl font-bold text-black">Contacto</h2>

              <div className="mt-4 space-y-2 font-sans text-sm text-black">
                <div>
                  <span className="font-medium">Email:</span>{' '}
                  <a href={`mailto:${anuncio.email || ''}`} className="hover:text-orange-500">
                    {anuncio.email || 'No disponible'}
                  </a>
                </div>

                {anuncio.telefono ? (
                  <div>
                    <span className="font-medium">Teléfono:</span>{' '}
                    <a href={`tel:${anuncio.telefono}`} className="hover:text-orange-500">
                      {anuncio.telefono}
                    </a>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
