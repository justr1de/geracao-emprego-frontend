'use client';

import { useState } from 'react';
import BackButton from '@/components/BackButton';
import JobFilterSidebar from '@/components/JobFilterSidebar';
import JobCard from '@/components/JobCard';
import JobDetailModal from '@/components/JobDetailModal';
import JobStats from '@/components/JobStats';
import styles from './page.module.css';

// 1. Defina a interface para a vaga (Job)
interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Auxiliar de Supermercado',
    company: 'Supermercado Exemplo',
    location: 'São Paulo, SP',
    type: 'CLT',
    salary: 'R$ 1.500 - R$ 2.000',
    description: 'Vaga para auxiliar de supermercado...',
    requirements: ['Ensino médio completo', 'Disponibilidade de horário'],
    benefits: ['Vale transporte', 'Vale alimentação'],
  },
];

export default function JobsPage() {
  // 2. Informe ao useState que ele pode ser um 'Job' ou 'null'
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className={styles.pageContainer}>
      <BackButton />
      <JobStats />

      <div className={styles.content}>
        <JobFilterSidebar />

        <div className={styles.jobsList}>
          <div className={styles.header}>
            <h1 className={styles.title}>Vagas Disponíveis</h1>
            <p className={styles.subtitle}>{mockJobs.length} vagas encontradas</p>
          </div>

          <div className={styles.jobsGrid}>
            {mockJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => setSelectedJob(job)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
