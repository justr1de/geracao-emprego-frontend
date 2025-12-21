"use client"

import { ChevronLeft, ChevronRight, Calendar, Award } from "lucide-react"
import styles from "./index.module.css"

export default function Courses() {
  const courses = [
    { title: "Garçom Profissional", category: "Hospitalidade", date: "15 Jan - 20 Fev", partner: "SENAC", color: "#8b5cf6" },
    { title: "Cozinha Básica", category: "Gastronomia", date: "22 Jan - 30 Mar", partner: "SENAI", color: "#f59e0b" },
    { title: "Estética e Beleza", category: "Beleza", date: "01 Fev - 15 Mar", partner: "SENAC", color: "#ec4899" },
    { title: "Eletricista Predial", category: "Construção", date: "05 Fev - 10 Abr", partner: "SENAI", color: "#3b82f6" },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Cursos Disponíveis</h2>
          <div className={styles.navigation}>
            <button className={styles.navButton} aria-label="Anterior">
              <ChevronLeft size={24} />
            </button>
            <button className={styles.navButton} aria-label="Próximo">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className={styles.courses}>
          {courses.map((course, index) => (
            <div key={index} className={styles.courseCard}>
              {/* Removido o 'as any' para funcionar em .jsx */}
              <div className={styles.courseHeader} style={{ background: course.color }}>
                <div className={styles.partnerBadge}>
                  <Award className={styles.partnerIcon} />
                  <span>{course.partner}</span>
                </div>
                <span className={styles.categoryTag}>{course.category}</span>
              </div>
              <div className={styles.courseBody}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <div className={styles.courseDate}>
                  <Calendar size={18} />
                  <span>{course.date}</span>
                </div>
                <button className={styles.courseButton}>Inscrever-se</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}