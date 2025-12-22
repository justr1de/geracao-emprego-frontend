// @ts-nocheck
'use client';

import { X, Building2, MapPin, Share2, Briefcase, DollarSign, Calendar, CheckCircle2, Clock } from 'lucide-react';
import styles from './index.module.css';

export default function JobDetailModal({ job, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Fechar">
          <X size={24} />
        </button>

        <div className={styles.header}>
          <div className={styles.companyLogo}>
            <Building2 size={32} color="#1e40af" />
          </div>
          <div className={styles.headerText}>
            <h2 className={styles.title}>{job.title}</h2>
            <p className={styles.company}>Empresa Exemplo Ltda</p>
          </div>
          <button className={styles.share}>
            <Share2 size={16} /> Compartilhar
          </button>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}><Briefcase size={12} /> Cargo</span>
            <span className={styles.infoValue}>{job.title}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}><Clock size={12} /> Tipo</span>
            <span className={styles.infoValue}>{job.type}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}><DollarSign size={12} /> Salário</span>
            <span className={styles.infoValue}>{job.salary}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}><Calendar size={12} /> Publicado</span>
            <span className={styles.infoValue}>{job.date}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Benefícios</h3>
          <div className={styles.benefits}>
            {['Vale Alimentação', 'Plano de Saúde', 'Vale Transporte', 'Home Office'].map((benefit, i) => (
              <span key={i} className={styles.benefitTag}>{benefit}</span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Requisitos</h3>
          <ul className={styles.requirementsList}>
            <li>
              <CheckCircle2 size={16} className={styles.checkIcon} />
              <span><strong>Escolaridade:</strong> Ensino Superior Completo</span>
            </li>
            <li>
              <CheckCircle2 size={16} className={styles.checkIcon} />
              <span><strong>Experiência:</strong> Mínimo 2 anos com desenvolvimento</span>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Localização e Horário</h3>
          <div className={styles.locationBox}>
            <p className={styles.text}>
              <MapPin size={16} /> Av. Paulista, 1500 - São Paulo, SP
            </p>
            <p className={styles.text}>
              <Clock size={16} /> Segunda a Sexta: 09h às 18h (Híbrido)
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Descrição da Vaga</h3>
          <p className={styles.text}>{job.description}</p>
        </div>

        <button className={styles.applyButton}>Enviar meu Currículo</button>
      </div>
    </div>
  );
}
