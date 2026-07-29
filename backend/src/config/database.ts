import mysql from 'mysql2/promise';
import { config } from './index';

// Configuración de la conexión a MySQL/MariaDB
const dbConfig = {
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: config.database.pool.max,
  queueLimit: 0,
};

// Crear el pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a MariaDB:', error);
    return false;
  }
};

// Función para ejecutar consultas
export const executeQuery = async (query: string, params?: any[]): Promise<any> => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Error ejecutando consulta:', error);
    throw error;
  }
};

// Función para obtener un solo registro
export const findOne = async (table: string, where: object): Promise<any> => {
  const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
  const values = Object.values(where);
  const query = `SELECT * FROM ${table} WHERE ${whereClause} LIMIT 1`;
  
  const results = await executeQuery(query, values);
  return results[0] || null;
};

// Función para obtener múltiples registros
export const findMany = async (table: string, where: object = {}, options: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
} = {}): Promise<any[]> => {
  let query = `SELECT * FROM ${table}`;
  const values: any[] = [];

  if (Object.keys(where).length > 0) {
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    query += ` WHERE ${whereClause}`;
    values.push(...Object.values(where));
  }

  if (options.orderBy) {
    query += ` ORDER BY ${options.orderBy} ${options.orderDirection || 'ASC'}`;
  }

  if (options.limit) {
    query += ` LIMIT ?`;
    values.push(options.limit);
  }

  if (options.offset) {
    query += ` OFFSET ?`;
    values.push(options.offset);
  }

  return await executeQuery(query, values);
};

// Función para contar registros
export const count = async (table: string, where: object = {}): Promise<number> => {
  let query = `SELECT COUNT(*) as count FROM ${table}`;
  const values: any[] = [];

  if (Object.keys(where).length > 0) {
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    query += ` WHERE ${whereClause}`;
    values.push(...Object.values(where));
  }

  const result = await executeQuery(query, values);
  return result[0]?.count || 0;
};

// Función para insertar registros
export const insert = async (table: string, data: object): Promise<any> => {
  const fields = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);
  
  const query = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;
  const result = await executeQuery(query, values);
  return result;
};

// Función para actualizar registros
export const update = async (table: string, data: object, where: object): Promise<any> => {
  const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
  const values = [...Object.values(data), ...Object.values(where)];
  
  const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  const result = await executeQuery(query, values);
  return result;
};

// Función para eliminar registros
export const remove = async (table: string, where: object): Promise<any> => {
  const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
  const values = Object.values(where);
  
  const query = `DELETE FROM ${table} WHERE ${whereClause}`;
  const result = await executeQuery(query, values);
  return result;
};

// Exportar el pool para uso directo si es necesario
export { pool };

// Exportar configuración para referencia
export { dbConfig };
