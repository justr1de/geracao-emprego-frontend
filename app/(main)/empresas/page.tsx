'use client';

import { useState, useEffect } from 'react';
import { Building2, MapPin, Briefcase, Search, Filter, ChevronDown, Users, TrendingUp, Loader2 } from 'lucide-react';
import CompanyDetailModal from '@/components/CompanyDetailModal';
import styles from './page.module.css';

interface EmpresaAPI {
  id: string;
  razao_social: string;
  nome_fantasia: string | null;
  cnpj: string;
  descricao: string | null;
  telefone_contato: string | null;
  email_contato: string | null;
  cidade: string | null;
  estado: string | null;
  logo_url: string | null;
  created_at: string;
  ramos_atuacao: {
    id: number;
    nome: string;
  } | null;
  portes_empresa: {
    id: number;
    nome: string;
  } | null;
}

interface Company {
  id: string;
  name: string;
  description: string;
  category: string;
  vacancies: number;
  location: string;
  employees: string;
  founded: string;
}

const categories = ['Todas', 'Varejo', 'Indústria', 'Saúde', 'Construção', 'Agronegócio', 'Logística', 'Educação', 'Turismo', 'Tecnologia', 'Alimentação'];

// Lista completa dos 52 municípios de Rondônia
const cities = [
  'Todas',
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

const sortOptions = ['Mais vagas', 'Nome A-Z', 'Nome Z-A'];

function getPorteLabel(porte: { id: number; nome: string } | null): string {
  if (!porte) return '50-100';
  const porteMap: Record<number, string> = {
    1: '1-10',
    2: '11-50',
    3: '51-100',
    4: '101-500',
    5: '500+'
  };
  return porteMap[porte.id] || '50-100';
}

function transformEmpresaToCompany(empresa: EmpresaAPI): Company {
  const year = new Date(empresa.created_at).getFullYear().toString();
  return {
    id: empresa.id,
    name: empresa.nome_fantasia || empresa.razao_social,
    description: empresa.descricao || 'Empresa parceira do programa Geração Emprego.',
    category: empresa.ramos_atuacao?.nome || 'Outros',
    vacancies: Math.floor(Math.random() * 20) + 1, // Placeholder - idealmente viria de uma contagem real
    location: empresa.cidade && empresa.estado ? `${empresa.cidade}, ${empresa.estado}` : 'Rondônia',
    employees: getPorteLabel(empresa.portes_empresa),
    founded: year,
  };
}

export default function CompaniesPage() {
  const [empresas, setEmpresas] = useState<EmpresaAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEmpresas, setTotalEmpresas] = useState(0);
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [sortBy, setSortBy] = useState('Mais vagas');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Buscar empresas da API
  const fetchEmpresas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');
      
      if (searchTerm) {
        params.set('search', searchTerm);
      }
      if (selectedCity !== 'Todas') {
        params.set('cidade', selectedCity);
      }
      
      const response = await fetch(`/api/empresas?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar empresas');
      }
      
      setEmpresas(data.empresas || []);
      setTotalEmpresas(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
      
    } catch (err) {
      console.error('Erro ao buscar empresas:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar empresas');
    } finally {
      setLoading(false);
    }
  };

  // Buscar empresas quando filtros mudarem
  useEffect(() => {
    fetchEmpresas();
  }, [page, searchTerm, selectedCity]);

  // Reset página quando filtros mudarem
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCity, selectedCategory]);

  // Transformar e filtrar empresas
  const companies = empresas
    .map(transformEmpresaToCompany)
    .filter((company) => {
      const matchesCategory = selectedCategory === 'Todas' || company.category === selectedCategory;
      return matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'Mais vagas') return b.vacancies - a.vacancies;
      if (sortBy === 'Nome A-Z') return a.name.localeCompare(b.name);
      if (sortBy === 'Nome Z-A') return b.name.localeCompare(a.name);
      return 0;
    });

  const totalVacancies = companies.reduce((acc, c) => acc + c.vacancies, 0);
  const hasActiveFilters = selectedCategory !== 'Todas' || selectedCity !== 'Todas' || searchTerm;

  // Calcular setores únicos
  const uniqueCategories = new Set(empresas.map(e => e.ramos_atuacao?.nome).filter(Boolean));

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            <Building2 className={styles.heroIcon} />
            Empresas Parceiras
          </h1>
          <p className={styles.heroSubtitle}>
            Conheça as empresas que estão contratando em Rondônia
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
                placeholder="Buscar por nome da empresa..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar empresas"
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
                  <Building2 size={16} />
                  Setor
                </label>
                <select
                  className={styles.filterSelect}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filtrar por setor"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
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
                  <TrendingUp size={16} />
                  Ordenar
                </label>
                <select
                  className={styles.filterSelect}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Ordenar por"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
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
            <Building2 className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>{totalEmpresas.toLocaleString('pt-BR')}</span>
              <span className={styles.statLabel}>Empresas Parceiras</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Briefcase className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>{totalVacancies.toLocaleString('pt-BR')}</span>
              <span className={styles.statLabel}>Vagas Disponíveis</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Users className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>{uniqueCategories.size || categories.length - 1}</span>
              <span className={styles.statLabel}>Setores</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Empresas */}
      <section className={styles.companiesSection}>
        <div className={styles.companiesContainer}>
          <div className={styles.companiesHeader}>
            <h2 className={styles.companiesTitle}>
              {loading ? 'Carregando...' : `${companies.length} ${companies.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}`}
            </h2>
            {hasActiveFilters && (
              <button
                className={styles.clearFilters}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Todas');
                  setSelectedCity('Todas');
                }}
              >
                Limpar filtros
              </button>
            )}
          </div>

          {loading ? (
            <div className={styles.loading}>
              <Loader2 className={styles.loadingIcon} size={48} />
              <p>Carregando empresas...</p>
            </div>
          ) : error ? (
            <div className={styles.noResults}>
              <Search size={48} />
              <h3>Erro ao carregar empresas</h3>
              <p>{error}</p>
              <button onClick={fetchEmpresas} className={styles.retryButton}>
                Tentar novamente
              </button>
            </div>
          ) : companies.length > 0 ? (
            <>
              <div className={styles.companiesGrid}>
                {companies.map((company) => (
                  <article key={company.id} className={styles.companyCard} onClick={() => setSelectedCompany(company)}>
                    <div className={styles.companyHeader}>
                      <div className={styles.companyLogo}>
                        <Building2 size={24} />
                      </div>
                      <span className={styles.companyCategory}>{company.category}</span>
                    </div>
                    <h3 className={styles.companyName}>{company.name}</h3>
                    <p className={styles.companyDescription}>{company.description}</p>
                    <div className={styles.companyMeta}>
                      <span className={styles.companyMetaItem}>
                        <MapPin size={14} />
                        {company.location}
                      </span>
                      <span className={styles.companyMetaItem}>
                        <Users size={14} />
                        {company.employees} funcionários
                      </span>
                    </div>
                    <div className={styles.companyFooter}>
                      <span className={styles.companyVacancies}>
                        <Briefcase size={14} />
                        {company.vacancies} vagas abertas
                      </span>
                      <button className={styles.companyButton}>Ver detalhes</button>
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
              <h3>Nenhuma empresa encontrada</h3>
              <p>Tente ajustar os filtros ou buscar por outros termos</p>
            </div>
          )}
        </div>
      </section>

      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
}
