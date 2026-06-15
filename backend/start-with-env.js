const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.config');
  
  if (fs.existsSync(envPath)) {
    console.log('📄 Cargando variables de entorno desde .env.config');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      // Ignorar comentarios y líneas vacías
      if (line.trim() && !line.trim().startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        
        if (key && value) {
          process.env[key.trim()] = value;
          console.log(`   - ${key.trim()} = ${value}`);
        }
      }
    });
    
    console.log('✅ Variables de entorno cargadas');
  } else {
    console.log('⚠️  No se encontró archivo .env.config, usando variables por defecto');
  }
}

// Iniciar servidor con variables de entorno
function startServer() {
  // Cargar variables de entorno
  loadEnvFile();
  
  // Configuración desde variables de entorno
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'citypaj',
    user: process.env.DB_USER || 'citypaj_user',
    password: process.env.DB_PASSWORD || 'citypaj123',
    serverPort: process.env.PORT || 3002,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001'
  };
  
  console.log('🚀 Iniciando servidor con configuración:');
  console.log(`   - Base de datos: ${config.database}@${config.host}:${config.port}`);
  console.log(`   - Usuario: ${config.user}`);
  console.log(`   - Puerto servidor: ${config.serverPort}`);
  console.log(`   - Frontend: ${config.frontendUrl}`);
  console.log(`   - Entorno: ${config.nodeEnv}`);
  
  // Importar y ejecutar el servidor principal
  try {
    const server = require('./server-complete.js');
    console.log('✅ Servidor iniciado exitosamente');
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error.message);
    process.exit(1);
  }
}

// Ejecutar inicio
startServer();
