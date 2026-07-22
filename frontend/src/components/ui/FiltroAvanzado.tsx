'use client';

import { useState } from 'react';

interface FiltroAvanzadoProps {
  onFiltroChange: (filtros: FiltrosAvanzados) => void;
  categoriaInicial?: string;
  ocultarPrecio?: boolean;
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

const PROVINCIAS_POR_COMUNIDAD: Record<string, Array<{value: string, label: string}>> = {
  'Andalucía': [
    { value: 'Almería', label: 'Almería' },
    { value: 'Cádiz', label: 'Cádiz' },
    { value: 'Córdoba', label: 'Córdoba' },
    { value: 'Granada', label: 'Granada' },
    { value: 'Huelva', label: 'Huelva' },
    { value: 'Jaén', label: 'Jaén' },
    { value: 'Málaga', label: 'Málaga' },
    { value: 'Sevilla', label: 'Sevilla' }
  ],
  'Aragón': [
    { value: 'Huesca', label: 'Huesca' },
    { value: 'Teruel', label: 'Teruel' },
    { value: 'Zaragoza', label: 'Zaragoza' }
  ],
  'Asturias': [
    { value: 'Asturias', label: 'Asturias' }
  ],
  'Baleares': [
    { value: 'Baleares', label: 'Baleares' }
  ],
  'Canarias': [
    { value: 'Las Palmas', label: 'Las Palmas' },
    { value: 'Santa Cruz de Tenerife', label: 'Santa Cruz de Tenerife' }
  ],
  'Cantabria': [
    { value: 'Cantabria', label: 'Cantabria' }
  ],
  'Castilla-La Mancha': [
    { value: 'Albacete', label: 'Albacete' },
    { value: 'Ciudad Real', label: 'Ciudad Real' },
    { value: 'Cuenca', label: 'Cuenca' },
    { value: 'Guadalajara', label: 'Guadalajara' },
    { value: 'Toledo', label: 'Toledo' }
  ],
  'Castilla y León': [
    { value: 'Ávila', label: 'Ávila' },
    { value: 'Burgos', label: 'Burgos' },
    { value: 'León', label: 'León' },
    { value: 'Palencia', label: 'Palencia' },
    { value: 'Salamanca', label: 'Salamanca' },
    { value: 'Segovia', label: 'Segovia' },
    { value: 'Soria', label: 'Soria' },
    { value: 'Valladolid', label: 'Valladolid' },
    { value: 'Zamora', label: 'Zamora' }
  ],
  'Cataluña': [
    { value: 'Barcelona', label: 'Barcelona' },
    { value: 'Girona', label: 'Girona' },
    { value: 'Lleida', label: 'Lleida' },
    { value: 'Tarragona', label: 'Tarragona' }
  ],
  'Comunidad Valenciana': [
    { value: 'Alicante', label: 'Alicante' },
    { value: 'Castellón', label: 'Castellón' },
    { value: 'Valencia', label: 'Valencia' }
  ],
  'Extremadura': [
    { value: 'Badajoz', label: 'Badajoz' },
    { value: 'Cáceres', label: 'Cáceres' }
  ],
  'Galicia': [
    { value: 'A Coruña', label: 'A Coruña' },
    { value: 'Lugo', label: 'Lugo' },
    { value: 'Ourense', label: 'Ourense' },
    { value: 'Pontevedra', label: 'Pontevedra' }
  ],
  'Madrid': [
    { value: 'Madrid', label: 'Madrid' }
  ],
  'Murcia': [
    { value: 'Murcia', label: 'Murcia' }
  ],
  'Navarra': [
    { value: 'Navarra', label: 'Navarra' }
  ],
  'País Vasco': [
    { value: 'Álava', label: 'Álava' },
    { value: 'Guipúzcoa', label: 'Guipúzcoa' },
    { value: 'Vizcaya', label: 'Vizcaya' }
  ],
  'La Rioja': [
    { value: 'La Rioja', label: 'La Rioja' }
  ]
};

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

export default function FiltroAvanzado({ onFiltroChange, categoriaInicial, ocultarPrecio = false }: FiltroAvanzadoProps) {
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
    let nuevosFiltros = { ...filtros, [key]: value };
    
    // Si cambia la comunidad autónoma, limpiar la provincia
    if (key === 'comunidad_autonoma') {
      nuevosFiltros.provincia = '';
    }
    
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

  const handleBuscar = () => {
    onFiltroChange(filtros);
  };

  return (
    <div className="border border-black p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif text-lg font-bold text-black">Filtros</h3>
        <button
          onClick={limpiarFiltros}
          className="font-sans text-sm text-black hover:text-orange-500 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-8 py-4">
          {/* Categoría */}
          <div className="flex flex-col">
            <label className="font-sans text-xs text-gray-600 mb-1">Categoría</label>
            <select
              value={filtros.categoria}
              onChange={(e) => handleFiltroChange('categoria', e.target.value)}
              className="border border-black px-4 py-2 font-sans text-sm focus:outline-none focus:border-orange-500 min-w-40"
            >
              {CATEGORIAS.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Comunidad Autónoma */}
          <div className="flex flex-col">
            <label className="font-sans text-xs text-gray-600 mb-1">Comunidad</label>
            <select
              value={filtros.comunidad_autonoma}
              onChange={(e) => handleFiltroChange('comunidad_autonoma', e.target.value)}
              className="border border-black px-4 py-2 font-sans text-sm focus:outline-none focus:border-orange-500 min-w-48"
            >
              {COMUNIDADES.map(com => (
                <option key={com.value} value={com.value}>
                  {com.label}
                </option>
              ))}
            </select>
          </div>

          {/* Provincia */}
          <div className="flex flex-col">
            <label className="font-sans text-xs text-gray-600 mb-1">Selecciona provincia</label>
            <select
              value={filtros.provincia}
              onChange={(e) => handleFiltroChange('provincia', e.target.value)}
              className="border border-black px-4 py-2 font-sans text-sm focus:outline-none focus:border-orange-500 min-w-40"
              disabled={!filtros.comunidad_autonoma}
            >
              <option value="">Selecciona provincia</option>
              {filtros.comunidad_autonoma && PROVINCIAS_POR_COMUNIDAD[filtros.comunidad_autonoma]?.map(prov => (
                <option key={prov.value} value={prov.value}>
                  {prov.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenamiento */}
          <div className="flex flex-col">
            <label className="font-sans text-xs text-gray-600 mb-1">Ordenar por</label>
            <select
              value={filtros.orden}
              onChange={(e) => handleFiltroChange('orden', e.target.value)}
              className="border border-black px-4 py-2 font-sans text-sm focus:outline-none focus:border-orange-500 min-w-48"
            >
              {ORDENES.map(ord => (
                <option key={ord.value} value={ord.value}>
                  {ord.label}
                </option>
              ))}
            </select>
          </div>

          {/* Espacio flexible para separar el botón */}
          <div className="flex-grow"></div>

          {/* Botón de búsqueda */}
          <div className="flex flex-col justify-end">
            <label className="font-sans text-xs text-gray-600 mb-1 invisible">&nbsp;</label>
            <button
              onClick={handleBuscar}
              className="bg-black text-white px-8 py-2 font-sans text-sm hover:bg-white hover:text-black border border-black hover:border-black transition-colors whitespace-nowrap"
            >
              Buscar
            </button>
          </div>
        </div>
    </div>
  );
}
