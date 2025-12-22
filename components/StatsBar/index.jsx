'use client';

import { FileText, Briefcase, Building2, GraduationCap } from 'lucide-react';
import styles from './index.module.css';

export default function StatsBar() {
  const stats = [
    { 
      value: '163.710', 
      label: 'Currículos', 
      description: 'Profissionais cadastrados',
      icon: FileText,
      color: '#3b82f6'
    },
    { 
      value: '68.688', 
      label: 'Vagas', 
      description: 'Oportunidades disponíveis',
      icon: Briefcase,
      color: '#10b981'
    },
    { 
      value: '6.775', 
      label: 'Empresas', 
      description: 'Parceiras da plataforma',
      icon: Building2,
      color: '#8b5cf6'
    },
    { 
      value: '330', 
      label: 'Cursos', 
      description: 'Gratuitos para você',
      icon: GraduationCap,
      color: '#f59e0b'
    },
  ];

  return (
    <section className={styles.statsBar} aria-label="Estatísticas da plataforma">
      <div className={styles.container}>
        <div className={styles.stats}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className={styles.statCard}>
                <div className={styles.iconWrapper} style={{ backgroundColor: `${stat.color}15` }}>
                  <IconComponent size={28} style={{ color: stat.color }} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.value}>{stat.value}</span>
                  <span className={styles.label}>{stat.label}</span>
                  <span className={styles.description}>{stat.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
