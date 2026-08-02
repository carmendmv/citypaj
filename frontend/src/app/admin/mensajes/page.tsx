'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Send, Inbox, Send as EnviadosIcon, Trash2, Check, Plus, X, Archive, Save, Paperclip } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';
import { RecipientInput, type Recipient } from '@/components/admin/RecipientInput';

interface EntidadAdjunta {
  entidad_tipo: 'anuncio' | 'sugerencia' | 'propuesta' | 'publicacion' | 'usuario' | 'reporte';
  entidad_id: string;
  titulo?: string;
}

interface Mensaje {
  id: number;
  remitente_id: string;
  destinatario_id: string | null;
  asunto: string;
  cuerpo: string;
  leido: number;
  creado_at: string;
  leido_at: string | null;
  prioridad: string;
  estado: string;
  remitente_email?: string;
  remitente_nombre?: string;
  destinatario_email?: string;
  destinatario_nombre?: string;
  entidades?: EntidadAdjunta[];
}

export default function AdminMensajesPage() {
  const router = useRouter();
  const { user, accessToken, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'recibidos' | 'enviados' | 'borradores' | 'archivados' | 'nuevo'>('recibidos');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinatario, setDestinatario] = useState<Recipient | null>(null);
  const [entidades, setEntidades] = useState<EntidadAdjunta[]>([]);
  const [nuevaEntidad, setNuevaEntidad] = useState<EntidadAdjunta>({ entidad_tipo: 'anuncio', entidad_id: '', titulo: '' });
  const [form, setForm] = useState({ asunto: '', cuerpo: '', prioridad: 'normal' });

  const isAdmin = user?.rol === 'admin';
  const isStaff = user?.rol === 'admin' || user?.rol === 'moderador';

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const fetchMensajes = async (tipo: typeof activeTab) => {
    if (tipo === 'nuevo') return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/mensajes?tipo=${tipo}`, { headers });
      const json = await res.json();
      if (json.success) setMensajes(json.data as Mensaje[]);
    } catch {
      setError('Error cargando mensajes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace('/admin/acceder');
      return;
    }
    fetchMensajes(activeTab);
  }, [user, router, activeTab]);

  const enviarMensaje = async (comoBorrador: boolean) => {
    setSending(true);
    setError(null);
    try {
      const payload = {
        destinatario_id: destinatario?.id,
        asunto: form.asunto,
        cuerpo: form.cuerpo,
        prioridad: form.prioridad,
        entidades,
        estado: comoBorrador ? 'borrador' : 'enviado',
      };
      const res = await fetch('/api/admin/mensajes', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error enviando mensaje');
      setForm({ asunto: '', cuerpo: '', prioridad: 'normal' });
      setDestinatario(null);
      setEntidades([]);
      setActiveTab(comoBorrador ? 'borradores' : 'enviados');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const archivarMensaje = async (id: number) => {
    try {
      await fetch(`/api/admin/mensajes/${id}/archivar`, { method: 'PATCH', headers });
      fetchMensajes(activeTab);
    } catch {
      // ignore
    }
  };

  const marcarLeido = async (id: number) => {
    try {
      await fetch(`/api/admin/mensajes/${id}/leido`, { method: 'PATCH', headers });
      setMensajes((prev) =>
        prev.map((m) => (m.id === id ? { ...m, leido: 1, leido_at: new Date().toISOString() } : m))
      );
    } catch {
      // ignore
    }
  };

  const eliminarMensaje = async (id: number) => {
    try {
      await fetch(`/api/admin/mensajes/${id}`, { method: 'DELETE', headers });
      setMensajes((prev) => prev.filter((m) => m.id !== id));
    } catch {
      // ignore
    }
  };

  if (!user) return null;

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-black p-8 text-center">
          <X className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h1 className="font-serif text-2xl font-bold text-black mb-2">Acceso denegado</h1>
          <p className="text-sm text-gray-700 mb-6">No tienes permisos para esta sección.</p>
          <button
            onClick={() => logout().then(() => router.push('/'))}
            className="inline-flex items-center justify-center bg-black text-white border border-black px-6 py-3 text-sm hover:bg-orange-500 hover:text-black transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'recibidos', label: 'Recibidos', icon: Inbox },
    { key: 'nuevo', label: 'Nuevo', icon: Send },
    { key: 'enviados', label: 'Enviados', icon: EnviadosIcon },
    { key: 'borradores', label: 'Borradores', icon: Save },
    { key: 'archivados', label: 'Archivados', icon: Archive },
  ] as const;

  const prioridadColor: Record<string, string> = {
    baja: 'bg-gray-100 text-gray-700',
    normal: 'bg-emerald-100 text-emerald-700',
    alta: 'bg-orange-100 text-orange-700',
    urgente: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-7 h-7 text-orange-500" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">Mensajería interna</h1>
          </div>

          <div className="flex gap-2 border-b border-gray-200 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setError(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-[2px] ${
                    activeTab === tab.key
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-black'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {activeTab === 'nuevo' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div>
                <RecipientInput
                  tipo="interno"
                  selected={destinatario}
                  onSelect={setDestinatario}
                  label="Para"
                  placeholder="Escribe un nombre, email, rol, provincia o institución..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                  <input
                    type="text"
                    value={form.asunto}
                    onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm border border-black bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                  <select
                    value={form.prioridad}
                    onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-black bg-white focus:outline-none"
                  >
                    <option value="baja">Baja</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea
                  value={form.cuerpo}
                  onChange={(e) => setForm({ ...form, cuerpo: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-3 py-2 text-sm border border-black bg-white focus:outline-none"
                />
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Paperclip className="w-4 h-4" />
                  Entidades adjuntas
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {entidades.map((ent, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded bg-white border border-slate-300 px-2 py-1 text-xs"
                    >
                      {ent.entidad_tipo}: {ent.entidad_id}
                      <button
                        type="button"
                        onClick={() => setEntidades(entidades.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={nuevaEntidad.entidad_tipo}
                    onChange={(e) => setNuevaEntidad({ ...nuevaEntidad, entidad_tipo: e.target.value as any })}
                    className="px-3 py-2 text-sm border border-black bg-white"
                  >
                    <option value="anuncio">Anuncio</option>
                    <option value="sugerencia">Sugerencia</option>
                    <option value="propuesta">Propuesta</option>
                    <option value="publicacion">Publicación</option>
                    <option value="usuario">Usuario</option>
                    <option value="reporte">Reporte</option>
                  </select>
                  <input
                    type="text"
                    placeholder="ID de la entidad"
                    value={nuevaEntidad.entidad_id}
                    onChange={(e) => setNuevaEntidad({ ...nuevaEntidad, entidad_id: e.target.value })}
                    className="px-3 py-2 text-sm border border-black bg-white flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Título (opcional)"
                    value={nuevaEntidad.titulo || ''}
                    onChange={(e) => setNuevaEntidad({ ...nuevaEntidad, titulo: e.target.value })}
                    className="px-3 py-2 text-sm border border-black bg-white flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (nuevaEntidad.entidad_id) {
                        setEntidades([...entidades, nuevaEntidad]);
                        setNuevaEntidad({ entidad_tipo: 'anuncio', entidad_id: '', titulo: '' });
                      }
                    }}
                    className="px-3 py-2 text-sm bg-slate-800 text-white hover:bg-black"
                  >
                    Añadir
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => enviarMensaje(false)}
                  disabled={sending || !destinatario}
                  className="inline-flex items-center gap-2 bg-orange-500 text-white border border-orange-500 px-6 py-2 text-sm hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Enviando...' : 'Enviar mensaje'}
                </button>
                <button
                  type="button"
                  onClick={() => enviarMensaje(true)}
                  disabled={sending}
                  className="inline-flex items-center gap-2 bg-white text-black border border-black px-6 py-2 text-sm hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Guardar borrador
                </button>
                {!destinatario && <span className="text-xs text-slate-500">Selecciona un destinatario para enviar</span>}
              </div>
            </div>
          )}

          {activeTab !== 'nuevo' && (
            <div className="space-y-3">
              {loading ? (
                <div className="p-8 text-center text-gray-600 border border-gray-200 bg-white rounded-xl">
                  Cargando mensajes...
                </div>
              ) : mensajes.length === 0 ? (
                <div className="p-8 text-center text-gray-500 border border-gray-200 bg-white rounded-xl">
                  No hay mensajes {activeTab}.
                </div>
              ) : (
                mensajes.map((m) => (
                  <div
                    key={m.id}
                    className={`bg-white border rounded-xl p-4 ${
                      activeTab === 'recibidos' && !m.leido ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-bold text-black">
                          {activeTab === 'recibidos' && !m.leido && (
                            <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2" />
                          )}
                          {m.asunto}
                          {m.prioridad && m.prioridad !== 'normal' && (
                            <span className={`ml-2 inline-block rounded px-2 py-0.5 text-xs ${prioridadColor[m.prioridad] || 'bg-gray-100'}`}>
                              {m.prioridad}
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {activeTab === 'recibidos'
                            ? `De: ${m.remitente_nombre || m.remitente_email || '—'}`
                            : `Para: ${m.destinatario_nombre || m.destinatario_email || '—'}`}
                          {' · '}
                          {new Date(m.creado_at).toLocaleString('es-ES')}
                        </p>
                        <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{m.cuerpo}</p>
                        {m.entidades && m.entidades.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {m.entidades.map((ent, idx) => (
                              <span key={idx} className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                                {ent.entidad_tipo}: {ent.entidad_id}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {activeTab === 'recibidos' && !m.leido && (
                          <button
                            onClick={() => marcarLeido(m.id)}
                            title="Marcar como leído"
                            className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 border border-gray-200"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {(activeTab === 'recibidos' || activeTab === 'enviados') && (
                          <button
                            onClick={() => archivarMensaje(m.id)}
                            title="Archivar"
                            className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 border border-gray-200"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => eliminarMensaje(m.id)}
                          title="Eliminar"
                          className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 border border-gray-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
