import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

export const listarMensajes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const tipo = req.query.tipo === 'enviados' ? 'enviados' : 'recibidos';

    if (tipo === 'enviados') {
      const [rows] = await pool.execute(
        `SELECT m.*, u.email AS destinatario_email, u.nombre AS destinatario_nombre
         FROM mensajes_staff m
         LEFT JOIN usuarios u ON m.destinatario_id = u.id
         WHERE m.remitente_id = ?
         ORDER BY m.creado_at DESC`,
        [userId]
      );
      res.json({ success: true, data: rows });
      return;
    }

    const [rows] = await pool.execute(
      `SELECT m.*, u.email AS remitente_email, u.nombre AS remitente_nombre
       FROM mensajes_staff m
       LEFT JOIN usuarios u ON m.remitente_id = u.id
       WHERE m.destinatario_id = ?
       ORDER BY m.creado_at DESC`,
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    logger.error('Error listando mensajes: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const contarNoLeidos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const [rows] = await pool.execute(
      'SELECT COUNT(*) AS total FROM mensajes_staff WHERE destinatario_id = ? AND leido = 0',
      [userId]
    );
    res.json({ success: true, data: { total: (rows as any[])[0].total } });
  } catch (error) {
    logger.error('Error contando no leídos: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const enviarMensaje = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destinatario_id, asunto, cuerpo } = req.body;

    if (!destinatario_id || !asunto?.trim() || !cuerpo?.trim()) {
      res.status(400).json({ success: false, error: 'Destinatario, asunto y cuerpo son obligatorios' });
      return;
    }

    // Verificar que el destinatario es admin o moderador
    const [staffRows] = await pool.execute(
      'SELECT id, rol FROM usuarios WHERE id = ? AND rol IN (?, ?)',
      [destinatario_id, 'admin', 'moderador']
    );

    if ((staffRows as any[]).length === 0) {
      res.status(400).json({ success: false, error: 'Destinatario no válido' });
      return;
    }

    const [result] = await pool.execute(
      `INSERT INTO mensajes_staff (remitente_id, destinatario_id, asunto, cuerpo, leido)
       VALUES (?, ?, ?, ?, 0)`,
      [Number(req.user!.id), destinatario_id, asunto.trim(), cuerpo.trim()]
    ) as any;

    res.json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    logger.error('Error enviando mensaje: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const marcarLeido = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      'SELECT * FROM mensajes_staff WHERE id = ? AND destinatario_id = ?',
      [id, req.user!.id]
    );

    if ((rows as any[]).length === 0) {
      res.status(404).json({ success: false, error: 'Mensaje no encontrado' });
      return;
    }

    await pool.execute(
      'UPDATE mensajes_staff SET leido = 1, leido_at = NOW() WHERE id = ?',
      [id]
    );

    res.json({ success: true, data: { id } });
  } catch (error) {
    logger.error('Error marcando mensaje leído: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const eliminarMensaje = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    await pool.execute(
      'DELETE FROM mensajes_staff WHERE id = ? AND (destinatario_id = ? OR remitente_id = ?)',
      [id, userId, userId]
    );
    res.json({ success: true, data: { id } });
  } catch (error) {
    logger.error('Error eliminando mensaje: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const listarStaff = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, email, nombre, rol FROM usuarios WHERE rol IN (?, ?) ORDER BY rol, nombre`,
      ['admin', 'moderador']
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    logger.error('Error listando staff: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
