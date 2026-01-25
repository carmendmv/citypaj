'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams();
  
  if (totalPages <= 1) return null;

  // Generar números de página mostrando siempre del 1 al 7
  const getVisiblePages = () => {
    const pages: number[] = [];
    for (let i = 1; i <= Math.min(7, totalPages); i++) {
      pages.push(i);
    }
    return pages;
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pagina', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-end mt-8">
      <nav className="flex items-center space-x-1">
        {currentPage > 1 && (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="px-4 py-2 text-base font-serif text-black border-2 border-black bg-transparent hover:text-orange-500 hover:border-orange-500 transition-all duration-300"
          >
            ←
          </Link>
        )}

        {visiblePages.map((page, index) => (
          <div key={index}>
            <Link
              href={createPageUrl(page)}
              className={`px-4 py-2 text-base font-serif border-2 transition-all duration-300 ${
                page === currentPage
                  ? 'text-black border-black bg-transparent'
                  : 'text-black border-black bg-transparent hover:text-orange-500 hover:border-orange-500'
              }`}
            >
              {page}
            </Link>
          </div>
        ))}

        {currentPage < totalPages && (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="px-4 py-2 text-base font-serif text-black border-2 border-black bg-transparent hover:text-orange-500 hover:border-orange-500 transition-all duration-300"
          >
            →
          </Link>
        )}
      </nav>
    </div>
  );
}
