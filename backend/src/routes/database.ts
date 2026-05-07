import { Router } from 'express';
import { getDatabaseView, executeQuery } from '../controllers/database';

const router = Router();

// Vista de la base de datos
router.get('/view', getDatabaseView);

// Ejecutar consultas SQL
router.post('/query', executeQuery);

export default router;
