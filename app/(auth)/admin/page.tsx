// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, LogIn, ArrowLeft, Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login');
        setIsLoading(false);
        return;
      }

      // Login bem-sucedido - redirecionar para o dashboard admin
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro de conexão. Tente novamente.');
      setIsLoading(false);
    }
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
        <div className={styles.loginCard}>
          {/* Logo e Título */}
          <div className={styles.logoSection}>
            <div className={styles.adminIcon}>
              <Shield size={48} />
            </div>
            <Link href="/" className={styles.geracaoLogoLink}>
              <Image
                src="/logos/geracao-emprego-logo.png"
                alt="Geração Emprego"
                width={180}
                height={45}
                className={styles.geracaoLogo}
                priority
              />
            </Link>
          </div>

          {/* Título */}
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Área Administrativa</h1>
            <p className={styles.subtitle}>
              Acesso restrito a administradores do sistema
            </p>
          </div>

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
              <label htmlFor="email" className={styles.label}>
                E-mail
              </label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setError(null);
                  }}
                  required
                  className={styles.input}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Senha
              </label>
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
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loading}>Entrando...</span>
              ) : (
                <>
                  <LogIn size={18} aria-hidden="true" />
                  <span>Entrar como Administrador</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <footer className={styles.footer}>
            <p className={styles.securityNotice}>
              <Shield size={14} />
              <span>Conexão segura e criptografada</span>
            </p>
          </footer>
        </div>
      </main>

      {/* Copyright */}
      <footer className={styles.copyright}>
        <p>© 2025 Geração Emprego - Painel Administrativo</p>
      </footer>
    </div>
  );
}
