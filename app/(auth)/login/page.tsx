// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ login: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login enviado:', formData);
    router.push('/');
  };

  const handleSouGovLogin = () => {
    // Demonstrativo - futuramente será integrado com OAuth do SouGov
    alert('Em breve! A integração com o SouGov permitirá importar seus dados automaticamente.');
  };

  return (
    <div className={styles.container}>
      <aside className={styles.leftPanel}>
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>Geração Emprego</h1>
          <p className={styles.tagline}>Conectando você ao futuro.</p>
        </div>
      </aside>

      <main className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <header>
            <h2 className={styles.title}>Entrar</h2>
            <p className={styles.subtitle}>Acesse sua conta para continuar</p>
          </header>

          {/* Botão Login SouGov */}
          <button 
            type="button" 
            className={styles.sougovBtn}
            onClick={handleSouGovLogin}
          >
            <Image
              src="/logos/sougov.png"
              alt="SouGov.br"
              width={32}
              height={32}
              className={styles.sougovLogo}
            />
            <span>Entrar com SouGov.br</span>
          </button>

          <div className={styles.divider}>
            <span>ou entre com e-mail</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="login">E-mail ou CPF</label>
              <input
                id="login"
                type="text"
                placeholder="Ex: 000.000.000-00"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha</label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Link href="/recuperar-senha" className={styles.forgotLink}>
              Esqueci minha senha
            </Link>

            <button type="submit" className={styles.submitBtn}>
              <LogIn size={20} />
              Acessar Sistema
            </button>
          </form>

          <footer className={styles.footer}>
            <p className={styles.registerLink}>
              Ainda não tem conta? <Link href="/cadastro">Cadastre-se</Link>
            </p>
            <p className={styles.copyright}>
              © 2024 Geração Emprego - Todos os Direitos Reservados
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
