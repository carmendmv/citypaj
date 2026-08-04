'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Megaphone, ArrowLeft, Send, FileText, Trash2, Save, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

interface Entidad {
  entidad_tipo: string;
  entidad_id: string;
  titulo?: string;
}

interface Comunicacion {
  id: number;
  asunto: string;
  cuerpo: string;
  estado: string;
  institucion: string | null;
  area: string | null;
  provincia: string | null;
  comunidad_autonoma: string | null;
  email_destino: string | null;
  creado_at: string;
  enviado_at: string | null;
  entidades: Entidad[];
}

export default function AdminComunicacionDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const id = params.id as string;

  const [com, setCom] = useState<Comunicacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [form, setForm] = useState({
    asunto: '',
    cuerpo: '',
    institucion: '',
    area: '',
    provincia: '',
    comunidad_autonoma: '',
    email_destino: '',
  });

  const isAdmin = user?.rol === 'admin';
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const fetchCom = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/comunicaciones/${id}`, { headers });
      const json = await res.json();
      if (json.success) {
        const data = json.data as Comunicacion;
        setCom(data);
        setForm({
          asunto: data.asunto || '',
          cuerpo: data.cuerpo || '',
          institucion: data.institucion || '',
          area: data.area || '',
          provincia: data.provincia || '',
          comunidad_autonoma: data.comunidad_autonoma || '',
          email_destino: data.email_destino || '',
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
    fetchCom();
  }, [user, isAdmin, router, id]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/comunicaciones/${id}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setCom(json.data as Comunicacion);
        setOk('Comunicación guardada');
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

  const marcarEnviada = async () => {
    if (!confirm('¿Marcar como enviada?')) return;
    try {
      const res = await fetch(`/api/admin/comunicaciones/${id}/enviado`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ modo: 'manual' }),
      });
      const json = await res.json();
      if (json.success) {
        setCom(json.data as Comunicacion);
        setOk('Marcada como enviada');
        setTimeout(() => setOk(null), 3000);
      } else {
        setError(json.data?.error || 'Error');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  const eliminar = async () => {
    if (!confirm('¿Eliminar esta comunicación? Solo se puede eliminar en borrador.')) return;
    try {
      const res = await fetch(`/api/admin/comunicaciones/${id}`, { method: 'DELETE', headers });
      const json = await res.json();
      if (json.success) {
        router.push('/admin/comunicaciones');
      } else {
        setError(json.data?.error || 'Error eliminando');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  const exportar = () => {
    window.open(`/api/admin/comunicaciones/${id}/exportar`, '_blank');
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/comunicaciones" className="inline-flex items-center gap-1 text-sm text-gray-700 hover:text-black mb-6">
            <ArrowLeft className="w-4 h-4" />
            Comunicaciones
          </Link>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
          {ok && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">{ok}</div>}

          {loading ? (
            <div className="p-8 text-center text-gray-600 bg-white border border-gray-200 rounded-xl">Cargando...</div>
          ) : !com ? (
            <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">Comunicación no encontrada.</div>
          ) : (
            <form onSubmit={guardar} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Megaphone className="w-6 h-6 text-orange-500" />
                  <h1 className="font-serif text-2xl font-bold text-black">Comunicación #{com.id}</h1>
                </div>
                <div className="flex items-center gap-2">
                  {com.estado === 'borrador' && (
                    <button
                      type="button"
                      onClick={marcarEnviada}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 border border-gray-200"
                      title="Marcar enviada"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={exportar}
                    className="p-2 text-slate-600 hover:bg-slate-100 border border-gray-200"
                    title="Exportar .txt"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={eliminar}
                    className="p-2 text-red-600 hover:bg-red-50 border border-gray-200"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                <span className={`px-2 py-0.5 rounded text-xs ${com.estado === 'enviado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {com.estado}
                </span>
                {com.entidades.map((ent, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                    {ent.entidad_tipo}: {ent.titulo || ent.entidad_id}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  value={form.asunto}
                  onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white sm:col-span-2"
                  placeholder="Asunto"
                />
                <input
                  value={form.institucion}
                  onChange={(e) => setForm({ ...form, institucion: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                  placeholder="Institución"
                />
                <input
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                  placeholder="Área / Departamento"
                />
                <input
                  value={form.provincia}
                  onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                  placeholder="Provincia"
                />
                <input
                  value={form.comunidad_autonoma}
                  onChange={(e) => setForm({ ...form, comunidad_autonoma: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                  placeholder="Comunidad autónoma"
                />
                <input
                  value={form.email_destino}
                  onChange={(e) => setForm({ ...form, email_destino: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white sm:col-span-2"
                  placeholder="Email de destino"
                />
              </div>

              <textarea
                value={form.cuerpo}
                onChange={(e) => setForm({ ...form, cuerpo: e.target.value })}
                rows={10}
                className="w-full px-3 py-2 text-sm border border-black bg-white"
                placeholder="Cuerpo de la comunicación"
              />

              <div className="text-xs text-slate-500">
                Creada: {new Date(com.creado_at).toLocaleString('es-ES')}
                {com.enviado_at && ` · Enviada: ${new Date(com.enviado_at).toLocaleString('es-ES')}`}
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
                  onClick={exportar}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm border border-black bg-white hover:bg-slate-100"
                >
                  <FileText className="w-4 h-4" />
                  Exportar .txt
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
