import type React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { AppProvider } from '@/contexts/AppContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  title: 'Geração Emprego - Encontre seu emprego em Rondônia',
  description:
    'Plataforma gratuita do Governo de Rondônia para conectar trabalhadores e empresas. Cadastre seu currículo, encontre vagas e faça cursos de qualificação.',
  keywords: ['emprego', 'vagas', 'rondônia', 'currículo', 'trabalho', 'cursos gratuitos'],
  authors: [{ name: 'Governo do Estado de Rondônia' }],
  openGraph: {
    title: 'Geração Emprego - Encontre seu emprego em Rondônia',
    description: 'Plataforma gratuita para conectar trabalhadores e empresas em Rondônia.',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <AppProvider>{children}</AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
