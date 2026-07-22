'use client';



import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import Link from 'next/link';

import { Bookmark, Share2, Flag, ArrowLeft, Mail, Phone, MapPin, Calendar, Eye, Copy } from 'lucide-react';

import Header from '@/components/layout/Header';

import Footer from '@/components/layout/Footer';



interface Anuncio {

  id: string;

  titulo: string;

  descripcion: string;

  categoria: string;

  comunidad_autonoma: string;

  provincia: string;

  creado_at: string;  // Cambiado de 'creado'

  actualizado_at: string;  // Cambiado de 'actualizado'

  vistas: number;

  usuario_nombre: string;

  usuario_email: string;  // Cambiado de 'email'

  telefono?: string;

  contacto_email: boolean;

  contacto_telefono: boolean;

  contacto_anonimo: boolean;

  imagenes?: Array<{

    id: string;

    url: string;

    url_thumbnail?: string;

    orden: number;

  }>;

}



interface ReportForm {

  motivo: string;

  descripcion: string;

}



export default function AnuncioDetallePage({ params }: { params: { id: string } }) {

  const router = useRouter();

  const { id } = params;



  const [anuncio, setAnuncio] = useState<Anuncio | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [showReportModal, setShowReportModal] = useState(false);

  const [reportForm, setReportForm] = useState<ReportForm>({ motivo: '', descripcion: '' });

  const [isSaved, setIsSaved] = useState(false);

  const [shareMessage, setShareMessage] = useState('');



  useEffect(() => {

    fetchAnuncio();

  }, [id]);



  const fetchAnuncio = async () => {

    try {

      const response = await fetch(`/api/anuncios/${id}`);

      const result = await response.json();

      

      if (result.success) {

        setAnuncio(result.data);

      } else {

        setError(result.message || 'Anuncio no encontrado');

      }

    } catch (err) {

      console.error('Error fetching anuncio:', err);

      setError(err instanceof Error ? err.message : 'Error desconocido');

    } finally {

      setLoading(false);

    }

  };



  const handleSave = async () => {

    try {

      // Obtener token del localStorage

      const authData = localStorage.getItem('citypaj_auth');

      if (!authData) {

        setShareMessage('Debes iniciar sesión para guardar anuncios');

        setTimeout(() => setShareMessage(''), 3000);

        return;

      }



      const { accessToken } = JSON.parse(authData);

      

      const response = await fetch('/api/anuncios/guardar', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

          'Authorization': `Bearer ${accessToken}`

        },

        body: JSON.stringify({ anuncio_id: id })

      });



      if (response.ok) {

        setIsSaved(!isSaved);

        setShareMessage(isSaved ? 'Anuncio eliminado de guardados' : 'Anuncio guardado correctamente');

      } else {

        const error = await response.json();

        setShareMessage(error.error || 'Error al guardar anuncio');

      }

    } catch (error) {

      console.error('Error guardando anuncio:', error);

      setShareMessage('Error al guardar anuncio');

    }

    setTimeout(() => setShareMessage(''), 3000);

  };



  const handleShare = async () => {

    try {

      const url = window.location.href;

      

      if (navigator.share) {

        // Usar Web Share API si está disponible

        await navigator.share({

          title: anuncio?.titulo || 'Anuncio en CityPaj',

          text: anuncio?.descripcion || 'Echa un vistazo a este anuncio',

          url: url

        });

        setShareMessage('Anuncio compartido correctamente');

      } else {

        // Copiar al portapapeles como fallback

        await navigator.clipboard.writeText(url);

        setShareMessage('Enlace copiado al portapapeles');

      }

    } catch (error) {

      console.error('Error compartiendo anuncio:', error);

      setShareMessage('Error al compartir anuncio');

    }

    setTimeout(() => setShareMessage(''), 3000);

  };



  const handleReport = async () => {

    if (!reportForm.motivo.trim()) {

      setShareMessage('Debes indicar un motivo para el reporte');

      setTimeout(() => setShareMessage(''), 3000);

      return;

    }



    try {

      const response = await fetch('/api/anuncios/reportar', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          anuncio_id: id,

          motivo: reportForm.motivo.trim(),

          descripcion: reportForm.descripcion.trim()

        })

      });



      if (response.ok) {

        setShareMessage('Anuncio reportado correctamente');

        setShowReportModal(false);

        setReportForm({ motivo: '', descripcion: '' });

      } else {

        const error = await response.json();

        setShareMessage(error.error || 'Error al reportar anuncio');

      }

    } catch (error) {

      console.error('Error reportando anuncio:', error);

      setShareMessage('Error al reportar anuncio');

    }

    setTimeout(() => setShareMessage(''), 3000);

  };



  const formatDate = (dateString: string) => {

    return new Date(dateString).toLocaleDateString('es-ES', {

      day: 'numeric',

      month: 'long',

      year: 'numeric'

    });

  };



  useEffect(() => {

    let cancelled = false;



    const run = async () => {

      setLoading(true);

      setError(null);



      const controller = new AbortController();

      const timeoutId = setTimeout(() => controller.abort(), 7000);



      try {

        const response = await fetch(`/api/anuncios/${id}`, {

          signal: controller.signal,

        });



        if (!response.ok) {

          setError('No se ha podido cargar el anuncio.');

          setAnuncio(null);

          return;

        }



        const json = await response.json();

        const data = json?.data as Anuncio | undefined;



        if (!cancelled) {

          setAnuncio(data || null);

        }

      } catch {

        if (!cancelled) {

          setError('No se ha podido cargar el anuncio.');

          setAnuncio(null);

        }

      } finally {

        clearTimeout(timeoutId);

        if (!cancelled) setLoading(false);

      }

    };



    void run();



    return () => {

      cancelled = true;

    };

  }, [id]);



  return (

    <div className="min-h-screen bg-white">

      <Header />



      <div className="w-[90%] sm:w-[80%] max-w-6xl mx-auto px-6 py-10">

        <div className="border-b border-black pb-6">

          <Link

            href="/"

            className="inline-block font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4"

          >

            Volver a anuncios

          </Link>



          {loading ? (

            <div className="mt-6 border border-black px-6 py-4 font-sans text-sm text-gray-700 inline-block">

              Cargando...

            </div>

          ) : error ? (

            <div className="mt-6 border border-black p-6">

              <p className="font-sans text-sm text-[#666666]">{error}</p>

            </div>

          ) : anuncio ? (

            <>

              <div className="mt-6 flex items-start justify-between gap-4">

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black leading-tight flex-1">

                  {anuncio.titulo}

                </h1>

                <div className="flex gap-2">

                  <button

                    onClick={handleShare}

                    className="p-2 border border-black hover:bg-gray-100 transition-colors bg-white"

                    title="Compartir anuncio"

                  >

                    <Share2 className="w-4 h-4" />

                  </button>

                  <button

                    onClick={() => setShowReportModal(true)}

                    className="p-2 border border-black hover:bg-gray-100 transition-colors bg-white"

                    title="Reportar anuncio"

                  >

                    <Flag className="w-4 h-4" />

                  </button>

                  <button

                    onClick={handleSave}

                    className={`p-2 border border-black hover:bg-gray-100 transition-colors ${

                      isSaved ? 'bg-orange-100' : 'bg-white'

                    }`}

                    title={isSaved ? 'Eliminar de guardados' : 'Guardar anuncio'}

                  >

                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-orange-500 text-orange-500' : ''}`} />

                  </button>

                </div>

              </div>



              <div className="mt-3 font-sans text-sm text-[#666666]">

                <span>{formatDate(anuncio.creado_at)}</span>

                {anuncio.comunidad_autonoma ? <span> · {anuncio.comunidad_autonoma}</span> : null}

                {anuncio.provincia ? <span> · {anuncio.provincia}</span> : null}

              </div>

            </>

          ) : (

            <div className="mt-6 border border-black p-6">

              <p className="font-sans text-sm text-[#666666]">Anuncio no encontrado.</p>

            </div>

          )}

        </div>



        {!loading && !error && anuncio ? (

          <div className="py-10">

            <section className="border border-black p-6">

              <h2 className="font-serif text-xl font-bold text-black">Descripción</h2>

              <p className="mt-4 font-sans text-base text-black/80 leading-relaxed whitespace-pre-line">

                {anuncio.descripcion}

              </p>

            </section>



            <section className="mt-8 border border-black p-6">

              <h2 className="font-serif text-xl font-bold text-black">Ubicación</h2>

              <div className="mt-4 font-sans text-sm text-black">

                <div className="flex items-center gap-2">

                  <MapPin className="w-4 h-4" />

                  <span>

                    {anuncio.provincia && `${anuncio.provincia}, `}

                    {anuncio.comunidad_autonoma}

                  </span>

                </div>

                                <div className="mt-2 flex items-center gap-2">

                  <Eye className="w-4 h-4" />

                  <span>{anuncio.vistas || 0} visualizaciones</span>

                </div>

                <div className="mt-2 flex items-center gap-2">

                  <Calendar className="w-4 h-4" />

                  <span>Publicado: {formatDate(anuncio.creado_at)}</span>

                </div>

              </div>

            </section>



            <section className="mt-8 border border-black p-6">

              <h2 className="font-serif text-xl font-bold text-black">Contacto</h2>



              <div className="mt-4 space-y-4 font-sans text-sm text-black">

                {/* Nombre del usuario - SIEMPRE visible */}

                <div>

                  <span className="font-medium">Publicado por:</span>{' '}

                  <span className="text-gray-900">{anuncio.usuario_nombre || 'Usuario'}</span>

                </div>



                {/* Email - SIEMPRE visible (obligatorio) */}

                <div>

                  <span className="font-medium">Email:</span>{' '}

                  <a href={`mailto:${anuncio.usuario_email || ''}`} className="hover:text-orange-500 text-blue-600">

                    {anuncio.usuario_email || 'email@ejemplo.com'}

                  </a>

                  <button

                    onClick={() => {

                      navigator.clipboard.writeText(anuncio.usuario_email || '');

                      setShareMessage('Email copiado al portapapeles');

                      setTimeout(() => setShareMessage(''), 3000);

                    }}

                    className="ml-2 px-2 py-1 text-xs border border-black hover:bg-gray-100 transition-colors bg-white"

                  >

                    Copiar

                  </button>

                </div>



                {/* Teléfono - Siempre visible, mostrando "No disponible" si no hay */}

                <div>

                  <span className="font-medium">Teléfono:</span>{' '}

                  {anuncio.contacto_telefono && anuncio.telefono ? (

                    <>

                      <a href={`tel:${anuncio.telefono}`} className="hover:text-orange-500 text-blue-600">

                        {anuncio.telefono}

                      </a>

                      <button

                        onClick={() => {

                          navigator.clipboard.writeText(anuncio.telefono || '');

                          setShareMessage('Teléfono copiado al portapapeles');

                          setTimeout(() => setShareMessage(''), 3000);

                        }}

                        className="ml-2 px-2 py-1 text-xs border border-black hover:bg-gray-100 transition-colors bg-white"

                      >

                        Copiar

                      </button>

                    </>

                  ) : (

                    <span className="text-gray-500">No disponible</span>

                  )}

                </div>



                {anuncio.contacto_anonimo && (

                  <div className="text-sm text-gray-600">

                    Contacto anónimo - Usa el formulario de contacto de la plataforma

                  </div>

                )}

              </div>

            </section>

          </div>

        ) : null}



        {/* Mensajes de acción */}

        {shareMessage && (

          <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 text-sm font-sans z-50">

            {shareMessage}

          </div>

        )}



        {/* Modal de reportar */}

        {showReportModal && (

          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <div className="bg-white border border-black p-6 w-full max-w-md">

              <h3 className="font-serif text-lg font-bold text-black mb-4">Reportar anuncio</h3>

              

              <div className="space-y-4">

                <div>

                  <label className="block font-sans text-sm text-gray-700 mb-2">

                    Motivo del reporte *

                  </label>

                  <select

                    value={reportForm.motivo}

                    onChange={(e) => setReportForm({ ...reportForm, motivo: e.target.value })}

                    className="w-full px-3 py-2 font-sans text-sm border border-black bg-white focus:outline-none focus:border-orange-500"

                  >

                    <option value="">Selecciona un motivo</option>

                    <option value="spam">Spam</option>

                    <option value="inapropiado">Contenido inapropiado</option>

                    <option value="fraude">Fraude o estafa</option>

                    <option value="duplicado">Anuncio duplicado</option>

                    <option value="otro">Otro</option>

                  </select>

                </div>



                <div>

                  <label className="block font-sans text-sm text-gray-700 mb-2">

                    Descripción adicional

                  </label>

                  <textarea

                    value={reportForm.descripcion}

                    onChange={(e) => setReportForm({ ...reportForm, descripcion: e.target.value })}

                    className="w-full px-3 py-2 font-sans text-sm border border-black bg-white focus:outline-none focus:border-orange-500"

                    rows={3}

                    placeholder="Describe el motivo del reporte..."

                  />

                </div>

              </div>



              <div className="flex gap-3 mt-6">

                <button

                  onClick={handleReport}

                  className="flex-1 bg-black text-white border border-black px-4 py-2 text-sm font-sans hover:bg-white hover:text-black transition-colors"

                >

                  Enviar reporte

                </button>

                <button

                  onClick={() => {

                    setShowReportModal(false);

                    setReportForm({ motivo: '', descripcion: '' });

                  }}

                  className="flex-1 bg-white text-black border border-black px-4 py-2 text-sm font-sans hover:bg-gray-100 transition-colors"

                >

                  Cancelar

                </button>

              </div>

            </div>

          </div>

        )}

      </div>



      <Footer />

    </div>

  );

}

