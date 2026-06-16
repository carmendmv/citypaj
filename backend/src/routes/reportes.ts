import { Router } from 'express';

const router = Router();

// Get all reports
router.get('/', (req, res) => {
  res.json({ message: 'Get all reports endpoint' });
});

// Create new report
router.post('/', (req, res) => {
  res.json({ message: 'Create report endpoint' });
});

// Get report by ID
router.get('/:id', (req, res) => {
  res.json({ message: 'Get report by ID endpoint' });
});

export { router as reportesRoutes };
