import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';

const isValidId = (id: any): id is string =>
  typeof id === 'string' && id.trim() !== '' && id !== 'undefined' && id !== 'null';

const PALABRAS_PROHIBIDAS = [
  'porno', 'pornografía', 'sexo', 'prostituta', 'prostitución', 'droga', 'cocaína', 'heroína',
  'marihuana', 'arma', 'pistola', 'rifle', 'explosivo', 'bomba', 'matar', 'asesinar', 'violencia',
  'estafa', 'timar', 'suplantar', 'pishing', 'hackear', 'moneda falsa', 'dólar falso', 'euro falso'
];

interface ResultadoModeracion {
  aprobado: boolean;
  motivo?: string;
}

function moderarConIA(texto: string): ResultadoModeracion {
  const lower = texto.toLowerCase();
  const encontradas = PALABRAS_PROHIBIDAS.filter((palabra) => lower.includes(palabra));
  if (encontradas.length > 0) {
    return {
      aprobado: false,
      motivo: `Contenido potencialmente inapropiado detectado por la IA: ${encontradas.join(', ')}`
    };
  }
  return { aprobado: true };
}

export const getAnuncios = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '12',
      categoria,
      comunidad_autonoma,
      provincia,
      ordenar = 'creado-desc',
      busqueda
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    // Construir WHERE clause basado en estructura real de citypaj
    const whereConditions = ['a.visible = 1', 'a.estado_moderacion = \'approved\''];
    const queryParams: any[] = [];

    if (categoria) {
      whereConditions.push('a.categoria = ?');
      queryParams.push(categoria);
    }

    if (comunidad_autonoma) {
      whereConditions.push('a.comunidad_autonoma LIKE ?');
      queryParams.push(`%${comunidad_autonoma}%`);
    }

    if (provincia) {
      whereConditions.push('a.provincia LIKE ?');
      queryParams.push(`%${provincia}%`);
    }

    if (busqueda) {
      whereConditions.push('(a.titulo LIKE ? OR a.descripcion LIKE ? OR a.categoria LIKE ?)');
      queryParams.push(`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`);
    }

    // Construir ORDER BY basado en columnas reales
    let orderBy = 'a.creado_at DESC';
    if (ordenar) {
      const [field, direction] = (ordenar as string).split('-');
      const directionSQL = direction === 'asc' ? 'ASC' : 'DESC';
      
      switch (field) {
        case 'titulo':
          orderBy = `a.titulo ${directionSQL}`;
          break;
        case 'vistas':
          orderBy = `a.vistas ${directionSQL}`;
          break;
        case 'creado':
        default:
          orderBy = `a.creado_at ${directionSQL}`;
          break;
      }
    }

    const whereClause = whereConditions.join(' AND ');

    // Query principal adaptada a estructura MySQL real
    const query = `
      SELECT 
        a.id,
        a.usuario_id,
        a.titulo,
        a.descripcion,
        a.categoria,
        a.subcategoria,
        a.comunidad_id,
        a.provincia_id,
        a.comunidad_autonoma,
        a.provincia,
        a.barrio,
        a.modalidad,
        a.contacto_email,
        a.contacto_telefono,
        a.contacto_anonimo,
        a.visible,
        a.estado_moderacion,
        a.motivo_rechazo,
        a.vistas,
        a.creado_at,
        a.actualizado_at,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limitNum, offset);

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE ${whereClause}
    `;

    const connection = await pool.getConnection();

    try {
      const [[anunciosRows], [countRows]] = await Promise.all([
        connection.execute(query, queryParams),
        connection.execute(countQuery, queryParams.slice(0, -2))
      ]);

      const total = (countRows as any[])[0]?.total ?? 0;
      const totalPages = total > 0 ? Math.ceil(total / limitNum) : 0;
      const currentPage = parseInt(page as string, 10);

      // Convertir booleanos de MySQL a JavaScript
      const processedAnuncios = (anunciosRows as any[]).map((anuncio: any) => ({
        ...anuncio,
        contacto_email: Boolean(anuncio.contacto_email),
        contacto_telefono: Boolean(anuncio.contacto_telefono),
        contacto_anonimo: Boolean(anuncio.contacto_anonimo),
        visible: Boolean(anuncio.visible)
      }));

      res.status(200).json({
        success: true,
        data: processedAnuncios,
        meta: {
          page: currentPage,
          limit: limitNum,
          total,
          totalPages,
          pagina: currentPage,
          limite: limitNum,
          total_paginas: totalPages,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1
        }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error obteniendo anuncios:', (error as Error).message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const getAnuncioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      res.status(400).json({
        success: false,
        message: 'ID de anuncio no válido'
      });
      return;
    }

    const query = `
      SELECT 
        a.id,
        a.usuario_id,
        a.titulo,
        a.descripcion,
        a.categoria,
        a.subcategoria,
        a.comunidad_id,
        a.provincia_id,
        a.comunidad_autonoma,
        a.provincia,
        a.barrio,
        a.modalidad,
        a.contacto_email,
        a.contacto_telefono,
        a.contacto_anonimo,
        a.visible,
        a.estado_moderacion,
        a.motivo_rechazo,
        a.vistas,
        a.creado_at,
        a.actualizado_at,
        u.nombre as usuario_nombre,
        u.email as usuario_email,
        NULL AS telefono
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.id = ? AND a.visible = 1 AND a.estado_moderacion = 'approved'
    `;

    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.execute(query, [id]);

      if ((result as any[]).length === 0) {
        res.status(404).json({
          success: false,
          error: 'Anuncio no encontrado'
        });
        return;
      }

      // Incrementar vistas
      await connection.execute('UPDATE anuncios SET vistas = vistas + 1 WHERE id = ?', [id]);

      // Convertir booleanos
      const processedAnuncio = {
        ...(result as any)[0],
        contacto_email: Boolean((result as any)[0].contacto_email),
        contacto_telefono: Boolean((result as any)[0].contacto_telefono),
        contacto_anonimo: Boolean((result as any)[0].contacto_anonimo),
        visible: Boolean((result as any)[0].visible)
      };

      res.status(200).json({
        success: true,
        data: processedAnuncio
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error obteniendo anuncio:', (error as Error).message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

const ANON_USER_ID = '69ff671c-8d97-4179-b525-0a62bb8b2f62';

export const createAnuncio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      titulo,
      descripcion,
      categoria,
      comunidad_autonoma,
      provincia,
      modalidad
    } = req.body;

    const userId = req.user?.id || ANON_USER_ID;

    // Validaciones básicas
    if (!titulo || !descripcion || !categoria || !comunidad_autonoma) {
      res.status(400).json({
        success: false,
        error: 'Faltan campos obligatorios'
      });
      return;
    }

    const connection = await pool.getConnection();

    try {
      const anuncioId = randomUUID();
      const now = new Date();

      // Resolver IDs de comunidad y provincia
      let comunidadId = 0;
      let provinciaId = 0;
      let provinciaNombre = provincia || comunidad_autonoma;

      const [comunidadRows] = await connection.execute(
        'SELECT id FROM comunidades WHERE nombre = ? LIMIT 1',
        [comunidad_autonoma]
      );
      const comunidadRow = (comunidadRows as any[])[0];
      if (comunidadRow) {
        comunidadId = comunidadRow.id;
        const [provinciaRows] = await connection.execute(
          'SELECT id, nombre FROM provincias WHERE comunidad_id = ? LIMIT 1',
          [comunidadId]
        );
        const provinciaRow = (provinciaRows as any[])[0];
        if (provinciaRow) {
          provinciaId = provinciaRow.id;
          provinciaNombre = provincia || provinciaRow.nombre;
        }
      }

      const textoCompleto = `${titulo} ${descripcion}`;
      const resultadoIA = moderarConIA(textoCompleto);
      const estadoModeracion = resultadoIA.aprobado ? 'approved' : 'rejected';
      const motivoRechazo = resultadoIA.aprobado ? null : resultadoIA.motivo;
      const visible = resultadoIA.aprobado ? 1 : 0;

      await connection.execute(
        `INSERT INTO anuncios (
          id, usuario_id, titulo, descripcion, categoria, comunidad_autonoma,
          comunidad_id, provincia, provincia_id, modalidad, visible, estado_moderacion, motivo_rechazo, creado_at, actualizado_at, vistas
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          anuncioId, userId, titulo.trim(), descripcion.trim(), categoria,
          comunidad_autonoma, comunidadId, provinciaNombre, provinciaId, modalidad || 'servicio',
          visible, estadoModeracion, motivoRechazo, now, now, 0
        ]
      );

      // Obtener el anuncio creado para devolverlo completo
      const [result] = await connection.execute(
        `SELECT
          a.id, a.usuario_id, a.titulo, a.descripcion, a.categoria, a.comunidad_autonoma,
          a.provincia, a.modalidad, a.visible, a.estado_moderacion, a.motivo_rechazo, a.creado_at, a.actualizado_at, a.vistas,
          u.nombre as usuario_nombre, u.email as usuario_email
        FROM anuncios a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.id = ?`,
        [anuncioId]
      );

      res.status(201).json({
        success: true,
        message: 'Anuncio creado exitosamente',
        data: (result as any)[0]
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error creando anuncio:', (error as Error).message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const updateAnuncio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      res.status(400).json({ success: false, message: 'ID de anuncio no válido' });
      return;
    }

    const {
      titulo,
      descripcion,
      categoria,
      comunidad_autonoma,
      provincia,
      modalidad
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
      return;
    }

    const connection = await pool.getConnection();
    
    try {
      // Verificar que el anuncio pertenece al usuario
      const [ownershipCheck] = await connection.execute(
        'SELECT usuario_id FROM anuncios WHERE id = ?',
        [id]
      );

      if ((ownershipCheck as any[]).length === 0) {
        res.status(404).json({
          success: false,
          error: 'Anuncio no encontrado'
        });
        return;
      }

      if ((ownershipCheck as any)[0].usuario_id !== userId) {
        res.status(403).json({
          success: false,
          error: 'No tienes permiso para editar este anuncio'
        });
        return;
      }

      // Actualizar anuncio
      await connection.execute(
        `UPDATE anuncios SET 
          titulo = ?, descripcion = ?, categoria = ?, comunidad_autonoma = ?,
          provincia = ?, modalidad = ?, actualizado_at = ?
        WHERE id = ?`,
        [titulo, descripcion, categoria, comunidad_autonoma, provincia, modalidad, new Date(), id]
      );

      // Obtener el anuncio actualizado
      const [result] = await connection.execute(
        `SELECT 
          a.id, a.usuario_id, a.titulo, a.descripcion, a.categoria, a.comunidad_autonoma,
          a.provincia, a.modalidad, a.visible, a.estado_moderacion, a.creado_at, a.actualizado_at, a.vistas,
          u.nombre as usuario_nombre, u.email as usuario_email
        FROM anuncios a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.id = ?`,
        [id]
      );

      res.status(200).json({
        success: true,
        message: 'Anuncio actualizado exitosamente',
        data: (result as any)[0]
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error actualizando anuncio:', (error as Error).message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const deleteAnuncio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      res.status(400).json({ success: false, message: 'ID de anuncio no válido' });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
      return;
    }

    const connection = await pool.getConnection();
    
    try {
      // Verificar que el anuncio pertenece al usuario
      const [ownershipCheck] = await connection.execute(
        'SELECT usuario_id FROM anuncios WHERE id = ?',
        [id]
      );

      if ((ownershipCheck as any[]).length === 0) {
        res.status(404).json({
          success: false,
          error: 'Anuncio no encontrado'
        });
        return;
      }

      if ((ownershipCheck as any)[0].usuario_id !== userId) {
        res.status(403).json({
          success: false,
          error: 'No tienes permiso para eliminar este anuncio'
        });
        return;
      }

      // Marcar como no visible (borrado lógico)
      await connection.execute(
        'UPDATE anuncios SET visible = 0, actualizado_at = ? WHERE id = ?',
        [new Date(), id]
      );

      res.status(200).json({
        success: true,
        message: 'Anuncio eliminado exitosamente'
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error eliminando anuncio:', (error as Error).message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const guardarAnuncio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      res.status(400).json({ success: false, message: 'ID de anuncio no válido' });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'INSERT IGNORE INTO favoritos (usuario_id, anuncio_id) VALUES (?, ?)',
        [userId, id]
      );
      res.status(200).json({ success: true, message: 'Anuncio guardado correctamente' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error guardando anuncio:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const eliminarGuardado = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      res.status(400).json({ success: false, message: 'ID de anuncio no válido' });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'DELETE FROM favoritos WHERE usuario_id = ? AND anuncio_id = ?',
        [userId, id]
      );
      res.status(200).json({ success: true, message: 'Anuncio eliminado de guardados' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error eliminando guardado:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const reportarAnuncio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      res.status(400).json({ success: false, message: 'ID de anuncio no válido' });
      return;
    }

    const { motivo, descripcion } = req.body;

    if (!motivo) {
      res.status(400).json({ success: false, error: 'El motivo es requerido' });
      return;
    }

    const connection = await pool.getConnection();
    try {
      const reporteId = randomUUID();
      await connection.execute(
        'INSERT INTO reportes_anuncios (id, anuncio_id, motivo, descripcion) VALUES (?, ?, ?, ?)',
        [reporteId, id, motivo, descripcion || null]
      );
      res.status(201).json({ success: true, message: 'Anuncio reportado correctamente' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error reportando anuncio:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getAnunciosModeracion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT
          a.id, a.usuario_id, a.titulo, a.descripcion, a.categoria, a.comunidad_autonoma,
          a.provincia, a.estado_moderacion, a.motivo_rechazo, a.creado_at, a.visible,
          u.nombre as usuario_nombre, u.email as usuario_email,
          COUNT(r.id) as reportes
        FROM anuncios a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        LEFT JOIN reportes_anuncios r ON a.id = r.anuncio_id AND r.estado = 'pendiente'
        WHERE a.estado_moderacion != 'approved' OR r.id IS NOT NULL
        GROUP BY a.id
        ORDER BY a.creado_at DESC`
      );

      res.status(200).json({ success: true, data: rows });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error obteniendo anuncios de moderación:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getReportesAnuncio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      res.status(400).json({ success: false, message: 'ID de anuncio no válido' });
      return;
    }

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT id, motivo, descripcion, estado, creado FROM reportes_anuncios WHERE anuncio_id = ? ORDER BY creado DESC',
        [id]
      );
      res.status(200).json({ success: true, data: rows });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error obteniendo reportes:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const moderarAnuncio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      res.status(400).json({ success: false, message: 'ID de anuncio no válido' });
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    const { accion, motivo_rechazo } = req.body;
    if (!accion || !['aprobar', 'rechazar'].includes(accion)) {
      res.status(400).json({ success: false, error: 'Acción no válida' });
      return;
    }

    const aprobado = accion === 'aprobar';
    const estado = aprobado ? 'approved' : 'rejected';
    const visible = aprobado ? 1 : 0;

    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'UPDATE anuncios SET estado_moderacion = ?, motivo_rechazo = ?, visible = ? WHERE id = ?',
        [estado, aprobado ? null : (motivo_rechazo || null), visible, id]
      );

      await connection.execute(
        "UPDATE reportes_anuncios SET estado = 'resuelto' WHERE anuncio_id = ? AND estado = 'pendiente'",
        [id]
      );

      res.status(200).json({ success: true, message: aprobado ? 'Anuncio aprobado' : 'Anuncio rechazado' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error moderando anuncio:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const moderarAnuncioIA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      res.status(400).json({ success: false, message: 'ID de anuncio no válido' });
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT titulo, descripcion FROM anuncios WHERE id = ?',
        [id]
      );

      const anuncio = (rows as any[])[0];
      if (!anuncio) {
        res.status(404).json({ success: false, error: 'Anuncio no encontrado' });
        return;
      }

      const resultado = moderarConIA(`${anuncio.titulo} ${anuncio.descripcion}`);
      const estado = resultado.aprobado ? 'approved' : 'rejected';
      const visible = resultado.aprobado ? 1 : 0;

      await connection.execute(
        'UPDATE anuncios SET estado_moderacion = ?, motivo_rechazo = ?, visible = ? WHERE id = ?',
        [estado, resultado.aprobado ? null : (resultado.motivo ?? null), visible, id]
      );

      await connection.execute(
        "UPDATE reportes_anuncios SET estado = 'resuelto' WHERE anuncio_id = ? AND estado = 'pendiente'",
        [id]
      );

      res.status(200).json({ success: true, data: { estado, motivo: resultado.motivo } });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error moderando anuncio con IA:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
