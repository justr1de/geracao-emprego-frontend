'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Clock, DollarSign, Filter, ChevronDown, Loader2 } from 'lucide-react';
import JobDetailModal from '@/components/JobDetailModal';
import styles from './page.module.css';

interface Vaga {
  id: string;
  titulo: string;
  descricao: string | null;
  requisitos: string | null;
  beneficios: string | null;
  salario_min: number | null;
  salario_max: number | null;
  cidade: string | null;
  estado: string | null;
  quantidade_vagas: number;
  created_at: string;
  empresas: {
    id: string;
    nome_fantasia: string | null;
    razao_social: string;
    logo_url: string | null;
    cidade: string | null;
    estado: string | null;
  } | null;
  tipos_contrato: {
    id: number;
    nome: string;
  } | null;
  areas_vaga: {
    id: number;
    nome: string;
  } | null;
}

interface Job {
  id: string;
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

// Lista completa dos 52 municípios de Rondônia em ordem alfabética
const cities = [
  'Todas as cidades',
  'Alta Floresta D\'Oeste',
  'Alto Alegre dos Parecis',
  'Alto Paraíso',
  'Alvorada D\'Oeste',
  'Ariquemes',
  'Buritis',
  'Cabixi',
  'Cacaulândia',
  'Cacoal',
  'Campo Novo de Rondônia',
  'Candeias do Jamari',
  'Castanheiras',
  'Cerejeiras',
  'Chupinguaia',
  'Colorado do Oeste',
  'Corumbiara',
  'Costa Marques',
  'Cujubim',
  'Espigão D\'Oeste',
  'Governador Jorge Teixeira',
  'Guajará-Mirim',
  'Itapuã do Oeste',
  'Jaru',
  'Ji-Paraná',
  'Machadinho D\'Oeste',
  'Ministro Andreazza',
  'Mirante da Serra',
  'Monte Negro',
  'Nova Brasilândia D\'Oeste',
  'Nova Mamoré',
  'Nova União',
  'Novo Horizonte do Oeste',
  'Ouro Preto do Oeste',
  'Parecis',
  'Pimenta Bueno',
  'Pimenteiras do Oeste',
  'Porto Velho',
  'Presidente Médici',
  'Primavera de Rondônia',
  'Rio Crespo',
  'Rolim de Moura',
  'Santa Luzia D\'Oeste',
  'São Felipe D\'Oeste',
  'São Francisco do Guaporé',
  'São Miguel do Guaporé',
  'Seringueiras',
  'Teixeirópolis',
  'Theobroma',
  'Urupá',
  'Vale do Anari',
  'Vale do Paraíso',
  'Vilhena',
];

const jobTypes = ['Todos os tipos', 'CLT', 'PJ', 'Temporário', 'Estágio', 'Jovem Aprendiz'];

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return 'A combinar';
  if (min && max) {
    return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
  }
  if (min) return `A partir de R$ ${min.toLocaleString('pt-BR')}`;
  if (max) return `Até R$ ${max.toLocaleString('pt-BR')}`;
  return 'A combinar';
}

function formatPostedAt(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Há 1 dia';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 14) return 'Há 1 semana';
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
  return `Há ${Math.floor(diffDays / 30)} meses`;
}

function transformVagaToJob(vaga: Vaga): Job {
  return {
    id: vaga.id,
    title: vaga.titulo,
    company: vaga.empresas?.nome_fantasia || vaga.empresas?.razao_social || 'Empresa não informada',
    location: vaga.cidade && vaga.estado ? `${vaga.cidade}, ${vaga.estado}` : 'Local não informado',
    type: vaga.tipos_contrato?.nome || 'CLT',
    salary: formatSalary(vaga.salario_min, vaga.salario_max),
    description: vaga.descricao || 'Descrição não disponível',
    requirements: vaga.requisitos ? vaga.requisitos.split('\n').filter(r => r.trim()) : [],
    benefits: vaga.beneficios ? vaga.beneficios.split(',').map(b => b.trim()).filter(b => b) : [],
    postedAt: formatPostedAt(vaga.created_at),
  };
}

export default function JobsPage() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVagas, setTotalVagas] = useState(0);
  const [totalCidades, setTotalCidades] = useState(0);
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Todas as cidades');
  const [selectedType, setSelectedType] = useState('Todos os tipos');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Buscar vagas da API
  const fetchVagas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');
      
      if (searchTerm) {
        params.set('search', searchTerm);
      }
      if (selectedCity !== 'Todas as cidades') {
        params.set('cidade', selectedCity);
      }
      // Mapear tipo de contrato para ID (simplificado)
      if (selectedType !== 'Todos os tipos') {
        const tipoMap: Record<string, string> = {
          'CLT': '1',
          'PJ': '2',
          'Temporário': '3',
          'Estágio': '4',
          'Jovem Aprendiz': '5'
        };
        if (tipoMap[selectedType]) {
          params.set('tipo_contrato_id', tipoMap[selectedType]);
        }
      }
      
      const response = await fetch(`/api/vagas?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar vagas');
      }
      
      setVagas(data.vagas || []);
      setTotalVagas(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
      
      // Calcular cidades únicas
      const cidadesUnicas = new Set(data.vagas?.map((v: Vaga) => v.cidade).filter(Boolean));
      setTotalCidades(cidadesUnicas.size);
      
    } catch (err) {
      console.error('Erro ao buscar vagas:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar vagas');
    } finally {
      setLoading(false);
    }
  };

  // Buscar vagas quando filtros mudarem
  useEffect(() => {
    fetchVagas();
  }, [page, searchTerm, selectedCity, selectedType]);

  // Reset página quando filtros mudarem
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCity, selectedType]);

  const jobs = vagas.map(transformVagaToJob);

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

          {/* Aviso LGPD */}
          <p className={styles.lgpdNotice}>
            As buscas realizadas respeitam a Lei Geral de Proteção de Dados (LGPD).
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
              <span className={styles.statNumber}>{totalVagas.toLocaleString('pt-BR')}</span>
              <span className={styles.statLabel}>Vagas Ativas</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <MapPin className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>{totalCidades}</span>
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
              {loading ? 'Carregando...' : `${jobs.length} ${jobs.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}`}
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

          {loading ? (
            <div className={styles.loading}>
              <Loader2 className={styles.loadingIcon} size={48} />
              <p>Carregando vagas...</p>
            </div>
          ) : error ? (
            <div className={styles.noResults}>
              <Search size={48} />
              <h3>Erro ao carregar vagas</h3>
              <p>{error}</p>
              <button onClick={fetchVagas} className={styles.retryButton}>
                Tentar novamente
              </button>
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className={styles.jobsGrid}>
                {jobs.map((job) => (
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
              
              {/* Paginação */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={styles.paginationButton}
                  >
                    Anterior
                  </button>
                  <span className={styles.paginationInfo}>
                    Página {page} de {totalPages}
                  </span>
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={styles.paginationButton}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
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
