import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

export const getAdminAnuncios = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    const {
      page = '1',
      limit = '20',
      ordenar = 'reciente',
      search,
      estado,
      categoria,
      comunidad,
      provincia,
      reportes,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions: string[] = [];
    const havingConditions: string[] = [];
    const params: (string | number)[] = [];

    if (estado && typeof estado === 'string' && ['approved', 'rejected', 'pending', 'flagged'].includes(estado)) {
      whereConditions.push('a.estado_moderacion = ?');
      params.push(estado);
    }

    if (categoria && typeof categoria === 'string') {
      whereConditions.push('a.categoria = ?');
      params.push(categoria);
    }

    if (comunidad && typeof comunidad === 'string') {
      whereConditions.push('a.comunidad_autonoma = ?');
      params.push(comunidad);
    }

    if (provincia && typeof provincia === 'string') {
      whereConditions.push('a.provincia = ?');
      params.push(provincia);
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      whereConditions.push(
        '(LOWER(a.titulo) LIKE LOWER(?) OR LOWER(a.descripcion) LIKE LOWER(?) OR LOWER(u.email) LIKE LOWER(?) OR LOWER(u.nombre) LIKE LOWER(?))'
      );
      params.push(q, q, q, q);
    }

    const reportesValue = reportes && typeof reportes === 'string' ? reportes.toLowerCase() : '';
    if (reportesValue === 'con' || reportesValue === 'si') {
      havingConditions.push('reportes > 0');
    } else if (reportesValue === 'sin' || reportesValue === 'no') {
      havingConditions.push('reportes = 0');
    }

    let orderBy = 'a.creado_at DESC';
    const ordenarValue = ordenar && typeof ordenar === 'string' ? ordenar.toLowerCase() : 'reciente';
    switch (ordenarValue) {
      case 'antiguo':
      case 'creado-asc':
        orderBy = 'a.creado_at ASC';
        break;
      case 'reportes':
      case 'reportes-desc':
        orderBy = 'reportes DESC, a.creado_at DESC';
        break;
      case 'titulo-asc':
        orderBy = 'a.titulo ASC';
        break;
      case 'titulo-desc':
        orderBy = 'a.titulo DESC';
        break;
      case 'reciente':
      case 'creado-desc':
      default:
        orderBy = 'a.creado_at DESC';
        break;
    }

    const where = whereConditions.length ? whereConditions.join(' AND ') : '1=1';
    const having = havingConditions.length ? `HAVING ${havingConditions.join(' AND ')}` : '';

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT SQL_CALC_FOUND_ROWS
          a.id, a.usuario_id, a.titulo, a.descripcion, a.categoria, a.comunidad_autonoma,
          a.provincia, a.estado_moderacion, a.motivo_rechazo, a.creado_at, a.actualizado_at, a.visible,
          u.nombre as usuario_nombre, u.email as usuario_email,
          COUNT(r.id) as reportes,
          ml.creado_at as moderado_at,
          mu.nombre as moderado_por_nombre
        FROM anuncios a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        LEFT JOIN reportes_anuncios r ON a.id = r.anuncio_id
        LEFT JOIN (
          SELECT anuncio_id, moderador_id, creado_at
          FROM (
            SELECT anuncio_id, moderador_id, creado_at,
                   ROW_NUMBER() OVER (PARTITION BY anuncio_id ORDER BY creado_at DESC, id DESC) AS rn
            FROM moderacion_logs
          ) ranked
          WHERE rn = 1
        ) ml ON ml.anuncio_id = a.id
        LEFT JOIN usuarios mu ON ml.moderador_id = mu.id
        WHERE ${where}
        GROUP BY a.id
        ${having}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?`,
        [...params, limitNum, offset]
      );

      const [countRows] = await connection.execute('SELECT FOUND_ROWS() as total');
      const total = ((countRows as any[])[0]?.total as number) || 0;
      const totalPages = Math.max(1, Math.ceil(total / limitNum));

      const data = (rows as any[]).map((a) => ({
        id: a.id,
        usuario_id: a.usuario_id,
        titulo: a.titulo,
        descripcion: a.descripcion,
        categoria: a.categoria,
        estado: a.estado_moderacion,
        estado_moderacion: a.estado_moderacion,
        comunidad: a.comunidad_autonoma,
        comunidad_autonoma: a.comunidad_autonoma,
        provincia: a.provincia,
        creado_at: a.creado_at,
        fecha: a.creado_at,
        actualizado_at: a.actualizado_at,
        visible: a.visible,
        autor: a.usuario_nombre || null,
        usuario_nombre: a.usuario_nombre || null,
        email: a.usuario_email || null,
        usuario_email: a.usuario_email || null,
        reportes: Number(a.reportes || 0),
        moderado_at: a.moderado_at,
        moderado_por_nombre: a.moderado_por_nombre,
        motivo_rechazo: a.motivo_rechazo,
      }));

      res.status(200).json({
        success: true,
        data,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    logger.error('Error en getAdminAnuncios:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
