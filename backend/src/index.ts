import { app } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { testConnection } from './config/database';

const PORT = config.port;

async function startServer() {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    logger.error('No se pudo conectar a la base de datos. Saliendo.');
    process.exit(1);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 CityPaj Backend API running on port ${PORT}`);
    logger.info(`📚 Environment: ${config.env}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
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
