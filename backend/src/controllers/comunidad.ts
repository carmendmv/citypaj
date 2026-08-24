import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { getComunidades } from '../lib/territorios';

const TEMAS = [
  'Empleo', 'Formación', 'Vivienda', 'Cultura', 'Ocio', 'Transporte',
  'Ayudas', 'Salud mental', 'Participación ciudadana', 'Voluntariado',
  'Problemas de la ciudad', 'Propuestas de mejora', 'Dudas generales'
];

const ORDENES_PUBLICAS: Record<string, string> = {
  reciente: 'cp.creado_at DESC',
  'mas-respuestas': 'respuestas_count DESC, cp.creado_at DESC',
  'mas-apoyos': 'likes_count DESC, cp.creado_at DESC',
  'mas-reportadas': 'reportes_pendientes DESC, cp.creado_at DESC',
  'sin-responder': 'respuestas_count ASC, cp.creado_at DESC'
};

const resolveOrden = (orden?: string): string => ORDENES_PUBLICAS[orden || ''] || ORDENES_PUBLICAS.reciente;

const limpiarTexto = (texto: string) => texto.replace(/<[^>]*>?/gm, '').trim();

const obtenerIp = (req: AuthRequest): string => {
  const forwarded = (req.headers['x-forwarded-for'] as string || '').split(',')[0].trim();
  return forwarded || req.socket?.remoteAddress || '0.0.0.0';
};

const obtenerNombre = (req: AuthRequest, bodyNombre?: string): { usuarioId: string | undefined; autorNombre: string | undefined } => {
  return { usuarioId: req.user?.id, autorNombre: bodyNombre };
};

export const getTemas = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, data: TEMAS });
};

export const getProvincias = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: getComunidades().map((comunidad) => ({
        id: comunidad.id,
        nombre: comunidad.nombre,
        tipo: comunidad.tipo,
        provincias: comunidad.provincias.map((p) => p.nombre)
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getPublicaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      provincia,
      comunidad_autonoma,
      tema,
      busqueda,
      orden,
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 20));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions: string[] = ['cp.visible = 1 AND cp.estado_moderacion = "approved"'];
    const queryParams: any[] = [];

    if (provincia) {
      whereConditions.push('cp.provincia = ?');
      queryParams.push(provincia);
    } else if (comunidad_autonoma) {
      whereConditions.push(
        'cp.provincia IN (SELECT p.nombre FROM provincias p JOIN comunidades c ON p.comunidad_id = c.id WHERE c.nombre = ?)'
      );
      queryParams.push(comunidad_autonoma);
    }

    if (tema && TEMAS.includes(tema as string)) {
      whereConditions.push('cp.tema = ?');
      queryParams.push(tema);
    }

    if (busqueda && String(busqueda).trim()) {
      whereConditions.push('(cp.titulo LIKE ? OR cp.contenido LIKE ?)');
      const q = `%${String(busqueda).trim()}%`;
      queryParams.push(q, q);
    }

    if (orden === 'sin-responder') {
      whereConditions.push(
        '(SELECT COUNT(*) FROM comunidad_comentarios cc WHERE cc.publicacion_id = cp.id AND cc.visible = 1 AND cc.estado_moderacion = "approved") = 0'
      );
    }

    const whereClause = whereConditions.join(' AND ');
    const orderBy = resolveOrden(orden as string | undefined);

    const countQuery = `SELECT COUNT(*) as total FROM comunidad_publicaciones cp WHERE ${whereClause}`;
    const listQuery = `
      SELECT
        cp.id,
        cp.usuario_id,
        cp.titulo,
        cp.contenido,
        cp.provincia,
        cp.tema,
        cp.visible,
        cp.estado_moderacion,
        cp.creado_at,
        cp.actualizado_at,
        COALESCE(cp.autor_nombre, u.nombre, 'Anónimo') as usuario_nombre,
        (SELECT COUNT(*) FROM comunidad_comentarios cc WHERE cc.publicacion_id = cp.id AND cc.visible = 1 AND cc.estado_moderacion = "approved") as respuestas_count,
        (SELECT COUNT(*) FROM comunidad_likes cl WHERE cl.tipo = 'publicacion' AND cl.objeto_id = cp.id) as likes_count,
        (SELECT COUNT(*) FROM comunidad_reportes cr WHERE cr.tipo = 'publicacion' AND cr.objeto_id = cp.id AND cr.estado = 'pendiente') as reportes_pendientes
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
    console.error('Error en getPublicaciones:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getPublicacionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ip = obtenerIp(req as AuthRequest);

    const [publicacionRows] = await pool.execute(
      `SELECT
        cp.id, cp.usuario_id, cp.titulo, cp.contenido, cp.provincia, cp.tema,
        cp.estado_moderacion, cp.visible, cp.creado_at, cp.actualizado_at,
        COALESCE(cp.autor_nombre, u.nombre, 'Anónimo') as usuario_nombre,
        (SELECT COUNT(*) FROM comunidad_likes cl WHERE cl.tipo = 'publicacion' AND cl.objeto_id = cp.id) as likes_count,
        (SELECT COUNT(*) FROM comunidad_comentarios cc WHERE cc.publicacion_id = cp.id AND cc.visible = 1 AND cc.estado_moderacion = 'approved') as respuestas_count
       FROM comunidad_publicaciones cp
       LEFT JOIN usuarios u ON cp.usuario_id = u.id
       WHERE cp.id = ? AND cp.visible = 1 AND cp.estado_moderacion = 'approved'`,
      [id]
    );

    const publicaciones = publicacionRows as any[];
    if (publicaciones.length === 0) {
      res.status(404).json({ success: false, error: 'Publicación no encontrada' });
      return;
    }

    const publicacion = publicaciones[0];

    const [comentarios] = await pool.execute(
      `SELECT
        cc.id, cc.usuario_id, cc.contenido, cc.visible, cc.estado_moderacion,
        cc.creado_at, cc.actualizado_at,
        COALESCE(cc.autor_nombre, u.nombre, 'Anónimo') as usuario_nombre,
        (SELECT COUNT(*) FROM comunidad_likes cl WHERE cl.tipo = 'respuesta' AND cl.objeto_id = cc.id) as likes_count
       FROM comunidad_comentarios cc
       LEFT JOIN usuarios u ON cc.usuario_id = u.id
       WHERE cc.publicacion_id = ? AND cc.visible = 1 AND cc.estado_moderacion = 'approved'
       ORDER BY cc.creado_at ASC`,
      [id]
    );

    const [likes] = await pool.execute(
      'SELECT 1 FROM comunidad_likes WHERE tipo = "publicacion" AND objeto_id = ? AND ip = ? LIMIT 1',
      [id, ip]
    );
    const meGusta = (likes as any[]).length > 0;

    res.status(200).json({
      success: true,
      data: {
        ...publicacion,
        comentarios,
        me_gusta: meGusta
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const createPublicacion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { titulo, contenido, provincia, tema, nombre_usuario } = req.body;
    const { usuarioId, autorNombre } = obtenerNombre(req, nombre_usuario);
    const ip = obtenerIp(req);

    const tituloLimpio = limpiarTexto(titulo || '');
    const contenidoLimpio = limpiarTexto(contenido || '');

    if (tituloLimpio.length < 5) {
      res.status(400).json({ success: false, error: 'El título es demasiado corto.' });
      return;
    }
    if (contenidoLimpio.length < 10) {
      res.status(400).json({ success: false, error: 'El contenido es demasiado corto.' });
      return;
    }
    if (!provincia || !tema || !TEMAS.includes(tema)) {
      res.status(400).json({ success: false, error: 'Provincia y tema son obligatorios.' });
      return;
    }
    if (!autorNombre || autorNombre.trim().length < 2) {
      res.status(400).json({ success: false, error: 'El nombre de usuario es obligatorio.' });
      return;
    }

    const [provinciaRows] = await pool.execute(
      'SELECT 1 FROM provincias WHERE nombre = ? LIMIT 1',
      [provincia]
    );
    if ((provinciaRows as any[]).length === 0) {
      res.status(400).json({ success: false, error: 'Provincia no válida.' });
      return;
    }

    const [result] = await pool.execute(
      `INSERT INTO comunidad_publicaciones
       (usuario_id, autor_nombre, ip, ip_creador, titulo, contenido, provincia, tema, visible, estado_moderacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'approved')`,
      [usuarioId || null, autorNombre.trim(), ip, ip, tituloLimpio, contenidoLimpio, provincia, tema]
    ) as any;

    if (usuarioId) {
      await pool.execute('UPDATE usuarios SET ultima_ip = ? WHERE id = ?', [ip, usuarioId]);
    }

    res.status(201).json({
      success: true,
      message: 'Publicación creada correctamente.',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'No se ha podido publicar la conversación.' });
  }
};

export const createRespuesta = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { contenido, nombre_usuario } = req.body;
    const { usuarioId, autorNombre } = obtenerNombre(req, nombre_usuario);
    const ip = obtenerIp(req);

    const contenidoLimpio = limpiarTexto(contenido || '');
    if (contenidoLimpio.length < 3) {
      res.status(400).json({ success: false, error: 'La respuesta debe tener al menos 3 caracteres.' });
      return;
    }
    if (!autorNombre || autorNombre.trim().length < 2) {
      res.status(400).json({ success: false, error: 'El nombre de usuario es obligatorio.' });
      return;
    }

    const [publicacionRows] = await pool.execute(
      'SELECT 1 FROM comunidad_publicaciones WHERE id = ? AND visible = 1 AND estado_moderacion = "approved" LIMIT 1',
      [id]
    );
    if ((publicacionRows as any[]).length === 0) {
      res.status(404).json({ success: false, error: 'Esta conversación ya no está disponible.' });
      return;
    }

    const [result] = await pool.execute(
      `INSERT INTO comunidad_comentarios
       (publicacion_id, usuario_id, autor_nombre, ip, contenido, visible, estado_moderacion)
       VALUES (?, ?, ?, ?, ?, 1, 'approved')`,
      [id, usuarioId || null, autorNombre.trim(), ip, contenidoLimpio]
    ) as any;

    res.status(201).json({
      success: true,
      message: 'Respuesta publicada correctamente.',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'No se ha podido publicar la respuesta.' });
  }
};

export const likePublicacion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ip = obtenerIp(req);
    const { usuarioId } = obtenerNombre(req);

    await pool.execute(
      'INSERT IGNORE INTO comunidad_likes (usuario_id, tipo, objeto_id, ip) VALUES (?, "publicacion", ?, ?)',
      [usuarioId || null, id, ip]
    );

    const [rows] = await pool.execute(
      'SELECT COUNT(*) as total FROM comunidad_likes WHERE tipo = "publicacion" AND objeto_id = ?',
      [id]
    );

    res.status(200).json({ success: true, data: { total: (rows as any[])[0]?.total || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al apoyar la conversación.' });
  }
};

export const unlikePublicacion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ip = obtenerIp(req);
    const { usuarioId } = obtenerNombre(req);

    await pool.execute(
      'DELETE FROM comunidad_likes WHERE tipo = "publicacion" AND objeto_id = ? AND ip = ? AND (usuario_id = ? OR usuario_id IS NULL)',
      [id, ip, usuarioId || null]
    );

    const [rows] = await pool.execute(
      'SELECT COUNT(*) as total FROM comunidad_likes WHERE tipo = "publicacion" AND objeto_id = ?',
      [id]
    );

    res.status(200).json({ success: true, data: { total: (rows as any[])[0]?.total || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al quitar el apoyo.' });
  }
};

export const likeRespuesta = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ip = obtenerIp(req);
    const { usuarioId } = obtenerNombre(req);

    await pool.execute(
      'INSERT IGNORE INTO comunidad_likes (usuario_id, tipo, objeto_id, ip) VALUES (?, "respuesta", ?, ?)',
      [usuarioId || null, id, ip]
    );

    const [rows] = await pool.execute(
      'SELECT COUNT(*) as total FROM comunidad_likes WHERE tipo = "respuesta" AND objeto_id = ?',
      [id]
    );

    res.status(200).json({ success: true, data: { total: (rows as any[])[0]?.total || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al apoyar la respuesta.' });
  }
};

export const unlikeRespuesta = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ip = obtenerIp(req);
    const { usuarioId } = obtenerNombre(req);

    await pool.execute(
      'DELETE FROM comunidad_likes WHERE tipo = "respuesta" AND objeto_id = ? AND ip = ? AND (usuario_id = ? OR usuario_id IS NULL)',
      [id, ip, usuarioId || null]
    );

    const [rows] = await pool.execute(
      'SELECT COUNT(*) as total FROM comunidad_likes WHERE tipo = "respuesta" AND objeto_id = ?',
      [id]
    );

    res.status(200).json({ success: true, data: { total: (rows as any[])[0]?.total || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al quitar el apoyo.' });
  }
};

export const reportarPublicacion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { motivo, descripcion, nombre_usuario } = req.body;
    const { usuarioId, autorNombre } = obtenerNombre(req, nombre_usuario);
    const ip = obtenerIp(req);

    if (!motivo) {
      res.status(400).json({ success: false, error: 'El motivo del reporte es obligatorio.' });
      return;
    }

    await pool.execute(
      `INSERT INTO comunidad_reportes (usuario_id, autor_nombre, ip, tipo, objeto_id, motivo, descripcion, estado)
       VALUES (?, ?, ?, "publicacion", ?, ?, ?, 'pendiente')`,
      [usuarioId || null, autorNombre?.trim() || null, ip, id, motivo, descripcion || '']
    );

    res.status(200).json({ success: true, message: 'El reporte se ha enviado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'No se pudo enviar el reporte.' });
  }
};

export const reportarRespuesta = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { motivo, descripcion, nombre_usuario } = req.body;
    const { usuarioId, autorNombre } = obtenerNombre(req, nombre_usuario);
    const ip = obtenerIp(req);

    if (!motivo) {
      res.status(400).json({ success: false, error: 'El motivo del reporte es obligatorio.' });
      return;
    }

    await pool.execute(
      `INSERT INTO comunidad_reportes (usuario_id, autor_nombre, ip, tipo, objeto_id, motivo, descripcion, estado)
       VALUES (?, ?, ?, "respuesta", ?, ?, ?, 'pendiente')`,
      [usuarioId || null, autorNombre?.trim() || null, ip, id, motivo, descripcion || '']
    );

    res.status(200).json({ success: true, message: 'El reporte se ha enviado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'No se pudo enviar el reporte.' });
  }
};
