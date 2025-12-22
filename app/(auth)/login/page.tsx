// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, LogIn, ArrowLeft, Mail, Lock } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Login enviado:', formData);
    router.push('/');
  };

  const handleSouGovLogin = () => {
    router.push('/login/sougov');
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
              src="/logos/governo-ro.jpg"
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
                Acesse sua conta para continuar
              </p>
            </div>

            {/* Botão Login SouGov */}
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
              <span>ou continue com e-mail</span>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="login" className={styles.label}>
                  E-mail ou CPF
                </label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} aria-hidden="true" />
                  <input
                    id="login"
                    type="text"
                    placeholder="Digite seu e-mail ou CPF"
                    value={formData.login}
                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                    required
                    className={styles.input}
                    autoComplete="username"
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
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.loading}>Entrando...</span>
                ) : (
                  <>
                    <LogIn size={18} aria-hidden="true" />
                    <span>Entrar</span>
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
                <Link href="/cadastro" className={styles.registerLink}>
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
              src="/logos/sine.jpg"
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
        <p>© 2024 Geração Emprego - Todos os Direitos Reservados</p>
      </footer>
    </div>
  );
}
