import { Router } from 'express';
import { testDiagnosticConnection } from '../controllers/diagnostic';

const router = Router();

// Ruta de diagnóstico sin conflictos de enrutamiento
router.get('/test-connection', testDiagnosticConnection);

export default router;
