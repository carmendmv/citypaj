'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { COMUNIDADES, PROVINCIAS_POR_COMUNIDAD } from '@/lib/provinces';

export default function PublicarCulturaPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cartelUrl, setCartelUrl] = useState('');
  const [precio, setPrecio] = useState('');
  const [nombre, setNombre] = useState('');
  const [comunidadAutonoma, setComunidadAutonoma] = useState('');
  const [provincia, setProvincia] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [acceptedRules, setAcceptedRules] = useState(false);

  const [loading, setLoading] = useState(false);
  const [subiendoCartel, setSubiendoCartel] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resultado, setResultado] = useState<{ id?: string; estado?: string; motivo?: string } | null>(null);

  const provinciasDisponibles = comunidadAutonoma ? PROVINCIAS_POR_COMUNIDAD[comunidadAutonoma] || [] : [];

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setNombre(user.nombre || '');
    }
  }, [user]);

  const handleCartelUpload = async (file: File) => {
    setSubiendoCartel(true);
    try {
      const formData = new FormData();
      formData.append('imagen', file);
      const res = await fetch('/api/upload/imagen', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.success) {
        setCartelUrl(json.url);
      } else {
        setError(json.error || 'Error al subir el cartel.');
      }
    } catch {
      setError('Error al subir el cartel.');
    } finally {
      setSubiendoCartel(false);
    }
  };

  const onSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (!titulo.trim() || !descripcion.trim() || !nombre.trim() || !comunidadAutonoma.trim() || !provincia.trim() || !email.trim()) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    if (!acceptedRules) {
      setError('Debes aceptar las normas para publicar.');
      return;
    }

    setLoading(true);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const res = await fetch('/api/anuncios/publico', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          titulo,
          descripcion,
          categoria: 'cultura',
          subcategoria: 'Evento',
          cartel_url: cartelUrl || undefined,
          precio: precio ? Number(precio) : undefined,
          nombre,
          comunidad_autonoma: comunidadAutonoma,
          provincia,
          email,
          telefono: telefono || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.success) {
        setError(json?.error || 'Error al publicar el anuncio.');
        return;
      }

      setResultado({
        id: json?.data?.id,
        estado: json?.data?.estado_moderacion,
        motivo: json?.data?.motivo_rechazo,
      });
      setSuccess(true);
    } catch {
      setError('Error al publicar el anuncio. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="w-[90%] sm:w-[65%] max-w-6xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Publicar evento cultural</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Promociona conciertos, exposiciones, talleres y más.</p>
        </div>

        {success && resultado ? (
          <div className="mt-10 border border-black p-6 space-y-4">
            <h2 className="font-serif text-2xl font-bold text-black">
              {resultado.estado === 'approved' ? 'Publicado' : 'En revisión'}
            </h2>
            <p className="font-sans text-sm text-gray-700">
              {resultado.estado === 'approved'
                ? 'Tu evento cultural ya está visible para la comunidad.'
                : 'Tu anuncio está en revisión. En breve lo publicaremos si cumple las normas.'}
            </p>
            {resultado.id && (
              <Link
                href={`/anuncios/${resultado.id}`}
                className="inline-block bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
              >
                Ver anuncio
              </Link>
            )}
            <button
              onClick={() => router.push('/')}
              className="ml-2 bg-white text-black border border-black px-6 py-3 font-sans text-sm hover:text-orange-500 hover:border-orange-500 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        ) : (
          <section className="mt-10 border border-black p-6 space-y-6">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

            <div>
              <label className="block font-sans text-xs text-gray-600 mb-2">Título del evento *</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-sans text-xs text-gray-600 mb-2">Descripción *</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2">Cartel del evento (imagen)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleCartelUpload(file);
                  }}
                  className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
                />
                {subiendoCartel && <p className="text-xs text-gray-500 mt-1">Subiendo cartel...</p>}
                <input
                  value={cartelUrl}
                  onChange={(e) => setCartelUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 mt-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
                />
                {cartelUrl && (
                  <img src={cartelUrl} alt="Vista previa del cartel" className="mt-3 max-h-48 border border-black" />
                )}
              </div>
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2">Precio (€)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
                />
                <p className="mt-1 text-xs text-gray-500 font-sans">Dejar en 0 o vacío para eventos gratuitos.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2">Comunidad autónoma *</label>
                <select
                  value={comunidadAutonoma}
                  onChange={(e) => { setComunidadAutonoma(e.target.value); setProvincia(''); }}
                  className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Selecciona</option>
                  {COMUNIDADES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2">Provincia *</label>
                <select
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  disabled={!comunidadAutonoma}
                  className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500 disabled:bg-gray-100"
                >
                  <option value="">Selecciona</option>
                  {provinciasDisponibles.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2">Nombre *</label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2">Correo *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs text-gray-600 mb-2">Teléfono</label>
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="reglas"
                checked={acceptedRules}
                onChange={(e) => setAcceptedRules(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="reglas" className="font-sans text-xs text-gray-600">
                Acepto las normas de publicación y confirmo que el contenido es veraz.
              </label>
            </div>

            <button
              onClick={onSubmit}
              disabled={loading}
              className="bg-black text-white border border-black px-8 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Publicando...' : 'Publicar evento cultural'}
            </button>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
