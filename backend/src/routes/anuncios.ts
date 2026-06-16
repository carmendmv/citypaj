import { Router } from 'express';
import { getAnuncios, createAnuncio, updateAnuncio, deleteAnuncio } from '../controllers/anuncios';

const router = Router();

// Get all anuncios with pagination
router.get('/', getAnuncios);

// Create new anuncio
router.post('/', createAnuncio);

// Update anuncio
router.put('/:id', updateAnuncio);

// Delete anuncio
router.delete('/:id', deleteAnuncio);

export { router as anunciosRoutes };
