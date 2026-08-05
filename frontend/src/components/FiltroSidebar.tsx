'use client';

import React, { useState } from 'react';
import { FunnelIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { FiltroSidebarProps, Categoria, Comunidad } from '../types';
import { TERRITORIOS_ESPANA } from '../data/territorios';

const COMUNIDADES_ESPANA: Comunidad[] = TERRITORIOS_ESPANA.map(({ id, nombre, provincias }) => ({ id, nombre, provincias }));

const CATEGORIAS: Categoria[] = [
  {
    id: 'educacion',
    nombre: 'Educación y Formación',
    subcategorias: [
      { id: 'clases', nombre: 'Clases particulares' },
      { id: 'cursos', nombre: 'Cursos' },
      { id: 'idiomas', nombre: 'Idiomas' },
      { id: 'musica', nombre: 'Música' },
    ],
  },
  {
    id: 'empleo',
    nombre: 'Empleo',
    subcategorias: [
      { id: 'ofertas', nombre: 'Ofertas de trabajo' },
      { id: 'busco', nombre: 'Busco trabajo' },
      { id: 'practicas', nombre: 'Prácticas' },
      { id: 'freelance', nombre: 'Freelance' },
    ],
  },
  {
    id: 'vivienda',
    nombre: 'Vivienda',
    subcategorias: [
      { id: 'alquiler', nombre: 'Alquiler' },
      { id: 'compra', nombre: 'Compra' },
      { id: 'compartir', nombre: 'Compartir piso' },
      { id: 'habitacion', nombre: 'Habitación' },
    ],
  },
  {
    id: 'ocio',
    nombre: 'Ocio y Tiempo Libre',
    subcategorias: [
      { id: 'eventos', nombre: 'Eventos' },
      { id: 'deportes', nombre: 'Deportes' },
      { id: 'viajes', nombre: 'Viajes' },
      { id: 'hobbies', nombre: 'Hobbies' },
    ],
  },
  {
    id: 'servicios',
    nombre: 'Servicios',
    subcategorias: [
      { id: 'reparaciones', nombre: 'Reparaciones' },
      { id: 'transporte', nombre: 'Transporte' },
      { id: 'informatica', nombre: 'Informática' },
      { id: 'otros', nombre: 'Otros servicios' },
    ],
  },
  {
    id: 'intercambios',
    nombre: 'Intercambios y Trueques',
    subcategorias: [
      { id: 'objetos', nombre: 'Objetos' },
      { id: 'servicios', nombre: 'Servicios' },
      { id: 'habilidades', nombre: 'Habilidades' },
    ],
  },
];

const MODALIDADES = [
  { id: 'venta', nombre: 'Venta' },
  { id: 'regalo', nombre: 'Regalo' },
  { id: 'intercambio', nombre: 'Intercambio' },
  { id: 'servicio', nombre: 'Servicio' },
];

export const FiltroSidebar: React.FC<FiltroSidebarProps> = ({
  filtros,
  onFiltroChange,
  categorias = CATEGORIAS,
  comunidades = COMUNIDADES_ESPANA,
  isOpen = true,
  onToggle,
  className = '',
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['categoria', 'ubicacion', 'modalidad'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleFiltroChange = (key: string, value: any) => {
    onFiltroChange({
      ...filtros,
      [key]: value,
    });
  };

  const limpiarFiltros = () => {
    onFiltroChange({});
  };

  const tieneFiltrosActivos = Object.values(filtros).some(
    (value) => value !== undefined && value !== ''
  );

  const comunidadSeleccionada = comunidades.find(c => c.id === filtros.comunidad_autonoma);
  const provinciasDisponibles = comunidadSeleccionada?.provincias || [];

  const categoriaSeleccionada = categorias.find(c => c.id === filtros.categoria);
  const subcategoriasDisponibles = categoriaSeleccionada?.subcategorias || [];

  return (
    <div className={clsx('bg-white border-r border-gray-200', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          <h2 className="font-serif text-lg font-semibold text-gray-900">
            Filtros
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {tieneFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar
            </button>
          )}
          
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 text-gray-400 hover:text-gray-600 lg:hidden"
            >
              {isOpen ? <XMarkIcon className="w-5 h-5" /> : <FunnelIcon className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="p-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Categoría */}
        <div>
          <button
            onClick={() => toggleSection('categoria')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-gray-900">Categoría</h3>
            {expandedSections.has('categoria') ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.has('categoria') && (
            <div className="mt-3 space-y-3">
              <select
                value={filtros.categoria || ''}
                onChange={(e) => {
                  handleFiltroChange('categoria', e.target.value);
                  handleFiltroChange('subcategoria', ''); // Resetear subcategoría
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>

              {subcategoriasDisponibles.length > 0 && (
                <select
                  value={filtros.subcategoria || ''}
                  onChange={(e) => handleFiltroChange('subcategoria', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las subcategorías</option>
                  {subcategoriasDisponibles.map((subcategoria) => (
                    <option key={subcategoria.id} value={subcategoria.id}>
                      {subcategoria.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Ubicación */}
        <div>
          <button
            onClick={() => toggleSection('ubicacion')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-gray-900">Ubicación</h3>
            {expandedSections.has('ubicacion') ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.has('ubicacion') && (
            <div className="mt-3 space-y-3">
              <select
                value={filtros.comunidad_autonoma || ''}
                onChange={(e) => {
                  handleFiltroChange('comunidad_autonoma', e.target.value);
                  handleFiltroChange('provincia', ''); // Resetear provincia
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las comunidades</option>
                {comunidades.map((comunidad) => (
                  <option key={comunidad.id} value={comunidad.id}>
                    {comunidad.nombre}
                  </option>
                ))}
              </select>

              {provinciasDisponibles.length > 0 && (
                <select
                  value={filtros.provincia || ''}
                  onChange={(e) => handleFiltroChange('provincia', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las provincias</option>
                  {provinciasDisponibles.map((provincia) => (
                    <option key={provincia.id} value={provincia.id}>
                      {provincia.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Modalidad */}
        <div>
          <button
            onClick={() => toggleSection('modalidad')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-gray-900">Modalidad</h3>
            {expandedSections.has('modalidad') ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.has('modalidad') && (
            <div className="mt-3">
              <select
                value={filtros.modalidad || ''}
                onChange={(e) => handleFiltroChange('modalidad', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las modalidades</option>
                {MODALIDADES.map((modalidad) => (
                  <option key={modalidad.id} value={modalidad.id}>
                    {modalidad.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Precio */}
        <div>
          <button
            onClick={() => toggleSection('precio')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-gray-900">Precio</h3>
            {expandedSections.has('precio') ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.has('precio') && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Precio mínimo (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={filtros.precio_min || ''}
                  onChange={(e) => handleFiltroChange('precio_min', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Precio máximo (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={filtros.precio_max || ''}
                  onChange={(e) => handleFiltroChange('precio_max', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sin límite"
                />
              </div>
            </div>
          )}
        </div>

        {/* Opciones adicionales */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Opciones</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filtros.solo_con_fotos || false}
              onChange={(e) => handleFiltroChange('solo_con_fotos', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Solo anuncios con fotos
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FiltroSidebar;
