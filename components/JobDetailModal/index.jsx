"use client"

import styles from "./index.module.css"

export default function JobDetailModal({ job, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>

        <div className={styles.header}>
          <div className={styles.companyLogo}>🏢</div>
          <div>
            <h2 className={styles.title}>{job.title}</h2>
            <p className={styles.company}>Empresa Exemplo Ltda</p>
          </div>
          <button className={styles.share}>Compartilhar</button>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Cargo</span>
            <span className={styles.infoValue}>{job.title}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Tipo</span>
            <span className={styles.infoValue}>{job.type}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Salário</span>
            <span className={styles.infoValue}>{job.salary}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Publicado</span>
            <span className={styles.infoValue}>{job.date}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Habilidades desejadas</h3>
          <div className={styles.tags}>
            <span className={styles.tag}>React</span>
            <span className={styles.tag}>JavaScript</span>
            <span className={styles.tag}>CSS</span>
            <span className={styles.tag}>HTML</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Descrição</h3>
          <p className={styles.text}>{job.description}</p>
        </div>

        <button className={styles.applyButton}>Enviar meu Currículo</button>
      </div>
    </div>
  )
}
