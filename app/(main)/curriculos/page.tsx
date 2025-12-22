'use client';

import { useState } from 'react';
import BackButton from '@/components/BackButton';
import ResumeDetailModal from '@/components/ResumeDetailModal';
import styles from './page.module.css';

const mockResumes = [
  {
    id: 1,
    name: 'João Silva',
    age: 28,
    profession: 'Desenvolvedor Full Stack',
    location: 'São Paulo, SP',
    experience: '5 anos',
    education: 'Superior Completo',
    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 2,
    name: 'Maria Santos',
    age: 32,
    profession: 'Designer UX/UI',
    location: 'Rio de Janeiro, RJ',
    experience: '7 anos',
    education: 'Superior Completo',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
  },
];

export default function ResumesPage() {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    experience: '',
  });
  const [selectedResume, setSelectedResume] = useState<(typeof mockResumes)[0] | null>(null);

  return (
    <div className={styles.pageContainer}>
      <BackButton />

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Buscar Currículos</h1>
          <p className={styles.subtitle}>Encontre os melhores talentos para sua empresa</p>
          <p className={styles.lgpdNotice}>
            Todos os dados dos candidatos são tratados conforme a Lei Geral de Proteção de Dados (LGPD).
          </p>
        </div>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar por profissão ou habilidade"
            className={styles.searchInput}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className={styles.select}
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="">Todas as localizações</option>
            <option value="sp">São Paulo</option>
            <option value="rj">Rio de Janeiro</option>
            <option value="mg">Minas Gerais</option>
          </select>
          <select
            className={styles.select}
            value={filters.experience}
            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
          >
            <option value="">Qualquer experiência</option>
            <option value="0-2">0-2 anos</option>
            <option value="3-5">3-5 anos</option>
            <option value="5+">5+ anos</option>
          </select>
        </div>

        <div className={styles.grid}>
          {mockResumes.map((resume) => (
            <div key={resume.id} className={styles.card} onClick={() => setSelectedResume(resume)}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>{resume.name.charAt(0)}</div>
                <div>
                  <h3 className={styles.cardName}>{resume.name}</h3>
                  <p className={styles.cardProfession}>{resume.profession}</p>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardInfo}>
                  <span className={styles.label}>Localização:</span>
                  <span>{resume.location}</span>
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.label}>Experiência:</span>
                  <span>{resume.experience}</span>
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.label}>Formação:</span>
                  <span>{resume.education}</span>
                </div>
                <div className={styles.skills}>
                  {resume.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button className={styles.contactBtn}>Ver Contato</button>
            </div>
          ))}
        </div>
      </div>

      {selectedResume && <ResumeDetailModal resume={selectedResume} onClose={() => setSelectedResume(null)} />}
    </div>
  );
}
