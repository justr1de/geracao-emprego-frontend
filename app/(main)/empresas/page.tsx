'use client';

import { useState } from 'react';
import { Building2, MapPin, Briefcase, Search, Filter, ChevronDown, Users, TrendingUp } from 'lucide-react';
import CompanyDetailModal from '@/components/CompanyDetailModal';
import styles from './page.module.css';

interface Company {
  id: number;
  name: string;
  description: string;
  category: string;
  vacancies: number;
  location: string;
  employees: string;
  founded: string;
}

const mockCompanies: Company[] = [
  {
    id: 1,
    name: 'Supermercado Gonçalves',
    description: 'Rede de supermercados com mais de 30 anos de tradição em Rondônia, oferecendo produtos de qualidade e preços acessíveis para a população.',
    category: 'Varejo',
    vacancies: 45,
    location: 'Porto Velho, RO',
    employees: '500+',
    founded: '1992',
  },
  {
    id: 2,
    name: 'Madeireira Amazônia',
    description: 'Empresa líder no beneficiamento de madeira certificada, com compromisso ambiental e geração de empregos na região.',
    category: 'Indústria',
    vacancies: 28,
    location: 'Ji-Paraná, RO',
    employees: '200-500',
    founded: '1985',
  },
  {
    id: 3,
    name: 'Hospital Santa Casa de Cacoal',
    description: 'Instituição de saúde referência no interior de Rondônia, com atendimento humanizado e equipe multidisciplinar.',
    category: 'Saúde',
    vacancies: 35,
    location: 'Cacoal, RO',
    employees: '300+',
    founded: '1978',
  },
  {
    id: 4,
    name: 'Construtora Rondônia',
    description: 'Construtora especializada em obras residenciais e comerciais, contribuindo para o desenvolvimento urbano do estado.',
    category: 'Construção',
    vacancies: 52,
    location: 'Porto Velho, RO',
    employees: '100-200',
    founded: '2005',
  },
  {
    id: 5,
    name: 'Frigorífico Norte',
    description: 'Frigorífico com certificação internacional, exportando carne bovina de qualidade para diversos países.',
    category: 'Agronegócio',
    vacancies: 80,
    location: 'Vilhena, RO',
    employees: '500+',
    founded: '1998',
  },
  {
    id: 6,
    name: 'Farmácia Popular RO',
    description: 'Rede de farmácias com foco em medicamentos acessíveis e atendimento de qualidade em todo o estado.',
    category: 'Saúde',
    vacancies: 22,
    location: 'Ariquemes, RO',
    employees: '100-200',
    founded: '2010',
  },
  {
    id: 7,
    name: 'Transportadora Guaporé',
    description: 'Empresa de logística e transporte de cargas, conectando Rondônia aos principais centros do país.',
    category: 'Logística',
    vacancies: 38,
    location: 'Porto Velho, RO',
    employees: '200-500',
    founded: '1995',
  },
  {
    id: 8,
    name: 'Colégio Objetivo Porto Velho',
    description: 'Instituição de ensino com excelência acadêmica, preparando estudantes para o futuro desde a educação infantil.',
    category: 'Educação',
    vacancies: 15,
    location: 'Porto Velho, RO',
    employees: '50-100',
    founded: '2000',
  },
  {
    id: 9,
    name: 'Cooperativa Agrícola de Rolim',
    description: 'Cooperativa que apoia pequenos e médios produtores rurais com assistência técnica e comercialização.',
    category: 'Agronegócio',
    vacancies: 18,
    location: 'Rolim de Moura, RO',
    employees: '50-100',
    founded: '1988',
  },
  {
    id: 10,
    name: 'Hotel Rondon Palace',
    description: 'Hotel de alto padrão em Porto Velho, oferecendo conforto e hospitalidade para turistas e executivos.',
    category: 'Turismo',
    vacancies: 12,
    location: 'Porto Velho, RO',
    employees: '50-100',
    founded: '2008',
  },
];

const categories = ['Todas', 'Varejo', 'Indústria', 'Saúde', 'Construção', 'Agronegócio', 'Logística', 'Educação', 'Turismo'];
const cities = ['Todas', 'Porto Velho', 'Ji-Paraná', 'Cacoal', 'Vilhena', 'Ariquemes', 'Rolim de Moura'];
const sortOptions = ['Mais vagas', 'Nome A-Z', 'Nome Z-A'];

export default function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [sortBy, setSortBy] = useState('Mais vagas');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCompanies = mockCompanies
    .filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || company.category === selectedCategory;
      const matchesCity = selectedCity === 'Todas' || company.location.includes(selectedCity);
      return matchesSearch && matchesCategory && matchesCity;
    })
    .sort((a, b) => {
      if (sortBy === 'Mais vagas') return b.vacancies - a.vacancies;
      if (sortBy === 'Nome A-Z') return a.name.localeCompare(b.name);
      if (sortBy === 'Nome Z-A') return b.name.localeCompare(a.name);
      return 0;
    });

  const totalVacancies = mockCompanies.reduce((acc, c) => acc + c.vacancies, 0);
  const hasActiveFilters = selectedCategory !== 'Todas' || selectedCity !== 'Todas' || searchTerm;

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
              <span className={styles.statNumber}>{mockCompanies.length}</span>
              <span className={styles.statLabel}>Empresas Parceiras</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Briefcase className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>{totalVacancies}</span>
              <span className={styles.statLabel}>Vagas Disponíveis</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Users className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>{categories.length - 1}</span>
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
              {filteredCompanies.length} {filteredCompanies.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
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

          {filteredCompanies.length > 0 ? (
            <div className={styles.companiesGrid}>
              {filteredCompanies.map((company) => (
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
