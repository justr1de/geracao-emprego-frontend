'use client';

import { Briefcase, Megaphone, User, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import styles from './index.module.css';

export default function Hero() {
  const cards = [
    { icon: Briefcase, title: 'Quero contratar', color: '#1e40af', href: '/curriculos' },
    { icon: Megaphone, title: 'Quero divulgar vaga', color: '#16a34a', href: '/vagas' },
    { icon: User, title: 'Quero trabalhar', color: '#f59e0b', href: '/vagas' },
    { icon: GraduationCap, title: 'Aprendiz', color: '#8b5cf6', href: '/cursos' },
  ];

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>Geração Emprego</h1>
        <p className={styles.subtitle}>O que você busca hoje?</p>

        <div className={styles.cards}>
          {cards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className={styles.card}
              style={{ '--card-color': card.color }} // Removido o "as ..."
            >
              <card.icon className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>{card.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
