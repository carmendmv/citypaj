import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const uploadImagen = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No se ha enviado ningún archivo' });
      return;
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    const dest = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(dest, req.file.buffer);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.status(200).json({
      success: true,
      url: `${baseUrl}/uploads/${filename}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al guardar la imagen',
    });
  }
};
