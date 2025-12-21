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
          <h3 className={styles.sectionTitle}>Benefícios</h3>
          <div className={styles.benefits}>
            <span className={styles.benefitTag}>Vale Alimentação</span>
            <span className={styles.benefitTag}>Plano de Saúde</span>
            <span className={styles.benefitTag}>Vale Transporte</span>
            <span className={styles.benefitTag}>Auxílio Creche</span>
            <span className={styles.benefitTag}>Seguro de Vida</span>
            <span className={styles.benefitTag}>Home Office</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Requisitos</h3>
          <ul className={styles.requirementsList}>
            <li>
              <strong>Escolaridade:</strong> Ensino Superior Completo em Tecnologia da Informação ou áreas correlatas
            </li>
            <li>
              <strong>Fluência:</strong> Português nativo, Inglês intermediário (leitura técnica)
            </li>
            <li>
              <strong>Experiência anterior:</strong> Mínimo 2 anos com desenvolvimento web
            </li>
            <li>
              <strong>Conhecimentos:</strong> React, JavaScript ES6+, HTML5, CSS3, Git
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Endereço a ser realizado</h3>
          <p className={styles.text}>
            Av. Paulista, 1500 - Bela Vista, São Paulo - SP, 01310-100
            <br />
            Próximo à estação de metrô Consolação
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Horário de trabalho</h3>
          <p className={styles.text}>
            Segunda a Sexta-feira: 09h00 às 18h00
            <br />
            Intervalo de 1 hora para almoço
            <br />
            Modelo híbrido: 3x presencial, 2x home office
          </p>
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
