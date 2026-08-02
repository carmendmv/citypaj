'use client';

import Link from 'next/link';

interface EmptyStateProps {
  titulo?: string;
  mensaje?: string;
  icono?: React.ReactNode;
  accion?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({
  titulo = 'No hay resultados',
  mensaje = 'Todavía no hay contenido aquí.',
  icono,
  accion
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 sm:py-16 px-4 border border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
      {icono ? (
        <div className="mx-auto w-16 h-16 text-gray-400 mb-4 flex items-center justify-center">
          {icono}
        </div>
      ) : (
        <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">{mensaje}</p>
      {accion && (
        <Link
          href={accion.href}
          className="inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-orange-500 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
        >
          {accion.label}
        </Link>
      )}
    </div>
  );
}
