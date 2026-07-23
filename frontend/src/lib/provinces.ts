export const PROVINCIAS_POR_COMUNIDAD: Record<string, string[]> = {
  Andalucía: ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'],
  Aragón: ['Huesca', 'Teruel', 'Zaragoza'],
  Asturias: ['Asturias'],
  Baleares: ['Balears'],
  Canarias: ['Las Palmas', 'Santa Cruz de Tenerife'],
  Cantabria: ['Cantabria'],
  'Castilla-La Mancha': ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'],
  'Castilla y León': ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'],
  Cataluña: ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
  'Comunidad Valenciana': ['Alicante', 'Castellón', 'Valencia'],
  Extremadura: ['Badajoz', 'Cáceres'],
  Galicia: ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
  Madrid: ['Madrid'],
  Murcia: ['Murcia'],
  Navarra: ['Navarra'],
  'País Vasco': ['Álava', 'Guipúzcoa', 'Vizcaya'],
  'La Rioja': ['La Rioja'],
};

export const COMUNIDADES = Object.keys(PROVINCIAS_POR_COMUNIDAD);
