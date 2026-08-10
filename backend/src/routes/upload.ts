import { Router } from 'express';
import { uploadImagen } from '../controllers/upload';
import { uploadSingleImage } from '../middleware/upload';

const router = Router();

router.post('/imagen', uploadSingleImage, uploadImagen);

export { router as uploadRoutes };
