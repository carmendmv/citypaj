'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useGuardados } from '@/hooks/useGuardados';

interface HeartButtonProps {
  anuncioId: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const HeartButton: React.FC<HeartButtonProps> = ({
  anuncioId,
  className = '',
  showLabel = true,
  size = 'md'
}) => {
  const { estaGuardado, toggleGuardado } = useGuardados();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const isGuardado = estaGuardado(anuncioId);

  const handleClick = () => {
    toggleGuardado(anuncioId);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 font-sans ${labelSizeClasses[size]} ${
        isGuardado 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-black hover:text-orange-500'
      } transition-all duration-300 hover:scale-105 ${className}`}
      aria-label={isGuardado ? 'Quitar de guardados' : 'Añadir a guardados'}
    >
      <Heart 
        className={`${sizeClasses[size]} transition-all duration-300 ${
          isGuardado ? 'fill-current' : ''
        }`} 
      />
      {showLabel && (
        <span>
          {isGuardado ? 'Guardado' : 'Guardar'}
        </span>
      )}
    </button>
  );
};

HeartButton.displayName = 'HeartButton';

export default HeartButton;
