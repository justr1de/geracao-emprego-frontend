// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, LogIn, ArrowLeft, Building2, User, Lock, AlertCircle } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'candidato' | 'empresa'>('candidato');
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Primeiro, buscar o email do candidato/empresa pela API
      const response = await fetch('/api/auth/login-documento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documento: formData.login.replace(/\D/g, ''), // Remove formatação antes de enviar
          password: formData.password,
          tipo: loginType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login');
        setIsLoading(false);
        return;
      }

      // Se a API retornou sucesso, fazer login via Supabase client para manter a sessão
      const supabase = getSupabaseClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.user.email,
        password: formData.password,
      });

      if (signInError) {
        console.error('Erro ao estabelecer sessão:', signInError);
        setError('Erro ao estabelecer sessão. Tente novamente.');
        setIsLoading(false);
        return;
      }

      // Login bem-sucedido - redirecionar para a página apropriada
      if (data.redirect) {
        router.push(data.redirect);
      } else {
        // Fallback: redirecionar baseado no tipo de usuário
        if (loginType === 'candidato') {
          router.push('/perfil');
        } else {
          router.push('/empresa/dashboard');
        }
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro de conexão. Tente novamente.');
      setIsLoading(false);
    }
  };

  const handleSouGovLogin = () => {
    router.push('/login/sougov');
  };

  // Formatar CPF enquanto digita
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
    return value;
  };

  // Formatar CNPJ enquanto digita
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
    return value;
  };

  const handleLoginChange = (e) => {
    const value = e.target.value;
    setError(null); // Limpar erro ao digitar
    if (loginType === 'candidato') {
      setFormData({ ...formData, login: formatCPF(value) });
    } else {
      setFormData({ ...formData, login: formatCNPJ(value) });
    }
  };

  const handleTypeChange = (type: 'candidato' | 'empresa') => {
    setLoginType(type);
    setFormData({ ...formData, login: '' }); // Limpar o campo ao trocar de tipo
    setError(null); // Limpar erro ao trocar tipo
  };

  return (
    <div className={styles.page}>
      {/* Header minimalista */}
      <header className={styles.header}>
        <Link href="/" className={styles.backLink} aria-label="Voltar para página inicial">
          <ArrowLeft size={20} aria-hidden="true" />
          <span>Voltar</span>
        </Link>
      </header>

      <main className={styles.main}>
        {/* Coluna Esquerda - Logo Governo de Rondônia */}
        <aside className={styles.leftColumn}>
          <a
            href="https://rondonia.ro.gov.br"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.logoLink}
            aria-label="Acessar site do Governo de Rondônia (abre em nova janela)"
          >
            <Image
              src="/logos/governo-ro.png"
              alt="Governo de Rondônia"
              width={180}
              height={180}
              className={styles.governoLogo}
              priority
            />
          </a>
        </aside>

        {/* Coluna Central - Formulário de Login */}
        <div className={styles.centerColumn}>
          <div className={styles.loginCard}>
            {/* Logo Geração Emprego */}
            <div className={styles.logoSection}>
              <Link href="/" className={styles.geracaoLogoLink}>
                <Image
                  src="/logos/geracao-emprego-logo.png"
                  alt="Geração Emprego"
                  width={220}
                  height={55}
                  className={styles.geracaoLogo}
                  priority
                />
              </Link>
            </div>

            {/* Título */}
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Bem-vindo de volta</h1>
              <p className={styles.subtitle}>
                Selecione o tipo de conta para continuar
              </p>
            </div>

            {/* Seletor de Tipo de Login */}
            <div className={styles.typeSelector}>
              <button
                type="button"
                className={`${styles.typeBtn} ${loginType === 'candidato' ? styles.typeBtnActive : ''}`}
                onClick={() => handleTypeChange('candidato')}
                aria-pressed={loginType === 'candidato'}
              >
                <User size={20} aria-hidden="true" />
                <span>Candidato</span>
                <small>Login com CPF</small>
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${loginType === 'empresa' ? styles.typeBtnActiveEmpresa : ''}`}
                onClick={() => handleTypeChange('empresa')}
                aria-pressed={loginType === 'empresa'}
              >
                <Building2 size={20} aria-hidden="true" />
                <span>Empresa</span>
                <small>Login com CNPJ</small>
              </button>
            </div>

            {/* Botão Login SouGov - Apenas para Candidatos */}
            {loginType === 'candidato' && (
              <>
                <button
                  type="button"
                  className={styles.sougovBtn}
                  onClick={handleSouGovLogin}
                  aria-label="Entrar com conta SouGov.br"
                >
                  <Image
                    src="/logos/sougov.png"
                    alt=""
                    width={24}
                    height={24}
                    className={styles.sougovLogo}
                    aria-hidden="true"
                  />
                  <span>Entrar com SouGov.br</span>
                </button>

                {/* Divisor */}
                <div className={styles.divider} role="separator">
                  <span>ou continue com CPF</span>
                </div>
              </>
            )}

            {/* Mensagem de Erro */}
            {error && (
              <div className={styles.errorMessage} role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="login" className={styles.label}>
                  {loginType === 'candidato' ? 'CPF' : 'CNPJ'}
                </label>
                <div className={styles.inputWrapper}>
                  {loginType === 'candidato' ? (
                    <User size={18} className={styles.inputIcon} aria-hidden="true" />
                  ) : (
                    <Building2 size={18} className={styles.inputIcon} aria-hidden="true" />
                  )}
                  <input
                    id="login"
                    type="text"
                    placeholder={loginType === 'candidato' ? '000.000.000-00' : '00.000.000/0000-00'}
                    value={formData.login}
                    onChange={handleLoginChange}
                    required
                    className={styles.input}
                    autoComplete="username"
                    maxLength={loginType === 'candidato' ? 14 : 18}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="password" className={styles.label}>
                    Senha
                  </label>
                  <Link href="/recuperar-senha" className={styles.forgotLink}>
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} aria-hidden="true" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setError(null);
                    }}
                    required
                    className={styles.input}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className={`${styles.submitBtn} ${loginType === 'empresa' ? styles.submitBtnEmpresa : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.loading}>Entrando...</span>
                ) : (
                  <>
                    <LogIn size={18} aria-hidden="true" />
                    <span>Entrar como {loginType === 'candidato' ? 'Candidato' : 'Empresa'}</span>
                  </>
                )}
              </button>

              {/* Aviso LGPD */}
              <p className={styles.lgpdNotice}>
                Seus dados são protegidos conforme a{' '}
                <Link href="/politicas-privacidade" className={styles.lgpdLink}>
                  Lei Geral de Proteção de Dados (LGPD)
                </Link>.
              </p>
            </form>

            {/* Footer */}
            <footer className={styles.footer}>
              <p className={styles.registerText}>
                Ainda não tem conta?{' '}
                <Link href="/tipo-cadastro" className={styles.registerLink}>
                  Cadastre-se gratuitamente
                </Link>
              </p>
            </footer>
          </div>
        </div>

        {/* Coluna Direita - Logos SEDEC e SINE */}
        <aside className={styles.rightColumn}>
          <a
            href="https://rondonia.ro.gov.br/sedec/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.logoLink}
            aria-label="Acessar site da SEDEC (abre em nova janela)"
          >
            <Image
              src="/logos/sedec.png"
              alt="SEDEC - Secretaria de Desenvolvimento Econômico"
              width={200}
              height={60}
              className={styles.sedecLogo}
            />
          </a>
          <a
            href="https://rondonia.ro.gov.br/sedec/institucional/sine/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.logoLink}
            aria-label="Acessar site do SINE (abre em nova janela)"
          >
            <Image
              src="/logos/sine.png"
              alt="SINE - Sistema Nacional de Emprego"
              width={180}
              height={90}
              className={styles.sineLogo}
            />
          </a>
        </aside>
      </main>

      {/* Copyright */}
      <footer className={styles.copyright}>
        <p>© 2025 Geração Emprego - Todos os Direitos Reservados</p>
      </footer>
    </div>
  );
}
