'use client';

import { useState } from 'react';
import { Search, MapPin, Briefcase, Clock, DollarSign, Filter, ChevronDown } from 'lucide-react';
import JobCard from '@/components/JobCard';
import JobDetailModal from '@/components/JobDetailModal';
import styles from './page.module.css';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Vendedor(a) de Loja',
    company: 'Magazine Rondônia',
    location: 'Porto Velho, RO',
    type: 'CLT',
    salary: 'R$ 1.800 - R$ 2.500',
    description: 'Atendimento ao cliente, organização de produtos, operação de caixa e manutenção da loja. Buscamos pessoas comunicativas e com vontade de crescer.',
    requirements: ['Ensino médio completo', 'Experiência com vendas', 'Boa comunicação'],
    benefits: ['Vale transporte', 'Vale alimentação', 'Comissão sobre vendas', 'Plano de saúde'],
    postedAt: 'Há 2 dias',
  },
  {
    id: 2,
    title: 'Motorista de Caminhão',
    company: 'Transportadora Norte',
    location: 'Ji-Paraná, RO',
    type: 'CLT',
    salary: 'R$ 3.000 - R$ 4.500',
    description: 'Transporte de cargas entre municípios do estado. Rotas regionais com pernoite em alguns casos.',
    requirements: ['CNH categoria D ou E', 'Experiência comprovada', 'Curso MOPP'],
    benefits: ['Vale alimentação', 'Diárias', 'Seguro de vida'],
    postedAt: 'Há 3 dias',
  },
  {
    id: 3,
    title: 'Auxiliar Administrativo',
    company: 'Clínica Saúde Total',
    location: 'Ariquemes, RO',
    type: 'CLT',
    salary: 'R$ 1.600 - R$ 2.000',
    description: 'Apoio nas rotinas administrativas, atendimento telefônico, agendamento de consultas e organização de documentos.',
    requirements: ['Ensino médio completo', 'Conhecimento em informática', 'Organização'],
    benefits: ['Vale transporte', 'Vale alimentação', 'Plano de saúde'],
    postedAt: 'Há 1 dia',
  },
  {
    id: 4,
    title: 'Técnico em Enfermagem',
    company: 'Hospital Regional de Cacoal',
    location: 'Cacoal, RO',
    type: 'CLT',
    salary: 'R$ 2.200 - R$ 3.000',
    description: 'Assistência de enfermagem aos pacientes, administração de medicamentos e acompanhamento de procedimentos.',
    requirements: ['Curso técnico em enfermagem', 'COREN ativo', 'Disponibilidade de horário'],
    benefits: ['Vale transporte', 'Vale alimentação', 'Adicional noturno', 'Plano de saúde'],
    postedAt: 'Há 5 dias',
  },
  {
    id: 5,
    title: 'Garçom/Garçonete',
    company: 'Restaurante Sabor da Terra',
    location: 'Vilhena, RO',
    type: 'CLT',
    salary: 'R$ 1.500 - R$ 2.000',
    description: 'Atendimento aos clientes, anotação de pedidos e organização do salão. Ambiente familiar e agradável.',
    requirements: ['Ensino fundamental completo', 'Experiência na área', 'Simpatia e proatividade'],
    benefits: ['Vale transporte', 'Alimentação no local', 'Gorjetas'],
    postedAt: 'Há 1 semana',
  },
  {
    id: 6,
    title: 'Eletricista Industrial',
    company: 'Indústria Madeireira Amazônia',
    location: 'Rolim de Moura, RO',
    type: 'CLT',
    salary: 'R$ 3.500 - R$ 5.000',
    description: 'Manutenção elétrica preventiva e corretiva em máquinas e equipamentos industriais.',
    requirements: ['Curso técnico em eletrotécnica', 'NR-10 atualizada', 'Experiência industrial'],
    benefits: ['Vale transporte', 'Vale alimentação', 'Plano de saúde', 'PLR'],
    postedAt: 'Há 4 dias',
  },
  {
    id: 7,
    title: 'Recepcionista',
    company: 'Hotel Guaporé',
    location: 'Guajará-Mirim, RO',
    type: 'CLT',
    salary: 'R$ 1.600 - R$ 1.900',
    description: 'Atendimento aos hóspedes, check-in e check-out, reservas e atendimento telefônico.',
    requirements: ['Ensino médio completo', 'Inglês básico', 'Informática básica'],
    benefits: ['Vale transporte', 'Alimentação no local', 'Uniforme'],
    postedAt: 'Há 2 dias',
  },
  {
    id: 8,
    title: 'Operador de Caixa',
    company: 'Supermercado Bom Preço',
    location: 'Porto Velho, RO',
    type: 'CLT',
    salary: 'R$ 1.500 - R$ 1.800',
    description: 'Operação de caixa, atendimento ao cliente e organização do setor.',
    requirements: ['Ensino médio completo', 'Experiência com caixa', 'Disponibilidade de horário'],
    benefits: ['Vale transporte', 'Vale alimentação', 'Cesta básica'],
    postedAt: 'Hoje',
  },
];

const cities = [
  'Todas as cidades',
  'Porto Velho',
  'Ji-Paraná',
  'Ariquemes',
  'Cacoal',
  'Vilhena',
  'Rolim de Moura',
  'Guajará-Mirim',
  'Jaru',
  'Ouro Preto do Oeste',
];

const jobTypes = ['Todos os tipos', 'CLT', 'PJ', 'Temporário', 'Estágio', 'Jovem Aprendiz'];

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Todas as cidades');
  const [selectedType, setSelectedType] = useState('Todos os tipos');
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'Todas as cidades' || job.location.includes(selectedCity);
    const matchesType = selectedType === 'Todos os tipos' || job.type === selectedType;
    return matchesSearch && matchesCity && matchesType;
  });

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            <Briefcase className={styles.heroIcon} />
            Vagas de Emprego
          </h1>
          <p className={styles.heroSubtitle}>
            Encontre oportunidades em todo o estado de Rondônia
          </p>

          {/* Barra de Busca */}
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Buscar por cargo ou empresa..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar vagas"
              />
            </div>
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-label="Mostrar filtros"
            >
              <Filter size={20} />
              Filtros
              <ChevronDown size={16} className={showFilters ? styles.rotated : ''} />
            </button>
          </div>

          {/* Filtros Expandidos */}
          {showFilters && (
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <MapPin size={16} />
                  Cidade
                </label>
                <select
                  className={styles.filterSelect}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  aria-label="Filtrar por cidade"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <Briefcase size={16} />
                  Tipo de Contrato
                </label>
                <select
                  className={styles.filterSelect}
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  aria-label="Filtrar por tipo de contrato"
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Estatísticas */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <Briefcase className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>{mockJobs.length}</span>
              <span className={styles.statLabel}>Vagas Ativas</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <MapPin className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>10</span>
              <span className={styles.statLabel}>Cidades</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Clock className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>24h</span>
              <span className={styles.statLabel}>Novas Vagas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Vagas */}
      <section className={styles.jobsSection}>
        <div className={styles.jobsContainer}>
          <div className={styles.jobsHeader}>
            <h2 className={styles.jobsTitle}>
              {filteredJobs.length} {filteredJobs.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
            </h2>
            {(selectedCity !== 'Todas as cidades' || selectedType !== 'Todos os tipos' || searchTerm) && (
              <button
                className={styles.clearFilters}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('Todas as cidades');
                  setSelectedType('Todos os tipos');
                }}
              >
                Limpar filtros
              </button>
            )}
          </div>

          {filteredJobs.length > 0 ? (
            <div className={styles.jobsGrid}>
              {filteredJobs.map((job) => (
                <article key={job.id} className={styles.jobCard} onClick={() => setSelectedJob(job)}>
                  <div className={styles.jobHeader}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <span className={styles.jobType}>{job.type}</span>
                  </div>
                  <p className={styles.jobCompany}>{job.company}</p>
                  <div className={styles.jobMeta}>
                    <span className={styles.jobLocation}>
                      <MapPin size={14} />
                      {job.location}
                    </span>
                    <span className={styles.jobSalary}>
                      <DollarSign size={14} />
                      {job.salary}
                    </span>
                  </div>
                  <p className={styles.jobDescription}>{job.description}</p>
                  <div className={styles.jobFooter}>
                    <span className={styles.jobPosted}>
                      <Clock size={14} />
                      {job.postedAt}
                    </span>
                    <button className={styles.jobButton}>Ver detalhes</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <Search size={48} />
              <h3>Nenhuma vaga encontrada</h3>
              <p>Tente ajustar os filtros ou buscar por outros termos</p>
            </div>
          )}
        </div>
      </section>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
