import { Request, Response } from 'express';
import { executeQuery } from '../config/database';

// Función simplificada para obtener anuncios desde la base de datos real citypaj_db
export const getAnunciosSimple = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔄 Versión simplificada: Conectando a citypaj_db');
    
    const {
      page = '1',
      limit = '12',
      categoria
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Consulta simple sin filtros complejos
    let query = `
      SELECT id, titulo, descripcion, categoria, 
             creado_at as fecha_creacion, precio
      FROM anuncios 
      WHERE visible = 1 AND estado_moderacion = 'approved'
    `;
    
    const params: any[] = [];

    // Solo aplicar filtro de categoría si existe
    if (categoria && categoria !== 'todos') {
      query += ` AND categoria = ?`;
      params.push(categoria);
      console.log(`🔍 Aplicando filtro categoría: ${categoria}`);
    }

    // Ordenamiento simple
    query += ` ORDER BY creado_at DESC LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    console.log('🔍 Ejecutando consulta:', query);
    console.log('📊 Parámetros:', params);

    const anuncios = await executeQuery(query, params);
    console.log(`✅ Consulta exitosa: ${anuncios.length} resultados`);

    // Conteo simple
    const countQuery = categoria && categoria !== 'todos' 
      ? `SELECT COUNT(*) as total FROM anuncios WHERE visible = 1 AND estado_moderacion = 'approved' AND categoria = ?`
      : `SELECT COUNT(*) as total FROM anuncios WHERE visible = 1 AND estado_moderacion = 'approved'`;
    
    const countParams = categoria && categoria !== 'todos' ? [categoria] : [];
    const [countResult] = await executeQuery(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: anuncios,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('❌ Error detallado:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};
