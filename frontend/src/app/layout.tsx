import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { TranslationProvider } from '@/contexts/TranslationContext'
import Providers from './providers';

export const metadata: Metadata = {
  title: 'CityPaj - Tu ciudad, tus anuncios, tu comunidad',
  description: 'Plataforma de anuncios juvenil inspirada en el CIPAJ, evolucionada para el siglo XXI',
  keywords: ['anuncios', 'juvenil', 'citypaj', 'comunidad', 'segunda mano', 'clases', 'empleo'],
  authors: [{ name: 'CityPaj Team' }],
  creator: 'CityPaj',
  publisher: 'CityPaj',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://citypaj.es'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CityPaj - Tu ciudad, tus anuncios, tu comunidad',
    description: 'Plataforma de anuncios juvenil inspirada en el CIPAJ',
    url: 'https://citypaj.es',
    siteName: 'CityPaj',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CityPaj',
    description: 'Plataforma de anuncios juvenil',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="antialiased">
        <div id="root">
          <TranslationProvider>
            <Providers>{children}</Providers>
          </TranslationProvider>
        </div>
      </body>
    </html>
  );
}
