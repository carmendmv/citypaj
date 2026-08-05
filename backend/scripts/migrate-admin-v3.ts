import { pool } from '../src/config/database';

const migrationQueries = [
  // 1. Estado de mensajes internos: borrador, enviado, archivado, eliminado
  `ALTER TABLE mensajes_staff
    ADD COLUMN IF NOT EXISTS estado ENUM('borrador','enviado','archivado','eliminado') NOT NULL DEFAULT 'enviado'`,

  // 2. Mensajes pueden tener entidades de CityPAJ adjuntas (no solo archivos)
  `CREATE TABLE IF NOT EXISTS mensajes_entidades_adjuntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensaje_id INT NOT NULL,
    entidad_tipo VARCHAR(50) NOT NULL,
    entidad_id VARCHAR(36) NOT NULL,
    titulo VARCHAR(255) NULL,
    INDEX idx_mensaje (mensaje_id),
    INDEX idx_entidad (entidad_tipo, entidad_id),
    CONSTRAINT fk_mensaje_entidad_mensaje FOREIGN KEY (mensaje_id) REFERENCES mensajes_staff(id) ON DELETE NO ACTION
  )`,

  // 3. Sugerencias: marcado de trasladado
  `ALTER TABLE sugerencias
    ADD COLUMN IF NOT EXISTS trasladada TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS trasladada_at TIMESTAMP NULL,
    ADD COLUMN IF NOT EXISTS trasladada_por VARCHAR(36) NULL`,

  // 4. Propuestas: marcado de trasladado
  `ALTER TABLE propuestas
    ADD COLUMN IF NOT EXISTS trasladada TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS trasladada_at TIMESTAMP NULL,
    ADD COLUMN IF NOT EXISTS trasladada_por VARCHAR(36) NULL`,

  // 5. Agenda institucional de contactos oficiales
  `CREATE TABLE IF NOT EXISTS contactos_institucionales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institucion VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    area_departamento VARCHAR(150) NULL,
    provincia VARCHAR(100) NULL,
    comunidad_autonoma VARCHAR(100) NULL,
    email_oficial VARCHAR(255) NULL,
    telefono VARCHAR(50) NULL,
    web VARCHAR(500) NULL,
    persona_contacto VARCHAR(255) NULL,
    estado ENUM('pendiente','verificado','inactivo') NOT NULL DEFAULT 'pendiente',
    verificado TINYINT(1) NOT NULL DEFAULT 0,
    verificado_at TIMESTAMP NULL,
    verificado_por VARCHAR(36) NULL,
    notas_internas TEXT NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creado_por VARCHAR(36) NULL,
    INDEX idx_provincia (provincia),
    INDEX idx_tipo (tipo),
    INDEX idx_estado (estado),
    INDEX idx_verificado (verificado),
    INDEX idx_institucion (institucion)
  )`,

  // 6. Plantillas de comunicación oficial
  `CREATE TABLE IF NOT EXISTS plantillas_comunicacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    cuerpo TEXT NOT NULL,
    descripcion VARCHAR(500) NULL,
    tipo VARCHAR(100) NOT NULL DEFAULT 'institucional',
    activa TINYINT(1) NOT NULL DEFAULT 1,
    eliminada TINYINT(1) NOT NULL DEFAULT 0,
    variables TEXT NULL,
    provincia VARCHAR(100) NULL,
    comunidad_autonoma VARCHAR(100) NULL,
    institucion VARCHAR(255) NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creado_por VARCHAR(36) NULL,
    INDEX idx_tipo (tipo),
    INDEX idx_activa (activa),
    INDEX idx_eliminada (eliminada)
  )`,

  // 7. Comunicaciones institucionales (enviadas/borradores)
  `CREATE TABLE IF NOT EXISTS comunicaciones_institucionales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plantilla_id INT NULL,
    contacto_id INT NULL,
    remitente_id VARCHAR(36) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    cuerpo TEXT NOT NULL,
    estado ENUM('borrador','preparado','enviado','leido','archivado') NOT NULL DEFAULT 'borrador',
    modo_envio ENUM('manual','smtp') NULL,
    enviado_at TIMESTAMP NULL,
    enviado_por VARCHAR(36) NULL,
    provincia VARCHAR(100) NULL,
    comunidad_autonoma VARCHAR(100) NULL,
    institucion VARCHAR(255) NULL,
    area VARCHAR(150) NULL,
    email_destino VARCHAR(255) NULL,
    notas_internas TEXT NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_estado (estado),
    INDEX idx_contacto (contacto_id),
    INDEX idx_remitente (remitente_id),
    INDEX idx_provincia (provincia)
  )`,

  // 8. Adjuntos de archivos de comunicaciones institucionales
  `CREATE TABLE IF NOT EXISTS comunicaciones_adjuntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comunicacion_id INT NOT NULL,
    nombre_original VARCHAR(255) NOT NULL,
    nombre_guardado VARCHAR(255) NOT NULL,
    tipo_mime VARCHAR(100) NOT NULL,
    tamano INT NOT NULL,
    ruta_storage VARCHAR(500) NOT NULL,
    subido_por VARCHAR(36) NOT NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_comunicacion (comunicacion_id),
    CONSTRAINT fk_com_adj_com FOREIGN KEY (comunicacion_id) REFERENCES comunicaciones_institucionales(id) ON DELETE NO ACTION
  )`,

  // 9. Entidades de CityPAJ vinculadas a comunicaciones institucionales
  `CREATE TABLE IF NOT EXISTS comunicaciones_entidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comunicacion_id INT NOT NULL,
    entidad_tipo VARCHAR(50) NOT NULL,
    entidad_id VARCHAR(36) NOT NULL,
    titulo VARCHAR(255) NULL,
    INDEX idx_comunicacion (comunicacion_id),
    INDEX idx_entidad (entidad_tipo, entidad_id),
    CONSTRAINT fk_com_entidad_com FOREIGN KEY (comunicacion_id) REFERENCES comunicaciones_institucionales(id) ON DELETE NO ACTION
  )`,

  // 10. Tareas de seguimiento del admin
  `CREATE TABLE IF NOT EXISTS admin_tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NULL,
    estado ENUM('pendiente','en_progreso','completada','cancelada') NOT NULL DEFAULT 'pendiente',
    prioridad ENUM('baja','media','alta','critica') NOT NULL DEFAULT 'media',
    asignado_a VARCHAR(36) NULL,
    creado_por VARCHAR(36) NOT NULL,
    entidad_tipo VARCHAR(50) NULL,
    entidad_id VARCHAR(36) NULL,
    vencimiento DATE NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_estado (estado),
    INDEX idx_asignado (asignado_a),
    INDEX idx_creado_por (creado_por),
    INDEX idx_entidad (entidad_tipo, entidad_id)
  )`,
];

const run = async () => {
  console.log('Iniciando migración admin v3...');
  for (const query of migrationQueries) {
    try {
      await pool.execute(query);
      console.log('OK:', query.substring(0, 60) + '...');
    } catch (err: any) {
      console.error('Error en migración:', query, err.message);
      throw err;
    }
  }
  console.log('Migración v3 finalizada.');
  process.exit(0);
};

run();
