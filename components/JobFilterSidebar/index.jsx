"use client"

import { Filter, RotateCcw } from "lucide-react"
import styles from "./index.module.css"

export default function JobFilterSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Filter size={18} style={{marginRight: '8px'}} />
          Filtros
        </h3>
        <button className={styles.reset} title="Limpar tudo">
          <RotateCcw size={12} style={{marginRight: '4px'}} />
          Limpar
        </button>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Tipo de vaga</h4>
        <div className={styles.pills}>
          <button className={`${styles.pill} ${styles.pillActive}`}>Tempo integral</button>
          <button className={styles.pill}>Meio período</button>
          <button className={styles.pill}>Estágio</button>
          <button className={styles.pill}>Temporário</button>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Salário</h4>
        <div className={styles.pills}>
          <button className={styles.pill}>R$ 1.000+</button>
          <button className={styles.pill}>R$ 2.000+</button>
          <button className={styles.pill}>R$ 3.000+</button>
          <button className={styles.pill}>R$ 5.000+</button>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Localização</h4>
        <div className={styles.pills}>
          <button className={styles.pill}>Remoto</button>
          <button className={styles.pill}>Presencial</button>
          <button className={styles.pill}>Híbrido</button>
        </div>
      </div>

      <button className={styles.applyButton}>Aplicar Filtros</button>
    </aside>
  )
}