const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.resolve(__dirname, '../../frontend/public/favicon.svg');
const outDir = path.resolve(__dirname, '../../frontend/public');

if (!fs.existsSync(svgPath)) {
  console.error('No se encuentra el SVG:', svgPath);
  process.exit(1);
}

const svgBuffer = fs.readFileSync(svgPath);

const ORANGE = { r: 249, g: 115, b: 22, alpha: 1 };

async function main() {
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ];

  for (const s of sizes) {
    await sharp(svgBuffer, { density: 72 })
      .resize(s.size, s.size, { fit: 'contain', background: ORANGE })
      .png()
      .toFile(path.join(outDir, s.name));
    console.log('Generado', s.name);
  }

  // Generar favicon.ico con entradas de 16 y 32 píxeles en formato PNG
  const png16 = await sharp(svgBuffer, { density: 72 })
    .resize(16, 16, { fit: 'contain', background: ORANGE })
    .png()
    .toBuffer();

  const png32 = await sharp(svgBuffer, { density: 72 })
    .resize(32, 32, { fit: 'contain', background: ORANGE })
    .png()
    .toBuffer();

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // tipo icono
  header.writeUInt16LE(2, 4); // número de imágenes

  const images = [
    { size: 16, data: png16 },
    { size: 32, data: png32 },
  ];

  let offset = 6 + images.length * 16;
  const entries = [];
  const dataParts = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 0); // ancho
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 1); // alto
    entry.writeUInt8(0, 2); // colores
    entry.writeUInt8(0, 3); // reservado
    entry.writeUInt16LE(1, 4); // planos
    entry.writeUInt16LE(32, 6); // bits por píxel
    entry.writeUInt32LE(img.data.length, 8); // tamaño en bytes
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    dataParts.push(img.data);
    offset += img.data.length;
  }

  const icoPath = path.join(outDir, 'favicon.ico');
  fs.writeFileSync(icoPath, Buffer.concat([header, ...entries, ...dataParts]));
  console.log('Generado favicon.ico');
}

main().catch((err) => {
  console.error('Error generando favicons:', err);
  process.exit(1);
});
