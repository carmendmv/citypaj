import { Request, Response } from 'express';
import { pool } from '../config/database';

export const getRecursos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria, provincia, page = '1', limit = '20' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    const whereConditions: string[] = ['visible = 1'];
    const queryParams: any[] = [];

    if (categoria) {
      whereConditions.push('categoria = ?');
      queryParams.push(categoria);
    }

    if (provincia) {
      whereConditions.push('provincia = ?');
      queryParams.push(provincia);
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
      SELECT id, titulo, descripcion, categoria, provincia, url, verificado, creado_at
      FROM recursos
      WHERE ${whereClause}
      ORDER BY verificado DESC, creado_at DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `SELECT COUNT(*) as total FROM recursos WHERE ${whereClause}`;

    const [rows] = await pool.execute(query, [...queryParams, limitNum, offset]);
    const [countRows] = await pool.execute(countQuery, queryParams) as any;

    const total = countRows[0]?.total || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        page: parseInt(page as string),
        limit: limitNum,
        total,
        totalPages,
        hasNext: parseInt(page as string) < totalPages,
        hasPrev: parseInt(page as string) > 1
      }
    });
  } catch (error) {
    console.error('Error obteniendo recursos:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const createRecurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuario_id, titulo, descripcion, categoria, provincia, url } = req.body;

    if (!titulo || !categoria || !provincia) {
      res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
      return;
    }

    const [result] = await pool.execute(
      `INSERT INTO recursos (usuario_id, titulo, descripcion, categoria, provincia, url, verificado, visible)
       VALUES (?, ?, ?, ?, ?, ?, 0, 1)`,
      [usuario_id || null, titulo.trim(), descripcion?.trim() || null, categoria, provincia, url || null]
    ) as any;

    res.status(201).json({
      success: true,
      message: 'Recurso creado correctamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creando recurso:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
