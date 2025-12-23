'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, RefreshCw, CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import styles from './page.module.css';

function ConfirmarEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [countdown, setCountdown] = useState(0);

  // Countdown para reenvio
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (countdown > 0 || !email) return;

    setIsResending(true);
    setResendStatus('idle');

    try {
      const response = await fetch('/api/auth/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendStatus('success');
        setCountdown(60); // 60 segundos de espera
      } else {
        setResendStatus('error');
      }
    } catch (error) {
      console.error('Erro ao reenviar e-mail:', error);
      setResendStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={20} />
          Voltar para página inicial
        </Link>
      </header>

      <main className={styles.main}>
        {/* Coluna esquerda - Logo Gov */}
        <div className={styles.sideColumn}>
          <Link href="https://www.ro.gov.br" target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/logos/governo-ro.png"
              alt="Governo de Rondônia"
              width={180}
              height={90}
              className={styles.govLogo}
            />
          </Link>
        </div>

        {/* Card central */}
        <div className={styles.card}>
          <div className={styles.iconContainer}>
            <Mail size={48} className={styles.mailIcon} />
          </div>

          <h1 className={styles.title}>Verifique seu e-mail</h1>
          
          <p className={styles.subtitle}>
            Enviamos um link de confirmação para:
          </p>
          
          <div className={styles.emailBox}>
            <Mail size={20} />
            <span>{email || 'seu-email@exemplo.com'}</span>
          </div>

          <div className={styles.instructions}>
            <h2 className={styles.instructionsTitle}>Próximos passos:</h2>
            <ol className={styles.stepsList}>
              <li>
                <CheckCircle size={18} className={styles.stepIcon} />
                <span>Abra sua caixa de entrada</span>
              </li>
              <li>
                <CheckCircle size={18} className={styles.stepIcon} />
                <span>Procure o e-mail do <strong>Geração Emprego</strong></span>
              </li>
              <li>
                <CheckCircle size={18} className={styles.stepIcon} />
                <span>Clique no link de confirmação</span>
              </li>
            </ol>
          </div>

          <div className={styles.infoBox}>
            <Clock size={18} />
            <p>O link expira em <strong>24 horas</strong>. Verifique também a pasta de spam.</p>
          </div>

          {/* Botão de reenvio */}
          <div className={styles.resendSection}>
            <p className={styles.resendText}>Não recebeu o e-mail?</p>
            
            <button
              onClick={handleResendEmail}
              disabled={isResending || countdown > 0}
              className={styles.resendBtn}
            >
              {isResending ? (
                <>
                  <RefreshCw size={18} className={styles.spinning} />
                  Enviando...
                </>
              ) : countdown > 0 ? (
                <>
                  <Clock size={18} />
                  Aguarde {countdown}s
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Reenviar e-mail
                </>
              )}
            </button>

            {resendStatus === 'success' && (
              <p className={styles.successMessage}>
                ✓ E-mail reenviado com sucesso!
              </p>
            )}

            {resendStatus === 'error' && (
              <p className={styles.errorMessage}>
                ✕ Erro ao reenviar. Tente novamente.
              </p>
            )}
          </div>

          {/* Links de ajuda */}
          <div className={styles.helpLinks}>
            <Link href="/login" className={styles.helpLink}>
              Já confirmei, fazer login
            </Link>
            <span className={styles.separator}>•</span>
            <Link href="/tipo-cadastro" className={styles.helpLink}>
              Cadastrar outro e-mail
            </Link>
          </div>
        </div>

        {/* Coluna direita - Logos SEDEC/SINE */}
        <div className={styles.sideColumn}>
          <Link href="https://www.sedec.ro.gov.br" target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/logos/sedec.png"
              alt="SEDEC"
              width={150}
              height={60}
              className={styles.partnerLogo}
            />
          </Link>
          <Link href="https://www.sine.ro.gov.br" target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/logos/sine.png"
              alt="SINE"
              width={150}
              height={60}
              className={styles.partnerLogo}
            />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Uma iniciativa do Governo de Rondônia</p>
        <p>SEDEC • SINE Estadual</p>
      </footer>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className={styles.container}>
      <div className={styles.main} style={{ justifyContent: 'center' }}>
        <div className={styles.card}>
          <div className={styles.iconContainer}>
            <Mail size={48} className={styles.mailIcon} />
          </div>
          <h1 className={styles.title}>Carregando...</h1>
          <p className={styles.subtitle}>Aguarde um momento.</p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmarEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfirmarEmailContent />
    </Suspense>
  );
}
