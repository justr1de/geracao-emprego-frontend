"use client"

import ModalOverlay from "@/components/ModalOverlay"
import styles from "./index.module.css"

interface Resume {
  id: number
  name: string
  age: number
  profession: string
  location: string
  experience: string
  education: string
  skills: string[]
  about?: string
  email?: string
  phone?: string
}

interface ResumeDetailModalProps {
  resume: Resume
  onClose: () => void
}

export default function ResumeDetailModal({ resume, onClose }: ResumeDetailModalProps) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.avatar}>{resume.name.charAt(0)}</div>
          <div>
            <h2 className={styles.name}>{resume.name}</h2>
            <p className={styles.profession}>{resume.profession}</p>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Idade:</span>
            <span className={styles.value}>{resume.age} anos</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Localização:</span>
            <span className={styles.value}>{resume.location}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Experiência:</span>
            <span className={styles.value}>{resume.experience}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Formação:</span>
            <span className={styles.value}>{resume.education}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Sobre</h3>
          <p className={styles.about}>
            {resume.about ||
              "Profissional dedicado com experiência comprovada na área. Busco oportunidades para crescimento e desenvolvimento de carreira."}
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Habilidades</h3>
          <div className={styles.skills}>
            {resume.skills.map((skill, i) => (
              <span key={i} className={styles.skillTag}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <button className={styles.contactBtn}>Ver Contato</button>
      </div>
    </ModalOverlay>
  )
}
