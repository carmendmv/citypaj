require('dotenv').config();
const mysql = require('mysql2/promise');

const DRY_RUN = process.argv.includes('--dry-run');

const COMUNIDADES_PROVINCIAS = {
  'Andalucía': ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'],
  'Aragón': ['Huesca', 'Teruel', 'Zaragoza'],
  'Asturias': ['Asturias', 'Asturies'],
  'Baleares': ['Baleares', 'Balears', 'Illes Balears'],
  'Canarias': ['Las Palmas', 'Santa Cruz de Tenerife'],
  'Cantabria': ['Cantabria'],
  'Castilla-La Mancha': ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'],
  'Castilla y León': ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'],
  'Cataluña': ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
  'Comunidad Valenciana': ['Alicante', 'Castellón', 'Valencia', 'Alacant', 'Castelló', 'València'],
  'Extremadura': ['Badajoz', 'Cáceres'],
  'Galicia': ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
  'Madrid': ['Madrid'],
  'Murcia': ['Murcia'],
  'Navarra': ['Navarra', 'Nafarroa'],
  'País Vasco': ['Álava', 'Guipúzcoa', 'Vizcaya', 'Araba', 'Gipuzkoa', 'Bizkaia'],
  'La Rioja': ['La Rioja'],
  'Ceuta': ['Ceuta'],
  'Melilla': ['Melilla'],
};

const PROVINCIA_NORMALIZACION = {
  'Almería': 'Almería',
  'Cádiz': 'Cádiz',
  'Córdoba': 'Córdoba',
  'Granada': 'Granada',
  'Huelva': 'Huelva',
  'Jaén': 'Jaén',
  'Málaga': 'Málaga',
  'Sevilla': 'Sevilla',
  'Huesca': 'Huesca',
  'Teruel': 'Teruel',
  'Zaragoza': 'Zaragoza',
  'Asturias': 'Asturias',
  'Asturies': 'Asturias',
  'Baleares': 'Baleares',
  'Balears': 'Baleares',
  'Illes Balears': 'Baleares',
  'Las Palmas': 'Las Palmas',
  'Santa Cruz de Tenerife': 'Santa Cruz de Tenerife',
  'Cantabria': 'Cantabria',
  'Albacete': 'Albacete',
  'Ciudad Real': 'Ciudad Real',
  'Cuenca': 'Cuenca',
  'Guadalajara': 'Guadalajara',
  'Toledo': 'Toledo',
  'Ávila': 'Ávila',
  'Burgos': 'Burgos',
  'León': 'León',
  'Palencia': 'Palencia',
  'Salamanca': 'Salamanca',
  'Segovia': 'Segovia',
  'Soria': 'Soria',
  'Valladolid': 'Valladolid',
  'Zamora': 'Zamora',
  'Barcelona': 'Barcelona',
  'Girona': 'Girona',
  'Lleida': 'Lleida',
  'Tarragona': 'Tarragona',
  'Alicante': 'Alicante',
  'Alacant': 'Alicante',
  'Castellón': 'Castellón',
  'Castelló': 'Castellón',
  'Valencia': 'Valencia',
  'València': 'Valencia',
  'Badajoz': 'Badajoz',
  'Cáceres': 'Cáceres',
  'A Coruña': 'A Coruña',
  'Lugo': 'Lugo',
  'Ourense': 'Ourense',
  'Pontevedra': 'Pontevedra',
  'Madrid': 'Madrid',
  'Murcia': 'Murcia',
  'Navarra': 'Navarra',
  'Nafarroa': 'Navarra',
  'Álava': 'Álava',
  'Araba': 'Álava',
  'Guipúzcoa': 'Guipúzcoa',
  'Gipuzkoa': 'Guipúzcoa',
  'Vizcaya': 'Vizcaya',
  'Bizkaia': 'Vizcaya',
  'La Rioja': 'La Rioja',
  'Ceuta': 'Ceuta',
  'Melilla': 'Melilla',
};

const CATEGORIAS = ['ocio', 'servicios', 'formacion', 'empleo', 'comunidad', 'transporte', 'vivienda', 'salud', 'tecnología', 'otros'];
const MODALIDADES = ['venta', 'regalo', 'intercambio', 'servicio', 'compra'];
const ADS_PER_COMMUNITY = 70;

const ADJETIVOS = ['Oportunidad', 'Anuncio', 'Propuesta', 'Servicio', 'Actividad', 'Recurso', 'Oferta', 'Experiencia', 'Iniciativa', 'Proyecto'];
const SERVICIOS = ['para jóvenes', 'de empleo', 'de formación', 'de ocio', 'comunitario', 'de voluntariado', 'de ayuda', 'cultural', 'deportivo', 'social'];

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatDate(d) {
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

function randomRecentDate() {
  const now = Date.now();
  const daysAgo = Math.random() * 60;
  const d = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
  return d;
}

async function ensureCommunity(conn, nombre) {
  const [rows] = await conn.execute('SELECT id FROM comunidades WHERE nombre = ?', [nombre]);
  if (rows.length > 0) return rows[0].id;
  const [result] = await conn.execute('INSERT INTO comunidades (nombre) VALUES (?)', [nombre]);
  return result.insertId;
}

async function ensureProvincia(conn, comunidadId, canonical, aliases) {
  for (const alias of aliases) {
    const [rows] = await conn.execute('SELECT id FROM provincias WHERE comunidad_id = ? AND nombre = ?', [comunidadId, alias]);
    if (rows.length > 0) return rows[0].id;
  }
  const [result] = await conn.execute('INSERT INTO provincias (nombre, comunidad_id) VALUES (?, ?)', [canonical, comunidadId]);
  return result.insertId;
}

async function main() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'citypaj',
    user: process.env.DB_USER || 'citypaj_user',
    password: process.env.DB_PASSWORD || 'citypaj123',
  });

  try {
    const [users] = await c.execute('SELECT id FROM usuarios ORDER BY id LIMIT 1');
    if (users.length === 0) throw new Error('No hay usuarios para asignar anuncios');
    const usuarioId = users[0].id;

    const comunidadIds = {};
    const provinciaIds = {};
    const plan = [];

    for (const [comunidad, provincias] of Object.entries(COMUNIDADES_PROVINCIAS)) {
      const comunidadId = await ensureCommunity(c, comunidad);
      comunidadIds[comunidad] = comunidadId;

      const canonicalSet = new Set();
      const canonicalList = [];
      const aliasMap = {};
      for (const p of provincias) {
        const canonical = PROVINCIA_NORMALIZACION[p] || p;
        if (!canonicalSet.has(canonical)) {
          canonicalSet.add(canonical);
          canonicalList.push(canonical);
          aliasMap[canonical] = [];
        }
        aliasMap[canonical].push(p);
      }

      const provIds = [];
      for (const canonical of canonicalList) {
        const aliases = aliasMap[canonical];
        const provinciaId = await ensureProvincia(c, comunidadId, canonical, aliases);
        provinciaIds[`${comunidad}|${canonical}`] = provinciaId;
        provIds.push({ canonical, provinciaId });
      }
      plan.push({ comunidad, comunidadId, provincias: provIds });
    }

    console.log('Plan de inserción:');
    for (const item of plan) {
      console.log(`- ${item.comunidad}: ${item.provincias.map(p => p.canonical).join(', ')}`);
    }

    if (DRY_RUN) {
      console.log('\nDry-run: no se insertaron anuncios.');
      return;
    }

    console.log('\nInsertando anuncios...');
    let total = 0;

    for (const item of plan) {
      const { comunidad, comunidadId, provincias } = item;
      const nProvincias = provincias.length;
      const nCategorias = CATEGORIAS.length;
      const base = total;

      const placeholders = [];
      const params = [];

      for (let i = 0; i < ADS_PER_COMMUNITY; i++) {
        const provIndex = i % nProvincias;
        const catIndex = (base + i) % nCategorias;
        const { canonical: provincia, provinciaId } = provincias[provIndex];
        const categoria = CATEGORIAS[catIndex];
        const modalidad = MODALIDADES[Math.floor(Math.random() * MODALIDADES.length)];
        const adj = ADJETIVOS[(base + i) % ADJETIVOS.length];
        const serv = SERVICIOS[Math.floor(Math.random() * SERVICIOS.length)];
        const titulo = `${adj} ${serv} en ${provincia} #${base + i + 1}`;
        const descripcion = `Anuncio generado de prueba para ${comunidad} - ${provincia}. Categoría ${categoria} y modalidad ${modalidad}. Ofrecemos un recurso cercano para jóvenes.`;
        const creado = randomRecentDate();
        const actualizado = new Date(creado.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
        const vistas = Math.floor(Math.random() * 500);

        placeholders.push('(' + Array(18).fill('?').join(', ') + ')');
        params.push(
          usuarioId,
          titulo,
          descripcion,
          categoria,
          comunidadId,
          provinciaId,
          comunidad,
          provincia,
          modalidad,
          1,
          1,
          0,
          1,
          'approved',
          vistas,
          formatDate(creado),
          formatDate(actualizado),
          null
        );
        total++;
      }

      const sql = `
        INSERT INTO anuncios (
          usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id,
          comunidad_autonoma, provincia, modalidad, contacto_email, contacto_telefono,
          contacto_anonimo, visible, estado_moderacion, vistas, creado_at, actualizado_at, precio
        ) VALUES ${placeholders.join(', ')}
      `;
      await c.query(sql, params);
      console.log(`  ${comunidad}: +${ADS_PER_COMMUNITY}`);
    }

    console.log(`\nTotal insertado: ${total}`);
    console.log('\nConteo por comunidad autónoma:');
    const [byCom] = await c.execute(`SELECT comunidad_autonoma, COUNT(*) as total FROM anuncios GROUP BY comunidad_autonoma ORDER BY total DESC`);
    console.log(byCom.map(r => `${r.comunidad_autonoma}: ${r.total}`).join('\n'));

    console.log('\nPrimeras 20 provincias con más anuncios:');
    const [byProv] = await c.execute(`SELECT provincia, comunidad_autonoma, COUNT(*) as total FROM anuncios GROUP BY provincia, comunidad_autonoma ORDER BY total DESC LIMIT 20`);
    console.log(byProv.map(r => `${r.comunidad_autonoma} / ${r.provincia}: ${r.total}`).join('\n'));

  } finally {
    await c.end();
  }
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
