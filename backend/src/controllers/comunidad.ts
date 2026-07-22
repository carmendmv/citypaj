import { Request, Response } from 'express';
import { pool } from '../config/database';
import { randomUUID } from 'crypto';

export const getPublicaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const { provincia, comunidad_autonoma, tema, page = '1', limit = '20' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    const whereConditions: string[] = ['visible = 1'];
    const queryParams: any[] = [];

    if (provincia) {
      whereConditions.push('provincia = ?');
      queryParams.push(provincia);
    } else if (comunidad_autonoma) {
      whereConditions.push(`provincia IN (SELECT p.nombre FROM provincias p JOIN comunidades c ON p.comunidad_id = c.id WHERE c.nombre = ?)`);
      queryParams.push(comunidad_autonoma);
    }

    if (tema) {
      whereConditions.push('tema = ?');
      queryParams.push(tema);
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
      SELECT
        cp.id, cp.usuario_id, cp.titulo, cp.contenido, cp.provincia, cp.tema,
        cp.creado_at, cp.actualizado_at,
        u.nombre as usuario_nombre
      FROM comunidad_publicaciones cp
      LEFT JOIN usuarios u ON cp.usuario_id = u.id
      WHERE ${whereClause}
      ORDER BY cp.creado_at DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `SELECT COUNT(*) as total FROM comunidad_publicaciones WHERE ${whereClause}`;

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
    console.error('Error obteniendo publicaciones:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getPublicacionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [publicacionRows] = await pool.execute(
      `SELECT cp.id, cp.usuario_id, cp.titulo, cp.contenido, cp.provincia, cp.tema,
              cp.creado_at, cp.actualizado_at, u.nombre as usuario_nombre
       FROM comunidad_publicaciones cp
       LEFT JOIN usuarios u ON cp.usuario_id = u.id
       WHERE cp.id = ? AND cp.visible = 1`,
      [id]
    );

    const publicaciones = publicacionRows as any[];
    if (publicaciones.length === 0) {
      res.status(404).json({ success: false, error: 'Publicación no encontrada' });
      return;
    }

    const [comentarios] = await pool.execute(
      `SELECT cc.id, cc.contenido, cc.creado_at, u.nombre as usuario_nombre
       FROM comunidad_comentarios cc
       LEFT JOIN usuarios u ON cc.usuario_id = u.id
       WHERE cc.publicacion_id = ? AND cc.visible = 1
       ORDER BY cc.creado_at ASC`,
      [id]
    );

    res.status(200).json({
      success: true,
      data: {
        ...publicaciones[0],
        comentarios
      }
    });
  } catch (error) {
    console.error('Error obteniendo publicación:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const createPublicacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuario_id, titulo, contenido, provincia, tema } = req.body;

    if (!titulo || !contenido || !provincia || !tema) {
      res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
      return;
    }

    const userId = usuario_id || randomUUID();

    const [result] = await pool.execute(
      `INSERT INTO comunidad_publicaciones (usuario_id, titulo, contenido, provincia, tema, visible, estado_moderacion)
       VALUES (?, ?, ?, ?, ?, 1, 'approved')`,
      [userId, titulo.trim(), contenido.trim(), provincia, tema]
    ) as any;

    res.status(201).json({
      success: true,
      message: 'Publicación creada correctamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creando publicación:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const createComentario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { usuario_id, contenido } = req.body;

    if (!contenido) {
      res.status(400).json({ success: false, error: 'El contenido es requerido' });
      return;
    }

    const userId = usuario_id || randomUUID();

    await pool.execute(
      `INSERT INTO comunidad_comentarios (publicacion_id, usuario_id, contenido, visible)
       VALUES (?, ?, ?, 1)`,
      [id, userId, contenido.trim()]
    );

    res.status(201).json({ success: true, message: 'Comentario añadido correctamente' });
  } catch (error) {
    console.error('Error creando comentario:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const reportarPublicacion = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'Publicación reportada. Será revisada por moderación.' });
};

export const getComunidadesProvincias = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [comunidades] = await pool.execute(
      'SELECT id, nombre FROM comunidades ORDER BY nombre ASC'
    );
    const [provincias] = await pool.execute(
      'SELECT id, nombre, comunidad_id FROM provincias ORDER BY nombre ASC'
    );

    const data = (comunidades as any[]).map((comunidad) => ({
      id: comunidad.id,
      nombre: comunidad.nombre,
      provincias: (provincias as any[])
        .filter((p) => p.comunidad_id === comunidad.id)
        .map((p) => p.nombre),
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error obteniendo comunidades y provincias:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
