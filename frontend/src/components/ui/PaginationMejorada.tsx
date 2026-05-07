'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationMeta {
  pagina: number;
  limite: number;
  total: number;
  total_paginas: number;
}

interface PaginationMejoradaProps {
  paginationMeta: PaginationMeta;
  onPageChange: (page: number) => void;
  currentPage?: number;
  className?: string;
}

export default function PaginationMejorada({
  paginationMeta,
  onPageChange,
  currentPage = paginationMeta.pagina,
  className = '',
}: PaginationMejoradaProps) {
  const { pagina, total_paginas } = paginationMeta;

  const handlePrevious = () => {
    if (pagina > 1) {
      onPageChange(pagina - 1);
    }
  };

  const handleNext = () => {
    if (pagina < total_paginas) {
      onPageChange(pagina + 1);
    }
  };

  const handlePageClick = (pageNum: number) => {
    onPageChange(pageNum);
  };

  // Generar array de páginas a mostrar
  const getVisiblePages = () => {
    const delta = 2; // Número de páginas a cada lado de la actual
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= total_paginas; i++) {
      if (
        i === 1 ||
        i === total_paginas ||
        (i >= pagina - delta && i <= pagina + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (total_paginas <= 1) {
    return null;
  }

  return (
    <nav
      className={`flex items-center justify-between ${className}`}
      role="navigation"
      aria-label="Navegación de páginas"
    >
      {/* Botón Anterior */}
      <button
        onClick={handlePrevious}
        disabled={pagina <= 1}
        aria-disabled={pagina <= 1}
        aria-label="Página anterior"
        className={`
          inline-flex items-center gap-2 px-3 py-2 text-sm font-sans font-medium
          border border-black transition-all
          ${pagina <= 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-black hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
          }
        `}
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        <span>Anterior</span>
      </button>

      {/* Números de página */}
      <div className="flex items-center space-x-1">
        {getVisiblePages().map((pageNum, index) => (
          <span key={index}>
            {pageNum === '...' ? (
              <span className="px-3 py-2 text-sm font-serif text-gray-500" aria-hidden="true">
                ...
              </span>
            ) : (
              <button
                onClick={() => handlePageClick(pageNum as number)}
                aria-label={`Ir a la página ${pageNum}`}
                aria-current={pagina === pageNum ? 'page' : undefined}
                className={`
                  px-3 py-2 text-sm font-serif font-medium transition-all
                  ${pagina === pageNum
                    ? 'bg-orange-500 text-white border border-orange-500'
                    : 'bg-white text-black border border-black hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
                  }
                `}
              >
                {pageNum}
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={handleNext}
        disabled={pagina >= total_paginas}
        aria-disabled={pagina >= total_paginas}
        aria-label="Página siguiente"
        className={`
          inline-flex items-center gap-2 px-3 py-2 text-sm font-sans font-medium
          border border-black transition-all
          ${pagina >= total_paginas
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-black hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
          }
        `}
      >
        <span>Siguiente</span>
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
