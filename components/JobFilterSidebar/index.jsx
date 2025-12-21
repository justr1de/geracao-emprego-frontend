import styles from "./index.module.css"

export default function JobFilterSidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filtros</h3>
        <button className={styles.reset}>Redefinir filtros</button>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Tipo de vaga</h4>
        <div className={styles.pills}>
          <button className={styles.pill}>Tempo integral</button>
          <button className={styles.pill}>Meio período</button>
          <button className={styles.pill}>Estágio</button>
          <button className={styles.pill}>Temporário</button>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Salário a partir de</h4>
        <div className={styles.pills}>
          <button className={styles.pill}>R$ 1.000</button>
          <button className={styles.pill}>R$ 2.000</button>
          <button className={styles.pill}>R$ 3.000</button>
          <button className={styles.pill}>R$ 5.000</button>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Escolaridade</h4>
        <div className={styles.pills}>
          <button className={styles.pill}>Fundamental</button>
          <button className={styles.pill}>Médio</button>
          <button className={styles.pill}>Superior</button>
          <button className={styles.pill}>Pós-graduação</button>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Local da vaga</h4>
        <div className={styles.pills}>
          <button className={styles.pill}>Remoto</button>
          <button className={styles.pill}>Presencial</button>
          <button className={styles.pill}>Híbrido</button>
        </div>
      </div>

      <button className={styles.applyButton}>Aplicar Filtros</button>
    </div>
  )
}
