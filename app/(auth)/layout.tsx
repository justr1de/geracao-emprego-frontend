import type React from 'react';
import CookieConsent from '@/components/CookieConsent';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <CookieConsent />
    </>
  );
}
