import { Request, Response } from 'express';
import { pool } from '../config/database';

export const getReportes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute(
      `SELECT r.id, r.anuncio_id, r.motivo, r.descripcion, r.estado, r.creado,
              a.titulo as anuncio_titulo
       FROM reportes_anuncios r
       LEFT JOIN anuncios a ON r.anuncio_id = a.id
       ORDER BY r.creado DESC`
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error obteniendo reportes:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getReporteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT r.id, r.anuncio_id, r.motivo, r.descripcion, r.estado, r.creado,
              a.titulo as anuncio_titulo
       FROM reportes_anuncios r
       LEFT JOIN anuncios a ON r.anuncio_id = a.id
       WHERE r.id = ?`,
      [id]
    );
    const reportes = rows as any[];
    if (reportes.length === 0) {
      res.status(404).json({ success: false, error: 'Reporte no encontrado' });
      return;
    }
    res.status(200).json({ success: true, data: reportes[0] });
  } catch (error) {
    console.error('Error obteniendo reporte:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const updateReporte = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    await pool.execute(
      'UPDATE reportes_anuncios SET estado = ? WHERE id = ?',
      [estado, id]
    );
    res.status(200).json({ success: true, message: 'Reporte actualizado' });
  } catch (error) {
    console.error('Error actualizando reporte:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
