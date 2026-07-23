'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCustomTranslation } from '@/contexts/CustomTranslationContext';

type Categoria = 'ocio' | 'servicios' | 'educacion' | 'empleo' | 'intercambios';

export default function PublicarPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const { t } = useCustomTranslation();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('ocio');

  const [nombre, setNombre] = useState('');
  const [comunidadAutonoma, setComunidadAutonoma] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [acceptedRules, setAcceptedRules] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resultado, setResultado] = useState<{ id?: string; estado?: string; motivo?: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

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
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.success) {
        setError(json?.error || 'Error al publicar el anuncio.');
        return;
      }

      const estado = json?.data?.estado_moderacion;
      const motivo = json?.data?.motivo_rechazo;

      if (estado === 'rejected') {
        setError(motivo || 'No se ha podido publicar el anuncio.');
        return;
      }

      setResultado({
        id: json?.data?.id,
        estado,
        motivo
      });
      setSuccess(true);
      setShowModal(true);
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
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">{t('publish.title', 'Publicar anuncio')}</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">{t('publish.subtitle', 'Comparte tu anuncio con la comunidad juvenil')}</p>
        </div>

        {showModal && resultado ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md border border-black bg-white p-6 shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center border border-black bg-black text-white">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-black mb-2">{t('publish.received_title', 'Anuncio recibido')}</h2>
              <p className="font-sans text-sm text-gray-700 mb-4">
                {t('publish.received_text', 'Revisado por IA interna. Se publicará en breve.')}
              </p>
              <div className="space-y-2 font-sans text-sm text-black border border-gray-200 p-3 mb-4">
                {resultado.id ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('publish.code', 'Código')}:</span>
                    <span className="font-medium">{resultado.id}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('publish.email_label', 'Correo')}:</span>
                  <span className="font-medium">{email}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {resultado.id ? (
                  <Link
                    href={`/anuncios/${resultado.id}`}
                    className="flex-1 text-center bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
                  >
                    {t('publish.view_ad', 'Ver anuncio')}
                  </Link>
                ) : null}
                <button
                  onClick={() => {
                    setShowModal(false);
                    router.push('/');
                  }}
                  className="flex-1 text-center bg-white text-black border border-black px-6 py-3 font-sans text-sm hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  {t('publish.home', 'Volver al inicio')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <section className="mt-10 border border-black p-6">

            <div className="space-y-4">
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="titulo">
                  {t('publish.ad_title', 'Título del anuncio')}
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
                  {t('publish.description', 'Descripción detallada')}
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
                    {t('publish.category', 'Categoría')} *
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
                    {t('publish.name', 'Nombre')} *
                  </label>
                  <label className="block font-sans text-xs text-gray-600 mb-2 hidden sm:block" htmlFor="nombre">
                    {t('publish.name', 'Nombre')} *
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
                    {t('publish.community', 'Comunidad Autónoma')} *
                  </label>
                  <label className="block font-sans text-xs text-gray-600 mb-2 hidden sm:block" htmlFor="comunidad">
                    {t('publish.community', 'Comunidad Autónoma')} *
                  </label>
                  <select
                    id="comunidad"
                    value={comunidadAutonoma}
                    onChange={(e) => setComunidadAutonoma(e.target.value)}
                    className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                      error && !comunidadAutonoma.trim() ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                    }`}
                  >
                    <option value="">{t('publish.community', 'Comunidad Autónoma')}</option>
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
                    {t('publish.email', 'Correo electrónico')}
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
                    {t('publish.phone', 'Teléfono (opcional)')}
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
                <div className="font-serif text-base font-bold text-black">{t('publish.rules_title', 'Normas de publicación')}</div>
                <p className="mt-2 font-sans text-sm text-black/80 leading-relaxed">{t('publish.rules_text', 'Al publicar un anuncio, aceptas que el contenido sea apropiado y cumpla con las normas de la comunidad. Nos reservamos el derecho de eliminar contenido inapropiado.')}</p>

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
                  <span className="font-sans text-sm text-black">{t('publish.accept_rules', 'Acepto las normas de publicación')}</span>
                </label>
              </div>

              {error ? (
                <div className="border border-black p-3 font-sans text-sm text-black">{error}</div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => void onSubmit()}
                  disabled={loading || !acceptedRules}
                  className="flex-1 bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors disabled:opacity-50"
                >
                  {loading ? t('publish.publishing', 'Publicando...') : t('publish.publish', 'Publicar anuncio')}
                </button>
                <Link
                  href="/"
                  className="flex-1 text-center bg-white text-black border border-black px-6 py-3 font-sans text-sm hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  {t('common.cancel', 'Cancelar')}
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
