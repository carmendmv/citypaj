'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Megaphone, FileStack, Plus, X, Save, Send, Paperclip, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';
import { RecipientInput, type Recipient } from '@/components/admin/RecipientInput';

interface Plantilla {
  id: number;
  nombre: string;
  asunto: string;
  cuerpo: string;
  tipo: string;
}

interface EntidadAdjunta {
  entidad_tipo: 'sugerencia' | 'propuesta' | 'anuncio' | 'publicacion' | 'comentario' | 'reporte' | 'usuario' | 'provincia' | 'archivo';
  entidad_id: string;
  titulo?: string;
}

export default function NuevaComunicacionPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const isAdmin = user?.rol === 'admin';
  const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams(''));

  const preselectedTipo = searchParams.get('entidad_tipo') || '';
  const preselectedId = searchParams.get('entidad_id') || '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [plantillaId, setPlantillaId] = useState<string>('');
  const [destinatario, setDestinatario] = useState<Recipient | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({ provincia: '', institucion: '', tema_principal: '', numero_sugerencias: '' });
  const [asunto, setAsunto] = useState('');
  const [cuerpo, setCuerpo] = useState('');
  const [entidades, setEntidades] = useState<EntidadAdjunta[]>([]);
  const [nuevaEntidad, setNuevaEntidad] = useState<EntidadAdjunta>({ entidad_tipo: 'sugerencia', entidad_id: '', titulo: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  useEffect(() => {
    if (!user) { router.replace('/admin/acceder'); return; }
    if (!isAdmin) { router.replace('/admin'); return; }
    if (preselectedTipo && preselectedId) {
      setEntidades([{ entidad_tipo: preselectedTipo as any, entidad_id: preselectedId }]);
    }
    fetchPlantillas();
  }, [user, isAdmin, router, preselectedTipo, preselectedId]);

  const fetchPlantillas = async () => {
    try {
      const res = await fetch('/api/admin/plantillas', { headers });
      const json = await res.json();
      if (json.success) setPlantillas(json.data as Plantilla[]);
    } catch { /* ignore */ }
  };

  const usarPlantilla = (id: string) => {
    setPlantillaId(id);
    const p = plantillasConContenido.find((x) => String(x.id) === id);
    if (!p) return;
    let a = p.asunto;
    let c = p.cuerpo;
    Object.entries(variables).forEach(([k, v]) => {
      a = a.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
      c = c.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
    });
    setAsunto(a);
    setCuerpo(c);
  };

  const reemplazarEnTiempoReal = (vars: Record<string, string>) => {
    if (!plantillaId) return;
    const p = plantillasConContenido.find((x) => String(x.id) === plantillaId);
    if (!p) return;
    let a = p.asunto;
    let c = p.cuerpo;
    Object.entries(vars).forEach(([k, v]) => {
      a = a.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
      c = c.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
    });
    setAsunto(a);
    setCuerpo(c);
  };

  const plantillasConContenido = plantillas.filter((p) =>
    p.tipo === 'institucional' &&
    p.asunto?.trim() &&
    p.cuerpo?.trim()
  );

  const guardar = async (comoEnviado: boolean) => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/comunicaciones', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantilla_id: plantillaId ? parseInt(plantillaId) : null,
          contacto_id: destinatario?.tipo_destinatario === 'institucional' ? destinatario.id : null,
          asunto,
          cuerpo,
          provincia: variables.provincia,
          institucion: destinatario?.nombre || variables.institucion,
          area: destinatario?.area,
          email_destino: destinatario?.email,
          entidades,
          variables,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error guardando comunicación');

      const id = json.data.id;
      if (comoEnviado) {
        await fetch(`/api/admin/comunicaciones/${id}/enviado`, {
          method: 'PATCH',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ modo: 'manual' }),
        });
      }

      setSuccess(comoEnviado ? 'Comunicación marcada como enviada.' : 'Borrador guardado correctamente.');
      setTimeout(() => router.push('/admin/comunicaciones'), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Megaphone className="w-7 h-7 text-orange-500" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">Nueva comunicación institucional</h1>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
          {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">{success}</div>}

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plantilla</label>
              <select
                value={plantillaId}
                onChange={(e) => usarPlantilla(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-black bg-white"
              >
                <option value="">Selecciona una plantilla (opcional)</option>
                {plantillasConContenido.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <RecipientInput
                tipo="todos"
                selected={destinatario}
                onSelect={setDestinatario}
                label="Destinatario institucional"
                placeholder="Escribe institución, área, provincia, email, admin o moderador..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                <input
                  value={variables.provincia}
                  onChange={(e) => {
                    const next = { ...variables, provincia: e.target.value };
                    setVariables(next);
                    reemplazarEnTiempoReal(next);
                  }}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institución</label>
                <input
                  value={variables.institucion}
                  onChange={(e) => {
                    const next = { ...variables, institucion: e.target.value };
                    setVariables(next);
                    reemplazarEnTiempoReal(next);
                  }}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tema principal</label>
                <input
                  value={variables.tema_principal}
                  onChange={(e) => {
                    const next = { ...variables, tema_principal: e.target.value };
                    setVariables(next);
                    reemplazarEnTiempoReal(next);
                  }}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de sugerencias</label>
                <input
                  value={variables.numero_sugerencias}
                  onChange={(e) => {
                    const next = { ...variables, numero_sugerencias: e.target.value };
                    setVariables(next);
                    reemplazarEnTiempoReal(next);
                  }}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
              <input
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuerpo</label>
              <textarea
                value={cuerpo}
                onChange={(e) => setCuerpo(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 text-sm border border-black bg-white"
              />
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Paperclip className="w-4 h-4" />
                Entidades adjuntas
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {entidades.map((ent, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 rounded bg-white border border-slate-300 px-2 py-1 text-xs">
                    {ent.entidad_tipo}: {ent.entidad_id}
                    <button onClick={() => setEntidades(entidades.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">×</button>
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={nuevaEntidad.entidad_tipo}
                  onChange={(e) => setNuevaEntidad({ ...nuevaEntidad, entidad_tipo: e.target.value as any })}
                    className="px-3 py-2 text-sm border border-black bg-white"
                  >
                    <option value="sugerencia">Sugerencia</option>
                    <option value="propuesta">Propuesta</option>
                    <option value="anuncio">Anuncio</option>
                    <option value="publicacion">Publicación</option>
                    <option value="comentario">Comentario</option>
                    <option value="reporte">Reporte</option>
                    <option value="usuario">Usuario</option>
                    <option value="provincia">Provincia</option>
                    <option value="archivo">Archivo</option>
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
                        setNuevaEntidad({ entidad_tipo: 'sugerencia', entidad_id: '', titulo: '' });
                      }
                    }}
                    className="px-3 py-2 text-sm bg-slate-800 text-white hover:bg-black"
                  >
                    Añadir
                  </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => guardar(false)}
                disabled={sending}
                className="inline-flex items-center gap-2 bg-black text-white border border-black px-6 py-2 text-sm hover:bg-orange-500 hover:text-black transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {sending ? 'Guardando...' : 'Guardar borrador'}
              </button>
              <button
                onClick={() => guardar(true)}
                disabled={sending || !destinatario}
                className="inline-flex items-center gap-2 bg-orange-500 text-white border border-orange-500 px-6 py-2 text-sm hover:bg-black hover:text-white transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Guardando...' : 'Marcar como enviada'}
              </button>
              {!destinatario && <span className="text-xs text-slate-500">Selecciona un destinatario para marcar como enviado.</span>}
            </div>

            {destinatario?.email && (
              <a
                href={`mailto:${encodeURIComponent(destinatario.email)}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-orange-600 hover:underline"
              >
                <FileText className="w-4 h-4" />
                Abrir borrador en el cliente de correo
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
