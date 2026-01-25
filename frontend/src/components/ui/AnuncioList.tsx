'use client';

import React from 'react';
import Link from 'next/link';
import { Anuncio, PaginationMeta } from '@/types';

interface AnuncioListProps {
  anuncios: Anuncio[];
  loading?: boolean;
  error?: string | null;
  paginationMeta?: PaginationMeta | null;
  comunidadAutonoma?: string;
  categoria?: string;
  onPageChange?: (page: number) => void;
  onAnuncioClick?: (id: string) => void;
}

const AnuncioList: React.FC<AnuncioListProps> = ({
  anuncios,
  loading = false,
  error = null,
  paginationMeta = null,
  comunidadAutonoma = '',
  categoria = '',
  onPageChange,
  onAnuncioClick
}) => {
  const resumen100 = (texto: string): string => {
    if (texto.length <= 100) return texto;
    return texto.slice(0, 100).trim() + '...';
  };

  const formatFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading && anuncios.length === 0) {
    return (
      <div className="border border-black bg-white">
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando anuncios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-black bg-white">
        <div className="p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (anuncios.length === 0) {
    return (
      <div className="border border-black bg-white">
        {anuncios.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">No hay anuncios disponibles</p>
              <p className="text-sm text-gray-500 mt-2">
                {categoria ? `En la categoría ${categoria}` : ''}
              </p>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }

  return (
    <div className="border border-black bg-white">
      {/* Lista de anuncios en filas - más estrechos de altura */}
      <div className="divide-y divide-black max-w-4xl mx-auto">
        {anuncios.map((anuncio) => (
          <div
            key={anuncio.id}
            onClick={() => onAnuncioClick?.(anuncio.id)}
            className="block py-2 px-4 hover:bg-gray-50 transition-colors cursor-pointer"
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
          </div>
        ))}
      </div>

      {/* Paginación elegante - números más grandes, negros, serifa, sin fondo */}
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
                  onClick={() => onPageChange?.(pageNum)}
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
                    onClick={() => onPageChange?.(paginationMeta.total_paginas)}
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
    </div>
  );
};

export default AnuncioList;
