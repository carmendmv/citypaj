export function normalizarCategoria(valor: string): string {

  return valor

    .toLowerCase()

    .normalize('NFD')

    .replace(/[\u0300-\u036f]/g, '')

    .trim();

}



export const CATEGORIAS_CULTURA = [

  'cultura',

  'cultura / evento',

  'cultura/evento',

  'evento',

  'eventos',

  'evento cultural',

  'concierto',

  'conciertos',

  'taller',

  'talleres',

  'ocio cultural',

  'plan cultural',

  'planes culturales',

  'quedada',

  'quedadas',

  'cultura y ocio',

];



export function esCategoriaCultura(categoria: string): boolean {

  const normalizada = normalizarCategoria(categoria);

  const normalizadas = CATEGORIAS_CULTURA.map(normalizarCategoria);

  return normalizadas.includes(normalizada);

}

