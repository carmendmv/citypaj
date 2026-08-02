import { pool } from '../src/config/database';

const tablas = [
  'anuncios',
  'comunidad_publicaciones',
  'comunidad_respuestas',
  'propuestas',
  'sugerencias',
  'eventos',
];

async function main() {
  for (const tabla of tablas) {
    try {
      await pool.execute(
        `ALTER TABLE ${tabla} ADD COLUMN IF NOT EXISTS ip_creador VARCHAR(45) NULL`
      );
      console.log(`Columna ip_creador añadida/verificada en ${tabla}`);
    } catch (e: any) {
      if (e.message?.includes('Table') && e.message?.includes("doesn't exist")) {
        console.log(`Tabla ${tabla} no existe, se omite`);
      } else {
        console.error(`Error en ${tabla}:`, e.message);
      }
    }
  }
  console.log('Migración v5 aplicada: ip_creador');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
