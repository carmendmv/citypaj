'use client';

import { useState } from 'react';
import { useFavoritos } from '@/hooks/useFavoritos';

interface FavoritoLike {
  id: string;
  titulo: string;
  descripcion?: string;
  categoria: string;
  precio?: number;
  creado_at?: string;
  usuario_nombre?: string;
  comunidad_autonoma?: string;
  provincia?: string;
}

interface FavoritoButtonProps {
  anuncio: FavoritoLike;
  className?: string;
  showLabel?: boolean;
}

export default function FavoritoButton({ anuncio, className = '', showLabel = false }: FavoritoButtonProps) {
  const { esFavorito, toggleFavorito, loading } = useFavoritos();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    toggleFavorito(anuncio);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const isFavorited = esFavorito(anuncio.id);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg border
        transition-all duration-300 ease-in-out
        hover:scale-105 active:scale-95
        ${isFavorited 
          ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' 
          : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
        }
        ${isAnimating ? 'animate-pulse' : ''}
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isFavorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      <svg
        className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      
      {showLabel && (
        <span className="text-sm font-medium">
          {isFavorited ? 'Favorito' : 'Guardar'}
        </span>
      )}
      
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
    </button>
  );
}
