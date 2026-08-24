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

export const listarContactos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string || '25', 10)));
    const offset = (page - 1) * limit;
    const q = (req.query.q as string || '').trim();
    const provincia = (req.query.provincia as string || '').trim();
    const tipo = (req.query.tipo as string || '').trim();
    const estado = (req.query.estado as string || '').trim();
    const verificado = req.query.verificado as string | undefined;

    const conditions: string[] = ['1=1'];
    const values: any[] = [];

    if (q) {
      conditions.push(`(institucion LIKE ? OR tipo LIKE ? OR area_departamento LIKE ? OR provincia LIKE ? OR email_oficial LIKE ? OR persona_contacto LIKE ?)`);
      values.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (provincia) {
      conditions.push('provincia = ?');
      values.push(provincia);
    }
    if (tipo) {
      conditions.push('tipo = ?');
      values.push(tipo);
    }
    if (estado) {
      conditions.push('estado = ?');
      values.push(estado);
    }
    if (verificado !== undefined) {
      conditions.push('verificado = ?');
      values.push(verificado === '1' || verificado === 'true' ? 1 : 0);
    }

    const where = conditions.join(' AND ');

    const [rows] = await pool.execute(
      `SELECT * FROM contactos_institucionales
       WHERE ${where}
       ORDER BY institucion
       LIMIT ? OFFSET ?`,
      [...values, limit, offset],
    );

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM contactos_institucionales WHERE ${where}`,
      values,
    );

    const total = (countRows as any[])[0]?.total || 0;

    return resJson(res, 200, rows, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getContacto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM contactos_institucionales WHERE id = ? LIMIT 1',
      [req.params.id],
    );
    const contacto = (rows as any[])[0];
    if (!contacto) return resJson(res, 404, { error: 'Contacto no encontrado' });
    return resJson(res, 200, contacto);
  } catch (error) {
    next(error);
  }
};

export const crearContacto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usuario = (req as any).user;
    const {
      institucion,
      tipo,
      area_departamento,
      provincia,
      comunidad_autonoma,
      email_oficial,
      telefono,
      web,
      persona_contacto,
      estado,
      verificado,
      notas_internas,
    } = req.body;

    if (!institucion || !tipo) {
      return resJson(res, 400, { error: 'institucion y tipo son obligatorios' });
    }

    const [result] = await pool.execute(
      `INSERT INTO contactos_institucionales
       (institucion, tipo, area_departamento, provincia, comunidad_autonoma,
        email_oficial, telefono, web, persona_contacto, estado, verificado,
        verificado_at, verificado_por, notas_internas, creado_por)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        institucion,
        tipo,
        area_departamento || null,
        provincia || null,
        comunidad_autonoma || null,
        email_oficial || null,
        telefono || null,
        web || null,
        persona_contacto || null,
        estado || 'pendiente',
        verificado ? 1 : 0,
        verificado ? new Date() : null,
        verificado ? usuario?.id : null,
        notas_internas || null,
        usuario?.id,
      ],
    );

    const insertId = (result as any).insertId;

    const [rows] = await pool.execute(
      'SELECT * FROM contactos_institucionales WHERE id = ? LIMIT 1',
      [insertId],
    );

    return resJson(res, 201, (rows as any[])[0]);
  } catch (error) {
    next(error);
  }
};

export const actualizarContacto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const campos = req.body;
    const permitidos = [
      'institucion', 'tipo', 'area_departamento', 'provincia',
      'comunidad_autonoma', 'email_oficial', 'telefono', 'web',
      'persona_contacto', 'estado', 'verificado', 'notas_internas',
    ];

    const sets: string[] = [];
    const values: any[] = [];

    for (const k of permitidos) {
      if (campos[k] !== undefined) {
        if (k === 'verificado') {
          sets.push('verificado = ?');
          values.push(campos[k] ? 1 : 0);
        } else {
          sets.push(`${k} = ?`);
          values.push(campos[k]);
        }
      }
    }

    if (sets.length === 0) {
      return resJson(res, 400, { error: 'No hay campos para actualizar' });
    }

    sets.push('actualizado_at = NOW()');
    values.push(id);

    await pool.execute(
      `UPDATE contactos_institucionales SET ${sets.join(', ')} WHERE id = ?`,
      values,
    );

    const [rows] = await pool.execute(
      'SELECT * FROM contactos_institucionales WHERE id = ? LIMIT 1',
      [id],
    );
    const contacto = (rows as any[])[0];
    if (!contacto) return resJson(res, 404, { error: 'Contacto no encontrado' });
    return resJson(res, 200, contacto);
  } catch (error) {
    next(error);
  }
};

export const verificarContacto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usuario = (req as any).user;
    const id = req.params.id;

    await pool.execute(
      `UPDATE contactos_institucionales
       SET verificado = 1, estado = 'verificado', verificado_at = NOW(),
           verificado_por = ?
       WHERE id = ?`,
      [usuario?.id, id],
    );

    const [rows] = await pool.execute(
      'SELECT * FROM contactos_institucionales WHERE id = ? LIMIT 1',
      [id],
    );
    return resJson(res, 200, (rows as any[])[0]);
  } catch (error) {
    next(error);
  }
};

export const eliminarContacto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await pool.execute(
      `UPDATE contactos_institucionales SET estado = 'inactivo' WHERE id = ?`,
      [req.params.id],
    );
    return resJson(res, 200, { id: req.params.id, estado: 'inactivo' });
  } catch (error) {
    next(error);
  }
};
