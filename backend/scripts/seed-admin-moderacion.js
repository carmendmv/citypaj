const mysql = require('mysql2/promise');
const crypto = require('crypto');

const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME || 'citypaj',
  charset: 'utf8mb4',
  multipleStatements: true,
};

const PALABRAS = [
  'empleo', 'formación', 'vivienda', 'salud', 'ocio', 'cultura', 'deporte',
  'tecnología', 'transporte', 'medioambiente', 'participación', 'inclusión'
];

const MODALIDADES = ['venta', 'regalo', 'intercambio', 'servicio', 'compra'];
const CATEGORIAS_ANUNCIO = ['empleo', 'formacion', 'vivienda', 'salud', 'ocio', 'cultura', 'deporte', 'tecnologia', 'transporte', 'servicios'];
const CATEGORIAS_PROPUESTA = ['educacion', 'empleo', 'ocio', 'deportes', 'salud', 'vivienda', 'transporte', 'tecnologia', 'medioambiente', 'participacion', 'inclusion', 'otros'];
const CATEGORIAS_RECURSO = ['Empleo', 'Salud mental', 'Ayudas', 'Ocio', 'Cultura', 'Vivienda'];
const CATEGORIAS_EVENTO = ['cultural', 'deportivo', 'formativo', 'solidario', 'medioambiental'];
const TEMAS_COMUNIDAD = ['general', 'ayuda', 'ocio', 'cultura', 'vivienda'];
const PRIORIDADES = ['baja', 'media', 'alta', 'urgente'];

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function escapar(str) {
  return String(str).replace(/'/g, "''");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const pool = mysql.createPool(DB_CONFIG);
  let conn;
  try {
    // Esperar a que MySQL acepte conexiones
    let ready = false;
    for (let i = 0; i < 15 && !ready; i++) {
      try {
        const test = await pool.getConnection();
        await test.query('SELECT 1');
        test.release();
        ready = true;
      } catch (err) {
        await sleep(2000);
      }
    }
    if (!ready) {
      throw new Error('No se pudo conectar a MySQL tras 30 segundos');
    }

    conn = await pool.getConnection();
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    const [[seedCheck]] = await conn.query(
      "SELECT COUNT(*) AS total FROM anuncios WHERE id LIKE 'mod-p-%'"
    );
    if (seedCheck.total > 0) {
      console.log('Seed de moderación/admin ya aplicado. Omitiendo.');
      await conn.query('SET FOREIGN_KEY_CHECKS = 1');
      return;
    }

    // Asegurar usuarios demo necesarios para el seed
    const demoUsers = [
      { email: 'admin@citypaj.local', nombre: 'Administrador Demo', rol: 'admin' },
      { email: 'moderador@citypaj.local', nombre: 'Moderador Demo', rol: 'moderador' },
      { email: 'usuario@citypaj.local', nombre: 'Usuario Demo', rol: 'usuario' },
    ];
    for (const u of demoUsers) {
      await conn.execute(
        `INSERT IGNORE INTO usuarios (id, email, password_hash, nombre, verificado, rol, creado_at, actualizado_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [crypto.randomUUID(), u.email, 'placeholder_hash_will_be_updated', u.nombre, 1, u.rol, new Date(), new Date()]
      );
    }

    const [provincias] = await conn.query(`
      SELECT p.id, p.nombre, p.comunidad_id, c.nombre AS comunidad
      FROM provincias p
      JOIN comunidades c ON p.comunidad_id = c.id
      ORDER BY p.id
    `);

    const [usuarios] = await conn.query(`
      SELECT id, email, rol FROM usuarios
      WHERE email IN ('admin@citypaj.local', 'moderador@citypaj.local', 'usuario@citypaj.local')
    `);

    let admin = usuarios.find(u => u.email === 'admin@citypaj.local');
    let moderador = usuarios.find(u => u.email === 'moderador@citypaj.local');
    let usuario = usuarios.find(u => u.email === 'usuario@citypaj.local');

    if (!admin || !moderador || !usuario) {
      const [allUsers] = await conn.query('SELECT id, email, rol FROM usuarios LIMIT 10');
      console.log('Usuarios de demo no encontrados. Disponibles:', allUsers.map(u => u.email));
      throw new Error('No se encontraron los usuarios demo (admin, moderador, usuario)');
    }

    for (const p of provincias) {
      const cat = sample(CATEGORIAS_ANUNCIO);
      const mod = sample(MODALIDADES);

      // anuncios: pending, rejected, flagged
      const anuncios = [
        {
          id: `mod-p-${p.id}`,
          estado: 'pending',
          visible: 1,
          motivo: null,
          titulo: `Anuncio pendiente en ${p.nombre}`,
          cat,
          mod
        },
        {
          id: `mod-r-${p.id}`,
          estado: 'rejected',
          visible: 0,
          motivo: 'Contenido inapropiado para la plataforma',
          titulo: `Anuncio rechazado en ${p.nombre}`,
          cat: sample(CATEGORIAS_ANUNCIO),
          mod: sample(MODALIDADES)
        },
        {
          id: `mod-f-${p.id}`,
          estado: 'flagged',
          visible: 1,
          motivo: 'Marcado para revisión manual',
          titulo: `Anuncio marcado en ${p.nombre}`,
          cat: sample(CATEGORIAS_ANUNCIO),
          mod: sample(MODALIDADES)
        }
      ];

      for (const a of anuncios) {
        await conn.execute(
          `INSERT IGNORE INTO anuncios
            (id, usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id,
             comunidad_autonoma, provincia, modalidad, contacto_email, contacto_telefono,
             contacto_anonimo, visible, estado_moderacion, motivo_rechazo, vistas, creado_at, actualizado_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 0, ?, ?, ?, 0, NOW(), NOW())`,
          [
            a.id,
            usuario.id,
            a.titulo,
            `Contenido de prueba generado para el panel de moderación en ${p.nombre}, ${p.comunidad}.`,
            a.cat,
            p.comunidad_id,
            p.id,
            p.comunidad,
            p.nombre,
            a.mod,
            a.visible,
            a.estado,
            a.motivo
          ]
        );

        // reportes para pending y flagged
        if (a.estado !== 'rejected') {
          const rid = a.estado === 'pending' ? `rep-p-${p.id}` : `rep-f-${p.id}`;
          await conn.execute(
            `INSERT IGNORE INTO reportes_anuncios (id, anuncio_id, motivo, descripcion, creado, estado, nota_moderacion)
             VALUES (?, ?, 'Contenido sospechoso', 'Reporte generado para el panel de moderación', NOW(), 'pendiente', NULL)`,
            [rid, a.id]
          );
        }

        // logs de moderación
        await conn.execute(
          `INSERT INTO moderacion_logs (id, anuncio_id, moderador_id, estado_anterior, estado_nuevo, notas, creado_at)
           VALUES (?, ?, ?, 'pending', ?, ?, NOW())`,
          [crypto.randomUUID(), a.id, admin.id, a.estado, a.estado === 'rejected' ? 'Rechazado por moderador' : 'Marcado por sistema']
        );
      }

      // publicaciones de comunidad
      const [pubRes] = await conn.execute(
        `INSERT INTO comunidad_publicaciones
          (usuario_id, titulo, contenido, provincia, tema, visible, estado_moderacion, creado_at, actualizado_at)
         VALUES (?, ?, ?, ?, ?, 1, ?, NOW(), NOW())`,
        [
          usuario.id,
          `Publicación en ${p.nombre}`,
          `Contenido de prueba para la sección de comunidad en ${p.nombre}.`,
          p.nombre,
          sample(TEMAS_COMUNIDAD),
          sample(['approved', 'pending'])
        ]
      );
      const pubId = pubRes.insertId;

      await conn.execute(
        `INSERT INTO comunidad_comentarios
          (publicacion_id, usuario_id, contenido, visible, creado_at, estado_moderacion, actualizado_at)
         VALUES (?, ?, ?, 1, NOW(), 'approved', NOW())`,
        [pubId, usuario.id, `Comentario de prueba en ${p.nombre}`]
      );

      await conn.execute(
        `INSERT INTO comunidad_likes (tipo, objeto_id, ip, creado_at, usuario_id)
         VALUES ('publicacion', ?, '127.0.0.1', NOW(), ?)
         ON DUPLICATE KEY UPDATE creado_at = creado_at`,
        [pubId, usuario.id]
      );

      // reportes de comunidad
      await conn.execute(
        `INSERT INTO comunidad_reportes
          (usuario_id, tipo, objeto_id, motivo, descripcion, estado, creado)
         VALUES (?, 'publicacion', ?, 'Contenido inadecuado', 'Reporte de prueba generado', 'pendiente', NOW())`,
        [admin.id, pubId]
      );

      // propuestas
      for (let i = 0; i < 2; i++) {
        await conn.execute(
          `INSERT INTO propuestas
            (usuario_id, titulo, descripcion, provincia, categoria, apoyos, visible, estado_moderacion, creado_at, actualizado_at, trasladada, ip_creador)
           VALUES (?, ?, ?, ?, ?, 5, 1, 'approved', NOW(), NOW(), 0, '127.0.0.1')`,
          [
            usuario.id,
            `Propuesta ${i + 1} en ${p.nombre}`,
            `Descripción de propuesta ${i + 1} generada para ${p.nombre} en ${p.comunidad}.`,
            p.nombre,
            sample(CATEGORIAS_PROPUESTA)
          ]
        );
      }

      // recursos
      for (let i = 0; i < 2; i++) {
        await conn.execute(
          `INSERT INTO recursos
            (usuario_id, titulo, descripcion, categoria, provincia, url, verificado, visible, creado_at)
           VALUES (?, ?, ?, ?, ?, ?, 1, 1, NOW())`,
          [
            usuario.id,
            `Recurso ${i + 1} en ${p.nombre}`,
            `Información de prueba para el panel de admin en ${p.nombre}.`,
            sample(CATEGORIAS_RECURSO),
            p.nombre,
            `https://example.com/${p.nombre.toLowerCase().replace(/\s+/g, '-')}-${i}`
          ]
        );
      }

      // eventos
      await conn.execute(
        `INSERT INTO eventos
          (usuario_id, titulo, descripcion, categoria, provincia, fecha_inicio, fecha_fin, precio, ubicacion, url, visible, creado_at)
         VALUES (?, ?, ?, ?, ?, NOW() + INTERVAL 7 DAY, NOW() + INTERVAL 8 DAY, 0.00, ?, ?, 1, NOW())`,
        [
          usuario.id,
          `Evento en ${p.nombre}`,
          `Evento de prueba para el calendario en ${p.nombre}.`,
          sample(CATEGORIAS_EVENTO),
          p.nombre,
          `Plaza Mayor, ${p.nombre}`,
          `https://example.com/evento/${p.nombre.toLowerCase().replace(/\s+/g, '-')}`
        ]
      );

      // sugerencias
      for (let i = 0; i < 2; i++) {
        await conn.execute(
          `INSERT INTO sugerencias
            (nombre, email, categoria, prioridad, titulo, descripcion, anonimo, comunidad_autonoma, fecha, estado, trasladada, ip_creador)
           VALUES (?, ?, ?, ?, ?, ?, 0, ?, NOW() - INTERVAL ? DAY, 'pendiente', 0, '127.0.0.1')`,
          [
            `Usuario ${p.id}`,
            `usuario${p.id}@example.com`,
            sample(CATEGORIAS_PROPUESTA),
            sample(['baja', 'media', 'alta', 'critica']),
            `Sugerencia ${i + 1} en ${p.comunidad}`,
            `Sugerencia de prueba generada para el panel de administración en ${p.comunidad}.`,
            p.comunidad,
            i + 1
          ]
        );
      }

      // contacto institucional y comunicación
      const [contactoRes] = await conn.execute(
        `INSERT INTO contactos_institucionales
          (institucion, tipo, area_departamento, provincia, comunidad_autonoma, email_oficial, telefono, web, persona_contacto, estado, verificado, creado_por, creado_at, actualizado_at)
         VALUES (?, 'ayuntamiento', 'Juventud', ?, ?, 'juventud@example.com', '900000000', 'https://example.com', 'Responsable Juventud', 'verificado', 1, ?, NOW(), NOW())`,
        [
          `Ayuntamiento de ${p.nombre}`,
          p.nombre,
          p.comunidad,
          admin.id
        ]
      );
      const contactoId = contactoRes.insertId;

      await conn.execute(
        `INSERT INTO comunicaciones_institucionales
          (plantilla_id, contacto_id, remitente_id, asunto, cuerpo, estado, provincia, comunidad_autonoma, institucion, area, creado_at, actualizado_at)
         VALUES (1, ?, ?, ?, ?, 'borrador', ?, ?, ?, 'Juventud', NOW(), NOW())`,
        [
          contactoId,
          admin.id,
          `Comunicación con ${p.nombre}`,
          `Cuerpo de la comunicación de prueba dirigida a ${p.nombre}.`,
          p.nombre,
          p.comunidad,
          `Ayuntamiento de ${p.nombre}`
        ]
      );

      // tarea admin
      await conn.execute(
        `INSERT INTO admin_tareas
          (titulo, descripcion, estado, prioridad, asignado_a, creado_por, entidad_tipo, entidad_id, vencimiento, creado_at, actualizado_at)
         VALUES (?, ?, 'pendiente', ?, ?, ?, 'provincia', ?, NOW() + INTERVAL 14 DAY, NOW(), NOW())`,
        [
          `Revisar datos de ${p.nombre}`,
          `Tarea de prueba generada para cubrir el panel de administración con datos de ${p.nombre}.`,
          sample(PRIORIDADES),
          moderador.id,
          admin.id,
          p.nombre
        ]
      );

      // agenda notas
      await conn.execute(
        `INSERT INTO agenda_notas
          (titulo, cuerpo, fecha, color, usuario_id, creado_at, actualizado_at)
         VALUES (?, ?, NOW() + INTERVAL ? DAY, ?, ?, NOW(), NOW())`,
        [
          `Nota para ${p.nombre}`,
          `Recordatorio de prueba para la agenda del equipo en ${p.nombre}.`,
          (p.id % 30) + 1,
          sample(['blue', 'green', 'purple', 'red', 'orange']),
          admin.id
        ]
      );

      // mensajes staff
      await conn.execute(
        `INSERT INTO mensajes_staff
          (remitente_id, destinatario_id, asunto, cuerpo, leido, prioridad, estado, creado_at)
         VALUES (?, ?, ?, ?, 0, 'normal', 'enviado', NOW())`,
        [
          admin.id,
          moderador.id,
          `Mensaje sobre ${p.nombre}`,
          `Mensaje de prueba para la bandeja de entrada del equipo de moderación.`
        ]
      );

      await conn.execute(
        `INSERT INTO mensajes_staff
          (remitente_id, destinatario_id, asunto, cuerpo, leido, prioridad, estado, creado_at)
         VALUES (?, ?, ?, ?, 0, 'alta', 'enviado', NOW())`,
        [
          moderador.id,
          admin.id,
          `Consulta sobre ${p.nombre}`,
          `Mensaje de prueba para la sección de mensajes del administrador.`
        ]
      );

      // log admin
      await conn.execute(
        `INSERT INTO admin_activity_logs
          (usuario_id, accion, entidad, entidad_id, detalles, ip, creado_at)
         VALUES (?, 'revisar_provincia', 'provincia', ?, ?, '127.0.0.1', NOW())`,
        [
          admin.id,
          p.nombre,
          `Revisión administrativa de la provincia ${p.nombre}`
        ]
      );
    }

    // plantillas generales
    const plantillas = [
      { nombre: 'Bienvenida juvenil', asunto: 'Bienvenida', cuerpo: 'Texto de bienvenida.' },
      { nombre: 'Recordatorio evento', asunto: 'Recordatorio', cuerpo: 'Texto de recordatorio.' },
      { nombre: 'Aviso moderación', asunto: 'Aviso', cuerpo: 'Texto de aviso.' },
      { nombre: 'Comunicación ayuntamiento', asunto: 'Colaboración', cuerpo: 'Texto de colaboración.' },
      { nombre: 'Newsletter juvenil', asunto: 'Newsletter', cuerpo: 'Texto de newsletter.' }
    ];
    for (const pl of plantillas) {
      await conn.execute(
        `INSERT INTO plantillas_comunicacion (nombre, asunto, cuerpo, tipo, activa, creado_por, creado_at, actualizado_at)
         VALUES (?, ?, ?, 'institucional', 1, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE nombre = nombre`,
        [pl.nombre, pl.asunto, pl.cuerpo, admin.id]
      );
    }

    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log(`Datos de moderación y admin insertados para ${provincias.length} provincias.`);
  } catch (err) {
    console.error('Error en seed:', err);
    process.exitCode = 1;
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

main();
