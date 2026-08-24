import { Request, Response } from 'express';
import { pool } from '../config/database';

export const getContenidoModeracion = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [anuncios] = await pool.execute(
      `SELECT id, titulo, descripcion, estado_moderacion, motivo_rechazo, creado_at
       FROM anuncios WHERE estado_moderacion IN ('pending', 'flagged') ORDER BY creado_at DESC`
    );
    res.status(200).json({ success: true, data: anuncios });
  } catch (error) {
    console.error('Error obteniendo contenido para moderar:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const moderarContenido = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado, motivo } = req.body;

    if (!['approved', 'rejected', 'flagged'].includes(estado)) {
      res.status(400).json({ success: false, error: 'Estado inválido' });
      return;
    }

    await pool.execute(
      'UPDATE anuncios SET estado_moderacion = ?, motivo_rechazo = ? WHERE id = ?',
      [estado, motivo || null, id]
    );

    res.status(200).json({ success: true, message: 'Contenido moderado correctamente' });
  } catch (error) {
    console.error('Error moderando contenido:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
