'use client';

import React, { useState, useEffect } from 'react';
import { useComunidad } from '@/hooks/useComunidad';

interface FiltrosAvanzadosProps {
  categoria?: string;
  onFiltrosChange: (filtros: {
    comunidad_autonoma?: string;
    provincia?: string;
    orden?: string;
    destacados?: boolean;
  }) => void;
}

const COMUNIDADES_AUTONOMAS = [
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
  'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña',
  'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid',
  'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
];

const PROVINCIAS_POR_COMUNIDAD: Record<string, string[]> = {
  'Andalucía': ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'],
  'Aragón': ['Huesca', 'Teruel', 'Zaragoza'],
  'Asturias': ['Asturias'],
  'Baleares': ['Baleares'],
  'Canarias': ['Las Palmas', 'Santa Cruz de Tenerife'],
  'Cantabria': ['Cantabria'],
  'Castilla-La Mancha': ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'],
  'Castilla y León': ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'],
  'Cataluña': ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
  'Comunidad Valenciana': ['Alicante', 'Castellón', 'Valencia'],
  'Extremadura': ['Badajoz', 'Cáceres'],
  'Galicia': ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
  'Madrid': ['Madrid'],
  'Murcia': ['Murcia'],
  'Navarra': ['Navarra'],
  'País Vasco': ['Álava', 'Guipúzcoa', 'Vizcaya'],
  'La Rioja': ['La Rioja']
};

const OPCIONES_ORDEN = [
  { value: 'fecha_desc', label: 'Más recientes primero' },
  { value: 'fecha_asc', label: 'Más antiguos primero' },
  { value: 'titulo_asc', label: 'Título (A-Z)' },
  { value: 'titulo_desc', label: 'Título (Z-A)' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' }
];

export default function FiltrosAvanzados({ categoria, onFiltrosChange }: FiltrosAvanzadosProps) {
  const { comunidadAutonoma, setComunidadAutonoma } = useComunidad();
  const [comunidadSeleccionada, setComunidadSeleccionada] = useState(comunidadAutonoma || '');
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
  const [ordenSeleccionado, setOrdenSeleccionado] = useState('fecha_desc');
  const [soloDestacados, setSoloDestacados] = useState(false);

  useEffect(() => {
    setComunidadSeleccionada(comunidadAutonoma || '');
  }, [comunidadAutonoma]);

  useEffect(() => {
    const filtros = {
      comunidad_autonoma: comunidadSeleccionada || undefined,
      provincia: provinciaSeleccionada || undefined,
      orden: ordenSeleccionado,
      destacados: soloDestacados || undefined
    };
    onFiltrosChange(filtros);
  }, [comunidadSeleccionada, provinciaSeleccionada, ordenSeleccionado, soloDestacados, onFiltrosChange]);

  const handleComunidadChange = (comunidad: string) => {
    setComunidadSeleccionada(comunidad);
    setProvinciaSeleccionada(''); // Reset provincia cuando cambia comunidad
    setComunidadAutonoma(comunidad);
  };

  const handleProvinciaChange = (provincia: string) => {
    setProvinciaSeleccionada(provincia);
  };

  const handleLimpiarFiltros = () => {
    setComunidadSeleccionada('');
    setProvinciaSeleccionada('');
    setOrdenSeleccionado('fecha_desc');
    setSoloDestacados(false);
    setComunidadAutonoma('');
  };

  const provinciasDisponibles = comunidadSeleccionada ? PROVINCIAS_POR_COMUNIDAD[comunidadSeleccionada] || [] : [];

  return (
    <div className="border border-black bg-white p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-bold text-black">Filtros Avanzados</h3>
        <button
          onClick={handleLimpiarFiltros}
          className="px-3 py-1 text-sm font-sans text-gray-600 hover:text-black border border-gray-300 hover:border-gray-400 rounded-md transition-all duration-200"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por Comunidad Autónoma */}
        <div>
          <label className="block font-sans text-xs text-gray-600 mb-2">
            Comunidad Autónoma
          </label>
          <select
            value={comunidadSeleccionada}
            onChange={(e) => handleComunidadChange(e.target.value)}
            className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500 hover:border-orange-500 transition-all"
          >
            <option value="">Todas las comunidades</option>
            {COMUNIDADES_AUTONOMAS.map((comunidad) => (
              <option key={comunidad} value={comunidad}>
                {comunidad}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Provincia */}
        <div>
          <label className="block font-sans text-xs text-gray-600 mb-2">
            Provincia
          </label>
          <select
            value={provinciaSeleccionada}
            onChange={(e) => handleProvinciaChange(e.target.value)}
            disabled={!comunidadSeleccionada}
            className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500 hover:border-orange-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {comunidadSeleccionada ? 'Todas las provincias' : 'Selecciona una comunidad'}
            </option>
            {provinciasDisponibles.map((provincia) => (
              <option key={provincia} value={provincia}>
                {provincia}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Orden */}
        <div>
          <label className="block font-sans text-xs text-gray-600 mb-2">
            Ordenar por
          </label>
          <select
            value={ordenSeleccionado}
            onChange={(e) => setOrdenSeleccionado(e.target.value)}
            className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500 hover:border-orange-500 transition-all"
          >
            {OPCIONES_ORDEN.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Destacados */}
        <div>
          <label className="block font-sans text-xs text-gray-600 mb-2">
            Tipo de anuncio
          </label>
          <div className="flex items-center h-10">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={soloDestacados}
                onChange={(e) => setSoloDestacados(e.target.checked)}
                className="mr-2 w-4 h-4 text-orange-500 border-black rounded focus:ring-orange-500 focus:border-orange-500"
              />
              <span className="text-sm font-sans text-black">
                Solo destacados
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Resumen de filtros activos */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {comunidadSeleccionada && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {comunidadSeleccionada}
            </span>
          )}
          {provinciaSeleccionada && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {provinciaSeleccionada}
            </span>
          )}
          {soloDestacados && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Destacados
            </span>
          )}
          {categoria && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {categoria}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
