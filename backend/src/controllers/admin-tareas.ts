import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';

function resJson(res: Response, status: number, data: object, meta?: object) {
  res.status(status).json({
    success: status >= 200 && status < 300,
    status,
    ...(meta ? { meta } : {}),
    data,
  });
}

export const listarTareas = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string || '25', 10)));
    const offset = (page - 1) * limit;
    const q = (req.query.q as string || '').trim();
    const estado = (req.query.estado as string || '').trim();
    const asignado_a = (req.query.asignado_a as string || '').trim();

    const conditions: string[] = [];
    const values: any[] = [];

    if (q) {
      conditions.push('(titulo LIKE ? OR descripcion LIKE ?)');
      values.push(`%${q}%`, `%${q}%`);
    }
    if (estado) {
      conditions.push('estado = ?');
      values.push(estado);
    }
    if (asignado_a) {
      conditions.push('asignado_a = ?');
      values.push(asignado_a);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute(
      `SELECT t.*, u_asignado.nombre as asignado_nombre, u_creador.nombre as creador_nombre
       FROM admin_tareas t
       LEFT JOIN usuarios u_asignado ON t.asignado_a = u_asignado.id
       LEFT JOIN usuarios u_creador ON t.creado_por = u_creador.id
       ${where}
       ORDER BY t.creado_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset],
    );

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM admin_tareas ${where}`,
      values,
    );
    const total = (countRows as any[])[0]?.total || 0;

    return resJson(res, 200, rows, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

export const getTarea = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [rows] = await pool.execute(
      `SELECT t.*, u_asignado.nombre as asignado_nombre, u_creador.nombre as creador_nombre
       FROM admin_tareas t
       LEFT JOIN usuarios u_asignado ON t.asignado_a = u_asignado.id
       LEFT JOIN usuarios u_creador ON t.creado_por = u_creador.id
       WHERE t.id = ?
       LIMIT 1`,
      [req.params.id],
    );
    const tarea = (rows as any[])[0];
    if (!tarea) return resJson(res, 404, { error: 'Tarea no encontrada' });
    return resJson(res, 200, tarea);
  } catch (error) {
    next(error);
  }
};

export const crearTarea = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usuario = (req as any).user;
    const {
      titulo,
      descripcion,
      estado,
      prioridad,
      asignado_a,
      entidad_tipo,
      entidad_id,
      vencimiento,
    } = req.body;

    if (!titulo) return resJson(res, 400, { error: 'titulo es obligatorio' });

    const [result] = await pool.execute(
      `INSERT INTO admin_tareas
       (titulo, descripcion, estado, prioridad, asignado_a, creado_por,
        entidad_tipo, entidad_id, vencimiento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        descripcion || null,
        estado || 'pendiente',
        prioridad || 'media',
        asignado_a || null,
        usuario?.id,
        entidad_tipo || null,
        entidad_id || null,
        vencimiento || null,
      ],
    );

    const [rows] = await pool.execute(
      `SELECT t.*, u_asignado.nombre as asignado_nombre, u_creador.nombre as creador_nombre
       FROM admin_tareas t
       LEFT JOIN usuarios u_asignado ON t.asignado_a = u_asignado.id
       LEFT JOIN usuarios u_creador ON t.creado_por = u_creador.id
       WHERE t.id = ?
       LIMIT 1`,
      [(result as any).insertId],
    );

    return resJson(res, 201, (rows as any[])[0]);
  } catch (error) {
    next(error);
  }
};

export const actualizarTarea = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const permitidos = ['titulo', 'descripcion', 'estado', 'prioridad', 'asignado_a', 'entidad_tipo', 'entidad_id', 'vencimiento'];
    const sets: string[] = [];
    const values: any[] = [];

    for (const k of permitidos) {
      if (req.body[k] !== undefined) {
        sets.push(`${k} = ?`);
        values.push(req.body[k]);
      }
    }

    if (sets.length === 0) return resJson(res, 400, { error: 'No hay campos para actualizar' });

    sets.push('actualizado_at = NOW()');
    values.push(id);

    await pool.execute(
      `UPDATE admin_tareas SET ${sets.join(', ')} WHERE id = ?`,
      values,
    );

    const [rows] = await pool.execute(
      `SELECT t.*, u_asignado.nombre as asignado_nombre, u_creador.nombre as creador_nombre
       FROM admin_tareas t
       LEFT JOIN usuarios u_asignado ON t.asignado_a = u_asignado.id
       LEFT JOIN usuarios u_creador ON t.creado_por = u_creador.id
       WHERE t.id = ?
       LIMIT 1`,
      [id],
    );

    return resJson(res, 200, (rows as any[])[0]);
  } catch (error) {
    next(error);
  }
};

export const cambiarEstadoTarea = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { estado } = req.body;
    const validos = ['pendiente', 'en_progreso', 'completada', 'cancelada'];
    if (!validos.includes(estado)) {
      return resJson(res, 400, { error: 'estado no válido' });
    }

    await pool.execute(
      'UPDATE admin_tareas SET estado = ?, actualizado_at = NOW() WHERE id = ?',
      [estado, req.params.id],
    );

    const [rows] = await pool.execute(
      'SELECT * FROM admin_tareas WHERE id = ? LIMIT 1',
      [req.params.id],
    );

    return resJson(res, 200, (rows as any[])[0]);
  } catch (error) {
    next(error);
  }
};

export const eliminarTarea = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await pool.execute('DELETE FROM admin_tareas WHERE id = ?', [req.params.id]);
    return resJson(res, 200, { id: req.params.id, eliminada: true });
  } catch (error) {
    next(error);
  }
};
