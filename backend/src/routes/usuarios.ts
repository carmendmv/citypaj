import { Router } from 'express';

const router = Router();

// Get all usuarios
router.get('/', (req, res) => {
  res.json({ message: 'Get all usuarios endpoint' });
});

// Get usuario by ID
router.get('/:id', (req, res) => {
  res.json({ message: 'Get usuario by ID endpoint' });
});

// Create new usuario
router.post('/', (req, res) => {
  res.json({ message: 'Create usuario endpoint' });
});

// Update usuario
router.put('/:id', (req, res) => {
  res.json({ message: 'Update usuario endpoint' });
});

// Delete usuario
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete usuario endpoint' });
});

export { router as usuariosRoutes };
