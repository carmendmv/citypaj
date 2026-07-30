export const TEMAS_COMUNIDAD = [
  'Empleo', 'Formación', 'Vivienda', 'Cultura', 'Ocio', 'Transporte',
  'Ayudas', 'Salud mental', 'Participación ciudadana', 'Voluntariado',
  'Problemas de la ciudad', 'Propuestas de mejora', 'Dudas generales'
];

export const ORDENES_COMUNIDAD = [
  { key: 'reciente', label: 'Más recientes' },
  { key: 'mas-respuestas', label: 'Más respondidas' },
  { key: 'mas-apoyos', label: 'Más apoyadas' },
  { key: 'sin-responder', label: 'Sin responder' }
];

export const MOTIVOS_REPORTE = [
  'Contenido ofensivo',
  'Acoso',
  'Spam',
  'Información falsa',
  'Datos personales',
  'Contenido fuera de tema',
  'Otro motivo'
];

export const etiquetaEstado = (respuestas?: number, likes?: number) => {
  if (respuestas === 0) return { label: 'Necesita respuesta', color: 'bg-amber-100 text-amber-800' };
  if (likes && likes >= 10) return { label: 'Muy apoyada', color: 'bg-emerald-100 text-emerald-800' };
  if (respuestas && respuestas >= 5) return { label: 'Debate activo', color: 'bg-blue-100 text-blue-800' };
  return null;
};
