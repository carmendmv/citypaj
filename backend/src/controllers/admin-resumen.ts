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

export const getNecesidades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const provincia = (req.query.provincia as string || '').trim();
    const tema = (req.query.tema as string || '').trim();

    let whereSugerencias = '1=1';
    let wherePropuestas = '1=1';
    let whereComunidad = '1=1';
    const values: any[] = [];

    if (provincia) {
      whereSugerencias += ' AND s.comunidad_autonoma = ?';
      wherePropuestas += ' AND p.provincia = ?';
      whereComunidad += ' AND cp.provincia = ?';
      values.push(provincia, provincia, provincia);
    }
    if (tema) {
      whereSugerencias += ' AND s.categoria = ?';
      wherePropuestas += ' AND p.categoria = ?';
      whereComunidad += ' AND cp.tema = ?';
      values.push(tema, tema, tema);
    }

    const query = `
      SELECT * FROM (
        SELECT
          provincia,
          tema,
          COUNT(DISTINCT sugerencia_id) AS sugerencias,
          COUNT(DISTINCT propuesta_id) AS propuestas,
          COUNT(DISTINCT publicacion_id) AS publicaciones,
          SUM(apoyos) AS apoyos,
          SUM(reportes) AS reportes,
          MAX(ultima_actividad) AS ultima_actividad,
          CASE
            WHEN COUNT(DISTINCT sugerencia_id) > 20 OR SUM(reportes) > 10 THEN 'critica'
            WHEN COUNT(DISTINCT sugerencia_id) > 10 OR SUM(apoyos) > 30 THEN 'alta'
            WHEN COUNT(DISTINCT sugerencia_id) > 5 THEN 'media'
            ELSE 'baja'
          END AS prioridad
        FROM (
          SELECT s.comunidad_autonoma AS provincia, s.categoria AS tema, s.id AS sugerencia_id, NULL AS propuesta_id, NULL AS publicacion_id,
                 0 AS apoyos, 0 AS reportes, s.fecha AS ultima_actividad
          FROM sugerencias s
          WHERE ${whereSugerencias}
          UNION ALL
          SELECT p.provincia, p.categoria AS tema, NULL, p.id, NULL, COUNT(pa.id) AS apoyos, 0, p.creado_at
          FROM propuestas p
          LEFT JOIN propuestas_apoyos pa ON p.id = pa.propuesta_id
          WHERE ${wherePropuestas}
          GROUP BY p.id
          UNION ALL
          SELECT cp.provincia, cp.tema, NULL, NULL, cp.id, 0, COALESCE(cr.total, 0), cp.creado_at
          FROM comunidad_publicaciones cp
          LEFT JOIN (
            SELECT objeto_id, COUNT(*) AS total
            FROM comunidad_reportes
            WHERE tipo = 'publicacion'
            GROUP BY objeto_id
          ) cr ON cp.id = cr.objeto_id
          WHERE ${whereComunidad}
        ) AS unido
        WHERE provincia IS NOT NULL
        GROUP BY provincia, tema
      ) AS agrupado
      ORDER BY
        FIELD(prioridad, 'critica', 'alta', 'media', 'baja'),
        sugerencias DESC,
        propuestas DESC,
        publicaciones DESC
      LIMIT 100
    `;

    const [rows] = await pool.execute(query, values);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    logger.error('Error en getNecesidades: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getAccionesDashboard = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      [anunciosPendientes],
      [reportesPendientes],
      [sugerenciasSinTrasladar],
      [propuestasSinTrasladar],
      [sugerenciasPorTema],
      [propuestasApoyo],
      [ultimosLogs],
      [tareasPendientes],
    ] = await Promise.all([
      pool.execute('SELECT id, titulo, categoria, provincia FROM anuncios WHERE estado_moderacion = ? ORDER BY creado_at DESC LIMIT 5', ['pending']),
      pool.execute('SELECT cr.id, cr.motivo, cp.titulo, cp.provincia FROM comunidad_reportes cr JOIN comunidad_publicaciones cp ON cr.objeto_id = cp.id WHERE cr.estado = ? ORDER BY cr.creado DESC LIMIT 5', ['pendiente']),
      pool.execute('SELECT id, titulo, categoria, comunidad_autonoma AS provincia, prioridad, fecha FROM sugerencias WHERE trasladada = 0 ORDER BY fecha DESC LIMIT 6'),
      pool.execute('SELECT p.id, p.titulo, p.provincia, p.categoria AS tema, COUNT(pa.id) AS apoyos FROM propuestas p LEFT JOIN propuestas_apoyos pa ON p.id = pa.propuesta_id WHERE p.trasladada = 0 GROUP BY p.id HAVING apoyos > 0 ORDER BY apoyos DESC LIMIT 6'),
      pool.execute('SELECT comunidad_autonoma AS provincia, categoria, COUNT(*) AS total FROM sugerencias WHERE trasladada = 0 GROUP BY comunidad_autonoma, categoria ORDER BY total DESC LIMIT 6'),
      pool.execute('SELECT p.id, p.titulo, p.provincia, p.categoria AS tema, COUNT(pa.id) AS apoyos FROM propuestas p LEFT JOIN propuestas_apoyos pa ON p.id = pa.propuesta_id WHERE p.trasladada = 0 GROUP BY p.id ORDER BY apoyos DESC LIMIT 6'),
      pool.execute('SELECT a.accion, a.entidad, a.entidad_id, a.creado_at, u.nombre FROM admin_activity_logs a LEFT JOIN usuarios u ON a.usuario_id = u.id ORDER BY a.creado_at DESC LIMIT 8'),
      pool.execute('SELECT id, titulo, estado, prioridad FROM admin_tareas WHERE estado != ? ORDER BY creado_at DESC LIMIT 6', ['completada']),
    ] as any);

    res.status(200).json({
      success: true,
      data: {
        acciones_rapidas: {
          anuncios_pendientes: anunciosPendientes,
          reportes_pendientes: reportesPendientes,
        },
        sugerencias_sin_trasladar: sugerenciasSinTrasladar,
        propuestas_sin_trasladar: propuestasSinTrasladar,
        sugerencias_agrupadas: sugerenciasPorTema,
        propuestas_populares: propuestasApoyo,
        actividad_reciente: ultimosLogs,
        tareas_pendientes: tareasPendientes,
      },
    });
  } catch (error) {
    logger.error('Error en getAccionesDashboard: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
