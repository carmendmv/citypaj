'use client';

import { useMemo } from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { useCustomTranslation } from '@/contexts/CustomTranslationContext';
import Turnstile from './Turnstile';

export default function HumanVerification({
  token,
  onToken,
}: {
  token: string;
  onToken: (token: string) => void;
}) {
  const { t } = useCustomTranslation();
  const enabled = useMemo(() => Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY), []);
  const verified = Boolean(token);

  if (!enabled) {
    return (
      <div className="border border-black/50 border-dashed p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-black" aria-hidden="true" />
          <div className="font-sans text-sm text-black">{t('human.title', 'Verificación humana')}</div>
        </div>
        <div className="mt-2 font-sans text-xs text-[#666666]">{t('human.disabled', 'La verificación automática está desactivada en este entorno.')}</div>
      </div>
    );
  }

  return (
    <div className={`border p-4 ${verified ? 'border-black' : 'border-orange-500'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {verified ? (
            <ShieldCheck className="w-4 h-4 text-black" aria-hidden="true" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-black" aria-hidden="true" />
          )}
          <div className="font-sans text-sm text-black">{t('human.title', 'Verificación humana')}</div>
        </div>
        <div className="font-sans text-xs text-[#666666]">
          {verified ? t('human.verified', 'Verificado') : t('human.required', 'Requerido')}
        </div>
      </div>

      <div className="mt-3">
        <Turnstile onToken={onToken} />
      </div>

      {!verified ? (
        <div className="mt-3 font-sans text-xs text-[#666666]">{t('human.hint', 'Marca la casilla para continuar.')}</div>
      ) : null}
    </div>
  );
}
