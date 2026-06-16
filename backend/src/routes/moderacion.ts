import { Router } from 'express';

const router = Router();

// Get all moderated content
router.get('/', (req, res) => {
  res.json({ message: 'Get all moderated content endpoint' });
});

// Moderate content
router.post('/:id/moderate', (req, res) => {
  res.json({ message: 'Moderate content endpoint' });
});

export { router as moderacionRoutes };
