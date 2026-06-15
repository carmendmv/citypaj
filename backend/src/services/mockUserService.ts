import { v4 as uuidv4 } from 'uuid';
import { Usuario } from './mockDataService';

// Datos mock de usuarios realistas
const generateMockUsers = (): Usuario[] => {
  const users: Usuario[] = [
    {
      id: 'user-001',
      nombre: 'Ana García López',
      email: 'ana.garcia@example.com',
      password_hash: '$2b$10$hashedpassword1',
      fecha_registro: '2024-01-15T10:30:00Z',
      comunidad_autonoma: 'Madrid',
      provincia: 'Madrid',
      localidad: 'Madrid',
      rol: 'usuario',
      activo: true
    },
    {
      id: 'user-002',
      nombre: 'Carlos Ruiz Martínez',
      email: 'carlos.ruiz@example.com',
      password_hash: '$2b$10$hashedpassword2',
      fecha_registro: '2024-02-20T14:15:00Z',
      comunidad_autonoma: 'Cataluña',
      provincia: 'Barcelona',
      localidad: 'Barcelona',
      rol: 'usuario',
      activo: true
    },
    {
      id: 'user-003',
      nombre: 'María López Sánchez',
      email: 'maria.lopez@example.com',
      password_hash: '$2b$10$hashedpassword3',
      fecha_registro: '2024-03-10T09:45:00Z',
      comunidad_autonoma: 'Andalucía',
      provincia: 'Sevilla',
      localidad: 'Sevilla',
      rol: 'usuario',
      activo: true
    },
    {
      id: 'admin-001',
      nombre: 'Administrador CityPAJ',
      email: 'admin@citypaj.es',
      password_hash: '$2b$10$adminhashedpassword',
      fecha_registro: '2023-12-01T00:00:00Z',
      comunidad_autonoma: null,
      provincia: null,
      localidad: null,
      rol: 'admin',
      activo: true
    }
  ];

  // Generar usuarios adicionales aleatorios
  const nombres = ['Juan', 'Laura', 'Pedro', 'Sofía', 'Miguel', 'Elena', 'David', 'Carmen', 'José', 'Isabel'];
  const apellidos = ['Pérez', 'Gómez', 'González', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Ramírez', 'Torres'];
  
  for (let i = 4; i <= 50; i++) {
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido1 = apellidos[Math.floor(Math.random() * apellidos.length)];
    const apellido2 = apellidos[Math.floor(Math.random() * apellidos.length)];
    
    users.push({
      id: `user-${String(i).padStart(3, '0')}`,
      nombre: `${nombre} ${apellido1} ${apellido2}`,
      email: `${nombre}.${apellido1}${i}@example.com`,
      password_hash: `$2b$10$hashedpassword${i}`,
      fecha_registro: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      comunidad_autonoma: Math.random() > 0.3 ? ['Madrid', 'Cataluña', 'Andalucía', 'Comunidad Valenciana', 'País Vasco'][Math.floor(Math.random() * 5)] : null,
      provincia: Math.random() > 0.3 ? ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao'][Math.floor(Math.random() * 5)] : null,
      localidad: Math.random() > 0.3 ? ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao'][Math.floor(Math.random() * 5)] : null,
      rol: Math.random() > 0.95 ? 'admin' : 'usuario',
      activo: Math.random() > 0.05 // 95% de usuarios activos
    });
  }

  return users;
};

// Cache de usuarios mock
let mockUsersCache: Usuario[] | null = null;

// Servicio centralizado de usuarios mock
export class MockUserService {
  static getUsers(): Usuario[] {
    if (!mockUsersCache) {
      mockUsersCache = generateMockUsers();
      console.log(`🔄 Generated ${mockUsersCache.length} mock users`);
    }
    return mockUsersCache;
  }

  static getUserById(id: string): Usuario | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  static getUserByEmail(email: string): Usuario | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  }

  static authenticateUser(email: string, _password: string): Usuario | null {
    const user = this.getUserByEmail(email);
    if (!user || !user.activo) {
      return null;
    }
    
    // En un caso real, verificaríamos el hash del password
    // Para mock, asumimos que cualquier password funciona para usuarios existentes
    return user;
  }

  static createUser(userData: Partial<Usuario>): Usuario {
    const users = this.getUsers();
    const newUser: Usuario = {
      id: uuidv4(),
      nombre: userData.nombre || '',
      email: userData.email || '',
      password_hash: '$2b$10$newuserhashedpassword', // En caso real, hashear el password
      fecha_registro: new Date().toISOString(),
      comunidad_autonoma: userData.comunidad_autonoma || null,
      provincia: userData.provincia || null,
      localidad: userData.localidad || null,
      rol: 'usuario',
      activo: true
    };

    users.push(newUser);
    return newUser;
  }

  static updateUser(id: string, updates: Partial<Usuario>): Usuario | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...updates
    };

    return users[index];
  }

  static deactivateUser(id: string): boolean {
    const user = this.getUserById(id);
    if (!user) return false;

    user.activo = false;
    return true;
  }

  static getStats() {
    const users = this.getUsers();
    const stats = {
      total: users.length,
      activos: users.filter(u => u.activo).length,
      inactivos: users.filter(u => !u.activo).length,
      administradores: users.filter(u => u.rol === 'admin').length,
      usuarios: users.filter(u => u.rol === 'usuario').length,
      porComunidad: {} as { [key: string]: number }
    };

    users.forEach(user => {
      if (user.comunidad_autonoma) {
        stats.porComunidad[user.comunidad_autonoma] = (stats.porComunidad[user.comunidad_autonoma] || 0) + 1;
      }
    });

    return stats;
  }
}

export default MockUserService;
