import { v4 as uuidv4 } from 'uuid';

// Tipos para los datos
export interface Anuncio {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  comunidad_autonoma: string;
  provincia: string;
  localidad: string;
  precio: number | null;
  visible: boolean;
  estado_moderacion: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  usuario_id: string;
  contacto_email: string;
  contacto_telefono: string;
  imagenes: string[];
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password_hash: string;
  fecha_registro: string;
  comunidad_autonoma: string | null;
  provincia: string | null;
  localidad: string | null;
  rol: string;
  activo: boolean;
}

export interface ComunidadAutonoma {
  id: string;
  nombre: string;
  codigo: string;
}

// Datos mock consistentes
const CATEGORIAS = ['todos', 'ocio', 'servicios', 'educacion', 'empleo', 'intercambios', 'vivienda'];
const COMUNIDADES: ComunidadAutonoma[] = [
  { id: '1', nombre: 'Andalucía', codigo: 'AN' },
  { id: '2', nombre: 'Aragón', codigo: 'AR' },
  { id: '3', nombre: 'Asturias', codigo: 'AS' },
  { id: '4', nombre: 'Baleares', codigo: 'IB' },
  { id: '5', nombre: 'Canarias', codigo: 'CN' },
  { id: '6', nombre: 'Cantabria', codigo: 'CB' },
  { id: '7', nombre: 'Castilla-La Mancha', codigo: 'CM' },
  { id: '8', nombre: 'Castilla y León', codigo: 'CL' },
  { id: '9', nombre: 'Cataluña', codigo: 'CT' },
  { id: '10', nombre: 'Comunidad Valenciana', codigo: 'VC' },
  { id: '11', nombre: 'Extremadura', codigo: 'EX' },
  { id: '12', nombre: 'Galicia', codigo: 'GA' },
  { id: '13', nombre: 'Madrid', codigo: 'MD' },
  { id: '14', nombre: 'Murcia', codigo: 'MC' },
  { id: '15', nombre: 'Navarra', codigo: 'NC' },
  { id: '16', nombre: 'País Vasco', codigo: 'PV' },
  { id: '17', nombre: 'La Rioja', codigo: 'RI' }
];

// Generar datos mock realistas
const generateMockAnuncios = (): Anuncio[] => {
  const anuncios: Anuncio[] = [];
  const titulosPorCategoria = {
    ocio: [
      'Concierto de rock en sala local',
      'Torneo de videojuegos online',
      'Excursión senderismo fin de semana',
      'Clases de baile salsa',
      'Cineclub independiente',
      'Festival de música local',
      'Partido de fútbol amateur',
      'Taller de fotografía urbana'
    ],
    servicios: [
      'Reparación de ordenadores a domicilio',
      'Clases particulares de inglés',
      'Diseño de logos para empresas',
      'Servicio de jardinería profesional',
      'Limpieza de hogares',
      'Asesoría fiscal autónomos',
      'Instalación de aire acondicionado',
      'Traducciones inglés-español'
    ],
    educacion: [
      'Clases de matemáticas universitarias',
      'Curso de programación web',
      'Taller de habilidades sociales',
      'Preparación examen selectividad',
      'Clases de guitarra para principiantes',
      'Curso de marketing digital',
      'Clases de cocina saludable',
      'Taller de idiomas online'
    ],
    empleo: [
      'Busco trabajo como programador junior',
      'Oferto servicios de diseño gráfico',
      'Necesito ayudante para tienda',
      'Busco empleo en hostelería',
      'Oferto clases particulares',
      'Busco trabajo de verano',
      'Necesito repartidor local',
      'Busco prácticas en marketing'
    ],
    intercambios: [
      'Intercambio de libros de ficción',
      'Busco compañero para intercambio de idiomas',
      'Intercambio de videojuegos',
      'Busco intercambio de ropa',
      'Intercambio de plantas caseras',
      'Busco intercambio de películas',
      'Intercambio de material de estudio',
      'Busco intercambio de recetas'
    ],
    vivienda: [
      'Alquiler piso centro ciudad',
      'Busco compañero piso compartido',
      'Alquiler habitación amueblada',
      'Busco piso para estudiantes',
      'Alquiler local comercial',
      'Busco casa con jardín',
      'Alquiler garaje centro',
      'Busco vivienda accesible'
    ]
  };

  const provinciasPorComunidad: { [key: string]: string[] } = {
    'Andalucía': ['Sevilla', 'Málaga', 'Granada', 'Córdoba', 'Cádiz', 'Huelva', 'Jaén', 'Almería'],
    'Madrid': ['Madrid'],
    'Cataluña': ['Barcelona', 'Tarragona', 'Lérida', 'Gerona'],
    'Comunidad Valenciana': ['Valencia', 'Alicante', 'Castellón'],
    'País Vasco': ['Vizcaya', 'Guipúzcoa', 'Álava'],
    'Galicia': ['La Coruña', 'Lugo', 'Orense', 'Pontevedra'],
    'Castilla y León': ['León', 'Burgos', 'Salamanca', 'Palencia', 'Valladolid', 'Zamora', 'Segovia', 'Soria', 'Ávila'],
    'Castilla-La Mancha': ['Toledo', 'Ciudad Real', 'Albacete', 'Cuenca', 'Guadalajara'],
    'Aragón': ['Zaragoza', 'Huesca', 'Teruel'],
    'Extremadura': ['Mérida', 'Badajoz', 'Cáceres', 'Plasencia'],
    'Islas Baleares': ['Palma de Mallorca', 'Ibiza', 'Menorca', 'Formentera'],
    'Islas Canarias': ['Las Palmas', 'Santa Cruz de Tenerife', 'Tenerife', 'Gran Canaria'],
    'Cantabria': ['Santander', 'Torrelavega'],
    'La Rioja': ['Logroño', 'Calahorra'],
    'Navarra': ['Pamplona', 'Tudela'],
    'Asturias': ['Oviedo', 'Gijón', 'Avilés'],
    'Murcia': ['Murcia', 'Cartagena']
  };

  // Generar 200 anuncios mock realistas
  for (let i = 0; i < 200; i++) {
    const categoria = CATEGORIAS[Math.floor(Math.random() * (CATEGORIAS.length - 1)) + 1]; // Excluir 'todos'
    const comunidad = COMUNIDADES[Math.floor(Math.random() * COMUNIDADES.length)];
    const provincias = provinciasPorComunidad[comunidad.nombre] || ['Capital'];
    const provincia = provincias[Math.floor(Math.random() * provincias.length)];
    const titulos = titulosPorCategoria[categoria as keyof typeof titulosPorCategoria] || ['Anuncio genérico'];
    const titulo = titulos[Math.floor(Math.random() * titulos.length)];
    
    anuncios.push({
      id: uuidv4(),
      titulo,
      descripcion: `Anuncio de ${categoria}: ${titulo}. Contacta para más información.`,
      categoria,
      comunidad_autonoma: comunidad.nombre,
      provincia,
      localidad: `${provincia} ciudad`,
      precio: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) + 10 : null,
      visible: true,
      estado_moderacion: 'approved',
      fecha_creacion: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      fecha_actualizacion: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      usuario_id: uuidv4(),
      contacto_email: `usuario${i}@example.com`,
      contacto_telefono: `600${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      imagenes: Math.random() > 0.5 ? [`/images/anuncio-${i % 10}.jpg`] : []
    });
  }

  return anuncios;
};

// Cache de datos mock
let mockAnunciosCache: Anuncio[] | null = null;

// Servicio centralizado de datos mock
export class MockDataService {
  static getAnuncios(): Anuncio[] {
    if (!mockAnunciosCache) {
      mockAnunciosCache = generateMockAnuncios();
      console.log(`🔄 Generated ${mockAnunciosCache.length} mock anuncios`);
    }
    return mockAnunciosCache;
  }

  static getAnuncioById(id: string): Anuncio | null {
    const anuncios = this.getAnuncios();
    return anuncios.find(a => a.id === id) || null;
  }

  static getComunidades(): ComunidadAutonoma[] {
    return COMUNIDADES;
  }

  static getCategorias(): string[] {
    return CATEGORIAS;
  }

  static filterAnuncios(params: {
    categoria?: string;
    comunidad_autonoma?: string;
    provincia?: string;
    busqueda?: string;
    orden?: string;
    page?: number;
    limit?: number;
  }) {
    let filtered = this.getAnuncios();

    // Aplicar filtros
    if (params.categoria && params.categoria !== 'todos') {
      filtered = filtered.filter(a => a.categoria === params.categoria);
    }

    if (params.comunidad_autonoma) {
      filtered = filtered.filter(a => a.comunidad_autonoma === params.comunidad_autonoma);
    }

    if (params.provincia) {
      filtered = filtered.filter(a => a.provincia === params.provincia);
    }

    if (params.busqueda) {
      const busquedaLower = params.busqueda.toLowerCase();
      filtered = filtered.filter(a => 
        a.titulo.toLowerCase().includes(busquedaLower) ||
        a.descripcion.toLowerCase().includes(busquedaLower)
      );
    }

    // Ordenar según el parámetro orden
    switch (params.orden) {
      case 'fecha_asc':
        filtered.sort((a, b) => new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime());
        break;
      case 'fecha_desc':
        filtered.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());
        break;
      case 'precio_asc':
        filtered.sort((a, b) => (a.precio || 0) - (b.precio || 0));
        break;
      case 'precio_desc':
        filtered.sort((a, b) => (b.precio || 0) - (a.precio || 0));
        break;
      case 'relevancia':
      default:
        // Por defecto, ordenar por fecha de creación (más recientes primero)
        filtered.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());
        break;
    }

    // Paginación
    const page = params.page || 1;
    const limit = params.limit || 12;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      data: paginated,
      meta: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        hasNext: page < Math.ceil(filtered.length / limit),
        hasPrev: page > 1
      }
    };
  }

  static createAnuncio(anuncioData: Partial<Anuncio>): Anuncio {
    const anuncios = this.getAnuncios();
    const newAnuncio: Anuncio = {
      id: uuidv4(),
      titulo: anuncioData.titulo || '',
      descripcion: anuncioData.descripcion || '',
      categoria: anuncioData.categoria || 'otros',
      comunidad_autonoma: anuncioData.comunidad_autonoma || '',
      provincia: anuncioData.provincia || '',
      localidad: anuncioData.localidad || '',
      precio: anuncioData.precio || null,
      visible: true,
      estado_moderacion: 'pending',
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString(),
      usuario_id: anuncioData.usuario_id || '',
      contacto_email: anuncioData.contacto_email || '',
      contacto_telefono: anuncioData.contacto_telefono || '',
      imagenes: anuncioData.imagenes || []
    };

    anuncios.push(newAnuncio);
    return newAnuncio;
  }

  static updateAnuncio(id: string, updates: Partial<Anuncio>): Anuncio | null {
    const anuncios = this.getAnuncios();
    const index = anuncios.findIndex(a => a.id === id);
    
    if (index === -1) return null;

    anuncios[index] = {
      ...anuncios[index],
      ...updates,
      fecha_actualizacion: new Date().toISOString()
    };

    return anuncios[index];
  }

  static deleteAnuncio(id: string): boolean {
    const anuncios = this.getAnuncios();
    const index = anuncios.findIndex(a => a.id === id);
    
    if (index === -1) return false;

    anuncios.splice(index, 1);
    return true;
  }
}

export default MockDataService;
