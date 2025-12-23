// @ts-nocheck
'use client';

import { useState } from 'react';
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
  Shield
} from 'lucide-react';
import { LGPDTooltip } from '@/components/LGPDTooltip';
import { LGPDConsent } from '@/components/LGPDConsent';
import styles from './page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [phoneConfirm, setPhoneConfirm] = useState('');
  const [userType, setUserType] = useState('candidate');
  const [showAssistantCode, setShowAssistantCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);

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

  const handlePhoneSubmit = (e: React.FormEvent) => { 
    e.preventDefault(); 
    setStep(2); 
  };

  const handlePhoneConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone !== phoneConfirm) {
      alert('Os números não coincidem!');
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (!lgpdAccepted) {
      alert('Você precisa aceitar os termos de tratamento de dados para continuar.');
      return;
    }
    
    setIsLoading(true);
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Dados para o Banco:', { ...formData, phone, userType, lgpdAccepted });
    router.push('/');
  };

  return (
    <div className={styles.container}>
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

                <form onSubmit={handlePhoneSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="phone" className={styles.labelWithTooltip}>
                      WhatsApp
                      <LGPDTooltip field="telefone" />
                    </label>
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

                  <button type="submit" className={styles.primaryBtn}>
                    Continuar
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>

                  <p className={styles.loginLink}>
                    Já tem uma conta?{' '}
                    <Link href="/login">Fazer login</Link>
                  </p>
                </form>
              </>
            )}

            {/* Passo 2 - Confirmação do telefone */}
            {step === 2 && (
              <>
                <h1 className={styles.title}>Confirmar número</h1>
                <p className={styles.subtitle}>Digite novamente para evitar erros</p>

                <form onSubmit={handlePhoneConfirmSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="phoneConfirm">Confirmar WhatsApp</label>
                    <div className={styles.inputWrapper}>
                      <Phone size={20} className={styles.inputIcon} aria-hidden="true" />
                      <input 
                        id="phoneConfirm"
                        type="tel" 
                        value={phoneConfirm} 
                        onChange={(e) => setPhoneConfirm(formatPhone(e.target.value))} 
                        placeholder="Repita o número" 
                        maxLength={15} 
                        required 
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <button type="submit" className={styles.primaryBtn}>
                    <Check size={18} aria-hidden="true" />
                    Validar Número
                  </button>

                  <button 
                    type="button" 
                    className={styles.secondaryBtn} 
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={18} aria-hidden="true" />
                    Voltar e corrigir
                  </button>
                </form>
              </>
            )}

            {/* Passo 3 - Dados completos */}
            {step === 3 && (
              <>
                <h1 className={styles.title}>Complete seu perfil</h1>
                <p className={styles.subtitle}>Quase lá! Preencha seus dados</p>

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
                      <label htmlFor="cpf" className={styles.labelWithTooltip}>
                        CPF
                        <LGPDTooltip field="cpf" />
                      </label>
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
                      <label htmlFor="birthDate" className={styles.labelWithTooltip}>
                        Data de Nascimento
                        <LGPDTooltip field="dataNascimento" />
                      </label>
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
                    <label htmlFor="email" className={styles.labelWithTooltip}>
                      E-mail
                      <LGPDTooltip field="email" />
                    </label>
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

                  {/* Gênero (opcional) */}
                  <div className={styles.inputGroup}>
                    <label htmlFor="gender" className={styles.labelWithTooltip}>
                      Gênero <span className={styles.optionalLabel}>(opcional)</span>
                      <LGPDTooltip field="genero" />
                    </label>
                    <div className={styles.inputWrapper}>
                      <User size={20} className={styles.inputIcon} aria-hidden="true" />
                      <select 
                        id="gender"
                        value={formData.gender} 
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className={styles.select}
                      >
                        <option value="">Prefiro não informar</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                      </select>
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

                  {/* Componente de Consentimento LGPD */}
                  <LGPDConsent 
                    type="candidato"
                    accepted={lgpdAccepted}
                    onAccept={setLgpdAccepted}
                  />

                  <button 
                    type="submit" 
                    className={styles.primaryBtn}
                    disabled={isLoading || !lgpdAccepted}
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className={styles.spinner}></span>
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
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft size={18} aria-hidden="true" />
                    Voltar
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
