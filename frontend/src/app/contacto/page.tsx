'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    comunidadAutonoma: '',
    email: '',
    motivo: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const comunidades = [
    'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias', 'Cantabria',
    'Castilla-La Mancha', 'Castilla y León', 'Cataluña', 'Comunidad Valenciana',
    'Extremadura', 'Galicia', 'Madrid', 'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.comunidadAutonoma) {
      newErrors.comunidadAutonoma = 'La comunidad autónoma es obligatoria';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.motivo.trim()) {
      newErrors.motivo = 'El motivo de contacto es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({ nombre: '', comunidadAutonoma: '', email: '', motivo: '' });
    } catch (error) {
      setErrors({ general: 'Error al enviar el formulario. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-[80%] max-w-6xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Contacto</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Envíanos tu mensaje y te responderemos lo antes posible.</p>
        </div>

        <section className="mt-10 border border-black p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="nombre">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                    errors.nombre ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                  }`}
                  placeholder="Tu nombre completo"
                />
                {errors.nombre && (
                  <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="comunidadAutonoma">
                  Comunidad Autónoma *
                </label>
                <select
                  id="comunidadAutonoma"
                  name="comunidadAutonoma"
                  value={formData.comunidadAutonoma}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                    errors.comunidadAutonoma ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                  }`}
                >
                  <option value="">Selecciona tu comunidad</option>
                  {comunidades.map(comunidad => (
                    <option key={comunidad} value={comunidad}>
                      {comunidad}
                    </option>
                  ))}
                </select>
                {errors.comunidadAutonoma && (
                  <p className="mt-1 text-xs text-red-500">{errors.comunidadAutonoma}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="email">
                Correo electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                  errors.email ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                }`}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="motivo">
                Motivo de contacto *
              </label>
              <textarea
                id="motivo"
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all resize-none ${
                  errors.motivo ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                }`}
                placeholder="Describe detalladamente el motivo de tu contacto..."
              />
              {errors.motivo && (
                <p className="mt-1 text-xs text-red-500">{errors.motivo}</p>
              )}
            </div>

            {errors.general && (
              <div className="border border-red-500 p-3 text-red-500 text-sm">
                {errors.general}
              </div>
            )}

            {success && (
              <div className="border border-green-500 p-3 text-green-500 text-sm">
                ¡Mensaje enviado correctamente! Te responderemos pronto a hola@citypaj.es
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white border border-black px-8 py-3 font-sans text-sm hover:bg-orange-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        </section>

        <div className="mt-10 border border-black p-6">
          <h2 className="font-serif text-xl font-bold text-black mb-4">Información de contacto</h2>
          <div className="space-y-2">
            <p className="font-sans text-sm text-black">
              <span className="font-medium">Email:</span> hola@citypaj.es
            </p>
            <p className="font-sans text-sm text-black/80">
              Nos comprometemos a responder tu mensaje en un plazo máximo de 48 horas.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
