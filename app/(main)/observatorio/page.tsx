'use client';

import { BarChart3, Construction, Wrench } from 'lucide-react';
import Image from 'next/image';
import styles from './page.module.css';

export default function ObservatorioPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroIcon}>
            <BarChart3 size={48} />
          </div>
          <h1 className={styles.heroTitle}>Observatório do Emprego</h1>
          <p className={styles.heroSubtitle}>
            Painel de indicadores do mercado de trabalho em Rondônia
          </p>
        </div>
      </section>

      {/* Em Construção */}
      <section className={styles.construction}>
        <div className={styles.constructionCard}>
          <div className={styles.constructionImageWrapper}>
            <div className={styles.constructionIcon}>
              <Construction size={80} />
            </div>
            <div className={styles.gearIcon}>
              <Wrench size={32} />
            </div>
          </div>
          
          <h2 className={styles.constructionTitle}>Em Construção</h2>
          
          <p className={styles.constructionText}>
            Estamos desenvolvendo o painel de indicadores com dados em tempo real sobre o mercado de trabalho em Rondônia.
          </p>

          <div className={styles.comingSoonBadge}>
            <span>Em breve</span>
          </div>

          <p className={styles.featureText}>
            O Observatório apresentará métricas de currículos cadastrados, vagas disponíveis, contratações efetivadas e outros indicadores de empregabilidade.
          </p>
        </div>
      </section>
    </div>
  );
}
