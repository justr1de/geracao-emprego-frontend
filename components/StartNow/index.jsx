import { Search, FileText, Heart, Globe } from "lucide-react"
import styles from "./index.module.css"

export default function StartNow() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Comece Agora</h2>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardHeader} style={{ background: "#1e40af" }}>
              <Search className={styles.headerIcon} />
              <h3 className={styles.cardTitle}>Busque por profissionais</h3>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardText}>
                Encontre os melhores talentos para sua empresa. Acesse milhares de currículos qualificados.
              </p>
              <div className={styles.filterInfo}>
                <Heart className={styles.filterIcon} />
                <span className={styles.filterText}>Filtros de Diversidade Disponíveis</span>
              </div>
              <ul className={styles.filterList}>
                <li>🏳️‍🌈 LGBTQIA+</li>
                <li>🌿 Indígena</li>
                <li>♿ PCD</li>
                <li>👥 Autodeclaração</li>
              </ul>
              <button className={styles.cardButton}>Buscar Currículos</button>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader} style={{ background: "#16a34a" }}>
              <FileText className={styles.headerIcon} />
              <h3 className={styles.cardTitle}>Em busca de uma nova colocação?</h3>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardText}>
                Cadastre seu currículo e encontre oportunidades incríveis em empresas de todo o Brasil.
              </p>
              <div className={styles.filterInfo}>
                <Globe className={styles.filterIcon} />
                <span className={styles.filterText}>Oportunidades Inclusivas</span>
              </div>
              <ul className={styles.filterList}>
                <li>✅ Vagas Afirmativas</li>
                <li>✅ Empresas Inclusivas</li>
                <li>✅ Diversidade Valorizada</li>
                <li>✅ Ambiente Respeitoso</li>
              </ul>
              <button className={styles.cardButton}>Cadastrar Currículo</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
