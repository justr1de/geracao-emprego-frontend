'use client';

import styles from './index.module.css';

export default function StatsBar() {
  const stats = [
    { value: '163.710', label: 'Currículos' },
    { value: '68.688', label: 'Vagas' },
    { value: '6.775', label: 'Empresas' },
    { value: '330', label: 'Cursos' },
  ];

  return (
    <section className={styles.statsBar} aria-label="Estatísticas da plataforma">
      <div className={styles.container}>
        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.stat}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
