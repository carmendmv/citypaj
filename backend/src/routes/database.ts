import { Router } from 'express';
import { getDatabaseView, executeQuery, getAllDataRealtime } from '../controllers/database';

const router = Router();

// Vista de la base de datos
router.get('/view', getDatabaseView);

// Ejecutar consultas SQL
router.post('/query', executeQuery);

// Obtener todos los datos en tiempo real
router.get('/realtime', getAllDataRealtime);

export default router;
