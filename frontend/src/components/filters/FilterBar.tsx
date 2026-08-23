'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { COMUNIDADES, PROVINCIAS_POR_COMUNIDAD, PROVINCIA_NORMALIZACION } from '@/lib/provinces';

const CATEGORIAS = [
  { value: 'ocio', label: 'Ocio' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'formacion', label: 'Formación' },
  { value: 'empleo', label: 'Empleo' },
  { value: 'comunidad', label: 'Comunidad' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'salud', label: 'Salud' },
  { value: 'tecnología', label: 'Tecnología' },
  { value: 'otros', label: 'Otros' }
];

const OPCIONES_ORDENAR = [
  { value: 'creado-desc', label: 'Más recientes primero' },
  { value: 'creado-asc', label: 'Más antiguos primero' },
  { value: 'titulo-asc', label: 'Título A-Z' },
  { value: 'titulo-desc', label: 'Título Z-A' },
  { value: 'vistas-desc', label: 'Más vistos' }
];

interface FilterBarProps {
  onFiltersChange: (filters: {
    categoria?: string;
    comunidad?: string;
    provincia?: string;
    ordenar?: string;
    busqueda?: string;
  }) => void;
  initialFilters?: {
    categoria?: string;
    comunidad?: string;
    provincia?: string;
    ordenar?: string;
    busqueda?: string;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  onFiltersChange, 
  initialFilters = {} 
}) => {
  const [categoria, setCategoria] = useState(initialFilters.categoria || '');
  const [comunidad, setComunidad] = useState(initialFilters.comunidad || '');
  const [provincia, setProvincia] = useState(initialFilters.provincia || '');
  const [ordenar, setOrdenar] = useState(initialFilters.ordenar || 'creado-desc');
  const [busqueda, setBusqueda] = useState(initialFilters.busqueda || '');

  const [provinciasDisponibles, setProvinciasDisponibles] = useState<string[]>([]);

  // Actualizar provincias cuando cambia la comunidad
  useEffect(() => {
    if (comunidad && PROVINCIAS_POR_COMUNIDAD[comunidad]) {
      setProvinciasDisponibles(PROVINCIAS_POR_COMUNIDAD[comunidad]);
      // Resetear provincia si no está en la nueva comunidad
      if (!PROVINCIAS_POR_COMUNIDAD[comunidad].includes(provincia)) {
        setProvincia('');
      }
    } else {
      setProvinciasDisponibles([]);
      setProvincia('');
    }
  }, [comunidad, provincia]);

  const handleSearch = () => {
    const filters = {
      categoria: categoria || undefined,
      comunidad: comunidad || undefined,
      provincia: (provincia ? PROVINCIA_NORMALIZACION[provincia] || provincia : undefined) || undefined,
      ordenar: ordenar || undefined,
      busqueda: busqueda || undefined
    };
    onFiltersChange(filters);
  };

  const handleClearFilters = () => {
    setCategoria('');
    setComunidad('');
    setProvincia('');
    setOrdenar('creado-desc');
    setBusqueda('');
    onFiltersChange({});
  };

  return (
    <div className="bg-white border border-black p-6 mb-8">
      {/* Título y Limpiar filtros */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl font-bold text-black">Filtros</h2>
        <button
          onClick={handleClearFilters}
          className="font-sans text-sm text-black hover:text-orange-500 underline"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Fila de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        {/* Categoría */}
        <div>
          <label className="block font-sans text-xs text-gray-600 mb-2">
            Categoría
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
          >
            <option value="">Todas</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Comunidad */}
        <div>
          <label className="block font-sans text-xs text-gray-600 mb-2">
            Comunidad
          </label>
          <select
            value={comunidad}
            onChange={(e) => setComunidad(e.target.value)}
            className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
          >
            <option value="">Todas</option>
            {COMUNIDADES.map((com) => (
              <option key={com} value={com}>
                {com}
              </option>
            ))}
          </select>
        </div>

        {/* Provincia */}
        <div>
          <label className="block font-sans text-xs text-gray-600 mb-2">
            Provincia
          </label>
          <select
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            disabled={!comunidad || provinciasDisponibles.length === 0}
            className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="">
              {comunidad ? 'Selecciona provincia' : 'Selecciona comunidad primero'}
            </option>
            {provinciasDisponibles.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenar por */}
        <div>
          <label className="block font-sans text-xs text-gray-600 mb-2">
            Ordenar por
          </label>
          <select
            value={ordenar}
            onChange={(e) => setOrdenar(e.target.value)}
            className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
          >
            {OPCIONES_ORDENAR.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botón Buscar */}
        <div>
          <button
            onClick={handleSearch}
            className="w-full bg-black text-white border border-black px-4 py-2 text-sm font-sans hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>
        </div>
      </div>

      {/* Campo de búsqueda adicional */}
      <div className="mt-4">
        <label className="block font-sans text-xs text-gray-600 mb-2">
          Búsqueda por texto
        </label>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Buscar en título o descripción..."
          className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
        />
      </div>
    </div>
  );
};
