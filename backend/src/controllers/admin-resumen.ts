import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

export const getAdminResumen = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user?.rol === 'admin';

    const [
      [usuariosRows],
      [anunciosRows],
      [activosRows],
      [pendientesRows],
      [sugerenciasRows],
      [comunidadRows],
      [reportesRows],
      [staffRows],
      [reportesTotalRows],
      [verificadosRows],
      [rechazadosRows],
      [ocultosRows],
    ] = await Promise.all([
      pool.execute('SELECT COUNT(*) as total FROM usuarios'),
      pool.execute('SELECT COUNT(*) as total FROM anuncios'),
      pool.execute('SELECT COUNT(*) as total FROM anuncios WHERE visible = 1 AND estado_moderacion = ?', ['approved']),
      pool.execute('SELECT COUNT(*) as total FROM anuncios WHERE estado_moderacion = ?', ['pending']),
      pool.execute('SELECT COUNT(*) as total FROM sugerencias'),
      pool.execute('SELECT COUNT(*) as total FROM comunidad_publicaciones'),
      pool.execute('SELECT COUNT(*) as total FROM comunidad_reportes WHERE estado = ?', ['pendiente']),
      pool.execute('SELECT COUNT(*) as total FROM usuarios WHERE rol IN (?, ?)', ['admin', 'moderador']),
      pool.execute('SELECT COUNT(*) as total FROM comunidad_reportes'),
      pool.execute('SELECT COUNT(*) as total FROM usuarios WHERE verificado = 1'),
      pool.execute('SELECT COUNT(*) as total FROM anuncios WHERE estado_moderacion = ?', ['rejected']),
      pool.execute('SELECT COUNT(*) as total FROM anuncios WHERE visible = 0'),
    ] as any);

    res.status(200).json({
      success: true,
      data: {
        usuarios: usuariosRows[0].total,
        anuncios: anunciosRows[0].total,
        anuncios_activos: activosRows[0].total,
        anuncios_pendientes: pendientesRows[0].total,
        anuncios_rechazados: rechazadosRows[0].total,
        anuncios_ocultos: ocultosRows[0].total,
        sugerencias: sugerenciasRows[0].total,
        publicaciones_comunidad: comunidadRows[0].total,
        reportes_pendientes: reportesRows[0].total,
        reportes_total: reportesTotalRows[0].total,
        usuarios_verificados: verificadosRows[0].total,
        staff: staffRows[0].total,
        db_conectada: true,
        backend_status: 'ok',
        version: process.env.npm_package_version || '1.0.0',
        ultima_actualizacion: new Date().toISOString(),
      },
      permisos: {
        admin: isAdmin,
        moderador: true,
      },
    });
  } catch (error) {
    console.error('Error en getAdminResumen:', error);
    logger.error('Error en getAdminResumen: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
