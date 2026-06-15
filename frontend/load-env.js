// Script para cargar variables de entorno desde .env.config
const fs = require('fs');
const path = require('path');

// Ruta al archivo .env.config
const envConfigPath = path.resolve(__dirname, '.env.config');

// Verificar si el archivo existe
if (fs.existsSync(envConfigPath)) {
  // Leer el archivo y procesar las variables
  const envConfig = fs.readFileSync(envConfigPath, 'utf8');
  const envLines = envConfig.split('\n');
  
  envLines.forEach(line => {
    // Ignorar líneas vacías y comentarios
    if (line.trim() && !line.trim().startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      
      if (key && value) {
        // Establecer la variable de entorno
        process.env[key.trim()] = value;
      }
    }
  });
  
  console.log('✅ Variables de entorno cargadas desde .env.config');
} else {
  console.log('⚠️ Archivo .env.config no encontrado');
}
