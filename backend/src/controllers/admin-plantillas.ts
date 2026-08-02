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

const defaultTemplates: any[] = [
  {
    nombre: 'Comunicación de sugerencias ciudadanas',
    asunto: 'Traslado de sugerencias ciudadanas en {{provincia}}',
    cuerpo: `A la atención de {{institucion}}:

Desde CityPAJ se han recibido {{numero_sugerencias}} sugerencias ciudadanas relacionadas con {{tema_principal}} en la provincia de {{provincia}}.

Se adjunta un resumen de las aportaciones recibidas para su conocimiento y posible valoración por el área competente.

La información trasladada procede de publicaciones, sugerencias y propuestas registradas en la plataforma, y tiene como finalidad facilitar una lectura territorial de las necesidades expresadas por la población joven.

Quedamos a disposición para ampliar la información o colaborar en futuras vías de participación.

Atentamente,

{{nombre_admin}}
Equipo CityPAJ`,
    tipo: 'institucional',
  },
  {
    nombre: 'Traslado de propuesta comunitaria',
    asunto: 'Propuesta comunitaria: {{titulo_propuesta}}',
    cuerpo: `A la atención de {{institucion}}:

Desde CityPAJ se nos ha trasladado una propuesta comunitaria titulada "{{titulo_propuesta}}", con {{numero_apoyos}} apoyos registrados, relacionada con {{tema_principal}} en {{provincia}}.

Resumen:
{{resumen_propuestas}}

Agradecemos la consideración de esta iniciativa y quedamos a disposición para facilitar información adicional o colaborar en su difusión.

Atentamente,

{{nombre_admin}}
Equipo CityPAJ`,
    tipo: 'institucional',
  },
  {
    nombre: 'Informe de situación detectada',
    asunto: 'Informe de situación detectada en {{provincia}}',
    cuerpo: `A la atención de {{institucion}}:

El equipo de CityPAJ ha detectado una situación de interés relativa a {{tema_principal}} en la provincia de {{provincia}}.

Descripción del hallazgo:
{{resumen_sugerencias}}

Se adjunta la información disponible para su conocimiento.

Atentamente,

{{nombre_admin}}
Equipo CityPAJ`,
    tipo: 'institucional',
  },
  {
    nombre: 'Aviso de necesidad juvenil repetida',
    asunto: 'Aviso: necesidad juvenil repetida en {{provincia}}',
    cuerpo: `A la atención de {{institucion}}:

Se ha identificado una necesidad juvenil que aparece de forma reiterada en la plataforma CityPAJ: {{tema_principal}} en {{provincia}}.

Número de sugerencias vinculadas: {{numero_sugerencias}}.

Se adjunta un resumen de las aportaciones para su análisis.

Atentamente,

{{nombre_admin}}
Equipo CityPAJ`,
    tipo: 'institucional',
  },
  {
    nombre: 'Solicitud de colaboración institucional',
    asunto: 'Solicitud de colaboración con {{institucion}}',
    cuerpo: `A la atención de {{institucion}}:

Desde CityPAJ nos ponemos en contacto para explorar vías de colaboración en materia de {{tema_principal}} en {{provincia}}.

Concretamente, nos interesa coordinar actuaciones relacionadas con las necesidades juveniles detectadas a través de la plataforma.

Quedamos a la espera de su respuesta para programar una reunión o intercambio de información.

Atentamente,

{{nombre_admin}}
Equipo CityPAJ`,
    tipo: 'institucional',
  },
  {
    nombre: 'Resumen mensual por provincia',
    asunto: 'Resumen mensual de participación juvenil — {{provincia}}',
    cuerpo: `A la atención de {{institucion}}:

Se adjunta el resumen mensual de actividad registrada en CityPAJ para la provincia de {{provincia}}.

Sugerencias recibidas: {{numero_sugerencias}}
Propuestas comunitarias: {{resumen_propuestas}}
Tema principal: {{tema_principal}}

Atentamente,

{{nombre_admin}}
Equipo CityPAJ`,
    tipo: 'institucional',
  },
  {
    nombre: 'Comunicación urgente por contenido sensible',
    asunto: 'URGENTE: Contenido sensible en {{provincia}}',
    cuerpo: `A la atención de {{institucion}}:

Se ha detectado en CityPAJ contenido o una situación relevante que requiere atención inmediata en {{provincia}}.

Detalles:
{{resumen_sugerencias}}

Se ha marcado con prioridad alta. Rogamos contacto urgente para valorar la actuación necesaria.

Atentamente,

{{nombre_admin}}
Equipo CityPAJ`,
    tipo: 'institucional',
  },
];

async function seedDefaults(createdBy: string) {
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) as total FROM plantillas_comunicacion
     WHERE creado_por IS NULL OR creado_por = ?`,
    [createdBy],
  );

  const total = (countRows as any[])[0]?.total || 0;
  if (total > 0) return;

  for (const tpl of defaultTemplates) {
    await pool.execute(
      `INSERT INTO plantillas_comunicacion
       (nombre, asunto, cuerpo, descripcion, tipo, activa, creado_por)
       VALUES (?, ?, ?, ?, ?, 1, ?)`,
      [tpl.nombre, tpl.asunto, tpl.cuerpo, `Plantilla predefinida: ${tpl.nombre}`, tpl.tipo, createdBy],
    );
  }
}

export const listarPlantillas = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usuario = (req as any).user;
    await seedDefaults(usuario?.id);

    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string || '25', 10)));
    const offset = (page - 1) * limit;
    const q = (req.query.q as string || '').trim();
    const activa = req.query.activa as string | undefined;

    const conditions: string[] = ['eliminada = 0'];
    const values: any[] = [];

    if (q) {
      conditions.push('(nombre LIKE ? OR asunto LIKE ? OR descripcion LIKE ?)');
      values.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (activa !== undefined) {
      conditions.push('activa = ?');
      values.push(activa === '1' || activa === 'true' ? 1 : 0);
    }

    const where = conditions.join(' AND ');

    const [rows] = await pool.execute(
      `SELECT id, nombre, asunto, descripcion, tipo, activa, creado_at
       FROM plantillas_comunicacion
       WHERE ${where}
       ORDER BY creado_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset],
    );

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM plantillas_comunicacion WHERE ${where}`,
      values,
    );
    const total = (countRows as any[])[0]?.total || 0;

    return resJson(res, 200, rows, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

export const getPlantilla = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM plantillas_comunicacion WHERE id = ? AND eliminada = 0 LIMIT 1',
      [req.params.id],
    );
    const plantilla = (rows as any[])[0];
    if (!plantilla) return resJson(res, 404, { error: 'Plantilla no encontrada' });
    return resJson(res, 200, plantilla);
  } catch (error) {
    next(error);
  }
};

export const crearPlantilla = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usuario = (req as any).user;
    const { nombre, asunto, cuerpo, descripcion, tipo, activa, variables } = req.body;

    if (!nombre || !asunto || !cuerpo) {
      return resJson(res, 400, { error: 'nombre, asunto y cuerpo son obligatorios' });
    }

    const [result] = await pool.execute(
      `INSERT INTO plantillas_comunicacion
       (nombre, asunto, cuerpo, descripcion, tipo, activa, variables, creado_por)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        asunto,
        cuerpo,
        descripcion || null,
        tipo || 'institucional',
        activa !== undefined ? (activa ? 1 : 0) : 1,
        variables ? JSON.stringify(variables) : null,
        usuario?.id,
      ],
    );

    const [rows] = await pool.execute(
      'SELECT * FROM plantillas_comunicacion WHERE id = ? LIMIT 1',
      [(result as any).insertId],
    );
    return resJson(res, 201, (rows as any[])[0]);
  } catch (error) {
    next(error);
  }
};

export const actualizarPlantilla = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const { nombre, asunto, cuerpo, descripcion, tipo, activa, variables } = req.body;
    const sets: string[] = [];
    const values: any[] = [];

    if (nombre !== undefined) { sets.push('nombre = ?'); values.push(nombre); }
    if (asunto !== undefined) { sets.push('asunto = ?'); values.push(asunto); }
    if (cuerpo !== undefined) { sets.push('cuerpo = ?'); values.push(cuerpo); }
    if (descripcion !== undefined) { sets.push('descripcion = ?'); values.push(descripcion); }
    if (tipo !== undefined) { sets.push('tipo = ?'); values.push(tipo); }
    if (activa !== undefined) { sets.push('activa = ?'); values.push(activa ? 1 : 0); }
    if (variables !== undefined) { sets.push('variables = ?'); values.push(JSON.stringify(variables)); }

    if (sets.length === 0) return resJson(res, 400, { error: 'No hay campos para actualizar' });

    sets.push('actualizado_at = NOW()');
    values.push(id);

    await pool.execute(
      `UPDATE plantillas_comunicacion SET ${sets.join(', ')} WHERE id = ?`,
      values,
    );

    const [rows] = await pool.execute(
      'SELECT * FROM plantillas_comunicacion WHERE id = ? LIMIT 1',
      [id],
    );
    return resJson(res, 200, (rows as any[])[0]);
  } catch (error) {
    next(error);
  }
};

export const eliminarPlantilla = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await pool.execute(
      'UPDATE plantillas_comunicacion SET eliminada = 1, activa = 0, actualizado_at = NOW() WHERE id = ?',
      [req.params.id],
    );
    return resJson(res, 200, { id: req.params.id, eliminada: true });
  } catch (error) {
    next(error);
  }
};

function reemplazarVariables(texto: string, vars: Record<string, string>) {
  return texto.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    return vars[key] !== undefined ? vars[key] : `{{${key}}}`;
  });
}

export const generarBorrador = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usuario = (req as any).user;
    const { variables, contacto_id } = req.body;

    const [plantillas] = await pool.execute(
      'SELECT * FROM plantillas_comunicacion WHERE id = ? AND eliminada = 0 LIMIT 1',
      [req.params.id],
    );
    const plantilla = (plantillas as any[])[0];
    if (!plantilla) return resJson(res, 404, { error: 'Plantilla no encontrada' });

    const vars: Record<string, string> = {
      fecha: new Date().toLocaleDateString('es-ES'),
      nombre_admin: usuario?.nombre || '',
      cargo_admin: usuario?.rol === 'admin' ? 'Administrador' : 'Moderador',
      contacto_citypaj: 'citypaj@example.local',
      enlace_panel: 'http://localhost:3001/admin',
      ...Object.fromEntries(Object.entries(variables || {}).map(([k, v]) => [k, String(v)])),
    };

    const asuntoGenerado = reemplazarVariables(plantilla.asunto, vars);
    const cuerpoGenerado = reemplazarVariables(plantilla.cuerpo, vars);

    let contacto: any = null;
    if (contacto_id) {
      const [cRows] = await pool.execute(
        'SELECT * FROM contactos_institucionales WHERE id = ? LIMIT 1',
        [contacto_id],
      );
      contacto = (cRows as any[])[0];
    }

    const [result] = await pool.execute(
      `INSERT INTO comunicaciones_institucionales
       (plantilla_id, contacto_id, remitente_id, asunto, cuerpo, estado,
        provincia, comunidad_autonoma, institucion, area, email_destino)
       VALUES (?, ?, ?, ?, ?, 'borrador', ?, ?, ?, ?, ?)`,
      [
        plantilla.id,
        contacto?.id || null,
        usuario?.id,
        asuntoGenerado,
        cuerpoGenerado,
        vars.provincia || contacto?.provincia || null,
        vars.comunidad_autonoma || contacto?.comunidad_autonoma || null,
        contacto?.institucion || null,
        contacto?.area_departamento || null,
        contacto?.email_oficial || null,
      ],
    );

    const comunicacionId = (result as any).insertId;

    const [rows] = await pool.execute(
      'SELECT * FROM comunicaciones_institucionales WHERE id = ? LIMIT 1',
      [comunicacionId],
    );

    return resJson(res, 201, {
      plantilla,
      asunto: asuntoGenerado,
      cuerpo: cuerpoGenerado,
      comunicacion: (rows as any[])[0],
    });
  } catch (error) {
    next(error);
  }
};
