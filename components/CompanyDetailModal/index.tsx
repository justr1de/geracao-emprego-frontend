"use client"

import ModalOverlay from "@/components/ModalOverlay"
import styles from "./index.module.css"

interface Company {
  id: number
  name: string
  description: string
  category: string
  vacancies: number
  logo?: string
  about?: string
  openJobs?: Array<{ id: number; title: string; type: string }>
}

interface CompanyDetailModalProps {
  company: Company
  onClose: () => void
}

export default function CompanyDetailModal({ company, onClose }: CompanyDetailModalProps) {
  const defaultJobs = [
    { id: 1, title: "Auxiliar Administrativo", type: "CLT" },
    { id: 2, title: "Vendedor", type: "CLT" },
    { id: 3, title: "Gerente de Loja", type: "CLT" },
  ]

  const jobs = company.openJobs || defaultJobs

  return (
    <ModalOverlay onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.header}>
          <img src={company.logo || "/placeholder.svg?height=80&width=80"} alt={company.name} className={styles.logo} />
          <div>
            <h2 className={styles.name}>{company.name}</h2>
            <span className={styles.category}>{company.category}</span>
          </div>
        </div>

        <div className={styles.vacanciesCard}>
          <span className={styles.vacanciesCount}>{company.vacancies}</span>
          <span className={styles.vacanciesLabel}>vagas abertas</span>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Sobre a Empresa</h3>
          <p className={styles.about}>
            {company.about ||
              company.description ||
              "Empresa líder em seu segmento, comprometida com a excelência e o desenvolvimento profissional de seus colaboradores."}
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Vagas Disponíveis ({jobs.length})</h3>
          <div className={styles.jobsList}>
            {jobs.map((job) => (
              <div key={job.id} className={styles.jobItem}>
                <div>
                  <p className={styles.jobTitle}>{job.title}</p>
                  <span className={styles.jobType}>{job.type}</span>
                </div>
                <button className={styles.viewJobBtn}>Ver vaga</button>
              </div>
            ))}
          </div>
        </div>

        <button className={styles.viewAllBtn}>Ver Todas as Vagas</button>
      </div>
    </ModalOverlay>
  )
}
