import { app } from './app';
import { config } from './config';
import { logger } from './utils/logger';

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`🚀 CityPaj Backend API running on port ${PORT}`);
  logger.info(`📚 Environment: ${config.env}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
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

export default server;
