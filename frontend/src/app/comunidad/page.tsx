import { Suspense } from 'react';
import ComunidadVista from '@/components/comunidad/ComunidadVista';

export default function ComunidadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ComunidadVista />
    </Suspense>
  );
}
