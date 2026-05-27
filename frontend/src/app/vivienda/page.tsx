'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnuncioList from '@/components/ui/AnuncioList';
import FiltrosAvanzados from '@/components/ui/FiltrosAvanzados';
import { useComunidad } from '@/hooks/useComunidad';
import { Anuncio, PaginationMeta } from '@/types';

export default function ViviendaPage() {
  const [loading, setLoading] = useState(true);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { comunidadAutonoma, setComunidadAutonoma } = useComunidad();

  const [filtros, setFiltros] = useState({
    comunidad_autonoma: comunidadAutonoma || '',
    provincia: '',
    orden: 'fecha_desc',
    destacados: false
  });

  const fetchListado = async (pagina: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        categoria: 'vivienda',
        orden: filtros.orden,
        limite: '30',
        pagina: pagina.toString(),
      });

      if (filtros.comunidad_autonoma) params.set('comunidad_autonoma', filtros.comunidad_autonoma);
      if (filtros.provincia) params.set('provincia', filtros.provincia);
      if (filtros.destacados) params.set('destacados', 'true');

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
  }, [filtros, currentPage]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-[90%] sm:w-[85%] max-w-6xl mx-auto px-6 py-14">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-black mb-2">Vivienda</h1>
          <p className="font-sans text-[#666666]">
            Alquiler, venta y habitaciones
          </p>
        </div>

        <FiltrosAvanzados
          categoria="vivienda"
          onFiltrosChange={(nuevosFiltros) => {
            setFiltros(nuevosFiltros);
            setCurrentPage(1); // Resetear a la primera página cuando cambian los filtros
          }}
        />

        <AnuncioList
          anuncios={anuncios}
          loading={loading}
          paginationMeta={paginationMeta}
          onPageChange={setCurrentPage}
        />
      </main>

      <Footer />
    </div>
  );
}
