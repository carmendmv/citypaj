const { pool } = require('../dist/config/database');

(async () => {
  try {
    const [anuncios] = await pool.execute('SELECT COUNT(*) as total FROM anuncios WHERE visible = 1 AND estado_moderacion = ?', ['approved']);
    const [usuarios] = await pool.execute('SELECT COUNT(*) as total FROM usuarios');
    const [sugerencias] = await pool.execute('SELECT COUNT(*) as total FROM sugerencias');
    const [provincias] = await pool.execute('SELECT COUNT(DISTINCT provincia) as total FROM anuncios WHERE provincia IS NOT NULL');

    console.log('anuncios:', anuncios[0]);
    console.log('usuarios:', usuarios[0]);
    console.log('sugerencias:', sugerencias[0]);
    console.log('provincias:', provincias[0]);
  } catch (error) {
    console.error('ERROR:', error.message);
  } finally {
    await pool.end();
  }
})();
