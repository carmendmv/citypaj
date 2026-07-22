'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

interface ComunidadData {
  id: number;
  nombre: string;
  provincias: string[];
}

const TEMAS = ['general', 'empleo', 'vivienda', 'ocio', 'cultura', 'participacion'];

export default function ComunidadNuevoPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [comunidades, setComunidades] = useState<ComunidadData[]>([]);
  const [ccaa, setCcaa] = useState('');
  const [provincia, setProvincia] = useState('');
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [tema, setTema] = useState('general');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarComunidades = async () => {
      try {
        const res = await fetch('/api/comunidad/provincias');
        const data = await res.json();
        if (data.success) setComunidades(data.data || []);
      } catch (err) {
        console.error('Error cargando comunidades:', err);
      }
    };
    cargarComunidades();
  }, []);

  const provinciasVisibles = comunidades.find((c) => c.nombre === ccaa)?.provincias || [];

  const guardar = async () => {
    setError(null);

    if (titulo.trim().length < 5) {
      setError('El título es obligatorio (mínimo 5 caracteres).');
      return;
    }

    if (contenido.trim().length < 20) {
      setError('El contenido es obligatorio (mínimo 20 caracteres).');
      return;
    }

    if (!ccaa || !provincia) {
      setError('Selecciona una comunidad autónoma y una provincia.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/comunidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: user?.id,
          titulo: titulo.trim(),
          contenido: contenido.trim(),
          provincia,
          tema
        })
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/comunidad/${data.data.id}`);
      } else {
        setError(data.error || 'No se pudo publicar el tema.');
      }
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Nueva publicación</h1>
          <p className="mt-2 text-gray-600">Comparte algo con tu comunidad provincial</p>
        </div>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="titulo">Título *</label>
              <input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Título de tu publicación"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comunidad autónoma *</label>
                <select
                  value={ccaa}
                  onChange={(e) => { setCcaa(e.target.value); setProvincia(''); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                >
                  <option value="">Selecciona...</option>
                  {comunidades.map((c) => (
                    <option key={c.id} value={c.nombre}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provincia *</label>
                <select
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  disabled={!ccaa}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="">{ccaa ? 'Selecciona provincia...' : 'Primero la CCAA'}</option>
                  {provinciasVisibles.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
              <select
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
              >
                {TEMAS.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contenido">Contenido *</label>
              <textarea
                id="contenido"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                placeholder="Describe lo que quieres compartir..."
              />
            </div>

            {error ? (
              <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={guardar}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Publicando...' : 'Publicar tema'}
              </button>
              <Link
                href="/comunidad"
                className="flex-1 text-center px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-full hover:border-gray-400 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
