'use client';

import type React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';
import OnboardingTour from '@/components/OnboardingTour';
import { useAuthContext } from '@/contexts/AuthContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuthContext();
  
  // Mostrar tour apenas para candidatos logados ou visitantes
  const shouldShowTour = !loading && (!user || user?.user_metadata?.tipo_usuario === 1);

  return (
    <>
      <Header />
      <main id="main-content">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieConsent />
      {shouldShowTour && <OnboardingTour />}
    </>
  );
}
