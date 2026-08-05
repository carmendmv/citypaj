import { pool } from '../src/config/database';

const publicaciones = [
  {
    autor: 'AnaViveZgz',
    titulo: 'Faltan espacios de estudio abiertos por la tarde',
    contenido: 'En época de exámenes muchas bibliotecas cierran pronto y no hay espacios suficientes para estudiar en Zaragoza. ¿Sabéis de alguna sala alternativa?',
    provincia: 'Zaragoza',
    tema: 'Formación'
  },
  {
    autor: 'Mikel_86',
    titulo: 'Los autobuses no se adaptan a los horarios universitarios',
    contenido: 'Las líneas de bus que pasan por los campus llegan tarde y no coinciden con los turnos de mañana. ¿A quién se le puede proponer un cambio?',
    provincia: 'Zaragoza',
    tema: 'Transporte'
  },
  {
    autor: 'Sara_Cultura',
    titulo: 'Propuesta: conciertos gratuitos en barrios',
    contenido: 'Me gustaría que hubiera ciclos de música local en parques o plazas para jóvenes. Sería una forma de dinamizar el ocio.',
    provincia: 'Zaragoza',
    tema: 'Cultura'
  },
  {
    autor: 'Diego_BH',
    titulo: 'Viviendas compartidas para jóvenes',
    contenido: 'Los alquileres en Madrid son imposibles. ¿Conocéis alguna asociación o ayuda para compartir piso con precio asequible?',
    provincia: 'Madrid',
    tema: 'Vivienda'
  },
  {
    autor: 'Lucía_CV',
    titulo: 'Ayudas para emprender con menos papeleo',
    contenido: 'He estado mirando ayudas a emprendedores y el papeleo es tremendo. ¿Alguien sabe si hay asesorías gratuitas?',
    provincia: 'Valencia',
    tema: 'Ayudas'
  },
  {
    autor: 'Pablo_SEV',
    titulo: 'Parques con puntos de recarga para móvil',
    contenido: 'Sería útil que algunos bancos de parques tuvieran USB o enchufes para cargar el móvil mientras estudiamos al aire libre.',
    provincia: 'Sevilla',
    tema: 'Ocio'
  },
  {
    autor: 'Marta_BCN',
    titulo: 'Salud mental en el bachillerato',
    contenido: 'Creo que debería haber más recursos de apoyo emocional en institutos. Muchos compañeros pasan por momentos difíciles y no saben a quién acudir.',
    provincia: 'Barcelona',
    tema: 'Salud mental'
  },
  {
    autor: 'Jon_Ávila',
    titulo: 'Voluntariado para limpiar espacios naturales',
    contenido: 'Me apunto a iniciativas de limpieza de ríos o montes los fines de semana. ¿Conocéis algún grupo activo?',
    provincia: 'Ávila',
    tema: 'Voluntariado'
  }
];

const comentarios: { offset: number; autor: string; contenido: string }[] = [
  { offset: 0, autor: 'LauraEstudia', contenido: 'Tienes toda la razón. La pública de la ciudad cierra a las 20h.' },
  { offset: 0, autor: 'PedroBiblio', contenido: 'En la facultad suelen dejar alguna sala abierta hasta las 22h.' },
  { offset: 1, autor: 'NataliaRedes', contenido: 'Hay un buzón en la web del ayuntamiento para sugerencias.' },
  { offset: 1, autor: 'Mikel_86', contenido: 'Algunas líneas están en prueba por obras, pero el horario es un caos.' },
  { offset: 2, autor: 'Raul_Música', contenido: 'Apoyo total. Mi grupo toca en garitos y sería genial un escenario abierto.' },
  { offset: 3, autor: 'Carmen_Vivienda', contenido: 'En Carabanchel hay asociaciones de cooperativa de vivienda. Pregunta por aquí.' },
  { offset: 3, autor: 'Diego_BH', contenido: 'Lo miro, gracias.' },
  { offset: 4, autor: 'Toni_CV', contenido: 'La Oficina Joven de la Diputación tiene asesorías gratuitas.' },
  { offset: 5, autor: 'Andrea_SEV', contenido: 'Buena idea. En mi facultad sí hay enchufes, pero no en parques.' },
  { offset: 6, autor: 'Nuria_BCN', contenido: 'Totalmente. Yo debería tener más acceso a recursos.' },
  { offset: 7, autor: 'Raúl_Ávila', contenido: 'Mi asociación hace rutas el tercer sábado. ¡Apúntate!' }
];

const likes = [3, 2, 1, 2, 1, 1, 2, 1];

async function main() {
  const ip = '127.0.0.1';

  const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM comunidad_publicaciones');
  const total = (countRows as any[])[0]?.total || 0;
  if (total > 0) {
    console.log(`Ya existen ${total} publicaciones en comunidad. Seed omitido.`);
    process.exit(0);
  }

  const placeholders = publicaciones.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
  const values = publicaciones.flatMap((p) => [
    null,          // usuario_id
    p.autor,       // autor_nombre
    ip,            // ip
    p.titulo,
    p.contenido,
    p.provincia,
    p.tema,
    1,             // visible
    'approved'     // estado_moderacion
  ]);

  const [result] = await pool.execute(
    `INSERT INTO comunidad_publicaciones
     (usuario_id, autor_nombre, ip, titulo, contenido, provincia, tema, visible, estado_moderacion)
     VALUES ${placeholders}`,
    values
  ) as any;

  const firstId = result.insertId;
  const ids = publicaciones.map((_, i) => firstId + i);

  for (const c of comentarios) {
    await pool.execute(
      `INSERT INTO comunidad_comentarios
       (publicacion_id, usuario_id, autor_nombre, ip, contenido, visible, estado_moderacion)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ids[c.offset], null, c.autor, ip, c.contenido, 1, 'approved']
    );
  }

  let ipCounter = 1;
  for (let i = 0; i < ids.length; i++) {
    for (let j = 0; j < likes[i]; j++) {
      const likeIp = j === 0 ? ip : `10.0.0.${ipCounter}`;
      await pool.execute(
        'INSERT IGNORE INTO comunidad_likes (tipo, objeto_id, ip, usuario_id) VALUES (?, ?, ?, ?)',
        ['publicacion', ids[i], likeIp, null]
      );
      ipCounter++;
    }
  }

  console.log(`Seed de comunidad completado: ${publicaciones.length} publicaciones, ${comentarios.length} comentarios y ${likes.reduce((a, b) => a + b, 0)} likes.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error en seed de comunidad:', err);
  process.exit(1);
});
