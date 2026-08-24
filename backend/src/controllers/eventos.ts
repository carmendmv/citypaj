import { Request, Response } from 'express';
import { pool } from '../config/database';
import { getClientIp } from '../utils/ip';

export const getEventos = async (req: Request, res: Response): Promise<void> => {
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
      SELECT id, titulo, descripcion, categoria, provincia, fecha_inicio, fecha_fin, precio, ubicacion, url, creado_at
      FROM eventos
      WHERE ${whereClause}
      ORDER BY fecha_inicio ASC, creado_at DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `SELECT COUNT(*) as total FROM eventos WHERE ${whereClause}`;

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
    console.error('Error obteniendo eventos:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const createEvento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuario_id, titulo, descripcion, categoria, provincia, fecha_inicio, fecha_fin, precio, ubicacion, url } = req.body;

    if (!titulo || !categoria || !provincia || !fecha_inicio) {
      res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
      return;
    }

    const ip_creador = getClientIp(req);

    const [result] = await pool.execute(
      `INSERT INTO eventos (usuario_id, titulo, descripcion, categoria, provincia, fecha_inicio, fecha_fin, precio, ubicacion, url, ip_creador, visible)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [usuario_id || null, titulo.trim(), descripcion?.trim() || null, categoria, provincia, fecha_inicio, fecha_fin || null, precio || 0, ubicacion || null, url || null, ip_creador]
    ) as any;

    res.status(201).json({
      success: true,
      message: 'Evento creado correctamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creando evento:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
