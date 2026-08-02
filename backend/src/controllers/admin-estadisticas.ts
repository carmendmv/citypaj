import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

export const getEstadisticasGenerales = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user?.rol === 'admin';
    if (!isAdmin) {
      res.status(403).json({ success: false, error: 'Permisos insuficientes' });
      return;
    }

    const queries = [
      { key: 'anuncios_por_estado', sql: "SELECT estado_moderacion as estado, COUNT(*) as total FROM anuncios GROUP BY estado_moderacion" },
      { key: 'usuarios_por_rol', sql: "SELECT rol, COUNT(*) as total FROM usuarios GROUP BY rol" },
      { key: 'anuncios_por_categoria', sql: "SELECT categoria, COUNT(*) as total FROM anuncios GROUP BY categoria ORDER BY total DESC LIMIT 10" },
      { key: 'anuncios_por_provincia', sql: "SELECT provincia, COUNT(*) as total FROM anuncios WHERE provincia IS NOT NULL GROUP BY provincia ORDER BY total DESC LIMIT 10" },
      { key: 'comunidad_por_estado', sql: "SELECT estado_moderacion as estado, COUNT(*) as total FROM comunidad_publicaciones GROUP BY estado_moderacion" },
      { key: 'reportes_por_estado', sql: "SELECT estado, COUNT(*) as total FROM comunidad_reportes GROUP BY estado" },
    ];

    const data: Record<string, any> = {};
    for (const q of queries) {
      const [rows] = await pool.execute(q.sql);
      data[q.key] = rows;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error('Error en getEstadisticasGenerales:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getTerritorios = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        a.provincia,
        p.comunidad_id,
        c.nombre as comunidad_autonoma,
        COUNT(DISTINCT a.id) as anuncios,
        COUNT(DISTINCT cp.id) as publicaciones,
        COUNT(DISTINCT s.id) as sugerencias,
        COUNT(DISTINCT pr.id) as propuestas
      FROM provincias p
      LEFT JOIN anuncios a ON a.provincia = p.nombre
      LEFT JOIN comunidad_publicaciones cp ON cp.provincia = p.nombre
      LEFT JOIN sugerencias s ON s.comunidad_autonoma = c.nombre
      LEFT JOIN propuestas pr ON pr.provincia = p.nombre
      LEFT JOIN comunidades c ON c.id = p.comunidad_id
      GROUP BY p.id
      ORDER BY anuncios DESC, publicaciones DESC
      LIMIT 20
    `);

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    logger.error('Error en getTerritorios:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getNecesidadesJuveniles = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [categorias] = await pool.execute(`
      SELECT categoria, COUNT(*) as total
      FROM sugerencias
      GROUP BY categoria
      ORDER BY total DESC
      LIMIT 10
    `);

    const [temas] = await pool.execute(`
      SELECT tema, COUNT(*) as total
      FROM anuncios
      WHERE tema IS NOT NULL AND tema != ''
      GROUP BY tema
      ORDER BY total DESC
      LIMIT 10
    `);

    const [provincias] = await pool.execute(`
      SELECT comunidad_autonoma as comunidad, COUNT(*) as total
      FROM sugerencias
      GROUP BY comunidad_autonoma
      ORDER BY total DESC
      LIMIT 10
    `);

    res.status(200).json({
      success: true,
      data: {
        categorias,
        temas,
        provincias,
      },
    });
  } catch (error) {
    logger.error('Error en getNecesidadesJuveniles:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
