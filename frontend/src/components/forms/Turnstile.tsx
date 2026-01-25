'use client';

import { useEffect, useMemo, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => string;
      reset: (widgetId: string) => void;
    };
  }
}

export default function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const siteKey = useMemo(() => process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '', []);

  useEffect(() => {
    if (!siteKey) return;

    const scriptId = 'turnstile-script';
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!existing) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const el = ref.current;
    if (!el) return;

    let widgetId: string | null = null;

    const tryRender = () => {
      if (!window.turnstile || !ref.current) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token: string) => onToken(token),
      });
    };

    const interval = window.setInterval(tryRender, 250);

    return () => {
      window.clearInterval(interval);
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.reset(widgetId);
        } catch {
        }
      }
    };
  }, [siteKey, onToken]);

  if (!siteKey) {
    return null;
  }

  return <div ref={ref} />;
}
