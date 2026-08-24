import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

export const listarMensajes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const tipo = req.query.tipo as string || 'recibidos';

    let query = '';
    let values: any[] = [userId, userId];

    switch (tipo) {
      case 'enviados':
        query = `SELECT m.*, u.email AS destinatario_email, u.nombre AS destinatario_nombre
         FROM mensajes_staff m
         LEFT JOIN usuarios u ON m.destinatario_id = u.id
         WHERE m.remitente_id = ? AND m.eliminado_remitente = 0 AND m.estado != 'borrador'
         ORDER BY m.creado_at DESC`;
        values = [userId];
        break;
      case 'borradores':
        query = `SELECT m.*, u.email AS destinatario_email, u.nombre AS destinatario_nombre
         FROM mensajes_staff m
         LEFT JOIN usuarios u ON m.destinatario_id = u.id
         WHERE m.remitente_id = ? AND m.estado = 'borrador'
         ORDER BY m.creado_at DESC`;
        values = [userId];
        break;
      case 'archivados':
        query = `SELECT m.*,
          CASE WHEN m.remitente_id = ? THEN r.nombre ELSE s.nombre END AS interlocutor_nombre,
          CASE WHEN m.remitente_id = ? THEN r.email ELSE s.email END AS interlocutor_email
         FROM mensajes_staff m
         LEFT JOIN usuarios r ON m.remitente_id = r.id
         LEFT JOIN usuarios s ON m.destinatario_id = s.id
         WHERE (m.remitente_id = ? AND m.archivado_remitente = 1 AND m.eliminado_remitente = 0)
            OR (m.destinatario_id = ? AND m.archivado_destinatario = 1 AND m.eliminado_destinatario = 0)
         ORDER BY m.creado_at DESC`;
        values = [userId, userId, userId, userId];
        break;
      default:
        query = `SELECT m.*, u.email AS remitente_email, u.nombre AS remitente_nombre
         FROM mensajes_staff m
         LEFT JOIN usuarios u ON m.remitente_id = u.id
         WHERE m.destinatario_id = ? AND m.eliminado_destinatario = 0 AND m.estado = 'enviado'
         ORDER BY m.creado_at DESC`;
        values = [userId];
    }

    const [rows] = await pool.execute(query, values);
    res.json({ success: true, data: rows });
  } catch (error) {
    logger.error('Error listando mensajes: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const contarNoLeidos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const [rows] = await pool.execute(
      'SELECT COUNT(*) AS total FROM mensajes_staff WHERE destinatario_id = ? AND leido = 0 AND eliminado_destinatario = 0',
      [userId]
    );
    res.json({ success: true, data: { total: (rows as any[])[0].total } });
  } catch (error) {
    logger.error('Error contando no leídos: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const enviarMensaje = async (req: AuthRequest, res: Response): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    const { destinatario_id, asunto, cuerpo, anuncio_id, padre_id, prioridad, entidades, estado } = req.body;
    const esBorrador = estado === 'borrador';

    if (!asunto?.trim() || !cuerpo?.trim()) {
      res.status(400).json({ success: false, error: 'Asunto y cuerpo son obligatorios' });
      return;
    }

    if (!esBorrador && !destinatario_id) {
      res.status(400).json({ success: false, error: 'Destinatario es obligatorio para enviar' });
      return;
    }

    let finalDestinatario = destinatario_id || null;

    // Verificar que el destinatario es admin o moderador y activo
    if (finalDestinatario) {
      const [staffRows] = await conn.execute(
        'SELECT id, rol FROM usuarios WHERE id = ? AND activo = 1 AND rol IN (?, ?)',
        [finalDestinatario, 'admin', 'moderador']
      );

      if ((staffRows as any[]).length === 0) {
        res.status(400).json({ success: false, error: 'Destinatario no válido o inactivo' });
        return;
      }
    }

    // Validar anuncio adjunto si se envía
    if (anuncio_id) {
      const [anuncioRows] = await conn.execute('SELECT id, titulo FROM anuncios WHERE id = ?', [anuncio_id]);
      if ((anuncioRows as any[]).length === 0) {
        res.status(400).json({ success: false, error: 'Anuncio adjunto no existe' });
        return;
      }
    }

    // Validar mensaje padre si es respuesta
    if (padre_id) {
      const [padreRows] = await conn.execute(
        'SELECT id, destinatario_id, remitente_id FROM mensajes_staff WHERE id = ?',
        [padre_id]
      );
      const padre = (padreRows as any[])[0];
      if (!padre) {
        res.status(400).json({ success: false, error: 'Mensaje padre no encontrado' });
        return;
      }
      const interlocutor = padre.remitente_id === req.user!.id ? padre.destinatario_id : padre.remitente_id;
      if (!esBorrador && interlocutor !== finalDestinatario) {
        res.status(400).json({ success: false, error: 'El destinatario debe ser el interlocutor del hilo' });
        return;
      }
    }

    const prioridadValue = ['baja', 'normal', 'alta', 'urgente'].includes(prioridad) ? prioridad : 'normal';
    const estadoValue = esBorrador ? 'borrador' : 'enviado';

    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO mensajes_staff (remitente_id, destinatario_id, asunto, cuerpo, leido, anuncio_id, padre_id, prioridad, estado)
       VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)`,
      [req.user!.id, finalDestinatario, asunto.trim(), cuerpo.trim(), anuncio_id || null, padre_id || null, prioridadValue, estadoValue]
    ) as any;

    const mensajeId = result.insertId;

    const listaEntidades = (entidades as any[] || []);
    for (const ent of listaEntidades) {
      if (ent?.entidad_tipo && ent?.entidad_id) {
        await conn.execute(
          `INSERT INTO mensajes_entidades_adjuntas (mensaje_id, entidad_tipo, entidad_id, titulo)
           VALUES (?, ?, ?, ?)`,
          [mensajeId, ent.entidad_tipo, ent.entidad_id, ent.titulo || null]
        );
      }
    }

    await conn.commit();

    res.json({ success: true, data: { id: mensajeId } });
  } catch (error) {
    await conn.rollback();
    logger.error('Error enviando mensaje: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
};

export const responderMensaje = async (req: AuthRequest, res: Response): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const { cuerpo, entidades } = req.body;
    const userId = req.user!.id;

    if (!cuerpo?.trim()) {
      res.status(400).json({ success: false, error: 'El cuerpo de la respuesta es obligatorio' });
      return;
    }

    const [padreRows] = await conn.execute(
      'SELECT * FROM mensajes_staff WHERE id = ?',
      [id]
    );
    const padre = (padreRows as any[])[0];
    if (!padre) {
      res.status(404).json({ success: false, error: 'Mensaje no encontrado' });
      return;
    }

    if (padre.remitente_id !== userId && padre.destinatario_id !== userId) {
      res.status(403).json({ success: false, error: 'No tienes permisos' });
      return;
    }

    const destinatario_id = padre.remitente_id === userId ? padre.destinatario_id : padre.remitente_id;

    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO mensajes_staff (remitente_id, destinatario_id, asunto, cuerpo, leido, padre_id, prioridad, estado)
       VALUES (?, ?, CONCAT('RE: ', ?), ?, 0, ?, ?, 'enviado')`,
      [userId, destinatario_id, padre.asunto, cuerpo.trim(), id, padre.prioridad]
    ) as any;

    const mensajeId = result.insertId;

    const listaEntidades = (entidades as any[] || []);
    for (const ent of listaEntidades) {
      if (ent?.entidad_tipo && ent?.entidad_id) {
        await conn.execute(
          `INSERT INTO mensajes_entidades_adjuntas (mensaje_id, entidad_tipo, entidad_id, titulo)
           VALUES (?, ?, ?, ?)`,
          [mensajeId, ent.entidad_tipo, ent.entidad_id, ent.titulo || null]
        );
      }
    }

    await conn.commit();

    res.json({ success: true, data: { id: mensajeId } });
  } catch (error) {
    await conn.rollback();
    logger.error('Error respondiendo mensaje: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
};

export const archivarMensaje = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const [rows] = await pool.execute(
      'SELECT remitente_id, destinatario_id FROM mensajes_staff WHERE id = ?',
      [id]
    );
    const m = (rows as any[])[0];
    if (!m) {
      res.status(404).json({ success: false, error: 'Mensaje no encontrado' });
      return;
    }

    if (m.remitente_id === userId) {
      await pool.execute('UPDATE mensajes_staff SET archivado_remitente = 1 WHERE id = ?', [id]);
    }
    if (m.destinatario_id === userId) {
      await pool.execute('UPDATE mensajes_staff SET archivado_destinatario = 1 WHERE id = ?', [id]);
    }

    res.json({ success: true, data: { id } });
  } catch (error) {
    logger.error('Error archivando mensaje: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const marcarLeido = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      'SELECT * FROM mensajes_staff WHERE id = ? AND destinatario_id = ?',
      [id, req.user!.id]
    );

    if ((rows as any[]).length === 0) {
      res.status(404).json({ success: false, error: 'Mensaje no encontrado' });
      return;
    }

    await pool.execute(
      'UPDATE mensajes_staff SET leido = 1, leido_at = NOW() WHERE id = ?',
      [id]
    );

    res.json({ success: true, data: { id } });
  } catch (error) {
    logger.error('Error marcando mensaje leído: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const eliminarMensaje = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const [rows] = await pool.execute(
      'SELECT remitente_id, destinatario_id FROM mensajes_staff WHERE id = ?',
      [id]
    );
    const m = (rows as any[])[0];
    if (!m) {
      res.status(404).json({ success: false, error: 'Mensaje no encontrado' });
      return;
    }
    if (m.remitente_id !== userId && m.destinatario_id !== userId) {
      res.status(403).json({ success: false, error: 'No tienes permisos' });
      return;
    }

    if (m.remitente_id === userId) {
      await pool.execute('UPDATE mensajes_staff SET eliminado_remitente = 1 WHERE id = ?', [id]);
    }
    if (m.destinatario_id === userId) {
      await pool.execute('UPDATE mensajes_staff SET eliminado_destinatario = 1 WHERE id = ?', [id]);
    }
    // Si ambos lo borran, se elimina físicamente
    await pool.execute(
      'DELETE FROM mensajes_staff WHERE id = ? AND eliminado_remitente = 1 AND eliminado_destinatario = 1',
      [id]
    );

    res.json({ success: true, data: { id } });
  } catch (error) {
    logger.error('Error eliminando mensaje: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const listarStaff = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, email, nombre, rol FROM usuarios WHERE rol IN (?, ?) AND activo = 1 ORDER BY rol, nombre`,
      ['admin', 'moderador']
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    logger.error('Error listando staff: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const verMensaje = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const [rows] = await pool.execute(
      `SELECT m.*,
        r.nombre AS remitente_nombre, r.email AS remitente_email,
        d.nombre AS destinatario_nombre, d.email AS destinatario_email,
        a.titulo AS anuncio_titulo, a.categoria AS anuncio_categoria, a.provincia AS anuncio_provincia,
        a.estado_moderacion AS anuncio_estado, a.visible AS anuncio_visible
      FROM mensajes_staff m
      LEFT JOIN usuarios r ON m.remitente_id = r.id
      LEFT JOIN usuarios d ON m.destinatario_id = d.id
      LEFT JOIN anuncios a ON m.anuncio_id = a.id
      WHERE m.id = ? AND (m.remitente_id = ? OR m.destinatario_id = ?)
        AND (m.remitente_id != ? OR m.eliminado_remitente = 0)
        AND (m.destinatario_id != ? OR m.eliminado_destinatario = 0)`,
      [id, userId, userId, userId, userId]
    );
    const m = (rows as any[])[0];
    if (!m) {
      res.status(404).json({ success: false, error: 'Mensaje no encontrado' });
      return;
    }

    const [adjuntos] = await pool.execute(
      'SELECT id, nombre_original, tipo_mime, tamano, creado_at FROM mensajes_adjuntos WHERE mensaje_id = ?',
      [id]
    );

    const [entidades] = await pool.execute(
      'SELECT entidad_tipo, entidad_id, titulo FROM mensajes_entidades_adjuntas WHERE mensaje_id = ?',
      [id]
    );

    res.json({ success: true, data: { ...m, adjuntos, entidades } });
  } catch (error) {
    logger.error('Error obteniendo mensaje: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

const MIME_BLOQUEADOS = new Set([
  'application/x-msdownload',
  'application/x-exe',
  'application/x-msdos-program',
  'application/x-bat',
  'application/x-sh',
  'application/x-cmd',
  'application/x-scr',
  'text/x-sh',
]);

const EXT_BLOQUEADAS = new Set(['.exe', '.bat', '.sh', '.cmd', '.scr', '.msi', '.com', '.dll']);

export const subirAdjunto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mensaje_id } = req.params;
    const userId = req.user!.id;

    if (!req.file) {
      res.status(400).json({ success: false, error: 'No se ha enviado ningún archivo' });
      return;
    }

    const [mRows] = await pool.execute(
      'SELECT remitente_id, destinatario_id FROM mensajes_staff WHERE id = ?',
      [mensaje_id]
    );
    const m = (mRows as any[])[0];
    if (!m || (m.remitente_id !== userId && m.destinatario_id !== userId)) {
      res.status(403).json({ success: false, error: 'No tienes permisos sobre este mensaje' });
      return;
    }

    const file = req.file as any;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype || 'application/octet-stream';
    const size = file.size;

    if (MIME_BLOQUEADOS.has(mime) || EXT_BLOQUEADAS.has(ext) || size > 20 * 1024 * 1024) {
      res.status(400).json({ success: false, error: 'Tipo o tamaño de archivo no permitido (máx. 20 MB)' });
      return;
    }

    const nombreGuardado = `${uuidv4()}_${file.originalname}`;
    const ruta = path.join('uploads', 'mensajes', nombreGuardado);
    const destino = path.join(__dirname, '..', '..', ruta);
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, file.buffer);

    const [result] = await pool.execute(
      `INSERT INTO mensajes_adjuntos (mensaje_id, nombre_original, nombre_guardado, tipo_mime, tamano, ruta_storage, subido_por)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [mensaje_id, file.originalname, nombreGuardado, mime, size, ruta, userId]
    ) as any;

    res.json({ success: true, data: { id: result.insertId, nombre_original: file.originalname, tamano: size } });
  } catch (error) {
    logger.error('Error subiendo adjunto: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const descargarAdjunto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { adjuntoId } = req.params;
    const userId = req.user!.id;

    const [rows] = await pool.execute(
      `SELECT a.*, m.remitente_id, m.destinatario_id
       FROM mensajes_adjuntos a
       JOIN mensajes_staff m ON a.mensaje_id = m.id
       WHERE a.id = ?`,
      [adjuntoId]
    );
    const a = (rows as any[])[0];
    if (!a || (a.remitente_id !== userId && a.destinatario_id !== userId)) {
      res.status(403).json({ success: false, error: 'No tienes permisos' });
      return;
    }

    const filePath = path.join(__dirname, '..', '..', a.ruta_storage);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ success: false, error: 'Archivo no encontrado' });
      return;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${a.nombre_original}"`);
    res.setHeader('Content-Type', a.tipo_mime);
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    logger.error('Error descargando adjunto: %s', error instanceof Error ? error.message : String(error));
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
