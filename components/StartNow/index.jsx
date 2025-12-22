'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import styles from './index.module.css';

export default function StartNow() {
  const benefits = [
    'Cadastro 100% gratuito',
    'Milhares de vagas disponíveis',
    'Cursos de qualificação grátis',
    'Acesso pelo celular ou computador',
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Comece agora mesmo</h2>
          <p className={styles.description}>
            O Geração Emprego é a maior rede de empregos do Estado de Rondônia.
            Cadastre-se gratuitamente e encontre sua oportunidade.
          </p>

          <ul className={styles.benefits}>
            {benefits.map((benefit, index) => (
              <li key={index} className={styles.benefit}>
                <CheckCircle size={20} className={styles.checkIcon} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <Link href="/cadastro" className={styles.primaryBtn}>
              Criar minha conta grátis
            </Link>
            <Link href="/vagas" className={styles.secondaryBtn}>
              Ver vagas disponíveis
            </Link>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <div className={styles.imagePlaceholder}>
            <span className={styles.imageText}>📱</span>
            <p>Acesse pelo celular</p>
          </div>
        </div>
      </div>
    </section>
  );
}
