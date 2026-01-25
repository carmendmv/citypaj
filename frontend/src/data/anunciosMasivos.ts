// Generador de +350 anuncios con descripciones humanas reales

interface Anuncio {
  id: string;
  titulo: string;
  descripcion: string;
  comunidad_autonoma: string;
  provincia: string;
  creado: string;
  usuario_nombre: string;
  usuario_id: string;
  categoria: 'ocio' | 'servicios' | 'educacion' | 'empleo' | 'intercambios' | 'noticias';
  modalidad: 'venta' | 'compra' | 'servicio' | 'intercambio';
  contacto_email: boolean;
  contacto_telefono: boolean;
  contacto_anonimo: boolean;
  visible: boolean;
  estado_moderacion: 'approved' | 'pending' | 'rejected';
  vistas: number;
  actualizado: string;
}

const comunidades = [
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias', 'Cantabria',
  'Castilla-La Mancha', 'Castilla y León', 'Cataluña', 'Comunidad Valenciana',
  'Extremadura', 'Galicia', 'Madrid', 'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
];

const provincias = [
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Murcia', 'Palma',
  'Las Palmas', 'Zaragoza', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón',
  'Hospitalet', 'La Coruña', 'Granada', 'Vitoria', 'Elche', 'Oviedo', 'Badalona',
  'Cartagena', 'Terrassa', 'Jerez de la Frontera', 'Sabadell', 'Móstoles', 'Santa Cruz',
  'Alcalá de Henares', 'Pamplona', 'Almería', 'Fuenlabrada', 'Leganes', 'San Sebastián',
  'Burgos', 'Albacete', 'Santander', 'Castellón', 'San Cristóbal', 'Alcorcón',
  'Logroño', 'Badajoz', 'Salamanca', 'Huelva', 'León', 'Lérida', 'Tarragona',
  'Cádiz', 'Zamora', 'Gerona', 'Ceuta', 'Melilla', 'Lugo', 'Cuenca', 'Toledo',
  'Pontevedra', 'Ávila', 'Ciudad Real', 'Teruel', 'Jaén', 'Orense', 'Huesca', 'Segovia',
  'Soria', 'Álava'
];

const nombres = [
  'Ana Martínez', 'Carlos Rodríguez', 'María López', 'Juan García', 'Laura Sánchez',
  'David Fernández', 'Carmen Pérez', 'José Martín', 'Sofía Gómez', 'Miguel Díaz',
  'Elena Ruiz', 'Antonio Jiménez', 'Isabel Moreno', 'Francisco Muñoz', 'Lucía Álvarez',
  'Javier Castro', 'Paula Ortega', 'Roberto Herrera', 'Natalia Gil', 'Adrián Torres',
  'Sara Vargas', 'Diego Mendoza', 'Claudia Ramos', 'Samuel Medina', 'Valentina Castro',
  'Iván Soto', 'Miriam Flores', 'Eric Reyes', 'Daniela Cruz', 'Oscar Aguilar',
  'Patricia Ríos', 'Raúl Campos', 'Beatriz Salas', 'Mario Vargas', 'Andrea Mora',
  'Gabriel Paredes', 'Verónica Luna', 'Fernando Espinoza', 'Luisa Cervantes', 'Ricardo Solano'
];

const titulosOcio = [
  'Grupo de senderismo los domingos por la mañana',
  'Busco compañeros para jugar al pádel',
  'Taller de fotografía urbana gratuito',
  'Club de lectura de ciencia ficción',
  'Grupo de running principiantes',
  'Torneo de cartas en el parque',
  'Sesiones de yoga al aire libre',
  'Cineclub independiente los sábados',
  'Grupo de música folk tradicional',
  'Excursiones a montaña mensuales',
  'Taller de cerámica para principiantes',
  'Círculo de poesía y escritura creativa',
  'Grupo de observación de aves',
  'Club de ajedrez para todos',
  'Taller de cocina vegetariana',
  'Grupo de teatro improvisación',
  'Sesiones de meditación guiada',
  'Club de debate y oratoria',
  'Taller de jardinería urbana',
  'Grupo de ciclismo recreativo'
];

const titulosServicios = [
  'Reparaciones de electrónica a domicilio',
  'Clases particulares de matemáticas',
  'Diseño de logos y páginas web',
  'Servicio de limpieza eficiente',
  'Traducciones inglés-español',
  'Instalación de aire acondicionado',
  'Clases de guitarra desde cero',
  'Servicio de jardinería profesional',
  'Diseño gráfico para negocios',
  'Clases de baile moderno',
  'Reparaciones de fontanería urgentes',
  'Servicio de mudanzas económicas',
  'Clases de inglés conversacional',
  'Instalación de cámaras de seguridad',
  'Servicio de cuidado de mascotas',
  'Clases particulares de química',
  'Diseño de interiores',
  'Servicio de pintura y decoración',
  'Clases de programación web',
  'Reparaciones de electrodomésticos'
];

const titulosEducacion = [
  'Curso intensivo de programación Python',
  'Taller de finanzas personales',
  'Clases de preparación para selectividad',
  'Curso de marketing digital',
  'Taller de habilidades sociales',
  'Curso de fotografía profesional',
  'Clases de preparación TOEFL',
  'Taller de emprendimiento',
  'Curso de diseño UX/UI',
  'Clases de preparación DELE',
  'Taller de gestión del tiempo',
  'Curso de análisis de datos',
  'Clases de redacción profesional',
  'Taller de liderazgo',
  'Curso de idiomas online',
  'Clases de preparación oposiciones',
  'Taller de oratoria pública',
  'Curso de contabilidad básica',
  'Clases de guitarra eléctrica',
  'Taller de cocina saludable'
];

const titulosEmpleo = [
  'Busco trabajo de camarero con experiencia',
  'Ofrezco servicios de marketing digital',
  'Busco empleo como administrativo',
  'Desarrollador web junior disponible',
  'Busco trabajo de cuidador/a',
  'Ofrezco clases particulares',
  'Busco empleo en hostelería',
  'Diseñador gráfico freelance',
  'Busco trabajo de repartidor',
  'Ofrezco servicios de limpieza',
  'Busco empleo en construcción',
  'Programador con experiencia',
  'Busco trabajo de dependiente',
  'Ofrezco servicios de traducción',
  'Busco empleo como jardinero',
  'Contable con experiencia',
  'Busco trabajo de cocinero',
  'Ofrezco servicios de fotografía',
  'Busco empleo en ventas',
  'Electricista certificado'
];

const titulosIntercambios = [
  'Vendo consola PlayStation 4 con juegos',
  'Busco piso en alquiler compartido',
  'Vendo bicicleta de montaña casi nueva',
  'Busco coche segunda mano económico',
  'Vendo smartphone iPhone 11',
  'Busco ordenador portátil para estudios',
  'Vendo guitarra acústica española',
  'Busco silla de oficina ergonómica',
  'Vendo sofá cama en buen estado',
  'Busco mesa de estudio grande',
  'Vendo cafetera Nespresso',
  'Busco impresora multifunción',
  'Vendo set de maletas de viaje',
  'Busco monitor gaming 27 pulgadas',
  'Vendo balanza de cocina digital',
  'Busco taladro eléctrico',
  'Vendo set de herramientas básicas',
  'Busco lámpara de escritorio LED',
  'Vendo estantería metálica',
  'Busco aspiradora sin cables'
];

const titulosNoticias = [
  'Nueva subvención para jóvenes emprendedores',
  'Inauguración del centro juvenil en el barrio',
  'Festival de música juvenil este fin de semana',
  'Programa de voluntariado internacional abierto',
  'Taller de habilidades digitales gratuito',
  'Concurso de ideas para proyectos juveniles',
  'Nueva ruta de senderismo señalizada',
  'Programa de becas para estudios universitarios',
  'Campaña de reciclaje en centros educativos',
  'Exposición de arte joven en la galería municipal',
  'Nuevo programa de deporte adaptado',
  'Encuentro de jóvenes emprendedores',
  'Taller de prevención de bullying',
  'Programa de mentoría profesional',
  'Concierto benéfico para ONG local',
  'Nuevo espacio de coworking juvenil',
  'Campaña de seguridad vial juvenil',
  'Programa de intercambio cultural',
  'Taller de emprendimiento social',
  'Nueva biblioteca digital juvenil',
];

const descripcionesHumanas = [
'Soy una persona apasionada por compartir mis conocimientos con otros. Me encanta ver cómo la gente aprende y crece.',
  'Llevo años dedicándome a esto con total profesionalidad. Garantizo resultados y un trato cercano con todos mis clientes.',
  'Me considero una persona muy organizada y responsable. Siempre cumplo con los plazos y me adapto a las necesidades.',
  'Disfruto mucho ayudando a los demás y resolviendo problemas. Para mí no hay nada mejor que ver a alguien satisfecho con mi trabajo.',
  'Soy muy creativo/a y me encanta innovar en todo lo que hago. Siempre busco nuevas formas de hacer las cosas más eficientes.',
  'Tengo mucha paciencia y empatía, especialmente cuando trabajo con personas. Entiendo que cada uno tiene su propio ritmo.',
  'Me caracterizo por ser muy puntual y detallista. Me gusta que todo quede perfecto y que no falte ningún detalle importante.',
  'Soy una persona muy sociable y me encanta conocer gente nueva. Creo que el intercambio de experiencias enriquece a todos.',
  'Tengo una gran capacidad de aprendizaje y me adapto rápidamente a nuevas tecnologías y metodologías de trabajo.',
  'Valoro mucho la honestidad y la transparencia en todas mis relaciones personales y profesionales.',
  'Soy muy proactivo/a y siempre busco soluciones innovadoras a los desafíos que se presentan en el día a día.',
  'Me apasiona el trabajo en equipo y creo firmemente que los mejores resultados se obtienen colaborando.',
  'Tengo una gran curiosidad por aprender cosas nuevas y siempre estoy buscando oportunidades para desarrollarme.',
  'Soy muy constante y perseverante. Cuando me propongo algo, no paro hasta conseguirlo con la máxima calidad.',
  'Me encanta compartir mis hobbies y pasiones con otras personas que tengan intereses similares.',
  'Soy muy flexible y me adapto fácilmente a los cambios y a nuevas situaciones sin perder la calma.',
  'Tengo una gran capacidad de organización y planificación. Siempre tengo todo bajo control.',
  'Valoro mucho el respeto y la consideración hacia los demás. Creo que es fundamental en cualquier relación.',
  'Soy muy práctico/a y eficiente. Busco siempre la forma más sencilla y efectiva de hacer las cosas.',
  'Me encanta enseñar y ver cómo los demás progresan. Es algo que me llena de satisfacción personal.'
]; 

function generarDescripcionAleatoria(categoria: string, titulo: string): string {
  const descripcionesAnuncios = {
    'ocio': [
      'Actividad ideal para disfrutar en tu tiempo libre. Perfecta para relajarte y conocer gente nueva.',
      'Experiencia única que te permitirá descubrir nuevas aficiones y desarrollar habilidades.',
      'Oportunidad perfecta para socializar y aprender algo nuevo en un ambiente amigable.',
      'Actividad recomendada para todas las edades. No se requiere experiencia previa.',
      'Una forma diferente de divertirte y expandir tus horizontes. ¡No te lo pierdas!'
    ],
    'servicios': [
      'Servicio profesional con garantía de calidad. Resultados visibles y duraderos.',
      'Solución eficiente y rápida para tus necesidades. Atención personalizada.',
      'Experiencia comprobada y excelentes valoraciones de clientes anteriores.',
      'Servicio adaptado a tus requerimientos específicos. Flexibilidad horaria.',
      'Calidad premium a precios competitivos. No encontrarás mejor oferta.'
    ],
    'educacion': [
      'Curso completo con material incluido. Aprendizaje práctico y aplicable inmediatamente.',
      'Formación certificada con reconocimiento oficial. Mejora tus oportunidades laborales.',
      'Método innovador de enseñanza con resultados garantizados. Clases dinámicas.',
      'Programa intensivo para acelerar tu aprendizaje. Domina la materia en tiempo récord.',
      'Inversión en tu futuro con retorno asegurado. Habilidades demandadas en el mercado.'
    ],
    'empleo': [
      'Posición excelente con oportunidades de crecimiento. Ambiente laboral colaborativo.',
      'Contrato estable y condiciones competitivas. Empresa en expansión.',
      'Oportunidad única para desarrollar tu carrera. Formación continua incluida.',
      'Trabajo desafiante y gratificante. Equipo talentoso y motivador.',
      'Salario por encima de la media y beneficios adicionales. Flexibilidad laboral.'
    ],
    'intercambios': [
      'Artículo en perfecto estado, como nuevo. Oportunidad única a precio reducido.',
      'Producto de alta calidad con garantía. Funcionamiento impecable.',
      'Ocasión especial que no se repetirá. Calidad superior a precio excepcional.',
      'Artículo muy bien cuidado y mantenido. Ideal para coleccionistas.',
      'Oferta limitada por tiempo. Calidad garantizada y envío inmediato.'
    ],
    'noticias': [
      'Información relevante y actualizada que te interesa. Fuente confiable y verificada.',
      'Noticia importante para nuestra comunidad. Impacto directo en tu día a día.',
      'Evento destacado que no puedes perderte. Participación abierta a todos.',
      'Novedad que marca un antes y un después. Cambios positivos en camino.',
      'Información exclusiva y de primera mano. Anticípate al resto.'
    ]
  };
  
  const base = descripcionesAnuncios[categoria as keyof typeof descripcionesAnuncios][Math.floor(Math.random() * descripcionesAnuncios[categoria as keyof typeof descripcionesAnuncios].length)];
    
  const detallesCategoria = {
    'ocio': [
      'Nos juntamos regularmente para compartir esta afición. Todos son bienvenidos, no importa tu nivel de experiencia.',
      'Es una actividad muy relajante y divertida. Ideal para desconectar del estrés diario y conocer gente nueva.',
      'Tenemos un grupo muy variado y amigable. Siempre estamos abiertos a recibir nuevos miembros con ideas frescas.',
      'Es una forma genial de mantenerse activo y socializar. Además, aprendemos mucho unos de otros.',
      'Hacemos esto desde hace tiempo y hemos creado una comunidad muy unida. ¡Te esperamos con los brazos abiertos!'
    ],
    'servicios': [
      'Ofrezco un servicio profesional y de alta calidad. Tengo experiencia demostrable y referencias si las necesitas.',
      'Trabajo con total dedicación y atención al detalle. Tu satisfacción es mi máxima prioridad.',
      'Mis precios son muy competitivos y la calidad está garantizada. No dudes en contactarme para presupuestos.',
      'Me adapto a las necesidades específicas de cada cliente. Ofrezco soluciones personalizadas.',
      'Tengo todas las herramientas y conocimientos necesarios para realizar un trabajo impecable.'
    ],
    'educacion': [
      'Mi metodología se basa en la práctica constante y la adaptación a cada estudiante. Los resultados son excelentes.',
      'Ofrezco material didáctico propio y seguimiento personalizado. Aprenderás de forma efectiva y amena.',
      'Tengo experiencia con estudiantes de todos los niveles y edades. Sé cómo motivar y hacer que aprendas.',
      'Las clases son muy dinámicas e interactivas. No te aburrirás y verás tu progreso rápidamente.',
      'Preparo a mis estudiantes para superar cualquier desafío académico. Mis tasas de éxito son muy altas.'
    ],
    'empleo': [
      'Busco un puesto donde pueda aportar mi experiencia y seguir aprendiendo. Soy muy comprometido/a y responsable.',
      'Tengo formación específica en el área y experiencia demostrable. Estoy disponible para empezar inmediatamente.',
      'Me adapto perfectamente a entornos dinámicos y exigentes. Soy muy proactivo/a y trabajador/a.',
      'Busco oportunidades de crecimiento profesional donde pueda desarrollar todo mi potencial.',
      'Tengo excelentes referencias y una sólida trayectoria. Estoy convencido/a de que puedo aportar mucho valor.'
    ],
    'intercambios': [
      'El artículo está en perfecto estado y lo he cuidado mucho. Lo vendo porque ya no lo uso y quiero que le sirva a alguien.',
      'Es una oportunidad excelente para conseguir algo de calidad a un precio muy razonable. No te arrepentirás.',
      'Tengo todo el documentación y garantías si las necesitas. Es una compra totalmente segura y confiable.',
      'Es algo que realmente merece la pena. Lo he usado muy poco y está como nuevo. Ideal para quien busca calidad.',
      'Hago un precio especial porque quiero venderlo pronto. Es una ocasión única que no debes dejar pasar.'
    ],
    'noticias': [
      'Te mantendré informado/a sobre todas las novedades y eventos importantes de nuestra comunidad.',
      'Comparto información relevante y actualizada que puede interesarte. ¡No te pierdas nada!',
      'Me dedico a recopilar y difundir noticias útiles para los jóvenes de nuestra zona.',
      'Es importante estar al día de lo que pasa. Aquí encontrarás toda la información actualizada.',
      'Trabajo para mantener a nuestra comunidad informada y conectada con lo que más le importa.'
    ]
  };
  
  const detalles = detallesCategoria[categoria as keyof typeof detallesCategoria];
  const detalle = detalles[Math.floor(Math.random() * detalles.length)];
  
  return `${base} Para más información o contactar, no dudes en escribirnos. ¡Te esperamos!`;
}

function generarAnunciosMasivos(comunidad: string = 'Madrid'): Anuncio[] {
  const anuncios: Anuncio[] = [];
  let id = 1;
  
  // Generar anuncios por categoría (ahora aleatorio)
  const categorias = [
    { key: 'ocio', titulos: titulosOcio, modalidades: ['servicio'] },
    { key: 'servicios', titulos: titulosServicios, modalidades: ['servicio'] },
    { key: 'educacion', titulos: titulosEducacion, modalidades: ['servicio'] },
    { key: 'empleo', titulos: titulosEmpleo, modalidades: ['servicio'] },
    { key: 'intercambios', titulos: titulosIntercambios, modalidades: ['venta', 'compra', 'intercambio'] },
    { key: 'noticias', titulos: titulosNoticias, modalidades: ['servicio'] }
  ];
  
  // Generar 420 anuncios (70 por cada 6 categorías)
  for (let i = 0; i < 420; i++) {
    const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
    const titulo = categoriaAleatoria.titulos[Math.floor(Math.random() * categoriaAleatoria.titulos.length)];
    const modalidad = categoriaAleatoria.modalidades[Math.floor(Math.random() * categoriaAleatoria.modalidades.length)];
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const provincia = provincias[Math.floor(Math.random() * provincias.length)];
    const diasAtras = Math.floor(Math.random() * 30) + 1;
    const vistas = Math.floor(Math.random() * 500) + 10;
    
    anuncios.push({
      id: `demo-${id++}`,
      titulo,
      descripcion: generarDescripcionAleatoria(categoriaAleatoria.key, titulo),
      comunidad_autonoma: comunidad,
      provincia,
      creado: new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000).toISOString(),
      usuario_nombre: nombre,
      usuario_id: `user-${id}`,
      categoria: categoriaAleatoria.key as any,
      modalidad: modalidad as any,
      contacto_email: true,
      contacto_telefono: Math.random() > 0.5,
      contacto_anonimo: Math.random() > 0.7,
      visible: true,
      estado_moderacion: 'approved',
      vistas,
      actualizado: new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  return anuncios;
}

export { generarAnunciosMasivos };
export type { Anuncio };