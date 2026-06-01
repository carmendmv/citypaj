// Endpoint para guardar sugerencias del buzón de sugerencias
const saveSuggestion = async (req, res) => {
  try {
    const { nombre, email, titulo, descripcion, tipo, categoria, prioridad } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: nombre, email, titulo, descripcion'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    // Insertar sugerencia en la base de datos
    const query = `
      INSERT INTO sugerencias (
        nombre, email, titulo, descripcion, tipo, categoria, prioridad, 
        estado, creado, actualizado
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, 'pendiente', NOW(), NOW()
      ) RETURNING id
    `;

    const result = await pool.query(query, [
      nombre.trim(),
      email.trim(),
      titulo.trim(),
      descripcion.trim(),
      tipo || 'sugerencia',
      categoria || 'general',
      prioridad || 'media'
    ]);

    console.log('✅ Sugerencia guardada:', result.rows[0].id);

    res.status(201).json({
      success: true,
      message: 'Sugerencia guardada correctamente',
      data: {
        id: result.rows[0].id,
        nombre,
        email,
        titulo,
        tipo,
        estado: 'pendiente',
        creado: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error guardando sugerencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al guardar la sugerencia'
    });
  }
};

// Endpoint para obtener todas las sugerencias (admin)
const getSuggestions = async (req, res) => {
  try {
    const query = `
      SELECT * FROM sugerencias 
      ORDER BY creado DESC
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo sugerencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  saveSuggestion,
  getSuggestions
};
