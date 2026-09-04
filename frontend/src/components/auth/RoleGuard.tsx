'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: string;
}

export function RoleGuard({ allowedRoles, children, fallback = '/' }: RoleGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user || !allowedRoles.includes(user.rol)) {
      router.push(fallback);
    }
  }, [isLoading, user, allowedRoles, fallback, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="font-sans text-sm text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.rol)) return null;

  return <>{children}</>;
}
