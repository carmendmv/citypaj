import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'citypaj-backend' },
  transports: [
    // Solo agregar logs de archivo en desarrollo
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ] : [])
  ],
});

// Siempre agregar console para ver logs en Docker
logger.add(new winston.transports.Console({
  format: process.env.NODE_ENV === 'production' 
    ? winston.format.json() 
    : winston.format.simple()
}));

export { logger };
