'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight,
  Phone, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Check,
  CreditCard,
  Calendar,
  Building2,
  Shield,
  Loader2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  Heart,
  FileText,
  Plus,
  Trash2,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import styles from './page.module.css';
import { LGPDTooltip } from '@/components/LGPDTooltip';

// Interfaces para tipagem
interface ExperienciaProfissional {
  id: string;
  cargo: string;
  empresa: string;
  dataInicio: string;
  dataFim: string;
  atual: boolean;
  descricao: string;
}

interface FormacaoAcademica {
  id: string;
  instituicao: string;
  curso: string;
  nivel: string;
  dataInicio: string;
  dataFim: string;
  cursando: boolean;
}

interface Habilidade {
  id: string;
  nome: string;
  nivel: number; // 1-5
}

// Funções de formatação
const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return `(${numbers}`;
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

const formatCEP = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

// Lista de habilidades sugeridas
const habilidadesSugeridas = [
  'Comunicação', 'Trabalho em equipe', 'Liderança', 'Organização', 'Proatividade',
  'Excel', 'Word', 'PowerPoint', 'Inglês', 'Espanhol',
  'Atendimento ao cliente', 'Vendas', 'Negociação', 'Gestão de projetos',
  'Marketing Digital', 'Redes Sociais', 'Photoshop', 'Design Gráfico',
  'Programação', 'Python', 'JavaScript', 'SQL', 'Excel Avançado',
  'Contabilidade', 'Finanças', 'RH', 'Logística', 'Administração'
];

// Níveis de escolaridade
const niveisEscolaridade = [
  'Ensino Fundamental Incompleto',
  'Ensino Fundamental Completo',
  'Ensino Médio Incompleto',
  'Ensino Médio Completo',
  'Técnico',
  'Superior Incompleto',
  'Superior Completo',
  'Pós-Graduação',
  'Mestrado',
  'Doutorado'
];

// Áreas de interesse
const areasInteresse = [
  'Administração', 'Agricultura', 'Alimentação', 'Atendimento', 'Comércio',
  'Construção Civil', 'Educação', 'Indústria', 'Logística', 'Marketing',
  'Saúde', 'Serviços Gerais', 'Tecnologia', 'Turismo', 'Vendas'
];

export default function CadastroPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [showAssistantCode, setShowAssistantCode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  // Estados do formulário
  const [phone, setPhone] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cpf: '',
    birthDate: '',
    email: '',
    gender: '',
    password: '',
    confirmPassword: '',
    assistantCode: ''
  });

  // Estado do endereço
  const [endereco, setEndereco] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  // Estado das experiências profissionais
  const [experiencias, setExperiencias] = useState<ExperienciaProfissional[]>([]);
  const [semExperiencia, setSemExperiencia] = useState(false);

  // Estado das formações acadêmicas
  const [formacoes, setFormacoes] = useState<FormacaoAcademica[]>([]);

  // Estado das habilidades
  const [habilidades, setHabilidades] = useState<Habilidade[]>([]);
  const [novaHabilidade, setNovaHabilidade] = useState('');

  // Estado das preferências
  const [preferencias, setPreferencias] = useState({
    areasInteresse: [] as string[],
    tipoContrato: [] as string[],
    pretensaoSalarial: '',
    disponibilidadeInicio: '',
    disponibilidadeHorario: [] as string[],
    aceitaViagem: false,
    possuiCNH: false,
    categoriaCNH: '',
    possuiVeiculo: false,
    pcd: false,
    tipoPcd: ''
  });

  // Countdown para reenvio de código
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Buscar endereço pelo CEP
  const buscarCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setEndereco(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
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

  // Handlers de código de verificação
  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) {
      // Permite colar código completo
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...verificationCode];
      digits.forEach((digit, i) => {
        if (index + i < 6) newCode[index + i] = digit;
      });
      setVerificationCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      const nextInput = document.querySelector(`[data-code-index="${nextIndex}"]`) as HTMLInputElement;
      nextInput?.focus();
    } else {
      const newCode = [...verificationCode];
      newCode[index] = value.replace(/\D/g, '');
      setVerificationCode(newCode);
      if (value && index < 5) {
        const nextInput = document.querySelector(`[data-code-index="${index + 1}"]`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.querySelector(`[data-code-index="${index - 1}"]`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  // Enviar código SMS (simulado por enquanto)
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setVerificationError(null);

    try {
      // Simulação - em produção usar Firebase
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(2);
      setCountdown(60);
    } catch (error) {
      setVerificationError('Erro ao enviar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar código
  const handleVerifyCode = async () => {
    setIsLoading(true);
    setVerificationError(null);

    try {
      const code = verificationCode.join('');
      // Simulação - aceita código 123456 para teste
      if (code === '123456') {
        setStep(3);
      } else {
        setVerificationError('Código inválido. Tente novamente.');
      }
    } catch (error) {
      setVerificationError('Erro ao verificar código.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar código
  const handleResend = async () => {
    setVerificationCode(['', '', '', '', '', '']);
    setCountdown(60);
    // Simulação de reenvio
  };

  // Adicionar experiência profissional
  const adicionarExperiencia = () => {
    setExperiencias([...experiencias, {
      id: Date.now().toString(),
      cargo: '',
      empresa: '',
      dataInicio: '',
      dataFim: '',
      atual: false,
      descricao: ''
    }]);
  };

  // Remover experiência
  const removerExperiencia = (id: string) => {
    setExperiencias(experiencias.filter(exp => exp.id !== id));
  };

  // Atualizar experiência
  const atualizarExperiencia = (id: string, campo: string, valor: any) => {
    setExperiencias(experiencias.map(exp => 
      exp.id === id ? { ...exp, [campo]: valor } : exp
    ));
  };

  // Adicionar formação
  const adicionarFormacao = () => {
    setFormacoes([...formacoes, {
      id: Date.now().toString(),
      instituicao: '',
      curso: '',
      nivel: '',
      dataInicio: '',
      dataFim: '',
      cursando: false
    }]);
  };

  // Remover formação
  const removerFormacao = (id: string) => {
    setFormacoes(formacoes.filter(form => form.id !== id));
  };

  // Atualizar formação
  const atualizarFormacao = (id: string, campo: string, valor: any) => {
    setFormacoes(formacoes.map(form => 
      form.id === id ? { ...form, [campo]: valor } : form
    ));
  };

  // Adicionar habilidade
  const adicionarHabilidade = (nome: string) => {
    if (nome && !habilidades.find(h => h.nome.toLowerCase() === nome.toLowerCase())) {
      setHabilidades([...habilidades, {
        id: Date.now().toString(),
        nome,
        nivel: 3
      }]);
      setNovaHabilidade('');
    }
  };

  // Remover habilidade
  const removerHabilidade = (id: string) => {
    setHabilidades(habilidades.filter(h => h.id !== id));
  };

  // Atualizar nível da habilidade
  const atualizarNivelHabilidade = (id: string, nivel: number) => {
    setHabilidades(habilidades.map(h => 
      h.id === id ? { ...h, nivel } : h
    ));
  };

  // Toggle área de interesse
  const toggleAreaInteresse = (area: string) => {
    setPreferencias(prev => ({
      ...prev,
      areasInteresse: prev.areasInteresse.includes(area)
        ? prev.areasInteresse.filter(a => a !== area)
        : [...prev.areasInteresse, area]
    }));
  };

  // Toggle tipo de contrato
  const toggleTipoContrato = (tipo: string) => {
    setPreferencias(prev => ({
      ...prev,
      tipoContrato: prev.tipoContrato.includes(tipo)
        ? prev.tipoContrato.filter(t => t !== tipo)
        : [...prev.tipoContrato, tipo]
    }));
  };

  // Toggle disponibilidade de horário
  const toggleDisponibilidadeHorario = (horario: string) => {
    setPreferencias(prev => ({
      ...prev,
      disponibilidadeHorario: prev.disponibilidadeHorario.includes(horario)
        ? prev.disponibilidadeHorario.filter(h => h !== horario)
        : [...prev.disponibilidadeHorario, horario]
    }));
  };

  // Navegação entre passos
  const proximoPasso = () => {
    if (step < 8) setStep(step + 1);
  };

  const passoAnterior = () => {
    if (step > 1) setStep(step - 1);
  };

  // Pular etapa opcional
  const pularEtapa = () => {
    proximoPasso();
  };

  // Submissão final
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dadosCompletos = {
        telefone: phone,
        ...formData,
        endereco,
        experiencias: semExperiencia ? [] : experiencias,
        semExperiencia,
        formacoes,
        habilidades,
        preferencias
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          phone,
          userType: 'candidate',
          userData: dadosCompletos
        })
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

  // Renderizar indicador de progresso
  const renderProgressIndicator = () => {
    const etapas = [
      { num: 1, label: 'Telefone' },
      { num: 2, label: 'Código' },
      { num: 3, label: 'Dados' },
      { num: 4, label: 'Endereço' },
      { num: 5, label: 'Experiência' },
      { num: 6, label: 'Formação' },
      { num: 7, label: 'Habilidades' },
      { num: 8, label: 'Preferências' }
    ];

    return (
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${((step - 1) / 7) * 100}%` }}
          />
        </div>
        <div className={styles.stepIndicator}>
          {etapas.map((etapa, index) => (
            <div key={etapa.num} className={styles.stepItem}>
              <div 
                className={`${styles.stepDot} ${step >= etapa.num ? styles.active : ''} ${step === etapa.num ? styles.current : ''}`}
                onClick={() => step > etapa.num && setStep(etapa.num)}
                style={{ cursor: step > etapa.num ? 'pointer' : 'default' }}
              >
                {step > etapa.num ? <Check size={14} /> : etapa.num}
              </div>
              <span className={`${styles.stepLabel} ${step === etapa.num ? styles.currentLabel : ''}`}>
                {etapa.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
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

      {/* Conteúdo principal */}
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

            {/* Indicador de progresso */}
            {renderProgressIndicator()}

            {/* ========== PASSO 1 - DADOS PESSOAIS ========== */}
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
                  <span>ou preencha seus dados</span>
                </div>

                <form className={styles.form}>
                  {/* Telefone/WhatsApp */}
                  <div className={styles.inputGroup}>
                    <label htmlFor="phone">
                      WhatsApp *
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

                  {/* Nome e Sobrenome */}
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="firstName">Nome *</label>
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
                      <label htmlFor="lastName">Sobrenome *</label>
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
                      <label htmlFor="cpf">
                        CPF *
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
                      <label htmlFor="birthDate">
                        Data de Nascimento *
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

                  {/* E-mail e Gênero */}
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="email">
                        E-mail *
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
                    <div className={styles.inputGroup}>
                      <label htmlFor="gender">
                        Gênero
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
                  </div>

                  {/* Senhas */}
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="password">Senha *</label>
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
                      <label htmlFor="confirmPassword">Confirmar Senha *</label>
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

                  <p className={styles.loginLink}>
                    Já tem uma conta?{' '}
                    <Link href="/login">Fazer login</Link>
                  </p>

                  <button 
                    type="button" 
                    className={styles.primaryBtn}
                    onClick={proximoPasso}
                    disabled={!phone || phone.replace(/\D/g, '').length < 11 || !formData.firstName || !formData.lastName || !formData.cpf || !formData.birthDate || !formData.email || !formData.password || formData.password !== formData.confirmPassword}
                  >
                    Continuar
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </form>
              </>
            )}

            {/* ========== PASSO 2 - ENDEREÇO ========== */}
            {step === 2 && (
              <>
                <h1 className={styles.title}>Endereço</h1>
                <p className={styles.subtitle}>Informe seu endereço para encontrar vagas próximas</p>

                <form className={styles.form}>
                  {/* CEP */}
                  <div className={styles.inputGroup}>
                    <label htmlFor="cep">CEP *</label>
                    <div className={styles.inputWrapper}>
                      <MapPin size={20} className={styles.inputIcon} aria-hidden="true" />
                      <input 
                        id="cep"
                        type="text" 
                        value={endereco.cep} 
                        onChange={(e) => {
                          const cep = formatCEP(e.target.value);
                          setEndereco({ ...endereco, cep });
                          buscarCEP(cep);
                        }} 
                        placeholder="00000-000"
                        maxLength={9} 
                        required 
                      />
                    </div>
                    <small className={styles.inputHint}>Digite o CEP para preencher automaticamente</small>
                  </div>

                  {/* Logradouro e Número */}
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup} style={{ flex: 2 }}>
                      <label htmlFor="logradouro">Logradouro *</label>
                      <div className={styles.inputWrapper}>
                        <input 
                          id="logradouro"
                          type="text" 
                          value={endereco.logradouro} 
                          onChange={(e) => setEndereco({ ...endereco, logradouro: e.target.value })} 
                          placeholder="Rua, Avenida, etc."
                          required 
                        />
                      </div>
                    </div>
                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                      <label htmlFor="numero">Número *</label>
                      <div className={styles.inputWrapper}>
                        <input 
                          id="numero"
                          type="text" 
                          value={endereco.numero} 
                          onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })} 
                          placeholder="Nº"
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Complemento e Bairro */}
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="complemento">Complemento</label>
                      <div className={styles.inputWrapper}>
                        <input 
                          id="complemento"
                          type="text" 
                          value={endereco.complemento} 
                          onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })} 
                          placeholder="Apto, Bloco, etc."
                        />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="bairro">Bairro *</label>
                      <div className={styles.inputWrapper}>
                        <input 
                          id="bairro"
                          type="text" 
                          value={endereco.bairro} 
                          onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })} 
                          placeholder="Bairro"
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cidade e Estado */}
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="cidade">Cidade *</label>
                      <div className={styles.inputWrapper}>
                        <input 
                          id="cidade"
                          type="text" 
                          value={endereco.cidade} 
                          onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })} 
                          placeholder="Cidade"
                          required 
                        />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="estado">Estado *</label>
                      <div className={styles.inputWrapper}>
                        <select
                          id="estado"
                          value={endereco.estado}
                          onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })}
                          className={styles.select}
                          required
                        >
                          <option value="">Selecione</option>
                          <option value="AC">Acre</option>
                          <option value="AL">Alagoas</option>
                          <option value="AP">Amapá</option>
                          <option value="AM">Amazonas</option>
                          <option value="BA">Bahia</option>
                          <option value="CE">Ceará</option>
                          <option value="DF">Distrito Federal</option>
                          <option value="ES">Espírito Santo</option>
                          <option value="GO">Goiás</option>
                          <option value="MA">Maranhão</option>
                          <option value="MT">Mato Grosso</option>
                          <option value="MS">Mato Grosso do Sul</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="PA">Pará</option>
                          <option value="PB">Paraíba</option>
                          <option value="PR">Paraná</option>
                          <option value="PE">Pernambuco</option>
                          <option value="PI">Piauí</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="RN">Rio Grande do Norte</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="RO">Rondônia</option>
                          <option value="RR">Roraima</option>
                          <option value="SC">Santa Catarina</option>
                          <option value="SP">São Paulo</option>
                          <option value="SE">Sergipe</option>
                          <option value="TO">Tocantins</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={styles.navigationButtons}>
                    <button 
                      type="button" 
                      className={styles.secondaryBtn} 
                      onClick={passoAnterior}
                    >
                      <ArrowLeft size={18} aria-hidden="true" />
                      Voltar
                    </button>
                    <button 
                      type="button" 
                      className={styles.primaryBtn}
                      onClick={proximoPasso}
                      disabled={!endereco.cep || !endereco.logradouro || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado}
                    >
                      Continuar
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ========== PASSO 3 - EXPERIÊNCIA PROFISSIONAL ========== */}
            {step === 3 && (
              <>
                <h1 className={styles.title}>Experiência Profissional</h1>
                <p className={styles.subtitle}>Adicione suas experiências de trabalho (opcional)</p>

                <div className={styles.form}>
                  {/* Checkbox sem experiência */}
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={semExperiencia}
                      onChange={(e) => {
                        setSemExperiencia(e.target.checked);
                        if (e.target.checked) setExperiencias([]);
                      }}
                    />
                    <span>Ainda não tenho experiência profissional</span>
                  </label>

                  {!semExperiencia && (
                    <>
                      {/* Lista de experiências */}
                      {experiencias.map((exp, index) => (
                        <div key={exp.id} className={styles.experienciaCard}>
                          <div className={styles.experienciaHeader}>
                            <h3>Experiência {index + 1}</h3>
                            <button
                              type="button"
                              className={styles.removeBtn}
                              onClick={() => removerExperiencia(exp.id)}
                              aria-label="Remover experiência"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                              <label>Cargo *</label>
                              <input 
                                type="text" 
                                value={exp.cargo}
                                onChange={(e) => atualizarExperiencia(exp.id, 'cargo', e.target.value)}
                                placeholder="Ex: Vendedor, Auxiliar Administrativo"
                              />
                            </div>
                            <div className={styles.inputGroup}>
                              <label>Empresa *</label>
                              <input 
                                type="text" 
                                value={exp.empresa}
                                onChange={(e) => atualizarExperiencia(exp.id, 'empresa', e.target.value)}
                                placeholder="Nome da empresa"
                              />
                            </div>
                          </div>

                          <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                              <label>Data de Início *</label>
                              <input 
                                type="month" 
                                value={exp.dataInicio}
                                onChange={(e) => atualizarExperiencia(exp.id, 'dataInicio', e.target.value)}
                              />
                            </div>
                            <div className={styles.inputGroup}>
                              <label>Data de Término</label>
                              <input 
                                type="month" 
                                value={exp.dataFim}
                                onChange={(e) => atualizarExperiencia(exp.id, 'dataFim', e.target.value)}
                                disabled={exp.atual}
                              />
                            </div>
                          </div>

                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={exp.atual}
                              onChange={(e) => atualizarExperiencia(exp.id, 'atual', e.target.checked)}
                            />
                            <span>Trabalho atual</span>
                          </label>

                          <div className={styles.inputGroup}>
                            <label>Descrição das atividades</label>
                            <textarea
                              value={exp.descricao}
                              onChange={(e) => atualizarExperiencia(exp.id, 'descricao', e.target.value)}
                              placeholder="Descreva suas principais atividades e responsabilidades"
                              rows={3}
                            />
                          </div>
                        </div>
                      ))}

                      {/* Botão adicionar experiência */}
                      <button
                        type="button"
                        className={styles.addBtn}
                        onClick={adicionarExperiencia}
                      >
                        <Plus size={18} />
                        Adicionar Experiência
                      </button>
                    </>
                  )}

                  <div className={styles.navigationButtons}>
                    <button 
                      type="button" 
                      className={styles.secondaryBtn} 
                      onClick={passoAnterior}
                    >
                      <ArrowLeft size={18} aria-hidden="true" />
                      Voltar
                    </button>
                    <button 
                      type="button" 
                      className={styles.skipBtn}
                      onClick={pularEtapa}
                    >
                      Pular etapa
                    </button>
                    <button 
                      type="button" 
                      className={styles.primaryBtn}
                      onClick={proximoPasso}
                    >
                      Continuar
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ========== PASSO 4 - FORMAÇÃO ACADÊMICA ========== */}
            {step === 4 && (
              <>
                <h1 className={styles.title}>Formação Acadêmica</h1>
                <p className={styles.subtitle}>Adicione sua formação educacional (opcional)</p>

                <div className={styles.form}>
                  {/* Lista de formações */}
                  {formacoes.map((form, index) => (
                    <div key={form.id} className={styles.experienciaCard}>
                      <div className={styles.experienciaHeader}>
                        <h3>Formação {index + 1}</h3>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removerFormacao(form.id)}
                          aria-label="Remover formação"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Nível de Escolaridade *</label>
                        <select
                          value={form.nivel}
                          onChange={(e) => atualizarFormacao(form.id, 'nivel', e.target.value)}
                          className={styles.select}
                        >
                          <option value="">Selecione</option>
                          {niveisEscolaridade.map(nivel => (
                            <option key={nivel} value={nivel}>{nivel}</option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                          <label>Instituição *</label>
                          <input 
                            type="text" 
                            value={form.instituicao}
                            onChange={(e) => atualizarFormacao(form.id, 'instituicao', e.target.value)}
                            placeholder="Nome da instituição"
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label>Curso</label>
                          <input 
                            type="text" 
                            value={form.curso}
                            onChange={(e) => atualizarFormacao(form.id, 'curso', e.target.value)}
                            placeholder="Nome do curso"
                          />
                        </div>
                      </div>

                      <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                          <label>Ano de Início</label>
                          <input 
                            type="number" 
                            value={form.dataInicio}
                            onChange={(e) => atualizarFormacao(form.id, 'dataInicio', e.target.value)}
                            placeholder="2020"
                            min="1950"
                            max={new Date().getFullYear()}
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label>Ano de Conclusão</label>
                          <input 
                            type="number" 
                            value={form.dataFim}
                            onChange={(e) => atualizarFormacao(form.id, 'dataFim', e.target.value)}
                            placeholder="2025"
                            min="1950"
                            max={new Date().getFullYear() + 10}
                            disabled={form.cursando}
                          />
                        </div>
                      </div>

                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={form.cursando}
                          onChange={(e) => atualizarFormacao(form.id, 'cursando', e.target.checked)}
                        />
                        <span>Cursando atualmente</span>
                      </label>
                    </div>
                  ))}

                  {/* Botão adicionar formação */}
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={adicionarFormacao}
                  >
                    <Plus size={18} />
                    Adicionar Formação
                  </button>

                  <div className={styles.navigationButtons}>
                    <button 
                      type="button" 
                      className={styles.secondaryBtn} 
                      onClick={passoAnterior}
                    >
                      <ArrowLeft size={18} aria-hidden="true" />
                      Voltar
                    </button>
                    <button 
                      type="button" 
                      className={styles.skipBtn}
                      onClick={pularEtapa}
                    >
                      Pular etapa
                    </button>
                    <button 
                      type="button" 
                      className={styles.primaryBtn}
                      onClick={proximoPasso}
                    >
                      Continuar
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ========== PASSO 5 - HABILIDADES ========== */}
            {step === 5 && (
              <>
                <h1 className={styles.title}>Habilidades e Competências</h1>
                <p className={styles.subtitle}>Adicione suas habilidades para encontrar vagas compatíveis</p>

                <div className={styles.form}>
                  {/* Input para adicionar habilidade */}
                  <div className={styles.inputGroup}>
                    <label>Adicionar Habilidade</label>
                    <div className={styles.inputWithButton}>
                      <input 
                        type="text" 
                        value={novaHabilidade}
                        onChange={(e) => setNovaHabilidade(e.target.value)}
                        placeholder="Digite uma habilidade"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            adicionarHabilidade(novaHabilidade);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => adicionarHabilidade(novaHabilidade)}
                        disabled={!novaHabilidade}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Sugestões de habilidades */}
                  <div className={styles.sugestoesContainer}>
                    <p className={styles.sugestoesLabel}>Sugestões:</p>
                    <div className={styles.sugestoesTags}>
                      {habilidadesSugeridas
                        .filter(h => !habilidades.find(hab => hab.nome.toLowerCase() === h.toLowerCase()))
                        .slice(0, 12)
                        .map(habilidade => (
                          <button
                            key={habilidade}
                            type="button"
                            className={styles.sugestaoTag}
                            onClick={() => adicionarHabilidade(habilidade)}
                          >
                            <Plus size={14} />
                            {habilidade}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Lista de habilidades adicionadas */}
                  {habilidades.length > 0 && (
                    <div className={styles.habilidadesLista}>
                      <p className={styles.habilidadesLabel}>Suas habilidades:</p>
                      {habilidades.map(habilidade => (
                        <div key={habilidade.id} className={styles.habilidadeItem}>
                          <span className={styles.habilidadeNome}>{habilidade.nome}</span>
                          <div className={styles.habilidadeNivel}>
                            {[1, 2, 3, 4, 5].map(nivel => (
                              <button
                                key={nivel}
                                type="button"
                                className={`${styles.nivelStar} ${nivel <= habilidade.nivel ? styles.active : ''}`}
                                onClick={() => atualizarNivelHabilidade(habilidade.id, nivel)}
                                aria-label={`Nível ${nivel}`}
                              >
                                <Star size={16} fill={nivel <= habilidade.nivel ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            className={styles.removeHabilidadeBtn}
                            onClick={() => removerHabilidade(habilidade.id)}
                            aria-label="Remover habilidade"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={styles.navigationButtons}>
                    <button 
                      type="button" 
                      className={styles.secondaryBtn} 
                      onClick={passoAnterior}
                    >
                      <ArrowLeft size={18} aria-hidden="true" />
                      Voltar
                    </button>
                    <button 
                      type="button" 
                      className={styles.skipBtn}
                      onClick={pularEtapa}
                    >
                      Pular etapa
                    </button>
                    <button 
                      type="button" 
                      className={styles.primaryBtn}
                      onClick={proximoPasso}
                    >
                      Continuar
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ========== PASSO 6 - PREFERÊNCIAS E FINALIZAÇÃO ========== */}
            {step === 6 && (
              <>
                <h1 className={styles.title}>Preferências de Emprego</h1>
                <p className={styles.subtitle}>Configure suas preferências para receber vagas compatíveis</p>

                <form onSubmit={handleFinalSubmit} className={styles.form}>
                  {/* Áreas de interesse */}
                  <div className={styles.inputGroup}>
                    <label>Áreas de Interesse</label>
                    <div className={styles.tagsContainer}>
                      {areasInteresse.map(area => (
                        <button
                          key={area}
                          type="button"
                          className={`${styles.tagBtn} ${preferencias.areasInteresse.includes(area) ? styles.selected : ''}`}
                          onClick={() => toggleAreaInteresse(area)}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tipo de contrato */}
                  <div className={styles.inputGroup}>
                    <label>Tipo de Contrato Desejado</label>
                    <div className={styles.tagsContainer}>
                      {['CLT', 'PJ', 'Estágio', 'Temporário', 'Freelancer', 'Jovem Aprendiz'].map(tipo => (
                        <button
                          key={tipo}
                          type="button"
                          className={`${styles.tagBtn} ${preferencias.tipoContrato.includes(tipo) ? styles.selected : ''}`}
                          onClick={() => toggleTipoContrato(tipo)}
                        >
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pretensão salarial e disponibilidade */}
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="pretensaoSalarial">Pretensão Salarial</label>
                      <select
                        id="pretensaoSalarial"
                        value={preferencias.pretensaoSalarial}
                        onChange={(e) => setPreferencias({ ...preferencias, pretensaoSalarial: e.target.value })}
                        className={styles.select}
                      >
                        <option value="">Selecione</option>
                        <option value="ate1000">Até R$ 1.000</option>
                        <option value="1000a1500">R$ 1.000 a R$ 1.500</option>
                        <option value="1500a2000">R$ 1.500 a R$ 2.000</option>
                        <option value="2000a3000">R$ 2.000 a R$ 3.000</option>
                        <option value="3000a5000">R$ 3.000 a R$ 5.000</option>
                        <option value="acima5000">Acima de R$ 5.000</option>
                        <option value="negociavel">A combinar</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="disponibilidadeInicio">Disponibilidade para Início</label>
                      <select
                        id="disponibilidadeInicio"
                        value={preferencias.disponibilidadeInicio}
                        onChange={(e) => setPreferencias({ ...preferencias, disponibilidadeInicio: e.target.value })}
                        className={styles.select}
                      >
                        <option value="">Selecione</option>
                        <option value="imediata">Imediata</option>
                        <option value="15dias">Em 15 dias</option>
                        <option value="30dias">Em 30 dias</option>
                        <option value="60dias">Em 60 dias</option>
                      </select>
                    </div>
                  </div>

                  {/* Disponibilidade de horário */}
                  <div className={styles.inputGroup}>
                    <label>Disponibilidade de Horário</label>
                    <div className={styles.tagsContainer}>
                      {['Manhã', 'Tarde', 'Noite', 'Integral', 'Fins de semana'].map(horario => (
                        <button
                          key={horario}
                          type="button"
                          className={`${styles.tagBtn} ${preferencias.disponibilidadeHorario.includes(horario) ? styles.selected : ''}`}
                          onClick={() => toggleDisponibilidadeHorario(horario)}
                        >
                          {horario}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Checkboxes adicionais */}
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={preferencias.aceitaViagem}
                        onChange={(e) => setPreferencias({ ...preferencias, aceitaViagem: e.target.checked })}
                      />
                      <span>Aceito viajar a trabalho</span>
                    </label>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={preferencias.possuiCNH}
                        onChange={(e) => setPreferencias({ ...preferencias, possuiCNH: e.target.checked })}
                      />
                      <span>Possuo CNH</span>
                    </label>

                    {preferencias.possuiCNH && (
                      <div className={styles.inputGroup} style={{ marginLeft: '28px' }}>
                        <label htmlFor="categoriaCNH">Categoria</label>
                        <select
                          id="categoriaCNH"
                          value={preferencias.categoriaCNH}
                          onChange={(e) => setPreferencias({ ...preferencias, categoriaCNH: e.target.value })}
                          className={styles.select}
                        >
                          <option value="">Selecione</option>
                          <option value="A">A (Moto)</option>
                          <option value="B">B (Carro)</option>
                          <option value="AB">AB</option>
                          <option value="C">C (Caminhão)</option>
                          <option value="D">D (Ônibus)</option>
                          <option value="E">E (Carreta)</option>
                        </select>
                      </div>
                    )}

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={preferencias.possuiVeiculo}
                        onChange={(e) => setPreferencias({ ...preferencias, possuiVeiculo: e.target.checked })}
                      />
                      <span>Possuo veículo próprio</span>
                    </label>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={preferencias.pcd}
                        onChange={(e) => setPreferencias({ ...preferencias, pcd: e.target.checked })}
                      />
                      <span>
                        Pessoa com Deficiência (PcD)
                        <LGPDTooltip field="pcd" />
                      </span>
                    </label>

                    {preferencias.pcd && (
                      <div className={styles.inputGroup} style={{ marginLeft: '28px' }}>
                        <label htmlFor="tipoPcd">Tipo de Deficiência</label>
                        <select
                          id="tipoPcd"
                          value={preferencias.tipoPcd}
                          onChange={(e) => setPreferencias({ ...preferencias, tipoPcd: e.target.value })}
                          className={styles.select}
                        >
                          <option value="">Selecione</option>
                          <option value="fisica">Física</option>
                          <option value="auditiva">Auditiva</option>
                          <option value="visual">Visual</option>
                          <option value="intelectual">Intelectual</option>
                          <option value="multipla">Múltipla</option>
                        </select>
                      </div>
                    )}
                  </div>

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
                      Seus dados serão utilizados exclusivamente pelo Governo de Rondônia 
                      para promover políticas públicas de geração de empregos.
                    </p>
                  </div>

                  <div className={styles.navigationButtons}>
                    <button 
                      type="button" 
                      className={styles.secondaryBtn} 
                      onClick={passoAnterior}
                    >
                      <ArrowLeft size={18} aria-hidden="true" />
                      Voltar
                    </button>
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
                  </div>
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
