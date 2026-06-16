// Tipos principales para CityPaj

export interface Usuario {
  id: string;
  email: string;
  telefono?: string;
  nombre: string;
  email_verificado: boolean;
  telefono_verificado: boolean;
  rol: 'usuario' | 'moderador' | 'admin';
  comunidad_autonoma?: string;
  provincia?: string;
  avatar_url?: string;
  bio?: string;
  creado: string;
  actualizado: string;
}

export interface Imagen {
  id: string;
  url: string;
  url_thumbnail?: string;
  orden: number;
  width?: number;
  height?: number;
  size_bytes?: number;
  mime_type?: string;
  creado: string;
}

export interface Anuncio {
  id: string;
  usuario_id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  subcategoria?: string;
  comunidad_autonoma: string;
  provincia: string;
  barrio?: string;
  modalidad: 'venta' | 'regalo' | 'intercambio' | 'servicio' | 'compra';
  contacto_email: boolean;
  contacto_telefono: boolean;
  contacto_anonimo: boolean;
  visible: boolean;
  estado_moderacion: 'pending' | 'approved' | 'rejected' | 'flagged';
  motivo_rechazo?: string;
  vistas: number;
  creado_at: string;  // Cambiado de 'creado' a 'creado_at'
  actualizado_at: string;  // Cambiado de 'actualizado' a 'actualizado_at'
  // Campos adicionales de joins
  usuario_nombre?: string;
  usuario_email?: string;  // Email del usuario
  usuario_verificado?: boolean;
  numero_imagenes?: number;
  imagenes?: Imagen[];
  es_favorito?: boolean;
}

export interface AnuncioCardProps {
  anuncio: Anuncio;
  onFavorito?: (id: string) => void;
  onReportar?: (id: string) => void;
  onContactar?: (id: string) => void;
  esFavorito?: boolean;
  className?: string;
}

export interface FiltrosAnuncios {
  categoria?: string;
  subcategoria?: string;
  comunidad_autonoma?: string;
  provincia?: string;
  modalidad?: string;
  precio_min?: number;
  precio_max?: number;
  solo_con_fotos?: boolean;
  pagina?: number;
  limite?: number;
  orden?: 'relevancia' | 'fecha_asc' | 'fecha_desc' | 'precio_asc' | 'precio_desc';
}

export interface FiltroSidebarProps {
  filtros: FiltrosAnuncios;
  onFiltroChange: (filtros: FiltrosAnuncios) => void;
  categorias?: Categoria[];
  comunidades?: Comunidad[];
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  subcategorias?: Subcategoria[];
}

export interface Subcategoria {
  id: string;
  nombre: string;
}

export interface Comunidad {
  id: string;
  nombre: string;
  provincias: Provincia[];
}

export interface Provincia {
  id: string;
  nombre: string;
}

export interface Reporte {
  id: string;
  anuncio_id: string;
  usuario_id: string;
  motivo: 'spam' | 'inapropiado' | 'fraude' | 'duplicado' | 'otro';
  comentario?: string;
  estado: 'pending' | 'revisado' | 'resuelto' | 'descartado';
  resuelto_por?: string;
  creado: string;
  resuelto?: string;
}

export interface AccionModeracion {
  id: string;
  anuncio_id: string;
  moderador_id: string;
  accion: 'aprobar' | 'rechazar' | 'ocultar' | 'eliminar' | 'flag';
  motivo?: string;
  anterior_estado?: string;
  nuevo_estado?: string;
  creado: string;
}

export interface AlertaBusqueda {
  id: string;
  usuario_id: string;
  termino_busqueda: string;
  filtros: FiltrosAnuncios;
  activa: boolean;
  ultima_notificacion?: string;
  creado: string;
}

export interface Sesion {
  id: string;
  usuario_id: string;
  refresh_token_hash: string;
  expires_at: string;
  creado: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  usuario: Usuario;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  telefono?: string;
  comunidad_autonoma?: string;
  provincia?: string;
}

export interface CreateAnuncioRequest {
  titulo: string;
  descripcion: string;
  categoria: string;
  subcategoria?: string;
  comunidad_autonoma: string;
  provincia: string;
  barrio?: string;
  precio?: number;
  modalidad: 'venta' | 'regalo' | 'intercambio' | 'servicio';
  contacto_email: boolean;
  contacto_telefono: boolean;
  contacto_anonimo: boolean;
}

export interface UpdateAnuncioRequest extends Partial<CreateAnuncioRequest> {}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    pagina?: number;
    limite?: number;
    total?: number;
    total_paginas?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    pagina: number;
    limite: number;
    total: number;
    total_paginas: number;
  };
}

export interface PaginationMeta {
  pagina: number;
  limite: number;
  total: number;
  total_paginas: number;
}

// Utilidades
export type ModalidadAnuncio = 'venta' | 'regalo' | 'intercambio' | 'servicio';
export type EstadoModeracion = 'pending' | 'approved' | 'rejected' | 'flagged';
export type RolUsuario = 'usuario' | 'moderador' | 'admin';
export type MotivoReporte = 'spam' | 'inapropiado' | 'fraude' | 'duplicado' | 'otro';
export type AccionModerador = 'aprobar' | 'rechazar' | 'ocultar' | 'eliminar' | 'flag';
