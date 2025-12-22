'use client';

import ModalOverlay from '@/components/ModalOverlay';
import { MapPin, Briefcase, Phone } from 'lucide-react';
import styles from './index.module.css';

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
}

interface ResumeDetailModalProps {
  resume: Resume
  onClose: () => void
}

export default function ResumeDetailModal({ resume, onClose }: ResumeDetailModalProps) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className={styles.content}>
        {/* Header com Avatar Neo-brutalista */}
        <div className={styles.header}>
          <div className={styles.avatar}>{resume.name.charAt(0)}</div>
          <div className={styles.headerInfo}>
            <h2 className={styles.name}>{resume.name}</h2>
            <p className={styles.profession}>
              <Briefcase size={16} /> {resume.profession}
            </p>
          </div>
        </div>

        {/* Informações Rápidas Grid */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Informações Gerais</h3>
          <div className={styles.otherInfoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Idade</span>
              <span className={styles.value}>{resume.age} anos</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Localização</span>
              <span className={styles.value}><MapPin size={14} /> {resume.location}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Habilitação</span>
              <span className={styles.value}>Categoria B</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>PcD</span>
              <span className={styles.value}>Não possui</span>
            </div>
          </div>
        </div>

        {/* Sobre */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Resumo Profissional</h3>
          <p className={styles.about}>
            {resume.about || 'Profissional dedicado com experiência comprovada na área.'}
          </p>
        </div>

        {/* Habilidades - Tags Brutalistas */}
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

        {/* Botão de Contato com animação suave */}
        <button className={styles.contactBtn} onClick={() => alert('Abrir contato...')}>
          <Phone size={20} /> Ver Informações de Contato
        </button>
      </div>
    </ModalOverlay>
  );
}
