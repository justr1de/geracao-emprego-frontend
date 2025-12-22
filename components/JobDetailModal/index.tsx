'use client';

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
  return (
    <ModalOverlay onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Building2 size={14} /> {job.company}
          </div>
          <h2 className={styles.title}>{job.title}</h2>
          <span className={styles.type}>{job.type}</span>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>
              <MapPin size={14} /> Localização
            </span>
            <span className={styles.infoValue}>{job.location}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>
              <DollarSign size={14} /> Salário
            </span>
            <span className={styles.infoValue}>{job.salary}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Briefcase size={16} /> Sobre a vaga
          </h3>
          <p className={styles.description}>{job.description}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <CheckCircle2 size={16} /> Requisitos
            </h3>
            <ul className={styles.list}>
              {job.requirements.map((req, i) => (
                <li key={i}>
                  <CheckCircle2 size={14} className={styles.listIcon} />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.benefits && job.benefits.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Gift size={16} /> Benefícios
            </h3>
            <ul className={styles.list}>
              {job.benefits.map((benefit, i) => (
                <li key={i}>
                  <Gift size={14} className={styles.listIcon} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.postedAt}>
            <Clock size={14} /> Publicada {job.postedAt}
          </span>
        </div>

        <button className={styles.applyBtn}>Candidatar-se</button>
      </div>
    </ModalOverlay>
  );
}
