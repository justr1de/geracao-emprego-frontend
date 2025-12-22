'use client';

import Link from 'next/link';
import { Instagram, Facebook, MessageCircle, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import styles from './index.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Onda decorativa */}
      <div className={styles.wave}>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor"/>
        </svg>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Sobre */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Sobre</h3>
            <nav className={styles.nav} aria-label="Links sobre o site">
              <Link href="/termos" className={styles.link}>
                <ChevronRight size={14} aria-hidden="true" />
                Termos de Uso
              </Link>
              <Link href="/privacidade" className={styles.link}>
                <ChevronRight size={14} aria-hidden="true" />
                Políticas de Privacidade
              </Link>
              <Link href="/faq" className={styles.link}>
                <ChevronRight size={14} aria-hidden="true" />
                Perguntas Frequentes
              </Link>
            </nav>
          </div>

          {/* Serviços */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Serviços</h3>
            <nav className={styles.nav} aria-label="Links de serviços">
              <Link href="/curriculos" className={styles.link}>
                <ChevronRight size={14} aria-hidden="true" />
                Quero currículos
              </Link>
              <Link href="/vagas" className={styles.link}>
                <ChevronRight size={14} aria-hidden="true" />
                Buscar vagas
              </Link>
              <Link href="/cursos" className={styles.link}>
                <ChevronRight size={14} aria-hidden="true" />
                Cursos gratuitos
              </Link>
              <Link href="/empresas" className={styles.link}>
                <ChevronRight size={14} aria-hidden="true" />
                Cadastrar empresa
              </Link>
            </nav>
          </div>

          {/* Redes Sociais */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Redes Sociais</h3>
            <nav className={styles.socialNav} aria-label="Redes sociais">
              <a
                href="https://instagram.com/geracaoemprego"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Siga-nos no Instagram (abre em nova janela)"
              >
                <Instagram size={18} aria-hidden="true" />
                Instagram
              </a>
              <a
                href="https://facebook.com/geracaoemprego"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Siga-nos no Facebook (abre em nova janela)"
              >
                <Facebook size={18} aria-hidden="true" />
                Facebook
              </a>
            </nav>
          </div>

          {/* Ajuda */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Ajuda</h3>
            <div className={styles.contactList}>
              <a
                href="https://wa.me/5569999999999"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
                aria-label="Fale conosco pelo WhatsApp (abre em nova janela)"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Fale conosco pelo WhatsApp
              </a>
              <a
                href="mailto:suporte@geracaoemprego.ro.gov.br"
                className={styles.contactLink}
                aria-label="Enviar e-mail para suporte"
              >
                <Mail size={18} aria-hidden="true" />
                suporte@geracaoemprego.ro.gov.br
              </a>
              <div className={styles.contactInfo}>
                <Phone size={18} aria-hidden="true" />
                <span>(69) 3216-5300</span>
              </div>
              <div className={styles.contactInfo}>
                <MapPin size={18} aria-hidden="true" />
                <span>Porto Velho - RO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className={styles.bottom}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {currentYear} Geração Emprego - Governo do Estado de Rondônia. Todos os direitos reservados.
            </p>
            <p className={styles.credits}>
              Ícones feitos por <a href="https://www.flaticon.com" target="_blank" rel="noopener noreferrer">www.flaticon.com</a>
            </p>
          </div>
          <div className={styles.badges}>
            <span className={styles.badge}>SEDEC-RO</span>
            <span className={styles.badge}>SINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
