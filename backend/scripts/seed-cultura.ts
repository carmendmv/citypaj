import { randomUUID } from 'crypto';
import { pool } from '../src/config/database';

const ANON_USER_ID = '69ff671c-8d97-4179-b525-0a62bb8b2f62';

const eventos = [
  {
    titulo: 'Concierto indie en la plaza mayor',
    descripcion: 'Ven a disfrutar de las mejores bandas locales de indie y pop alternativo. Entrada libre hasta completar aforo.',
    comunidad_autonoma: 'Aragón',
    provincia: 'Zaragoza',
    precio: 0,
    cartel: 'Concierto+Indie',
  },
  {
    titulo: 'Taller de fotografía urbana',
    descripcion: 'Aprende a capturar la ciudad con tu móvil o cámara. Recorrido práctico por el casco antiguo.',
    comunidad_autonoma: 'Cataluña',
    provincia: 'Barcelona',
    precio: 15,
    cartel: 'Taller+Fotografia',
  },
  {
    titulo: 'Quedada de juegos de mesa',
    descripcion: 'Trae tus juegos favoritos o prueba los que traemos nosotros. Ambiente juvenil y refreshments incluidos.',
    comunidad_autonoma: 'Comunidad de Madrid',
    provincia: 'Madrid',
    precio: 5,
    cartel: 'Juegos+de+Mesa',
  },
  {
    titulo: 'Festival de cine juvenil',
    descripcion: 'Proyección de cortometrajes creados por jóvenes de la comunidad. Vota tu favorito y gana premios.',
    comunidad_autonoma: 'Andalucía',
    provincia: 'Sevilla',
    precio: 8.5,
    cartel: 'Festival+Cine',
  },
  {
    titulo: 'Clases de skate para principiantes',
    descripcion: 'Iniciación al skate con monitores titulados. Proporcionamos material y casco. ¡Resbala con nosotros!',
    comunidad_autonoma: 'Comunidad Valenciana',
    provincia: 'Valencia',
    precio: 12,
    cartel: 'Skate+Juvenil',
  },
  {
    titulo: 'Exposición de arte urbano',
    descripcion: 'Descubre obras de artistas locales en un espacio habilitado para el arte juvenil y la cultura callejera.',
    comunidad_autonoma: 'País Vasco',
    provincia: 'Vizcaya',
    precio: 0,
    cartel: 'Arte+Urbano',
  },
];

async function main() {
  const now = new Date();
  const ip = '127.0.0.1';

  for (const ev of eventos) {
    const anuncioId = randomUUID();
    const cartelUrl = `https://placehold.co/600x800/orange/white?text=${ev.cartel}`;
    await pool.execute(
      `INSERT INTO anuncios (
        id, usuario_id, titulo, descripcion, categoria, subcategoria,
        comunidad_id, provincia_id, comunidad_autonoma, provincia, modalidad,
        contacto_email, contacto_telefono, contacto_anonimo,
        visible, estado_moderacion, motivo_rechazo, ip_creador, cartel_url, precio,
        creado_at, actualizado_at, vistas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        anuncioId,
        ANON_USER_ID,
        ev.titulo,
        ev.descripcion,
        'Cultura',
        'Evento',
        0,
        0,
        ev.comunidad_autonoma,
        ev.provincia,
        'presencial',
        0,
        0,
        0,
        1,
        'approved',
        null,
        ip,
        cartelUrl,
        ev.precio,
        now,
        now,
        0,
      ]
    );
    console.log(`Creado evento: ${ev.titulo} (${ev.provincia})`);
  }

  console.log('Seed de cultura completado.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error en seed de cultura:', err);
  process.exit(1);
});
