import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Directorio de datos
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Archivos de datos
const usuariosFile = path.join(dataDir, 'usuarios.json');
const anunciosFile = path.join(dataDir, 'anuncios.json');

// Inicializar archivos si no existen
const initializeFiles = () => {
  if (!fs.existsSync(usuariosFile)) {
    fs.writeFileSync(usuariosFile, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(anunciosFile)) {
    fs.writeFileSync(anunciosFile, JSON.stringify([], null, 2));
  }
};

// Leer datos
const readUsuarios = (): any[] => {
  try {
    const data = fs.readFileSync(usuariosFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const readAnuncios = (): any[] => {
  try {
    console.log(`📂 Leyendo anuncios desde: ${anunciosFile}`);
    const data = fs.readFileSync(anunciosFile, 'utf8');
    const parsed = JSON.parse(data);
    console.log(`📊 Leídos ${parsed.length} anuncios del archivo`);
    return parsed;
  } catch (error) {
    console.error('❌ Error leyendo anuncios:', error);
    return [];
  }
};

// Escribir datos
const writeUsuarios = (usuarios: any[]) => {
  fs.writeFileSync(usuariosFile, JSON.stringify(usuarios, null, 2));
};

const writeAnuncios = (anuncios: any[]) => {
  fs.writeFileSync(anunciosFile, JSON.stringify(anuncios, null, 2));
};

// Inicializar
initializeFiles();

// Base de datos simulada
export const db = {
  // Usuarios
  async createUsuario(userData: any) {
    const usuarios = readUsuarios();
    const newUser = {
      id: uuidv4(),
      ...userData,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString()
    };
    usuarios.push(newUser);
    writeUsuarios(usuarios);
    return newUser;
  },

  async findUsuarioByEmail(email: string) {
    const usuarios = readUsuarios();
    return usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async findUsuarioById(id: string) {
    const usuarios = readUsuarios();
    return usuarios.find(u => u.id === id);
  },

  async updateUsuario(id: string, updates: any) {
    const usuarios = readUsuarios();
    const index = usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      usuarios[index] = { ...usuarios[index], ...updates, actualizado: new Date().toISOString() };
      writeUsuarios(usuarios);
      return usuarios[index];
    }
    return null;
  },

  // Anuncios
  async createAnuncio(anuncioData: any) {
    const anuncios = readAnuncios();
    const newAnuncio = {
      id: uuidv4(),
      ...anuncioData,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      vistas: 0,
      visible: true,
      estado_moderacion: 'approved'
    };
    anuncios.push(newAnuncio);
    writeAnuncios(anuncios);
    return newAnuncio;
  },

  async findAnuncios(filters: any = {}) {
    let anuncios = readAnuncios();
    
    // Filtrar anuncios visibles y aprobados
    anuncios = anuncios.filter(a => a.visible && a.estado_moderacion === 'approved');
    
    // Aplicar filtros
    if (filters.comunidad_autonoma) {
      anuncios = anuncios.filter(a => a.comunidad_autonoma === filters.comunidad_autonoma);
    }
    
    if (filters.categoria) {
      anuncios = anuncios.filter(a => a.categoria === filters.categoria);
    }
    
    if (filters.busqueda) {
      const busqueda = filters.busqueda.toLowerCase();
      anuncios = anuncios.filter(a => 
        a.titulo.toLowerCase().includes(busqueda) || 
        a.descripcion.toLowerCase().includes(busqueda)
      );
    }
    
    // Ordenamiento
    switch (filters.orden) {
      case 'fecha_desc':
        anuncios.sort((a, b) => new Date(b.creado).getTime() - new Date(a.creado).getTime());
        break;
      case 'fecha_asc':
        anuncios.sort((a, b) => new Date(a.creado).getTime() - new Date(b.creado).getTime());
        break;
      case 'precio_asc':
        anuncios.sort((a, b) => (a.precio || 0) - (b.precio || 0));
        break;
      case 'precio_desc':
        anuncios.sort((a, b) => (b.precio || 0) - (a.precio || 0));
        break;
      default:
        anuncios.sort((a, b) => new Date(b.creado).getTime() - new Date(a.creado).getTime());
    }
    
    // Paginación
    const pagina = parseInt(filters.pagina) || 1;
    const limite = parseInt(filters.limite) || 15;
    const offset = (pagina - 1) * limite;
    
    const paginatedAnuncios = anuncios.slice(offset, offset + limite);
    
    // Añadir información de usuario
    const usuarios = readUsuarios();
    const anunciosConUsuario = paginatedAnuncios.map(anuncio => {
      const usuario = usuarios.find(u => u.id === anuncio.usuario_id);
      return {
        ...anuncio,
        usuario_nombre: usuario?.nombre || 'Usuario',
        usuario_email: usuario?.email || null
      };
    });
    
    return {
      data: anunciosConUsuario,
      meta: {
        pagina,
        limite,
        total: anuncios.length,
        total_paginas: Math.ceil(anuncios.length / limite)
      }
    };
  },

  async findAnuncioById(id: string) {
    const anuncios = readAnuncios();
    const anuncio = anuncios.find(a => a.id === id && a.visible && a.estado_moderacion === 'approved');
    
    if (!anuncio) return null;
    
    // Incrementar vistas
    anuncio.vistas = (anuncio.vistas || 0) + 1;
    anuncio.actualizado = new Date().toISOString();
    writeAnuncios(anuncios);
    
    // Añadir información de usuario
    const usuarios = readUsuarios();
    const usuario = usuarios.find(u => u.id === anuncio.usuario_id);
    
    return {
      ...anuncio,
      usuario_nombre: usuario?.nombre || 'Usuario',
      usuario_email: usuario?.email || null,
      usuario_telefono: usuario?.telefono || null
    };
  },

  async findAnunciosByUsuarioId(usuarioId: string) {
    const anuncios = readAnuncios();
    return anuncios.filter(a => a.usuario_id === usuarioId && a.visible);
  },

  // Utilidades
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
};

console.log('✅ Base de datos JSON inicializada');
