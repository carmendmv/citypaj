import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

// Mock data - en producción esto vendría de la base de datos
const mockAnuncios = [
  {
    id: '1',
    titulo: 'Clases particulares de matemáticas',
    descripcion: 'Soy estudiante de 3º de Ingeniería Matemática y ofrezco clases particulares.',
    categoria: 'educacion',
    subcategoria: 'clases',
    comunidad_autonoma: 'aragon',
    provincia: 'zaragoza',
    precio: 15.00,
    modalidad: 'servicio',
    contacto_email: true,
    contacto_telefono: false,
    contacto_anonimo: false,
    visible: true,
    estado_moderacion: 'approved',
    creado: new Date().toISOString(),
    actualizado: new Date().toISOString(),
    vistas: 45,
  }
];

export const getAnuncios = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pagina = 1, limite = 20 } = req.query;
    
    // TODO: Implementar lógica real con base de datos
    res.json({
      success: true,
      data: mockAnuncios,
      meta: {
        pagina: Number(pagina),
        limite: Number(limite),
        total: mockAnuncios.length,
        total_paginas: Math.ceil(mockAnuncios.length / Number(limite)),
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
      id: Date.now().toString(),
      ...req.body,
      usuario_id: req.user?.id,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      vistas: 0,
    };
    
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
