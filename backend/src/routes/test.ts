import { Router } from 'express';
import { getAnunciosSimple, testDatabaseConnection, testDirectConnection } from '../controllers/anuncios-simple';

const router = Router();

// Ruta para probar conexión a base de datos
router.get('/test-db', testDatabaseConnection);

// Ruta para probar conexión directa (diagnóstico)
router.get('/test-direct', testDirectConnection);

// Ruta simplificada de anuncios para pruebas
router.get('/anuncios-simple', getAnunciosSimple);

export default router;
