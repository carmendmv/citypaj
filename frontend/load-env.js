const fs = require('fs');
const path = require('path');

// Cargar variables de entorno para el frontend
function loadFrontendEnv() {
  console.log('📄 Cargando variables de entorno para el frontend...');
  
  const envPath = path.join(__dirname, '.env.config');
  
  if (fs.existsSync(envPath)) {
    console.log('✅ Encontrado archivo .env.config');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    // Crear archivo .env.local para Next.js
    const nextEnvPath = path.join(__dirname, '.env.local');
    let nextEnvContent = '';
    
    lines.forEach(line => {
      // Ignorar comentarios y líneas vacías
      if (line.trim() && !line.trim().startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        
        if (key && value) {
          // Para Next.js, las variables públicas deben empezar con NEXT_PUBLIC_
          const nextKey = key.startsWith('NEXT_PUBLIC_') ? key : `NEXT_PUBLIC_${key}`;
          nextEnvContent += `${nextKey}=${value}\n`;
          console.log(`   - ${nextKey} = ${value}`);
        }
      }
    });
    
    // Escribir archivo .env.local
    fs.writeFileSync(nextEnvPath, nextEnvContent);
    console.log('✅ Variables de entorno cargadas en .env.local');
    
  } else {
    console.log('⚠️  No se encontró archivo .env.config');
  }
}

// Ejecutar carga de variables
loadFrontendEnv();
