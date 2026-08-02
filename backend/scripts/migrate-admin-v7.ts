import { randomUUID } from 'crypto';
import { pool } from '../src/config/database';
import bcrypt from 'bcryptjs';

async function ensureColumn(table: string, column: string, def: string) {
  await pool.execute(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${def}`);
}

async function getOrCreateProvincia() {
  const [rows] = await pool.execute('SELECT id, nombre, comunidad_id FROM provincias ORDER BY id LIMIT 1') as any[];
  if (rows?.[0]) return { id: rows[0].id, nombre: rows[0].nombre, comunidad_id: rows[0].comunidad_id };
  return { id: 1, nombre: 'Zaragoza', comunidad_id: 1 };
}

async function getOrCreateComunidad(comunidadId: number) {
  const [rows] = await pool.execute('SELECT nombre FROM comunidades WHERE id = ? LIMIT 1', [comunidadId]) as any[];
  if (rows?.[0]) return rows[0].nombre;
  return 'Aragón';
}

async function main() {
  console.log('⚙️  Preparando tablas y datos mock para el panel de administración...');

  const provincia = await getOrCreateProvincia();
  const comunidad = await getOrCreateComunidad(provincia.comunidad_id);

  // 1. Asegurar columnas en usuarios
  await ensureColumn('usuarios', 'rol', "VARCHAR(20) NOT NULL DEFAULT 'usuario'");
  await ensureColumn('usuarios', 'activo', "TINYINT(1) NOT NULL DEFAULT 1");
  await ensureColumn('usuarios', 'verificado', "TINYINT(1) NOT NULL DEFAULT 0");
  await ensureColumn('usuarios', 'provincia', 'VARCHAR(100) NULL');

  // 1b. Recrear tablas administrativas para asegurar esquema completo
  const conn = await pool.getConnection();
  try {
    await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
    const tablas = [
      'mensajes_entidades_adjuntas',
      'comunicaciones_entidades',
      'admin_activity_logs',
      'comunicaciones_institucionales',
      'plantillas_comunicacion',
      'contactos_institucionales',
      'admin_tareas',
      'agenda_notas',
      'mensajes_staff',
    ];
    for (const t of tablas) {
      await conn.execute(`DROP TABLE IF EXISTS ${t}`);
      console.log(`🗑️  Tabla recreada: ${t}`);
    }
    await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
  } finally {
    conn.release();
  }

  // 2. Crear/actualizar usuarios staff con emails inventados
  const staff = [
    { id: randomUUID(), nombre: 'Carmen Admin', email: 'carmen.admin@citypaj.es', rol: 'admin', password: 'Admin123!' },
    { id: randomUUID(), nombre: 'Luis Moderador', email: 'luis.moderador@citypaj.es', rol: 'moderador', password: 'Moderador123!' },
    { id: randomUUID(), nombre: 'Marta Moderadora', email: 'marta.moderadora@citypaj.es', rol: 'moderador', password: 'Moderador123!' },
    { id: randomUUID(), nombre: 'Pablo Supervisor', email: 'pablo.supervisor@citypaj.es', rol: 'moderador', password: 'Moderador123!' },
  ];

  const staffByEmail: Record<string, any> = {};
  for (const u of staff) {
    const hash = await bcrypt.hash(u.password, 10);
    await pool.execute(
      `INSERT INTO usuarios (id, email, password_hash, nombre, rol, verificado, activo, provincia, creado_at, actualizado_at)
       VALUES (?, ?, ?, ?, ?, 1, 1, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash), nombre = VALUES(nombre), rol = VALUES(rol), activo = 1, verificado = 1`,
      [u.id, u.email, hash, u.nombre, u.rol, provincia.nombre]
    );
    console.log(`✅ Staff: ${u.email} (${u.rol})`);
  }

  const [dbStaff] = await pool.execute(
    `SELECT id, email, rol FROM usuarios WHERE email IN (?, ?, ?, ?)`,
    staff.map(s => s.email)
  ) as any[];
  for (const s of dbStaff) staffByEmail[s.email] = s;

  const adminId = staffByEmail['carmen.admin@citypaj.es'].id;
  const luisId = staffByEmail['luis.moderador@citypaj.es'].id;
  const martaId = staffByEmail['marta.moderadora@citypaj.es'].id;

  // 3. Tabla de tareas
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS admin_tareas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      estado ENUM('pendiente','en_progreso','completada','cancelada') DEFAULT 'pendiente',
      prioridad ENUM('baja','media','alta','urgente') DEFAULT 'media',
      asignado_a VARCHAR(36) NULL,
      creado_por VARCHAR(36) NULL,
      entidad_tipo VARCHAR(50) NULL,
      entidad_id VARCHAR(255) NULL,
      vencimiento DATETIME NULL,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP




    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const tareas = [
    ['Revisar anuncios culturales', 'Moderar nuevos anuncios del apartado Cultura.', 'pendiente', 'media', luisId, adminId, 'anuncio', null, '2026-08-10'],
    ['Contactar ayuntamiento Zaragoza', 'Trasladar sugerencias de vivienda juvenil.', 'en_progreso', 'alta', martaId, adminId, 'sugerencia', null, '2026-08-05'],
    ['Actualizar calendario de eventos', 'Añadir fechas de conciertos y talleres.', 'pendiente', 'baja', luisId, adminId, 'evento', null, '2026-08-20'],
    ['Verificar contacto institucional', 'Confirmar email del departamento de juventud.', 'completada', 'media', martaId, adminId, 'contacto', null, '2026-07-30'],
    ['Responder mensaje de Pablo', 'Aclarar dudas sobre moderación.', 'pendiente', 'urgente', adminId, luisId, 'mensaje', null, '2026-08-02'],
  ];

  for (const [titulo, descripcion, estado, prioridad, asignado, creador, entidad_tipo, entidad_id, vencimiento] of tareas) {
    await pool.execute(
      `INSERT IGNORE INTO admin_tareas (titulo, descripcion, estado, prioridad, asignado_a, creado_por, entidad_tipo, entidad_id, vencimiento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, descripcion, estado, prioridad, asignado, creador, entidad_tipo, entidad_id, vencimiento]
    );
  }
  console.log('✅ Tareas de administración creadas');

  // 4. Tabla de contactos institucionales
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS contactos_institucionales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      institucion VARCHAR(255) NOT NULL,
      tipo VARCHAR(100) NOT NULL,
      area_departamento VARCHAR(255) NULL,
      provincia VARCHAR(100) NULL,
      comunidad_autonoma VARCHAR(100) NULL,
      email_oficial VARCHAR(255) NULL,
      telefono VARCHAR(50) NULL,
      web VARCHAR(255) NULL,
      persona_contacto VARCHAR(255) NULL,
      estado ENUM('pendiente','verificado','inactivo') DEFAULT 'pendiente',
      verificado TINYINT(1) DEFAULT 0,
      verificado_at TIMESTAMP NULL,
      verificado_por VARCHAR(36) NULL,
      notas_internas TEXT NULL,
      creado_por VARCHAR(36) NULL,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP




    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const contactos = [
    ['Ayuntamiento de Zaragoza', 'Ayuntamiento', 'Concejalía de Juventud', provincia.nombre, comunidad, 'juventud@zaragoza.es', '976 123 456', 'https://zaragoza.es', 'Ana Pérez'],
    ['Diputación de Zaragoza', 'Diputación', 'Área de Juventud', provincia.nombre, comunidad, 'juventud@dpz.es', '976 654 321', 'https://dpz.es', 'Jorge López'],
    ['Centro Joven Zaragoza', 'Asociación', 'Programas de ocio', provincia.nombre, comunidad, 'info@centrojoven.es', '976 789 012', 'https://centrojoven.es', 'Sara Martín'],
  ];

  for (const [institucion, tipo, area, prov, ccaa, email, telefono, web, persona] of contactos) {
    await pool.execute(
      `INSERT IGNORE INTO contactos_institucionales
       (institucion, tipo, area_departamento, provincia, comunidad_autonoma, email_oficial, telefono, web, persona_contacto, estado, verificado, verificado_at, verificado_por, notas_internas, creado_por)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'verificado', 1, NOW(), ?, 'Contacto verificado de prueba', ?)`,
      [institucion, tipo, area, prov, ccaa, email, telefono, web, persona, adminId, adminId]
    );
  }
  console.log('✅ Contactos institucionales creados');

  // 5. Tabla de agenda / notas
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS agenda_notas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      cuerpo TEXT,
      fecha DATE NOT NULL,
      color VARCHAR(20) DEFAULT 'orange',
      usuario_id VARCHAR(36) NOT NULL,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP


    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const notas = [
    ['Reunión semanal de coordinación', 'Punto de situación de moderación y tareas.', '2026-08-05', 'blue', adminId],
    ['Festival de Jazz', 'Concierto al aire libre.', '2026-09-10', 'green', luisId],
    ['Taller de Poesía', 'Encuentro literario.', '2026-09-18', 'purple', martaId],
    ['Cierre de evaluación mensual', 'Revisar métricas y necesidades juveniles.', '2026-08-31', 'red', adminId],
  ];

  for (const [titulo, cuerpo, fecha, color, usuarioId] of notas) {
    await pool.execute(
      `INSERT IGNORE INTO agenda_notas (titulo, cuerpo, fecha, color, usuario_id) VALUES (?, ?, ?, ?, ?)`,
      [titulo, cuerpo, fecha, color, usuarioId]
    );
  }
  console.log('✅ Notas de agenda creadas');

  // 6. Plantillas de comunicación
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS plantillas_comunicacion (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      asunto VARCHAR(255) NOT NULL,
      cuerpo TEXT NOT NULL,
      descripcion TEXT,
      tipo VARCHAR(100) DEFAULT 'institucional',
      activa TINYINT(1) DEFAULT 1,
      eliminada TINYINT(1) DEFAULT 0,
      variables JSON NULL,
      creado_por VARCHAR(36) NULL,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP



    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const plantillas = [
    ['Comunicación de sugerencias ciudadanas', 'Traslado de sugerencias ciudadanas en {{provincia}}', 'A la atención de {{institucion}}: Desde CityPAJ se han recibido {{numero_sugerencias}} sugerencias ciudadanas.', 'Plantilla institucional', 'institucional'],
    ['Aviso de necesidad juvenil', 'Aviso: necesidad juvenil repetida en {{provincia}}', 'Se ha identificado una necesidad juvenil que aparece de forma reiterada: {{tema_principal}}.', 'Plantilla de aviso', 'institucional'],
    ['Resumen mensual', 'Resumen mensual de participación juvenil — {{provincia}}', 'Se adjunta el resumen mensual de actividad registrada en CityPAJ.', 'Plantilla de resumen', 'institucional'],
  ];

  for (const [nombre, asunto, cuerpo, descripcion, tipo] of plantillas) {
    await pool.execute(
      `INSERT IGNORE INTO plantillas_comunicacion (nombre, asunto, cuerpo, descripcion, tipo, activa, creado_por)
       VALUES (?, ?, ?, ?, ?, 1, ?)`,
      [nombre, asunto, cuerpo, descripcion, tipo, adminId]
    );
  }
  console.log('✅ Plantillas de comunicación creadas');

  // 7. Comunicaciones institucionales
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS comunicaciones_institucionales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      plantilla_id INT NULL,
      contacto_id INT NULL,
      remitente_id VARCHAR(36) NULL,
      asunto VARCHAR(255) NOT NULL,
      cuerpo TEXT NOT NULL,
      estado ENUM('borrador','enviado','programada','cancelada') DEFAULT 'borrador',
      provincia VARCHAR(100) NULL,
      comunidad_autonoma VARCHAR(100) NULL,
      institucion VARCHAR(255) NULL,
      area VARCHAR(255) NULL,
      email_destino VARCHAR(255) NULL,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP




    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS comunicaciones_entidades (
      id INT AUTO_INCREMENT PRIMARY KEY,
      comunicacion_id INT NOT NULL,
      entidad_tipo VARCHAR(50) NOT NULL,
      entidad_id INT NOT NULL,
      titulo VARCHAR(255) NULL,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [plantillaRows] = await pool.execute('SELECT id, asunto, cuerpo FROM plantillas_comunicacion ORDER BY id LIMIT 1') as any[];
  const [contactoRows] = await pool.execute('SELECT id, institucion, provincia, comunidad_autonoma, area_departamento, email_oficial FROM contactos_institucionales ORDER BY id LIMIT 1') as any[];
  const plantillaId = plantillaRows?.[0]?.id;
  const contacto = contactoRows?.[0];

  if (plantillaId && contacto) {
    await pool.execute(
      `INSERT IGNORE INTO comunicaciones_institucionales
       (plantilla_id, contacto_id, remitente_id, asunto, cuerpo, estado, provincia, comunidad_autonoma, institucion, area, email_destino)
       VALUES (?, ?, ?, ?, ?, 'borrador', ?, ?, ?, ?, ?)`,
      [plantillaId, contacto.id, adminId, contacto.institucion, `Borrador de comunicación con ${contacto.institucion}`, contacto.provincia, contacto.comunidad_autonoma, contacto.institucion, contacto.area_departamento, contacto.email_oficial]
    );
    console.log('✅ Comunicaciones institucionales de prueba creadas');
  }

  // 8. Mensajería de staff
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS mensajes_staff (
      id INT AUTO_INCREMENT PRIMARY KEY,
      remitente_id VARCHAR(36) NOT NULL,
      destinatario_id VARCHAR(36) NULL,
      asunto VARCHAR(255) NOT NULL,
      cuerpo TEXT NOT NULL,
      leido TINYINT(1) DEFAULT 0,
      leido_at TIMESTAMP NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  );
  await ensureColumn('mensajes_staff', 'anuncio_id', 'VARCHAR(36) NULL');
  await ensureColumn('mensajes_staff', 'padre_id', 'INT NULL');
  await ensureColumn('mensajes_staff', 'prioridad', "ENUM('baja','normal','alta','urgente') DEFAULT 'normal'");
  await ensureColumn('mensajes_staff', 'estado', "ENUM('borrador','enviado') DEFAULT 'enviado'");
  await ensureColumn('mensajes_staff', 'eliminado_remitente', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('mensajes_staff', 'eliminado_destinatario', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('mensajes_staff', 'archivado_remitente', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('mensajes_staff', 'archivado_destinatario', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('mensajes_staff', 'creado_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS mensajes_staff (
      id INT AUTO_INCREMENT PRIMARY KEY,
      remitente_id VARCHAR(36) NOT NULL,
      destinatario_id VARCHAR(36) NULL,
      asunto VARCHAR(255) NOT NULL,
      cuerpo TEXT NOT NULL,
      leido TINYINT(1) DEFAULT 0,
      leido_at TIMESTAMP NULL,
      anuncio_id VARCHAR(36) NULL,
      padre_id INT NULL,
      prioridad ENUM('baja','normal','alta','urgente') DEFAULT 'normal',
      estado ENUM('borrador','enviado') DEFAULT 'enviado',
      eliminado_remitente TINYINT(1) DEFAULT 0,
      eliminado_destinatario TINYINT(1) DEFAULT 0,
      archivado_remitente TINYINT(1) DEFAULT 0,
      archivado_destinatario TINYINT(1) DEFAULT 0,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP




    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS mensajes_entidades_adjuntas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mensaje_id INT NOT NULL,
      entidad_tipo VARCHAR(50) NOT NULL,
      entidad_id VARCHAR(36) NOT NULL,
      titulo VARCHAR(255) NULL,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const mensajes = [
    [adminId, luisId, 'Bienvenida al equipo', 'Hola Luis, bienvenido al equipo de moderación de CityPAJ.', 'normal'],
    [luisId, adminId, 'Re: Bienvenida al equipo', 'Gracias Carmen, estoy listo para empezar.', 'normal'],
    [martaId, luisId, 'Duda sobre moderación', '¿Cómo actuamos con los anuncios de cultura sin cartel?', 'normal'],
    [adminId, martaId, 'Calendario de agosto', 'He actualizado el calendario con los eventos de agosto.', 'alta'],
  ];

  for (const [remitente, destinatario, asunto, cuerpo, prioridad] of mensajes) {
    await pool.execute(
      `INSERT IGNORE INTO mensajes_staff (remitente_id, destinatario_id, asunto, cuerpo, leido, prioridad, estado)
       VALUES (?, ?, ?, ?, 0, ?, 'enviado')`,
      [remitente, destinatario, asunto, cuerpo, prioridad]
    );
  }
  console.log('✅ Mensajes de staff creados');

  // 9. Logs de actividad
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS admin_activity_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id VARCHAR(36) NULL,
      accion VARCHAR(100) NOT NULL,
      entidad VARCHAR(100) NULL,
      entidad_id VARCHAR(255) NULL,
      detalles TEXT NULL,
      ip VARCHAR(64) NULL,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP



    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const logs = [
    [adminId, 'inicio_sesion', 'sesion', null, 'Inicio de sesión en el panel', '127.0.0.1'],
    [luisId, 'moderar_anuncio', 'anuncio', null, 'Aprobó un anuncio de empleo', '127.0.0.1'],
    [martaId, 'crear_tarea', 'tarea', null, 'Creó una tarea de verificación', '127.0.0.1'],
    [adminId, 'enviar_comunicacion', 'comunicacion', null, 'Envió comunicación a institución', '127.0.0.1'],
    [luisId, 'responder_mensaje', 'mensaje', null, 'Respondió mensaje de staff', '127.0.0.1'],
  ];

  for (const [usuario, accion, entidad, entidadId, detalles, ip] of logs) {
    await pool.execute(
      `INSERT IGNORE INTO admin_activity_logs (usuario_id, accion, entidad, entidad_id, detalles, ip) VALUES (?, ?, ?, ?, ?, ?)`,
      [usuario, accion, entidad, entidadId, detalles, ip]
    );
  }
  console.log('✅ Logs de actividad creados');

  // 10. Seed sugerencias y propuestas si están vacías
  const [[{ total: totalSugerencias }]] = await pool.execute('SELECT COUNT(*) as total FROM sugerencias') as any[];
  if (totalSugerencias === 0) {
    const sugerencias = [
      ['Mejorar transporte nocturno', 'Necesitamos más autobuses nocturnos los fines de semana.', comunidad, 'Transporte'],
      ['Más actividades culturales', 'Propuesta de conciertos gratuitos en barrios.', comunidad, 'Cultura'],
      ['App de búsqueda de empleo', 'Crear un buscador de ofertas para jóvenes.', provincia.nombre, 'Empleo'],
    ];
    for (const [titulo, descripcion, ccaa, categoria] of sugerencias) {
      await pool.execute(
        `INSERT IGNORE INTO sugerencias (titulo, descripcion, comunidad_autonoma, categoria, visible, creado_at, actualizado_at)
         VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
        [titulo, descripcion, ccaa, categoria]
      );
    }
    console.log('✅ Sugerencias de prueba creadas');
  }

  const [[{ total: totalPropuestas }]] = await pool.execute('SELECT COUNT(*) as total FROM propuestas') as any[];
  if (totalPropuestas === 0) {
    const propuestas = [
      ['Vivienda compartida para jóvenes', 'Crear cooperativas de vivienda en la provincia.', provincia.nombre, 'Vivienda'],
      ['Programa de mentoría laboral', 'Conectar a jóvenes con profesionales.', provincia.nombre, 'Empleo'],
    ];
    for (const [titulo, descripcion, prov, categoria] of propuestas) {
      await pool.execute(
        `INSERT IGNORE INTO propuestas (titulo, descripcion, provincia, categoria, apoyos, visible, estado_moderacion, creado_at, actualizado_at)
         VALUES (?, ?, ?, ?, FLOOR(5 + RAND() * 50), 1, 'approved', NOW(), NOW())`,
        [titulo, descripcion, prov, categoria]
      );
    }
    console.log('✅ Propuestas de prueba creadas');
  }

  console.log('🎉 Migración v7 completada: panel de administración con datos mock.');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

