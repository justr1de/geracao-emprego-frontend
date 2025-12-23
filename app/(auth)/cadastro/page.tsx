'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  Building2, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  CreditCard,
  Eye,
  EyeOff,
  Shield,
  MessageSquare,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { sendVerificationCode, verifyCode, cleanupRecaptcha } from '@/lib/firebase';
import styles from './page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('candidate');
  const [showAssistantCode, setShowAssistantCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para verificação de telefone
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cpf: '',
    email: '',
    birthDate: '',
    gender: '',
    password: '',
    confirmPassword: '',
    assistantCode: '',
  });

  // Máscaras
  const formatCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  const formatPhone = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');

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

  // Enviar código SMS via Firebase
  const handleSendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!phone || phone.replace(/\D/g, '').length < 11) {
      setVerificationError('Digite um número de telefone válido');
      return;
    }

    setIsLoading(true);
    setVerificationError(null);

    const result = await sendVerificationCode(phone.replace(/\D/g, ''), 'recaptcha-container');

    setIsLoading(false);

    if (result.success) {
      setStep(2);
      setCountdown(60);
    } else {
      setVerificationError(result.error || 'Erro ao enviar código');
    }
  };

  // Verificar código SMS
  const handleVerifyCode = async () => {
    const fullCode = verificationCode.join('');
    
    if (fullCode.length !== 6) {
      setVerificationError('Digite o código completo de 6 dígitos');
      return;
    }

    setIsLoading(true);
    setVerificationError(null);

    const result = await verifyCode(fullCode);

    setIsLoading(false);

    if (result.success) {
      setFirebaseUid(result.user?.uid || null);
      setStep(3);
    } else {
      setVerificationError(result.error || 'Código inválido');
      setVerificationCode(['', '', '', '', '', '']);
      // Focar no primeiro input
      const firstInput = document.querySelector<HTMLInputElement>('[data-code-index="0"]');
      firstInput?.focus();
    }
  };

  // Gerenciar input do código
  const handleCodeInput = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = numericValue;
      setVerificationCode(newCode);

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
      setVerificationCode(newCode);
      setTimeout(() => handleVerifyCode(), 300);
    }
  };

  // Gerenciar teclas especiais
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.querySelector<HTMLInputElement>(`[data-code-index="${index - 1}"]`);
      prevInput?.focus();
    }
  };

  // Reenviar código
  const handleResend = () => {
    if (countdown === 0) {
      setVerificationCode(['', '', '', '', '', '']);
      handleSendCode();
    }
  };

  // Finalizar cadastro
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: phone.replace(/\D/g, ''),
          userType,
          firebaseUid,
          phoneVerified: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?registered=true');
      } else {
        alert(data.error || 'Erro ao criar conta');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Container invisível do reCAPTCHA */}
      <div id="recaptcha-container" style={{ position: 'absolute', left: '-9999px' }}></div>

      {/* Header com link de voltar */}
      <header className={styles.header}>
        <Link href="/" className={styles.backLink} aria-label="Voltar para página inicial">
          <ArrowLeft size={20} aria-hidden="true" />
          <span>Voltar</span>
        </Link>
      </header>

      {/* Conteúdo principal com 3 colunas */}
      <main className={styles.main}>
        {/* Coluna esquerda - Logo Governo RO */}
        <aside className={styles.sideColumn}>
          <a 
            href="https://www.rondonia.ro.gov.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.logoLink}
            aria-label="Acessar site do Governo de Rondônia"
          >
            <Image
              src="/logos/governo-ro.jpg"
              alt="Governo de Rondônia"
              width={180}
              height={180}
              className={styles.govLogo}
            />
          </a>
        </aside>

        {/* Coluna central - Formulário de cadastro */}
        <div className={styles.centerColumn}>
          <div className={styles.card}>
            {/* Logo Geração Emprego */}
            <div className={styles.logoContainer}>
              <Image
                src="/logos/geracao-emprego-logo.png"
                alt="Geração Emprego"
                width={200}
                height={80}
                className={styles.mainLogo}
                priority
              />
            </div>

            {/* Indicador de passos */}
            <div className={styles.stepIndicator}>
              <div className={`${styles.stepDot} ${step >= 1 ? styles.active : ''}`}>
                <span>1</span>
              </div>
              <div className={styles.stepLine}></div>
              <div className={`${styles.stepDot} ${step >= 2 ? styles.active : ''}`}>
                <span>2</span>
              </div>
              <div className={styles.stepLine}></div>
              <div className={`${styles.stepDot} ${step >= 3 ? styles.active : ''}`}>
                <span>3</span>
              </div>
            </div>

            {/* Passo 1 - WhatsApp */}
            {step === 1 && (
              <>
                <h1 className={styles.title}>Criar sua conta</h1>
                <p className={styles.subtitle}>Cadastre-se para acessar todas as oportunidades</p>

                {/* Botão Cadastro SouGov */}
                <button
                  type="button"
                  className={styles.sougovBtn}
                  onClick={() => router.push('/login/sougov')}
                  aria-label="Cadastrar com conta SouGov.br"
                >
                  <Image
                    src="/logos/sougov.png"
                    alt=""
                    width={24}
                    height={24}
                    className={styles.sougovLogo}
                    aria-hidden="true"
                  />
                  <span>Cadastrar com SouGov.br</span>
                </button>

                {/* Divisor */}
                <div className={styles.divider} role="separator">
                  <span>ou continue com WhatsApp</span>
                </div>

                <form onSubmit={handleSendCode} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="phone">WhatsApp</label>
                    <div className={styles.inputWrapper}>
                      <Phone size={20} className={styles.inputIcon} aria-hidden="true" />
                      <input 
                        id="phone"
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(formatPhone(e.target.value))} 
                        placeholder="(00) 00000-0000" 
                        maxLength={15} 
                        required 
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  {verificationError && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      {verificationError}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className={styles.primaryBtn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className={styles.spinner} />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <MessageSquare size={18} aria-hidden="true" />
                        Enviar Código SMS
                      </>
                    )}
                  </button>

                  <p className={styles.smsInfo}>
                    Você receberá um código de 6 dígitos por SMS para verificar seu número.
                  </p>

                  <p className={styles.loginLink}>
                    Já tem uma conta?{' '}
                    <Link href="/login">Fazer login</Link>
                  </p>
                </form>
              </>
            )}

            {/* Passo 2 - Verificação do código SMS */}
            {step === 2 && (
              <>
                <h1 className={styles.title}>Verificar código</h1>
                <p className={styles.subtitle}>
                  Digite o código de 6 dígitos enviado para:
                </p>
                <p className={styles.phoneHighlight}>{phone}</p>

                <div className={styles.codeInputs}>
                  {verificationCode.map((digit, index) => (
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

                {verificationError && (
                  <div className={styles.errorMessage}>
                    <AlertCircle size={16} />
                    {verificationError}
                  </div>
                )}

                <button 
                  className={styles.primaryBtn}
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.join('').length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className={styles.spinner} />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Check size={18} aria-hidden="true" />
                      Verificar Código
                    </>
                  )}
                </button>

                <button 
                  className={styles.resendBtn}
                  onClick={handleResend}
                  disabled={countdown > 0}
                >
                  <RefreshCw size={16} />
                  {countdown > 0 
                    ? `Reenviar em ${countdown}s` 
                    : 'Reenviar código'
                  }
                </button>

                <button 
                  type="button" 
                  className={styles.secondaryBtn} 
                  onClick={() => {
                    setStep(1);
                    setVerificationCode(['', '', '', '', '', '']);
                    setVerificationError(null);
                  }}
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                  Alterar número
                </button>
              </>
            )}

            {/* Passo 3 - Dados completos */}
            {step === 3 && (
              <>
                <h1 className={styles.title}>Complete seu perfil</h1>
                <p className={styles.subtitle}>
                  <Check size={16} className={styles.verifiedIcon} />
                  Telefone verificado! Agora preencha seus dados.
                </p>

                {/* Seleção de tipo de usuário */}
                <div className={styles.userTypeSelection}>
                  <button 
                    type="button"
                    className={`${styles.userTypeBtn} ${userType === 'candidate' ? styles.active : ''}`} 
                    onClick={() => setUserType('candidate')}
                    aria-pressed={userType === 'candidate'}
                  >
                    <User size={20} aria-hidden="true" />
                    <span>Candidato</span>
                  </button>
                  <button 
                    type="button"
                    className={`${styles.userTypeBtn} ${userType === 'company' ? styles.active : ''}`} 
                    onClick={() => setUserType('company')}
                    aria-pressed={userType === 'company'}
                  >
                    <Building2 size={20} aria-hidden="true" />
                    <span>Empresa</span>
                  </button>
                </div>

                <form onSubmit={handleFinalSubmit} className={styles.form}>
                  {/* Nome e Sobrenome */}
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="firstName">Nome</label>
                      <div className={styles.inputWrapper}>
                        <User size={20} className={styles.inputIcon} aria-hidden="true" />
                        <input 
                          id="firstName"
                          type="text" 
                          value={formData.firstName} 
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                          placeholder="Seu nome"
                          required 
                          autoComplete="given-name"
                        />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="lastName">Sobrenome</label>
                      <div className={styles.inputWrapper}>
                        <User size={20} className={styles.inputIcon} aria-hidden="true" />
                        <input 
                          id="lastName"
                          type="text" 
                          value={formData.lastName} 
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                          placeholder="Seu sobrenome"
                          required 
                          autoComplete="family-name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CPF e Data de Nascimento */}
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="cpf">CPF</label>
                      <div className={styles.inputWrapper}>
                        <CreditCard size={20} className={styles.inputIcon} aria-hidden="true" />
                        <input 
                          id="cpf"
                          type="text" 
                          value={formData.cpf} 
                          onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })} 
                          placeholder="000.000.000-00"
                          maxLength={14} 
                          required 
                        />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="birthDate">Data de Nascimento</label>
                      <div className={styles.inputWrapper}>
                        <Calendar size={20} className={styles.inputIcon} aria-hidden="true" />
                        <input 
                          id="birthDate"
                          type="date" 
                          value={formData.birthDate} 
                          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* E-mail */}
                  <div className={styles.inputGroup}>
                    <label htmlFor="email">E-mail</label>
                    <div className={styles.inputWrapper}>
                      <Mail size={20} className={styles.inputIcon} aria-hidden="true" />
                      <input 
                        id="email"
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        placeholder="seu@email.com"
                        required 
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Senhas */}
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="password">Senha</label>
                      <div className={styles.inputWrapper}>
                        <Lock size={20} className={styles.inputIcon} aria-hidden="true" />
                        <input 
                          id="password"
                          type={showPassword ? 'text' : 'password'} 
                          value={formData.password} 
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                          placeholder="Mínimo 6 caracteres"
                          minLength={6} 
                          required 
                          autoComplete="new-password"
                        />
                        <button 
                          type="button" 
                          className={styles.togglePassword}
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="confirmPassword">Confirmar Senha</label>
                      <div className={styles.inputWrapper}>
                        <Lock size={20} className={styles.inputIcon} aria-hidden="true" />
                        <input 
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'} 
                          value={formData.confirmPassword} 
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                          placeholder="Repita a senha"
                          minLength={6}
                          required 
                          autoComplete="new-password"
                        />
                        <button 
                          type="button" 
                          className={styles.togglePassword}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Código do atendente */}
                  <button 
                    type="button" 
                    className={styles.assistantToggle} 
                    onClick={() => setShowAssistantCode(!showAssistantCode)}
                  >
                    {showAssistantCode ? '− Fechar' : '+ Fui auxiliado por um atendente'}
                  </button>
                  
                  {showAssistantCode && (
                    <div className={styles.inputGroup}>
                      <label htmlFor="assistantCode">Código do Atendente</label>
                      <div className={styles.inputWrapper}>
                        <CreditCard size={20} className={styles.inputIcon} aria-hidden="true" />
                        <input 
                          id="assistantCode"
                          type="text" 
                          value={formData.assistantCode} 
                          onChange={(e) => setFormData({ ...formData, assistantCode: e.target.value })} 
                          placeholder="Digite o código"
                        />
                      </div>
                    </div>
                  )}

                  {/* Aviso LGPD */}
                  <div className={styles.lgpdNotice}>
                    <Shield size={16} className={styles.lgpdIcon} aria-hidden="true" />
                    <p>
                      Ao se cadastrar, você concorda com nossa{' '}
                      <Link href="/politicas-privacidade" className={styles.lgpdLink}>
                        Política de Privacidade
                      </Link>{' '}
                      e confirma que seus dados serão tratados conforme a{' '}
                      <strong>Lei Geral de Proteção de Dados (LGPD)</strong>.
                    </p>
                  </div>

                  <button 
                    type="submit" 
                    className={styles.primaryBtn}
                    disabled={isLoading}
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className={styles.spinner} />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        <Check size={18} aria-hidden="true" />
                        Concluir Cadastro
                      </>
                    )}
                  </button>

                  <button 
                    type="button" 
                    className={styles.secondaryBtn} 
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={18} aria-hidden="true" />
                    Voltar ao início
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Footer institucional */}
          <footer className={styles.footer}>
            <p>Uma iniciativa do Governo de Rondônia</p>
            <p>SEDEC • SINE Estadual</p>
          </footer>
        </div>

        {/* Coluna direita - Logos SEDEC e SINE */}
        <aside className={styles.sideColumn}>
          <div className={styles.rightLogos}>
            <a 
              href="https://rondonia.ro.gov.br/sedec/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.logoLink}
              aria-label="Acessar site da SEDEC"
            >
              <Image
                src="/logos/sedec.png"
                alt="SEDEC - Secretaria de Desenvolvimento Econômico"
                width={160}
                height={60}
                className={styles.partnerLogo}
              />
            </a>
            <a 
              href="https://rondonia.ro.gov.br/sedec/institucional/sine/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.logoLink}
              aria-label="Acessar site do SINE"
            >
              <Image
                src="/logos/sine.jpg"
                alt="SINE - Sistema Nacional de Emprego"
                width={140}
                height={50}
                className={styles.partnerLogo}
              />
            </a>
          </div>
        </aside>
      </main>
    </div>
  );
}
