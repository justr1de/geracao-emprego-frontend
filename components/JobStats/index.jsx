"use client"

import { Briefcase, Building2, BarChart3 } from "lucide-react"
import styles from "./index.module.css"

export default function JobStats() {
  return (
    <section className={styles.stats}>
      <div className={styles.container}>
        <div className={styles.card} style={{ "--accent": "#1e40af" }}>
          <div className={styles.iconWrapper}>
            <Briefcase size={24} />
          </div>
          <div className={styles.content}>
            <div className={styles.number}>1.234</div>
            <div className={styles.label}>Vagas Abertas</div>
          </div>
        </div>

        <div className={styles.card} style={{ "--accent": "#7c3aed" }}>
          <div className={styles.iconWrapper}>
            <Building2 size={24} />
          </div>
          <div className={styles.content}>
            <div className={styles.number}>567</div>
            <div className={styles.label}>Empresas</div>
          </div>
        </div>

        <div className={styles.card} style={{ "--accent": "#16a34a" }}>
          <div className={styles.iconWrapper}>
            <BarChart3 size={24} />
          </div>
          <div className={styles.content}>
            <div className={styles.number}>8.901</div>
            <div className={styles.label}>Publicações</div>
          </div>
        </div>
      </div>
    </section>
  )
}