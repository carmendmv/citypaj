import { Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AuthRequest } from './auth';

export const validate = (validations: ValidationChain[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Error de validación',
        details: errors.array(),
        requestId: req.requestId,
      });
      return;
    }

    next();
  };
};
