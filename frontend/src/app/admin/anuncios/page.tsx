'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield, CheckCircle, XCircle, AlertTriangle, MessageSquare, Eye, Search,
  Filter, Download, CheckSquare, Square, X
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { COMUNIDADES, PROVINCIAS_POR_COMUNIDAD, PROVINCIA_NORMALIZACION } from '@/lib/provinces';

interface AnuncioModeracion {
  id: string;
  usuario_id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  comunidad_autonoma: string;
  provincia: string;
  estado_moderacion: string;
  motivo_rechazo: string | null;
  visible: number;
  creado_at: string;
  actualizado_at: string;
  usuario_nombre: string | null;
  usuario_email: string | null;
  reportes: number;
  moderado_at: string | null;
  moderado_por_nombre: string | null;
}

interface Reporte {
  id: string;
  motivo: string;
  descripcion: string | null;
  estado: string;
  creado: string;
}

const CATEGORIAS = [
  { value: 'ocio', label: 'Ocio' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'formacion', label: 'Formación' },
  { value: 'empleo', label: 'Empleo' },
  { value: 'comunidad', label: 'Comunidad' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'salud', label: 'Salud' },
  { value: 'tecnología', label: 'Tecnología' },
  { value: 'otros', label: 'Otros' },
];

const PLANTILLAS = [
  { label: 'Spam', texto: 'Spam: contenido no deseado o repetido.' },
  { label: 'Ofensivo', texto: 'Contenido ofensivo o inapropiado.' },
  { label: 'Datos personales', texto: 'Expone datos personales o de contacto de terceros.' },
  { label: 'Fraude', texto: 'Posible fraude, estafa o contenido engañoso.' },
  { label: 'Duplicado', texto: 'Anuncio duplicado.' },
  { label: 'Otro', texto: 'No cumple las normas de la plataforma.' },
];

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'flagged', label: 'En revisión' },
  { value: 'approved', label: 'Aprobado' },
  { value: 'rejected', label: 'Rechazado' },
];

const ORDENES = [
  { value: 'reciente', label: 'Más reciente' },
  { value: 'antiguo', label: 'Más antiguo' },
  { value: 'reportes', label: 'Más reportes' },
  { value: 'titulo-asc', label: 'Título A-Z' },
  { value: 'titulo-desc', label: 'Título Z-A' },
];

const ITEMS_POR_PAGINA = [10, 20, 50];

export default function AdminAnunciosPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const [anuncios, setAnuncios] = useState<AnuncioModeracion[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [limite, setLimite] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [notas, setNotas] = useState<Record<string, string>>({});
  const [estados, setEstados] = useState<Record<string, string>>({});
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());

  const [preview, setPreview] = useState<AnuncioModeracion | null>(null);
  const [reportesModal, setReportesModal] = useState<{ id: string; reportes: Reporte[] } | null>(null);

  const [filtroTexto, setFiltroTexto] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroComunidad, setFiltroComunidad] = useState('');
  const [filtroProvincia, setFiltroProvincia] = useState('');
  const [filtroReportados, setFiltroReportados] = useState('');
  const [filtroOrden, setFiltroOrden] = useState('reciente');
  const [triggerFiltros, setTriggerFiltros] = useState(0);
  const solicitudRef = useRef(0);

  const [notasBulk, setNotasBulk] = useState('');
  const [estadoBulk, setEstadoBulk] = useState('approved');

  const esModerador = user && (user.rol === 'admin' || user.rol === 'moderador');

  const provinciasDisponibles = filtroComunidad
    ? PROVINCIAS_POR_COMUNIDAD[filtroComunidad] || []
    : [];

  const cargar = async () => {
    if (!accessToken) return;
    const id = ++solicitudRef.current;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(pagina));
      params.set('limit', String(limite));
      params.set('ordenar', filtroOrden);
      if (debouncedText.trim()) params.set('search', debouncedText.trim());
      if (filtroEstado) params.set('estado', filtroEstado);
      if (filtroCategoria) params.set('categoria', filtroCategoria);
      if (filtroComunidad) params.set('comunidad', filtroComunidad);
      if (filtroProvincia) params.set('provincia', PROVINCIA_NORMALIZACION[filtroProvincia] || filtroProvincia);
      if (filtroReportados) params.set('reportes', filtroReportados);

      const res = await fetch(`/api/admin/anuncios?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken || ''}` },
      });
      const data = await res.json();
      if (data.success) {
        if (id === solicitudRef.current) {
          setAnuncios(data.data || []);
          setTotal(data.pagination?.total || 0);
        }
      } else if (id === solicitudRef.current) {
        setError(data.error || 'Error cargando anuncios');
      }
    } catch (err) {
      if (id === solicitudRef.current) setError('Error de conexión');
    } finally {
      if (id === solicitudRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    cargar();
  }, [user, accessToken, pagina, limite, triggerFiltros]);

  useEffect(() => {
    const n: Record<string, string> = {};
    const e: Record<string, string> = {};
    anuncios.forEach((a) => {
      n[a.id] = a.motivo_rechazo || '';
      e[a.id] = a.estado_moderacion;
    });
    setNotas(n);
    setEstados(e);
    setSeleccionados((prev) => {
      const next = new Set<string>();
      anuncios.forEach((a) => {
        if (prev.has(a.id)) next.add(a.id);
      });
      return next;
    });
  }, [anuncios]);

  const refrescar = () => {
    setPagina(1);
    setTriggerFiltros((t) => t + 1);
  };

  const aplicarFiltros = () => {
    setDebouncedText(filtroTexto);
    refrescar();
  };

  const limpiarFiltros = () => {
    setFiltroTexto('');
    setDebouncedText('');
    setFiltroEstado('');
    setFiltroCategoria('');
    setFiltroComunidad('');
    setFiltroProvincia('');
    setFiltroReportados('');
    setFiltroOrden('reciente');
    refrescar();
  };

  const onComunidadChange = (value: string) => {
    setFiltroComunidad(value);
    setFiltroProvincia('');
  };

  const moderar = async (id: string, estadoForzado?: string) => {
    const estado = estadoForzado || estados[id] || anuncios.find((a) => a.id === id)?.estado_moderacion;
    if (!estado || !['approved', 'rejected', 'pending', 'flagged'].includes(estado)) {
      setError('Estado no válido');
      return;
    }
    try {
      const res = await fetch(`/api/anuncios/${id}/moderar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken || ''}`,
        },
        body: JSON.stringify({ estado, notas: notas[id] || '' }),
      });
      const data = await res.json();
      if (data.success) {
        await cargar();
      } else {
        setError(data.error || 'Error al moderar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const moderarBulk = async (estado: string, notasBulkTexto = '') => {
    if (seleccionados.size === 0) {
      setError('Selecciona al menos un anuncio');
      return;
    }
    if (!['approved', 'rejected', 'pending', 'flagged'].includes(estado)) {
      setError('Estado no válido');
      return;
    }
    try {
      const res = await fetch('/api/anuncios/moderar-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken || ''}`,
        },
        body: JSON.stringify({ ids: Array.from(seleccionados), estado, notas: notasBulkTexto }),
      });
      const data = await res.json();
      if (data.success) {
        setNotasBulk('');
        setSeleccionados(new Set());
        await cargar();
      } else {
        setError(data.error || 'Error en acción masiva');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const verReportes = async (id: string) => {
    try {
      const res = await fetch(`/api/anuncios/${id}/reportes`, {
        headers: { Authorization: `Bearer ${accessToken || ''}` },
      });
      const data = await res.json();
      if (data.success) {
        setReportesModal({ id, reportes: data.data || [] });
      }
    } catch (err) {
      setError('Error cargando reportes');
    }
  };

  const formatearFecha = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-ES');
  };

  const formatearFechaHora = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('es-ES');
  };

  const toggleSeleccion = (id: string) => {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const seleccionarTodos = () => {
    const todos = anuncios.every((a) => seleccionados.has(a.id));
    if (todos) {
      setSeleccionados((prev) => {
        const next = new Set(prev);
        anuncios.forEach((a) => next.delete(a.id));
        return next;
      });
    } else {
      setSeleccionados((prev) => {
        const next = new Set(prev);
        anuncios.forEach((a) => next.add(a.id));
        return next;
      });
    }
  };

  const aplicarPlantilla = (id: string, texto: string) => {
    setNotas((prev) => ({ ...prev, [id]: texto }));
  };

  const aplicarPlantillaBulk = (texto: string) => {
    setNotasBulk(texto);
  };

  const exportarCSV = () => {
    if (anuncios.length === 0) return;
    const headers = ['ID', 'Titulo', 'Descripcion', 'Categoria', 'Comunidad', 'Provincia', 'Estado', 'Reportes', 'Autor', 'Email', 'Creado', 'Moderado por', 'Moderado el', 'Notas'];
    const filas = anuncios.map((a) => [
      a.id,
      a.titulo,
      a.descripcion.replace(/"/g, '""').replace(/\n/g, ' '),
      a.categoria,
      a.comunidad_autonoma,
      a.provincia,
      a.estado_moderacion,
      a.reportes,
      a.usuario_nombre || '',
      a.usuario_email || '',
      formatearFecha(a.creado_at),
      a.moderado_por_nombre || '',
      a.moderado_at ? formatearFechaHora(a.moderado_at) : '',
      (a.motivo_rechazo || '').replace(/"/g, '""').replace(/\n/g, ' '),
    ]);
    const csv = [headers, ...filas]
      .map((fila) => fila.map((celda) => `"${String(celda ?? '').replace(/"/g, '""')}"`).join(';'))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anuncios-moderacion-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const estadoBadge = (estado: string) => {
    const clases =
      estado === 'approved' ? 'bg-green-100 text-green-800' :
      estado === 'rejected' ? 'bg-red-100 text-red-800' :
      estado === 'flagged' ? 'bg-orange-100 text-orange-800' :
      'bg-yellow-100 text-yellow-800';
    const texto = estado === 'flagged' ? 'En revisión' : estado;
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${clases}`}>{texto}</span>;
  };

  const totalPaginas = Math.max(1, Math.ceil(total / limite));

  if (!esModerador) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
          <div className="max-w-md w-full border border-black p-8 text-center">
            <Shield className="w-10 h-10 mx-auto text-orange-500 mb-4" />
            <h2 className="font-serif text-2xl font-bold text-black mb-2">Acceso restringido</h2>
            <p className="font-sans text-sm text-gray-700 mb-6">
              Esta área es solo para moderadores. Inicia sesión en el portal exclusivo de moderación.
            </p>
            <Link
              href="/moderador/login"
              className="inline-flex items-center justify-center bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:text-black transition-colors"
            >
              Ir al login de moderadores
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
              Moderación de anuncios
            </h1>
            <p className="text-gray-600 mt-1 text-sm">Revisa, filtra y gestiona anuncios pendientes o reportados.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportarCSV}
              disabled={anuncios.length === 0}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium border border-black bg-white text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Download className="w-3 h-3" /> Exportar CSV
            </button>
            <Link
              href="/admin/sugerencias"
              className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Sugerencias
            </Link>
          </div>
        </div>

        {error ? <div className="mb-4 p-4 bg-red-50 text-red-700 text-sm">{error}</div> : null}

        <div className="border border-black p-4 mb-6 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4" />
            <span className="font-medium text-sm">Filtros</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  type="text"
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
                  placeholder="Título, descripción, autor..."
                  className="w-full pl-7 pr-2 py-1.5 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none"
              >
                {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">Todas</option>
                {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Reportes</label>
              <select
                value={filtroReportados}
                onChange={(e) => setFiltroReportados(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">Todos</option>
                <option value="con">Con reportes</option>
                <option value="sin">Sin reportes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Comunidad autónoma</label>
              <select
                value={filtroComunidad}
                onChange={(e) => onComunidadChange(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">Todas</option>
                {COMUNIDADES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Provincia</label>
              <select
                value={filtroProvincia}
                onChange={(e) => setFiltroProvincia(e.target.value)}
                disabled={!filtroComunidad}
                className="w-full px-2 py-1.5 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Todas</option>
                {provinciasDisponibles.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ordenar por</label>
              <select
                value={filtroOrden}
                onChange={(e) => setFiltroOrden(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none"
              >
                {ORDENES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={aplicarFiltros}
                className="flex-1 px-3 py-1.5 text-sm font-medium bg-black text-white border border-black hover:bg-orange-500 hover:text-black transition-colors"
              >
                Aplicar
              </button>
              <button
                type="button"
                onClick={limpiarFiltros}
                className="flex-1 px-3 py-1.5 text-sm font-medium border border-black bg-white hover:bg-gray-100"
              >
                Limpiar
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500" aria-live="polite">
            {total === 0 ? 'No hay anuncios encontrados' : `${total} anuncio${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
          </div>
        </div>

        {seleccionados.size > 0 && (
          <div className="border border-black p-3 mb-6 bg-orange-50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="text-sm font-medium">
              {seleccionados.size} seleccionado{seleccionados.size !== 1 ? 's' : ''}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="text-xs text-gray-600">Notas:</label>
              <input
                type="text"
                value={notasBulk}
                onChange={(e) => setNotasBulk(e.target.value)}
                placeholder="Notas para la acción masiva"
                className="px-2 py-1 text-xs border border-black bg-white focus:border-orange-500 focus:outline-none w-full sm:w-48"
              />
              <div className="flex flex-wrap gap-1">
                {PLANTILLAS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => aplicarPlantillaBulk(p.texto)}
                    className="px-2 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-100"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <select
                value={estadoBulk}
                onChange={(e) => setEstadoBulk(e.target.value)}
                className="px-2 py-1 text-xs border border-black bg-white"
              >
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
                <option value="pending">Pendiente</option>
                <option value="flagged">En revisión</option>
              </select>
              <button
                onClick={() => moderarBulk(estadoBulk, notasBulk)}
                className="px-3 py-1 text-xs font-medium bg-black text-white border border-black hover:bg-orange-500 hover:text-black transition-colors"
              >
                Aplicar
              </button>
              <button
                onClick={() => moderarBulk('approved', notasBulk)}
                className="px-3 py-1 text-xs font-medium bg-white text-black border border-black hover:bg-green-100 transition-colors"
              >
                Aprobar
              </button>
              <button
                onClick={() => moderarBulk('rejected', notasBulk)}
                className="px-3 py-1 text-xs font-medium bg-white text-black border border-black hover:bg-red-100 transition-colors"
              >
                Rechazar
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-600">Cargando...</div>
        ) : anuncios.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-600">No hay anuncios que coincidan con los filtros.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
                <button
                  onClick={seleccionarTodos}
                  className="inline-flex items-center justify-center"
                  aria-label="Seleccionar todos"
                >
                  {anuncios.every((a) => seleccionados.has(a.id)) ? (
                    <CheckSquare className="w-4 h-4 text-orange-500" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                Seleccionar todos (página)
              </label>
            </div>

            <div className="space-y-4">
              {anuncios.map((a) => (
                <div key={a.id} className="border border-black p-4 bg-white">
                  <div className="flex flex-col lg:flex-row items-start gap-3 mb-2">
                    <button
                      onClick={() => toggleSeleccion(a.id)}
                      className="mt-1"
                      aria-label={seleccionados.has(a.id) ? 'Deseleccionar' : 'Seleccionar'}
                    >
                      {seleccionados.has(a.id) ? (
                        <CheckSquare className="w-4 h-4 text-orange-500" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-serif text-lg font-bold text-black min-w-0 break-words">{a.titulo}</h3>
                        {estadoBadge(a.estado_moderacion)}
                        {a.reportes > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            {a.reportes}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-gray-700 break-words mb-3">{a.descripcion}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                        <span className="font-medium">{a.categoria}</span>
                        <span>{a.comunidad_autonoma}{a.provincia ? ` / ${a.provincia}` : ''}</span>
                        <span>{formatearFecha(a.creado_at)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        <span className="font-medium">{a.usuario_nombre || 'Anónimo'}</span>
                        {a.usuario_email ? <span> · {a.usuario_email}</span> : null}
                      </div>
                      {a.moderado_at ? (
                        <p className="text-xs text-gray-500 italic">
                          Moderado por {a.moderado_por_nombre || 'desconocido'} el {formatearFechaHora(a.moderado_at)}
                        </p>
                      ) : null}
                      {a.motivo_rechazo ? (
                        <p className="text-xs text-gray-500 mt-1">Notas: {a.motivo_rechazo}</p>
                      ) : null}
                    </div>

                    <div className="w-full lg:w-72 flex flex-col gap-2 mt-4 lg:mt-0">
                      <label className="text-xs font-medium text-gray-600">Estado</label>
                      <select
                        value={estados[a.id] || a.estado_moderacion}
                        onChange={(e) => setEstados({ ...estados, [a.id]: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="flagged">En revisión</option>
                        <option value="approved">Aprobado</option>
                        <option value="rejected">Rechazado</option>
                      </select>

                      <label className="text-xs font-medium text-gray-600">Notas</label>
                      <textarea
                        value={notas[a.id] || ''}
                        onChange={(e) => setNotas({ ...notas, [a.id]: e.target.value })}
                        rows={2}
                        placeholder="Notas internas o motivo"
                        className="w-full px-2 py-1.5 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none resize-y"
                      />

                      <div className="flex flex-wrap gap-1">
                        {PLANTILLAS.map((p) => (
                          <button
                            key={p.label}
                            onClick={() => aplicarPlantilla(a.id, p.texto)}
                            className="px-2 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-100"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => moderar(a.id, 'approved')}
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-black text-white border border-black hover:bg-orange-500 hover:text-black transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" /> Aprobar
                        </button>
                        <button
                          onClick={() => moderar(a.id, 'rejected')}
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-white text-black border border-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                        >
                          <XCircle className="w-3 h-3" /> Rechazar
                        </button>
                        <button
                          onClick={() => moderar(a.id)}
                          className="col-span-2 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-white text-black border border-black hover:bg-gray-100 transition-colors"
                        >
                          Guardar estado
                        </button>
                      </div>

                      <div className="flex gap-2">
                        {a.reportes > 0 ? (
                          <button
                            onClick={() => verReportes(a.id)}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                          >
                            <MessageSquare className="w-3 h-3" /> Reportes
                          </button>
                        ) : null}
                        <button
                          onClick={() => setPreview(a)}
                          className={`inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200 ${a.reportes > 0 ? 'flex-1' : 'w-full'}`}
                        >
                          <Eye className="w-3 h-3" /> Ver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600">
                Página {pagina} de {totalPaginas} · {total} resultados
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={limite}
                  onChange={(e) => { setLimite(Number(e.target.value)); setPagina(1); }}
                  className="px-2 py-2 text-xs border border-black bg-white"
                >
                  {ITEMS_POR_PAGINA.map((n) => <option key={n} value={n}>{n}/pág</option>)}
                </select>
                <Pagination
                  currentPage={pagina}
                  totalPages={totalPaginas}
                  onPageChange={(p) => setPagina(p)}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {preview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-black max-w-2xl w-full max-h-[90vh] overflow-auto p-6 relative">
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 p-1 hover:bg-gray-100"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-2xl font-bold text-black mb-2 pr-8">{preview.titulo}</h2>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {estadoBadge(preview.estado_moderacion)}
              {preview.reportes > 0 ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  {preview.reportes} reporte{preview.reportes !== 1 ? 's' : ''}
                </span>
              ) : null}
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{preview.descripcion}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
              <div><span className="font-medium">Categoría:</span> {preview.categoria}</div>
              <div><span className="font-medium">Ubicación:</span> {preview.comunidad_autonoma}{preview.provincia ? ` / ${preview.provincia}` : ''}</div>
              <div><span className="font-medium">Autor:</span> {preview.usuario_nombre || 'Anónimo'}{preview.usuario_email ? ` · ${preview.usuario_email}` : ''}</div>
              <div><span className="font-medium">Publicado:</span> {formatearFechaHora(preview.creado_at)}</div>
            </div>
            {preview.moderado_at ? (
              <p className="text-sm text-gray-500 italic mb-4">
                Última moderación: {preview.moderado_por_nombre || 'desconocido'} el {formatearFechaHora(preview.moderado_at)}
              </p>
            ) : null}
            {preview.motivo_rechazo ? (
              <div className="border border-gray-200 p-3 mb-4 bg-gray-50">
                <span className="text-xs font-medium text-gray-600">Notas:</span>
                <p className="text-sm text-gray-700 mt-1">{preview.motivo_rechazo}</p>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { moderar(preview.id, 'approved'); setPreview(null); }}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium bg-black text-white border border-black hover:bg-orange-500 hover:text-black transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Aprobar
              </button>
              <button
                onClick={() => { moderar(preview.id, 'rejected'); setPreview(null); }}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium bg-white text-black border border-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
              >
                <XCircle className="w-4 h-4" /> Rechazar
              </button>
              {preview.reportes > 0 ? (
                <button
                  onClick={() => { verReportes(preview.id); setPreview(null); }}
                  className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                >
                  <MessageSquare className="w-4 h-4" /> Ver reportes
                </button>
              ) : null}
              <Link
                href={`/anuncios/${preview.id}`}
                target="_blank"
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                <Eye className="w-4 h-4" /> Abrir público
              </Link>
            </div>
          </div>
        </div>
      )}

      {reportesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-black max-w-lg w-full p-6 max-h-[80vh] overflow-auto">
            <h3 className="font-serif text-xl font-bold text-black mb-4">Reportes del anuncio</h3>
            {reportesModal.reportes.length === 0 ? (
              <p className="text-sm text-gray-600">No hay reportes.</p>
            ) : (
              <div className="space-y-3">
                {reportesModal.reportes.map((r) => (
                  <div key={r.id} className="border border-gray-200 p-3 rounded">
                    <div className="text-sm font-medium text-gray-900">{r.motivo}</div>
                    {r.descripcion ? <p className="text-xs text-gray-600 mt-1">{r.descripcion}</p> : null}
                    <div className="text-xs text-gray-400 mt-1">{r.estado} · {formatearFecha(r.creado)}</div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setReportesModal(null)}
              className="mt-6 w-full px-4 py-2 bg-black text-white text-sm hover:bg-orange-500 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
