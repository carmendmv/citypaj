import { randomUUID } from 'crypto';
import { pool } from '../src/config/database';
import bcrypt from 'bcryptjs';

const STAFF_EMAILS = ['carmen.admin@citypaj.es', 'luis.moderador@citypaj.es', 'marta.moderadora@citypaj.es'];
const DEFAULT_CCAA = 'Aragón';
const DEFAULT_PROV = 'Zaragoza';

const tableColumns: Record<string, string[]> = {};

async function getColumns(table: string): Promise<string[]> {
  if (tableColumns[table]) return tableColumns[table];
  const [rows] = await pool.execute(`SHOW COLUMNS FROM ${table}`) as any[];
  tableColumns[table] = (rows as any[]).map((r: any) => r.Field);
  return tableColumns[table];
}

async function tableExists(table: string): Promise<boolean> {
  const [rows] = await pool.execute('SHOW TABLES') as any[];
  const tables = (rows as any[]).map((r: any) => Object.values(r)[0] as string);
  return tables.includes(table);
}

async function createTableIfMissing(name: string, ddl: string) {
  if (!(await tableExists(name))) {
    await pool.execute(ddl);
    console.log(` Creada tabla: ${name}`);
  }
}

async function insertRow(table: string, values: Record<string, any>): Promise<any> {
  const cols = await getColumns(table);
  const entries = Object.entries(values).filter(([k, v]) => cols.includes(k) && v !== undefined);
  const fields = entries.map(([k]) => k).join(',');
  const placeholders = entries.map(() => '?').join(',');
  if (!fields) throw new Error(`No hay columnas válidas para ${table}`);
  const [result] = await pool.execute(`INSERT INTO ${table} (${fields}) VALUES (${placeholders})`, entries.map(([, v]) => v)) as any;
  return result;
}

async function count(table: string): Promise<number> {
  const [rows] = await pool.execute(`SELECT COUNT(*) as total FROM ${table}`) as any[];
  return (rows as any[])[0]?.total || 0;
}

function daysAgo(d: number): string {
  const date = new Date(Date.now() - d * 86400000);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

async function main() {
  console.log('️  Generando datos de ejemplo para moderación...');

  // Asegurar tablas de moderación
  await createTableIfMissing('comunidad_publicaciones', `
    CREATE TABLE IF NOT EXISTS comunidad_publicaciones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id VARCHAR(36) NULL,
      autor_nombre VARCHAR(255) NULL,
      ip VARCHAR(64) NULL,
      ip_creador VARCHAR(64) NULL,
      titulo VARCHAR(255) NOT NULL,
      contenido TEXT,
      provincia VARCHAR(100) NULL,
      tema VARCHAR(100) NULL,
      visible TINYINT(1) DEFAULT 1,
      estado_moderacion ENUM('pending','approved','rejected','flagged') DEFAULT 'pending',
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await createTableIfMissing('comunidad_comentarios', `
    CREATE TABLE IF NOT EXISTS comunidad_comentarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      publicacion_id INT NOT NULL,
      usuario_id VARCHAR(36) NULL,
      autor_nombre VARCHAR(255) NULL,
      ip VARCHAR(64) NULL,
      contenido TEXT,
      visible TINYINT(1) DEFAULT 1,
      estado_moderacion ENUM('pending','approved','rejected','flagged') DEFAULT 'approved',
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await createTableIfMissing('comunidad_reportes', `
    CREATE TABLE IF NOT EXISTS comunidad_reportes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id VARCHAR(36) NULL,
      autor_nombre VARCHAR(255) NULL,
      ip VARCHAR(64) NULL,
      tipo ENUM('publicacion','respuesta') NOT NULL,
      objeto_id INT NOT NULL,
      motivo VARCHAR(255) NULL,
      descripcion TEXT,
      estado ENUM('pendiente','revisado','descartado') DEFAULT 'pendiente',
      nota_moderacion TEXT,
      creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      revisado TIMESTAMP NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await createTableIfMissing('comunidad_likes', `
    CREATE TABLE IF NOT EXISTS comunidad_likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tipo ENUM('publicacion','respuesta') NULL,
      objeto_id INT NULL,
      ip VARCHAR(64) NULL,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await createTableIfMissing('reportes_anuncios', `
    CREATE TABLE IF NOT EXISTS reportes_anuncios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      anuncio_id VARCHAR(36) NULL,
      motivo VARCHAR(255) NULL,
      descripcion TEXT,
      estado ENUM('pendiente','revisado','descartado') DEFAULT 'pendiente',
      creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await createTableIfMissing('propuestas', `
    CREATE TABLE IF NOT EXISTS propuestas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id VARCHAR(36) NULL,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      provincia VARCHAR(100) NULL,
      categoria VARCHAR(100) NULL,
      ip_creador VARCHAR(64) NULL,
      apoyos INT DEFAULT 0,
      visible TINYINT(1) DEFAULT 1,
      estado_moderacion ENUM('pending','approved','rejected','flagged') DEFAULT 'approved',
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      trasladada TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await createTableIfMissing('propuestas_apoyos', `
    CREATE TABLE IF NOT EXISTS propuestas_apoyos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      propuesta_id INT NOT NULL,
      usuario_id VARCHAR(36) NULL,
      ip VARCHAR(64) NULL,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await createTableIfMissing('recursos', `
    CREATE TABLE IF NOT EXISTS recursos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id VARCHAR(36) NULL,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      categoria VARCHAR(100) NULL,
      provincia VARCHAR(100) NULL,
      url VARCHAR(255) NULL,
      verificado TINYINT(1) DEFAULT 0,
      visible TINYINT(1) DEFAULT 1,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await createTableIfMissing('eventos', `
    CREATE TABLE IF NOT EXISTS eventos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id VARCHAR(36) NULL,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      categoria VARCHAR(100) NULL,
      provincia VARCHAR(100) NULL,
      fecha_inicio DATE NULL,
      fecha_fin DATE NULL,
      precio DECIMAL(10,2) DEFAULT 0,
      ubicacion VARCHAR(255) NULL,
      url VARCHAR(255) NULL,
      ip_creador VARCHAR(64) NULL,
      visible TINYINT(1) DEFAULT 1,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await createTableIfMissing('moderacion_logs', `
    CREATE TABLE IF NOT EXISTS moderacion_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      anuncio_id VARCHAR(36) NULL,
      moderador_id VARCHAR(36) NULL,
      accion VARCHAR(100) NULL,
      estado_previo VARCHAR(50) NULL,
      estado_nuevo VARCHAR(50) NULL,
      motivo TEXT,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Usuarios base
  let [normalUsers] = await pool.execute(`SELECT id, nombre FROM usuarios WHERE rol = 'usuario' LIMIT 10`) as any[];
  normalUsers = normalUsers as any[];

  if (normalUsers.length < 5) {
    for (let i = 0; i < 5 - normalUsers.length; i++) {
      const id = randomUUID();
      const nombre = `Usuario de ejemplo ${i + 1}`;
      const pass = await bcrypt.hash('Test1234!', 10);
      await pool.execute(
        `INSERT IGNORE INTO usuarios (id, nombre, email, password_hash, rol, verificado, activo, creado_at, actualizado_at)
         VALUES (?, ?, ?, ?, 'usuario', 1, 1, NOW(), NOW())`,
        [id, nombre, `usuario-ejemplo${i}@example.com`, pass]
      );
      normalUsers.push({ id, nombre });
    }
  }

  const [staff] = await pool.execute(
    `SELECT id, email FROM usuarios WHERE email IN (${STAFF_EMAILS.map(() => '?').join(',')})`,
    STAFF_EMAILS
  ) as any[];
  const staffByEmail: Record<string, string> = {};
  for (const s of staff as any[]) staffByEmail[s.email] = s.id;
  const adminId = staffByEmail['carmen.admin@citypaj.es'] || (normalUsers as any[])[0].id;
  const luisId = staffByEmail['luis.moderador@citypaj.es'] || adminId;
  const martaId = staffByEmail['marta.moderadora@citypaj.es'] || adminId;
  const staffIds = [adminId, luisId, martaId];

  const randomUser = () => (normalUsers as any[])[Math.floor(Math.random() * (normalUsers as any[]).length)];

  // 1. ANUNCIOS
  if (await count('anuncios') < 30) {
    const anunciosMock = [
      ['Clases de guitarra', 'Aprende guitarra desde cero. Clases presenciales en Zaragoza.', 'formacion', 'approved', 1, 45, null],
      ['Piso compartido en centro', 'Se busca compañero/a para piso compartido cerca del centro.', 'vivienda', 'pending', 0, 12, null],
      ['Oferta empleo camarero', 'Buscamos camarero para fin de semana en restaurante.', 'empleo', 'approved', 1, 120, null],
      ['Concierto jazz', 'Concierto benéfico de jazz en el parque.', 'ocio', 'pending', 0, 8, null],
      ['Servicio de traducción', 'Traducciones inglés-español urgentes.', 'servicios', 'rejected', 0, 3, 'Contenido duplicado'],
      ['Vendo bicicleta', 'Bicicleta de montaña casi nueva.', 'ocio', 'flagged', 0, 6, 'Imagen no adecuada'],
      ['Clases de cocina', 'Taller de cocina vegana para jóvenes.', 'formacion', 'approved', 1, 22, null],
      ['Busco compañero de piso', 'Joven estudiante busca habitación.', 'vivienda', 'pending', 0, 15, null],
      ['Programador junior', 'Startup busca programador junior con conocimientos de React.', 'empleo', 'approved', 1, 67, null],
      ['Ruta senderismo', 'Salida de senderismo este sábado.', 'ocio', 'approved', 1, 34, null],
      ['Clases de inglés', 'Inglés conversacional a buen precio.', 'formacion', 'pending', 0, 9, null],
      ['Alquiler de trastero', 'Trastero pequeño en alquiler.', 'vivienda', 'flagged', 0, 2, 'Datos de contacto personales'],
      ['Monitor de ocio', 'Monitor para actividades de verano.', 'empleo', 'approved', 1, 18, null],
      ['Venta de libros', 'Lote de libros de filosofía.', 'ocio', 'approved', 1, 5, null],
      ['Reparación de móviles', 'Servicio técnico rápido.', 'servicios', 'pending', 0, 11, null],
      ['Clases de yoga', 'Yoga al aire libre.', 'ocio', 'rejected', 0, 1, 'Servicio no permitido'],
      ['Canguro', 'Canguro con experiencia.', 'servicios', 'approved', 1, 28, null],
      ['Comparto coche', 'Busco compañeros para compartir coche al trabajo.', 'servicios', 'pending', 0, 7, null],
      ['Curso de fotografía', 'Curso intensivo de fotografía.', 'formacion', 'approved', 1, 40, null],
      ['Alquiler de despacho', 'Despacho compartido para profesionales.', 'vivienda', 'flagged', 0, 4, 'Precio sospechoso'],
    ];

    const anuncioIds: string[] = [];
    for (let i = 0; i < anunciosMock.length; i++) {
      const [titulo, descripcion, categoria, estado, visible, vistas, motivo] = anunciosMock[i] as any[];
      const u = randomUser();
      const id = randomUUID();
      anuncioIds.push(id);
      const base: Record<string, any> = {
        id,
        usuario_id: u.id,
        titulo,
        descripcion,
        categoria,
        subcategoria: categoria,
        comunidad_autonoma: DEFAULT_CCAA,
        provincia: DEFAULT_PROV,
        comunidad_id: 1,
        provincia_id: 1,
        barrio: 'Centro',
        modalidad: i % 2 === 0 ? 'presencial' : 'online',
        contacto_email: u.nombre.replace(/\s+/g, '.').toLowerCase() + '@example.com',
        contacto_telefono: '600' + String(100000 + i).slice(-6),
        contacto_anonimo: 0,
        visible,
        estado_moderacion: estado,
        motivo_rechazo: motivo,
        vistas,
        ip_creador: '127.0.0.1',
        cartel_url: null,
        creado_at: daysAgo(i * 2 + 1),
        actualizado_at: daysAgo(i),
      };
      try {
        await insertRow('anuncios', base);
      } catch (err: any) {
        console.log(`️ Anuncio ${titulo}: ${err.message}`);
      }
    }
    console.log(' Anuncios de ejemplo creados');

    // reportes sobre anuncios
    if (await count('reportes_anuncios') < 10) {
      for (let i = 0; i < 10; i++) {
        const anuncioId = anuncioIds[i % anuncioIds.length];
        await insertRow('reportes_anuncios', {
          anuncio_id: anuncioId,
          motivo: ['Contenido inapropiado', 'Spam', 'Datos personales', 'Estafa sospechosa', 'Fraude'][i % 5],
          descripcion: 'Este anuncio ha sido reportado automáticamente por el sistema de ejemplo.',
          estado: i < 7 ? 'pendiente' : 'revisado',
          creado: daysAgo(i + 2),
        });
      }
      console.log(' Reportes de anuncios creados');
    }

    // logs de moderación
    for (let i = 0; i < anuncioIds.length; i++) {
      const estados = ['pending', 'approved', 'rejected', 'flagged'];
      const prev = estados[i % estados.length];
      const next = estados[(i + 1) % estados.length];
      await insertRow('moderacion_logs', {
        anuncio_id: anuncioIds[i],
        moderador_id: staffIds[i % staffIds.length],
        accion: ['aprobacion', 'rechazo', 'revision', 'revision'][i % 4],
        estado_previo: prev,
        estado_nuevo: next,
        motivo: 'Decisión de moderación de ejemplo',
        creado_at: daysAgo(i),
      });
    }
  }

  // 2. COMUNIDAD
  if (await count('comunidad_publicaciones') < 15) {
    const temas = ['Empleo', 'Formación', 'Vivienda', 'Cultura', 'Ocio', 'Transporte', 'Salud mental', 'Participación ciudadana'];
    const posts: number[] = [];
    for (let i = 0; i < 15; i++) {
      const u = randomUser();
      const estado = ['approved', 'pending', 'flagged', 'rejected'][i % 4];
      const visible = estado === 'approved' ? 1 : 0;
      const result = await insertRow('comunidad_publicaciones', {
        usuario_id: u.id,
        autor_nombre: u.nombre,
        ip: '127.0.0.1',
        ip_creador: '127.0.0.1',
        titulo: `Publicación de ejemplo ${i + 1} sobre ${temas[i % temas.length]}`,
        contenido: `Contenido de ejemplo para el panel de moderación. Tema: ${temas[i % temas.length]}.`,
        provincia: DEFAULT_PROV,
        tema: temas[i % temas.length],
        visible,
        estado_moderacion: estado,
        creado_at: daysAgo(i * 3 + 1),
        actualizado_at: daysAgo(i * 3),
      });
      posts.push((result as any).insertId);
    }
    console.log(' Publicaciones de comunidad creadas');

    // comentarios
    if (await count('comunidad_comentarios') < 30) {
      for (let i = 0; i < 25; i++) {
        const u = randomUser();
        const publicacionId = posts[i % posts.length];
        const estado = i % 7 === 0 ? 'pending' : i % 11 === 0 ? 'flagged' : 'approved';
        await insertRow('comunidad_comentarios', {
          publicacion_id: publicacionId,
          usuario_id: u.id,
          autor_nombre: u.nombre,
          ip: '127.0.0.1',
          contenido: `Respuesta de ejemplo ${i + 1} a la publicación ${publicacionId}.`,
          visible: estado === 'approved' ? 1 : 0,
          estado_moderacion: estado,
          creado_at: daysAgo(i + 1),
          actualizado_at: daysAgo(i),
        });
      }
      console.log(' Comentarios de comunidad creados');
    }

    // likes
    for (let i = 0; i < 20; i++) {
      await insertRow('comunidad_likes', {
        tipo: i % 2 === 0 ? 'publicacion' : 'respuesta',
        objeto_id: posts[i % posts.length],
        ip: '127.0.0.' + (1 + (i % 255)),
      });
    }
    console.log(' Likes de comunidad creados');

    // reportes de comunidad
    if (await count('comunidad_reportes') < 10) {
      for (let i = 0; i < 10; i++) {
        const u = randomUser();
        const tipo = i % 2 === 0 ? 'publicacion' : 'respuesta';
        const objetoId = posts[i % posts.length];
        await insertRow('comunidad_reportes', {
          usuario_id: u.id,
          autor_nombre: u.nombre,
          ip: '127.0.0.1',
          tipo,
          objeto_id: objetoId,
          motivo: ['Contenido ofensivo', 'Spam', 'Información falsa', 'Acoso', 'Otro'][i % 5],
          descripcion: 'Reporte generado automáticamente para pruebas de moderación.',
          estado: i < 6 ? 'pendiente' : 'revisado',
          nota_moderacion: i >= 6 ? 'Revisado por moderador' : null,
          creado: daysAgo(i + 3),
          revisado: i >= 6 ? daysAgo(i) : null,
        });
      }
      console.log(' Reportes de comunidad creados');
    }
  }

  // 3. SUGERENCIAS
  if (await count('sugerencias') < 15) {
    const sugerenciasData = [
      ['Más autobuses nocturnos', 'Necesitamos más frecuencias los fines de semana.', 'Transporte', 'alta', 'Aragón'],
      ['Conciertos gratuitos', 'Propuesta de conciertos en parques.', 'Cultura', 'media', 'Aragón'],
      ['App de empleo', 'Un buscador de ofertas para jóvenes.', 'Empleo', 'alta', 'Aragón'],
      ['Vivienda compartida', 'Cooperativas de vivienda juvenil.', 'Vivienda', 'urgente', 'Aragón'],
      ['Talleres de salud mental', 'Grupos de apoyo para jóvenes.', 'Salud mental', 'media', 'Aragón'],
      ['Zonas wifi gratuitas', 'Más puntos de acceso en barrios.', 'Ocio', 'baja', 'Aragón'],
      ['Becas deporte', 'Ayudas para actividades deportivas.', 'Ayudas', 'media', 'Aragón'],
      ['Mentoría laboral', 'Conectar jóvenes con profesionales.', 'Empleo', 'alta', 'Aragón'],
      ['Parque de skate', 'Nueva pista de skate en el centro.', 'Ocio', 'baja', 'Aragón'],
      ['Transporte sostenible', 'Bonos de bici compartida.', 'Transporte', 'alta', 'Aragón'],
    ];
    const estados = ['pendiente', 'revisada', 'en_progreso', 'resuelta', 'rechazada'];
    for (let i = 0; i < sugerenciasData.length; i++) {
      const [titulo, descripcion, categoria, prioridad, ccaa] = sugerenciasData[i] as any[];
      await insertRow('sugerencias', {
        nombre: 'Ciudadano ' + i,
        email: `sug${i}@example.com`,
        edad: String(18 + (i % 12)),
        titulo,
        descripcion,
        categoria,
        prioridad,
        anonimo: i % 2,
        comunidad_autonoma: ccaa,
        fecha: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
        ip_creador: '127.0.0.1',
        estado: estados[i % estados.length],
        creado_at: daysAgo(i * 2 + 1),
      });
    }
    console.log(' Sugerencias creadas');
  }

  // 4. PROPUESTAS
  if (await count('propuestas') < 12) {
    const propuestasData = [
      ['Huertos urbanos', 'Crear huertos en solares disponibles.', 'Zaragoza', 'Participación ciudadana'],
      ['Biblioteca móvil', 'Servicio de biblioteca en barrios.', 'Zaragoza', 'Cultura'],
      ['Puntos limpios jóvenes', 'Espacios para reciclaje y reutilización.', 'Zaragoza', 'Problemas de la ciudad'],
      ['Carnet joven digital', 'Descuentos con carnet joven online.', 'Zaragoza', 'Propuestas de mejora'],
      ['Gimnasios gratuitos', 'Acceso gratuito a gimnasios municipales.', 'Zaragoza', 'Ocio'],
      ['Clubs de idiomas', 'Intercambios lingüísticas gratuitos.', 'Zaragoza', 'Formación'],
      ['App de transporte compartido', 'Compartir coche entre jóvenes.', 'Zaragoza', 'Transporte'],
      ['Becas para emprendedores', 'Apoyo a proyectos juveniles.', 'Zaragoza', 'Empleo'],
    ];
    const propIds: number[] = [];
    for (let i = 0; i < propuestasData.length; i++) {
      const [titulo, descripcion, provincia, categoria] = propuestasData[i] as any[];
      const u = randomUser();
      const estado = ['approved', 'pending', 'approved', 'flagged', 'approved', 'rejected'][i % 6];
      const result = await insertRow('propuestas', {
        usuario_id: u.id,
        titulo,
        descripcion,
        provincia,
        categoria,
        ip_creador: '127.0.0.1',
        apoyos: 5 + i * 7,
        visible: estado !== 'rejected' ? 1 : 0,
        estado_moderacion: estado,
        creado_at: daysAgo(i + 5),
        actualizado_at: daysAgo(i + 2),
      });
      propIds.push((result as any).insertId);
    }
    console.log(' Propuestas creadas');

    // apoyos
    for (let i = 0; i < 15; i++) {
      const u = randomUser();
      await insertRow('propuestas_apoyos', {
        propuesta_id: propIds[i % propIds.length],
        usuario_id: u.id,
        ip: '127.0.0.1',
      });
    }
    console.log(' Apoyos de propuestas creados');
  }

  // 5. RECURSOS Y EVENTOS
  if (await count('recursos') < 5) {
    const recursosData = [
      ['Guía de empleo juvenil', 'Recopilación de ayudas y ofertas.', 'Empleo', 'https://example.com/empleo', 1],
      ['Salud mental joven', 'Recursos de apoyo psicológico.', 'Salud mental', 'https://example.com/salud', 1],
      ['CIPAJ Zaragoza', 'Información del Centro de Información Juvenil.', 'Ayudas', 'https://example.com/cipaj', 1],
      ['Becas deporte', 'Listado de becas deportivas.', 'Ocio', 'https://example.com/deporte', 0],
      ['Talleres creativos', 'Talleres de arte y música.', 'Cultura', 'https://example.com/cultura', 0],
    ];
    for (let i = 0; i < recursosData.length; i++) {
      const [titulo, descripcion, categoria, url, verificado] = recursosData[i] as any[];
      await insertRow('recursos', {
        usuario_id: randomUser().id,
        titulo,
        descripcion,
        categoria,
        provincia: DEFAULT_PROV,
        url,
        verificado,
        visible: 1,
        creado_at: daysAgo(i + 10),
      });
    }
    console.log(' Recursos creados');
  }

  if (await count('eventos') < 5) {
    const eventosData = [
      ['Festival de Jazz', 'Concierto al aire libre.', 'Cultura', '2026-09-10', '2026-09-12', 0, 'Parque Grande'],
      ['Hackathon Juvenil', 'Competición de programación.', 'Formación', '2026-10-05', '2026-10-06', 0, 'Etopia'],
      ['Taller de Poesía', 'Encuentro literario.', 'Cultura', '2026-09-18', '2026-09-18', 0, 'Centro de Juventud'],
      ['Carrera Solidaria', 'Carrera benéfica.', 'Ocio', '2026-11-01', '2026-11-01', 5, 'Plaza del Pilar'],
      ['Mercado de empleo', 'Feria de empresas.', 'Empleo', '2026-09-25', '2026-09-25', 0, 'Palacio de Congresos'],
    ];
    for (let i = 0; i < eventosData.length; i++) {
      const [titulo, descripcion, categoria, inicio, fin, precio, ubicacion] = eventosData[i] as any[];
      await insertRow('eventos', {
        usuario_id: randomUser().id,
        titulo,
        descripcion,
        categoria,
        provincia: DEFAULT_PROV,
        fecha_inicio: inicio,
        fecha_fin: fin,
        precio,
        ubicacion,
        url: 'https://example.com/evento' + i,
        ip_creador: '127.0.0.1',
        visible: 1,
        creado_at: daysAgo(i + 3),
      });
    }
    console.log(' Eventos creados');
  }

  // 6. LOGS DE ACTIVIDAD
  if (await count('admin_activity_logs') < 15) {
    const acciones = [
      ['moderar_anuncio', 'anuncio', 'Aprobó anuncio'],
      ['rechazar_anuncio', 'anuncio', 'Rechazó anuncio'],
      ['revisar_reporte', 'reporte', 'Revisó reporte de comunidad'],
      ['moderar_publicacion', 'publicacion', 'Aprobó publicación'],
      ['moderar_comentario', 'comentario', 'Ocultó comentario'],
      ['resolver_sugerencia', 'sugerencia', 'Marcó sugerencia en progreso'],
      ['moderar_propuesta', 'propuesta', 'Aprobó propuesta'],
    ];
    for (let i = 0; i < 15; i++) {
      const [accion, entidad, detalles] = acciones[i % acciones.length] as any[];
      const mod = staffIds[i % staffIds.length];
      await insertRow('admin_activity_logs', {
        usuario_id: mod,
        accion,
        entidad,
        entidad_id: randomUUID(),
        detalles,
        ip: '127.0.0.1',
        creado_at: daysAgo(i),
      });
    }
    console.log(' Logs de actividad creados');
  }

  console.log(' Datos de ejemplo generados correctamente.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
