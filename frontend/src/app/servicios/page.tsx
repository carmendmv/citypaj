'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnuncioList from '@/components/ui/AnuncioList';
import FiltroAvanzado from '@/components/ui/FiltroAvanzado';
import { useComunidad } from '@/hooks/useComunidad';
import { Anuncio, PaginationMeta } from '@/types';

interface FiltrosAvanzados {
  categoria: string;
  comunidad_autonoma: string;
  provincia: string;
  modalidad: string;
  precio_min: string;
  precio_max: string;
  orden: string;
  buscar: string;
}

export default function ServiciosPage() {
  const [loading, setLoading] = useState(true);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosAvanzados>({
    categoria: 'servicios',
    comunidad_autonoma: '',
    provincia: '',
    modalidad: '',
    precio_min: '',
    precio_max: '',
    orden: 'fecha_desc',
    buscar: ''
  });
  const { comunidadAutonoma, setComunidadAutonoma } = useComunidad();

  const fetchListado = async (pagina: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        pagina: pagina.toString(),
        limite: '20',
      });

      // Añadir filtros activos
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      const res = await fetch(`http://localhost:3002/api/anuncios?${params.toString()}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
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

  const handleFiltroChange = (nuevosFiltros: FiltrosAvanzados) => {
    setFiltros(nuevosFiltros);
    setCurrentPage(1); // Resetear a primera página cuando cambian filtros
  };

  useEffect(() => {
    void fetchListado(currentPage);
  }, [filtros, currentPage]);

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

        <FiltroAvanzado 
          onFiltroChange={handleFiltroChange}
          categoriaInicial="servicios"
        />

        <AnuncioList 
          anuncios={anuncios}
          loading={loading}
          paginationMeta={paginationMeta}
          comunidadAutonoma={comunidadAutonoma || undefined}
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
