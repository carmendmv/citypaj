import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

const ROLES_PERMITIDOS = ['usuario', 'moderador', 'admin'];

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
      `SELECT id, nombre, email, verificado, rol, activo, creado_at FROM usuarios ${whereClause} ORDER BY creado_at DESC LIMIT ? OFFSET ?`,
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
      'SELECT id, nombre, email, verificado, rol, activo, creado_at FROM usuarios WHERE id = ?',
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
    const actorId = req.user!.id;

    if (!rol || !ROLES_PERMITIDOS.includes(rol)) {
      res.status(400).json({ success: false, error: 'Rol no válido' });
      return;
    }

    const [prevRows] = await pool.execute('SELECT rol FROM usuarios WHERE id = ?', [id]);
    const prevRol = (prevRows as any[])[0]?.rol;

    await pool.execute('UPDATE usuarios SET rol = ? WHERE id = ?', [rol, id]);

    await logAdminActivity(actorId, 'cambio_rol', 'usuarios', id, `Rol cambiado de ${prevRol} a ${rol}`);

    res.status(200).json({ success: true, message: 'Rol actualizado correctamente' });
  } catch (error) {
    logger.error('Error en updateRolUsuario:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const updateEstadoUsuario = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { activo } = req.body;
    const actorId = req.user!.id;

    if (typeof activo !== 'boolean' && typeof activo !== 'number') {
      res.status(400).json({ success: false, error: 'Estado no válido' });
      return;
    }

    const value = activo === true || activo === 1 ? 1 : 0;
    await pool.execute('UPDATE usuarios SET activo = ? WHERE id = ?', [value, id]);

    await logAdminActivity(actorId, value ? 'activar_usuario' : 'desactivar_usuario', 'usuarios', id, `Usuario ${value ? 'activado' : 'desactivado'}`);

    res.status(200).json({ success: true, message: 'Estado actualizado correctamente' });
  } catch (error) {
    logger.error('Error en updateEstadoUsuario:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const createModerador = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      res.status(400).json({ success: false, error: 'Nombre, email y contraseña son obligatorios' });
      return;
    }

    const [existing] = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      res.status(409).json({ success: false, error: 'El email ya está registrado' });
      return;
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);

    await pool.execute(
      'INSERT INTO usuarios (id, nombre, email, password_hash, rol, verificado, activo) VALUES (?, ?, ?, ?, ?, 1, 1)',
      [id, nombre, email, passwordHash, 'moderador']
    );

    await logAdminActivity(req.user!.id, 'crear_moderador', 'usuarios', id, `Moderador creado: ${email}`);

    res.status(201).json({ success: true, message: 'Moderador creado correctamente', data: { id, nombre, email } });
  } catch (error) {
    logger.error('Error en createModerador:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

const logAdminActivity = async (
  usuario_id: string,
  accion: string,
  entidad: string,
  entidad_id: string,
  detalle: string
) => {
  try {
    await pool.execute(
      'INSERT INTO admin_activity_logs (usuario_id, accion, entidad, entidad_id, detalle) VALUES (?, ?, ?, ?, ?)',
      [usuario_id, accion, entidad, entidad_id, detalle]
    );
  } catch (err) {
    logger.error('Error registrando log admin:', (err as Error).message);
  }
};
