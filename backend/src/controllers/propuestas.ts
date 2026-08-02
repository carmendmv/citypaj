import { Request, Response } from 'express';
import { pool } from '../config/database';
import { getClientIp } from '../utils/ip';

export const getPropuestas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { provincia, categoria, page = '1', limit = '20' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    const whereConditions: string[] = ['visible = 1'];
    const queryParams: any[] = [];

    if (provincia) {
      whereConditions.push('provincia = ?');
      queryParams.push(provincia);
    }

    if (categoria) {
      whereConditions.push('categoria = ?');
      queryParams.push(categoria);
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
      SELECT
        p.id, p.usuario_id, p.titulo, p.descripcion, p.provincia, p.categoria,
        p.apoyos, p.creado_at, p.actualizado_at, u.nombre as usuario_nombre
      FROM propuestas p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      WHERE ${whereClause}
      ORDER BY p.apoyos DESC, p.creado_at DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `SELECT COUNT(*) as total FROM propuestas WHERE ${whereClause}`;

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
    console.error('Error obteniendo propuestas:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getPropuestaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT p.id, p.usuario_id, p.titulo, p.descripcion, p.provincia, p.categoria,
              p.apoyos, p.creado_at, p.actualizado_at, u.nombre as usuario_nombre
       FROM propuestas p
       LEFT JOIN usuarios u ON p.usuario_id = u.id
       WHERE p.id = ? AND p.visible = 1`,
      [id]
    );

    const propuestas = rows as any[];
    if (propuestas.length === 0) {
      res.status(404).json({ success: false, error: 'Propuesta no encontrada' });
      return;
    }

    res.status(200).json({ success: true, data: propuestas[0] });
  } catch (error) {
    console.error('Error obteniendo propuesta:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const createPropuesta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuario_id, titulo, descripcion, provincia, categoria } = req.body;

    if (!titulo || !descripcion || !provincia || !categoria) {
      res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
      return;
    }

    const ip_creador = getClientIp(req);

    const [result] = await pool.execute(
      `INSERT INTO propuestas (usuario_id, titulo, descripcion, provincia, categoria, ip_creador, apoyos, visible, estado_moderacion)
       VALUES (?, ?, ?, ?, ?, ?, 0, 1, 'approved')`,
      [usuario_id || null, titulo.trim(), descripcion.trim(), provincia, categoria, ip_creador]
    ) as any;

    res.status(201).json({
      success: true,
      message: 'Propuesta creada correctamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creando propuesta:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const apoyarPropuesta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { usuario_id } = req.body;

    if (!usuario_id) {
      res.status(400).json({ success: false, error: 'Usuario requerido' });
      return;
    }

    try {
      await pool.execute(
        `INSERT INTO propuestas_apoyos (propuesta_id, usuario_id) VALUES (?, ?)`,
        [id, usuario_id]
      );
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(200).json({ success: true, message: 'Ya has apoyado esta propuesta' });
        return;
      }
      throw err;
    }

    await pool.execute(
      `UPDATE propuestas SET apoyos = apoyos + 1 WHERE id = ?`,
      [id]
    );

    res.status(200).json({ success: true, message: 'Apoyo registrado correctamente' });
  } catch (error) {
    console.error('Error apoyando propuesta:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
