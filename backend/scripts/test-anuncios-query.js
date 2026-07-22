const { pool } = require('../dist/config/database');

(async () => {
  try {
    const whereConditions = ['a.visible = 1', 'a.estado_moderacion = ?'];
    const queryParams = ['approved'];

    const query = `
      SELECT 
        a.id,
        a.usuario_id,
        a.titulo,
        a.descripcion,
        a.categoria,
        a.subcategoria,
        a.comunidad_id,
        a.provincia_id,
        a.comunidad_autonoma,
        a.provincia,
        a.barrio,
        a.modalidad,
        a.contacto_email,
        a.contacto_telefono,
        a.contacto_anonimo,
        a.visible,
        a.estado_moderacion,
        a.motivo_rechazo,
        a.vistas,
        a.creado_at,
        a.actualizado_at,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY a.creado_at DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(5, 0);

    const [rows] = await pool.execute(query, queryParams);
    console.log('OK rows:', rows.length);
    console.log('First row:', rows[1]);
  } catch (error) {
    console.error('ERROR:', error.message);
  } finally {
    await pool.end();
  }
})();
