import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { anunciosRoutes } from './routes/anuncios';
import { uploadRoutes } from './routes/upload';
import { adminRoutes } from './routes/admin';
import { usuariosRoutes } from './routes/usuarios';
import { moderacionRoutes } from './routes/moderacion';
import { reportesRoutes } from './routes/reportes';
import { comunidadRoutes } from './routes/comunidad';
import { propuestasRoutes } from './routes/propuestas';
import { recursosRoutes } from './routes/recursos';
import { eventosRoutes } from './routes/eventos';
import { estadisticasRoutes } from './routes/estadisticas';
import territoriosRoutes from './routes/territorios';
import provinciasRoutes from './routes/provincias';
import sugerenciasRoutes from './routes/sugerencias';
import { pool } from './config/database';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.env === 'development' ? 10000 : config.rateLimit.general,
  message: {
    error: 'Demasiadas peticiones, por favor inténtalo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.env === 'development' ? 100 : config.rateLimit.auth,
  message: {
    error: 'Demasiados intentos de autenticación, por favor inténtalo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General middleware
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = Array.isArray(req.headers['x-request-id'])
    ? req.headers['x-request-id'][0]
    : req.headers['x-request-id'] || generateRequestId();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

// Rate limiting
app.use('/api', limiter);
app.use('/api/auth', authLimiter);

// Health check endpoints
async function healthHandler(_req: Request, res: Response) {
  try {
    const [rows] = await pool.execute('SELECT 1 AS ok, DATABASE() AS db');
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      db: (rows as any[])[0]?.db,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Error de conexion a MySQL',
      timestamp: new Date().toISOString(),
    });
  }
}

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

async function testDbHandler(_req: Request, res: Response) {
  try {
    const [rows] = await pool.execute('SELECT 1 AS ok, DATABASE() AS db');
    res.status(200).json({
      success: true,
      status: 'ok',
      connected: true,
      database: (rows as any[])[0]?.db,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error en /test-db:', error);
    res.status(503).json({
      success: false,
      status: 'error',
      connected: false,
      error: error instanceof Error ? error.message : 'Error de conexión a MySQL',
    });
  }
}

app.get('/test-db', testDbHandler);
app.get('/api/test-db', testDbHandler);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/anuncios', anunciosRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/admin', adminRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/moderacion', moderacionRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/sugerencias', sugerenciasRoutes);
app.use('/api/comunidad', comunidadRoutes);
app.use('/api/propuestas', propuestasRoutes);
app.use('/api/recursos', recursosRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/territorios', territoriosRoutes);
app.use('/api/provincias', provinciasRoutes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    requestId: req.requestId,
  });
});

// Error handling middleware
app.use(errorHandler);

// Utility function to generate request ID
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export { app };
