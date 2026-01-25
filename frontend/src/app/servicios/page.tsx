'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnuncioList from '@/components/ui/AnuncioList';
import { useComunidad } from '@/hooks/useComunidad';
import { Anuncio, PaginationMeta } from '@/types';

export default function ServiciosPage() {
  const [loading, setLoading] = useState(true);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { comunidadAutonoma, setComunidadAutonoma } = useComunidad();

  const fetchListado = async (pagina: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        categoria: 'servicios',
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-[80%] max-w-6xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Servicios en {comunidadAutonoma || 'España'}</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">
            Transporte, salud juvenil, vivienda, ayudas públicas y trámites.
          </p>
        </div>


        <AnuncioList 
          anuncios={anuncios}
          loading={loading}
          paginationMeta={paginationMeta}
          comunidadAutonoma={comunidadAutonoma}
          categoria="servicios"
          onPageChange={(page) => {
            setCurrentPage(page);
            void fetchListado(page);
          }}
        />
      </main>
      <Footer />
    </div>
  );
}
