'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileStack, Plus, Search, Eye, Trash, Copy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

interface Plantilla {
  id: number;
  nombre: string;
  asunto: string;
  cuerpo: string;
  descripcion: string | null;
  tipo: string;
  activa: number;
}

export default function AdminPlantillasPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const isAdmin = user?.rol === 'admin';
  const isStaff = user?.rol === 'admin' || user?.rol === 'moderador';

  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [preview, setPreview] = useState<Plantilla | null>(null);
  const [form, setForm] = useState({ nombre: '', asunto: '', cuerpo: '', descripcion: '' });

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const fetchPlantillas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/plantillas?q=${encodeURIComponent(q)}`, { headers });
      const json = await res.json();
      if (json.success) setPlantillas(json.data as Plantilla[]);
    } catch {
      setError('Error cargando plantillas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { router.replace('/admin/acceder'); return; }
    if (!isStaff) { router.replace('/admin'); return; }
    fetchPlantillas();
  }, [user, q, isStaff, router, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/plantillas', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error guardando plantilla');
      setForm({ nombre: '', asunto: '', cuerpo: '', descripcion: '' });
      setMostrarForm(false);
      fetchPlantillas();
    } catch (err: any) { setError(err.message); }
  };

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta plantilla?')) return;
    await fetch(`/api/admin/plantillas/${id}`, { method: 'DELETE', headers });
    fetchPlantillas();
  };

  const reemplazarVars = (texto: string) =>
    texto
      .replace(/\{\{provincia\}\}/g, 'Zaragoza')
      .replace(/\{\{institucion\}\}/g, 'Ayuntamiento de ejemplo')
      .replace(/\{\{tema_principal\}\}/g, 'Vivienda')
      .replace(/\{\{numero_sugerencias\}\}/g, '12')
      .replace(/\{\{nombre_admin\}\}/g, user?.nombre || 'Admin')
      .replace(/\{\{fecha\}\}/g, new Date().toLocaleDateString('es-ES'));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between">
            <div className="flex items-center gap-3">
              <FileStack className="w-7 h-7 text-orange-500" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">Plantillas de comunicación</h1>
            </div>
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="inline-flex items-center gap-2 bg-black text-white border border-black px-4 py-2 text-sm hover:bg-orange-500 hover:text-black transition-colors"
            >
              <Plus className="w-4 h-4" />
              {mostrarForm ? 'Cerrar' : 'Nueva plantilla'}
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar plantillas..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-black bg-white focus:outline-none"
            />
          </div>

          {mostrarForm && (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Nombre de la plantilla"
                  required
                  className="px-3 py-2 text-sm border border-black bg-white"
                />
                <input
                  value={form.asunto}
                  onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                  placeholder="Asunto"
                  required
                  className="px-3 py-2 text-sm border border-black bg-white"
                />
              </div>
              <input
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción (opcional)"
                className="w-full px-3 py-2 text-sm border border-black bg-white"
              />
              <textarea
                value={form.cuerpo}
                onChange={(e) => setForm({ ...form, cuerpo: e.target.value })}
                placeholder="Cuerpo. Puedes usar variables como {{provincia}}, {{institucion}}, {{tema_principal}}, {{numero_sugerencias}}, {{nombre_admin}}, {{fecha}}..."
                required
                rows={8}
                className="w-full px-3 py-2 text-sm border border-black bg-white"
              />
              <div className="flex gap-3">
                <button type="submit" className="bg-black text-white px-6 py-2 text-sm border border-black hover:bg-orange-500 hover:text-black transition-colors">Guardar</button>
                <button type="button" onClick={() => setMostrarForm(false)} className="px-6 py-2 text-sm border border-black bg-white hover:bg-slate-100">Cancelar</button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="p-8 text-center text-gray-600 bg-white border border-gray-200 rounded-xl">Cargando...</div>
            ) : plantillas.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">No hay plantillas.</div>
            ) : (
              plantillas.map((p) => (
                <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-bold text-black">{p.nombre}</h3>
                      <p className="text-sm text-slate-500">{p.asunto}</p>
                      <p className="text-xs text-slate-400 mt-1">{p.descripcion || '—'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreview(p)}
                        className="p-2 text-slate-600 hover:bg-slate-100 border border-gray-200"
                        title="Previsualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => eliminar(p.id)}
                        className="p-2 text-red-600 hover:bg-red-50 border border-gray-200"
                        title="Eliminar"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {preview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white border border-black w-full max-w-2xl max-h-[90vh] overflow-auto p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl font-bold">Vista previa</h2>
                  <button onClick={() => setPreview(null)} className="p-2 hover:bg-slate-100"><Copy className="w-5 h-5" /></button>
                </div>
                <div className="mb-2 text-sm font-medium text-slate-700">Asunto:</div>
                <div className="p-3 bg-slate-50 border border-slate-200 mb-4 text-sm">{reemplazarVars(preview.asunto)}</div>
                <div className="mb-2 text-sm font-medium text-slate-700">Cuerpo:</div>
                <div className="p-3 bg-slate-50 border border-slate-200 whitespace-pre-wrap text-sm">{reemplazarVars(preview.cuerpo)}</div>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => setPreview(null)} className="px-4 py-2 text-sm border border-black bg-white hover:bg-slate-100">Cerrar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
