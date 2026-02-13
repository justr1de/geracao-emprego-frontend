// @ts-nocheck
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Página /admin - Redireciona diretamente para o dashboard administrativo
 * O login foi removido para acesso direto ao painel.
 */
export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif',
      color: '#666'
    }}>
      <p>Redirecionando para o painel administrativo...</p>
    </div>
  );
}
