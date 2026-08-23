import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';

function resJson(res: Response, status: number, data: object, meta?: object) {
  res.status(status).json({
    success: status >= 200 && status < 300,
    status,
    ...(meta ? { meta } : {}),
    data,
  });
}

function reemplazarVariables(texto: string, vars: Record<string, string>) {
  return texto.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    return vars[key] !== undefined ? vars[key] : `{{${key}}}`;
  });
}

async function getEntidades(comunicacionId: number) {
  const [rows] = await pool.execute(
    'SELECT entidad_tipo, entidad_id, titulo FROM comunicaciones_entidades WHERE comunicacion_id = ?',
    [comunicacionId],
  );
  return rows as any[];
}

export const listarComunicaciones = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string || '25', 10)));
    const offset = (page - 1) * limit;
    const q = (req.query.q as string || '').trim();
    const estado = (req.query.estado as string || '').trim();
    const provincia = (req.query.provincia as string || '').trim();

    const conditions: string[] = [];
    const values: any[] = [];

    if (q) {
      conditions.push('(asunto LIKE ? OR cuerpo LIKE ? OR institucion LIKE ?)');
      values.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (estado) {
      conditions.push('estado = ?');
      values.push(estado);
    }
    if (provincia) {
      conditions.push('provincia = ?');
      values.push(provincia);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute(
      `SELECT c.*, p.nombre as plantilla_nombre
       FROM comunicaciones_institucionales c
       LEFT JOIN plantillas_comunicacion p ON c.plantilla_id = p.id
       ${where}
       ORDER BY c.creado_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset],
    );

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM comunicaciones_institucionales ${where}`,
      values,
    );
    const total = (countRows as any[])[0]?.total || 0;

    return resJson(res, 200, rows, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

export const getComunicacion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [rows] = await pool.execute(
      `SELECT c.*, p.nombre as plantilla_nombre
       FROM comunicaciones_institucionales c
       LEFT JOIN plantillas_comunicacion p ON c.plantilla_id = p.id
       WHERE c.id = ?
       LIMIT 1`,
      [req.params.id],
    );
    const com = (rows as any[])[0];
    if (!com) return resJson(res, 404, { error: 'Comunicación no encontrada' });

    const entidades = await getEntidades(com.id);
    return resJson(res, 200, { ...com, entidades });
  } catch (error) {
    next(error);
  }
};

export const crearComunicacion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const conn = await pool.getConnection();
  try {
    const usuario = (req as any).user;
    const {
      plantilla_id,
      contacto_id,
      asunto,
      cuerpo,
      variables,
      provincia,
      comunidad_autonoma,
      institucion,
      area,
      email_destino,
      entidades,
    } = req.body;

    if (!asunto || !cuerpo) {
      return resJson(res, 400, { error: 'asunto y cuerpo son obligatorios' });
    }

    await conn.beginTransaction();

    let finalAsunto = asunto;
    let finalCuerpo = cuerpo;

    if (plantilla_id) {
      const [plantillas] = await conn.execute(
        'SELECT * FROM plantillas_comunicacion WHERE id = ? AND eliminada = 0 LIMIT 1',
        [plantilla_id],
      );
      const plantilla = (plantillas as any[])[0];
      if (plantilla) {
        const vars: Record<string, string> = {
          fecha: new Date().toLocaleDateString('es-ES'),
          nombre_admin: usuario?.nombre || '',
          cargo_admin: usuario?.rol === 'admin' ? 'Administrador' : 'Moderador',
          contacto_citypaj: 'citypaj@example.local',
          enlace_panel: 'http://localhost:3001/admin',
          ...Object.fromEntries(Object.entries(variables || {}).map(([k, v]) => [k, String(v)])),
        };
        finalAsunto = reemplazarVariables(plantilla.asunto, vars);
        finalCuerpo = reemplazarVariables(plantilla.cuerpo, vars);
      }
    }

    let contacto: any = null;
    if (contacto_id) {
      const [cRows] = await conn.execute(
        'SELECT * FROM contactos_institucionales WHERE id = ? AND estado != "inactivo" LIMIT 1',
        [contacto_id],
      );
      contacto = (cRows as any[])[0];
    }

    const [result] = await conn.execute(
      `INSERT INTO comunicaciones_institucionales
       (plantilla_id, contacto_id, remitente_id, asunto, cuerpo, estado,
        provincia, comunidad_autonoma, institucion, area, email_destino)
       VALUES (?, ?, ?, ?, ?, 'borrador', ?, ?, ?, ?, ?)`,
      [
        plantilla_id || null,
        contacto?.id || contacto_id || null,
        usuario?.id,
        finalAsunto,
        finalCuerpo,
        provincia || contacto?.provincia || null,
        comunidad_autonoma || contacto?.comunidad_autonoma || null,
        institucion || contacto?.institucion || null,
        area || contacto?.area_departamento || null,
        email_destino || contacto?.email_oficial || null,
      ],
    );

    const comunicacionId = (result as any).insertId;

    const listaEntidades = (entidades as any[] || []);
    for (const ent of listaEntidades) {
      if (ent?.entidad_tipo && ent?.entidad_id) {
        await conn.execute(
          `INSERT INTO comunicaciones_entidades
           (comunicacion_id, entidad_tipo, entidad_id, titulo)
           VALUES (?, ?, ?, ?)`,
          [
            comunicacionId,
            ent.entidad_tipo,
            ent.entidad_id,
            ent.titulo || null,
          ],
        );
      }
    }

    if (listaEntidades.length > 0) {
      for (const ent of listaEntidades) {
        if (ent.entidad_tipo === 'sugerencia') {
          await conn.execute('UPDATE sugerencias SET trasladada = 1, trasladada_at = NOW(), trasladada_por = ? WHERE id = ?', [usuario?.id, ent.entidad_id]);
        }
        if (ent.entidad_tipo === 'propuesta') {
          await conn.execute('UPDATE propuestas SET trasladada = 1, trasladada_at = NOW(), trasladada_por = ? WHERE id = ?', [usuario?.id, ent.entidad_id]);
        }
      }
    }

    await conn.commit();

    const [rows] = await pool.execute(
      `SELECT c.*, p.nombre as plantilla_nombre
       FROM comunicaciones_institucionales c
       LEFT JOIN plantillas_comunicacion p ON c.plantilla_id = p.id
       WHERE c.id = ?
       LIMIT 1`,
      [comunicacionId],
    );

    const entidadesGuardadas = await getEntidades(comunicacionId);
    return resJson(res, 201, { ...(rows as any[])[0], entidades: entidadesGuardadas });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};

export const actualizarComunicacion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const permitidos = ['asunto', 'cuerpo', 'provincia', 'comunidad_autonoma', 'institucion', 'area', 'email_destino'];
    const sets: string[] = [];
    const values: any[] = [];

    for (const k of permitidos) {
      if (req.body[k] !== undefined) {
        sets.push(`${k} = ?`);
        values.push(req.body[k]);
      }
    }

    if (sets.length === 0) return resJson(res, 400, { error: 'No hay campos para actualizar' });

    sets.push('actualizado_at = NOW()');
    values.push(id);

    await pool.execute(
      `UPDATE comunicaciones_institucionales SET ${sets.join(', ')} WHERE id = ? AND estado != 'enviado'`,
      values,
    );

    const [rows] = await pool.execute(
      `SELECT * FROM comunicaciones_institucionales WHERE id = ? LIMIT 1`,
      [id],
    );
    const com = (rows as any[])[0];
    if (!com) return resJson(res, 404, { error: 'Comunicación no encontrada' });

    const entidades = await getEntidades(com.id);
    return resJson(res, 200, { ...com, entidades });
  } catch (error) {
    next(error);
  }
};

export const agregarEntidades = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const conn = await pool.getConnection();
  try {
    const usuario = (req as any).user;
    const id = req.params.id;
    const entidades = req.body.entidades as any[] || [];

    await conn.beginTransaction();

    for (const ent of entidades) {
      if (ent?.entidad_tipo && ent?.entidad_id) {
        await conn.execute(
          `INSERT INTO comunicaciones_entidades
           (comunicacion_id, entidad_tipo, entidad_id, titulo)
           VALUES (?, ?, ?, ?)`,
          [id, ent.entidad_tipo, ent.entidad_id, ent.titulo || null],
        );
      }
    }

    for (const ent of entidades) {
      if (ent.entidad_tipo === 'sugerencia') {
        await conn.execute('UPDATE sugerencias SET trasladada = 1, trasladada_at = NOW(), trasladada_por = ? WHERE id = ?', [usuario?.id, ent.entidad_id]);
      }
      if (ent.entidad_tipo === 'propuesta') {
        await conn.execute('UPDATE propuestas SET trasladada = 1, trasladada_at = NOW(), trasladada_por = ? WHERE id = ?', [usuario?.id, ent.entidad_id]);
      }
    }

    await conn.commit();

    const entidadesGuardadas = await getEntidades(parseInt(id));
    return resJson(res, 201, entidadesGuardadas);
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};

export const marcarEnviado = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usuario = (req as any).user;
    const id = req.params.id;
    const modo = req.body.modo === 'smtp' ? 'smtp' : 'manual';

    await pool.execute(
      `UPDATE comunicaciones_institucionales
       SET estado = 'enviado', enviado_at = NOW(), enviado_por = ?, modo_envio = ?
       WHERE id = ?`,
      [usuario?.id, modo, id],
    );

    const [rows] = await pool.execute(
      'SELECT * FROM comunicaciones_institucionales WHERE id = ? LIMIT 1',
      [id],
    );
    const com = (rows as any[])[0];
    if (!com) return resJson(res, 404, { error: 'Comunicación no encontrada' });

    const entidades = await getEntidades(com.id);
    return resJson(res, 200, { ...com, entidades });
  } catch (error) {
    next(error);
  }
};

export const exportarComunicacion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM comunicaciones_institucionales WHERE id = ? LIMIT 1`,
      [req.params.id],
    );
    const com = (rows as any[])[0];
    if (!com) return resJson(res, 404, { error: 'Comunicación no encontrada' });

    const entidades = await getEntidades(com.id);
    const entidadesTxt = entidades.length > 0
      ? '\n\nEntidades adjuntas:\n' + entidades.map((e) => `- [${e.entidad_tipo}] ${e.titulo || e.entidad_id}`).join('\n')
      : '';

    const contenido = `Para: ${com.institucion || com.email_destino || ''}\nAsunto: ${com.asunto}\nFecha: ${com.creado_at}\n\n${com.cuerpo}${entidadesTxt}`;

    res.attachment(`comunicacion-${com.id}.txt`);
    res.type('text/plain');
    return res.send(contenido);
  } catch (error) {
    next(error);
  }
};

export const eliminarComunicacion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await pool.execute(
      'DELETE FROM comunicaciones_institucionales WHERE id = ? AND estado = "borrador"',
      [req.params.id],
    );
    return resJson(res, 200, { id: req.params.id, eliminada: true });
  } catch (error) {
    next(error);
  }
};
