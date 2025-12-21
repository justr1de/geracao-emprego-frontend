"use client"

import ModalOverlay from "@/components/ModalOverlay"
import { Building2, Briefcase, ExternalLink, Info } from "lucide-react"
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
  ]

  const jobs = company.openJobs || defaultJobs

  return (
    <ModalOverlay onClose={onClose}>
      <div className={styles.content}>
        {/* Header com Logo Brutalista */}
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            {company.logo ? (
              <img src={company.logo} alt={company.name} className={styles.logoImg} />
            ) : (
              <Building2 size={40} color="#000" />
            )}
          </div>
          <div className={styles.headerInfo}>
            <h2 className={styles.name}>{company.name}</h2>
            <span className={styles.category}>{company.category}</span>
          </div>
        </div>

        {/* Card de Vagas com Destaque */}
        <div className={styles.vacanciesCard}>
          <div className={styles.vacanciesContent}>
            <span className={styles.vacanciesCount}>{company.vacancies}</span>
            <span className={styles.vacanciesLabel}>Vagas em Aberto</span>
          </div>
          <Briefcase size={32} className={styles.vacanciesIcon} />
        </div>

        {/* Sobre a Empresa */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Info size={18} /> Sobre a Empresa
          </h3>
          <p className={styles.about}>
            {company.about || company.description || "Empresa líder em seu segmento, comprometida com a excelência."}
          </p>
        </div>

        {/* Lista de Vagas Internas */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Vagas Disponíveis ({jobs.length})
          </h3>
          <div className={styles.jobsList}>
            {jobs.map((job) => (
              <div key={job.id} className={styles.jobItem}>
                <div className={styles.jobInfo}>
                  <p className={styles.jobTitle}>{job.title}</p>
                  <span className={styles.jobType}>{job.type}</span>
                </div>
                <button className={styles.viewJobBtn}>
                  Ver Vaga <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button className={styles.viewAllBtn}>Ver Todas as Oportunidades</button>
      </div>
    </ModalOverlay>
  )
}