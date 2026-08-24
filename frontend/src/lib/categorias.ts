export function normalizarCategoria(valor: string): string {
  return (valor || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export const CATEGORIAS_ANUNCIOS: Record<string, string> = {
  empleo: 'Empleo',
  formacion: 'Formación',
  vivienda: 'Vivienda',
  servicios: 'Servicios',
  transporte: 'Transporte',
  salud: 'Salud',
  tecnologia: 'Tecnología',
  comunidad: 'Comunidad',
  ocio: 'Ocio',
  otros: 'Otros',
  cultura: 'Cultura'
};

export function getCategoriaLabel(categoria?: string): string {
  if (!categoria) return 'Otros';
  const key = normalizarCategoria(categoria);
  return CATEGORIAS_ANUNCIOS[key] || categoria.charAt(0).toUpperCase() + categoria.slice(1);
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

export function esCategoriaCultura(categoria?: string): boolean {
  const normalizada = normalizarCategoria(categoria || '');
  const normalizadas = CATEGORIAS_CULTURA.map(normalizarCategoria);
  return normalizadas.includes(normalizada);
}
