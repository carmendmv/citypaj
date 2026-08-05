import { randomUUID } from 'crypto';
import { pool } from '../src/config/database';

async function main() {
  // 1. Cartel para anuncios
  await pool.execute(
    'ALTER TABLE anuncios ADD COLUMN IF NOT EXISTS cartel_url VARCHAR(500) NULL'
  );
  console.log('Columna cartel_url añadida/verificada en anuncios');

  // 2. Datos de ejemplo: eventos culturales
  const provincias = await pool.execute('SELECT id, nombre, comunidad_id FROM provincias LIMIT 1');
  const provincia = (provincias as any[])[0]?.[0];
  const comunidad = provincia
    ? (await pool.execute('SELECT nombre FROM comunidades WHERE id = ? LIMIT 1', [provincia.comunidad_id]) as any[])[0]?.[0]
    : null;

  const provinciaNombre = provincia?.nombre || 'Zaragoza';
  const comunidadNombre = comunidad?.nombre || 'Aragón';

  const eventos = [
    ['Festival de Jazz', 'Conciertos al aire libre.', 'Cultura', provinciaNombre, '2026-09-10', '2026-09-12'],
    ['Exposición de Arte', 'Obras de artistas locales.', 'Cultura', provinciaNombre, '2026-09-15', '2026-09-20'],
    ['Taller de Poesía', 'Encuentro literario.', 'Cultura', provinciaNombre, '2026-09-18', '2026-09-18'],
    ['Cine Forum', 'Proyecciones y debates.', 'Cultura', provinciaNombre, '2026-09-22', '2026-09-25'],
    ['Ruta Cultural', 'Ruta patrimonial.', 'Cultura', provinciaNombre, '2026-09-28', '2026-09-28'],
  ];

  for (const [titulo, descripcion, categoria, provincia, fecha_inicio, fecha_fin] of eventos) {
    await pool.execute(
      `INSERT IGNORE INTO eventos (titulo, descripcion, categoria, provincia, fecha_inicio, fecha_fin, precio, ubicacion, url, visible)
       VALUES (?, ?, ?, ?, ?, ?, 0, 'A determinar', '', 1)`,
      [titulo, descripcion, categoria, provincia, fecha_inicio, fecha_fin]
    );
    console.log(`Evento creado: ${titulo}`);
  }

  // 3. Datos de ejemplo: anuncios de cultura
  const usuarios = await pool.execute('SELECT id FROM usuarios LIMIT 1');
  const usuario = (usuarios as any[])[0]?.[0];
  const usuarioId = usuario?.id || randomUUID();

  const anuncios = [
    ['Concierto benéfico', 'Concierto solidario en el parque.', 'Cultura', 'Música'],
    ['Exposición fotográfica', 'Fotos de jóvenes de la provincia.', 'Cultura', 'Fotografía'],
    ['Taller de teatro', 'Taller de iniciación.', 'Cultura', 'Teatro'],
    ['Feria del libro', 'Encuentro con escritores.', 'Cultura', 'Literatura'],
    ['Ruta de murales', 'Arte urbano por la ciudad.', 'Cultura', 'Arte urbano'],
  ];

  const cartel = 'https://picsum.photos/seed/citypaj/800/400';

  for (const [titulo, descripcion, categoria, subcategoria] of anuncios) {
    const id = randomUUID();
    await pool.execute(
      `INSERT IGNORE INTO anuncios (
        id, usuario_id, titulo, descripcion, categoria, subcategoria,
        comunidad_autonoma, provincia, modalidad, visible, estado_moderacion,
        cartel_url, creado_at, actualizado_at, vistas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'servicio', 1, 'approved', ?, NOW(), NOW(), 0)`,
      [id, usuarioId, titulo, descripcion, categoria, subcategoria, comunidadNombre, provinciaNombre, cartel]
    );
    console.log(`Anuncio creado: ${titulo}`);
  }

  console.log('Migración v6 aplicada: eventos/cultura de ejemplo y cartel_url');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
