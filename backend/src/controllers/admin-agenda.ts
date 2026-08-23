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

export const listarNotas = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const inicio = String(req.query.inicio || '1900-01-01');
    const fin = String(req.query.fin || '2099-12-31');
    const [rows] = await pool.execute(
      `SELECT id, titulo, cuerpo, fecha, color, usuario_id, creado_at, actualizado_at
       FROM agenda_notas
       WHERE fecha >= ? AND fecha <= ?
       ORDER BY fecha, creado_at DESC`,
      [inicio, fin],
    );
    return resJson(res, 200, rows);
  } catch (error) {
    next(error);
  }
};

export const getNota = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM agenda_notas WHERE id = ? LIMIT 1',
      [req.params.id],
    );
    const nota = (rows as any[])[0];
    if (!nota) return resJson(res, 404, { error: 'Nota no encontrada' });
    return resJson(res, 200, nota);
  } catch (error) {
    next(error);
  }
};

export const crearNota = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usuario = (req as any).user;
    const { titulo, cuerpo, fecha, color } = req.body;
    if (!titulo || !fecha) {
      return resJson(res, 400, { error: 'título y fecha son obligatorios' });
    }
    const [result] = await pool.execute(
      `INSERT INTO agenda_notas (titulo, cuerpo, fecha, color, usuario_id)
       VALUES (?, ?, ?, ?, ?)`,
      [titulo, cuerpo || '', fecha, color || 'orange', usuario?.id],
    );
    const id = (result as any).insertId;
    const [rows] = await pool.execute(
      'SELECT * FROM agenda_notas WHERE id = ? LIMIT 1',
      [id],
    );
    return resJson(res, 201, (rows as any[])[0]);
  } catch (error) {
    next(error);
  }
};

export const actualizarNota = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { titulo, cuerpo, fecha, color } = req.body;
    await pool.execute(
      'UPDATE agenda_notas SET titulo = ?, cuerpo = ?, fecha = ?, color = ? WHERE id = ?',
      [titulo, cuerpo || '', fecha, color || 'orange', req.params.id],
    );
    const [rows] = await pool.execute(
      'SELECT * FROM agenda_notas WHERE id = ? LIMIT 1',
      [req.params.id],
    );
    return resJson(res, 200, (rows as any[])[0]);
  } catch (error) {
    next(error);
  }
};

export const eliminarNota = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await pool.execute('DELETE FROM agenda_notas WHERE id = ?', [req.params.id]);
    return resJson(res, 200, { id: req.params.id });
  } catch (error) {
    next(error);
  }
};
