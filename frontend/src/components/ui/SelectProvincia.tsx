'use client';

import { useState, useEffect, useRef } from 'react';

interface SelectProvinciaProps {
  comunidadAutonoma: string;
  provincia: string;
  onProvinciaChange: (provincia: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}

export default function SelectProvincia({
  comunidadAutonoma,
  provincia,
  onProvinciaChange,
  className = '',
  disabled = false,
  placeholder = 'Selecciona provincia (opcional)',
  id = 'provincia'
}: SelectProvinciaProps) {
  const [provincias, setProvincias] = useState<string[]>([]);
  const [islasPorProvincia, setIslasPorProvincia] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const primeraCarga = useRef(true);

  useEffect(() => {
    if (primeraCarga.current) {
      primeraCarga.current = false;
      return;
    }
    if (comunidadAutonoma && provincia) {
      onProvinciaChange('');
    }
  }, [comunidadAutonoma, onProvinciaChange, provincia]);

  useEffect(() => {
    if (!comunidadAutonoma) {
      setProvincias([]);
      setIslasPorProvincia({});
      return;
    }

    const fetchProvincias = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/provincias/${encodeURIComponent(comunidadAutonoma)}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar provincias');
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data?.provincias)) {
          const items = data.data.provincias.map((p: any) =>
            typeof p === 'string' ? { nombre: p } : p
          );
          setProvincias(items.map((p: any) => p.nombre));
          setIslasPorProvincia(
            items.reduce((acc: Record<string, string[]>, p: any) => {
              if (p.islas) acc[p.nombre] = p.islas;
              return acc;
            }, {})
          );
        } else {
          setProvincias([]);
          setIslasPorProvincia({});
        }
      } catch (err) {
        console.error('Error fetching provincias:', err);
        setError('No se pudieron cargar las provincias');
        setProvincias([]);
        setIslasPorProvincia({});
      } finally {
        setLoading(false);
      }
    };

    fetchProvincias();
  }, [comunidadAutonoma]);

  // Si no hay comunidad seleccionada, mostrar input de texto libre
  if (!comunidadAutonoma) {
    return (
      <input
        id={id}
        type="text"
        value={provincia}
        onChange={(e) => onProvinciaChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all border-black focus:border-orange-500 hover:border-orange-500 ${className}`}
        aria-label="Provincia (opcional)"
      />
    );
  }

  // Si hay comunidad, mostrar select con provincias
  return (
    <div className="space-y-1">
      <div className="relative">
        <select
          id={id}
          value={provincia}
          onChange={(e) => onProvinciaChange(e.target.value)}
          disabled={disabled || loading}
          className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all border-black focus:border-orange-500 hover:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
          aria-label="Provincia (opcional)"
          aria-busy={loading}
        >
          <option value="">{placeholder}</option>
        {provincias.flatMap((prov) => [
          <option key={prov} value={prov}>
            {prov}
          </option>,
          ...(islasPorProvincia[prov] || []).map((isla) => (
            <option key={`${prov}-${isla}`} value={isla}>
              &nbsp;&nbsp;{isla}
            </option>
          ))
        ])}
        </select>
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>

    </div>
  );
}
