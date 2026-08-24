import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

export const getAdminLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '50', entidad = '' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit as string) || 50));
    const offset = (pageNum - 1) * limitNum;

    const where: string[] = [];
    const params: any[] = [];
    if (entidad) {
      where.push('entidad = ?');
      params.push(entidad);
    }
    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [rows] = await pool.execute(
      `SELECT l.*, u.nombre, u.email, u.rol
       FROM admin_activity_logs l
       LEFT JOIN usuarios u ON l.usuario_id = u.id
       ${whereClause}
       ORDER BY l.creado_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM admin_activity_logs ${whereClause}`,
      params
    );

    res.status(200).json({
      success: true,
      data: rows,
      meta: { page: pageNum, limit: limitNum, total: (countRows as any[])[0]?.total || 0 },
    });
  } catch (error) {
    logger.error('Error en getAdminLogs:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
