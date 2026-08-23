export interface Provincia {
  id: string;
  nombre: string;
  islas?: string[];
}

export interface ComunidadAutonoma {
  id: string;
  nombre: string;
  tipo: 'comunidad_autonoma' | 'ciudad_autonoma';
  provincias: Provincia[];
}

export const TERRITORIOS_ESPANA: ComunidadAutonoma[] = [
  {
    id: 'andalucia',
    nombre: 'Andalucía',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'almeria', nombre: 'Almería' },
      { id: 'cadiz', nombre: 'Cádiz' },
      { id: 'cordoba', nombre: 'Córdoba' },
      { id: 'granada', nombre: 'Granada' },
      { id: 'huelva', nombre: 'Huelva' },
      { id: 'jaen', nombre: 'Jaén' },
      { id: 'malaga', nombre: 'Málaga' },
      { id: 'sevilla', nombre: 'Sevilla' }
    ]
  },
  {
    id: 'aragon',
    nombre: 'Aragón',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'huesca', nombre: 'Huesca' },
      { id: 'teruel', nombre: 'Teruel' },
      { id: 'zaragoza', nombre: 'Zaragoza' }
    ]
  },
  {
    id: 'principado-de-asturias',
    nombre: 'Principado de Asturias',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'asturias', nombre: 'Asturias' }
    ]
  },
  {
    id: 'illes-balears',
    nombre: 'Illes Balears',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'illes-balears', nombre: 'Illes Balears', islas: ['Mallorca', 'Menorca', 'Ibiza/Eivissa', 'Formentera', 'Cabrera'] }
    ]
  },
  {
    id: 'canarias',
    nombre: 'Canarias',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'las-palmas', nombre: 'Las Palmas', islas: ['Gran Canaria', 'Lanzarote', 'Fuerteventura', 'La Graciosa'] },
      { id: 'santa-cruz-de-tenerife', nombre: 'Santa Cruz de Tenerife', islas: ['Tenerife', 'La Palma', 'La Gomera', 'El Hierro'] }
    ]
  },
  {
    id: 'cantabria',
    nombre: 'Cantabria',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'cantabria', nombre: 'Cantabria' }
    ]
  },
  {
    id: 'castilla-la-mancha',
    nombre: 'Castilla-La Mancha',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'albacete', nombre: 'Albacete' },
      { id: 'ciudad-real', nombre: 'Ciudad Real' },
      { id: 'cuenca', nombre: 'Cuenca' },
      { id: 'guadalajara', nombre: 'Guadalajara' },
      { id: 'toledo', nombre: 'Toledo' }
    ]
  },
  {
    id: 'castilla-y-leon',
    nombre: 'Castilla y León',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'avila', nombre: 'Ávila' },
      { id: 'burgos', nombre: 'Burgos' },
      { id: 'leon', nombre: 'León' },
      { id: 'palencia', nombre: 'Palencia' },
      { id: 'salamanca', nombre: 'Salamanca' },
      { id: 'segovia', nombre: 'Segovia' },
      { id: 'soria', nombre: 'Soria' },
      { id: 'valladolid', nombre: 'Valladolid' },
      { id: 'zamora', nombre: 'Zamora' }
    ]
  },
  {
    id: 'cataluna',
    nombre: 'Cataluña',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'barcelona', nombre: 'Barcelona' },
      { id: 'girona', nombre: 'Girona' },
      { id: 'lleida', nombre: 'Lleida' },
      { id: 'tarragona', nombre: 'Tarragona' }
    ]
  },
  {
    id: 'comunitat-valenciana',
    nombre: 'Comunitat Valenciana',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'alicante-alacant', nombre: 'Alicante/Alacant' },
      { id: 'castellon-castello', nombre: 'Castellón/Castelló' },
      { id: 'valencia-valencia', nombre: 'Valencia/València' }
    ]
  },
  {
    id: 'extremadura',
    nombre: 'Extremadura',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'badajoz', nombre: 'Badajoz' },
      { id: 'caceres', nombre: 'Cáceres' }
    ]
  },
  {
    id: 'galicia',
    nombre: 'Galicia',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'a-coruna', nombre: 'A Coruña' },
      { id: 'lugo', nombre: 'Lugo' },
      { id: 'ourense', nombre: 'Ourense' },
      { id: 'pontevedra', nombre: 'Pontevedra' }
    ]
  },
  {
    id: 'comunidad-de-madrid',
    nombre: 'Comunidad de Madrid',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'madrid', nombre: 'Madrid' }
    ]
  },
  {
    id: 'region-de-murcia',
    nombre: 'Región de Murcia',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'murcia', nombre: 'Murcia' }
    ]
  },
  {
    id: 'comunidad-foral-de-navarra',
    nombre: 'Comunidad Foral de Navarra',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'navarra', nombre: 'Navarra' }
    ]
  },
  {
    id: 'pais-vasco-euskadi',
    nombre: 'País Vasco / Euskadi',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'alava-araba', nombre: 'Álava/Araba' },
      { id: 'bizkaia', nombre: 'Bizkaia' },
      { id: 'gipuzkoa', nombre: 'Gipuzkoa' }
    ]
  },
  {
    id: 'la-rioja',
    nombre: 'La Rioja',
    tipo: 'comunidad_autonoma',
    provincias: [
      { id: 'la-rioja', nombre: 'La Rioja' }
    ]
  },
  {
    id: 'ceuta',
    nombre: 'Ceuta',
    tipo: 'ciudad_autonoma',
    provincias: [
      { id: 'ceuta', nombre: 'Ceuta' }
    ]
  },
  {
    id: 'melilla',
    nombre: 'Melilla',
    tipo: 'ciudad_autonoma',
    provincias: [
      { id: 'melilla', nombre: 'Melilla' }
    ]
  }
];

export function getComunidades(): ComunidadAutonoma[] {
  return TERRITORIOS_ESPANA;
}

export function getComunidadById(id: string): ComunidadAutonoma | undefined {
  return TERRITORIOS_ESPANA.find(c => c.id === id);
}

export function getComunidadByNombre(nombre: string): ComunidadAutonoma | undefined {
  return TERRITORIOS_ESPANA.find(c => c.nombre.toLowerCase() === nombre.toLowerCase());
}

export function getProvincias(comunidadId: string): Provincia[] {
  return getComunidadById(comunidadId)?.provincias ?? [];
}

export function getProvinciaById(comunidadId: string, provinciaId: string): Provincia | undefined {
  return getProvincias(comunidadId).find(p => p.id === provinciaId);
}

export function validarTerritorio(comunidadId?: string, provinciaId?: string): { valido: boolean; error?: string } {
  if (!comunidadId) {
    return { valido: false, error: 'Debes seleccionar una comunidad autónoma' };
  }

  const comunidad = getComunidadById(comunidadId);
  if (!comunidad) {
    return { valido: false, error: 'La comunidad autónoma seleccionada no existe' };
  }

  if (!provinciaId) {
    return { valido: false, error: 'Debes seleccionar una provincia' };
  }

  const provincia = getProvinciaById(comunidadId, provinciaId);
  if (!provincia) {
    return { valido: false, error: 'La provincia no pertenece a la comunidad seleccionada' };
  }

  return { valido: true };
}
