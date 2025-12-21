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

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Outras Informações</h3>
          <div className={styles.otherInfoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Idade:</span>
              <span className={styles.value}>{resume.age} anos</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Gênero:</span>
              <span className={styles.value}>Masculino</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Localização:</span>
              <span className={styles.value}>{resume.location}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Habilitação:</span>
              <span className={styles.value}>CNH Categoria B</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Veículo Próprio:</span>
              <span className={styles.value}>Sim</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Disponibilidade p/ Viagens:</span>
              <span className={styles.value}>Sim</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Disponibilidade p/ Dormir no Trabalho:</span>
              <span className={styles.value}>Não</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Deficiências (PcD):</span>
              <span className={styles.value}>Não possui</span>
            </div>
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
          <h3 className={styles.sectionTitle}>Experiências</h3>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h4 className={styles.timelineTitle}>Desenvolvedor Full Stack</h4>
                <p className={styles.timelineCompany}>Tech Company Inc.</p>
                <p className={styles.timelineDate}>Jan 2022 - Presente</p>
                <p className={styles.timelineDescription}>
                  Desenvolvimento de aplicações web utilizando React, Node.js e banco de dados SQL.
                </p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h4 className={styles.timelineTitle}>Desenvolvedor Frontend</h4>
                <p className={styles.timelineCompany}>Startup Digital</p>
                <p className={styles.timelineDate}>Mar 2020 - Dez 2021</p>
                <p className={styles.timelineDescription}>
                  Criação de interfaces responsivas e acessíveis com HTML, CSS e JavaScript.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Graduações</h3>
          <div className={styles.educationList}>
            <div className={styles.educationItem}>
              <h4 className={styles.educationTitle}>Bacharel em Ciência da Computação</h4>
              <p className={styles.educationInstitution}>Universidade Federal de São Paulo</p>
              <p className={styles.educationDate}>2016 - 2020</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Cursos e Capacitações</h3>
          <div className={styles.coursesList}>
            <div className={styles.courseItem}>
              <span className={styles.courseBadge}>React Avançado</span>
              <span className={styles.courseInstitution}>SENAI - 2023</span>
            </div>
            <div className={styles.courseItem}>
              <span className={styles.courseBadge}>Node.js e Express</span>
              <span className={styles.courseInstitution}>SENAC - 2022</span>
            </div>
            <div className={styles.courseItem}>
              <span className={styles.courseBadge}>SQL e Banco de Dados</span>
              <span className={styles.courseInstitution}>Online - 2021</span>
            </div>
          </div>
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
