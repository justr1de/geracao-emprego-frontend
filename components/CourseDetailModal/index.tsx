"use client"

import ModalOverlay from "@/components/ModalOverlay"
import styles from "./index.module.css"

interface Course {
  id: number
  title: string
  institution: string
  duration: string
  modality: string
  category: string
  description: string
  requirements?: string[]
  syllabus?: string[]
}

interface CourseDetailModalProps {
  course: Course
  onClose: () => void
}

export default function CourseDetailModal({ course, onClose }: CourseDetailModalProps) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.badge}>{course.institution}</div>
          <h2 className={styles.title}>{course.title}</h2>
          <span className={styles.category}>{course.category}</span>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Duração</span>
            <span className={styles.infoValue}>{course.duration}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Modalidade</span>
            <span className={styles.infoValue}>{course.modality}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Descrição</h3>
          <p className={styles.description}>{course.description}</p>
        </div>

        {course.requirements && course.requirements.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Requisitos</h3>
            <ul className={styles.list}>
              {course.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {course.syllabus && course.syllabus.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Conteúdo Programático</h3>
            <ul className={styles.list}>
              {course.syllabus.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <button className={styles.enrollBtn}>Inscrever-se</button>
      </div>
    </ModalOverlay>
  )
}
