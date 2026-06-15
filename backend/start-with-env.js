// Establecer variables de entorno antes de cargar el servidor
process.env.DB_HOST = '127.0.0.1';
process.env.DB_PORT = '3306';
process.env.DB_USER = 'citypaj_user';
process.env.DB_PASSWORD = 'citypaj_password';
process.env.DB_NAME = 'citypaj_db';
process.env.PORT = '3005';
process.env.NODE_ENV = 'development';
process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
process.env.JWT_EXPIRES_IN = '24h';

console.log('🔧 Variables de entorno establecidas:');
console.log(`   DB_HOST: ${process.env.DB_HOST}`);
console.log(`   DB_PORT: ${process.env.DB_PORT}`);
console.log(`   DB_USER: ${process.env.DB_USER}`);
console.log(`   DB_NAME: ${process.env.DB_NAME}`);
console.log(`   PORT: ${process.env.PORT}`);
console.log('');

// Cargar el servidor simple
require('./server-simple.js');
