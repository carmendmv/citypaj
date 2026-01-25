'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Pagination from '@/components/ui/Pagination';
import { generarAnunciosMasivos } from '@/data/anunciosMasivos';
import { useComunidad } from '@/hooks/useComunidad';
import { useAITranslation } from '@/lib/ai-translation';

interface Anuncio {
  id: string;
  usuario_id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  subcategoria?: string;
  comunidad_autonoma: string;
  provincia: string;
  barrio?: string;
  precio?: number;
  modalidad: 'venta' | 'regalo' | 'intercambio' | 'servicio' | 'compra';
  contacto_email: boolean;
  contacto_telefono: boolean;
  contacto_anonimo: boolean;
  visible: boolean;
  estado_moderacion: 'pending' | 'approved' | 'rejected' | 'flagged';
  motivo_rechazo?: string;
  vistas: number;
  creado: string;
  actualizado: string;
  // Campos adicionales de joins
  usuario_nombre?: string;
  usuario_verificado?: boolean;
  numero_imagenes?: number;
  imagenes?: any[];
  es_favorito?: boolean;
}

interface PaginationMeta {
  pagina: number;
  limite: number;
  total: number;
  total_paginas: number;
}

export default function AnunciosComunidadPage({ params }: { params: { comunidad: string } }) {
  const { comunidad } = params;
  const { t } = useAITranslation();
  const searchParams = useSearchParams();
  const { comunidadAutonoma, setComunidadAutonoma } = useComunidad();

  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Leer página actual de URL
  useEffect(() => {
    const pageFromUrl = searchParams.get('pagina');
    if (pageFromUrl) {
      const page = parseInt(pageFromUrl, 10);
      if (!isNaN(page) && page > 0) {
        setCurrentPage(page);
      }
    }
  }, [searchParams]);

  const fetchAnunciosPaginated = useCallback(async (comunidadNombre: string, page: number = 1) => {
    setLoading(true);
    try {
      // Usar directamente los anuncios masivos para demostración
      const allAnuncios = generarAnunciosMasivos(comunidadNombre);
      
      // Ordenar por fecha (más reciente a más antiguo)
      const sortedAnuncios = [...allAnuncios].sort((a, b) => 
        new Date(b.creado).getTime() - new Date(a.creado).getTime()
      );
      
      const limit = 15;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = sortedAnuncios.slice(start, end);

      return {
        data: paginatedData,
        meta: {
          pagina: page,
          limite: limit,
          total: sortedAnuncios.length,
          total_paginas: Math.ceil(sortedAnuncios.length / limit),
        },
      };
    } catch {
      return { data: [], meta: { pagina: 1, limite: 15, total: 0, total_paginas: 0 } };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (comunidad) {
      void fetchAnunciosPaginated(decodeURIComponent(comunidad), currentPage).then(result => {
        setAnuncios(result.data);
        setPaginationMeta(result.meta);
      });
    }
  }, [comunidad, currentPage, fetchAnunciosPaginated]);

  const formatFecha = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const resumen100 = (text: string) => {
    const trimmed = (text || '').trim();
    if (trimmed.length <= 100) return trimmed;
    return `${trimmed.slice(0, 97)}...`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-[80%] max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between gap-6 border-b border-black pb-6 mt-10">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">
              Últimos anuncios de {decodeURIComponent(comunidad)}
            </h1>
          </div>
          <div className="hidden sm:block font-sans text-sm text-[#666666]">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        {loading ? (
          <div className="mt-10 border border-black px-6 py-4 font-sans text-sm text-gray-700 inline-block">{t('common.loading')}</div>
        ) : (
          <>
            <div className="mt-10 border border-black bg-white">
              {anuncios.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium">No hay anuncios disponibles</p>
                    <p className="text-sm text-gray-500 mt-2">
                      En {decodeURIComponent(comunidad)}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Lista de anuncios en filas - más estrechos y elegantes */}
                  <div className="divide-y divide-black">
                    {anuncios.map((anuncio) => (
                      <Link
                        key={anuncio.id}
                        href={`/anuncios/${anuncio.id}`}
                        className="block py-2 px-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-serif text-lg font-bold text-black mb-1 hover:text-orange-500 transition-colors">
                              {anuncio.titulo}
                            </h3>
                            <p className="font-light text-gray-600 line-clamp-1 text-sm">
                              {resumen100(anuncio.descripcion)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 ml-4">
                            <span className="font-medium">
                              {anuncio.usuario_nombre || 'Anónimo'}
                            </span>
                            <span>
                              {formatFecha(anuncio.creado)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Paginación elegante */}
                  {paginationMeta && (
                    <div className="border-t border-black p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Mostrando {anuncios.length} de {paginationMeta.total} anuncios
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Números de página del 1 al 7 */}
                          {Array.from({ length: Math.min(7, paginationMeta.total_paginas) }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => {
                                setCurrentPage(pageNum);
                                const params = new URLSearchParams(window.location.search);
                                params.set('pagina', pageNum.toString());
                                window.history.pushState(null, '', `?${params.toString()}`);
                              }}
                              className={`px-3 py-1 text-lg font-serif font-bold transition-all hover:text-orange-500 ${
                                paginationMeta.pagina === pageNum
                                  ? 'text-black text-xl'
                                  : 'text-black hover:text-orange-500'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                          
                          {paginationMeta.total_paginas > 7 && (
                            <>
                              <span className="px-2 text-gray-500 font-serif text-lg">...</span>
                              <button
                                onClick={() => {
                                  setCurrentPage(paginationMeta.total_paginas);
                                  const params = new URLSearchParams(window.location.search);
                                  params.set('pagina', paginationMeta.total_paginas.toString());
                                  window.history.pushState(null, '', `?${params.toString()}`);
                                }}
                                className="px-3 py-1 text-lg font-serif font-bold text-black hover:text-orange-500 transition-all"
                              >
                                {paginationMeta.total_paginas}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        <div className="mt-10">
          <Link 
            href="/" 
            className="font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
