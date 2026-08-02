import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';

function resJson(res: Response, status: number, data: object) {
  res.status(status).json({
    success: status >= 200 && status < 300,
    status,
    data,
  });
}

export const buscarDestinatarios = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usuario = (req as any).user;
    const q = (req.query.q as string || '').trim();
    const tipo = (req.query.tipo as string || '').trim();

    if (!q || q.length < 2) {
      return resJson(res, 200, []);
    }

    const like = `%${q}%`;
    const resultados: any[] = [];

    const incluirInternos = !tipo || tipo === 'interno' || tipo === 'todos';
    const incluirInstitucionales = !tipo || tipo === 'institucional' || tipo === 'todos';

    if (incluirInternos) {
      const filtrosRol: string[] = [];
      const valores: any[] = [];

      if (usuario?.rol === 'moderador') {
        filtrosRol.push("rol IN ('admin', 'moderador')");
      }

      const whereClauses: string[] = [
        'activo = 1',
        ...filtrosRol,
        `(nombre LIKE ? OR email LIKE ? OR rol LIKE ? OR provincia LIKE ?)`,
      ];

      valores.push(like, like, like, like);

      const [rows] = await pool.execute(
        `SELECT id, nombre, email, rol, provincia, 'interno' AS tipo_destinatario,
          CONCAT(nombre, ' — ', email, ' (', rol, ')') AS descripcion
         FROM usuarios
         WHERE ${whereClauses.join(' AND ')}
         ORDER BY
          CASE
            WHEN nombre LIKE ? THEN 0
            WHEN email LIKE ? THEN 1
            WHEN rol LIKE ? THEN 2
            ELSE 3
          END,
          nombre
         LIMIT 15`,
        [
          ...valores,
          `%${q}%`,
          `%${q}%`,
          `%${q}%`,
        ],
      );

      resultados.push(...(rows as any[]).map((r) => ({
        id: r.id,
        nombre: r.nombre,
        email: r.email,
        provincia: r.provincia,
        rol: r.rol,
        tipo_destinatario: r.tipo_destinatario,
        descripcion: r.descripcion,
      })));
    }

    if (incluirInstitucionales && usuario?.rol === 'admin') {
      const [rows] = await pool.execute(
        `SELECT
          id, institucion, tipo, area_departamento, provincia,
          comunidad_autonoma, email_oficial, persona_contacto,
          estado, verificado,
          'institucional' AS tipo_destinatario,
          CONCAT(institucion,
            IFNULL(CONCAT(' — ', area_departamento), ''),
            IFNULL(CONCAT(' (', provincia, ')'), ''),
            IF(email_oficial IS NOT NULL, CONCAT(' [', email_oficial, ']'), '')
          ) AS descripcion
         FROM contactos_institucionales
         WHERE estado != 'inactivo'
           AND (institucion LIKE ? OR tipo LIKE ? OR area_departamento LIKE ?
                OR provincia LIKE ? OR email_oficial LIKE ?
                OR IFNULL(persona_contacto, '') LIKE ?)
         ORDER BY verificado DESC, institucion
         LIMIT 15`,
        [like, like, like, like, like, like],
      );

      resultados.push(...(rows as any[]).map((r) => ({
        id: r.id,
        nombre: r.institucion,
        email: r.email_oficial,
        tipo: r.tipo,
        area: r.area_departamento,
        provincia: r.provincia,
        comunidad_autonoma: r.comunidad_autonoma,
        persona_contacto: r.persona_contacto,
        verificado: r.verificado,
        tipo_destinatario: r.tipo_destinatario,
        descripcion: r.descripcion,
      })));
    }

    return resJson(res, 200, resultados);
  } catch (error) {
    next(error);
  }
};
