import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { logAdminActivity } from '../utils/audit';

const ORDENES_ADMIN: Record<string, string> = {
  reciente: 'cp.creado_at DESC',
  'mas-respuestas': 'respuestas_count DESC, cp.creado_at DESC',
  'mas-apoyos': 'likes_count DESC, cp.creado_at DESC',
  'mas-reportadas': 'reportes_pendientes DESC, cp.creado_at DESC',
  'mas-antiguo': 'cp.creado_at ASC'
};

const resolveOrden = (orden?: string): string => ORDENES_ADMIN[orden || ''] || ORDENES_ADMIN.reciente;

export const getAdminPublicaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      provincia,
      tema,
      estado_moderacion,
      reportados,
      busqueda,
      orden,
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions: string[] = ['1=1'];
    const queryParams: any[] = [];

    if (provincia) {
      whereConditions.push('cp.provincia = ?');
      queryParams.push(provincia);
    }
    if (tema) {
      whereConditions.push('cp.tema = ?');
      queryParams.push(tema);
    }
    if (estado_moderacion) {
      whereConditions.push('cp.estado_moderacion = ?');
      queryParams.push(estado_moderacion);
    }
    if (reportados === 'true' || reportados === '1') {
      whereConditions.push(
        '(SELECT COUNT(*) FROM comunidad_reportes cr WHERE cr.tipo = "publicacion" AND cr.objeto_id = cp.id AND cr.estado = "pendiente") > 0'
      );
    }
    if (busqueda && String(busqueda).trim()) {
      whereConditions.push('(cp.titulo LIKE ? OR cp.contenido LIKE ?)');
      const q = `%${String(busqueda).trim()}%`;
      queryParams.push(q, q);
    }

    const whereClause = whereConditions.join(' AND ');
    const orderBy = resolveOrden(orden as string | undefined);

    const countQuery = `SELECT COUNT(*) as total FROM comunidad_publicaciones cp WHERE ${whereClause}`;
    const listQuery = `
      SELECT
        cp.id, cp.usuario_id, cp.autor_nombre, cp.ip, cp.ip_creador, cp.titulo, cp.contenido, cp.provincia, cp.tema,
        cp.visible, cp.estado_moderacion, cp.creado_at, cp.actualizado_at,
        COALESCE(cp.autor_nombre, u.nombre, 'Anónimo') as usuario_nombre,
        u.ultima_ip as usuario_ultima_ip,
        (SELECT COUNT(*) FROM comunidad_comentarios cc WHERE cc.publicacion_id = cp.id) as respuestas_count,
        (SELECT COUNT(*) FROM comunidad_likes cl WHERE cl.tipo = 'publicacion' AND cl.objeto_id = cp.id) as likes_count,
        (SELECT COUNT(*) FROM comunidad_reportes cr WHERE cr.tipo = 'publicacion' AND cr.objeto_id = cp.id AND cr.estado = 'pendiente') as reportes_pendientes,
        (SELECT COUNT(*) FROM comunidad_reportes cr WHERE cr.tipo = 'publicacion' AND cr.objeto_id = cp.id) as reportes_total
      FROM comunidad_publicaciones cp
      LEFT JOIN usuarios u ON cp.usuario_id = u.id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const [countRows] = await pool.execute(countQuery, queryParams);
    const [rows] = await pool.execute(listQuery, [...queryParams, limitNum, offset]);

    const total = (countRows as any[])[0]?.total || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: rows,
      meta: { page: pageNum, limit: limitNum, total, totalPages, hasNext: pageNum < totalPages, hasPrev: pageNum > 1 }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getAdminRespuestas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { publicacion_id, reportados, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions: string[] = ['1=1'];
    const queryParams: any[] = [];

    if (publicacion_id) {
      whereConditions.push('cc.publicacion_id = ?');
      queryParams.push(publicacion_id);
    }
    if (reportados === 'true' || reportados === '1') {
      whereConditions.push(
        '(SELECT COUNT(*) FROM comunidad_reportes cr WHERE cr.tipo = "respuesta" AND cr.objeto_id = cc.id AND cr.estado = "pendiente") > 0'
      );
    }

    const whereClause = whereConditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) as total FROM comunidad_comentarios cc WHERE ${whereClause}`;
    const listQuery = `
      SELECT
        cc.id, cc.publicacion_id, cc.usuario_id, cc.autor_nombre, cc.ip, cc.contenido, cc.visible,
        cc.estado_moderacion, cc.creado_at, cc.actualizado_at,
        COALESCE(cc.autor_nombre, u.nombre, 'Anónimo') as usuario_nombre,
        (SELECT COUNT(*) FROM comunidad_reportes cr WHERE cr.tipo = 'respuesta' AND cr.objeto_id = cc.id AND cr.estado = 'pendiente') as reportes_pendientes,
        (SELECT COUNT(*) FROM comunidad_reportes cr WHERE cr.tipo = 'respuesta' AND cr.objeto_id = cc.id) as reportes_total
      FROM comunidad_comentarios cc
      LEFT JOIN usuarios u ON cc.usuario_id = u.id
      WHERE ${whereClause}
      ORDER BY cc.creado_at DESC
      LIMIT ? OFFSET ?
    `;

    const [countRows] = await pool.execute(countQuery, queryParams);
    const [rows] = await pool.execute(listQuery, [...queryParams, limitNum, offset]);

    const total = (countRows as any[])[0]?.total || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: rows,
      meta: { page: pageNum, limit: limitNum, total, totalPages, hasNext: pageNum < totalPages, hasPrev: pageNum > 1 }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const updatePublicacionEstado = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { visible, estado_moderacion } = req.body;

    const sets: string[] = [];
    const params: any[] = [];

    if (typeof visible !== 'undefined') {
      sets.push('visible = ?');
      params.push(visible ? 1 : 0);
    }
    if (estado_moderacion) {
      sets.push('estado_moderacion = ?');
      params.push(estado_moderacion);
    }

    if (sets.length === 0) {
      res.status(400).json({ success: false, error: 'No se ha enviado ningún cambio.' });
      return;
    }

    await pool.execute(
      `UPDATE comunidad_publicaciones SET ${sets.join(', ')} WHERE id = ?`,
      [...params, id]
    );

    await logAdminActivity(req.user!.id, 'actualizar_publicacion', 'comunidad_publicaciones', id, `visible=${visible}, estado=${estado_moderacion}`);

    res.status(200).json({ success: true, message: 'Publicación actualizada.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al actualizar la publicación.' });
  }
};

export const updateRespuestaEstado = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { visible, estado_moderacion } = req.body;

    const sets: string[] = [];
    const params: any[] = [];

    if (typeof visible !== 'undefined') {
      sets.push('visible = ?');
      params.push(visible ? 1 : 0);
    }
    if (estado_moderacion) {
      sets.push('estado_moderacion = ?');
      params.push(estado_moderacion);
    }

    if (sets.length === 0) {
      res.status(400).json({ success: false, error: 'No se ha enviado ningún cambio.' });
      return;
    }

    await pool.execute(
      `UPDATE comunidad_comentarios SET ${sets.join(', ')} WHERE id = ?`,
      [...params, id]
    );

    await logAdminActivity(req.user!.id, 'actualizar_respuesta', 'comunidad_comentarios', id, `visible=${visible}, estado=${estado_moderacion}`);

    res.status(200).json({ success: true, message: 'Respuesta actualizada.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al actualizar la respuesta.' });
  }
};

export const getAdminReportes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tipo, estado, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions: string[] = ['1=1'];
    const queryParams: any[] = [];

    if (tipo) {
      whereConditions.push('cr.tipo = ?');
      queryParams.push(tipo);
    }
    if (estado) {
      whereConditions.push('cr.estado = ?');
      queryParams.push(estado);
    }

    const whereClause = whereConditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) as total FROM comunidad_reportes cr WHERE ${whereClause}`;
    const listQuery = `
      SELECT
        cr.id, cr.usuario_id, cr.autor_nombre, cr.ip, cr.tipo, cr.objeto_id, cr.motivo, cr.descripcion,
        cr.estado, cr.nota_moderacion, cr.creado, cr.revisado,
        u.nombre as usuario_nombre,
        COALESCE(cp.titulo, cc.contenido) as contenido_objeto
      FROM comunidad_reportes cr
      LEFT JOIN usuarios u ON cr.usuario_id = u.id
      LEFT JOIN comunidad_publicaciones cp ON cr.tipo = 'publicacion' AND cr.objeto_id = cp.id
      LEFT JOIN comunidad_comentarios cc ON cr.tipo = 'respuesta' AND cr.objeto_id = cc.id
      WHERE ${whereClause}
      ORDER BY cr.creado DESC
      LIMIT ? OFFSET ?
    `;

    const [countRows] = await pool.execute(countQuery, queryParams);
    const [rows] = await pool.execute(listQuery, [...queryParams, limitNum, offset]);

    const total = (countRows as any[])[0]?.total || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: rows,
      meta: { page: pageNum, limit: limitNum, total, totalPages, hasNext: pageNum < totalPages, hasPrev: pageNum > 1 }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const revisarReporte = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado, nota_moderacion } = req.body;

    if (!estado) {
      res.status(400).json({ success: false, error: 'El estado es obligatorio.' });
      return;
    }

    await pool.execute(
      'UPDATE comunidad_reportes SET estado = ?, nota_moderacion = ?, revisado = NOW() WHERE id = ?',
      [estado, nota_moderacion || '', id]
    );

    await logAdminActivity(req.user!.id, 'revisar_reporte', 'comunidad_reportes', id, `Nuevo estado: ${estado}`);

    res.status(200).json({ success: true, message: 'Reporte actualizado.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al actualizar el reporte.' });
  }
};
