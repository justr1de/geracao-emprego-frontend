'use client';

import { Menu, X, User, LogIn, Home, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/contexts/AppContext';
import styles from './index.module.css';

export default function Header() {
  const { isLogged } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/vagas', label: 'Vagas', icon: Briefcase },
    { href: '/cursos', label: 'Cursos', icon: GraduationCap },
    { href: '/empresas', label: 'Empresas', icon: Building2 },
  ];

  return (
    <>
      {/* Skip link para acessibilidade */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          {/* Logos Institucionais */}
          <div className={styles.institutionalLogos}>
            <a
              href="https://rondonia.ro.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acessar site do Governo de Rondônia (abre em nova janela)"
              className={styles.institutionalLink}
            >
              <Image
                src="/logos/governo-ro.jpg"
                alt="Governo de Rondônia"
                width={60}
                height={60}
                className={styles.governoLogo}
              />
            </a>
            <a
              href="https://sedec.ro.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acessar site da SEDEC - Secretaria de Desenvolvimento Econômico (abre em nova janela)"
              className={styles.institutionalLink}
            >
              <Image
                src="/logos/sedec.png"
                alt="SEDEC - Secretaria de Desenvolvimento Econômico"
                width={102}
                height={31}
                className={styles.sedecLogo}
              />
            </a>
            <a
              href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/sine"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acessar site do SINE - Sistema Nacional de Emprego (abre em nova janela)"
              className={styles.institutionalLink}
            >
              <Image
                src="/logos/sine.jpg"
                alt="SINE - Sistema Nacional de Emprego"
                width={60}
                height={30}
                className={styles.institutionalLogoWide}
              />
            </a>
          </div>

          {/* Logo Principal */}
          <Link href="/" className={styles.logo} onClick={closeMenu} aria-label="Ir para página inicial">
            <div className={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={styles.logoText}>Geração Emprego</span>
          </Link>

          {/* Navegação Desktop */}
          <nav className={styles.desktopNav} aria-label="Navegação principal">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                <link.icon size={18} aria-hidden="true" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Ações */}
          <div className={styles.actions}>
            {isLogged ? (
              <Link href="/perfil" className={styles.profileBtn} aria-label="Meu perfil">
                <User size={20} />
                <span className={styles.profileText}>Meu Perfil</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className={styles.loginBtn}>
                  <LogIn size={18} />
                  <span>Entrar</span>
                </Link>
                <Link href="/cadastro" className={styles.signupBtn}>
                  Cadastre-se
                </Link>
              </>
            )}
          </div>

          {/* Botão Menu Mobile */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <>
            <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />
            <nav className={styles.mobileNav} aria-label="Menu de navegação">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={closeMenu}
                >
                  <link.icon size={20} aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
              <div className={styles.mobileActions}>
                {isLogged ? (
                  <Link href="/perfil" className={styles.mobileProfileBtn} onClick={closeMenu}>
                    <User size={20} />
                    Meu Perfil
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className={styles.mobileLoginBtn} onClick={closeMenu}>
                      Entrar
                    </Link>
                    <Link href="/cadastro" className={styles.mobileSignupBtn} onClick={closeMenu}>
                      Cadastre-se Grátis
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </>
        )}
      </header>
    </>
  );
}
