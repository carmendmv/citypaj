'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HumanVerification from '@/components/forms/HumanVerification';
import { useAuth } from '@/context/AuthContext';

type Categoria = 'ocio' | 'servicios' | 'educacion' | 'empleo' | 'intercambios';

export default function PublicarPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('ocio');

  const [nombre, setNombre] = useState('');
  const [comunidadAutonoma, setComunidadAutonoma] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [acceptedRules, setAcceptedRules] = useState(false);

  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resultado, setResultado] = useState<{ id?: string; estado?: string; motivo?: string } | null>(null);

  const requiresCaptcha = useMemo(() => Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY), []);

  // Autocompletar datos del usuario
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setNombre(user.nombre || '');
      // El comunidad autónoma se podría autocompletar si está disponible en el usuario
    }
  }, [user]);

  const onSubmit = async () => {
    setError(null);
    setSuccess(false);
    setResultado(null);

    if (!titulo.trim() || !descripcion.trim() || !categoria || !nombre.trim() || !comunidadAutonoma.trim() || !email.trim()) {
      setError('Error al publicar el anuncio. Por favor, inténtalo de nuevo.');
      return;
    }

    if (!acceptedRules) {
      setError('Debes aceptar las normas para publicar un anuncio.');
      return;
    }

    if (requiresCaptcha && !turnstileToken) return;

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
          categoria,
          nombre,
          comunidad_autonoma: comunidadAutonoma,
          email,
          telefono: telefono || undefined,
          turnstile_token: turnstileToken || undefined,
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
        motivo: json?.data?.motivo_rechazo
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
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Publicar anuncio</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Comparte tu anuncio con la comunidad juvenil</p>
        </div>

        {success && resultado ? (
          <section className="mt-10 border border-black p-6">
            <h2 className="font-serif text-2xl font-bold text-black mb-4">
              {resultado.estado === 'rejected' ? 'Anuncio rechazado' : 'Anuncio recibido'}
            </h2>
            {resultado.estado === 'rejected' ? (
              <div className="space-y-3">
                <p className="font-sans text-sm text-red-600">
                  Nuestra IA ha detectado contenido inapropiado y no ha podido publicar el anuncio.
                </p>
                {resultado.motivo ? <p className="font-sans text-xs text-gray-600">{resultado.motivo}</p> : null}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="font-sans text-sm text-black">
                  Tu anuncio ha sido revisado por nuestra IA y publicado.
                </p>
                {resultado.id ? (
                  <Link
                    href={`/anuncios/${resultado.id}`}
                    className="inline-block bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
                  >
                    Ver anuncio
                  </Link>
                ) : null}
              </div>
            )}
            <button
              onClick={() => router.push('/')}
              className="mt-4 block w-full sm:w-auto text-center bg-white text-black border border-black px-6 py-3 font-sans text-sm hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              Volver al inicio
            </button>
          </section>
        ) : (
          <section className="mt-10 border border-black p-6">
            <div className="mb-6 border border-blue-200 bg-blue-50 p-4">
              <p className="font-sans text-sm text-blue-900">
                Tu anuncio será revisado por nuestra IA antes de publicarse para asegurar velocidad y agilidad.
                Si el contenido es apropiado, aparecerá publicado inmediatamente.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="titulo">
                  Título del anuncio
                </label>
                <input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                    error && !titulo.trim() ? 'border-red-500' : 'border-black focus:border-orange-500 hover:bg-gray-100'
                  }`}
                />
              </div>

              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="descripcion">
                  Descripción detallada
                </label>
                <textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={6}
                  className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                    error && !descripcion.trim() ? 'border-red-500' : 'border-black focus:border-orange-500 hover:bg-gray-100'
                  }`}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="categoria">
                    Categoría *
                  </label>
                  <select
                    id="categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as Categoria)}
                    className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                      error && !categoria ? 'border-red-500' : 'border-black focus:border-orange-500 hover:bg-gray-100'
                    }`}
                  >
                    <option value="ocio">Ocio</option>
                    <option value="servicios">Servicios</option>
                    <option value="educacion">Formación</option>
                    <option value="empleo">Empleo</option>
                    <option value="intercambios">Comunidad</option>
                  </select>
                </div>

                <div>
                  <label className="block font-sans text-xs text-gray-600 mb-2 sm:hidden" htmlFor="nombre-movil">
                    Nombre completo *
                  </label>
                  <label className="block font-sans text-xs text-gray-600 mb-2 hidden sm:block" htmlFor="nombre">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre-movil"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                      error && !nombre.trim() ? 'border-red-500' : 'border-black focus:border-orange-500 hover:bg-gray-100'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs text-gray-600 mb-2 sm:hidden" htmlFor="comunidad-movil">
                    Tu comunidad autónoma *
                  </label>
                  <label className="block font-sans text-xs text-gray-600 mb-2 hidden sm:block" htmlFor="comunidad">
                    Comunidad Autónoma *
                  </label>
                  <select
                    id="comunidad"
                    value={comunidadAutonoma}
                    onChange={(e) => setComunidadAutonoma(e.target.value)}
                    className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                      error && !comunidadAutonoma.trim() ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                    }`}
                  >
                    <option value="">Selecciona tu comunidad</option>
                    <option value="Andalucía">Andalucía</option>
                    <option value="Aragón">Aragón</option>
                    <option value="Asturias">Asturias</option>
                    <option value="Baleares">Baleares</option>
                    <option value="Canarias">Canarias</option>
                    <option value="Cantabria">Cantabria</option>
                    <option value="Castilla-La Mancha">Castilla-La Mancha</option>
                    <option value="Castilla y León">Castilla y León</option>
                    <option value="Cataluña">Cataluña</option>
                    <option value="Comunidad Valenciana">Comunidad Valenciana</option>
                    <option value="Extremadura">Extremadura</option>
                    <option value="Galicia">Galicia</option>
                    <option value="Madrid">Madrid</option>
                    <option value="Murcia">Murcia</option>
                    <option value="Navarra">Navarra</option>
                    <option value="País Vasco">País Vasco</option>
                    <option value="La Rioja">La Rioja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="email">
                    Correo electrónico (requerido)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                      error && !email.trim() ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="telefono">
                    Teléfono (opcional)
                  </label>
                  <input
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                      error && !telefono.trim() ? 'border-red-500' : 'border-black hover:border-orange-500'
                    }`}
                  />
                </div>
              </div>

              <div className="border border-black p-4">
                <div className="font-serif text-base font-bold text-black">Normas de publicación</div>
                <p className="mt-2 font-sans text-sm text-black/80 leading-relaxed">Al publicar un anuncio, aceptas que el contenido sea apropiado y cumpla con las normas de la comunidad. Nos reservamos el derecho de eliminar contenido inapropiado.</p>

                <label className="mt-3 flex items-start gap-3" htmlFor="rules">
                  <input
                    id="rules"
                    type="checkbox"
                    checked={acceptedRules}
                    onChange={(e) => setAcceptedRules(e.target.checked)}
                    className={`mt-1 w-4 h-4 border border-black focus:outline-none focus:bg-orange-100 hover:bg-orange-100 transition-all appearance-none ${
                      error && !acceptedRules ? 'border-red-500' : ''
                    }`}
                  />
                  <span className="font-sans text-sm text-black">Acepto las normas de publicación</span>
                </label>
              </div>

              <HumanVerification token={turnstileToken} onToken={(tok) => setTurnstileToken(tok)} />

              {error ? (
                <div className="border border-black p-3 font-sans text-sm text-black">{error}</div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => void onSubmit()}
                  disabled={loading || !acceptedRules || (requiresCaptcha && !turnstileToken)}
                  className="flex-1 bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Publicando...' : 'Publicar anuncio'}
                </button>
                <Link
                  href="/"
                  className="flex-1 text-center bg-white text-black border border-black px-6 py-3 font-sans text-sm hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  Cancelar
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
