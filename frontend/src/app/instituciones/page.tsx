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
      color: 'bg-blue-100 text-blue-700'
    },
    {
      icono: LayoutGrid,
      titulo: 'Recursos y oportunidades centralizadas',
      texto: 'Publica anuncios, ayudas, ofertas y convocatorias en un entorno común.',
      color: 'bg-violet-100 text-violet-700'
    },
    {
      icono: ShieldCheck,
      titulo: 'Comunidad moderada',
      texto: 'Gestiona contenido, reportes y conversaciones desde un panel de control.',
      color: 'bg-emerald-100 text-emerald-700'
    },
    {
      icono: BarChart3,
      titulo: 'Datos agregados',
      texto: 'Detecta problemas frecuentes y prepara informes para la toma de decisiones.',
      color: 'bg-sky-100 text-sky-700'
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
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950" />
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-medium text-blue-100">
                  <Globe className="w-4 h-4" />
                  <span>Para ayuntamientos, diputaciones y entidades públicas</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight tracking-tight">
                  Escuchar a la juventud también es construir territorio.
                </h1>

                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
                  CityPAJ ayuda a instituciones públicas a conectar con jóvenes, ordenar recursos locales y detectar necesidades reales por territorio.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => scrollTo(contactoRef)}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-900 font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Solicitar demo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollTo(comoFuncionaRef)}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
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
                      <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-emerald-300" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Participación juvenil</div>
                        <div className="text-2xl font-bold">Voz + territorio</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[ 'Sugerencias recibidas', 'Recursos publicados', 'Comunidad moderada' ].map((etiqueta, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                          <span className="text-sm text-slate-300">{etiqueta}</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-600/30 to-violet-600/30 border border-white/10">
                      <p className="text-sm text-blue-100 leading-relaxed">
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
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-4">
              ¿Qué aporta CityPAJ?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Una plataforma para escuchar, ordenar y actuar sobre las necesidades juveniles del territorio.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((v) => (
              <div
                key={v.titulo}
                className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl ${v.color} flex items-center justify-center mb-5`}>
                  <v.icono className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{v.titulo}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{v.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEMA ACTUAL */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-sm font-semibold tracking-wider text-blue-700 uppercase">El reto</span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
                  La información juvenil está dispersa
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Muchas instituciones tienen dificultades para saber qué preocupa realmente a los jóvenes. Los canales están repartidos entre redes sociales, formularios aislados, webs poco consultadas y conversaciones informales.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Eso dificulta detectar patrones, priorizar necesidades y medir el impacto de las políticas públicas juveniles.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 to-emerald-100/50 rounded-3xl" />
                <div className="relative p-8 grid grid-cols-2 gap-4">
                  {[
                    { icono: MessageSquare, titulo: 'Redes sociales', desc: 'Conversación fragmentada' },
                    { icono: FileText, titulo: 'Formularios', desc: 'Respuestas aisladas' },
                    { icono: Globe, titulo: 'Webs oficiales', desc: 'Poco consultadas' },
                    { icono: Users, titulo: 'Canales informales', desc: 'Difíciles de trazar' }
                  ].map((item) => (
                    <div key={item.titulo} className="p-4 rounded-2xl bg-white/80 backdrop-blur border border-slate-100 shadow-sm text-center">
                      <item.icono className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                      <div className="font-semibold text-slate-900 text-sm">{item.titulo}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
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
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-4">
              Cómo funciona
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              CityPAJ centraliza anuncios, recursos, comunidad, sugerencias, propuestas y participación juvenil por provincia o municipio.
            </p>
          </div>

          <div className="relative bg-white rounded-3xl border border-slate-100 shadow-sm p-8 lg:p-12">
            <div className="hidden lg:flex absolute top-1/2 left-8 right-8 h-0.5 -translate-y-1/2 bg-slate-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
              {[
                { titulo: 'Jóvenes', desc: 'Participan', color: 'bg-emerald-100 text-emerald-700' },
                { titulo: 'CityPAJ', desc: 'Recoge y ordena', color: 'bg-blue-100 text-blue-700' },
                { titulo: 'Recursos / Comunidad / Sugerencias', desc: 'Clasifica por territorio', color: 'bg-violet-100 text-violet-700' },
                { titulo: 'Moderación', desc: 'Control y trazabilidad', color: 'bg-sky-100 text-sky-700' },
                { titulo: 'Institución', desc: 'Información útil', color: 'bg-indigo-100 text-indigo-700' }
              ].map((paso, i, arr) => (
                <div key={paso.titulo} className="relative text-center">
                  <div className={`w-14 h-14 mx-auto rounded-2xl ${paso.color} flex items-center justify-center text-lg font-bold mb-4 shadow-sm z-10 relative`}>
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 text-sm">{paso.titulo}</h3>
                  <p className="text-xs text-slate-500">{paso.desc}</p>
                  {i < arr.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-5 -right-6 w-5 h-5 text-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FUNCIONALIDADES */}
        <section className="py-20 lg:py-28 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-14">
              <span className="text-sm font-semibold tracking-wider text-emerald-400 uppercase">Funcionalidades</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-3 mb-4">
                Herramientas pensadas para equipos públicos
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Un entorno profesional para gestionar la participación juvenil sin perder el control.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
              {funcionalidades.map((f) => (
                <div key={f} className="flex items-start gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MODERACIÓN */}
        <section className="py-20 lg:py-28 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                {[
                  { titulo: 'Publicaciones', estado: 'Aprobadas', color: 'bg-emerald-100 text-emerald-700' },
                  { titulo: 'Reportes', estado: 'Pendientes', color: 'bg-orange-100 text-orange-700' },
                  { titulo: 'Conversaciones', estado: 'Moderadas', color: 'bg-blue-100 text-blue-700' },
                  { titulo: 'Anuncios', estado: 'Verificados', color: 'bg-violet-100 text-violet-700' }
                ].map((item) => (
                  <div key={item.titulo} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-slate-500" />
                      <span className="font-medium text-slate-900">{item.titulo}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.color}`}>
                      {item.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <span className="text-sm font-semibold tracking-wider text-blue-700 uppercase">Moderación</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
                Control, trazabilidad y responsabilidad
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                La plataforma permite moderar publicaciones, reportes, anuncios y conversaciones para mantener un entorno seguro y útil para la juventud y las instituciones.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Cada acción queda registrada, facilita la rendición de cuentas y evita la opacidad en la gestión del contenido.
              </p>
            </div>
          </div>
        </section>

        {/* IMPACTO SOCIAL */}
        <section className="py-20 lg:py-28 bg-stone-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-4">
                De la conversación a la detección
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                CityPAJ ayuda a identificar temas que importan a la juventud, más allá de los anuncios.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {impacto.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
                >
                  <item.icono className="w-6 h-6 text-blue-700" />
                  <span className="font-medium text-slate-900 text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL / FORMULARIO */}
        <section ref={contactoRef} className="py-20 lg:py-28 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <span className="text-sm font-semibold tracking-wider text-blue-700 uppercase">Contacto</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
                Convierte la escucha joven en acción territorial.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Si tu institución quiere explorar cómo CityPAJ puede ayudaros a escuchar, ordenar y responder, escríbenos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => contactoRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors"
                >
                  Solicitar demo
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/buzon-sugerencias"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Ver buzón de sugerencias
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
              {enviado ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Solicitud enviada</h3>
                  <p className="text-slate-600">Gracias por tu interés. Nos pondremos en contacto contigo pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
                      <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Institución</label>
                      <input
                        type="text"
                        required
                        value={formData.institucion}
                        onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                        placeholder="Ayuntamiento, diputación..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Cargo</label>
                      <input
                        type="text"
                        required
                        value={formData.cargo}
                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                        placeholder="Área de juventud"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Mensaje</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                      placeholder="Cuéntanos tus necesidades..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Contactar
                  </button>
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
