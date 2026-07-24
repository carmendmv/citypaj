'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Printer } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Pagination from '@/components/ui/Pagination';

interface Estadisticas {
  total: number;
  porCategoria: Array<{ categoria: string; count: number }>;
  porPrioridad: Array<{ prioridad: string; count: number }>;
  porEstado: Array<{ estado: string; count: number }>;
  recientes: Array<{
    id: number;
    titulo: string;
    categoria: string;
    prioridad: string;
    fecha: string;
    estado: string;
  }>;
}

interface Sugerencia {
  id: number;
  nombre: string | null;
  email: string | null;
  edad: string | null;
  categoria: string;
  prioridad: string;
  titulo: string;
  descripcion: string;
  solicitud_ayuntamiento: string | null;
  anonimo: number;
  comunidad_autonoma: string;
  fecha: string;
  estado: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const COLORS = {
  educacion: '#3B82F6',
  empleo: '#10B981',
  ocio: '#F59E0B',
  deportes: '#EF4444',
  salud: '#8B5CF6',
  vivienda: '#EC4899',
  transporte: '#14B8A6',
  tecnologia: '#6366F1',
  medioambiente: '#84CC16',
  participacion: '#F97316',
  inclusion: '#06B6D4',
  otros: '#6B7280'
};

const PRIORIDAD_COLORS: Record<string, string> = {
  baja: '#10B981',
  media: '#F59E0B',
  alta: '#EF4444',
  critica: '#991B1B'
};

const PRIORIDAD_CLASSES: Record<string, string> = {
  baja: 'bg-green-100 text-green-800',
  media: 'bg-yellow-200 text-yellow-900',
  alta: 'bg-orange-200 text-orange-900',
  critica: 'bg-red-700 text-white'
};

const ESTADO_CLASSES: Record<string, string> = {
  resuelta: 'bg-green-100 text-green-800',
  en_progreso: 'bg-blue-100 text-blue-800',
  revisada: 'bg-purple-100 text-purple-800',
  rechazada: 'bg-red-100 text-red-800',
  pendiente: 'bg-yellow-100 text-yellow-800'
};

const STORAGE_NOTES_KEY = 'citypaj_admin_notes';

export default function AdminSugerencias() {
  const { user } = useAuth();
  const router = useRouter();

  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comunidadSeleccionada, setComunidadSeleccionada] = useState('Todas');
  const [notas, setNotas] = useState<Record<number, string>>({});

  const comunidades = [
    'Todas', 'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
    'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña',
    'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid',
    'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
  ];

  // Proteger panel: redirigir al login exclusivo de moderadores
  useEffect(() => {
    if (user === null) {
      router.push('/moderador/login');
    }
  }, [user, router]);

  // Cargar notas locales del moderador
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_NOTES_KEY);
      if (raw) setNotas(JSON.parse(raw));
    } catch {
      // ignorar errores de localStorage
    }
  }, []);

  const guardarNotas = (nuevas: Record<number, string>) => {
    setNotas(nuevas);
    try {
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(nuevas));
    } catch {
      // ignorar
    }
  };

  const actualizarNota = (id: number, valor: string) => {
    guardarNotas({ ...notas, [id]: valor });
  };

  const fetchEstadisticas = async () => {
    try {
      const params = comunidadSeleccionada !== 'Todas' ? `?comunidad_autonoma=${encodeURIComponent(comunidadSeleccionada)}` : '';
      const response = await fetch(`/api/sugerencias/estadisticas${params}`);
      const json = await response.json();
      setEstadisticas(json.data || null);
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
    }
  };

  const fetchSugerencias = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: pageNum.toString(), limit: '10' });
      if (comunidadSeleccionada !== 'Todas') params.set('comunidad_autonoma', comunidadSeleccionada);
      const response = await fetch(`/api/sugerencias?${params.toString()}`);
      const json = await response.json();
      if (json.success) {
        setSugerencias(json.data || []);
        setMeta(json.meta || null);
      } else {
        setError(json.error || 'Error cargando sugerencias');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchEstadisticas();
    fetchSugerencias(page);
  }, [comunidadSeleccionada, page, user]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const moderadorInfo = user ? `${user.nombre} (ID: ${user.id})` : 'No identificado';

  if (user === null) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Redirigiendo al acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado visible solo en impresión/PDF */}
        <div className="hidden print:block mb-8 border-b border-black pb-4">
          <h1 className="text-2xl font-bold text-black">Informe de Sugerencias Juveniles - CityPAJ</h1>
          <p className="text-sm text-gray-700 mt-1">Moderador/a: {moderadorInfo}</p>
          <p className="text-sm text-gray-700">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
        </div>

        {/* Header de la interfaz */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Sugerencias Juveniles</h1>
            <p className="text-gray-600 mt-2">Análisis de necesidades y demandas de la juventud</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Moderador/a:</span> {moderadorInfo}
            </div>

            <select
              value={comunidadSeleccionada}
              onChange={(e) => { setComunidadSeleccionada(e.target.value); setPage(1); }}
              className="px-4 py-2 border border-black bg-white focus:outline-none"
            >
              {comunidades.map(comunidad => (
                <option key={comunidad} value={comunidad}>{comunidad}</option>
              ))}
            </select>

            <Link
              href="/moderador"
              className="px-4 py-2 bg-white text-black border border-black hover:bg-gray-100 transition-colors"
            >
              Panel de moderación
            </Link>

            <button
              onClick={() => { fetchEstadisticas(); fetchSugerencias(1); }}
              className="px-4 py-2 bg-black text-white border border-black hover:bg-orange-500 hover:border-orange-500 transition-colors"
            >
              Actualizar
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black border border-black hover:bg-gray-100 transition-colors"
              title="Exportar a PDF / Imprimir"
            >
              <Printer className="w-4 h-4" />
              Exportar PDF
            </button>
          </div>
        </div>

        {loading && !estadisticas ? (
          <div className="text-center py-12 print:hidden">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Cargando datos reales...</p>
          </div>
        ) : error ? (
          <div className="bg-white border border-black p-6 text-center print:hidden">
            <p className="text-red-600">{error}</p>
          </div>
        ) : estadisticas && (
          <>
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 print:hidden">
              <div className="bg-white border border-black p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total de Sugerencias</h3>
                <p className="text-3xl font-bold text-black">{estadisticas.total}</p>
              </div>

              <div className="bg-white border border-black p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Prioridad Alta/Crítica</h3>
                <p className="text-3xl font-bold text-red-600">
                  {estadisticas.porPrioridad
                    ? estadisticas.porPrioridad
                        .filter(p => p.prioridad === 'alta' || p.prioridad === 'critica')
                        .reduce((sum, p) => sum + p.count, 0)
                    : 0}
                </p>
              </div>

              <div className="bg-white border border-black p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Pendientes</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {estadisticas.porEstado
                    ? estadisticas.porEstado.find(e => e.estado === 'pendiente')?.count || 0
                    : 0}
                </p>
              </div>

              <div className="bg-white border border-black p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">En Progreso</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {estadisticas.porEstado
                    ? estadisticas.porEstado.find(e => e.estado === 'en_progreso')?.count || 0
                    : 0}
                </p>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print:hidden">
              <div className="bg-white border border-black p-6">
                <h3 className="text-lg font-semibold text-black mb-4">Sugerencias por Categoría</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estadisticas.porCategoria || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-black p-6">
                <h3 className="text-lg font-semibold text-black mb-4">Distribución por Prioridad</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={estadisticas.porPrioridad || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) => `${props.prioridad}: ${props.count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {(estadisticas.porPrioridad || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRIORIDAD_COLORS[entry.prioridad] || '#6B7280'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tabla paginada con notas del moderador */}
            <div className="bg-white border border-black">
              <div className="p-6 border-b border-black flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
                <h3 className="text-lg font-semibold text-black">Listado de Sugerencias</h3>
                {meta && (
                  <p className="text-sm text-gray-600">
                    {meta.total} resultados · Página {meta.page} de {meta.totalPages}
                  </p>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:hidden">Notas del moderador</th>
                      <th className="hidden print:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sugerencias.map((sugerencia) => (
                      <tr key={sugerencia.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900">{sugerencia.titulo}</div>
                          <div className="text-xs text-gray-500 mt-1 max-w-md">{sugerencia.descripcion}</div>
                          <div className="text-xs text-gray-400 mt-1 print:text-black">
                            {sugerencia.anonimo ? 'Anónimo' : `${sugerencia.nombre || 'Sin nombre'} · ${sugerencia.email || 'sin email'}`} · {sugerencia.comunidad_autonoma}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{ backgroundColor: (COLORS[sugerencia.categoria as keyof typeof COLORS] || '#6B7280') + '20', color: COLORS[sugerencia.categoria as keyof typeof COLORS] || '#6B7280' }}
                          >
                            {sugerencia.categoria}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${PRIORIDAD_CLASSES[sugerencia.prioridad] || 'bg-gray-100 text-gray-800'}`}>
                            {sugerencia.prioridad}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${ESTADO_CLASSES[sugerencia.estado] || 'bg-gray-100 text-gray-800'}`}>
                            {sugerencia.estado}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(sugerencia.fecha).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-4 py-4 print:hidden">
                          <textarea
                            value={notas[sugerencia.id] || ''}
                            onChange={(e) => actualizarNota(sugerencia.id, e.target.value)}
                            placeholder="Añadir nota..."
                            className="w-40 sm:w-56 px-2 py-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none"
                            rows={2}
                          />
                        </td>
                        <td className="hidden print:table-cell px-4 py-4 text-sm text-gray-700 align-top">
                          {notas[sugerencia.id] || 'Sin notas'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {meta && meta.totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={meta.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>

            {/* Insights automáticos */}
            <div className="mt-8 bg-white border border-black p-6 print:hidden">
              <h3 className="text-lg font-semibold text-black mb-4">📊 Insights Automáticos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">⚠️ Prioridades Críticas</h4>
                  <p className="text-sm text-red-700">
                    {estadisticas.porPrioridad
                      ? estadisticas.porPrioridad.find(p => p.prioridad === 'critica')?.count || 0
                      : 0} sugerencias requieren atención urgente.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">🎯 Categoría más Demandada</h4>
                  <p className="text-sm text-blue-700">
                    {estadisticas.porCategoria && estadisticas.porCategoria.length > 0
                      ? estadisticas.porCategoria.reduce((max, curr) => curr.count > max.count ? curr : max).categoria
                      : 'N/A'}
                    {' '}con {estadisticas.porCategoria && estadisticas.porCategoria.length > 0
                      ? Math.max(...estadisticas.porCategoria.map(c => c.count))
                      : 0} solicitudes.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500 print:block hidden">
              Documento generado desde el panel de moderación de CityPAJ.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
