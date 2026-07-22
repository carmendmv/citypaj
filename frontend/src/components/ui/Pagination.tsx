'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  queryParam?: string;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl = '/',
  queryParam = 'page',
  onPageChange,
}: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const getVisiblePages = (): (number | null)[] => {
    const pages: (number | null)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Siempre mostrar 1 y totalPages, y hasta 5 páginas centradas en la actual
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push(null, totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, null);
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, null);
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push(null, totalPages);
    }

    return pages;
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(queryParam, page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const PageButton = ({ page, label }: { page: number; label: React.ReactNode }) => {
    const active = page === currentPage;
    const outOfRange = page < 1 || page > totalPages;
    const className = `px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${
      active
        ? 'bg-black text-white border-black'
        : outOfRange
        ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600'
    }`;

    if (onPageChange) {
      return (
        <button
          type="button"
          onClick={() => !outOfRange && handlePageClick(page)}
          disabled={active || outOfRange}
          className={className}
        >
          {label}
        </button>
      );
    }

    if (outOfRange) {
      return (
        <span className={className}>
          {label}
        </span>
      );
    }

    return (
      <Link href={createPageUrl(page)} className={className}>
        {label}
      </Link>
    );
  };

  const Ellipsis = () => (
    <span className="px-2 py-2 text-sm text-gray-400 select-none">...</span>
  );

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center gap-1" aria-label="Paginación">
        <PageButton page={currentPage - 1} label="←" />

        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === null ? (
              <Ellipsis />
            ) : (
              <PageButton page={page} label={page} />
            )}
          </div>
        ))}

        <PageButton page={currentPage + 1} label="→" />
      </nav>
    </div>
  );
}
