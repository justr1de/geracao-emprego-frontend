'use client';

import { Menu, X, CheckCircle, Bell, Shield, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import styles from './index.module.css';

export default function Header() {
  const { isAdmin, setIsAdmin, isLogged } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {setMobileMenuOpen(false);}
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  };

  const notifications = [
    { id: 1, text: 'Seu currículo é compatível com a vaga de Desenvolvedor Frontend', new: true },
    { id: 2, text: 'Nova vaga disponível: Analista de Sistemas', new: true },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <CheckCircle className={styles.logoIcon} />
          <span className={styles.logoText}>Geração Emprego</span>
        </Link>

        {mobileMenuOpen && <div className={styles.overlay} onClick={closeMenu} />}

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
          <Link href="/" className={styles.navLink} onClick={closeMenu}>Home</Link>
          <Link href="/curriculos" className={styles.navLink} onClick={closeMenu}>Buscar currículos</Link>
          <Link href="/vagas" className={styles.navLink} onClick={closeMenu}>Vagas</Link>
          <Link href="/cursos" className={styles.navLink} onClick={closeMenu}>Cursos</Link>
          <Link href="/editais" className={styles.navLink} onClick={closeMenu}>Editais</Link>
          <Link href="/empresas" className={styles.navLink} onClick={closeMenu}>Empresas</Link>

          {isAdmin && (
            <Link href="/#gestor" className={styles.navLink} onClick={closeMenu}>
              Área do Gestor
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          {isLogged && (
            <div className={styles.notificationWrapper}>
              <button
                className={styles.notificationBtn}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={20} />
                {notifications.some((n) => n.new) && <span className={styles.notificationDot} />}
              </button>
            </div>
          )}

          {/* Botão de Admin corrigido com ícones Lucide */}
          <button
            className={`${styles.adminToggle} ${isAdmin ? styles.adminActive : ''}`}
            onClick={() => setIsAdmin(!isAdmin)}
          >
            {isAdmin ? (
              <div className={styles.adminBtnInner}>
                <Shield size={16} /> <span>Admin</span>
              </div>
            ) : (
              <div className={styles.adminBtnInner}>
                <ShieldAlert size={16} /> <span>Gestor</span>
              </div>
            )}
          </button>

          <Link href="/login" className={styles.btnLogin} onClick={closeMenu}>Entrar</Link>
          <Link href="/cadastro" className={styles.btnSignup} onClick={closeMenu}>Cadastre-se</Link>
        </div>

        <button className={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
}
