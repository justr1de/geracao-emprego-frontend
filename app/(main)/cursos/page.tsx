"use client"

import { useState } from "react"
import BackButton from "@/components/BackButton"
import CourseDetailModal from "@/components/CourseDetailModal"
import styles from "./page.module.css"

const mockCourses = [
  {
    id: 1,
    title: "Assistente Administrativo",
    institution: "SENAI",
    duration: "3 meses",
    modality: "Presencial",
    category: "Administrativo",
    description: "Curso completo de formação para assistente administrativo",
    requirements: ["Ensino médio completo", "Disponibilidade de tempo"],
    syllabus: ["Rotinas administrativas", "Gestão de documentos", "Atendimento ao cliente"],
  },
  {
    id: 2,
    title: "Desenvolvimento Web Full Stack",
    institution: "SENAC",
    duration: "6 meses",
    modality: "Híbrido",
    category: "Tecnologia",
    description: "Aprenda a desenvolver aplicações web modernas",
    requirements: ["Conhecimento básico de informática", "Inglês intermediário"],
    syllabus: ["HTML, CSS e JavaScript", "React e Node.js", "Banco de dados"],
  },
]

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<(typeof mockCourses)[0] | null>(null)

  return (
    <div className={styles.pageContainer}>
      <BackButton />

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Cursos Profissionalizantes</h1>
          <p className={styles.subtitle}>Desenvolva suas habilidades com nossos parceiros</p>
        </div>

        <div className={styles.partners}>
          <div className={styles.partnerBadge}>SENAI</div>
          <div className={styles.partnerBadge}>SENAC</div>
          <div className={styles.partnerBadge}>SEBRAE</div>
        </div>

        <div className={styles.grid}>
          {mockCourses.map((course) => (
            <div key={course.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>{course.category}</span>
                <span className={styles.institution}>{course.institution}</span>
              </div>

              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.description}>{course.description}</p>

              <div className={styles.details}>
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Duração:</span>
                  <span>{course.duration}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Modalidade:</span>
                  <span>{course.modality}</span>
                </div>
              </div>

              <button className={styles.enrollBtn} onClick={() => setSelectedCourse(course)}>
                Ver Detalhes
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
    </div>
  )
}
