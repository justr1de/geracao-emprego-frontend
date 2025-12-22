'use client';

import { Clock, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './index.module.css';

export default function Courses() {
  const courses = [
    {
      id: 1,
      title: 'Inteligência Emocional',
      category: 'Desenvolvimento Pessoal',
      duration: '2 horas',
      enrolled: 1250,
    },
    {
      id: 2,
      title: 'Marketing Digital na Prática',
      category: 'Marketing',
      duration: '3 horas',
      enrolled: 890,
    },
    {
      id: 3,
      title: 'Técnico de Cozinha',
      category: 'Gastronomia',
      duration: '10 horas',
      enrolled: 625,
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Cursos gratuitos</h2>
          <p className={styles.subtitle}>
            Qualifique-se gratuitamente e aumente suas chances de conseguir um emprego
          </p>
        </div>

        <div className={styles.grid}>
          {courses.map((course) => (
            <article key={course.id} className={styles.card}>
              <span className={styles.category}>{course.category}</span>
              <h3 className={styles.cardTitle}>{course.title}</h3>
              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <Clock size={16} />
                  {course.duration}
                </span>
                <span className={styles.metaItem}>
                  <Users size={16} />
                  {course.enrolled.toLocaleString('pt-BR')} inscritos
                </span>
              </div>
              <Link href={`/cursos/${course.id}`} className={styles.cardLink}>
                Ver curso
                <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.footer}>
          <Link href="/cursos" className={styles.viewAllBtn}>
            Ver todos os cursos
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
