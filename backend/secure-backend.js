const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const mysql = require('mysql2/promise');

// Configuración de seguridad y respaldo
class SecureBackend {
  constructor() {
    this.port = process.env.BACKEND_PORT || 3002;
    this.httpsPort = process.env.BACKEND_HTTPS_PORT || 3443;
    this.isHealthy = true;
    this.dbConnection = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000;
    this.backupMode = false;
    
    // Configuración de la base de datos
    this.dbConfig = {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'citypaj_user',
      password: process.env.DB_PASSWORD || 'citypaj_password',
      database: process.env.DB_NAME || 'citypaj_db',
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      multipleStatements: true
    };
  }

  // Generar certificados SSL para el backend
  generateSSLCertificates() {
    const certDir = path.join(__dirname, 'certificates');
    const keyPath = path.join(certDir, 'backend.key');
    const certPath = path.join(certDir, 'backend.crt');
    
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }
    
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      console.log('🔐 Generando certificados SSL para backend...');
      try {
        execSync(`openssl genrsa -out "${keyPath}" 2048`, { stdio: 'inherit' });
        execSync(`openssl req -new -x509 -key "${keyPath}" -out "${certPath}" -days 365 -subj "/C=ES/ST=Madrid/L=Madrid/O=CityPAJ/CN=localhost"`, { stdio: 'inherit' });
        console.log('✅ Certificados SSL del backend generados correctamente');
      } catch (error) {
        console.error('❌ Error generando certificados SSL del backend:', error.message);
        process.exit(1);
      }
    }
  }

  // Sistema de reconexión automática a la base de datos
  async connectToDatabase() {
    try {
      if (this.dbConnection) {
        await this.dbConnection.end();
      }
      
      this.dbConnection = mysql.createPool(this.dbConfig);
      
      // Verificar conexión
      const [rows] = await this.dbConnection.execute('SELECT 1 as test');
      console.log('✅ Conexión a MySQL establecida correctamente');
      this.isHealthy = true;
      this.reconnectAttempts = 0;
      this.backupMode = false;
      
      return true;
    } catch (error) {
      console.error('❌ Error conectando a MySQL:', error.message);
      this.isHealthy = false;
      this.backupMode = true;
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`🔄 Intento de reconexión a MySQL ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
        
        setTimeout(() => this.connectToDatabase(), this.reconnectDelay);
      } else {
        console.log('❌ Máximo de intentos de reconexión a MySQL alcanzado - Modo respaldo activado');
        this.activateBackupMode();
      }
      
      return false;
    }
  }

  // Modo de respaldo con datos cacheados
  activateBackupMode() {
    console.log('🔄 Activando modo de respaldo...');
    this.backupMode = true;
    
    // Cargar datos de respaldo si existen
    try {
      const backupFile = path.join(__dirname, 'backup-data.json');
      if (fs.existsSync(backupFile)) {
        this.backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
        console.log('✅ Datos de respaldo cargados correctamente');
      }
    } catch (error) {
      console.log('⚠️ No se encontraron datos de respaldo');
      this.backupData = { anuncios: [] };
    }
  }

  // Guardar datos de respaldo
  saveBackupData(data) {
    try {
      const backupFile = path.join(__dirname, 'backup-data.json');
      fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
      console.log('💾 Datos de respaldo actualizados');
    } catch (error) {
      console.error('❌ Error guardando datos de respaldo:', error.message);
    }
  }

  // Health check del sistema
  async healthCheck() {
    const status = {
      status: this.isHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '2.0.0-secure',
      database: {
        connected: this.dbConnection !== null,
        backupMode: this.backupMode,
        reconnectAttempts: this.reconnectAttempts
      },
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    };

    if (this.isHealthy && this.dbConnection) {
      try {
        const [rows] = await this.dbConnection.execute('SELECT COUNT(*) as total FROM anuncios LIMIT 1');
        status.database.anunciosCount = rows[0].total;
      } catch (error) {
        status.database.error = error.message;
      }
    }

    return status;
  }

  // Obtener anuncios con sistema de respaldo
  async getAnuncios(pagina = 1, limite = 10) {
    const offset = (pagina - 1) * limite;
    
    try {
      if (!this.isHealthy || this.backupMode) {
        // Modo de respaldo
        console.log('🔄 Usando modo de respaldo para anuncios');
        
        if (this.backupData && this.backupData.anuncios) {
          const start = offset;
          const end = start + limite;
          const anuncios = this.backupData.anuncios.slice(start, end);
          
          return {
            success: true,
            data: {
              anuncios: anuncios,
              meta: {
                pagina: pagina,
                limite: limite,
                total: this.backupData.anuncios.length,
                totalPages: Math.ceil(this.backupData.anuncios.length / limite),
                backupMode: true
              }
            }
          };
        }
        
        throw new Error('Base de datos no disponible y no hay datos de respaldo');
      }

      // Modo normal
      const [anuncios] = await this.dbConnection.execute(
        'SELECT * FROM anuncios ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limite, offset]
      );
      
      const [totalResult] = await this.dbConnection.execute(
        'SELECT COUNT(*) as total FROM anuncios'
      );
      
      const total = totalResult[0].total;
      
      // Guardar en respaldo
      if (!this.backupData || this.backupData.anuncios.length !== total) {
        const [allAnuncios] = await this.dbConnection.execute(
          'SELECT * FROM anuncios ORDER BY created_at DESC'
        );
        this.saveBackupData({ anuncios: allAnuncios });
      }
      
      return {
        success: true,
        data: {
          anuncios: anuncios,
          meta: {
            pagina: pagina,
            limite: limite,
            total: total,
            totalPages: Math.ceil(total / limite),
            backupMode: false
          }
        }
      };
      
    } catch (error) {
      console.error('❌ Error obteniendo anuncios:', error.message);
      
      // Intentar activar modo de respaldo
      if (!this.backupMode) {
        this.backupMode = true;
        this.activateBackupMode();
        return this.getAnuncios(pagina, limite); // Reintentar con respaldo
      }
      
      throw error;
    }
  }

  // Crear servidor HTTPS seguro
  createSecureServer() {
    this.generateSSLCertificates();
    
    const options = {
      key: fs.readFileSync(path.join(__dirname, 'certificates', 'backend.key')),
      cert: fs.readFileSync(path.join(__dirname, 'certificates', 'backend.crt')),
      minVersion: 'TLSv1.2',
      ciphers: [
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES256-SHA384',
        'ECDHE-RSA-AES128-SHA256',
        'HIGH',
        '!aNULL',
        '!eNULL',
        '!EXPORT',
        '!DES',
        '!RC4',
        '!MD5',
        '!PSK',
        '!SRP',
        '!CAMELLIA'
      ].join(':'),
      honorCipherOrder: true
    };

    const server = https.createServer(options, async (req, res) => {
      console.log(`🔒 Backend Seguro: ${req.method} ${req.url} (HTTPS)`);
      
      // Headers de seguridad
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self';");
      
      // CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      const url = require('url');
      const parsedUrl = url.parse(req.url, true);
      
      // Health check
      if (parsedUrl.pathname === '/health') {
        try {
          const health = await this.healthCheck();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(health));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
          }));
        }
        return;
      }
      
      // API de anuncios
      if (parsedUrl.pathname === '/api/anuncios') {
        try {
          const pagina = parseInt(parsedUrl.query.pagina) || 1;
          const limite = parseInt(parsedUrl.query.limite) || 10;
          
          const result = await this.getAnuncios(pagina, limite);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
          
        } catch (error) {
          console.error('❌ Error en /api/anuncios:', error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Error interno del servidor',
            backupMode: this.backupMode,
            message: this.backupMode ? 'Funcionando en modo de respaldo' : 'Error temporal'
          }));
        }
        return;
      }
      
      // 404 para otras rutas
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
    });

    // Health check periódico
    setInterval(async () => {
      try {
        if (this.dbConnection) {
          await this.dbConnection.execute('SELECT 1');
          if (!this.isHealthy) {
            console.log('✅ Base de datos restaurada');
            this.isHealthy = true;
            this.backupMode = false;
            this.reconnectAttempts = 0;
          }
        }
      } catch (error) {
        if (this.isHealthy) {
          console.log('❌ Base de datos perdida - Activando reconexión');
          this.isHealthy = false;
          this.connectToDatabase();
        }
      }
    }, 30000);

    return server;
  }

  // Iniciar servidor
  async start() {
    console.log('🚀 Iniciando Backend Seguro de CityPAJ...');
    
    // Conectar a la base de datos
    await this.connectToDatabase();
    
    // Crear servidor HTTPS
    const server = this.createSecureServer();
    
    server.listen(this.httpsPort, () => {
      console.log(`🔒 CityPAJ Backend Seguro corriendo en https://localhost:${this.httpsPort}`);
      console.log(`🛡️  HTTPS/TLS activado con certificados SSL`);
      console.log(`💾 Sistema de respaldo automático activado`);
      console.log(`🔄 Sistema de reconexión automática activado`);
      console.log(`📊 Health checks periódicos activados`);
      console.log(`🔗 API endpoints:`);
      console.log(`   - Health: https://localhost:${this.httpsPort}/health`);
      console.log(`   - Anuncios: https://localhost:${this.httpsPort}/api/anuncios`);
    });

    // Manejo de errores
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Puerto ${this.httpsPort} en uso`);
      } else {
        console.error('❌ Error del servidor:', error);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('🛑 Cerrando backend...');
      if (this.dbConnection) {
        await this.dbConnection.end();
      }
      server.close(() => {
        console.log('✅ Backend cerrado correctamente');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('🛑 Cerrando backend...');
      if (this.dbConnection) {
        await this.dbConnection.end();
      }
      server.close(() => {
        console.log('✅ Backend cerrado correctamente');
        process.exit(0);
      });
    });
  }
}

// Iniciar backend seguro
const backend = new SecureBackend();
backend.start().catch(console.error);
