'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Clock, DollarSign, Filter, ChevronDown, SlidersHorizontal } from 'lucide-react';
import JobCard from '@/components/JobCard';
import JobDetailModal from '@/components/JobDetailModal';
import styles from './page.module.css';

interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  salario_min?: number;
  salario_max?: number;
  cidade: string;
  estado: string;
  quantidade_vagas: number;
  beneficios?: string;
  requisitos?: string;
  created_at: string;
  empresas: {
    id: string;
    nome_fantasia: string;
    razao_social: string;
    logo_url?: string;
    cidade: string;
    estado: string;
  };
  tipos_contrato: {
    id: number;
    nome: string;
  };
  modelos_trabalho: {
    id: number;
    nome: string;
  };
  areas_vaga: {
    id: number;
    nome: string;
  };
  niveis_escolaridade?: {
    id: number;
    nome: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

export default function JobsPage() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Todas as cidades');
  const [selectedType, setSelectedType] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [salarioMin, setSalarioMin] = useState('');
  const [salarioMax, setSalarioMax] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Opções de filtros (serão carregadas da API)
  const [tiposContrato, setTiposContrato] = useState<any[]>([]);
  const [areasVaga, setAreasVaga] = useState<any[]>([]);

  useEffect(() => {
    loadVagas();
    loadFilterOptions();
  }, [pagination.page, searchTerm, selectedCity, selectedType, selectedArea, salarioMin, salarioMax, sortBy, sortOrder]);

  const loadVagas = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCity !== 'Todas as cidades') params.append('cidade', selectedCity);
      if (selectedType) params.append('tipo_contrato_id', selectedType);
      if (selectedArea) params.append('area_id', selectedArea);
      if (salarioMin) params.append('salario_min', salarioMin);
      if (salarioMax) params.append('salario_max', salarioMax);
      if (sortBy) params.append('sort_by', sortBy);
      if (sortOrder) params.append('sort_order', sortOrder);

      const response = await fetch(`/api/vagas?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setVagas(data.vagas || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      // Carregar tipos de contrato
      const tiposResponse = await fetch('/api/referencias?tipo=tipos_contrato');
      if (tiposResponse.ok) {
        const tiposData = await tiposResponse.json();
        setTiposContrato(tiposData.data || []);
      }

      // Carregar áreas de vaga
      const areasResponse = await fetch('/api/referencias?tipo=areas_vaga');
      if (areasResponse.ok) {
        const areasData = await areasResponse.json();
        setAreasVaga(areasData.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar opções de filtros:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('Todas as cidades');
    setSelectedType('');
    setSelectedArea('');
    setSalarioMin('');
    setSalarioMax('');
    setSortBy('created_at');
    setSortOrder('desc');
    setPagination({ ...pagination, page: 1 });
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'A combinar';
    if (min && max) return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
    if (min) return `A partir de R$ ${min.toLocaleString('pt-BR')}`;
    if (max) return `Até R$ ${max.toLocaleString('pt-BR')}`;
    return 'A combinar';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
    return `Há ${Math.floor(diffDays / 30)} meses`;
  };

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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
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
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
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
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  aria-label="Filtrar por tipo de contrato"
                >
                  <option value="">Todos os tipos</option>
                  {tiposContrato.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <Briefcase size={16} />
                  Área
                </label>
                <select
                  className={styles.filterSelect}
                  value={selectedArea}
                  onChange={(e) => {
                    setSelectedArea(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  aria-label="Filtrar por área"
                >
                  <option value="">Todas as áreas</option>
                  {areasVaga.map((area) => (
                    <option key={area.id} value={area.id}>{area.nome}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <button
                  className={styles.advancedFiltersToggle}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <SlidersHorizontal size={16} />
                  Filtros Avançados
                  <ChevronDown size={16} className={showAdvancedFilters ? styles.rotated : ''} />
                </button>
              </div>
            </div>
          )}

          {/* Filtros Avançados */}
          {showFilters && showAdvancedFilters && (
            <div className={styles.advancedFilters}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <DollarSign size={16} />
                  Salário Mínimo
                </label>
                <input
                  type="number"
                  className={styles.filterInput}
                  placeholder="Ex: 2000"
                  value={salarioMin}
                  onChange={(e) => {
                    setSalarioMin(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                />
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <DollarSign size={16} />
                  Salário Máximo
                </label>
                <input
                  type="number"
                  className={styles.filterInput}
                  placeholder="Ex: 5000"
                  value={salarioMax}
                  onChange={(e) => {
                    setSalarioMax(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                />
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  Ordenar por
                </label>
                <select
                  className={styles.filterSelect}
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                >
                  <option value="created_at">Data de publicação</option>
                  <option value="salario_min">Menor salário</option>
                  <option value="salario_max">Maior salário</option>
                  <option value="titulo">Título (A-Z)</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  Ordem
                </label>
                <select
                  className={styles.filterSelect}
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                >
                  <option value="desc">Decrescente</option>
                  <option value="asc">Crescente</option>
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
              <span className={styles.statNumber}>{pagination.total}</span>
              <span className={styles.statLabel}>Vagas Ativas</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <MapPin className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>{cities.length - 1}</span>
              <span className={styles.statLabel}>Cidades</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Clock className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>24h</span>
              <span className={styles.statLabel}>Atualizado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Vagas */}
      <section className={styles.jobsSection}>
        <div className={styles.jobsContainer}>
          <div className={styles.jobsHeader}>
            <h2 className={styles.jobsTitle}>
              {pagination.total} {pagination.total === 1 ? 'vaga encontrada' : 'vagas encontradas'}
            </h2>
            {(selectedCity !== 'Todas as cidades' || selectedType || selectedArea || searchTerm || salarioMin || salarioMax) && (
              <button
                className={styles.clearFilters}
                onClick={clearFilters}
              >
                Limpar filtros
              </button>
            )}
          </div>

          {isLoading ? (
            <div className={styles.loading}>
              <p>Carregando vagas...</p>
            </div>
          ) : vagas.length > 0 ? (
            <>
              <div className={styles.jobsGrid}>
                {vagas.map((vaga) => (
                  <article key={vaga.id} className={styles.jobCard} onClick={() => setSelectedJob(vaga)}>
                    <div className={styles.jobHeader}>
                      <h3 className={styles.jobTitle}>{vaga.titulo}</h3>
                      <span className={styles.jobType}>{vaga.tipos_contrato.nome}</span>
                    </div>
                    <p className={styles.jobCompany}>{vaga.empresas.nome_fantasia}</p>
                    <div className={styles.jobMeta}>
                      <span className={styles.jobLocation}>
                        <MapPin size={14} />
                        {vaga.cidade}, {vaga.estado}
                      </span>
                      <span className={styles.jobSalary}>
                        <DollarSign size={14} />
                        {formatSalary(vaga.salario_min, vaga.salario_max)}
                      </span>
                    </div>
                    <p className={styles.jobDescription}>
                      {vaga.descricao.length > 150 
                        ? `${vaga.descricao.substring(0, 150)}...` 
                        : vaga.descricao}
                    </p>
                    <div className={styles.jobFooter}>
                      <span className={styles.jobPosted}>
                        <Clock size={14} />
                        {formatDate(vaga.created_at)}
                      </span>
                      <button className={styles.jobButton}>Ver detalhes</button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Paginação */}
              {pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationButton}
                    disabled={pagination.page === 1}
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  >
                    Anterior
                  </button>
                  <span className={styles.paginationInfo}>
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                  <button
                    className={styles.paginationButton}
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
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
