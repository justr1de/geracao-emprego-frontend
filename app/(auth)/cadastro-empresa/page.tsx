'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import PasswordTooltip from '@/components/PasswordTooltip';
import EmailValidator from '@/components/EmailValidator';
import PhoneVerification from '@/components/PhoneVerification';

const ramosAtuacao = [
  'Academias',
  'Academias especializadas (Pilates, Crossfit)',
  'Acessórios e Bijuterias',
  'Acessórios e Personalização automotiva',
  'Açougues',
  'Advocacia',
  'Agências de Viagem',
  'Agropecuária',
  'Alimentação',
  'Arquitetura e Urbanismo',
  'Assistência Técnica',
  'Atacado e Distribuição',
  'Automotivo',
  'Bancos e Financeiras',
  'Bares e Restaurantes',
  'Beleza e Estética',
  'Comércio Varejista',
  'Comunicação e Marketing',
  'Construção Civil',
  'Consultoria',
  'Contabilidade',
  'Educação',
  'Energia',
  'Engenharia',
  'Entretenimento',
  'Farmácia e Drogaria',
  'Hotelaria e Turismo',
  'Imobiliário',
  'Indústria',
  'Logística e Transporte',
  'Organização de Eventos',
  'Saúde',
  'Segurança',
  'Serviços Gerais',
  'Supermercados',
  'Tecnologia da Informação',
  'Telecomunicações',
  'Outros'
];

const portesEmpresa = [
  'Microempreendedor Individual (MEI)',
  'Microempresa (ME)',
  'Empresa de Pequeno Porte (EPP)',
  'Empresa de Médio Porte',
  'Grande Empresa',
  'Demais'
];

export default function CadastroEmpresaPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);
  
  // Estados para validação de CNPJ duplicado
  const [cnpjStatus, setCnpjStatus] = useState<'idle' | 'checking' | 'available' | 'exists'>('idle');
  const [cnpjError, setCnpjError] = useState<string | null>(null);
  
  // Estados para verificação de telefone (SMS)
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [firebaseUid, setFirebaseUid] = useState<string | undefined>(undefined);
  
  const [formData, setFormData] = useState({
    telefone: '',
    codigo: '',
    nome: '',
    sobrenome: '',
    cpf: '',
    email: '',
    dataNascimento: '',
    genero: '',
    senha: '',
    confirmarSenha: '',
    aceitaTermos: false,
    logoPreview: '',
    nomeEmpresa: '',
    cnpj: '',
    semCnpj: false,
    ramoAtuacao: '',
    porteEmpresa: '',
    bannerPreview: '',
    cep: '',
    rua: '',
    bairro: '',
    numero: '',
    cidade: '',
    estado: '',
    complemento: ''
  });

  const totalSteps = 5;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoPreview' | 'bannerPreview') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: URL.createObjectURL(file)
      }));
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers.length ? `(${numbers}` : '';
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
  };

  // Verificar se CNPJ já está cadastrado
  const verificarCNPJ = async (cnpj: string) => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length === 14) {
      setCnpjStatus('checking');
      setCnpjError(null);
      try {
        const response = await fetch(`/api/auth/check-cnpj?cnpj=${cnpjLimpo}`);
        const data = await response.json();
        if (data.exists) {
          setCnpjStatus('exists');
          setCnpjError('Este CNPJ já está cadastrado no sistema');
        } else {
          setCnpjStatus('available');
          setCnpjError(null);
        }
      } catch (error) {
        console.error('Erro ao verificar CNPJ:', error);
        setCnpjStatus('idle');
      }
    } else {
      setCnpjStatus('idle');
      setCnpjError(null);
    }
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleMaskedInput = (e: React.ChangeEvent<HTMLInputElement>, formatter: (value: string) => string) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: formatter(value)
    }));
  };

  const buscarCEP = async () => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  // Callback quando telefone for verificado
  const handlePhoneVerified = (verifiedPhone: string, uid?: string) => {
    setPhoneVerified(true);
    setShowPhoneVerification(false);
    if (uid) setFirebaseUid(uid);
    setCurrentStep(3); // Avançar para etapa de Dados do Responsável
  };

  // Iniciar verificação de telefone
  const iniciarVerificacaoTelefone = () => {
    const phoneClean = formData.telefone.replace(/\D/g, '');
    if (phoneClean.length === 11) {
      setShowPhoneVerification(true);
      setCurrentStep(2); // Ir para etapa de código
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const salvarResponsavel = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(4);
    }, 1000);
  };

  const salvarEmpresa = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(5);
    }, 1000);
  };

  const finalizarCadastro = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case 1: return { title: 'Verificar Telefone', subtitle: 'Informe seu número de WhatsApp' };
      case 2: return { title: 'Verificar Código', subtitle: 'Digite o código SMS recebido' };
      case 3: return { title: 'Dados do Responsável', subtitle: 'Informações do responsável pela empresa' };
      case 4: return { title: 'Dados da Empresa', subtitle: 'Informações sobre seu estabelecimento' };
      case 5: return { title: 'Endereço', subtitle: 'Localização do seu estabelecimento' };
      default: return { title: '', subtitle: '' };
    }
  };

  if (success) {
    return (
      <div className={styles.pageWrapper}>
        <header className={styles.backHeader}>
          <Link href="/" className={styles.backLink}>
            ← Voltar para o início
          </Link>
        </header>
        <main className={styles.mainContainer}>
          <div className={styles.formCard}>
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h1 className={styles.successTitle}>Cadastro Realizado!</h1>
              <p className={styles.successText}>
                Sua empresa foi cadastrada com sucesso. Agora você pode publicar vagas e encontrar talentos.
              </p>
              <Link href="/painel" className={styles.btnPrimary}>
                Acessar Painel da Empresa
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const stepInfo = getStepInfo();

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.backHeader}>
        <Link href="/tipo-cadastro" className={styles.backLink}>
          ← Voltar
        </Link>
      </header>

      <main className={styles.mainContainer}>
        <aside className={styles.sideColumn}>
          <Link href="https://www.rondonia.ro.gov.br" target="_blank" rel="noopener noreferrer">
            <Image
              src="/logos/governo-ro.jpg"
              alt="Governo de Rondônia"
              width={180}
              height={100}
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </aside>

        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <div className={styles.stepIndicator}>
              <div className={styles.stepNumber}>{currentStep}</div>
              <div>
                <h1 className={styles.stepTitle}>{stepInfo.title}</h1>
                <p className={styles.stepSubtitle}>{stepInfo.subtitle}</p>
              </div>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                role="progressbar"
                aria-valuenow={currentStep}
                aria-valuemin={1}
                aria-valuemax={totalSteps}
              />
            </div>
          </div>

          <div className={styles.cardBody}>
            {/* ========== PASSO 1 - TELEFONE ========== */}
            {currentStep === 1 && (
              <>
                <h2 className={styles.stepTitle}>Verificar Telefone</h2>
                <p className={styles.stepDescription}>Informe seu número de WhatsApp para começar</p>

                <form onSubmit={(e) => { e.preventDefault(); iniciarVerificacaoTelefone(); }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="telefone-step1">
                      WhatsApp <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <input
                        type="tel"
                        id="telefone-step1"
                        name="telefone"
                        className={styles.input}
                        value={formData.telefone}
                        onChange={(e) => handleMaskedInput(e, formatPhone)}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        required
                        autoFocus
                      />
                    </div>
                    <p className={styles.inputHint}>Você receberá um código SMS para verificar seu número</p>
                  </div>

                  <button
                    type="submit"
                    className={styles.btnPrimary}
                    disabled={formData.telefone.replace(/\D/g, '').length !== 11}
                  >
                    Enviar Código SMS →
                  </button>
                </form>

                <p className={styles.loginLink}>
                  Já tem uma conta? <Link href="/login">Fazer login</Link>
                </p>
              </>
            )}

            {/* ========== PASSO 2 - VERIFICAÇÃO SMS ========== */}
            {currentStep === 2 && (
              <>
                <h2 className={styles.stepTitle}>Verificar Código</h2>
                <p className={styles.stepDescription}>Digite o código enviado para seu WhatsApp</p>

                {showPhoneVerification ? (
                  <PhoneVerification
                    phoneNumber={formData.telefone.replace(/\D/g, '')}
                    onVerified={handlePhoneVerified}
                    onError={(error) => setVerificationError(error)}
                    onCancel={() => {
                      setShowPhoneVerification(false);
                      setCurrentStep(1);
                    }}
                  />
                ) : (
                  <div className={styles.verificationPending}>
                    <p>Iniciando verificação...</p>
                  </div>
                )}

                {verificationError && (
                  <div className={styles.errorMessage}>
                    {verificationError}
                  </div>
                )}

                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => {
                    setShowPhoneVerification(false);
                    setCurrentStep(1);
                  }}
                >
                  ← Voltar e alterar número
                </button>
              </>
            )}

            {/* ========== PASSO 3 - DADOS DO RESPONSÁVEL ========== */}
            {currentStep === 3 && (
              <form onSubmit={(e) => { e.preventDefault(); salvarResponsavel(); }}>
                {/* Campo de Telefone (já verificado) */}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="telefone">
                    Telefone com WhatsApp <span className={styles.verified}>✓ Verificado</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      className={styles.input}
                      value={formData.telefone}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="nome">
                      Nome <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      className={`${styles.input} ${styles.inputNoIcon}`}
                      value={formData.nome}
                      onChange={handleInputChange}
                      placeholder="Seu nome"
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="sobrenome">
                      Sobrenome <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="sobrenome"
                      name="sobrenome"
                      className={`${styles.input} ${styles.inputNoIcon}`}
                      value={formData.sobrenome}
                      onChange={handleInputChange}
                      placeholder="Seu sobrenome"
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="cpf">
                      CPF <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                        <line x1="7" y1="8" x2="17" y2="8"></line>
                        <line x1="7" y1="12" x2="13" y2="12"></line>
                      </svg>
                      <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        className={styles.input}
                        value={formData.cpf}
                        onChange={(e) => handleMaskedInput(e, formatCPF)}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="dataNascimento">
                      Data de Nascimento <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="date"
                      id="dataNascimento"
                      name="dataNascimento"
                      className={`${styles.input} ${styles.inputNoIcon}`}
                      value={formData.dataNascimento}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="email">
                    E-mail <span className={styles.required}>*</span>
                  </label>
                  <EmailValidator
                    value={formData.email}
                    onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="senha">
                      Senha <span className={styles.required}>*</span>
                      <PasswordTooltip />
                    </label>
                    <div className={styles.inputWrapper}>
                      <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="senha"
                        name="senha"
                        className={styles.input}
                        value={formData.senha}
                        onChange={handleInputChange}
                        placeholder="Crie uma senha segura"
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="confirmarSenha">
                      Confirmar Senha <span className={styles.required}>*</span>
                      <PasswordTooltip />
                    </label>
                    <div className={styles.inputWrapper}>
                      <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmarSenha"
                        name="confirmarSenha"
                        className={styles.input}
                        value={formData.confirmarSenha}
                        onChange={handleInputChange}
                        placeholder="Confirme sua senha"
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="aceitaTermos"
                    name="aceitaTermos"
                    className={styles.checkbox}
                    checked={formData.aceitaTermos}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="aceitaTermos" className={styles.checkboxLabel}>
                    Ao clicar em Próximo você concorda com nossos{' '}
                    <Link href="/termos">termos de uso</Link> e{' '}
                    <Link href="/privacidade">política de privacidade</Link>
                  </label>
                </div>

                <div className={styles.buttonGroup}>
                  <button 
                    type="button" 
                    className={styles.btnSecondary}
                    onClick={() => setCurrentStep(1)}
                  >
                    ← Voltar
                  </button>
                  <button 
                    type="submit" 
                    className={styles.btnPrimary}
                    disabled={!formData.aceitaTermos || isLoading}
                  >
                    {isLoading ? 'Salvando...' : 'Próximo →'}
                  </button>
                </div>
              </form>
            )}

            {/* ========== PASSO 4 - DADOS DA EMPRESA ========== */}
            {currentStep === 4 && (
              <form onSubmit={(e) => { e.preventDefault(); salvarEmpresa(); }}>
                <div className={styles.uploadSection}>
                  <label className={styles.uploadLabel}>Logo da empresa</label>
                  <p className={styles.uploadHint}>O logo aparecerá na listagem de vagas e na página da vaga</p>
                  <div 
                    className={styles.uploadArea}
                    onClick={() => document.getElementById('logoInput')?.click()}
                  >
                    {formData.logoPreview ? (
                      <div className={styles.uploadPreview}>
                        <Image 
                          src={formData.logoPreview} 
                          alt="Logo preview" 
                          width={120} 
                          height={120} 
                          className={styles.previewImage}
                        />
                        <button 
                          type="button" 
                          className={styles.removeImage}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({ ...prev, logoPreview: '' }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <p className={styles.uploadText}>Clique para adicionar</p>
                        <p className={styles.uploadSubtext}>PNG, JPG até 2MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    id="logoInput"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'logoPreview')}
                    className={styles.hiddenInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="nomeEmpresa">
                    Nome da empresa <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="nomeEmpresa"
                    name="nomeEmpresa"
                    className={`${styles.input} ${styles.inputNoIcon}`}
                    value={formData.nomeEmpresa}
                    onChange={handleInputChange}
                    placeholder="Nome da sua empresa"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="cnpj">
                    CNPJ <span className={styles.required}>*</span>
                    <button 
                      type="button" 
                      className={styles.helperLink}
                      onClick={() => setFormData(prev => ({ ...prev, semCnpj: !prev.semCnpj, cnpj: '' }))}
                    >
                      {formData.semCnpj ? 'Tenho CNPJ' : 'Não possuo CNPJ'}
                    </button>
                  </label>
                  {formData.semCnpj ? (
                    <div className={styles.alertBox}>
                      <p>Você indicou que não possui CNPJ. Algumas funcionalidades podem ser limitadas.</p>
                    </div>
                  ) : (
                    <>
                      <div className={styles.inputWrapper}>
                        <input
                          type="text"
                          id="cnpj"
                          name="cnpj"
                          className={`${styles.input} ${styles.inputNoIcon} ${cnpjStatus === 'exists' ? styles.inputError : cnpjStatus === 'available' ? styles.inputSuccess : ''}`}
                          value={formData.cnpj}
                          onChange={(e) => {
                            handleMaskedInput(e, formatCNPJ);
                            verificarCNPJ(formatCNPJ(e.target.value));
                          }}
                          placeholder="00.000.000/0000-00"
                          maxLength={18}
                          required={!formData.semCnpj}
                        />
                        {cnpjStatus === 'checking' && (
                          <span className={styles.statusIcon}>⏳</span>
                        )}
                        {cnpjStatus === 'available' && (
                          <span className={`${styles.statusIcon} ${styles.success}`}>✓</span>
                        )}
                        {cnpjStatus === 'exists' && (
                          <span className={`${styles.statusIcon} ${styles.error}`}>✗</span>
                        )}
                      </div>
                      {cnpjError && (
                        <span className={styles.errorMessage}>{cnpjError}</span>
                      )}
                    </>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="ramoAtuacao">
                      Ramo de atuação <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="ramoAtuacao"
                      name="ramoAtuacao"
                      className={styles.select}
                      value={formData.ramoAtuacao}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione a categoria</option>
                      {ramosAtuacao.map((ramo) => (
                        <option key={ramo} value={ramo}>{ramo}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="porteEmpresa">
                      Porte da empresa <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="porteEmpresa"
                      name="porteEmpresa"
                      className={styles.select}
                      value={formData.porteEmpresa}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione o porte</option>
                      {portesEmpresa.map((porte) => (
                        <option key={porte} value={porte}>{porte}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.uploadSection}>
                  <label className={styles.uploadLabel}>Banner da empresa (1200px x 300px)</label>
                  <p className={styles.uploadHint}>Imagem exibida na página de sua empresa</p>
                  <div 
                    className={styles.bannerArea}
                    onClick={() => document.getElementById('bannerInput')?.click()}
                  >
                    {formData.bannerPreview ? (
                      <div className={styles.uploadPreview} style={{ width: '100%' }}>
                        <Image 
                          src={formData.bannerPreview} 
                          alt="Banner preview" 
                          width={500} 
                          height={125} 
                          className={styles.bannerPreviewImage}
                        />
                        <button 
                          type="button" 
                          className={styles.removeImage}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({ ...prev, bannerPreview: '' }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <p className={styles.uploadText}>Clique para adicionar banner</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    id="bannerInput"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'bannerPreview')}
                    className={styles.hiddenInput}
                  />
                </div>

                <div className={styles.buttonGroup}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setCurrentStep(3)}>
                    ← Voltar
                  </button>
                  <button 
                    type="submit" 
                    className={styles.btnPrimary}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Salvando...' : 'Próximo →'}
                  </button>
                </div>
              </form>
            )}

            {/* ========== PASSO 5 - ENDEREÇO ========== */}
            {currentStep === 5 && (
              <form onSubmit={(e) => { e.preventDefault(); finalizarCadastro(); }}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="cep">
                    CEP <span className={styles.required}>*</span>
                    <a 
                      href="https://buscacepinter.correios.com.br/app/endereco/index.php" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.helperLink}
                    >
                      Não sei meu CEP
                    </a>
                  </label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    className={`${styles.input} ${styles.inputNoIcon}`}
                    value={formData.cep}
                    onChange={(e) => handleMaskedInput(e, formatCEP)}
                    onBlur={buscarCEP}
                    placeholder="00000-000"
                    maxLength={9}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="rua">Rua</label>
                  <input
                    type="text"
                    id="rua"
                    name="rua"
                    className={`${styles.input} ${styles.inputNoIcon}`}
                    value={formData.rua}
                    onChange={handleInputChange}
                    placeholder="Nome da rua"
                    readOnly={!!formData.rua}
                  />
                </div>

                <div className={styles.formRowThree}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="bairro">Bairro</label>
                    <input
                      type="text"
                      id="bairro"
                      name="bairro"
                      className={`${styles.input} ${styles.inputNoIcon}`}
                      value={formData.bairro}
                      onChange={handleInputChange}
                      placeholder="Bairro"
                      readOnly={!!formData.bairro}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="numero">
                      Nº <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="numero"
                      name="numero"
                      className={`${styles.input} ${styles.inputNoIcon}`}
                      value={formData.numero}
                      onChange={handleInputChange}
                      placeholder="Nº"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRowThree}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="cidade">Cidade</label>
                    <input
                      type="text"
                      id="cidade"
                      name="cidade"
                      className={`${styles.input} ${styles.inputNoIcon}`}
                      value={formData.cidade}
                      onChange={handleInputChange}
                      placeholder="Cidade"
                      readOnly={!!formData.cidade}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="estado">UF</label>
                    <input
                      type="text"
                      id="estado"
                      name="estado"
                      className={`${styles.input} ${styles.inputNoIcon}`}
                      value={formData.estado}
                      onChange={handleInputChange}
                      placeholder="UF"
                      readOnly={!!formData.estado}
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="complemento">Complemento</label>
                  <input
                    type="text"
                    id="complemento"
                    name="complemento"
                    className={`${styles.input} ${styles.inputNoIcon}`}
                    value={formData.complemento}
                    onChange={handleInputChange}
                    placeholder="Complemento adicional do endereço"
                  />
                </div>

                <div className={styles.lgpdNotice}>
                  <svg className={styles.lgpdIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <p className={styles.lgpdText}>
                    Seus dados são protegidos conforme a Lei Geral de Proteção de Dados (LGPD).{' '}
                    <Link href="/privacidade">Saiba mais</Link>
                  </p>
                </div>

                <div className={styles.buttonGroup}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setCurrentStep(4)}>
                    ← Voltar
                  </button>
                  <button 
                    type="submit" 
                    className={styles.btnPrimary}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar Empresa'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <aside className={styles.sideColumn}>
          <Link href="https://www.rondonia.ro.gov.br/sedec" target="_blank" rel="noopener noreferrer">
            <Image
              src="/logos/sedec.png"
              alt="SEDEC - Secretaria de Desenvolvimento Econômico"
              width={150}
              height={80}
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </aside>
      </main>

      <footer className={styles.footer}>
        <p>Uma iniciativa do Governo de Rondônia - SEDEC • SINE Estadual</p>
      </footer>
    </div>
  );
}
