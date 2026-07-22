import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { AuthRequest } from '../middleware/auth';
import { Pool } from 'pg';

// Conexión a base de datos PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  database: process.env.DB_NAME || 'citypaj',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'noalumno',
  ssl: false,
});

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

    // Construir WHERE clause
    const whereConditions = ['a.visible = true', 'a.estado_moderacion = \'approved\''];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (categoria) {
      whereConditions.push(`a.categoria = $${paramIndex++}`);
      queryParams.push(categoria);
    }

    if (comunidad_autonoma) {
      whereConditions.push(`a.comunidad_autonoma = $${paramIndex++}`);
      queryParams.push(comunidad_autonoma);
    }

    if (provincia) {
      whereConditions.push(`a.provincia = $${paramIndex++}`);
      queryParams.push(provincia);
    }

    if (busqueda) {
      whereConditions.push(`(a.titulo ILIKE $${paramIndex++} OR a.descripcion ILIKE $${paramIndex++})`);
      queryParams.push(`%${busqueda}%`, `%${busqueda}%`);
    }

    // Construir ORDER BY
    let orderBy = 'a.creado DESC';
    if (ordenar) {
      const [field, direction] = (ordenar as string).split('-');
      const directionSQL = direction === 'asc' ? 'ASC' : 'DESC';
      
      switch (field) {
        case 'titulo':
          orderBy = `a.titulo ${directionSQL}`;
          break;
        case 'precio':
          orderBy = `a.precio ${directionSQL} NULLS LAST`;
          break;
        case 'vistas':
          orderBy = `a.vistas ${directionSQL}`;
          break;
        case 'creado':
        default:
          orderBy = `a.creado ${directionSQL}`;
          break;
      }
    }

    const whereClause = whereConditions.join(' AND ');

    // Query principal
    const query = `
      SELECT 
        a.id,
        a.titulo,
        a.descripcion,
        a.categoria,
        a.comunidad_autonoma,
        a.provincia,
        a.precio,
        a.modalidad,
        a.creado,
        a.actualizado,
        a.vistas,
        u.nombre as autor,
        u.email as email,
        NULL AS telefono
      FROM anuncios a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limitNum, offset);

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM anuncios a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE ${whereClause}
    `;

    const client = await pool.connect();
    try {
      const [result, countResult] = await Promise.all([
        client.query(query, queryParams),
        client.query(countQuery, queryParams.slice(0, -2))
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limitNum);

      res.status(200).json({
        success: true,
        data: result.rows,
        meta: {
          page: parseInt(page as string),
          limit: limitNum,
          total,
          totalPages,
          hasNext: parseInt(page as string) < totalPages,
          hasPrev: parseInt(page as string) > 1
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error obteniendo anuncios:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const getAnuncioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        a.id,
        a.titulo,
        a.descripcion,
        a.categoria,
        a.comunidad_autonoma,
        a.provincia,
        a.precio,
        a.modalidad,
        a.creado,
        a.actualizado,
        a.vistas,
        u.nombre as autor,
        u.email as email,
        NULL AS telefono
      FROM anuncios a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.id = $1 AND a.visible = true AND a.estado_moderacion = 'approved'
    `;

    const client = await pool.connect();
    try {
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Anuncio no encontrado'
        });
        return;
      }

      // Incrementar vistas
      await client.query('UPDATE anuncios SET vistas = vistas + 1 WHERE id = $1', [id]);

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error obteniendo anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const createAnuncio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      titulo,
      descripcion,
      categoria,
      comunidad_autonoma,
      provincia,
      precio,
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

    // Validaciones básicas
    if (!titulo || !descripcion || !categoria || !comunidad_autonoma || !provincia) {
      res.status(400).json({
        success: false,
        error: 'Faltan campos obligatorios'
      });
      return;
    }

    const client = await pool.connect();
    try {
      const anuncioId = randomUUID();
      const now = new Date().toISOString();

      await client.query(
        `INSERT INTO anuncios (
          id, usuario_id, titulo, descripcion, categoria, comunidad_autonoma, 
          provincia, precio, modalidad, visible, estado_moderacion, creado, actualizado, vistas
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        )`,
        [
          anuncioId, userId, titulo.trim(), descripcion.trim(), categoria,
          comunidad_autonoma, provincia, precio || null, modalidad || 'servicio',
          true, 'approved', now, now, 0
        ]
      );

      // Obtener el anuncio creado para devolverlo completo
      const result = await client.query(
        `SELECT 
          a.id, a.titulo, a.descripcion, a.categoria, a.comunidad_autonoma,
          a.provincia, a.precio, a.modalidad, a.creado, a.actualizado, a.vistas,
          u.nombre as autor, u.email as email, NULL AS telefono
        FROM anuncios a
        JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.id = $1`,
        [anuncioId]
      );

      res.status(201).json({
        success: true,
        message: 'Anuncio creado exitosamente',
        data: result.rows[0]
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error creando anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const updateAnuncio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      categoria,
      comunidad_autonoma,
      provincia,
      precio,
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

    const client = await pool.connect();
    try {
      // Verificar que el anuncio pertenece al usuario
      const ownershipCheck = await client.query(
        'SELECT usuario_id FROM anuncios WHERE id = $1',
        [id]
      );

      if (ownershipCheck.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Anuncio no encontrado'
        });
        return;
      }

      if (ownershipCheck.rows[0].usuario_id !== userId) {
        res.status(403).json({
          success: false,
          error: 'No tienes permiso para editar este anuncio'
        });
        return;
      }

      // Actualizar anuncio
      const now = new Date().toISOString();
      await client.query(
        `UPDATE anuncios SET 
          titulo = $1, descripcion = $2, categoria = $3, comunidad_autonoma = $4,
          provincia = $5, precio = $6, modalidad = $7, actualizado = $8
        WHERE id = $9`,
        [titulo, descripcion, categoria, comunidad_autonoma, provincia, precio, modalidad, now, id]
      );

      // Obtener el anuncio actualizado
      const result = await client.query(
        `SELECT 
          a.id, a.titulo, a.descripcion, a.categoria, a.comunidad_autonoma,
          a.provincia, a.precio, a.modalidad, a.creado, a.actualizado, a.vistas,
          u.nombre as autor, u.email as email, NULL AS telefono
        FROM anuncios a
        JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.id = $1`,
        [id]
      );

      res.status(200).json({
        success: true,
        message: 'Anuncio actualizado exitosamente',
        data: result.rows[0]
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error actualizando anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const deleteAnuncio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
      return;
    }

    const client = await pool.connect();
    try {
      // Verificar que el anuncio pertenece al usuario
      const ownershipCheck = await client.query(
        'SELECT usuario_id FROM anuncios WHERE id = $1',
        [id]
      );

      if (ownershipCheck.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Anuncio no encontrado'
        });
        return;
      }

      if (ownershipCheck.rows[0].usuario_id !== userId) {
        res.status(403).json({
          success: false,
          error: 'No tienes permiso para eliminar este anuncio'
        });
        return;
      }

      // Marcar como no visible (borrado lógico)
      await client.query(
        'UPDATE anuncios SET visible = false, actualizado = $1 WHERE id = $2',
        [new Date().toISOString(), id]
      );

      res.status(200).json({
        success: true,
        message: 'Anuncio eliminado exitosamente'
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error eliminando anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const getAnunciosByUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
      return;
    }

    const query = `
      SELECT 
        a.id, a.titulo, a.descripcion, a.categoria, a.comunidad_autonoma,
        a.provincia, a.precio, a.modalidad, a.visible, a.estado_moderacion,
        a.creado, a.actualizado, a.vistas,
        u.nombre as autor, u.email as email, NULL AS telefono
      FROM anuncios a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.usuario_id = $1
      ORDER BY a.creado DESC
    `;

    const client = await pool.connect();
    try {
      const result = await client.query(query, [userId]);

      res.status(200).json({
        success: true,
        data: result.rows
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error obteniendo anuncios del usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Funciones adicionales requeridas por las rutas
export const createAnuncioPublico = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Similar a createAnuncio pero sin autenticación
    res.status(501).json({
      success: false,
      error: 'Función no implementada'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const hideAnuncio = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(501).json({
      success: false,
      error: 'Función no implementada'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const searchAnuncios = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Similar a getAnuncios pero con búsqueda específica
    res.status(501).json({
      success: false,
      error: 'Función no implementada'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const toggleFavorito = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(501).json({
      success: false,
      error: 'Función no implementada'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const getAnunciosGuardados = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(501).json({
      success: false,
      error: 'Función no implementada'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const incrementarVistas = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(501).json({
      success: false,
      error: 'Función no implementada'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
