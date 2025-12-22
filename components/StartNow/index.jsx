'use client';

import {
  Search, FileText, Heart, Globe,
  CheckCircle2, Star, Users, ShieldCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './index.module.css';

export default function StartNow() {
  const router = useRouter();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Comece Agora</h2>

        <div className={styles.cards}>
          {/* Card Empresa */}
          <div className={styles.card}>
            <div className={styles.cardHeader} style={{ background: '#1e40af' }}>
              <Search className={styles.headerIcon} />
              <h3 className={styles.cardTitle}>Busque por profissionais</h3>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardText}>
                Encontre os melhores talentos para sua empresa. Acesse milhares de currículos qualificados.
              </p>

              <div className={styles.filterInfo}>
                <Star className={styles.filterIcon} size={18} fill="#f59e0b" />
                <span className={styles.filterText}>Filtros de Diversidade</span>
              </div>

              <ul className={styles.filterList}>
                <li><Users size={14} className={styles.listIcon} /> LGBTQIA+</li>
                <li><Globe size={14} className={styles.listIcon} /> Indígena</li>
                <li><ShieldCheck size={14} className={styles.listIcon} /> PCD</li>
                <li><CheckCircle2 size={14} className={styles.listIcon} /> Inclusão</li>
              </ul>

              <button
                className={styles.cardButton}
                onClick={() => router.push('/curriculos')}
              >
                Buscar Currículos
              </button>
            </div>
          </div>

          {/* Card Candidato */}
          <div className={styles.card}>
            <div className={styles.cardHeader} style={{ background: '#16a34a' }}>
              <FileText className={styles.headerIcon} />
              <h3 className={styles.cardTitle}>Nova colocação?</h3>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardText}>
                Cadastre seu currículo e encontre oportunidades incríveis em empresas de todo o Brasil.
              </p>

              <div className={styles.filterInfo}>
                <Heart className={styles.filterIcon} size={18} fill="#f59e0b" />
                <span className={styles.filterText}>Oportunidades Inclusivas</span>
              </div>

              <ul className={styles.filterList}>
                <li><CheckCircle2 size={14} className={styles.listIcon} style={{ color: '#16a34a' }} /> Afirmativas</li>
                <li><CheckCircle2 size={14} className={styles.listIcon} style={{ color: '#16a34a' }} /> Inclusivas</li>
                <li><CheckCircle2 size={14} className={styles.listIcon} style={{ color: '#16a34a' }} /> Diversidade</li>
                <li><CheckCircle2 size={14} className={styles.listIcon} style={{ color: '#16a34a' }} /> Respeito</li>
              </ul>

              <button
                className={styles.cardButton}
                onClick={() => router.push('/cadastro')}
              >
                Cadastrar Currículo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
