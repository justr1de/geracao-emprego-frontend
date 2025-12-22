'use client';

import { useState } from 'react';
import Image from 'next/image';
import BackButton from '@/components/BackButton';
import CompanyDetailModal from '@/components/CompanyDetailModal';
import styles from './page.module.css';

const mockCompanies = [
  {
    id: 1,
    name: 'Supermercado Exemplo',
    description: 'Rede de supermercados com mais de 20 anos de experiência no mercado brasileiro.',
    category: 'Varejo',
    vacancies: 280,
    logo: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 2,
    name: 'Tech Solutions LTDA',
    description: 'Empresa de tecnologia focada em soluções inovadoras para transformação digital.',
    category: 'Tecnologia',
    vacancies: 45,
    logo: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 3,
    name: 'Clínica Saúde & Vida',
    description: 'Clínica médica com atendimento completo e equipe multidisciplinar.',
    category: 'Saúde',
    vacancies: 32,
    logo: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 4,
    name: 'Construtora Alicerce',
    description: 'Construtora especializada em obras residenciais e comerciais de alto padrão.',
    category: 'Construção',
    vacancies: 120,
    logo: '/placeholder.svg?height=80&width=80',
  },
];

export default function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState<(typeof mockCompanies)[0] | null>(null);

  return (
    <div className={styles.pageContainer}>
      <BackButton />

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Empresas Parceiras</h1>
          <p className={styles.subtitle}>Conheça as empresas que estão contratando</p>
        </div>

        <div className={styles.searchRow}>
          <input
            type="text"
            placeholder="Buscar pelo nome da empresa"
            className={styles.searchInput}
            aria-label="Buscar empresa pelo nome"
          />
          <select className={styles.sortSelect} aria-label="Ordenar empresas">
            <option>Ordenar por: Qtd. de vagas</option>
            <option>Ordenar por: Nome A-Z</option>
            <option>Ordenar por: Categoria</option>
          </select>
        </div>

        <div className={styles.grid}>
          {mockCompanies.map((company) => (
            <div key={company.id} className={styles.card}>
              <div className={styles.cardTop}>
                <Image
                  src={company.logo || '/placeholder.svg'}
                  alt={`Logo da empresa ${company.name}`}
                  width={80}
                  height={80}
                  className={styles.logo}
                />
                <span className={styles.categoryBadge}>{company.category}</span>
              </div>

              <h3 className={styles.companyName}>{company.name}</h3>
              <p className={styles.description}>{company.description}</p>

              <div className={styles.vacanciesInfo}>
                <span className={styles.vacanciesCount}>{company.vacancies}</span>
                <span className={styles.vacanciesLabel}>vagas disponíveis</span>
              </div>

              <button className={styles.viewBtn} onClick={() => setSelectedCompany(company)}>
                Ver Detalhes
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedCompany && <CompanyDetailModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />}
    </div>
  );
}
