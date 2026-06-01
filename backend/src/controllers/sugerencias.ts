import { Request, Response } from 'express';
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

export interface Sugerencia {
  id?: string;
  nombre?: string;
  email?: string;
  categoria: string;
  prioridad: string;
  titulo: string;
  descripcion: string;
  tipo?: string;
  anonimo: boolean;
  comunidad_autonoma?: string;
  creado?: string;
  actualizado?: string;
  estado: 'pendiente' | 'revisada' | 'en_progreso' | 'resuelta' | 'rechazada';
}

export const createSugerencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nombre,
      email,
      titulo,
      descripcion,
      categoria = 'general',
      prioridad = 'media',
      tipo = 'sugerencia',
      anonimo = false,
      comunidad_autonoma
    } = req.body;
    
    // Validar campos requeridos
    if (!titulo || !descripcion) {
      res.status(400).json({ 
        success: false,
        error: 'Faltan campos requeridos: título y descripción' 
      });
      return;
    }

    // Validar email si no es anónimo
    if (!anonimo && !email) {
      res.status(400).json({ 
        success: false,
        error: 'El email es obligatorio cuando no es anónimo' 
      });
      return;
    }

    const client = await pool.connect();
    try {
      const sugerenciaId = require('crypto').randomUUID();
      const now = new Date().toISOString();

      // Insertar en la base de datos
      const query = `
        INSERT INTO sugerencias (
          id, nombre, email, titulo, descripcion, categoria, prioridad, 
          tipo, anonimo, comunidad_autonoma, creado, actualizado, estado
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id, creado, estado
      `;
      
      const values = [
        sugerenciaId,
        anonimo ? null : nombre?.trim(),
        anonimo ? null : email?.trim(),
        titulo.trim(),
        descripcion.trim(),
        categoria,
        prioridad,
        tipo,
        anonimo,
        comunidad_autonoma || null,
        now,
        now,
        'pendiente'
      ];

      const result = await client.query(query, values);

      res.status(201).json({
        success: true,
        message: 'Sugerencia guardada correctamente',
        data: {
          id: result.rows[0].id,
          titulo: titulo.trim(),
          tipo,
          estado: result.rows[0].estado,
          creado: result.rows[0].creado
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error creando sugerencia:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

export const getSugerencias = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '20',
      estado,
      categoria,
      prioridad
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    // Construir WHERE clause
    const whereConditions = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (estado) {
      whereConditions.push(`estado = $${paramIndex++}`);
      queryParams.push(estado);
    }

    if (categoria) {
      whereConditions.push(`categoria = $${paramIndex++}`);
      queryParams.push(categoria);
    }

    if (prioridad) {
      whereConditions.push(`prioridad = $${paramIndex++}`);
      queryParams.push(prioridad);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query principal
    const query = `
      SELECT 
        id, nombre, email, titulo, descripcion, categoria, prioridad, tipo,
        anonimo, comunidad_autonoma, creado, actualizado, estado
      FROM sugerencias
      ${whereClause}
      ORDER BY creado DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limitNum, offset);

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM sugerencias
      ${whereClause}
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
    console.error('Error obteniendo sugerencias:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

export const getSugerenciaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        id, nombre, email, titulo, descripcion, categoria, prioridad, tipo,
        anonimo, comunidad_autonoma, creado, actualizado, estado
      FROM sugerencias
      WHERE id = $1
    `;

    const client = await pool.connect();
    try {
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Sugerencia no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error obteniendo sugerencia:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

export const updateSugerencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['pendiente', 'revisada', 'en_progreso', 'resuelta', 'rechazada'].includes(estado)) {
      res.status(400).json({
        success: false,
        error: 'Estado inválido'
      });
      return;
    }

    const client = await pool.connect();
    try {
      const now = new Date().toISOString();

      await client.query(
        'UPDATE sugerencias SET estado = $1, actualizado = $2 WHERE id = $3',
        [estado, now, id]
      );

      res.status(200).json({
        success: true,
        message: 'Sugerencia actualizada correctamente',
        data: { estado, actualizado: now }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error actualizando sugerencia:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

export const deleteSugerencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM sugerencias WHERE id = $1 RETURNING id', [id]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Sugerencia no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Sugerencia eliminada correctamente'
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error eliminando sugerencia:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};
