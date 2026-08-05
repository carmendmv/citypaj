import { Router } from 'express';
import { getUsuarios, getUsuarioById, getPerfilUsuario } from '../controllers/usuarios';

const router = Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.get('/:id/perfil', getPerfilUsuario);

export { router as usuariosRoutes };
