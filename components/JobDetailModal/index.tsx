'use client';

import { useId } from 'react';
import ModalOverlay from '@/components/ModalOverlay';
import { Briefcase, MapPin, Clock, DollarSign, CheckCircle2, Gift, Building2 } from 'lucide-react';
import styles from './index.module.css';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
}

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
}

export default function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  // Gera IDs únicos para associar elementos via ARIA
  const titleId = useId();
  const descriptionId = useId();

  return (
    <ModalOverlay 
      onClose={onClose} 
      titleId={titleId}
      descriptionId={descriptionId}
    >
      <article className={styles.content}>
        {/* Header com informações principais */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <Building2 size={14} aria-hidden="true" /> 
            <span>{job.company}</span>
          </div>
          
          {/* Título principal - referenciado pelo aria-labelledby do modal */}
          <h2 id={titleId} className={styles.title}>
            {job.title}
          </h2>
          
          <span className={styles.type} role="status">
            {job.type}
          </span>
        </header>

        {/* Descrição breve - referenciada pelo aria-describedby do modal */}
        <p id={descriptionId} className="sr-only">
          Vaga de {job.title} na empresa {job.company}, localizada em {job.location}. 
          Faixa salarial: {job.salary}.
        </p>

        {/* Cards de informação */}
        <div className={styles.infoRow} role="group" aria-label="Informações da vaga">
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>
              <MapPin size={14} aria-hidden="true" /> 
              <span>Localização</span>
            </span>
            <span className={styles.infoValue}>{job.location}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>
              <DollarSign size={14} aria-hidden="true" /> 
              <span>Salário</span>
            </span>
            <span className={styles.infoValue}>{job.salary}</span>
          </div>
        </div>

        {/* Seção: Sobre a vaga */}
        <section className={styles.section} aria-labelledby="section-about">
          <h3 id="section-about" className={styles.sectionTitle}>
            <Briefcase size={16} aria-hidden="true" /> 
            <span>Sobre a vaga</span>
          </h3>
          <p className={styles.description}>{job.description}</p>
        </section>

        {/* Seção: Requisitos */}
        {job.requirements && job.requirements.length > 0 && (
          <section className={styles.section} aria-labelledby="section-requirements">
            <h3 id="section-requirements" className={styles.sectionTitle}>
              <CheckCircle2 size={16} aria-hidden="true" /> 
              <span>Requisitos</span>
            </h3>
            <ul className={styles.list} aria-label="Lista de requisitos">
              {job.requirements.map((req, i) => (
                <li key={i}>
                  <CheckCircle2 size={14} className={styles.listIcon} aria-hidden="true" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Seção: Benefícios */}
        {job.benefits && job.benefits.length > 0 && (
          <section className={styles.section} aria-labelledby="section-benefits">
            <h3 id="section-benefits" className={styles.sectionTitle}>
              <Gift size={16} aria-hidden="true" /> 
              <span>Benefícios</span>
            </h3>
            <ul className={styles.list} aria-label="Lista de benefícios">
              {job.benefits.map((benefit, i) => (
                <li key={i}>
                  <Gift size={14} className={styles.listIcon} aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Rodapé com data de publicação */}
        <footer className={styles.footer}>
          <span className={styles.postedAt}>
            <Clock size={14} aria-hidden="true" /> 
            <span>Publicada {job.postedAt}</span>
          </span>
        </footer>

        {/* Botão de ação principal */}
        <button 
          className={styles.applyBtn}
          type="button"
          aria-label={`Candidatar-se para a vaga de ${job.title} na empresa ${job.company}`}
        >
          Candidatar-se
        </button>
      </article>
    </ModalOverlay>
  );
}
