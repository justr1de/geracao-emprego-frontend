'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Users, Filter, ChevronDown, Loader2, User, Briefcase } from 'lucide-react';
import ResumeDetailModal from '@/components/ResumeDetailModal';
import styles from './page.module.css';

interface Candidato {
  user_id: string;
  nome_completo: string | null;
  cidade: string | null;
  estado: string | null;
  genero: string | null;
  eh_pcd: boolean | null;
  foto_url: string | null;
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

export default function CurriculosPage() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCurriculos, setTotalCurriculos] = useState(0);
  const [totalCidades, setTotalCidades] = useState(0);
  
  const [selectedResume, setSelectedResume] = useState<Candidato | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Todas as cidades');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Buscar currículos da API
  const fetchCurriculos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');
      params.set('estado', 'RO');
      
      if (searchTerm) {
        params.set('search', searchTerm);
      }
      if (selectedCity !== 'Todas as cidades') {
        params.set('cidade', selectedCity);
      }
      
      const response = await fetch(`/api/curriculos?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar currículos');
      }
      
      setCandidatos(data.curriculos || []);
      setTotalCurriculos(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
      
      // Calcular cidades únicas
      const cidadesUnicas = new Set(data.curriculos?.map((c: Candidato) => c.cidade).filter(Boolean));
      setTotalCidades(cidadesUnicas.size);
      
    } catch (err) {
      console.error('Erro ao buscar currículos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar currículos');
    } finally {
      setLoading(false);
    }
  };

  // Buscar currículos quando filtros mudarem
  useEffect(() => {
    fetchCurriculos();
  }, [page, searchTerm, selectedCity]);

  // Reset página quando filtros mudarem
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCity]);

  // Função para obter iniciais do nome
  const getInitials = (name: string | null) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            <Users className={styles.heroIcon} />
            Buscar Currículos
          </h1>
          <p className={styles.heroSubtitle}>
            Encontre os melhores talentos de Rondônia para sua empresa
          </p>

          {/* Aviso LGPD */}
          <p className={styles.lgpdNotice}>
            Todos os dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD).
          </p>

          {/* Barra de Busca */}
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Buscar por nome ou cidade..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar currículos"
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
            </div>
          )}
        </div>
      </section>

      {/* Estatísticas */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <Users className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>{totalCurriculos.toLocaleString('pt-BR')}</span>
              <span className={styles.statLabel}>Currículos</span>
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
            <Briefcase className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Gratuito</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Currículos */}
      <section className={styles.curriculosSection}>
        <div className={styles.curriculosContainer}>
          <div className={styles.curriculosHeader}>
            <h2 className={styles.curriculosTitle}>
              {totalCurriculos.toLocaleString('pt-BR')} currículos encontrados
            </h2>
            {(searchTerm || selectedCity !== 'Todas as cidades') && (
              <button
                className={styles.clearFilters}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('Todas as cidades');
                }}
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className={styles.loading}>
              <Loader2 className={styles.loadingIcon} size={48} />
              <p>Carregando currículos...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className={styles.noResults}>
              <Search size={48} />
              <h3>Erro ao carregar currículos</h3>
              <p>{error}</p>
              <button className={styles.retryButton} onClick={fetchCurriculos}>
                Tentar novamente
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && candidatos.length === 0 && (
            <div className={styles.noResults}>
              <Search size={48} />
              <h3>Nenhum currículo encontrado</h3>
              <p>Tente ajustar os filtros de busca</p>
            </div>
          )}

          {/* Grid de Currículos */}
          {!loading && !error && candidatos.length > 0 && (
            <>
              <div className={styles.curriculosGrid}>
                {candidatos.map((candidato) => (
                  <div
                    key={candidato.user_id}
                    className={styles.curriculoCard}
                    onClick={() => setSelectedResume(candidato)}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.avatar}>
                        {candidato.foto_url ? (
                          <img src={candidato.foto_url} alt={candidato.nome_completo || 'Candidato'} />
                        ) : (
                          <span>{getInitials(candidato.nome_completo)}</span>
                        )}
                      </div>
                      <div className={styles.cardInfo}>
                        <h3 className={styles.cardName}>{candidato.nome_completo || 'Nome não informado'}</h3>
                        <p className={styles.cardLocation}>
                          <MapPin size={14} />
                          {candidato.cidade && candidato.estado 
                            ? `${candidato.cidade}, ${candidato.estado}`
                            : 'Local não informado'}
                        </p>
                      </div>
                    </div>

                    <div className={styles.cardTags}>
                      {candidato.eh_pcd && (
                        <span className={styles.tag}>PcD</span>
                      )}
                      <span className={styles.tagLocation}>Rondônia</span>
                    </div>

                    <button className={styles.viewButton}>
                      <User size={16} />
                      Ver Perfil
                    </button>
                  </div>
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationButton}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </button>
                  <span className={styles.paginationInfo}>
                    Página {page} de {totalPages}
                  </span>
                  <button
                    className={styles.paginationButton}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal de Detalhes */}
      {selectedResume && (
        <ResumeDetailModal
          resume={{
            id: 1,
            name: selectedResume.nome_completo || 'Nome não informado',
            age: 0,
            profession: 'Profissional',
            location: selectedResume.cidade && selectedResume.estado 
              ? `${selectedResume.cidade}, ${selectedResume.estado}`
              : 'Local não informado',
            experience: 'A definir',
            education: 'A definir',
            skills: [],
          }}
          onClose={() => setSelectedResume(null)}
        />
      )}
    </div>
  );
}
