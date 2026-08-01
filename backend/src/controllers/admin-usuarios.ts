import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

const ROLES_PERMITIDOS = ['user', 'moderador', 'admin'];

export const getAdminUsuarios = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '50', search = '', rol = '' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit as string) || 50));
    const offset = (pageNum - 1) * limitNum;

    const where: string[] = [];
    const params: any[] = [];

    if (search && String(search).trim()) {
      const q = `%${String(search).trim().toLowerCase()}%`;
      where.push('(LOWER(nombre) LIKE ? OR LOWER(email) LIKE ?)');
      params.push(q, q);
    }

    if (rol && String(rol).trim()) {
      where.push('rol = ?');
      params.push(rol);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [rows] = await pool.execute(
      `SELECT id, nombre, email, verificado, rol, creado_at FROM usuarios ${whereClause} ORDER BY creado_at DESC LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM usuarios ${whereClause}`,
      params
    );

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        page: pageNum,
        limit: limitNum,
        total: (countRows as any[])[0]?.total || 0,
      },
    });
  } catch (error) {
    logger.error('Error en getAdminUsuarios:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getAdminUsuarioById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT id, nombre, email, verificado, rol, creado_at FROM usuarios WHERE id = ?',
      [id]
    );
    const usuarios = rows as any[];
    if (usuarios.length === 0) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      return;
    }
    res.status(200).json({ success: true, data: usuarios[0] });
  } catch (error) {
    logger.error('Error en getAdminUsuarioById:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const updateRolUsuario = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!rol || !ROLES_PERMITIDOS.includes(rol)) {
      res.status(400).json({ success: false, error: 'Rol no válido' });
      return;
    }

    await pool.execute('UPDATE usuarios SET rol = ? WHERE id = ?', [rol, id]);
    res.status(200).json({ success: true, message: 'Rol actualizado correctamente' });
  } catch (error) {
    logger.error('Error en updateRolUsuario:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
