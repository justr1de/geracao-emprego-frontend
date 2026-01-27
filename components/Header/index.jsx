'use client';

import { Menu, X, User, LogIn, Home, Briefcase, GraduationCap, Building2, BarChart3 } from 'lucide-react';
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
    { href: '/observatorio', label: 'Observatório', icon: BarChart3 },
  ];

  return (
    <>
      {/* Skip link para acessibilidade */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        {/* Primeira linha: Logos, Logo Principal e Navegação */}
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
              href="https://rondonia.ro.gov.br/sedec/"
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
              href="https://rondonia.ro.gov.br/sedec/institucional/sine/"
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
            <Image
              src="/logos/geracao-emprego-logo.png"
              alt="Geração Emprego"
              width={180}
              height={45}
              className={styles.mainLogo}
              priority
            />
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
                    <Link href="/tipo-cadastro" className={styles.mobileSignupBtn} onClick={closeMenu}>
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
