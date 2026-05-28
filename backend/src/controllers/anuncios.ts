import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { AuthRequest } from '../middleware/auth';

// Mock data - en producción esto vendría de la base de datos
const mockAnuncios = [
  {
    id: '7a60c6b6-2c7f-4f62-8b4f-e8c53b49c0e1',
    titulo: 'Clases particulares de matemáticas',
    descripcion:
      'Soy estudiante de 3º de Ingeniería Matemática y ofrezco clases particulares para ESO y Bachillerato. Explico con calma, preparo ejercicios y puedo ayudarte con recuperaciones o selectividad. Modalidad presencial u online según zona. Precio por hora negociable según nivel.',
    categoria: 'educacion',
    subcategoria: 'clases',
    comunidad_autonoma: 'Aragón',
    provincia: 'Zaragoza',
    precio: 15.00,
    modalidad: 'servicio',
    autor: 'Álvaro M.',
    email: 'alvaro.mate@citypaj.es',
    telefono: undefined,
    contacto_email: true,
    contacto_telefono: false,
    contacto_anonimo: false,
    visible: true,
    estado_moderacion: 'approved',
    creado: '2026-01-18T12:30:00.000Z',
    actualizado: '2026-01-18T12:30:00.000Z',
    vistas: 45,
  },
  {
    id: 'f4e1a8a4-6b7a-44cf-a0f9-7d6a3122f0b2',
    titulo: 'Entradas para concierto (precio juvenil)',
    descripcion:
      'Vendo 2 entradas para concierto este sábado. Precio juvenil, entrega en mano en el centro o envío digital. Ideal para ir en grupo. Si te interesa, escríbeme y lo cerramos hoy.',
    categoria: 'ocio',
    subcategoria: 'eventos',
    comunidad_autonoma: 'Andalucía',
    provincia: 'Málaga',
    precio: 25.0,
    modalidad: 'venta',
    autor: 'Marina',
    email: 'marina@citypaj.es',
    telefono: undefined,
    contacto_email: true,
    contacto_telefono: false,
    contacto_anonimo: false,
    visible: true,
    estado_moderacion: 'approved',
    creado: '2026-01-22T20:10:00.000Z',
    actualizado: '2026-01-22T20:10:00.000Z',
    vistas: 6,
  },
  {
    id: '2d3c3c1e-4a4a-4d1f-8b5a-2f9f9a8a4d2f',
    titulo: 'Ayuda con trámites: becas y solicitudes',
    descripcion:
      'Ofrezco ayuda para preparar documentación y trámites (becas, ayudas al alquiler, certificados). Reviso formularios, plazos y requisitos. Atención por videollamada o presencial según zona. Precio por sesión.',
    categoria: 'servicios',
    subcategoria: 'tramites',
    comunidad_autonoma: 'Madrid',
    provincia: 'Madrid',
    precio: 10.0,
    modalidad: 'servicio',
    autor: 'Diego',
    email: 'diego@citypaj.es',
    telefono: '611 111 111',
    contacto_email: true,
    contacto_telefono: true,
    contacto_anonimo: false,
    visible: true,
    estado_moderacion: 'approved',
    creado: '2026-01-19T16:45:00.000Z',
    actualizado: '2026-01-19T16:45:00.000Z',
    vistas: 19,
  },
  {
    id: '9d1f7d18-9b90-4d05-8c11-23a0c8d8e8a1',
    titulo: 'Prácticas remuneradas (marketing digital)',
    descripcion:
      'Empresa local busca estudiante para prácticas de marketing digital. Se valora manejo de redes, Canva y redacción. Horario compatible con estudios. Ideal para ganar experiencia. Enviar CV por email.',
    categoria: 'empleo',
    subcategoria: 'practicas',
    comunidad_autonoma: 'Aragón',
    provincia: 'Zaragoza',
    precio: 0,
    modalidad: 'servicio',
    autor: 'RRHH',
    email: 'rrhh@citypaj.es',
    telefono: undefined,
    contacto_email: true,
    contacto_telefono: false,
    contacto_anonimo: false,
    visible: true,
    estado_moderacion: 'approved',
    creado: '2026-01-17T08:00:00.000Z',
    actualizado: '2026-01-17T08:00:00.000Z',
    vistas: 31,
  },
  {
    id: 'b746c21a-7e76-4ea4-a2a6-2f21d5b3c9a3',
    titulo: 'Busco compañero/a de piso cerca de la uni',
    descripcion:
      'Estoy buscando compañero/a de piso para entrar en febrero. Piso de 3 habitaciones, ambiente tranquilo (estudio y trabajo), se permite cocinar y recibir visitas. Zona bien comunicada con bus y metro. Preferible alguien entre 18-28 años. Escribe sin compromiso.',
    categoria: 'vivienda',
    subcategoria: 'compartir',
    comunidad_autonoma: 'Madrid',
    provincia: 'Madrid',
    precio: 350.0,
    modalidad: 'servicio',
    autor: 'Carmen',
    email: 'carmen@citypaj.es',
    telefono: '600 000 000',
    contacto_email: true,
    contacto_telefono: true,
    contacto_anonimo: false,
    visible: true,
    estado_moderacion: 'approved',
    creado: '2026-01-20T09:15:00.000Z',
    actualizado: '2026-01-20T09:15:00.000Z',
    vistas: 12,
  },
  {
    id: '3f2b0e55-8f7a-4d73-8f8d-5f25f3dffbd1',
    titulo: 'Intercambio de apuntes DAW (2º)',
    descripcion:
      'Tengo apuntes completos de despliegue, diseño de interfaces y servidor. Busco apuntes de empresa e iniciativa emprendedora o bases de datos con ejercicios resueltos. Si te interesa, nos organizamos por Drive y hacemos intercambio por temas.',
    categoria: 'intercambios',
    subcategoria: 'apuntes',
    comunidad_autonoma: 'Andalucía',
    provincia: 'Sevilla',
    precio: 0,
    modalidad: 'intercambio',
    autor: 'Lucía',
    email: 'lucia@citypaj.es',
    telefono: undefined,
    contacto_email: true,
    contacto_telefono: false,
    contacto_anonimo: false,
    visible: true,
    estado_moderacion: 'approved',
    creado: '2026-01-21T18:05:00.000Z',
    actualizado: '2026-01-21T18:05:00.000Z',
    vistas: 8,
  },
];

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

export const getAnuncios = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      pagina = 1,
      limite = 20,
      comunidad_autonoma,
      categoria,
      orden = 'fecha_desc',
    } = req.query;
    const page = Number(pagina);
    const limit = Number(limite);

    const comunidadFilter = typeof comunidad_autonoma === 'string' ? comunidad_autonoma : undefined;
    const categoriaFilter = typeof categoria === 'string' ? categoria : undefined;

    let data = [...mockAnuncios];

    if (comunidadFilter && comunidadFilter.trim()) {
      const comunidadNorm = normalizeText(comunidadFilter.trim());
      data = data.filter((a) => normalizeText(a.comunidad_autonoma) === comunidadNorm);
    }

    if (categoriaFilter && categoriaFilter.trim()) {
      const categoriaNorm = normalizeText(categoriaFilter.trim());
      data = data.filter((a) => normalizeText(a.categoria) === categoriaNorm);
    }

    if (orden === 'fecha_asc') {
      data.sort((a, b) => new Date(a.creado).getTime() - new Date(b.creado).getTime());
    } else if (orden === 'fecha_desc') {
      data.sort((a, b) => new Date(b.creado).getTime() - new Date(a.creado).getTime());
    }

    const total = data.length;
    const totalPaginas = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const end = start + limit;
    data = data.slice(start, end);
    
    // TODO: Implementar lógica real con base de datos
    res.json({
      success: true,
      data,
      meta: {
        pagina: page,
        limite: limit,
        total,
        total_paginas: totalPaginas,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncios',
    });
  }
};

export const getAnuncioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // TODO: Implementar lógica real con base de datos
    const anuncio = mockAnuncios.find(a => a.id === id);
    
    if (!anuncio) {
      res.status(404).json({
        success: false,
        error: 'Anuncio no encontrado',
      });
      return;
    }
    
    res.json({
      success: true,
      data: anuncio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncio',
    });
  }
};

export const createAnuncio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implementar lógica real con base de datos
    const nuevoAnuncio = {
      id: randomUUID(),
      ...req.body,
      usuario_id: req.user?.id,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      vistas: 0,
    };

    mockAnuncios.unshift(nuevoAnuncio as any);
    
    res.status(201).json({
      success: true,
      data: nuevoAnuncio,
      message: 'Anuncio creado correctamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al crear anuncio',
    });
  }
};

export const createAnuncioPublico = async (req: Request, res: Response): Promise<void> => {
  try {
    const nuevoAnuncio = {
      id: randomUUID(),
      ...req.body,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      vistas: 0,
      visible: true,
      estado_moderacion: 'approved',
      contacto_email: true,
      contacto_telefono: Boolean(req.body?.telefono),
      contacto_anonimo: false,
    };

    mockAnuncios.unshift(nuevoAnuncio as any);

    res.status(201).json({
      success: true,
      data: nuevoAnuncio,
      message: 'Anuncio creado correctamente',
    });
  } catch (_error) {
    res.status(500).json({
      success: false,
      error: 'Error al crear anuncio',
    });
  }
};

export const updateAnuncio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implementar lógica real con base de datos
    res.json({
      success: true,
      data: { ...req.body },
      message: 'Anuncio actualizado correctamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar anuncio',
    });
  }
};

export const deleteAnuncio = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implementar lógica real con base de datos
    res.json({
      success: true,
      message: 'Anuncio eliminado correctamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar anuncio',
    });
  }
};

export const hideAnuncio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ocultar } = req.body;
    
    // TODO: Implementar lógica real con base de datos
    res.json({
      success: true,
      message: `Anuncio ${ocultar ? 'ocultado' : 'visible'} correctamente`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al cambiar visibilidad del anuncio',
    });
  }
};

export const searchAnuncios = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    
    // TODO: Implementar lógica real con búsqueda en base de datos
    res.json({
      success: true,
      data: mockAnuncios.filter(a => 
        a.titulo.toLowerCase().includes((q as string)?.toLowerCase() || '')
      ),
      meta: {
        pagina: 1,
        limite: 20,
        total: mockAnuncios.length,
        total_paginas: 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al buscar anuncios',
    });
  }
};

export const toggleFavorito = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implementar lógica real con base de datos
    res.json({
      success: true,
      message: 'Favorito actualizado correctamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar favorito',
    });
  }
};

export const getAnunciosGuardados = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      res.status(400).json({
        success: false,
        error: 'Se requiere un array de IDs',
      });
      return;
    }

    // Filtrar anuncios mock por los IDs proporcionados
    const anunciosFiltrados = mockAnuncios.filter(anuncio => 
      ids.includes(anuncio.id)
    );

    res.json({
      success: true,
      data: anunciosFiltrados,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncios guardados',
    });
  }
};

export const incrementarVistas = async (_req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Implementar lógica real con base de datos
    res.json({
      success: true,
      message: 'Vistas incrementadas correctamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al incrementar vistas',
    });
  }
};
