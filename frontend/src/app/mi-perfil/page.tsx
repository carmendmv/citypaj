'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

export default function MiPerfilPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editComunidad, setEditComunidad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/acceder');
    } else {
      setEditNombre(user.nombre || '');
      setEditEmail(user.email || '');
      setEditComunidad(''); // Por ahora vacío hasta que se implemente en el usuario
    }
  }, [user, router]);

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Aquí iría la lógica para actualizar el perfil
      // Por ahora solo simulamos la actualización
      console.log('Guardando perfil:', { nombre: editNombre, email: editEmail, comunidad_autonoma: editComunidad });
      setIsEditing(false);
    } catch (err) {
      setError('Error al guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-[70%] max-w-6xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Mi perfil</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Gestiona tus datos y preferencias</p>
        </div>

        <section className="mt-10 border border-black p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-black">Datos básicos</h2>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-black text-white border border-black hover:bg-orange-500 hover:text-black transition-colors font-light text-sm"
            >
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>
          </div>
          
          {error && (
            <div className="mb-4 border border-red-500 p-3 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="font-sans text-xs text-gray-600 mb-2">Nombre</div>
              {isEditing ? (
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500 hover:border-orange-500"
                />
              ) : (
                <div className="font-sans text-sm text-black">{user.nombre}</div>
              )}
            </div>
            <div>
              <div className="font-sans text-xs text-gray-600 mb-2">Email</div>
              {isEditing ? (
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500 hover:border-orange-500"
                />
              ) : (
                <div className="font-sans text-sm text-black">{user.email}</div>
              )}
            </div>
            <div>
              <div className="font-sans text-xs text-gray-600 mb-2">Comunidad autónoma</div>
              {isEditing ? (
                <select
                  value={editComunidad}
                  onChange={(e) => setEditComunidad(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500 hover:border-orange-500"
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
              ) : (
                <div className="font-sans text-sm text-black">{editComunidad || '—'}</div>
              )}
            </div>
            <div>
              <div className="font-sans text-xs text-gray-600 mb-2">Teléfono (opcional)</div>
              <div className="font-sans text-sm text-black">—</div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          )}
        </section>

        <div className="mt-10 flex items-center gap-6">
          <Link
            href="/mis-anuncios"
            className="font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4"
          >
            Ir a Mis anuncios
          </Link>
          <Link
            href="/"
            className="font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4"
          >
            Volver
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
