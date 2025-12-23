'use client';

import { useState, useEffect, useCallback } from 'react';
import { Phone, MessageSquare, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { sendVerificationCode, verifyCode, cleanupRecaptcha } from '@/lib/firebase';
import styles from './index.module.css';

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerified: (phoneNumber: string, firebaseUid?: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

type VerificationStep = 'input' | 'sending' | 'verify' | 'verifying' | 'success' | 'error';

export default function PhoneVerification({ 
  phoneNumber, 
  onVerified, 
  onError,
  onCancel 
}: PhoneVerificationProps) {
  const [step, setStep] = useState<VerificationStep>('input');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Formatar número para exibição
  const formatDisplayPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  // Countdown para reenvio
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Limpar recursos ao desmontar
  useEffect(() => {
    return () => {
      cleanupRecaptcha();
    };
  }, []);

  // Enviar código SMS
  const handleSendCode = useCallback(async () => {
    setStep('sending');
    setError(null);

    const result = await sendVerificationCode(phoneNumber, 'recaptcha-container');

    if (result.success) {
      setStep('verify');
      setCountdown(60); // 60 segundos para reenvio
      setAttempts(prev => prev + 1);
    } else {
      setStep('error');
      setError(result.error || 'Erro ao enviar código');
      onError?.(result.error || 'Erro ao enviar código');
    }
  }, [phoneNumber, onError]);

  // Verificar código
  const handleVerifyCode = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Digite o código completo de 6 dígitos');
      return;
    }

    setStep('verifying');
    setError(null);

    const result = await verifyCode(fullCode);

    if (result.success) {
      setStep('success');
      // Aguardar animação de sucesso
      setTimeout(() => {
        onVerified(phoneNumber, result.user?.uid);
      }, 1500);
    } else {
      setStep('verify');
      setError(result.error || 'Código inválido');
      setCode(['', '', '', '', '', '']);
      // Focar no primeiro input
      const firstInput = document.querySelector<HTMLInputElement>('[data-code-index="0"]');
      firstInput?.focus();
    }
  };

  // Gerenciar input do código
  const handleCodeInput = (index: number, value: string) => {
    // Permitir apenas números
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = numericValue;
      setCode(newCode);

      // Auto-avançar para próximo input
      if (numericValue && index < 5) {
        const nextInput = document.querySelector<HTMLInputElement>(`[data-code-index="${index + 1}"]`);
        nextInput?.focus();
      }

      // Auto-verificar quando completar
      if (numericValue && index === 5) {
        const fullCode = [...newCode.slice(0, 5), numericValue].join('');
        if (fullCode.length === 6) {
          setTimeout(() => handleVerifyCode(), 300);
        }
      }
    } else if (numericValue.length === 6) {
      // Colar código completo
      const newCode = numericValue.split('');
      setCode(newCode);
      setTimeout(() => handleVerifyCode(), 300);
    }
  };

  // Gerenciar teclas especiais
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.querySelector<HTMLInputElement>(`[data-code-index="${index - 1}"]`);
      prevInput?.focus();
    }
  };

  // Reenviar código
  const handleResend = () => {
    if (countdown === 0) {
      setCode(['', '', '', '', '', '']);
      handleSendCode();
    }
  };

  return (
    <div className={styles.container}>
      {/* Container invisível do reCAPTCHA */}
      <div id="recaptcha-container" className={styles.recaptchaContainer}></div>

      {/* Etapa: Input inicial */}
      {step === 'input' && (
        <div className={styles.stepContent}>
          <div className={styles.iconWrapper}>
            <Phone size={32} />
          </div>
          <h3 className={styles.title}>Verificar Telefone</h3>
          <p className={styles.description}>
            Enviaremos um código SMS para o número:
          </p>
          <p className={styles.phoneDisplay}>
            {formatDisplayPhone(phoneNumber)}
          </p>
          <div className={styles.actions}>
            <button 
              className={styles.primaryButton}
              onClick={handleSendCode}
            >
              <MessageSquare size={18} />
              Enviar Código SMS
            </button>
            {onCancel && (
              <button 
                className={styles.secondaryButton}
                onClick={onCancel}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Etapa: Enviando */}
      {step === 'sending' && (
        <div className={styles.stepContent}>
          <div className={styles.iconWrapper}>
            <Loader2 size={32} className={styles.spinner} />
          </div>
          <h3 className={styles.title}>Enviando código...</h3>
          <p className={styles.description}>
            Aguarde enquanto enviamos o SMS para seu telefone.
          </p>
        </div>
      )}

      {/* Etapa: Verificar código */}
      {step === 'verify' && (
        <div className={styles.stepContent}>
          <div className={styles.iconWrapper}>
            <MessageSquare size={32} />
          </div>
          <h3 className={styles.title}>Digite o código</h3>
          <p className={styles.description}>
            Enviamos um código de 6 dígitos para:
          </p>
          <p className={styles.phoneDisplay}>
            {formatDisplayPhone(phoneNumber)}
          </p>

          <div className={styles.codeInputs}>
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                data-code-index={index}
                className={styles.codeInput}
                onChange={(e) => handleCodeInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={(e) => e.target.select()}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className={styles.actions}>
            <button 
              className={styles.primaryButton}
              onClick={handleVerifyCode}
              disabled={code.join('').length !== 6}
            >
              Verificar Código
            </button>
            
            <button 
              className={styles.resendButton}
              onClick={handleResend}
              disabled={countdown > 0}
            >
              <RefreshCw size={16} />
              {countdown > 0 
                ? `Reenviar em ${countdown}s` 
                : 'Reenviar código'
              }
            </button>
          </div>

          {attempts > 2 && (
            <p className={styles.helpText}>
              Não recebeu o SMS? Verifique se o número está correto ou tente novamente em alguns minutos.
            </p>
          )}
        </div>
      )}

      {/* Etapa: Verificando */}
      {step === 'verifying' && (
        <div className={styles.stepContent}>
          <div className={styles.iconWrapper}>
            <Loader2 size={32} className={styles.spinner} />
          </div>
          <h3 className={styles.title}>Verificando...</h3>
          <p className={styles.description}>
            Aguarde enquanto validamos o código.
          </p>
        </div>
      )}

      {/* Etapa: Sucesso */}
      {step === 'success' && (
        <div className={styles.stepContent}>
          <div className={`${styles.iconWrapper} ${styles.success}`}>
            <CheckCircle size={32} />
          </div>
          <h3 className={styles.title}>Telefone Verificado!</h3>
          <p className={styles.description}>
            Seu número foi verificado com sucesso.
          </p>
        </div>
      )}

      {/* Etapa: Erro */}
      {step === 'error' && (
        <div className={styles.stepContent}>
          <div className={`${styles.iconWrapper} ${styles.error}`}>
            <AlertCircle size={32} />
          </div>
          <h3 className={styles.title}>Erro ao enviar</h3>
          <p className={styles.description}>
            {error || 'Ocorreu um erro ao enviar o código SMS.'}
          </p>
          <div className={styles.actions}>
            <button 
              className={styles.primaryButton}
              onClick={handleSendCode}
            >
              Tentar Novamente
            </button>
            {onCancel && (
              <button 
                className={styles.secondaryButton}
                onClick={onCancel}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
