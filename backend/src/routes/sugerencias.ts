import { Router } from 'express';

const router = Router();

// Get all sugerencias
router.get('/', (req, res) => {
  res.json({ message: 'Get all sugerencias endpoint' });
});

// Create new sugerencia
router.post('/', (req, res) => {
  res.json({ message: 'Create sugerencia endpoint' });
});

// Get sugerencia by ID
router.get('/:id', (req, res) => {
  res.json({ message: 'Get sugerencia by ID endpoint' });
});

export default router;
