'use client';

import { BarChart3, TrendingUp, Users, Briefcase, Building2, Clock, Target, Award } from 'lucide-react';
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
            Acompanhe em tempo real a eficiência dos serviços prestados pela plataforma Geração Emprego
          </p>
        </div>
      </section>

      {/* Em Construção */}
      <section className={styles.construction}>
        <div className={styles.constructionCard}>
          <div className={styles.constructionIcon}>
            <Clock size={64} />
          </div>
          <h2 className={styles.constructionTitle}>Em Desenvolvimento</h2>
          <p className={styles.constructionText}>
            Estamos trabalhando para trazer dados e métricas detalhadas sobre o mercado de trabalho em Rondônia.
          </p>
          
          {/* Preview das métricas que serão exibidas */}
          <div className={styles.previewSection}>
            <h3 className={styles.previewTitle}>O que você poderá acompanhar:</h3>
            <div className={styles.previewGrid}>
              <div className={styles.previewItem}>
                <Users size={24} />
                <span>Candidatos cadastrados</span>
              </div>
              <div className={styles.previewItem}>
                <Building2 size={24} />
                <span>Empresas parceiras</span>
              </div>
              <div className={styles.previewItem}>
                <Briefcase size={24} />
                <span>Vagas publicadas</span>
              </div>
              <div className={styles.previewItem}>
                <Target size={24} />
                <span>Contratações realizadas</span>
              </div>
              <div className={styles.previewItem}>
                <TrendingUp size={24} />
                <span>Taxa de empregabilidade</span>
              </div>
              <div className={styles.previewItem}>
                <Award size={24} />
                <span>Cursos concluídos</span>
              </div>
            </div>
          </div>

          <p className={styles.comingSoon}>
            Em breve disponível para consulta pública
          </p>
        </div>
      </section>
    </div>
  );
}
