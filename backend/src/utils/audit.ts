import { pool } from '../config/database';
import { logger } from './logger';

export const logAdminActivity = async (
  usuario_id: string,
  accion: string,
  entidad: string,
  entidad_id: string | number | null = null,
  detalle: string = '',
  ip_address?: string
): Promise<void> => {
  try {
    await pool.execute(
      'INSERT INTO admin_activity_logs (usuario_id, accion, entidad, entidad_id, detalle, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [usuario_id, accion, entidad, entidad_id ?? null, detalle, ip_address ?? null]
    );
  } catch (err) {
    logger.error('Error registrando actividad admin: %s', (err as Error).message);
  }
};
