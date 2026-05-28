// Script para generar base de datos masiva con 15 anuncios por provincia
// Total: ~1050 anuncios (15 anuncios × 52 provincias × 17 comunidades)

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuración de comunidades y provincias
const comunidadesProvincias = {
  'Andalucía': [
    'Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'
  ],
  'Aragón': [
    'Huesca', 'Teruel', 'Zaragoza'
  ],
  'Principado de Asturias': [
    'Asturias'
  ],
  'Islas Baleares': [
    'Islas Baleares'
  ],
  'Canarias': [
    'Santa Cruz de Tenerife', 'Las Palmas'
  ],
  'Cantabria': [
    'Cantabria'
  ],
  'Castilla-La Mancha': [
    'Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'
  ],
  'Castilla y León': [
    'Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'
  ],
  'Cataluña': [
    'Barcelona', 'Girona', 'Lleida', 'Tarragona'
  ],
  'Comunidad Valenciana': [
    'Alicante', 'Castellón', 'Valencia'
  ],
  'Extremadura': [
    'Badajoz', 'Cáceres'
  ],
  'Galicia': [
    'A Coruña', 'Lugo', 'Ourense', 'Pontevedra'
  ],
  'La Rioja': [
    'La Rioja'
  ],
  'Comunidad de Madrid': [
    'Madrid'
  ],
  'Región de Murcia': [
    'Murcia'
  ],
  'Comunidad Foral de Navarra': [
    'Navarra'
  ],
  'País Vasco': [
    'Álava', 'Guipúzcoa', 'Vizcaya'
  ]
};

// Plantillas de anuncios por categoría
const templates = {
  educacion: [
    {
      titulo: 'Clases particulares de {materia}',
      descripcion: 'Profesor con experiencia ofrece clases particulares de {materia} para todos los niveles. Preparación de exámenes, apoyo escolar y técnicas de estudio. Horarios flexibles. Zona {zona}. Precio: {precio}€/hora.',
      precio: [15, 20, 25, 30, 35]
    },
    {
      titulo: 'Profesor particular de {materia}',
      descripcion: 'Graduado en {carrera} con más de {años} años de experiencia da clases de {materia}. Método personalizado adaptado a cada alumno. Resultados garantizados. Clases online o presenciales.',
      precio: [18, 22, 28, 35, 40]
    },
    {
      titulo: 'Academia de refuerzo escolar',
      descripcion: 'Academia con profesores cualificados ofrece refuerzo en todas las asignaturas. Grupos reducidos, atención personalizada. Matrícula abierta todo el año. Primera clase gratuita.',
      precio: [80, 100, 120, 150, 180]
    }
  ],
  vivienda: [
    {
      titulo: 'Habitación en piso compartido',
      descripcion: 'Se alquila habitación exterior muy luminosa en piso compartido. Amueblada, con calefacción y wifi incluido. Compañeros ordenados y respetuosos. Ideal para estudiantes o jóvenes profesionales.',
      precio: [250, 300, 350, 400, 450]
    },
    {
      titulo: 'Piso de {habitaciones} habitaciones',
      descripcion: 'Piso reformado de {habitaciones} habitaciones, {banos} baños, salón-comedor y cocina equipada. Calefacción central, aire acondicionado. Zona tranquila con todos los servicios cerca.',
      precio: [600, 800, 1000, 1200, 1500]
    },
    {
      titulo: 'Busco roommate',
      descripcion: 'Busco persona responsable y limpia para compartir piso en el centro de la ciudad. La habitación es doble con armario empotrado. Gastos incluidos. Ambiente familiar y tranquilo.',
      precio: [280, 320, 380, 420, 480]
    }
  ],
  objetos: [
    {
      titulo: '{objeto} en buen estado',
      descripcion: 'Vendo {objeto} marca {marca}, modelo {modelo}. Poco uso, perfectamente conservado. Incluye accesorios y documentación. Motivo de venta: ya no lo necesito. Negociable.',
      precio: [50, 100, 200, 500, 1000]
    },
    {
      titulo: '{objeto} seminuevo',
      descripcion: '{objeto} adquirido hace {meses} meses, en perfecto estado. Casi sin usar, como nuevo. Garantía de fábrica todavía vigente. Entrega inmediata. Precio original: {precio_original}€.',
      precio: [80, 150, 300, 750, 1500]
    },
    {
      titulo: 'Regalo {objeto}',
      descripcion: 'Regalo {objeto} que ya no uso pero está en perfecto estado. Ideal para quien esté buscando algo de calidad sin gastar mucho. Solo para recoger en {zona}. Primer contacto tiene prioridad.',
      precio: null
    }
  ],
  servicios: [
    {
      titulo: 'Servicio de {servicio} profesional',
      descripcion: 'Profesional con {años} años de experiencia ofrece servicio de {servicio}. Trabajo garantizado, precios competitivos. Presupuesto sin compromiso. Disponibilidad inmediata.',
      precio: [30, 50, 80, 120, 200]
    },
    {
      titulo: '{servicio} a domicilio',
      descripcion: 'Experto en {servicio} se desplaza a domicilio. Material propio, trabajo limpio y rápido. Atención a particulares y empresas. Horarios amplios, también fines de semana.',
      precio: [40, 60, 100, 150, 250]
    },
    {
      titulo: 'Ayuda con {servicio}',
      descripcion: 'Estudiante universitario ofrece ayuda con {servicio} a precios económicos. Responsable, puntual y cuidadoso con el trabajo. Perfecto para pequeños trabajos o emergencias.',
      precio: [20, 35, 50, 75, 100]
    }
  ],
  empleo: [
    {
      titulo: 'Busco trabajo como {puesto}',
      descripcion: 'Joven con formación en {estudios} y experiencia en {experiencia} busca trabajo como {puesto}. Responsable, proactivo y con ganas de aprender. Disponibilidad inmediata e incorporación.',
      precio: null
    },
    {
      titulo: 'Se necesita {puesto}',
      descripcion: 'Empresa del sector {sector} busca {puesto} con experiencia. Contrato {tipo_contrato}, salario {salario}€ anuales. Buen ambiente laboral y posibilidades de crecimiento. Enviar CV.',
      precio: [18000, 22000, 28000, 35000, 45000]
    },
    {
      titulo: 'Oferto mis servicios como {puesto}',
      descripcion: 'Profesional cualificado con más de {años} años de experiencia ofrece sus servicios como {puesto}. Trabajo por proyecto o temporal. Referencias disponibles.',
      precio: [25, 40, 60, 90, 150]
    }
  ],
  motor: [
    {
      titulo: '{marca} {modelo} año {año}',
      descripcion: 'Vendo coche {marca} {modelo} del año {año}. {kilometraje} km, mantenimiento al día, ITV pasada. Perfecto estado, primer dueño. Consumo: {consumo}l/100km. Negociable.',
      precio: [3000, 5000, 8000, 15000, 25000]
    },
    {
      titulo: 'Moto {marca} {cilindrada}cc',
      descripcion: 'Moto {marca} de {cilindrada}cc, año {año}. Poco uso, siempre garaje. Neumáticos nuevos, revisión completa. Ideal para ciudad o viajes. Documentación en regla.',
      precio: [1500, 2500, 4000, 7000, 12000]
    },
    {
      titulo: 'Repuestos de {marca}',
      descripcion: 'Vendo juego completo de repuestos para {marca} {modelo}. Incluye {piezas}. Todo original, en buen estado. Motivo: cambio de vehículo. Vendo todo junto o por separado.',
      precio: [200, 400, 800, 1500, 3000]
    }
  ],
  contacto: [
    {
      titulo: 'Busco amistades en {ciudad}',
      descripcion: 'Chico/a de {edad} años busca gente para hacer planes en {ciudad}. Me gusta {hobbies}. Interesado en conocer personas nuevas y compartir aficiones. Sin compromisos, solo amistad.',
      precio: null
    },
    {
      titulo: 'Grupo de {actividad}',
      descripcion: 'Creamos grupo de {actividad} los {dias}. Buscamos gente interesada, nivel {nivel}. Nos reunimos en {lugar}. Ambiente divertido y sin presión. Ven y conócenos.',
      precio: null
    },
    {
      titulo: 'Busco pareja',
      descripcion: 'Persona de {edad} años, {caracteristicas}, busca relación seria. Valoro la sinceridad, el sentido del humor y la complicidad. Si buscas algo estable y verdadero, escríbeme.',
      precio: null
    }
  ]
};

// Datos para generar variaciones
const materias = ['matemáticas', 'inglés', 'física', 'química', 'historia', 'biología', 'programación', 'dibujo', 'música', 'economía'];
const carreras = ['Matemáticas', 'Ingeniería', 'Filología', 'Biología', 'Economía', 'Informática', 'Historia', 'Arte'];
const zonas = ['centro', 'norte', 'sur', 'este', 'oeste', 'casco antiguo', 'universidad', 'polígono'];
const objetos = ['móvil', 'portátil', 'bicicleta', 'guitarra', 'consola', 'televisión', 'cámara', 'libros', 'ropa', 'muebles'];
const marcas = ['Samsung', 'Apple', 'Sony', 'LG', 'Xiaomi', 'Huawei', 'Bosch', 'Philips', 'Nike', 'Adidas'];
const servicios = ['limpieza', 'reparaciones', 'jardinería', 'informática', 'clases particulares', 'diseño', 'traducción', 'montaje'];
const puestos = ['administrativo', 'dependiente', 'programador', 'diseñador', 'comercial', 'técnico', 'auxiliar', 'recepcionista'];
const sectores = ['tecnología', 'comercio', 'educación', 'sanidad', 'hostelería', 'construcción', 'transporte', 'servicios'];
const actividades = ['senderismo', 'cine', 'deporte', 'lectura', 'música', 'videojuegos', 'fotografía', 'cocina'];
const hobbies = ['deporte', 'cine', 'música', 'viajar', 'leer', 'cocinar', 'fotografía', 'naturaleza'];

// Nombres y apellidos españoles
const nombres = ['Ana', 'María', 'Laura', 'Sofía', 'Lucía', 'Carmen', 'Elena', 'Isabel', 'Paula', 'Valeria', 'Carlos', 'David', 'Javier', 'Daniel', 'Sergio', 'Pablo', 'Álvaro', 'Adrián', 'Miguel', 'Juan'];
const apellidos = ['García', 'Martínez', 'López', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Fernández', 'González', 'Rodríguez', 'Muñoz', 'Díaz', 'Hernández', 'Ruiz', 'Moreno', 'Álvarez', 'Cruz', 'Flores', 'Morales'];

function generarUsuario() {
  return {
    id: uuidv4(),
    nombre: `${nombres[Math.floor(Math.random() * nombres.length)]} ${apellidos[Math.floor(Math.random() * apellidos.length)]}`,
    email: `user${Math.floor(Math.random() * 10000)}@example.com`
  };
}

function generarAnuncio(comunidad, provincia, indice, usuario) {
  const categorias = Object.keys(templates);
  const categoria = categorias[indice % categorias.length];
  const template = templates[categoria][Math.floor(Math.random() * templates[categoria].length)];
  
  // Reemplazar variables en el template
  let titulo = template.titulo;
  let descripcion = template.descripcion;
  let precio = template.precio ? template.precio[Math.floor(Math.random() * template.precio.length)] : null;
  
  // Variables aleatorias para este anuncio
  const materia = materias[Math.floor(Math.random() * materias.length)];
  const objeto = objetos[Math.floor(Math.random() * objetos.length)];
  const marca = marcas[Math.floor(Math.random() * marcas.length)];
  const servicio = servicios[Math.floor(Math.random() * servicios.length)];
  const puesto = puestos[Math.floor(Math.random() * puestos.length)];
  const actividad = actividades[Math.floor(Math.random() * actividades.length)];
  const habitaciones = Math.floor(Math.random() * 3) + 2;
  const banos = Math.floor(Math.random() * 2) + 1;
  const carrera = carreras[Math.floor(Math.random() * carreras.length)];
  const anos = Math.floor(Math.random() * 10) + 1;
  const zona = zonas[Math.floor(Math.random() * zonas.length)];
  const modelo = `Modelo ${Math.floor(Math.random() * 100)}`;
  const meses = Math.floor(Math.random() * 12) + 1;
  const precioOriginal = Math.floor(Math.random() * 1000) + 500;
  const estudios = carreras[Math.floor(Math.random() * carreras.length)];
  const experiencia = sectores[Math.floor(Math.random() * sectores.length)];
  const sector = sectores[Math.floor(Math.random() * sectores.length)];
  const tipoContrato = ['temporal', 'indefinido', 'prácticas'][Math.floor(Math.random() * 3)];
  const salario = Math.floor(Math.random() * 20000) + 15000;
  const cilindrada = [125, 250, 500, 750, 1000][Math.floor(Math.random() * 5)];
  const ano = 2015 + Math.floor(Math.random() * 9);
  const kilometraje = Math.floor(Math.random() * 100000) + 10000;
  const consumo = (Math.random() * 5 + 3).toFixed(1);
  const piezas = 'ruedas, motor, piezas de carrocería';
  const ciudad = provincia;
  const edad = Math.floor(Math.random() * 30) + 18;
  const hobbiesList = hobbies.slice(0, 3).join(', ');
  const dias = ['lunes y miércoles', 'martes y jueves', 'viernes', 'fines de semana'][Math.floor(Math.random() * 4)];
  const nivel = ['principiante', 'medio', 'avanzado'][Math.floor(Math.random() * 3)];
  const lugar = ['parque central', 'polideportivo', 'casa', 'centro cívico'][Math.floor(Math.random() * 4)];
  const caracteristicas = ['simpática, divertida y aventurera', 'tranquila, responsable y buena persona', 'sociable, honesta y trabajadora'][Math.floor(Math.random() * 3)];

  // Reemplazar placeholders
  titulo = titulo.replace(/{materia}/g, materia)
                  .replace(/{objeto}/g, objeto)
                  .replace(/{marca}/g, marca)
                  .replace(/{servicio}/g, servicio)
                  .replace(/{puesto}/g, puesto)
                  .replace(/{actividad}/g, actividad)
                  .replace(/{habitaciones}/g, habitaciones)
                  .replace(/{banos}/g, banos);
  
  descripcion = descripcion.replace(/{materia}/g, materia)
                           .replace(/{carrera}/g, carrera)
                           .replace(/{años}/g, anos)
                           .replace(/{zona}/g, zona)
                           .replace(/{objeto}/g, objeto)
                           .replace(/{marca}/g, marca)
                           .replace(/{modelo}/g, modelo)
                           .replace(/{meses}/g, meses)
                           .replace(/{precio_original}/g, precioOriginal)
                           .replace(/{servicio}/g, servicio)
                           .replace(/{puesto}/g, puesto)
                           .replace(/{estudios}/g, estudios)
                           .replace(/{experiencia}/g, experiencia)
                           .replace(/{sector}/g, sector)
                           .replace(/{tipo_contrato}/g, tipoContrato)
                           .replace(/{salario}/g, salario)
                           .replace(/{cilindrada}/g, cilindrada)
                           .replace(/{año}/g, ano)
                           .replace(/{kilometraje}/g, kilometraje)
                           .replace(/{consumo}/g, consumo)
                           .replace(/{piezas}/g, piezas)
                           .replace(/{ciudad}/g, ciudad)
                           .replace(/{edad}/g, edad)
                           .replace(/{hobbies}/g, hobbiesList)
                           .replace(/{dias}/g, dias)
                           .replace(/{nivel}/g, nivel)
                           .replace(/{lugar}/g, lugar)
                           .replace(/{caracteristicas}/g, caracteristicas);

  return {
    id: uuidv4(),
    usuario_id: usuario.id,
    titulo: titulo,
    descripcion: descripcion,
    categoria: categoria,
    subcategoria: null,
    comunidad_autonoma: comunidad,
    provincia: provincia,
    precio: precio,
    modalidad: categoria === 'vivienda' ? 'alquiler' : (categoria === 'objetos' || categoria === 'motor' ? 'venta' : 'servicio'),
    usuario_nombre: usuario.nombre,
    email: usuario.email,
    contacto_email: Math.random() > 0.3,
    contacto_telefono: Math.random() > 0.5,
    contacto_anonimo: Math.random() > 0.8,
    visible: true,
    estado_moderacion: 'approved',
    creado: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    actualizado: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    vistas: Math.floor(Math.random() * 500)
  };
}

function generarBaseDeDatosMasiva() {
  console.log('🚀 Generando base de datos masiva...');
  
  const usuarios = [];
  const anuncios = [];
  let totalAnuncios = 0;

  // Generar usuarios
  for (let i = 0; i < 500; i++) {
    usuarios.push(generarUsuario());
  }

  // Generar anuncios
  Object.entries(comunidadesProvincias).forEach(([comunidad, provincias]) => {
    provincias.forEach(provincia => {
      console.log(`Generando 15 anuncios para ${provincia}, ${comunidad}...`);
      
      for (let i = 0; i < 15; i++) {
        const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
        const anuncio = generarAnuncio(comunidad, provincia, i, usuario);
        anuncios.push(anuncio);
        totalAnuncios++;
      }
    });
  });

  console.log(`✅ Base de datos generada con éxito!`);
  console.log(`📊 Estadísticas:`);
  console.log(`   - Total usuarios: ${usuarios.length}`);
  console.log(`   - Total anuncios: ${totalAnuncios}`);
  console.log(`   - Comunidades: ${Object.keys(comunidadesProvincias).length}`);
  console.log(`   - Provincias: ${Object.values(comunidadesProvincias).flat().length}`);

  // Guardar archivos JSON con codificación UTF-8
  const outputPath = path.join(__dirname, 'anuncios-completos.sql');
  
  // Generar SQL con codificación UTF-8
  let sqlContent = '-- Base de datos masiva de CityPaj\n';
  sqlContent += '-- Generada automáticamente\n';
  sqlContent += '-- Codificación: UTF-8\n\n';
  
  sqlContent += '-- Insertar usuarios\n';
  sqlContent += 'INSERT INTO usuarios (id, nombre, email, password_hash, email_verificado, creado, actualizado) VALUES\n';
  
  usuarios.forEach((usuario, index) => {
    const passwordHash = '$2b$10$placeholder_hash_' + Math.random().toString(36).substring(7);
    sqlContent += `('${usuario.id}', '${usuario.nombre}', '${usuario.email}', '${passwordHash}', true, NOW(), NOW())`;
    sqlContent += index < usuarios.length - 1 ? ',\n' : ';\n\n';
  });
  
  sqlContent += '-- Insertar anuncios\n';
  sqlContent += 'INSERT INTO anuncios (id, usuario_id, titulo, descripcion, categoria, subcategoria, comunidad_autonoma, provincia, precio, modalidad, usuario_nombre, email, contacto_email, contacto_telefono, contacto_anonimo, visible, estado_moderacion, creado, actualizado, vistas) VALUES\n';
  
  anuncios.forEach((anuncio, index) => {
    sqlContent += `('${anuncio.id}', '${anuncio.usuario_id}', '${anuncio.titulo.replace(/'/g, "''")}', '${anuncio.descripcion.replace(/'/g, "''")}', '${anuncio.categoria}', ${anuncio.subcategoria ? `'${anuncio.subcategoria}'` : 'NULL'}, '${anuncio.comunidad_autonoma}', '${anuncio.provincia}', ${anuncio.precio}, '${anuncio.modalidad}', '${anuncio.usuario_nombre.replace(/'/g, "''")}', '${anuncio.email}', ${anuncio.contacto_email}, ${anuncio.contacto_telefono}, ${anuncio.contacto_anonimo}, ${anuncio.visible}, '${anuncio.estado_moderacion}', '${anuncio.creado}', '${anuncio.actualizado}', ${anuncio.vistas})`;
    sqlContent += index < anuncios.length - 1 ? ',\n' : ';\n';
  });
  
  // Escribir archivo con codificación UTF-8
  fs.writeFileSync(outputPath, sqlContent, { encoding: 'utf8' });
  
  // También generar JSON para backup
  const jsonPath = path.join(__dirname, 'anuncios-completos.json');
  const jsonData = {
    usuarios: usuarios,
    anuncios: anuncios,
    metadata: {
      total_usuarios: usuarios.length,
      total_anuncios: totalAnuncios,
      generado: new Date().toISOString(),
      codificacion: 'UTF-8'
    }
  };
  
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), { encoding: 'utf8' });
  
  console.log(`📁 Archivos generados:`);
  console.log(`   - SQL: ${outputPath}`);
  console.log(`   - JSON: ${jsonPath}`);
  console.log(`\n🎯 Para importar a PostgreSQL:`);
  console.log(`   psql -d nombre_base_datos -f anuncios-completos.sql`);
}

// Ejecutar script
generarBaseDeDatosMasiva();
