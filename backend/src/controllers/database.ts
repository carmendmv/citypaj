import { Request, Response } from 'express';

// Importar los mismos datos que usa el controlador de anuncios
const mockAnuncios = (() => {
  const COMUNIDADES_AUTONOMAS = [
    'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias', 'Cantabria',
    'Castilla-La Mancha', 'Castilla y León', 'Cataluña', 'Comunidad Valenciana',
    'Extremadura', 'Galicia', 'Madrid', 'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
  ];

  const PROVINCIAS = {
    'Andalucía': ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'],
    'Aragón': ['Huesca', 'Teruel', 'Zaragoza'],
    'Asturias': ['Asturias'],
    'Baleares': ['Baleares'],
    'Canarias': ['Las Palmas', 'Santa Cruz de Tenerife'],
    'Cantabria': ['Cantabria'],
    'Castilla-La Mancha': ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'],
    'Castilla y León': ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'],
    'Cataluña': ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
    'Comunidad Valenciana': ['Alicante', 'Castellón', 'Valencia'],
    'Extremadura': ['Badajoz', 'Cáceres'],
    'Galicia': ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
    'Madrid': ['Madrid'],
    'Murcia': ['Murcia'],
    'Navarra': ['Navarra'],
    'País Vasco': ['Álava', 'Bizkaia', 'Gipuzkoa'],
    'La Rioja': ['La Rioja']
  };

  const CATEGORIAS = {
    ocio: {
      subcategorias: ['conciertos', 'eventos', 'deportes', 'talleres', 'cine', 'asociaciones', 'planes'],
      titulos: [
        'Entradas para concierto de {artista}',
        'Taller de {actividad} este fin de semana',
        'Partido de {deporte} - {equipo1} vs {equipo2}',
        'Cine de verano: {pelicula}',
        'Busco compañeros para {actividad}',
        'Asociación juvenil busca miembros',
        'Plan para este {dia}: {actividad}',
        'Clases de {habilidad} gratuitas',
        'Evento cultural: {nombre}',
        'Excursión a {lugar}'
      ],
      descripciones: [
        '{evento} este {dia}. {detalles}. Precio: {precio}€. Contactar para más información.',
        'Busco gente para {actividad}. {detalles}. Edad: {edad} años. Interesados contactar.',
        'Taller de {tema} impartido por {profesor}. {detalles}. Duración: {duracion} horas.',
        'Entradas disponibles para {evento}. {detalles}. Entrega inmediata o en mano.',
        'Grupo de {actividad} busca nuevos miembros. {detalles}. Reuniones {frecuencia}.'
      ]
    },
    servicios: {
      subcategorias: ['transporte', 'alojamiento', 'juridico', 'psicologico', 'tramites', 'asesoria', 'bibliotecas'],
      titulos: [
        'Servicio de {tipo} para {situacion}',
        'Asesoría gratuita en {area}',
        'Ayuda con {tramite}',
        'Transporte compartido {ruta}',
        'Alojamiento temporal para {situacion}',
        'Atención {servicio} para jovenes',
        'Apoyo en {proceso}',
        'Recurso {tipo} disponible'
      ],
      descripciones: [
        'Ofrezco servicio de {servicio} para {destinatario}. {detalles}. Horario: {horario}. Precio: {precio}€.',
        'Asesoría especializada en {area}. {detalles}. Consulta gratuita. Contactar para cita.',
        'Ayuda profesional con {tramite}. {detalles}. Experiencia: {experiencia} años.',
        'Servicio de transporte {ruta}. {detalles}. Disponibilidad: {disponibilidad}.'
      ]
    },
    formacion: {
      subcategorias: ['cursos', 'fp', 'becas', 'orientacion', 'formacion-reglada', 'formacion-no-reglada'],
      titulos: [
        'Curso de {tema} - {nivel}',
        'Beca para {estudio}',
        'Orientación académica y profesional',
        'Formación en {habilidad}',
        'Talleres de {competencia}',
        'Programa de formacion {tipo}',
        'Clases de {asignatura}',
        'Preparación oposiciones {area}'
      ],
      descripciones: [
        'Curso completo de {tema} nivel {nivel}. {detalles}. Duración: {duracion} meses. Certificado incluido.',
        'Beca disponible para {estudio}. {detalles}. Requisitos: {requisitos}. Plazo: {plazo}.',
        'Servicio de orientación académica. {detalles}. Ayuda con elección de estudios y carrera.',
        'Formación profesional en {area}. {detalles}. Prácticas incluidas. Salidas laborales.'
      ]
    },
    empleo: {
      subcategorias: ['ofertas', 'bolsa-empleo', 'orientacion-laboral', 'emprendimiento', 'practicas'],
      titulos: [
        'Oferta de trabajo: {puesto}',
        'Busco {profesional}',
        'Prácticas en {sector}',
        'Oportunidad de emprendimiento',
        'Bolsa de empleo juvenil',
        'Trabajo temporal {puesto}',
        'Colaboración remunerada {area}',
        'Proyecto para {perfil}'
      ],
      descripciones: [
        'Se busca {puesto} para {empresa}. {detalles}. Jornada: {jornada}. Salario: {salario}€.',
        'Oferta de prácticas en {sector}. {detalles}. Duración: {duracion}. Posible contratación.',
        'Proyecto de emprendimiento busca {colaborador}. {detalles}. Compartir beneficios.',
        'Trabajo flexible como {puesto}. {detalles}. Remoto/presencial. Formación continua.'
      ]
    },
    comunidad: {
      subcategorias: ['asociacionismo', 'voluntariado', 'participacion', 'redes-juveniles', 'proyectos-comunitarios'],
      titulos: [
        'Voluntariado en {causa}',
        'Asociación juvenil busca miembros',
        'Proyecto comunitario {nombre}',
        'Red de apoyo {tipo}',
        'Participación ciudadana {evento}',
        'Grupo de {interes}',
        'Iniciativa juvenil {proyecto}',
        'Colaboración solidaria {area}'
      ],
      descripciones: [
        'Buscamos voluntarios para {proyecto}. {detalles}. Compromiso: {compromiso} horas semanales.',
        'Asociación juvenil dedicada a {causa}. {detalles}. Reuniones {frecuencia}. Nuevos miembros bienvenidos.',
        'Proyecto comunitario para mejorar {aspecto}. {detalles}. Participación abierta a toda la comunidad.',
        'Red de apoyo mutuo en {area}. {detalles}. Actividades {actividades}. Contactar para unirte.'
      ]
    }
  };

  const ARTISTAS = ['Bad Bunny', 'Rosalía', 'C. Tangana', 'Aitana', 'Ozuna', 'myke Towers', 'Rauw Alejandro', 'Sebastián Yatra'];
  const ACTIVIDADES = ['fotografía', 'música', 'danza', 'teatro', 'pintura', 'escritura', 'deporte', 'cocina', 'idiomas', 'tecnología'];
  const DEPORTES = ['fútbol', 'baloncesto', 'tenis', 'pádel', 'natación', 'ciclismo', 'running', 'yoga', 'escalada'];
  const EQUIPOS = ['Real Madrid', 'Barcelona', 'Atlético', 'Sevilla', 'Athletic', 'Valencia', 'Betis', 'Sociedad'];
  const DIAS = ['sábado', 'domingo', 'viernes', 'lunes', 'martes'];
  const LUGARES = ['Sierra', 'Playa', 'Montaña', 'Ciudad', 'Pueblo', 'Parque', 'Museo', 'Teatro'];

  function randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generarAnuncio(comunidad: string, index: number) {
    const categoriasDisponibles = [
      'ocio' as const,
      'servicios' as const,
      'formacion' as const,
      'empleo' as const,
      'comunidad' as const
    ];
    const categoriaKey = randomChoice(categoriasDisponibles);
    const categoria = CATEGORIAS[categoriaKey];
    const subcategoria = randomChoice(categoria.subcategorias);
    const provincia = randomChoice(PROVINCIAS[comunidad as keyof typeof PROVINCIAS]);
    
    let titulo = randomChoice(categoria.titulos);
    titulo = titulo
      .replace('{artista}', randomChoice(ARTISTAS))
      .replace('{actividad}', randomChoice(ACTIVIDADES))
      .replace('{deporte}', randomChoice(DEPORTES))
      .replace('{equipo1}', randomChoice(EQUIPOS))
      .replace('{equipo2}', randomChoice(EQUIPOS))
      .replace('{dia}', randomChoice(DIAS))
      .replace('{lugar}', randomChoice(LUGARES))
      .replace('{habilidad}', randomChoice(ACTIVIDADES))
      .replace('{tema}', randomChoice(ACTIVIDADES))
      .replace('{nombre}', `Proyecto ${index}`)
      .replace('{pelicula}', `Película ${index}`)
      .replace('{servicio}', randomChoice(['asesoría', 'consultoría', 'apoyo', 'ayuda']))
      .replace('{situacion}', randomChoice(['estudiantes', 'jóvenes', 'desempleados', 'emprendedores']))
      .replace('{area}', randomChoice(['legal', 'psicológica', 'académica', 'laboral']))
      .replace('{tramite}', randomChoice(['documentación', 'becas', 'subvenciones', 'certificados']))
      .replace('{tipo}', randomChoice(['gratuito', 'subvencionado', 'especializado']))
      .replace('{estudio}', randomChoice(['universidad', 'FP', 'master', 'curso']))
      .replace('{puesto}', randomChoice(['auxiliar', 'técnico', 'coordinador', 'analista', 'diseñador']))
      .replace('{profesional}', randomChoice(['diseñador', 'programador', 'comunicador', 'técnico']))
      .replace('{sector}', randomChoice(['tecnología', 'salud', 'educación', 'medio ambiente']))
      .replace('{causa}', randomChoice(['medio ambiente', 'educación', 'social', 'cultural']))
      .replace('{proyecto}', `Iniciativa ${index}`)
      .replace('{interes}', randomChoice(['lectura', 'deporte', 'arte', 'tecnología', 'naturaleza']))
      .replace('{colaborador}', randomChoice(['socio', 'voluntario', 'participante', 'colaborador']))
      .replace('{aspecto}', randomChoice(['barrio', 'ciudad', 'medio ambiente', 'cultura local']))
      .replace('{nivel}', randomChoice(['básico', 'intermedio', 'avanzado']))
      .replace('{competencia}', randomChoice(['digitales', 'idiomas', 'profesionales', 'sociales']))
      .replace('{asignatura}', randomChoice(['matemáticas', 'inglés', 'programación', 'diseño']))
      .replace('{perfil}', randomChoice(['estudiante', 'profesional', 'creativo', 'técnico']));

    let descripcion = randomChoice(categoria.descripciones);
    const precio = randomNumber(5, 200);
    const edad = randomNumber(18, 30);
    const duracion = randomNumber(1, 12);
    const experiencia = randomNumber(1, 10);
    const requisitos = randomNumber(1, 5);
    const plazo = randomNumber(1, 30);
    const jornada = randomChoice(['completa', 'parcial', 'flexible']);
    const salario = randomNumber(800, 2000);
    const compromiso = randomNumber(2, 10);
    const frecuencia = randomChoice(['semanales', 'quincenales', 'mensuales']);

    descripcion = descripcion
      .replace('{evento}', titulo)
      .replace('{dia}', randomChoice(DIAS))
      .replace('{detalles}', 'Excelente oportunidad para jóvenes interesados. No se requiere experiencia previa. Ambiente colaborativo y dinámico.')
      .replace('{precio}', precio.toString())
      .replace('{actividad}', randomChoice(ACTIVIDADES))
      .replace('{edad}', edad.toString())
      .replace('{profesor}', `Profesor ${index}`)
      .replace('{duracion}', duracion.toString())
      .replace('{pelicula}', `Película ${index}`)
      .replace('{servicio}', randomChoice(['asesoría', 'consultoría', 'apoyo']))
      .replace('{destinatario}', randomChoice(['estudiantes', 'jóvenes', 'desempleados']))
      .replace('{horario}', `${randomNumber(9, 20)}:00 - ${randomNumber(9, 20)}:00`)
      .replace('{area}', randomChoice(['legal', 'académica', 'profesional']))
      .replace('{tramite}', randomChoice(['documentación', 'becas', 'certificados']))
      .replace('{experiencia}', experiencia.toString())
      .replace('{ruta}', `${comunidad} - ${provincia}`)
      .replace('{disponibilidad}', randomChoice(['inmediata', '24h', '48h']))
      .replace('{tema}', randomChoice(ACTIVIDADES))
      .replace('{nivel}', randomChoice(['básico', 'intermedio', 'avanzado']))
      .replace('{estudio}', randomChoice(['universidad', 'formación profesional', 'master']))
      .replace('{requisitos}', `${requisitos} requisitos básicos`)
      .replace('{plazo}', `${plazo} días`)
      .replace('{puesto}', titulo)
      .replace('{empresa}', `Empresa ${index}`)
      .replace('{sector}', randomChoice(['tecnológico', 'educativo', 'cultural', 'social']))
      .replace('{jornada}', jornada)
      .replace('{salario}', salario.toString())
      .replace('{colaborador}', randomChoice(['socio', 'voluntario', 'participante']))
      .replace('{proyecto}', `Proyecto ${index}`)
      .replace('{compromiso}', `${compromiso} horas`)
      .replace('{causa}', randomChoice(['medio ambiente', 'educación', 'social', 'cultural']))
      .replace('{frecuencia}', frecuencia)
      .replace('{aspecto}', randomChoice(['barrio', 'ciudad', 'medio ambiente']))
      .replace('{actividades}', 'talleres, eventos y reuniones');

    return {
      id: require('crypto').randomUUID(),
      titulo: `(${comunidad}) ${titulo}`,
      descripcion,
      categoria: categoriaKey,
      subcategoria,
      comunidad_autonoma: comunidad,
      provincia,
      precio: categoriaKey === 'ocio' || categoriaKey === 'servicios' ? precio : null,
      modalidad: categoriaKey === 'ocio' || categoriaKey === 'servicios' ? randomChoice(['venta', 'servicio']) : randomChoice(['oferta', 'colaboracion']),
      autor: `Usuario${index}`,
      email: `demo+${comunidad.toLowerCase().replace(' ', '')}${index}@citypaj.es`,
      telefono: null,
      contacto_email: true,
      contacto_telefono: false,
      contacto_anonimo: false,
      visible: true,
      estado_moderacion: 'approved',
      creado: new Date(Date.now() - randomNumber(0, 30) * 24 * 60 * 60 * 1000).toISOString(),
      actualizado: new Date().toISOString(),
      vistas: randomNumber(0, 100)
    };
  }

  function generarTodosLosAnuncios() {
    const todosLosAnuncios: any[] = [];
    
    const anunciosPorComunidad = Math.floor(1000 / COMUNIDADES_AUTONOMAS.length);
    
    COMUNIDADES_AUTONOMAS.forEach(comunidad => {
      for (let i = 0; i < anunciosPorComunidad; i++) {
        todosLosAnuncios.push(generarAnuncio(comunidad, i));
      }
    });
    
    const restantes = 1000 - todosLosAnuncios.length;
    for (let i = 0; i < restantes; i++) {
      const comunidad = randomChoice(COMUNIDADES_AUTONOMAS);
      todosLosAnuncios.push(generarAnuncio(comunidad, i + anunciosPorComunidad));
    }
    
    return todosLosAnuncios;
  }

  return generarTodosLosAnuncios();
})();

// Endpoint para ver la base de datos
export const getDatabaseView = async (req: Request, res: Response): Promise<void> => {
  try {
    const { table, limit = 50, offset = 0, comunidad, categoria } = req.query;

    let data = [...mockAnuncios];
    let filteredData = data;

    // Aplicar filtros
    if (comunidad && typeof comunidad === 'string') {
      const normalizeText = (value: string) =>
        value
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .trim();
      
      filteredData = filteredData.filter((a) => 
        normalizeText(a.comunidad_autonoma) === normalizeText(comunidad)
      );
    }

    if (categoria && typeof categoria === 'string') {
      filteredData = filteredData.filter((a) => a.categoria === categoria);
    }

    // Paginación
    const start = parseInt(offset as string);
    const end = start + parseInt(limit as string);
    const paginatedData = filteredData.slice(start, end);

    // Estadísticas
    const stats = {
      total: data.length,
      filtered: filteredData.length,
      showing: paginatedData.length,
      porComunidad: data.reduce((acc, anuncio) => {
        acc[anuncio.comunidad_autonoma] = (acc[anuncio.comunidad_autonoma] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      porCategoria: data.reduce((acc, anuncio) => {
        acc[anuncio.categoria] = (acc[anuncio.categoria] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    res.json({
      success: true,
      data: {
        table: table || 'anuncios',
        records: paginatedData,
        stats,
        pagination: {
          limit: parseInt(limit as string),
          offset: start,
          hasMore: end < filteredData.length,
        }
      }
    });

  } catch (error) {
    console.error('Error en getDatabaseView:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Endpoint para obtener todos los datos en tiempo real
export const getAllDataRealtime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria, comunidad, format = 'json' } = req.query;

    let data = [...mockAnuncios];
    let filteredData = data;

    // Aplicar filtros
    if (comunidad && typeof comunidad === 'string') {
      const normalizeText = (value: string) =>
        value
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .trim();
      
      filteredData = filteredData.filter((a) => 
        normalizeText(a.comunidad_autonoma) === normalizeText(comunidad)
      );
    }

    if (categoria && typeof categoria === 'string') {
      filteredData = filteredData.filter((a) => a.categoria === categoria);
    }

    // Agrupar por categorías
    const dataByCategory = filteredData.reduce((acc, anuncio) => {
      if (!acc[anuncio.categoria]) {
        acc[anuncio.categoria] = [];
      }
      acc[anuncio.categoria].push(anuncio);
      return acc;
    }, {} as Record<string, typeof mockAnuncios>);

    // Agrupar por comunidades
    const dataByCommunity = filteredData.reduce((acc, anuncio) => {
      if (!acc[anuncio.comunidad_autonoma]) {
        acc[anuncio.comunidad_autonoma] = [];
      }
      acc[anuncio.comunidad_autonoma].push(anuncio);
      return acc;
    }, {} as Record<string, typeof mockAnuncios>);

    // Estadísticas en tiempo real
    const stats = {
      total: filteredData.length,
      categories: Object.keys(dataByCategory).length,
      communities: Object.keys(dataByCommunity).length,
      lastUpdated: new Date().toISOString(),
      byCategory: Object.fromEntries(
        Object.entries(dataByCategory).map(([cat, items]) => [cat, (items as any[]).length])
      ),
      byCommunity: Object.fromEntries(
        Object.entries(dataByCommunity).map(([com, items]) => [com, (items as any[]).length])
      ),
    };

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: format === 'categorized' ? {
        byCategory: dataByCategory,
        byCommunity: dataByCommunity,
        stats
      } : {
        all: filteredData,
        stats
      }
    };

    // Configurar headers para tiempo real
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.json(response);

  } catch (error) {
    console.error('Error en getAllDataRealtime:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo datos en tiempo real'
    });
  }
};

// Endpoint para ejecutar consultas SQL simuladas
export const executeQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;

    if (!query) {
      res.status(400).json({
        success: false,
        error: 'Se requiere una consulta SQL'
      });
      return;
    }

    // Simulación de consultas SQL básicas
    let result: any[] = [];
    let columns: string[] = [];

    const normalizedQuery = query.toLowerCase().trim();

    if (normalizedQuery.includes('select') && normalizedQuery.includes('from')) {
      if (normalizedQuery.includes('count(*)')) {
        // COUNT queries
        let count = mockAnuncios.length;
        
        if (normalizedQuery.includes('where')) {
          if (normalizedQuery.includes('comunidad_autonoma')) {
            const match = normalizedQuery.match(/comunidad_autonoma\s*=\s*['"]([^'"]+)['"]/);
            if (match) {
              const normalizeText = (value: string) =>
                value
                  .normalize('NFD')
                  .replace(/\p{Diacritic}/gu, '')
                  .toLowerCase()
                  .replace(/\s+/g, ' ')
                  .trim();
              
              count = mockAnuncios.filter(a => 
                normalizeText(a.comunidad_autonoma) === normalizeText(match[1])
              ).length;
            }
          }
          if (normalizedQuery.includes('categoria')) {
            const match = normalizedQuery.match(/categoria\s*=\s*['"]([^'"]+)['"]/);
            if (match) {
              count = mockAnuncios.filter(a => a.categoria === match[1]).length;
            }
          }
        }

        result = [{ count }];
        columns = ['count'];
      } else {
        // SELECT queries
        result = mockAnuncios;
        columns = Object.keys(mockAnuncios[0] || {});

        // Aplicar WHERE si existe
        if (normalizedQuery.includes('where')) {
          if (normalizedQuery.includes('comunidad_autonoma')) {
            const match = normalizedQuery.match(/comunidad_autonoma\s*=\s*['"]([^'"]+)['"]/);
            if (match) {
              const normalizeText = (value: string) =>
                value
                  .normalize('NFD')
                  .replace(/\p{Diacritic}/gu, '')
                  .toLowerCase()
                  .replace(/\s+/g, ' ')
                  .trim();
              
              result = result.filter(a => 
                normalizeText(a.comunidad_autonoma) === normalizeText(match[1])
              );
            }
          }
          if (normalizedQuery.includes('categoria')) {
            const match = normalizedQuery.match(/categoria\s*=\s*['"]([^'"]+)['"]/);
            if (match) {
              result = result.filter(a => a.categoria === match[1]);
            }
          }
        }

        // Aplicar LIMIT si existe
        const limitMatch = normalizedQuery.match(/limit\s+(\d+)/);
        if (limitMatch) {
          result = result.slice(0, parseInt(limitMatch[1]));
        }
      }
    } else {
      res.status(400).json({
        success: false,
        error: 'Solo se permiten consultas SELECT básicas'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        query,
        columns,
        rows: result,
        rowCount: result.length
      }
    });

  } catch (error) {
    console.error('Error en executeQuery:', error);
    res.status(500).json({
      success: false,
      error: 'Error ejecutando la consulta'
    });
  }
};
