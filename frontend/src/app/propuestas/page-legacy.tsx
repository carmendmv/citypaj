'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Propuesta {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  provincia: string;
  comunidad_autonoma: string;
  usuario_nombre: string;
  apoyos: number;
  comentarios: number;
  creado: string;
  estado: 'activa' | 'en_revision' | 'implementada';
}

const CATEGORIAS_PROPUESTAS = [
  'Empleo y Formación',
  'Vivienda',
  'Cultura y Ocio',
  'Transporte',
  'Medio Ambiente',
  'Salud y Bienestar',
  'Participación Ciudadana',
  'Deportes',
  'Tecnología',
  'Otros'
];

const PROPUESTAS_EJEMPLO = [
  {
    id: '1',
    titulo: 'Más cursos gratuitos de programación',
    descripcion: 'Implementar programas de formación en tecnologías digitales para jóvenes con bajos recursos.',
    categoria: 'Empleo y Formación',
    provincia: 'Madrid',
    comunidad_autonoma: 'Madrid',
    usuario_nombre: 'Ana García',
    apoyos: 45,
    comentarios: 12,
    creado: '2024-01-15',
    estado: 'activa' as const
  },
  {
    id: '2',
    titulo: 'Transporte nocturno los fines de semana',
    descripcion: 'Servicio de autobús nocturno durante los fines de semana para facilitar la movilidad juvenil.',
    categoria: 'Transporte',
    provincia: 'Valencia',
    comunidad_autonoma: 'Comunidad Valenciana',
    usuario_nombre: 'Carlos Ruiz',
    apoyos: 89,
    comentarios: 23,
    creado: '2024-01-10',
    estado: 'en_revision' as const
  },
  {
    id: '3',
    titulo: 'Espacios seguros de ocio joven',
    descripcion: 'Crear centros juveniles multifuncionales con actividades culturales, deportivas y formativas.',
    categoria: 'Cultura y Ocio',
    provincia: 'Sevilla',
    comunidad_autonoma: 'Andalucía',
    usuario_nombre: 'María López',
    apoyos: 67,
    comentarios: 18,
    creado: '2024-01-08',
    estado: 'activa' as const
  }
];

export default function PropuestasPage() {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    provincia: '',
    comunidad_autonoma: ''
  });

  useEffect(() => {
    // Por ahora, usamos datos de ejemplo hasta tener la base de datos
    setPropuestas(PROPUESTAS_EJEMPLO);
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar en la base de datos
    console.log('Nueva propuesta:', formData);
    setMostrarFormulario(false);
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: '',
      provincia: '',
      comunidad_autonoma: ''
    });
  };

  const propuestasFiltradas = categoriaFiltro
    ? propuestas.filter(p => p.categoria === categoriaFiltro)
    : propuestas;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-black mb-4">
            Propuestas Ciudadanas
          </h1>
          <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
            Participa activamente proponiendo mejoras para tu provincia. 
            Tu voz puede transformar tu comunidad.
          </p>
        </div>

        {/* Botón para crear propuesta */}
        <div className="text-center mb-8">
          <button
            onClick={() => setMostrarFormulario(true)}
            className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-semibold border-2 border-black hover:bg-orange-500 hover:border-orange-500 transition-colors"
          >
            Crear Nueva Propuesta
          </button>
        </div>

        {/* Formulario de nueva propuesta */}
        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white border border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <h2 className="font-serif text-2xl font-bold text-black mb-6">
                Crear Nueva Propuesta
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-sans text-sm font-medium text-black mb-2">
                    Título de la propuesta
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className="w-full px-4 py-2 border border-black focus:outline-none focus:border-orange-500"
                    placeholder="Ej: Más cursos gratuitos de programación"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-medium text-black mb-2">
                    Descripción detallada
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full px-4 py-2 border border-black focus:outline-none focus:border-orange-500"
                    placeholder="Describe tu propuesta en detalle..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-sm font-medium text-black mb-2">
                      Categoría
                    </label>
                    <select
                      required
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      className="w-full px-4 py-2 border border-black focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Selecciona una categoría</option>
                      {CATEGORIAS_PROPUESTAS.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-sans text-sm font-medium text-black mb-2">
                      Comunidad Autónoma
                    </label>
                    <select
                      required
                      value={formData.comunidad_autonoma}
                      onChange={(e) => setFormData({...formData, comunidad_autonoma: e.target.value})}
                      className="w-full px-4 py-2 border border-black focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Selecciona comunidad</option>
                      <option value="Andalucía">Andalucía</option>
                      <option value="Aragón">Aragón</option>
                      <option value="Asturias">Asturias</option>
                      <option value="Baleares">Baleares</option>
                      <option value="Canarias">Canarias</option>
                      <option value="Cantabria">Cantabria</option>
                      <option value="Castilla-La Mancha">Castilla-La Mancha</option>
                      <option value="Castilla y León">Castilla y León</option>
                      <option value="Cataluña">Cataluña</option>
                      <option value="Comunidad Valenciana">Comunidad Valenciana</option>
                      <option value="Extremadura">Extremadura</option>
                      <option value="Galicia">Galicia</option>
                      <option value="Madrid">Madrid</option>
                      <option value="Murcia">Murcia</option>
                      <option value="Navarra">Navarra</option>
                      <option value="País Vasco">País Vasco</option>
                      <option value="La Rioja">La Rioja</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-sm font-medium text-black mb-2">
                    Provincia
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.provincia}
                    onChange={(e) => setFormData({...formData, provincia: e.target.value})}
                    className="w-full px-4 py-2 border border-black focus:outline-none focus:border-orange-500"
                    placeholder="Ej: Madrid, Barcelona, Sevilla..."
                  />
                </div>

                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(false)}
                    className="px-6 py-2 border border-black text-black hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-black text-white border border-black hover:bg-orange-500 hover:border-orange-500 transition-colors"
                  >
                    Enviar Propuesta
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filtro por categoría */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setCategoriaFiltro('')}
              className={`px-4 py-2 border transition-colors ${
                categoriaFiltro === '' 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-300 text-gray-700 hover:border-black'
              }`}
            >
              Todas las categorías
            </button>
            {CATEGORIAS_PROPUESTAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-4 py-2 border transition-colors ${
                  categoriaFiltro === cat 
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-300 text-gray-700 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de propuestas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-black">Cargando propuestas...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600">{error}</div>
          </div>
        ) : propuestasFiltradas.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-6">
              <div className="w-16 h-16 mx-auto mb-4 border border-gray-300"></div>
            </div>
            <h2 className="font-serif text-2xl font-bold text-black mb-4">
              No hay propuestas en esta categoría
            </h2>
            <p className="font-sans text-gray-600 max-w-2xl mx-auto">
              Sé el primero en proponer una mejora para tu comunidad.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propuestasFiltradas.map((propuesta) => (
              <div key={propuesta.id} className="border border-black p-6 hover:border-orange-500 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 text-xs font-medium ${
                    propuesta.estado === 'activa' ? 'bg-green-100 text-green-800' :
                    propuesta.estado === 'en_revision' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {propuesta.estado === 'activa' ? 'Activa' :
                     propuesta.estado === 'en_revision' ? 'En revisión' :
                     'Implementada'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(propuesta.creado).toLocaleDateString('es-ES')}
                  </span>
                </div>
                
                <h3 className="font-serif text-xl font-bold text-black mb-3">
                  {propuesta.titulo}
                </h3>
                
                <p className="font-sans text-gray-600 mb-4 line-clamp-3">
                  {propuesta.descripcion}
                </p>
                
                <div className="text-sm text-gray-500 mb-4">
                  <div>{propuesta.provincia} - {propuesta.comunidad_autonoma}</div>
                  <div className="mt-1">{propuesta.categoria}</div>
                  <div className="mt-1">Por {propuesta.usuario_nombre}</div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-orange-500">
                      Apoyar ({propuesta.apoyos})
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-orange-500">
                      Comentar ({propuesta.comentarios})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
