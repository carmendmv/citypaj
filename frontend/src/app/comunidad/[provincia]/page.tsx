import { Suspense } from 'react';
import ComunidadVista from '@/components/comunidad/ComunidadVista';

interface Props {
  params: { provincia: string };
}

export default function ComunidadProvinciaPage({ params }: Props) {
  const provincia = decodeURIComponent(params.provincia);
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ComunidadVista provinciaInicial={provincia} />
    </Suspense>
  );
}
