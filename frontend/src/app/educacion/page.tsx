'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnuncioList from '@/components/ui/AnuncioList';
import FiltroAvanzado from '@/components/ui/FiltroAvanzado';
import { useComunidad } from '@/hooks/useComunidad';
import { Anuncio, PaginationMeta } from '@/types';

export default function EducacionPage() {
  const [loading, setLoading] = useState(true);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { comunidadAutonoma, setComunidadAutonoma } = useComunidad();

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

const [filtros, setFiltros] = useState<FiltrosAvanzados>({
    categoria: 'educacion',
    comunidad_autonoma: '',
    provincia: '',
    modalidad: '',
    precio_min: '',
    precio_max: '',
    orden: 'fecha_desc',
    buscar: ''
  });

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

      <main className="w-[90%] sm:w-[85%] max-w-6xl mx-auto px-6 py-14">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-black mb-2">Educación</h1>
          <p className="font-sans text-[#666666]">
            Clases particulares y formación
          </p>
        </div>

        <FiltroAvanzado 
          onFiltroChange={handleFiltroChange}
          categoriaInicial="educacion"
          ocultarPrecio={true}
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
