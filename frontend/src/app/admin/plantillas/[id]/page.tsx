'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FileStack, ArrowLeft, Save, Trash2 } from 'lucide-react';
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

export default function AdminPlantillaDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const id = params.id as string;

  const [plantilla, setPlantilla] = useState<Plantilla | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [form, setForm] = useState({
    nombre: '',
    asunto: '',
    cuerpo: '',
    descripcion: '',
    tipo: 'institucional',
    activa: 1,
  });

  const isAdmin = user?.rol === 'admin';
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const fetchPlantilla = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/plantillas/${id}`, { headers });
      const json = await res.json();
      if (json.success) {
        const data = json.data as Plantilla;
        setPlantilla(data);
        setForm({
          nombre: data.nombre || '',
          asunto: data.asunto || '',
          cuerpo: data.cuerpo || '',
          descripcion: data.descripcion || '',
          tipo: data.tipo || 'institucional',
          activa: data.activa ?? 1,
        });
      } else {
        setError(json.data?.error || 'No encontrada');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace('/admin/acceder');
      return;
    }
    if (!isAdmin) {
      router.replace('/admin');
      return;
    }
    fetchPlantilla();
  }, [user, isAdmin, router, id]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/plantillas/${id}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setPlantilla(json.data as Plantilla);
        setOk('Plantilla guardada');
        setTimeout(() => setOk(null), 3000);
      } else {
        setError(json.data?.error || 'Error guardando');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const eliminar = async () => {
    if (!confirm('¿Eliminar esta plantilla?')) return;
    try {
      const res = await fetch(`/api/admin/plantillas/${id}`, { method: 'DELETE', headers });
      const json = await res.json();
      if (json.success) {
        router.push('/admin/plantillas');
      } else {
        setError(json.data?.error || 'Error eliminando');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/plantillas" className="inline-flex items-center gap-1 text-sm text-gray-700 hover:text-black mb-6">
            <ArrowLeft className="w-4 h-4" />
            Plantillas
          </Link>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
          {ok && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">{ok}</div>}

          {loading ? (
            <div className="p-8 text-center text-gray-600 bg-white border border-gray-200 rounded-xl">Cargando...</div>
          ) : !plantilla ? (
            <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">Plantilla no encontrada.</div>
          ) : (
            <form onSubmit={guardar} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <FileStack className="w-6 h-6 text-orange-500" />
                <h1 className="font-serif text-2xl font-bold text-black">{plantilla.nombre}</h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white sm:col-span-2"
                  placeholder="Nombre de la plantilla"
                  required
                />
                <input
                  value={form.asunto}
                  onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white sm:col-span-2"
                  placeholder="Asunto"
                  required
                />
                <input
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                  placeholder="Tipo"
                />
                <select
                  value={form.activa}
                  onChange={(e) => setForm({ ...form, activa: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                >
                  <option value={1}>Activa</option>
                  <option value={0}>Inactiva</option>
                </select>
                <input
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white sm:col-span-2"
                  placeholder="Descripción (opcional)"
                />
              </div>

              <textarea
                value={form.cuerpo}
                onChange={(e) => setForm({ ...form, cuerpo: e.target.value })}
                rows={12}
                className="w-full px-3 py-2 text-sm border border-black bg-white"
                placeholder="Cuerpo. Variables: {{provincia}}, {{institucion}}, {{tema_principal}}, {{numero_sugerencias}}, {{nombre_admin}}, {{fecha}}..."
                required
              />

              <div className="text-xs text-slate-500">
                Puedes usar variables: {'{{provincia}}'}, {'{{institucion}}'}, {'{{tema_principal}}'}, {'{{numero_sugerencias}}'}, {'{{nombre_admin}}'}, {'{{fecha}}'}...
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 text-sm hover:bg-orange-500 hover:text-black transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  onClick={eliminar}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm border border-red-500 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
