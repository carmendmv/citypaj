/**
 * Generador de seed territorial para CityPAJ.
 * Crea database/init/03_seed_territorial.sql con:
 *  - Corrección de nombres oficiales de comunidades y provincias.
 *  - Inclusión de Ceuta y Melilla.
 *  - Anuncios demo que cubren todas las provincias y categorías.
 *  - Usuario admin demo si no existe.
 *
 * Uso:
 *   node backend/scripts/seed-anuncios-territoriales.js
 *
 * El script genera el archivo SQL; en Docker se ejecuta automáticamente.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(__dirname, '..', '..', 'database', 'init', '03_seed_territorial.sql');

// Nombres oficiales de comunidades autónomas
const comunidades = [
  { id: 1, nombre: 'Andalucía' },
  { id: 2, nombre: 'Aragón' },
  { id: 3, nombre: 'Principado de Asturias' },
  { id: 4, nombre: 'Illes Balears' },
  { id: 5, nombre: 'Canarias' },
  { id: 6, nombre: 'Cantabria' },
  { id: 7, nombre: 'Castilla-La Mancha' },
  { id: 8, nombre: 'Castilla y León' },
  { id: 9, nombre: 'Cataluña' },
  { id: 10, nombre: 'Comunitat Valenciana' },
  { id: 11, nombre: 'Extremadura' },
  { id: 12, nombre: 'Galicia' },
  { id: 13, nombre: 'Madrid' },
  { id: 14, nombre: 'Región de Murcia' },
  { id: 15, nombre: 'Comunidad Foral de Navarra' },
  { id: 16, nombre: 'País Vasco / Euskadi' },
  { id: 17, nombre: 'La Rioja' },
  { id: 18, nombre: 'Ceuta' },
  { id: 19, nombre: 'Melilla' }
];

// Provincias con su comunidad y nombre oficial
const provincias = [
  { id: 1, nombre: 'Almería', comunidad_id: 1 },
  { id: 2, nombre: 'Cádiz', comunidad_id: 1 },
  { id: 3, nombre: 'Córdoba', comunidad_id: 1 },
  { id: 4, nombre: 'Granada', comunidad_id: 1 },
  { id: 5, nombre: 'Huelva', comunidad_id: 1 },
  { id: 6, nombre: 'Jaén', comunidad_id: 1 },
  { id: 7, nombre: 'Málaga', comunidad_id: 1 },
  { id: 8, nombre: 'Sevilla', comunidad_id: 1 },
  { id: 9, nombre: 'Huesca', comunidad_id: 2 },
  { id: 10, nombre: 'Teruel', comunidad_id: 2 },
  { id: 11, nombre: 'Zaragoza', comunidad_id: 2 },
  { id: 12, nombre: 'Asturias', comunidad_id: 3 },
  { id: 13, nombre: 'Illes Balears', comunidad_id: 4 },
  { id: 14, nombre: 'Las Palmas', comunidad_id: 5 },
  { id: 15, nombre: 'Santa Cruz de Tenerife', comunidad_id: 5 },
  { id: 16, nombre: 'Cantabria', comunidad_id: 6 },
  { id: 17, nombre: 'Albacete', comunidad_id: 7 },
  { id: 18, nombre: 'Ciudad Real', comunidad_id: 7 },
  { id: 19, nombre: 'Cuenca', comunidad_id: 7 },
  { id: 20, nombre: 'Guadalajara', comunidad_id: 7 },
  { id: 21, nombre: 'Toledo', comunidad_id: 7 },
  { id: 22, nombre: 'Ávila', comunidad_id: 8 },
  { id: 23, nombre: 'Burgos', comunidad_id: 8 },
  { id: 24, nombre: 'León', comunidad_id: 8 },
  { id: 25, nombre: 'Palencia', comunidad_id: 8 },
  { id: 26, nombre: 'Salamanca', comunidad_id: 8 },
  { id: 27, nombre: 'Segovia', comunidad_id: 8 },
  { id: 28, nombre: 'Soria', comunidad_id: 8 },
  { id: 29, nombre: 'Valladolid', comunidad_id: 8 },
  { id: 30, nombre: 'Zamora', comunidad_id: 8 },
  { id: 31, nombre: 'Barcelona', comunidad_id: 9 },
  { id: 32, nombre: 'Girona', comunidad_id: 9 },
  { id: 33, nombre: 'Lleida', comunidad_id: 9 },
  { id: 34, nombre: 'Tarragona', comunidad_id: 9 },
  { id: 35, nombre: 'Alicante/Alacant', comunidad_id: 10 },
  { id: 36, nombre: 'Castellón/Castelló', comunidad_id: 10 },
  { id: 37, nombre: 'Valencia/València', comunidad_id: 10 },
  { id: 38, nombre: 'Badajoz', comunidad_id: 11 },
  { id: 39, nombre: 'Cáceres', comunidad_id: 11 },
  { id: 40, nombre: 'A Coruña', comunidad_id: 12 },
  { id: 41, nombre: 'Lugo', comunidad_id: 12 },
  { id: 42, nombre: 'Ourense', comunidad_id: 12 },
  { id: 43, nombre: 'Pontevedra', comunidad_id: 12 },
  { id: 44, nombre: 'Madrid', comunidad_id: 13 },
  { id: 45, nombre: 'Murcia', comunidad_id: 14 },
  { id: 46, nombre: 'Navarra', comunidad_id: 15 },
  { id: 47, nombre: 'Álava/Araba', comunidad_id: 16 },
  { id: 48, nombre: 'Bizkaia', comunidad_id: 16 },
  { id: 49, nombre: 'Gipuzkoa', comunidad_id: 16 },
  { id: 50, nombre: 'La Rioja', comunidad_id: 17 },
  { id: 51, nombre: 'Ceuta', comunidad_id: 18 },
  { id: 52, nombre: 'Melilla', comunidad_id: 19 }
];

// Categorías generales (sin cultura, que se trata aparte)
const categoriasGenerales = [
  'empleo',
  'formacion',
  'vivienda',
  'servicios',
  'transporte',
  'salud',
  'tecnologia',
  'comunidad',
  'ocio',
  'otros'
];

const subcategoriasCultura = [
  'concierto',
  'taller',
  'exposicion',
  'teatro',
  'cine',
  'actividad cultural'
];

const plantillas = {
  empleo: {
    titulos: [
      'Oferta de apoyo en comercio local en {provincia}',
      'Prácticas de atención al público en {provincia}',
      'Bolsa juvenil de empleo de verano en {provincia}'
    ],
    descripcion: 'Oferta dirigida a jóvenes de {provincia} interesados en ganar experiencia laboral. Horario flexible y posibilidad de conciliación. Consulta condiciones y requisitos.',
    modalidad: 'servicio'
  },
  formacion: {
    titulos: [
      'Curso básico de herramientas digitales en {provincia}',
      'Taller de orientación laboral en {provincia}',
      'Formación gratuita en competencias web en {provincia}'
    ],
    descripcion: 'Formación presencial y online para jóvenes de {provincia}. Plazas limitadas. Certificado de asistencia disponible.',
    modalidad: 'servicio'
  },
  vivienda: {
    titulos: [
      'Habitación compartida para estudiantes en {provincia}',
      'Información sobre alquiler joven en {provincia}',
      'Programa local de vivienda compartida en {provincia}'
    ],
    descripcion: 'Información sobre opciones de vivienda para jóvenes en {provincia}. Consulta requisitos y plazos disponibles.',
    modalidad: 'venta'
  },
  servicios: {
    titulos: [
      'Apoyo escolar por horas en {provincia}',
      'Reparación básica de bicicletas en {provincia}',
      'Servicio de acompañamiento juvenil en {provincia}'
    ],
    descripcion: 'Servicio de apoyo a jóvenes de {provincia}. Disponibilidad inmediata y atención personalizada.',
    modalidad: 'servicio'
  },
  transporte: {
    titulos: [
      'Grupo para compartir coche a la universidad en {provincia}',
      'Información sobre bonos de transporte joven en {provincia}',
      'Ruta compartida entre municipios de {provincia}'
    ],
    descripcion: 'Iniciativa de movilidad compartida para jóvenes de {provincia}. Ahorra y reduce el impacto ambiental.',
    modalidad: 'intercambio'
  },
  salud: {
    titulos: [
      'Taller de bienestar emocional en {provincia}',
      'Punto joven de orientación saludable en {provincia}',
      'Actividad deportiva al aire libre en {provincia}'
    ],
    descripcion: 'Espacio de cuidado personal y bienestar para jóvenes de {provincia}. Actividad gratuita y abierta.',
    modalidad: 'servicio'
  },
  tecnologia: {
    titulos: [
      'Taller de iniciación a programación en {provincia}',
      'Reparación y reutilización de equipos en {provincia}',
      'Grupo de aprendizaje digital en {provincia}'
    ],
    descripcion: 'Actividad tecnológica para jóvenes de {provincia}. Aprende y comparte conocimientos.',
    modalidad: 'servicio'
  },
  comunidad: {
    titulos: [
      'Grupo vecinal joven por {provincia}',
      'Encuentro juvenil de participación en {provincia}',
      'Red de apoyo entre estudiantes de {provincia}'
    ],
    descripcion: 'Espacio de encuentro y apoyo comunitario para jóvenes de {provincia}. Participa y conoce a otros jóvenes.',
    modalidad: 'regalo'
  },
  ocio: {
    titulos: [
      'Quedada juvenil de juegos de mesa en {provincia}',
      'Actividad deportiva de fin de semana en {provincia}',
      'Encuentro de jóvenes creadores en {provincia}'
    ],
    descripcion: 'Plan de ocio y tiempo libre para jóvenes de {provincia}. Ambiente inclusivo y participativo.',
    modalidad: 'regalo'
  },
  otros: {
    titulos: [
      'Propuesta juvenil abierta en {provincia}',
      'Iniciativa de apoyo joven en {provincia}',
      'Recurso juvenil variado en {provincia}'
    ],
    descripcion: 'Propuesta abierta para jóvenes de {provincia}. Consulta detalles y únete.',
    modalidad: 'servicio'
  },
  cultura: {
    titulos: [
      'Concierto joven en centro cultural de {provincia}',
      'Taller de teatro juvenil en {provincia}',
      'Exposición local de artistas jóvenes en {provincia}',
      'Ciclo de cine juvenil en {provincia}'
    ],
    descripcion: 'Actividad cultural para jóvenes de {provincia}. Fecha de publicación anterior, consulta disponibilidad actual.',
    modalidad: 'regalo'
  }
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const t = s + Math.random() * (e - s);
  const d = new Date(t);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

function escapeSql(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function generarAnuncios() {
  const anuncios = [];
  const baseCulturalStart = '2026-04-24';
  const baseCulturalEnd = '2026-07-08';
  const baseRecienteStart = '2026-08-02';
  const baseRecienteEnd = '2026-08-22';

  for (const p of provincias) {
    const comunidad = comunidades.find(c => c.id === p.comunidad_id).nombre;

    // 1 anuncio cultural, con fecha antigua
    const subCultura = subcategoriasCultura[p.id % subcategoriasCultura.length];
    const plantillaCultura = plantillas.cultura;
    const tituloCultura = plantillaCultura.titulos[p.id % plantillaCultura.titulos.length]
      .replace('{provincia}', p.nombre);
    const descCultura = plantillaCultura.descripcion.replace('{provincia}', p.nombre);
    anuncios.push({
      id: `cultura-${p.id}-1`,
      usuario_id: '@admin_id',
      titulo: tituloCultura,
      descripcion: descCultura,
      categoria: 'cultura',
      subcategoria: subCultura,
      comunidad_id: p.comunidad_id,
      provincia_id: p.id,
      comunidad_autonoma: comunidad,
      provincia: p.nombre,
      modalidad: plantillaCultura.modalidad,
      contacto_email: 1,
      contacto_telefono: 1,
      contacto_anonimo: 0,
      visible: 1,
      estado_moderacion: 'approved',
      vistas: randomInt(20, 800),
      creado_at: randomDate(baseCulturalStart, baseCulturalEnd),
      actualizado_at: randomDate(baseCulturalStart, baseCulturalEnd),
      precio: 'NULL',
      cartel_url: 'NULL'
    });

    // 3 anuncios recientes con categorías rotativas
    for (let i = 0; i < 3; i++) {
      const cat = categoriasGenerales[(p.id + i) % categoriasGenerales.length];
      const plantilla = plantillas[cat];
      const titulo = plantilla.titulos[p.id % plantilla.titulos.length].replace('{provincia}', p.nombre);
      const desc = plantilla.descripcion.replace('{provincia}', p.nombre);
      anuncios.push({
        id: `${cat}-${p.id}-${i + 1}`,
        usuario_id: '@admin_id',
        titulo,
        descripcion: desc,
        categoria: cat === 'tecnologia' ? 'tecnología' : cat,
        subcategoria: null,
        comunidad_id: p.comunidad_id,
        provincia_id: p.id,
        comunidad_autonoma: comunidad,
        provincia: p.nombre,
        modalidad: plantilla.modalidad,
        contacto_email: 1,
        contacto_telefono: 1,
        contacto_anonimo: 0,
        visible: 1,
        estado_moderacion: 'approved',
        vistas: randomInt(10, 500),
        creado_at: randomDate(baseRecienteStart, baseRecienteEnd),
        actualizado_at: randomDate(baseRecienteStart, baseRecienteEnd),
        precio: cat === 'vivienda' ? (randomInt(200, 800).toFixed(2)) : 'NULL',
        cartel_url: 'NULL'
      });
    }
  }

  return anuncios;
}

function buildSql() {
  const lineas = [];
  lineas.push("SET NAMES utf8mb4;");
  lineas.push("SET FOREIGN_KEY_CHECKS = 0;");
  lineas.push("");

  // Actualizar nombres oficiales de comunidades
  lineas.push("-- Actualizar nombres oficiales de comunidades autónomas");
  lineas.push("UPDATE comunidades SET nombre = CASE id");
  for (const c of comunidades) {
    if (c.id <= 19) lineas.push(`  WHEN ${c.id} THEN '${escapeSql(c.nombre)}'`);
  }
  lineas.push("  ELSE nombre");
  lineas.push("END;");
  lineas.push("");

  // Añadir Ceuta y Melilla como comunidades/provincias
  lineas.push("-- Incluir Ceuta y Melilla");
  lineas.push("INSERT IGNORE INTO comunidades (id, nombre) VALUES (18, 'Ceuta'), (19, 'Melilla');");
  lineas.push("INSERT IGNORE INTO provincias (id, nombre, comunidad_id) VALUES");
  lineas.push("  (51, 'Ceuta', 18),");
  lineas.push("  (52, 'Melilla', 19);");
  lineas.push("");

  // Actualizar nombres oficiales de provincias
  lineas.push("-- Actualizar nombres oficiales de provincias");
  lineas.push("UPDATE provincias SET nombre = CASE id");
  for (const p of provincias) {
    lineas.push(`  WHEN ${p.id} THEN '${escapeSql(p.nombre)}'`);
  }
  lineas.push("  ELSE nombre");
  lineas.push("END;");
  lineas.push("");

  // Sincronizar textos de anuncios existentes
  lineas.push("-- Sincronizar textos de comunidad y provincia en anuncios ya existentes");
  lineas.push("UPDATE anuncios a, comunidades c, provincias p");
  lineas.push("SET a.comunidad_autonoma = c.nombre, a.provincia = p.nombre");
  lineas.push("WHERE a.comunidad_id = c.id AND a.provincia_id = p.id;");
  lineas.push("");

  // Asegurar usuario admin demo
  const adminId = 'a0000000-0000-0000-0000-000000000001';
  const adminHash = '$2a$10$EQt3e7QauhI3v7iJJUpHZ.reYVQkOXq9geNa2VyiqKR7Pv8DcS/oW';
  lineas.push("-- Asegurar usuario administrador demo");
  lineas.push("INSERT IGNORE INTO usuarios (id, email, password_hash, nombre, verificado, rol, activo, creado_at, actualizado_at) VALUES");
  lineas.push(`  ('${adminId}', 'admin@citypaj.local', '${adminHash}', 'Administrador Demo', 1, 'admin', 1, NOW(), NOW());`);
  lineas.push("SET @admin_id = (SELECT id FROM usuarios WHERE email = 'admin@citypaj.local' LIMIT 1);");
  lineas.push("");

  // Insertar anuncios territoriales
  const anuncios = generarAnuncios();
  lineas.push("-- Seed de anuncios territoriales");
  lineas.push("INSERT IGNORE INTO anuncios (id, usuario_id, titulo, descripcion, categoria, subcategoria, comunidad_id, provincia_id, comunidad_autonoma, provincia, modalidad, contacto_email, contacto_telefono, contacto_anonimo, visible, estado_moderacion, vistas, creado_at, actualizado_at, precio, cartel_url) VALUES");
  const values = anuncios.map(a => {
    const usuario = a.usuario_id === '@admin_id' ? '@admin_id' : `'${a.usuario_id}'`;
    const subcategoria = a.subcategoria === null ? 'NULL' : `'${escapeSql(a.subcategoria)}'`;
    return `\n  ('${a.id}', ${usuario}, '${escapeSql(a.titulo)}', '${escapeSql(a.descripcion)}', '${a.categoria}', ${subcategoria}, ${a.comunidad_id}, ${a.provincia_id}, '${escapeSql(a.comunidad_autonoma)}', '${escapeSql(a.provincia)}', '${a.modalidad}', ${a.contacto_email}, ${a.contacto_telefono}, ${a.contacto_anonimo}, ${a.visible}, '${a.estado_moderacion}', ${a.vistas}, '${a.creado_at}', '${a.actualizado_at}', ${a.precio}, ${a.cartel_url})`;
  });
  // El último valor debe terminar en ;
  const valuesStr = values.join(',') + ';';
  lineas.push(valuesStr);
  lineas.push("");
  lineas.push("SET FOREIGN_KEY_CHECKS = 1;");

  return lineas.join('\n');
}

const sql = buildSql();
fs.writeFileSync(OUTPUT, sql, 'utf8');
process.stdout.write(`SQL generado: ${OUTPUT} (${sql.length} caracteres)\n`);
