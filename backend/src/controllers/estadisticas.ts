import { Request, Response } from 'express';
import { pool } from '../config/database';

export const getEstadisticasHome = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [[anunciosRows]] = await pool.execute('SELECT COUNT(*) as total FROM anuncios WHERE visible = 1 AND estado_moderacion = \'approved\'') as any;
    const [[usuariosRows]] = await pool.execute('SELECT COUNT(*) as total FROM usuarios') as any;
    const [[sugerenciasRows]] = await pool.execute('SELECT COUNT(*) as total FROM sugerencias') as any;
    const [[provinciasRows]] = await pool.execute('SELECT COUNT(DISTINCT provincia) as total FROM anuncios WHERE provincia IS NOT NULL') as any;

    res.status(200).json({
      success: true,
      data: {
        anuncios_publicados: anunciosRows.total,
        usuarios_registrados: usuariosRows.total,
        sugerencias_recibidas: sugerenciasRows.total,
        comunidades_activas: provinciasRows.total
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getEstadisticasProvincia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { provincia } = req.params;

    const [[anunciosRows]] = await pool.execute(
      'SELECT COUNT(*) as total FROM anuncios WHERE provincia = ? AND visible = 1 AND estado_moderacion = \'approved\'',
      [provincia]
    ) as any;

    const [[sugerenciasRows]] = await pool.execute(
      'SELECT COUNT(*) as total FROM sugerencias WHERE comunidad_autonoma = ?',
      [provincia]
    ) as any;

    res.status(200).json({
      success: true,
      data: {
        anuncios: anunciosRows.total,
        sugerencias: sugerenciasRows.total
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas por provincia:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
