import { app } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { testConnection, pool } from './config/database';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const PORT = config.port;

const DEMO_MODERATOR_EMAIL = process.env.DEMO_MODERATOR_EMAIL || 'moderador@citypaj.demo';
const DEMO_MODERATOR_PASSWORD = process.env.DEMO_MODERATOR_PASSWORD || 'demo123';

async function seedDemoModerator() {
  try {
    const [rows] = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [DEMO_MODERATOR_EMAIL]);
    if ((rows as any[]).length > 0) return;

    const hash = await bcrypt.hash(DEMO_MODERATOR_PASSWORD, 10);
    await pool.execute(
      `INSERT INTO usuarios (id, email, password_hash, nombre, verificado, rol, creado_at, actualizado_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), DEMO_MODERATOR_EMAIL, hash, 'Moderador Demo', 1, 'moderador', new Date(), new Date()]
    );
    logger.info('Usuario moderador demo creado');
  } catch (error) {
    logger.error('Error creando moderador demo:', (error as Error).message);
  }
}

async function seedDemoAdmin() {
  try {
    const [rows] = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [process.env.DEMO_ADMIN_EMAIL || 'admin@citypaj.demo']);
    if ((rows as any[]).length > 0) return;

    const hash = await bcrypt.hash(process.env.DEMO_ADMIN_PASSWORD || 'demo123', 10);
    await pool.execute(
      `INSERT INTO usuarios (id, email, password_hash, nombre, verificado, rol, creado_at, actualizado_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), process.env.DEMO_ADMIN_EMAIL || 'admin@citypaj.demo', hash, 'Administrador Demo', 1, 'admin', new Date(), new Date()]
    );
    logger.info('Usuario admin demo creado');
  } catch (error) {
    logger.error('Error creando admin demo:', (error as Error).message);
  }
}

async function startServer() {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    logger.error('No se pudo conectar a la base de datos. Saliendo.');
    process.exit(1);
  }

  await seedDemoModerator();
  await seedDemoAdmin();

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(` CityPaj Backend API running on port ${PORT}`);
    logger.info(` Environment: ${config.env}`);
    logger.info(` Health check: http://localhost:${PORT}/health`);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      logger.info('Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
      logger.info('Process terminated');
      process.exit(0);
    });
  });
}

startServer().catch((error) => {
  logger.error('Error inesperado al iniciar:', error);
  process.exit(1);
});

export default {};
