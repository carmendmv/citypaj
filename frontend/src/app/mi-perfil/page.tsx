'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Heart, FileText, Shield, LogOut } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useGuardados } from '@/hooks/useGuardados';
import { useCustomTranslation } from '@/contexts/CustomTranslationContext';

export default function MiPerfilPage() {
  const router = useRouter();
  const { user, accessToken, isLoading, logout } = useAuth();
  const { t } = useCustomTranslation();
  const { numeroGuardados } = useGuardados();
  const [isEditing, setIsEditing] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editComunidad, setEditComunidad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/acceder');
    } else {
      setEditNombre(user.nombre || '');
      setEditComunidad(''); // Por ahora vacío hasta que se implemente en el usuario
    }
  }, [isLoading, user, router]);

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken || ''}`
        },
        body: JSON.stringify({ nombre: editNombre })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSuccess(true);
        setIsEditing(false);
      } else {
        setError(json.error || 'Error al guardar los cambios');
      }
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

      <main className="w-[90%] sm:w-[80%] lg:w-[65%] max-w-6xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">{t('profile.title', 'Mi perfil')}</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Gestiona tus datos y preferencias</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/mis-anuncios" className="border border-black p-5 hover:bg-black hover:text-white transition-colors group">
            <FileText className="w-6 h-6 mb-3 text-orange-500 group-hover:text-orange-400" />
            <div className="font-serif text-lg font-bold">Mis anuncios</div>
            <div className="font-sans text-sm opacity-70">Publicaciones activas</div>
          </Link>
          <Link href="/guardados" className="border border-black p-5 hover:bg-black hover:text-white transition-colors group">
            <Heart className="w-6 h-6 mb-3 text-red-500 group-hover:text-red-400" />
            <div className="font-serif text-lg font-bold">Guardados</div>
            <div className="font-sans text-sm opacity-70">{numeroGuardados} anuncios guardados</div>
          </Link>
          {(user.rol === 'admin' || user.rol === 'moderador') && (
            <Link href="/moderador" className="border border-black p-5 hover:bg-black hover:text-white transition-colors group">
              <Shield className="w-6 h-6 mb-3 text-yellow-500 group-hover:text-yellow-400" />
              <div className="font-serif text-lg font-bold">Moderación</div>
              <div className="font-sans text-sm opacity-70">Panel de moderador</div>
            </Link>
          )}
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="border border-black p-5 text-left hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors group"
          >
            <LogOut className="w-6 h-6 mb-3" />
            <div className="font-serif text-lg font-bold">Cerrar sesión</div>
            <div className="font-sans text-sm opacity-70">Salir de la cuenta</div>
          </button>
        </div>

        <section className="mt-10 border border-black p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-black flex items-center gap-2">
              <User className="w-5 h-5" />
              Datos básicos
            </h2>
            <button
              type="button"
              onClick={() => { setIsEditing(!isEditing); setSuccess(false); setError(null); }}
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
          {success && (
            <div className="mb-4 border border-emerald-500 p-3 text-emerald-700 text-sm">
              Perfil actualizado correctamente.
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
              <div className="font-sans text-sm text-black">{user.email}</div>
            </div>
            <div>
              <div className="font-sans text-xs text-gray-600 mb-2">Rol</div>
              <div className="font-sans text-sm text-black capitalize">{user.rol || 'usuario'}</div>
            </div>
            <div>
              <div className="font-sans text-xs text-gray-600 mb-2">Verificado</div>
              <div className="font-sans text-sm text-black">{user.verificado ? 'Sí' : 'Pendiente'}</div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex gap-3">
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
      </main>

      <Footer />
    </div>
  );
}
