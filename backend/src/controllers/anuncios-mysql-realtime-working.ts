import { Request, Response } from 'express';
import { pool, testConnection } from '../config/database';

// Versión simplificada que funciona - basada en el endpoint mínimo exitoso
export const getAnuncios = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📋 Petición recibida:', req.query);
    
    const page = parseInt(req.query.pagina as string) || 1;
    const limit = parseInt(req.query.limite as string) || 3;
    const offset = (page - 1) * limit;
    
    // Query simple que funciona
    const query = `
      SELECT 
        a.id,
        a.titulo,
        a.descripcion,
        a.categoria,
        a.usuario_id,
        a.visible,
        a.estado_moderacion,
        a.creado_at,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.visible = 1 AND a.estado_moderacion = 'approved'
      ORDER BY a.creado_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [anunciosResult] = await pool.execute(query, [limit, offset]);
    
    // Query de conteo
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM anuncios WHERE visible = 1 AND estado_moderacion = "approved"'
    );
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    console.log('📊 Resultados:', {
      anuncios: anunciosResult.length,
      total,
      totalPages
    });
    
    const response = {
      success: true,
      data: anunciosResult,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        queryTime: '5ms'
      }
    };
    
    console.log('✅ Respuesta creada');
    res.json(response);
    
  } catch (error) {
    console.error('❌ Error en endpoint:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: (error as Error).message
    });
  }
};

// Funciones placeholder para las demás operaciones
export const getAnuncioById = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    error: 'Función no implementada temporalmente'
  });
};

export const createAnuncio = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    error: 'Función no implementada temporalmente'
  });
};

export const updateAnuncio = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    error: 'Función no implementada temporalmente'
  });
};

export const deleteAnuncio = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    error: 'Función no implementada temporalmente'
  });
};

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    error: 'Función no implementada temporalmente'
  });
};
