'use client';

import { Briefcase, Search } from 'lucide-react';
import Link from 'next/link';
import styles from './index.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Título principal */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Encontre seu <span className={styles.highlight}>emprego</span> em Rondônia
          </h1>
          <p className={styles.subtitle}>
            Conectamos trabalhadores e empresas de todo o estado.
            Cadastro gratuito e fácil.
          </p>
        </div>

        {/* Cards de ação principal - Apenas 2 opções claras */}
        <div className={styles.cards}>
          <Link href="/vagas" className={styles.card}>
            <div className={styles.cardIcon}>
              <Search size={32} strokeWidth={1.5} />
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Busco Emprego</h2>
              <p className={styles.cardDescription}>
                Encontre vagas e cadastre seu currículo gratuitamente
              </p>
            </div>
            <span className={styles.cardArrow}>→</span>
          </Link>

          <Link href="/curriculos" className={`${styles.card} ${styles.cardSecondary}`}>
            <div className={styles.cardIcon}>
              <Briefcase size={32} strokeWidth={1.5} />
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Busco Funcionário</h2>
              <p className={styles.cardDescription}>
                Divulgue vagas e encontre profissionais qualificados
              </p>
            </div>
            <span className={styles.cardArrow}>→</span>
          </Link>
        </div>

        {/* Links secundários */}
        <div className={styles.secondaryLinks}>
          <Link href="/cursos" className={styles.secondaryLink}>
            📚 Cursos Gratuitos
          </Link>
          <Link href="/empresas" className={styles.secondaryLink}>
            🏢 Ver Empresas
          </Link>
          <Link href="/editais" className={styles.secondaryLink}>
            📋 Editais
          </Link>
        </div>
      </div>
    </section>
  );
}
