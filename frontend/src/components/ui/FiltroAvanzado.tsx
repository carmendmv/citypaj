'use client';

import { useState } from 'react';

interface FiltroAvanzadoProps {
  onFiltroChange: (filtros: FiltrosAvanzados) => void;
  categoriaInicial?: string;
}

interface FiltrosAvanzados {
  categoria: string;
  comunidad_autonoma: string;
  provincia: string;
  modalidad: string;
  precio_min: string;
  precio_max: string;
  orden: string;
  buscar: string;
}

const CATEGORIAS = [
  { value: '', label: 'Todas las categorías' },
  { value: 'ocio', label: 'Ocio' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'educacion', label: 'Formación' },
  { value: 'empleo', label: 'Empleo' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'salud', label: 'Salud' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'otros', label: 'Otros' }
];

const COMUNIDADES = [
  { value: '', label: 'Todas las comunidades' },
  { value: 'Andalucía', label: 'Andalucía' },
  { value: 'Aragón', label: 'Aragón' },
  { value: 'Asturias', label: 'Asturias' },
  { value: 'Baleares', label: 'Baleares' },
  { value: 'Canarias', label: 'Canarias' },
  { value: 'Cantabria', label: 'Cantabria' },
  { value: 'Castilla-La Mancha', label: 'Castilla-La Mancha' },
  { value: 'Castilla y León', label: 'Castilla y León' },
  { value: 'Cataluña', label: 'Cataluña' },
  { value: 'Comunidad Valenciana', label: 'Comunidad Valenciana' },
  { value: 'Extremadura', label: 'Extremadura' },
  { value: 'Galicia', label: 'Galicia' },
  { value: 'Madrid', label: 'Madrid' },
  { value: 'Murcia', label: 'Murcia' },
  { value: 'Navarra', label: 'Navarra' },
  { value: 'País Vasco', label: 'País Vasco' },
  { value: 'La Rioja', label: 'La Rioja' }
];

const MODALIDADES = [
  { value: '', label: 'Todas las modalidades' },
  { value: 'venta', label: 'Venta' },
  { value: 'regalo', label: 'Regalo' },
  { value: 'intercambio', label: 'Intercambio' },
  { value: 'servicio', label: 'Servicio' }
];

const ORDENES = [
  { value: 'fecha_desc', label: 'Más recientes primero' },
  { value: 'fecha_asc', label: 'Más antiguos primero' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' }
];

export default function FiltroAvanzado({ onFiltroChange, categoriaInicial }: FiltroAvanzadoProps) {
  const [filtros, setFiltros] = useState<FiltrosAvanzados>({
    categoria: categoriaInicial || '',
    comunidad_autonoma: '',
    provincia: '',
    modalidad: '',
    precio_min: '',
    precio_max: '',
    orden: 'fecha_desc',
    buscar: ''
  });

  const handleFiltroChange = (key: keyof FiltrosAvanzados, value: string) => {
    const nuevosFiltros = { ...filtros, [key]: value };
    setFiltros(nuevosFiltros);
    onFiltroChange(nuevosFiltros);
  };

  const limpiarFiltros = () => {
    const filtrosLimpios = {
      categoria: categoriaInicial || '',
      comunidad_autonoma: '',
      provincia: '',
      modalidad: '',
      precio_min: '',
      precio_max: '',
      orden: 'fecha_desc',
      buscar: ''
    };
    setFiltros(filtrosLimpios);
    onFiltroChange(filtrosLimpios);
  };

  return (
    <div className="border border-black p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif text-lg font-bold text-black">Filtros avanzados</h3>
        <button
          onClick={limpiarFiltros}
          className="font-sans text-sm text-black hover:text-orange-500 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div className="lg:col-span-3">
          <label className="block font-sans text-sm text-gray-700 mb-1">
            Búsqueda
          </label>
          <input
            type="text"
            placeholder="Buscar en títulos y descripciones..."
            value={filtros.buscar}
            onChange={(e) => handleFiltroChange('buscar', e.target.value)}
            className="w-full border border-black px-3 py-2 font-sans text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block font-sans text-sm text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={filtros.categoria}
            onChange={(e) => handleFiltroChange('categoria', e.target.value)}
            className="w-full border border-black px-3 py-2 font-sans text-sm focus:outline-none focus:border-orange-500"
          >
            {CATEGORIAS.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Comunidad Autónoma */}
        <div>
          <label className="block font-sans text-sm text-gray-700 mb-1">
            Comunidad Autónoma
          </label>
          <select
            value={filtros.comunidad_autonoma}
            onChange={(e) => handleFiltroChange('comunidad_autonoma', e.target.value)}
            className="w-full border border-black px-3 py-2 font-sans text-sm focus:outline-none focus:border-orange-500"
          >
            {COMUNIDADES.map(com => (
              <option key={com.value} value={com.value}>
                {com.label}
              </option>
            ))}
          </select>
        </div>

        {/* Provincia */}
        <div>
          <label className="block font-sans text-sm text-gray-700 mb-1">
            Provincia
          </label>
          <input
            type="text"
            placeholder="Ej: Madrid, Barcelona..."
            value={filtros.provincia}
            onChange={(e) => handleFiltroChange('provincia', e.target.value)}
            className="w-full border border-black px-3 py-2 font-sans text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Modalidad */}
        <div>
          <label className="block font-sans text-sm text-gray-700 mb-1">
            Modalidad
          </label>
          <select
            value={filtros.modalidad}
            onChange={(e) => handleFiltroChange('modalidad', e.target.value)}
            className="w-full border border-black px-3 py-2 font-sans text-sm focus:outline-none focus:border-orange-500"
          >
            {MODALIDADES.map(mod => (
              <option key={mod.value} value={mod.value}>
                {mod.label}
              </option>
            ))}
          </select>
        </div>

        {/* Precio mínimo */}
        <div>
          <label className="block font-sans text-sm text-gray-700 mb-1">
            Precio mínimo
          </label>
          <input
            type="number"
            placeholder="0"
            min="0"
            value={filtros.precio_min}
            onChange={(e) => handleFiltroChange('precio_min', e.target.value)}
            className="w-full border border-black px-3 py-2 font-sans text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block font-sans text-sm text-gray-700 mb-1">
            Precio máximo
          </label>
          <input
            type="number"
            placeholder="Sin límite"
            min="0"
            value={filtros.precio_max}
            onChange={(e) => handleFiltroChange('precio_max', e.target.value)}
            className="w-full border border-black px-3 py-2 font-sans text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Ordenamiento */}
        <div>
          <label className="block font-sans text-sm text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            value={filtros.orden}
            onChange={(e) => handleFiltroChange('orden', e.target.value)}
            className="w-full border border-black px-3 py-2 font-sans text-sm focus:outline-none focus:border-orange-500"
          >
            {ORDENES.map(ord => (
              <option key={ord.value} value={ord.value}>
                {ord.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
