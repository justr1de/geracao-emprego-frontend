'use client';

import Link from 'next/link';
import styles from './index.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo e descrição */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoIcon}>
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Geração Emprego</span>
          </div>
          <p className={styles.description}>
            Iniciativa do Governo do Estado de Rondônia para conectar trabalhadores e empresas.
          </p>
        </div>

        {/* Links */}
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <h3 className={styles.linkTitle}>Para você</h3>
            <Link href="/vagas" className={styles.link}>Buscar Vagas</Link>
            <Link href="/cursos" className={styles.link}>Cursos Gratuitos</Link>
            <Link href="/cadastro" className={styles.link}>Cadastrar Currículo</Link>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.linkTitle}>Para empresas</h3>
            <Link href="/curriculos" className={styles.link}>Buscar Currículos</Link>
            <Link href="/cadastro" className={styles.link}>Cadastrar Empresa</Link>
            <Link href="/editais" className={styles.link}>Ver Editais</Link>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.linkTitle}>Ajuda</h3>
            <Link href="/faq" className={styles.link}>Perguntas Frequentes</Link>
            <Link href="/contato" className={styles.link}>Fale Conosco</Link>
            <Link href="/termos" className={styles.link}>Termos de Uso</Link>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Geração Emprego. Governo do Estado de Rondônia.
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>100% Gratuito</span>
            <span className={styles.badge}>Dados Seguros</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
