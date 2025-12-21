import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"
import styles from "./index.module.css"

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
                <a href="#sobre">Quem Somos</a>
              </li>
              <li>
                <a href="#missao">Nossa Missão</a>
              </li>
              <li>
                <a href="#equipe">Equipe</a>
              </li>
              <li>
                <a href="#contato">Contato</a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Serviços</h3>
            <ul className={styles.list}>
              <li>
                <a href="#curriculos">Banco de Currículos</a>
              </li>
              <li>
                <a href="#vagas">Divulgação de Vagas</a>
              </li>
              <li>
                <a href="#cursos">Cursos Parceiros</a>
              </li>
              <li>
                <a href="#consultoria">Consultoria RH</a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Redes Sociais</h3>
            <div className={styles.socials}>
              <a href="#" className={styles.social}>
                <Facebook />
              </a>
              <a href="#" className={styles.social}>
                <Twitter />
              </a>
              <a href="#" className={styles.social}>
                <Linkedin />
              </a>
              <a href="#" className={styles.social}>
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
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2025 Geração Emprego. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
