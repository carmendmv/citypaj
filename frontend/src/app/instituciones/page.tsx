'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  MapPin,
  LayoutGrid,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  FileText,
  Megaphone,
  Users,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Home,
  Bus,
  Heart,
  GraduationCap,
  Palette,
  Music,
  CircleDollarSign,
  Globe
} from 'lucide-react';

export default function InstitucionesPage() {
  const contactoRef = useRef<HTMLDivElement>(null);
  const comoFuncionaRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    institucion: '',
    cargo: '',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setFormData({ nombre: '', email: '', institucion: '', cargo: '', mensaje: '' });
    setTimeout(() => setEnviado(false), 5000);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const valores = [
    {
      icono: MapPin,
      titulo: 'Escucha joven territorial',
      texto: 'Sigue las necesidades reales de la juventud organizadas por provincia o municipio.',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icono: LayoutGrid,
      titulo: 'Recursos y oportunidades centralizadas',
      texto: 'Publica anuncios, ayudas, ofertas y convocatorias en un entorno común.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icono: ShieldCheck,
      titulo: 'Comunidad moderada',
      texto: 'Gestiona contenido, reportes y conversaciones desde un panel de control.',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icono: BarChart3,
      titulo: 'Datos agregados',
      texto: 'Detecta problemas frecuentes y prepara informes para la toma de decisiones.',
      color: 'bg-violet-50 text-violet-600'
    }
  ];

  const funcionalidades = [
    'Panel de moderación',
    'Reportes de contenido',
    'Sugerencias ciudadanas',
    'Propuestas juveniles',
    'Recursos verificados',
    'Comunidad por provincia',
    'Filtros territoriales',
    'Estadísticas futuras',
    'Informes agregados',
    'Gestión de necesidades detectadas'
  ];

  const impacto = [
    { icono: Briefcase, label: 'Empleo' },
    { icono: Home, label: 'Vivienda' },
    { icono: Bus, label: 'Transporte' },
    { icono: Heart, label: 'Salud mental' },
    { icono: GraduationCap, label: 'Formación' },
    { icono: Palette, label: 'Cultura' },
    { icono: Music, label: 'Ocio' },
    { icono: CircleDollarSign, label: 'Ayudas' },
    { icono: Megaphone, label: 'Participación' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950" />
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-medium text-white">
                  <Globe className="w-4 h-4" />
                  <span>Para ayuntamientos, diputaciones y entidades públicas</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight tracking-tight">
                  Escuchar a la juventud también es construir territorio.
                </h1>

                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl">
                  CityPAJ ayuda a instituciones públicas a conectar con jóvenes, ordenar recursos locales y detectar necesidades reales por territorio.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => scrollTo(contactoRef)}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-blue-900 font-semibold hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    Solicitar demo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollTo(comoFuncionaRef)}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white font-semibold hover:bg-white/20 hover:text-white transition-colors"
                  >
                    Ver cómo funciona
                  </button>
                </div>
              </div>

              <div className="relative hidden lg:flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -inset-6 rounded-full border border-white/10" />
                  <div className="absolute -inset-12 rounded-full border border-white/5" />

                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-orange-300" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Participación juvenil</div>
                        <div className="text-2xl font-bold">Voz + territorio</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[ 'Sugerencias recibidas', 'Recursos publicados', 'Comunidad moderada' ].map((etiqueta, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                          <span className="text-sm text-gray-300">{etiqueta}</span>
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-500/30 to-slate-900/30 border border-white/10">
                      <p className="text-sm text-white leading-relaxed">
                        Visualización de ejemplo: un panel con la conversación joven de tu territorio en un solo lugar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLOQUE DE VALOR */}
        <section className="py-20 lg:py-28 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-4">
              ¿Qué aporta CityPAJ?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Una plataforma para escuchar, ordenar y actuar sobre las necesidades juveniles del territorio.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((v) => (
              <div
                key={v.titulo}
                className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl ${v.color} flex items-center justify-center mb-5`}>
                  <v.icono className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">{v.titulo}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEMA ACTUAL */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-sm font-semibold tracking-wider text-orange-500 uppercase">El reto</span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black leading-tight">
                  La información juvenil está dispersa
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Muchas instituciones tienen dificultades para saber qué preocupa realmente a los jóvenes. Los canales están repartidos entre redes sociales, formularios aislados, webs poco consultadas y conversaciones informales.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Eso dificulta detectar patrones, priorizar necesidades y medir el impacto de las políticas públicas juveniles.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-white rounded-3xl" />
                <div className="relative p-8 grid grid-cols-2 gap-4">
                  {[
                    { icono: MessageSquare, titulo: 'Redes sociales', desc: 'Conversación fragmentada' },
                    { icono: FileText, titulo: 'Formularios', desc: 'Respuestas aisladas' },
                    { icono: Globe, titulo: 'Webs oficiales', desc: 'Poco consultadas' },
                    { icono: Users, titulo: 'Canales informales', desc: 'Difíciles de trazar' }
                  ].map((item) => (
                    <div key={item.titulo} className="p-4 rounded-2xl bg-white/80 backdrop-blur border border-gray-100 shadow-sm text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                      <item.icono className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                      <div className="font-semibold text-black text-sm">{item.titulo}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUCIÓN */}
        <section ref={comoFuncionaRef} className="py-20 lg:py-28 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-4">
              Cómo funciona
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              CityPAJ centraliza anuncios, recursos, comunidad, sugerencias, propuestas y participación juvenil por provincia o municipio.
            </p>
          </div>

          <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-12">
            <div className="hidden lg:flex absolute top-1/2 left-8 right-8 h-0.5 -translate-y-1/2 bg-gray-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
              {[
                { titulo: 'Jóvenes', desc: 'Participan', color: 'bg-orange-500 text-white' },
                { titulo: 'CityPAJ', desc: 'Recoge y ordena', color: 'bg-blue-500 text-white' },
                { titulo: 'Recursos / Comunidad / Sugerencias', desc: 'Clasifica por territorio', color: 'bg-violet-500 text-white' },
                { titulo: 'Moderación', desc: 'Control y trazabilidad', color: 'bg-emerald-500 text-white' },
                { titulo: 'Institución', desc: 'Información útil', color: 'bg-slate-700 text-white' }
              ].map((paso, i, arr) => (
                <div key={paso.titulo} className="relative text-center">
                  <div className={`w-14 h-14 mx-auto rounded-full ${paso.color} flex items-center justify-center text-lg font-bold mb-4 shadow-md z-10 relative`}>
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-black mb-1 text-sm">{paso.titulo}</h3>
                  <p className="text-xs text-gray-500">{paso.desc}</p>
                  {i < arr.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-5 -right-6 w-5 h-5 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FUNCIONALIDADES */}
        <section className="py-20 lg:py-28 bg-black text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-14">
              <span className="text-sm font-semibold tracking-wider text-orange-500 uppercase">Funcionalidades</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-3 mb-4">
                Herramientas pensadas para equipos públicos
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Un entorno profesional para gestionar la participación juvenil sin perder el control.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
              {funcionalidades.map((f, idx) => (
                <div key={f} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-0.5 transition-all">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-white">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MODERACIÓN */}
        <section className="py-20 lg:py-28 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                {[
                  { titulo: 'Publicaciones', estado: 'Aprobadas', color: 'bg-white text-black border border-black' },
                  { titulo: 'Reportes', estado: 'Pendientes', color: 'bg-orange-100 text-orange-700' },
                  { titulo: 'Conversaciones', estado: 'Moderadas', color: 'bg-white text-black border border-black' },
                  { titulo: 'Anuncios', estado: 'Verificados', color: 'bg-white text-black border border-black' }
                ].map((item) => (
                  <div key={item.titulo} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-black">{item.titulo}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.color}`}>
                      {item.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <span className="text-sm font-semibold tracking-wider text-orange-500 uppercase">Moderación</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black leading-tight">
                Control, trazabilidad y responsabilidad
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                La plataforma permite moderar publicaciones, reportes, anuncios y conversaciones para mantener un entorno seguro y útil para la juventud y las instituciones.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Cada acción queda registrada, facilita la rendición de cuentas y evita la opacidad en la gestión del contenido.
              </p>
            </div>
          </div>
        </section>

        {/* IMPACTO SOCIAL */}
        <section className="py-20 lg:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-4">
                De la conversación a la detección
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                CityPAJ ayuda a identificar temas que importan a la juventud, más allá de los anuncios.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {impacto.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-orange-100 transition-all"
                >
                  <item.icono className="w-6 h-6 text-orange-500" />
                  <span className="font-medium text-black text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL / FORMULARIO */}
        <section ref={contactoRef} className="py-20 lg:py-28 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <span className="text-sm font-semibold tracking-wider text-orange-500 uppercase">Contacto</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black leading-tight">
                Convierte la escucha joven en acción territorial.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Si tu institución quiere explorar cómo CityPAJ puede ayudaros a escuchar, ordenar y responder, escríbenos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => contactoRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-black text-white font-semibold hover:bg-orange-500 transition-colors"
                >
                  Solicitar demo
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/buzon-sugerencias"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-black text-black font-semibold hover:bg-gray-100 transition-colors"
                >
                  Ver buzón de sugerencias
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
              {enviado ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 mx-auto rounded-full bg-white text-black border border-black flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">Solicitud enviada</h3>
                  <p className="text-gray-600">Gracias por tu interés. Nos pondremos en contacto contigo pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                      <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Institución</label>
                      <input
                        type="text"
                        required
                        value={formData.institucion}
                        onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                        placeholder="Ayuntamiento, diputación..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Cargo</label>
                      <input
                        type="text"
                        required
                        value={formData.cargo}
                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                        placeholder="Área de juventud"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensaje</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none resize-none"
                      placeholder="Cuéntanos tus necesidades..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-black text-white font-semibold hover:bg-orange-500 transition-colors"
                  >
                    Contactar
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Te responderemos en un plazo de 24-48 horas laborables.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
