import { app } from './app';

import { config } from './config';

import { logger } from './utils/logger';

import { testConnection, pool } from './config/database';

import bcrypt from 'bcryptjs';

import { randomUUID } from 'crypto';



const PORT = config.port;



interface DemoUser {

  email: string;

  password: string;

  nombre: string;

  rol: 'admin' | 'moderador' | 'usuario';

}



const demoUsers: DemoUser[] = [

  {

    email: process.env.DEMO_ADMIN_EMAIL || '',

    password: process.env.DEMO_ADMIN_PASSWORD || '',

    nombre: 'Administrador Demo',

    rol: 'admin',

  },

  {

    email: process.env.DEMO_MODERATOR_EMAIL || '',

    password: process.env.DEMO_MODERATOR_PASSWORD || '',

    nombre: 'Moderador Demo',

    rol: 'moderador',

  },

  {

    email: process.env.DEMO_USUARIO_EMAIL || '',

    password: process.env.DEMO_USUARIO_PASSWORD || '',

    nombre: 'Usuario Demo',

    rol: 'usuario',

  },

];



async function seedDemoUsers() {

  try {

    for (const user of demoUsers) {

      if (!user.email || !user.password) continue;

      const hash = await bcrypt.hash(user.password, config.security.bcryptRounds || 12);

      await pool.execute(

        `INSERT INTO usuarios (id, email, password_hash, nombre, verificado, activo, rol, creado_at, actualizado_at)

         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

         ON DUPLICATE KEY UPDATE

           password_hash = VALUES(password_hash),

           nombre = VALUES(nombre),

           rol = VALUES(rol),

           verificado = VALUES(verificado),

           activo = VALUES(activo),

           actualizado_at = VALUES(actualizado_at)`,

        [randomUUID(), user.email, hash, user.nombre, 1, 1, user.rol, new Date(), new Date()]

      );

      logger.info(`Usuario demo asegurado: ${user.email} (${user.rol})`);

    }

  } catch (error) {

    logger.error('Error creando usuarios demo:', (error as Error).message);

  }

}



async function startServer() {

  const dbConnected = await testConnection();

  if (!dbConnected) {

    logger.error('No se pudo conectar a la base de datos. Saliendo.');

    process.exit(1);

  }



  await seedDemoUsers();



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

