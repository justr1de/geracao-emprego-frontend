import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import styles from './index.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wave} />

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Sobre</h3>
            <ul className={styles.list}>
              <li>
                <Link href="/#sobre">Quem Somos</Link>
              </li>
              <li>
                <Link href="/#missao">Nossa Missão</Link>
              </li>
              <li>
                <Link href="/#equipe">Equipe</Link>
              </li>
              <li>
                <Link href="/#contato">Contato</Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Serviços</h3>
            <ul className={styles.list}>
              <li>
                <Link href="/curriculos">Banco de Currículos</Link>
              </li>
              <li>
                <Link href="/vagas">Divulgação de Vagas</Link>
              </li>
              <li>
                <Link href="/cursos">Cursos Parceiros</Link>
              </li>
              <li>
                <Link href="/editais">Editais</Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Redes Sociais</h3>
            <div className={styles.socials}>
              <a href="#" className={styles.social} aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" className={styles.social} aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" className={styles.social} aria-label="LinkedIn">
                <Linkedin />
              </a>
              <a href="#" className={styles.social} aria-label="Instagram">
                <Instagram />
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Ajuda</h3>
            <ul className={styles.list}>
              <li className={styles.contact}>
                <Mail className={styles.contactIcon} />
                <span>contato@geracaoemprego.com.br</span>
              </li>
              <li className={styles.contact}>
                <Phone className={styles.contactIcon} />
                <span>(11) 1234-5678</span>
              </li>
              <li className={styles.contact}>
                <MapPin className={styles.contactIcon} />
                <span>São Paulo, SP - Brasil</span>
              </li>
              <li>
                <Link href="/login">Entrar</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2025 Geração Emprego. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
