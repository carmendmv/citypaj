'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Lightbulb,
  LogOut,
  Menu,
  X,
  Shield,
  Home,
  ExternalLink,
  Mail,
  BarChart3,
  ClipboardList,
  Building2,
  FileStack,
  Megaphone,
  CheckSquare,
  AlertTriangle,
  CalendarDays,
  Palette,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navBase = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/anuncios', icon: FileText, label: 'Anuncios' },
  { href: '/admin/comunidad', icon: MessageSquare, label: 'Comunidad' },
  { href: '/admin/sugerencias', icon: Lightbulb, label: 'Sugerencias' },
  { href: '/admin/mensajes', icon: Mail, label: 'Mensajes' },
  { href: '/admin/plantillas', icon: FileStack, label: 'Plantillas' },
  { href: '/admin/cultura', icon: Palette, label: 'Cultura' },
  { href: '/admin/calendario', icon: Calendar, label: 'Calendario' },
  { href: '/admin/agenda', icon: CalendarDays, label: 'Agenda' },
];

const navAdmin = [
  { href: '/admin/usuarios', icon: Users, label: 'Usuarios' },
  { href: '/admin/moderadores', icon: Shield, label: 'Moderadores' },
  { href: '/admin/instituciones/contactos', icon: Building2, label: 'Agenda' },
  { href: '/admin/comunicaciones', icon: Megaphone, label: 'Comunicaciones' },
  { href: '/admin/tareas', icon: CheckSquare, label: 'Tareas' },
  { href: '/admin/necesidades', icon: AlertTriangle, label: 'Necesidades' },
  { href: '/admin/estadisticas', icon: BarChart3, label: 'Estadísticas' },
  { href: '/admin/actividad', icon: ClipboardList, label: 'Logs' },
];

interface AdminNavProps {
  isAdmin: boolean;
}

export default function AdminNav({ isAdmin }: AdminNavProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = isAdmin ? [...navBase, ...navAdmin] : navBase;

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <aside className="bg-white border-r border-gray-200 w-full md:w-64 md:min-h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 md:justify-start">
        <Link href="/admin" className="flex items-center gap-2 text-black">
          <Shield className="w-6 h-6 text-orange-500" />
          <span className="font-serif text-lg font-bold">Admin CityPAJ</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 border border-gray-200 rounded"
          aria-label="Menú"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <nav className={`flex-1 p-4 space-y-1 ${mobileOpen ? 'block' : 'hidden md:block'}`}>
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-gray-200">
          <span className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Accesos
          </span>
          <Link
            href="/"
            className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <Home className="w-4 h-4" />
            Inicio
          </Link>
          <Link
            href="/anuncios"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <ExternalLink className="w-4 h-4" />
            Anuncios
          </Link>
          <Link
            href="/comunidad"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <ExternalLink className="w-4 h-4" />
            Comunidad
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 hidden md:block">
        <div className="mb-3 px-3">
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          <p className="text-xs font-medium text-orange-600 capitalize">{user?.rol}</p>
        </div>
        <button
          onClick={() => logout().then(() => window.location.href = '/')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
