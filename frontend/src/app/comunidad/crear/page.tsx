'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NombreModal from '@/components/comunidad/NombreModal';
import { TEMAS_COMUNIDAD } from '@/lib/comunidad';
import { COMUNIDADES } from '@/lib/provinces';
import SelectProvincia from '@/components/ui/SelectProvincia';

const NOMBRE_STORAGE_KEY = 'citypaj_nombre_comunidad';

export default function CrearConversacionPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [comunidadAutonoma, setComunidadAutonoma] = useState('');
  const [provincia, setProvincia] = useState('');
  const [tema, setTema] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem(NOMBRE_STORAGE_KEY);
      if (guardado) setNombre(guardado);
      else setMostrarModal(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) {
      setMostrarModal(true);
      return;
    }

    const tituloLimpio = titulo.trim();
    const contenidoLimpio = contenido.trim();

    if (tituloLimpio.length < 5) {
      setError('El título es demasiado corto.');
      return;
    }
    if (contenidoLimpio.length < 10) {
      setError('El contenido es demasiado corto.');
      return;
    }
    if (!comunidadAutonoma || !provincia || !tema) {
      setError('Comunidad autónoma, provincia y tema son obligatorios.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/comunidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: tituloLimpio,
          contenido: contenidoLimpio,
          provincia,
          tema,
          nombre_usuario: nombre
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/comunidad/publicacion/${data.data.id}`);
      } else {
        setError(data.error || 'No se ha podido publicar la conversación.');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const guardarNombre = (n: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(NOMBRE_STORAGE_KEY, n);
    }
    setNombre(n);
    setMostrarModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <Link href="/comunidad" className="text-sm text-blue-600 hover:underline">← Volver a comunidad</Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Abre una conversación</h1>
        <p className="text-gray-600 mb-8">Comparte una duda, una idea o una necesidad real de tu zona.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="¿Qué quieres hablar?"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              required
              minLength={5}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contenido</label>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Cuéntalo con detalle. Tu experiencia puede ayudar a otras personas."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
              required
              minLength={10}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Comunidad autónoma</label>
              <select
                value={comunidadAutonoma}
                onChange={(e) => { setComunidadAutonoma(e.target.value); setProvincia(''); }}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
              >
                <option value="">Selecciona CCAA</option>
                {COMUNIDADES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Provincia</label>
              <SelectProvincia
                comunidadAutonoma={comunidadAutonoma}
                provincia={provincia}
                onProvinciaChange={setProvincia}
                placeholder="Selecciona provincia"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tema</label>
              <select
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                required
              >
                <option value="">Elige un tema</option>
                {TEMAS_COMUNIDAD.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {nombre && (
            <p className="text-sm text-gray-600">
              Vas a publicar como <span className="font-semibold text-gray-900">{nombre}</span>.
              <button type="button" onClick={() => setMostrarModal(true)} className="ml-2 text-blue-600 hover:underline text-xs">Cambiar</button>
            </p>
          )}

          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">Normas básicas</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Respeta a las demás personas.</li>
              <li>No publiques datos personales.</li>
              <li>Usa un lenguaje claro y constructivo.</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition-colors disabled:opacity-60"
            >
              {loading ? 'Publicando...' : 'Publicar conversación'}
            </button>
          </div>
        </form>
      </main>
      <Footer />

      <NombreModal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onSubmit={guardarNombre}
        title="¿Cómo quieres publicar?"
      />
    </div>
  );
}
