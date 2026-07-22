import { pool } from '../config/database';

const cleanDatabase = async () => {
  try {
    console.log('🧹 Limpiando base de datos...');
    
    const client = await pool.connect();
    
    try {
      // Eliminar todos los datos de anuncios
      await client.query('DELETE FROM anuncios');
      console.log('✅ Anuncios eliminados');
      
      // Insertar datos de ejemplo con UUIDs correctos
      const insertQuery = `
        INSERT INTO anuncios (titulo, descripcion, categoria, subcategoria, comunidad_autonoma, provincia, precio, modalidad, autor, email, contacto_email, contacto_telefono, contacto_anonimo, visible, estado_moderacion) VALUES
        ('Clases particulares de matemáticas', 'Soy estudiante de 3º de Ingeniería Matemática y ofrezco clases particulares para ESO y Bachillerato. Explico con calma, preparo ejercicios y puedo ayudarte con recuperaciones o selectividad. Modalidad presencial u online según zona. Precio por hora negociable según nivel.', 'educacion', 'clases', 'Aragón', 'Zaragoza', 15.00, 'servicio', 'Álvaro M.', 'alvaro.mate@citypaj.es', true, false, false, true, 'approved'),
        ('Entradas para concierto (precio juvenil)', 'Vendo 2 entradas para concierto este sábado. Precio juvenil, entrega en mano en el centro o envío digital. Ideal para ir en grupo. Si te interesa, escríbeme y lo cerramos hoy.', 'ocio', 'eventos', 'Andalucía', 'Málaga', 25.00, 'venta', 'Marina', 'marina@citypaj.es', true, false, false, true, 'approved'),
        ('Sofá cama en buen estado', 'Vendo sofá cama de 3 plazas, color gris, muy bien cuidado. Se convierte en cama de 135cm. Ideal para estudios o visitas. Lo cambio porque me mudo a piso amueblado. Puede verlo sin compromiso.', 'vivienda', 'muebles', 'Comunidad Valenciana', 'Valencia', 120.00, 'venta', 'Carlos', 'carlos.sofa@citypaj.es', true, true, false, true, 'approved'),
        ('Intercambio idiomas inglés-español', 'Busco a alguien nativo inglés para practicar y mejorar mi nivel. Yo puedo ayudar con español a cambio. Preferencia por alguien que quiera aprender español de forma seria. Podemos quedar en cafetería o videollamada.', 'intercambios', 'idiomas', 'Cataluña', 'Barcelona', 0.00, 'intercambio', 'Laura', 'laura.lang@citypaj.es', true, false, false, true, 'approved'),
        ('Servicio de jardinería', 'Ofrezco servicios de jardinería: poda, siega, limpieza, plantación. Tengo experiencia de 5 años y herramientas propias. Atiendo en toda la zona norte. Precios según tamaño del jardín. Presupuesto sin compromiso.', 'servicios', 'jardineria', 'Madrid', 'Madrid', 20.00, 'servicio', 'Miguel Ángel', 'miguel.jardin@citypaj.es', true, true, false, true, 'approved'),
        ('Regalo ropa de bebé', 'Regalo ropa de bebé (0-3 meses) en muy buen estado. Incluye bodies, pijamas, conjuntos. Son de marcas buenas y están como nuevos. Ideal para alguien que acaba de tener un bebé y necesita ropa urgente.', 'regalo', 'bebé', 'País Vasco', 'Bilbao', 0.00, 'regalo', 'Ana', 'ana.baby@citypaj.es', true, false, true, true, 'approved');
      `;
      
      await client.query(insertQuery);
      console.log('✅ Datos de ejemplo insertados con UUIDs correctos');
      
      // Verificar los datos insertados
      const result = await client.query('SELECT id, titulo FROM anuncios ORDER BY creado DESC LIMIT 3');
      console.log('📊 Anuncios verificados:');
      result.rows.forEach(row => {
        console.log(`ID: ${row.id}, Título: ${row.titulo}`);
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
  } finally {
    await pool.end();
  }
};

// Ejecutar si este archivo se corre directamente
if (require.main === module) {
  cleanDatabase();
}

export { cleanDatabase };
