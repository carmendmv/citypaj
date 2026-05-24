'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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

const PRIORIDAD_COLORS = {
  baja: '#10B981',
  media: '#F59E0B',
  alta: '#EF4444',
  critica: '#991B1B'
};

export default function AdminSugerencias() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [comunidadSeleccionada, setComunidadSeleccionada] = useState('Todas');

  const comunidades = [
    'Todas', 'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
    'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña',
    'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid',
    'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
  ];

  useEffect(() => {
    fetchEstadisticas();
  }, [comunidadSeleccionada]);

  const fetchEstadisticas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3002/api/sugerencias/estadisticas${comunidadSeleccionada !== 'Todas' ? `?comunidad_autonoma=${comunidadSeleccionada}` : ''}`);
      const data = await response.json();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Sugerencias Juveniles</h1>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Sugerencias Juveniles</h1>
          <div className="bg-white border border-black p-6 text-center">
            <p className="text-gray-600">Error al cargar las estadísticas</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Sugerencias Juveniles</h1>
            <p className="text-gray-600 mt-2">Análisis de necesidades y demandas de la juventud</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={comunidadSeleccionada}
              onChange={(e) => setComunidadSeleccionada(e.target.value)}
              className="px-4 py-2 border border-black bg-white focus:outline-none"
            >
              {comunidades.map(comunidad => (
                <option key={comunidad} value={comunidad}>{comunidad}</option>
              ))}
            </select>
            
            <button
              onClick={fetchEstadisticas}
              className="px-4 py-2 bg-black text-white border border-black hover:bg-orange-500 hover:border-orange-500 transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-black p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total de Sugerencias</h3>
            <p className="text-3xl font-bold text-black">{estadisticas.total}</p>
          </div>
          
          <div className="bg-white border border-black p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Prioridad Alta/Crítica</h3>
            <p className="text-3xl font-bold text-red-600">
              {estadisticas.porPrioridad
                .filter(p => p.prioridad === 'alta' || p.prioridad === 'critica')
                .reduce((sum, p) => sum + p.count, 0)}
            </p>
          </div>
          
          <div className="bg-white border border-black p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Pendientes</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {estadisticas.porEstado.find(e => e.estado === 'pendiente')?.count || 0}
            </p>
          </div>
          
          <div className="bg-white border border-black p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">En Progreso</h3>
            <p className="text-3xl font-bold text-blue-600">
              {estadisticas.porEstado.find(e => e.estado === 'en_progreso')?.count || 0}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico por categoría */}
          <div className="bg-white border border-black p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Sugerencias por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estadisticas.porCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico por prioridad */}
          <div className="bg-white border border-black p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Distribución por Prioridad</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={estadisticas.porPrioridad}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => `${props.prioridad}: ${props.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {estadisticas.porPrioridad.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORIDAD_COLORS[entry.prioridad as keyof typeof PRIORIDAD_COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla de sugerencias recientes */}
        <div className="bg-white border border-black">
          <div className="p-6 border-b border-black">
            <h3 className="text-lg font-semibold text-black">Sugerencias Recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estadisticas.recientes.map((sugerencia) => (
                  <tr key={sugerencia.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sugerencia.titulo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: COLORS[sugerencia.categoria as keyof typeof COLORS] + '20', color: COLORS[sugerencia.categoria as keyof typeof COLORS] }}>
                        {sugerencia.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        sugerencia.prioridad === 'critica' ? 'bg-red-100 text-red-800' :
                        sugerencia.prioridad === 'alta' ? 'bg-red-50 text-red-600' :
                        sugerencia.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {sugerencia.prioridad}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        sugerencia.estado === 'resuelta' ? 'bg-green-100 text-green-800' :
                        sugerencia.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                        sugerencia.estado === 'revisada' ? 'bg-purple-100 text-purple-800' :
                        sugerencia.estado === 'rechazada' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sugerencia.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sugerencia.fecha).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights automáticos */}
        <div className="mt-8 bg-white border border-black p-6">
          <h3 className="text-lg font-semibold text-black mb-4">📊 Insights Automáticos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">⚠️ Prioridades Críticas</h4>
              <p className="text-sm text-red-700">
                {estadisticas.porPrioridad.find(p => p.prioridad === 'critica')?.count || 0} sugerencias requieren atención urgente.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">🎯 Categoría más Demandada</h4>
              <p className="text-sm text-blue-700">
                {estadisticas.porCategoria.length > 0 ? estadisticas.porCategoria.reduce((max, curr) => curr.count > max.count ? curr : max).categoria : 'N/A'} 
                {' '}con {estadisticas.porCategoria.length > 0 ? Math.max(...estadisticas.porCategoria.map(c => c.count)) : 0} solicitudes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
