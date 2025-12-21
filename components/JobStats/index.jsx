import styles from "./index.module.css"

export default function JobStats() {
  return (
    <div className={styles.stats}>
      <div className={styles.container}>
        <div className={styles.card} style={{ borderColor: "#1e40af" }}>
          <div className={styles.icon} style={{ background: "#1e40af" }}>
            💼
          </div>
          <div className={styles.number}>1,234</div>
          <div className={styles.label}>Total de vagas abertas</div>
        </div>

        <div className={styles.card} style={{ borderColor: "#7c3aed" }}>
          <div className={styles.icon} style={{ background: "#7c3aed" }}>
            🏢
          </div>
          <div className={styles.number}>567</div>
          <div className={styles.label}>Empresas cadastradas</div>
        </div>

        <div className={styles.card} style={{ borderColor: "#16a34a" }}>
          <div className={styles.icon} style={{ background: "#16a34a" }}>
            📊
          </div>
          <div className={styles.number}>8,901</div>
          <div className={styles.label}>Publicações já realizadas</div>
        </div>
      </div>
    </div>
  )
}
