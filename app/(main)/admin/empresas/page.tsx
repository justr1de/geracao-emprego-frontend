// @ts-nocheck
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Building2,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Briefcase,
  DollarSign,
  Clock,
  GraduationCap,
  Users,
  MapPin,
  UserCheck,
  Target,
  Star,
  Filter,
  RotateCcw
} from 'lucide-react';
import styles from './page.module.css';

interface CandidatoMatch {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  score: number;
  scoreLabel: string;
  jaCandidatou: boolean;
  criterios: {
    localizacao: { match: boolean; candidato: string; vaga: string };
    cnh: { requerido: boolean; match: boolean; candidato: string };
    veiculo: { requerido: boolean; match: boolean; candidato: string };
    pcd: { vagaPCD: boolean; candidatoPCD: boolean; match: boolean };
    perfilCompleto: { percentual: number; completo: boolean };
  };
}

interface Vaga {
  id: string;
  cargo: string;
  descricao: string;
  salario_min: number;
  salario_max: number;
  quantidade_vagas: number;
  beneficios: string;
  requisitos: string;
  escolaridade_minima: string;
  experiencia_minima: string;
  tipo_contrato: string;
  jornada_trabalho: string;
  status_id: number;
  status: string;
  empresa_id: string;
  created_at: string;
  area_id: number;
  candidatosMatch?: CandidatoMatch[];
  loadingMatch?: boolean;
}

interface Empresa {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  bairro: string;
  cep: string;
  endereco: string;
  numero: string;
  ramo_atividade: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  vagas?: Vaga[];
  totalVagas?: number;
  vagasAbertas?: number;
}

export default function AdminEmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedEmpresas, setExpandedEmpresas] = useState<Set<string>>(new Set());
  const [expandedVagas, setExpandedVagas] = useState<Set<string>>(new Set());
  
  // Filtros
  const [cidadeFiltro, setCidadeFiltro] = useState('');
  const [ramoFiltro, setRamoFiltro] = useState('');
  const [cidades, setCidades] = useState<string[]>([]);
  const [ramos, setRamos] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Buscar lista de cidades e ramos para os filtros
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Buscar cidades
        const cidadesRes = await fetch('/api/admin/empresas?getCidades=true');
        const cidadesData = await cidadesRes.json();
        if (cidadesData.cidades) {
          setCidades(cidadesData.cidades);
        }

        // Buscar ramos de atividade
        const ramosRes = await fetch('/api/admin/empresas?getRamos=true');
        const ramosData = await ramosRes.json();
        if (ramosData.ramos) {
          setRamos(ramosData.ramos);
        }
      } catch (error) {
        console.error('Erro ao buscar filtros:', error);
      }
    };

    fetchFilters();
  }, []);

  const fetchEmpresas = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        includeVagas: 'true',
        ...(search && { search }),
        ...(cidadeFiltro && { cidade: cidadeFiltro }),
        ...(ramoFiltro && { ramo_atividade: ramoFiltro })
      });

      const response = await fetch(`/api/admin/empresas?${params}`);
      const data = await response.json();

      if (response.ok) {
        setEmpresas(data.empresas);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao buscar empresas' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setIsLoading(false);
    }
  }, [page, search, cidadeFiltro, ramoFiltro]);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchEmpresas();
  };

  const handleClearFilters = () => {
    setCidadeFiltro('');
    setRamoFiltro('');
    setSearch('');
    setPage(1);
  };

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresa({ ...empresa });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingEmpresa) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/empresas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEmpresa)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Empresa atualizada com sucesso!' });
        setShowModal(false);
        fetchEmpresas();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao atualizar empresa' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar esta empresa?')) return;

    try {
      const response = await fetch(`/api/admin/empresas?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Empresa desativada com sucesso!' });
        fetchEmpresas();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao desativar empresa' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    }
  };

  const toggleExpand = (empresaId: string) => {
    setExpandedEmpresas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(empresaId)) {
        newSet.delete(empresaId);
      } else {
        newSet.add(empresaId);
      }
      return newSet;
    });
  };

  const toggleVagaMatch = async (empresaId: string, vagaId: string) => {
    const isExpanded = expandedVagas.has(vagaId);
    
    setExpandedVagas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(vagaId)) {
        newSet.delete(vagaId);
      } else {
        newSet.add(vagaId);
      }
      return newSet;
    });

    // Se está expandindo e ainda não tem dados de matching, buscar
    if (!isExpanded) {
      const empresa = empresas.find(e => e.id === empresaId);
      const vaga = empresa?.vagas?.find(v => v.id === vagaId);
      
      if (vaga && !vaga.candidatosMatch) {
        // Marcar como carregando
        setEmpresas(prev => prev.map(e => {
          if (e.id === empresaId) {
            return {
              ...e,
              vagas: e.vagas?.map(v => {
                if (v.id === vagaId) {
                  return { ...v, loadingMatch: true };
                }
                return v;
              })
            };
          }
          return e;
        }));

        try {
          const response = await fetch(`/api/admin/matching?vaga_id=${vagaId}&limit=5`);
          const data = await response.json();

          if (response.ok) {
            setEmpresas(prev => prev.map(e => {
              if (e.id === empresaId) {
                return {
                  ...e,
                  vagas: e.vagas?.map(v => {
                    if (v.id === vagaId) {
                      return { 
                        ...v, 
                        candidatosMatch: data.candidatos,
                        loadingMatch: false 
                      };
                    }
                    return v;
                  })
                };
              }
              return e;
            }));
          }
        } catch (error) {
          console.error('Erro ao buscar matching:', error);
          setEmpresas(prev => prev.map(e => {
            if (e.id === empresaId) {
              return {
                ...e,
                vagas: e.vagas?.map(v => {
                  if (v.id === vagaId) {
                    return { ...v, loadingMatch: false };
                  }
                  return v;
                })
              };
            }
            return e;
          }));
        }
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return '-';
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatSalario = (min: number, max: number) => {
    if (!min && !max) return 'A combinar';
    if (min && max) {
      return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
    }
    if (min) return `A partir de R$ ${min.toLocaleString('pt-BR')}`;
    return `Até R$ ${max.toLocaleString('pt-BR')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aberta': return styles.statusAberta;
      case 'pausada': return styles.statusPausada;
      case 'encerrada': return styles.statusEncerrada;
      case 'inativa': return styles.statusInativa;
      default: return styles.statusPendente;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return styles.scoreExcelente;
    if (score >= 75) return styles.scoreMuitoBom;
    if (score >= 60) return styles.scoreBom;
    if (score >= 40) return styles.scoreRegular;
    return styles.scoreBaixo;
  };

  const getEscolaridadeLabel = (escolaridade: string) => {
    const labels: Record<string, string> = {
      'fundamental_incompleto': 'Fundamental Incompleto',
      'fundamental_completo': 'Fundamental Completo',
      'medio_incompleto': 'Médio Incompleto',
      'medio_completo': 'Médio Completo',
      'superior_incompleto': 'Superior Incompleto',
      'superior_completo': 'Superior Completo',
      'pos_graduacao': 'Pós-Graduação',
      'mestrado': 'Mestrado',
      'doutorado': 'Doutorado'
    };
    return labels[escolaridade] || escolaridade || 'Não informado';
  };

  const hasActiveFilters = cidadeFiltro || ramoFiltro || search;

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/admin/dashboard" className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </Link>
          <div className={styles.titleSection}>
            <Building2 size={28} className={styles.titleIcon} />
            <div>
              <h1 className={styles.title}>Gerenciar Empresas</h1>
              <p className={styles.subtitle}>{total} empresas cadastradas</p>
            </div>
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className={styles.closeMessage}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInputWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por razão social, nome fantasia, CNPJ ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className={styles.searchButton}>
            Buscar
          </button>
          <button 
            type="button" 
            className={`${styles.filterToggleButton} ${showFilters ? styles.filterActive : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filtros
            {hasActiveFilters && <span className={styles.filterBadge}></span>}
          </button>
        </form>

        {/* Filtros Expandidos */}
        {showFilters && (
          <div className={styles.filtersContainer}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <MapPin size={16} />
                Cidade
              </label>
              <select 
                value={cidadeFiltro} 
                onChange={(e) => {
                  setCidadeFiltro(e.target.value);
                  setPage(1);
                }}
                className={styles.filterSelect}
              >
                <option value="">Todas as cidades</option>
                {cidades.map(cidade => (
                  <option key={cidade} value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <Briefcase size={16} />
                Área de Atuação
              </label>
              <select 
                value={ramoFiltro} 
                onChange={(e) => {
                  setRamoFiltro(e.target.value);
                  setPage(1);
                }}
                className={styles.filterSelect}
              >
                <option value="">Todas as áreas</option>
                {ramos.map(ramo => (
                  <option key={ramo} value={ramo}>{ramo}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button 
                type="button" 
                className={styles.clearFiltersButton}
                onClick={handleClearFilters}
              >
                <RotateCcw size={16} />
                Limpar filtros
              </button>
            )}
          </div>
        )}

        {/* Tags de filtros ativos */}
        {hasActiveFilters && (
          <div className={styles.activeFilters}>
            <span className={styles.activeFiltersLabel}>Filtros ativos:</span>
            {search && (
              <span className={styles.filterTag}>
                Busca: "{search}"
                <button onClick={() => setSearch('')}><X size={14} /></button>
              </span>
            )}
            {cidadeFiltro && (
              <span className={styles.filterTag}>
                Cidade: {cidadeFiltro}
                <button onClick={() => setCidadeFiltro('')}><X size={14} /></button>
              </span>
            )}
            {ramoFiltro && (
              <span className={styles.filterTag}>
                Área: {ramoFiltro}
                <button onClick={() => setRamoFiltro('')}><X size={14} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : empresas.length === 0 ? (
          <div className={styles.empty}>
            <Building2 size={48} />
            <p>Nenhuma empresa encontrada</p>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className={styles.clearFiltersLink}>
                Limpar filtros e ver todas
              </button>
            )}
          </div>
        ) : (
          <div className={styles.empresasList}>
            {empresas.map((empresa) => (
              <div key={empresa.id} className={styles.empresaCard}>
                {/* Empresa Header Row */}
                <div className={styles.empresaRow}>
                  <div className={styles.empresaInfo}>
                    <button 
                      className={styles.expandButton}
                      onClick={() => toggleExpand(empresa.id)}
                      title={expandedEmpresas.has(empresa.id) ? 'Recolher vagas' : 'Expandir vagas'}
                    >
                      {expandedEmpresas.has(empresa.id) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                    <div className={styles.empresaDetails}>
                      <span className={styles.empresaNome}>
                        {empresa.nome_fantasia || empresa.razao_social || '-'}
                      </span>
                      {empresa.nome_fantasia && empresa.razao_social && (
                        <span className={styles.razaoSocial}>{empresa.razao_social}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.empresaCnpj}>{formatCNPJ(empresa.cnpj)}</div>
                  <div className={styles.empresaEmail}>{empresa.email || '-'}</div>
                  <div className={styles.empresaTelefone}>{empresa.telefone || '-'}</div>
                  <div className={styles.empresaCidade}>
                    {empresa.cidade ? `${empresa.cidade}/${empresa.estado}` : '-'}
                  </div>
                  <div className={styles.empresaRamo}>
                    {empresa.ramo_atividade || '-'}
                  </div>
                  <div className={styles.empresaVagas}>
                    <span className={styles.vagasBadge}>
                      <Briefcase size={14} />
                      {empresa.totalVagas || 0} vagas
                    </span>
                    {empresa.vagasAbertas > 0 && (
                      <span className={styles.vagasAbertasBadge}>
                        {empresa.vagasAbertas} abertas
                      </span>
                    )}
                  </div>
                  <div className={styles.empresaStatus}>
                    <span className={`${styles.status} ${empresa.is_active !== false ? styles.active : styles.inactive}`}>
                      {empresa.is_active !== false ? (
                        <><CheckCircle2 size={14} /> Ativa</>
                      ) : (
                        <><XCircle size={14} /> Inativa</>
                      )}
                    </span>
                  </div>
                  <div className={styles.empresaCadastro}>{formatDate(empresa.created_at)}</div>
                  <div className={styles.empresaAcoes}>
                    <button
                      onClick={() => handleEdit(empresa)}
                      className={styles.editButton}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(empresa.id)}
                      className={styles.deleteButton}
                      title="Desativar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Vagas Dropdown */}
                {expandedEmpresas.has(empresa.id) && (
                  <div className={styles.vagasDropdown}>
                    <div className={styles.vagasHeader}>
                      <Briefcase size={18} />
                      <span>Vagas da Empresa ({empresa.vagas?.length || 0})</span>
                    </div>
                    
                    {!empresa.vagas || empresa.vagas.length === 0 ? (
                      <div className={styles.vagasEmpty}>
                        <p>Nenhuma vaga cadastrada para esta empresa.</p>
                      </div>
                    ) : (
                      <div className={styles.vagasGrid}>
                        {empresa.vagas.map((vaga) => (
                          <div key={vaga.id} className={styles.vagaCard}>
                            <div className={styles.vagaHeader}>
                              <h4 className={styles.vagaTitulo}>{vaga.cargo}</h4>
                              <span className={`${styles.vagaStatus} ${getStatusColor(vaga.status)}`}>
                                {vaga.status}
                              </span>
                            </div>
                            
                            <div className={styles.vagaInfo}>
                              <div className={styles.vagaInfoItem}>
                                <DollarSign size={16} />
                                <span>{formatSalario(vaga.salario_min, vaga.salario_max)}</span>
                              </div>
                              <div className={styles.vagaInfoItem}>
                                <Users size={16} />
                                <span>{vaga.quantidade_vagas || 1} vaga(s)</span>
                              </div>
                              {vaga.tipo_contrato && (
                                <div className={styles.vagaInfoItem}>
                                  <Briefcase size={16} />
                                  <span>{vaga.tipo_contrato}</span>
                                </div>
                              )}
                              {vaga.jornada_trabalho && (
                                <div className={styles.vagaInfoItem}>
                                  <Clock size={16} />
                                  <span>{vaga.jornada_trabalho}</span>
                                </div>
                              )}
                            </div>

                            {vaga.descricao && (
                              <div className={styles.vagaDescricao}>
                                <strong>Descrição:</strong>
                                <p>{vaga.descricao.length > 150 ? vaga.descricao.substring(0, 150) + '...' : vaga.descricao}</p>
                              </div>
                            )}

                            <div className={styles.vagaRequisitos}>
                              <div className={styles.requisitoItem}>
                                <GraduationCap size={16} />
                                <span><strong>Escolaridade:</strong> {getEscolaridadeLabel(vaga.escolaridade_minima)}</span>
                              </div>
                              {vaga.experiencia_minima && (
                                <div className={styles.requisitoItem}>
                                  <Clock size={16} />
                                  <span><strong>Experiência:</strong> {vaga.experiencia_minima}</span>
                                </div>
                              )}
                            </div>

                            {vaga.requisitos && (
                              <div className={styles.vagaRequisitosTexto}>
                                <strong>Requisitos:</strong>
                                <p>{vaga.requisitos.length > 100 ? vaga.requisitos.substring(0, 100) + '...' : vaga.requisitos}</p>
                              </div>
                            )}

                            {vaga.beneficios && (
                              <div className={styles.vagaBeneficios}>
                                <strong>Benefícios:</strong>
                                <p>{vaga.beneficios}</p>
                              </div>
                            )}

                            {/* Botão de Matching */}
                            <div className={styles.matchingSection}>
                              <button 
                                className={styles.matchingButton}
                                onClick={() => toggleVagaMatch(empresa.id, vaga.id)}
                              >
                                <Target size={16} />
                                {expandedVagas.has(vaga.id) ? 'Ocultar Candidatos' : 'Ver Candidatos Compatíveis'}
                                {expandedVagas.has(vaga.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>

                              {/* Lista de Candidatos Matching */}
                              {expandedVagas.has(vaga.id) && (
                                <div className={styles.matchingList}>
                                  {vaga.loadingMatch ? (
                                    <div className={styles.matchingLoading}>
                                      Buscando candidatos compatíveis...
                                    </div>
                                  ) : vaga.candidatosMatch && vaga.candidatosMatch.length > 0 ? (
                                    <>
                                      <div className={styles.matchingHeader}>
                                        <UserCheck size={16} />
                                        <span>Top 5 Candidatos Compatíveis</span>
                                      </div>
                                      {vaga.candidatosMatch.map((candidato, index) => (
                                        <div key={candidato.id} className={styles.matchingItem}>
                                          <div className={styles.matchingRank}>
                                            #{index + 1}
                                          </div>
                                          <div className={styles.matchingInfo}>
                                            <div className={styles.matchingNome}>
                                              {candidato.nome_completo}
                                              {candidato.jaCandidatou && (
                                                <span className={styles.jaCandidatou}>Já candidatou</span>
                                              )}
                                            </div>
                                            <div className={styles.matchingContato}>
                                              {candidato.cidade && `${candidato.cidade}/${candidato.estado}`}
                                              {candidato.telefone && ` • ${candidato.telefone}`}
                                            </div>
                                            <div className={styles.matchingCriterios}>
                                              {candidato.criterios?.localizacao?.match && (
                                                <span className={styles.criterioMatch}>
                                                  <MapPin size={12} /> Localização
                                                </span>
                                              )}
                                              {candidato.criterios?.perfilCompleto?.completo && (
                                                <span className={styles.criterioMatch}>
                                                  <CheckCircle size={12} /> Perfil Completo
                                                </span>
                                              )}
                                              {candidato.criterios?.cnh?.match && candidato.criterios?.cnh?.requerido && (
                                                <span className={styles.criterioMatch}>
                                                  <CheckCircle size={12} /> CNH
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className={`${styles.matchingScore} ${getScoreColor(candidato.score)}`}>
                                            <Star size={14} />
                                            <span>{candidato.score}%</span>
                                            <small>{candidato.scoreLabel}</small>
                                          </div>
                                        </div>
                                      ))}
                                    </>
                                  ) : (
                                    <div className={styles.matchingEmpty}>
                                      Nenhum candidato encontrado para esta vaga.
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className={styles.vagaFooter}>
                              <span className={styles.vagaData}>
                                Publicada em {formatDate(vaga.created_at)}
                              </span>
                              <Link href={`/admin/vagas?id=${vaga.id}`} className={styles.vagaLink}>
                                Ver detalhes
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={styles.pageButton}
          >
            <ChevronLeft size={18} />
            Anterior
          </button>
          <span className={styles.pageInfo}>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={styles.pageButton}
          >
            Próxima
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingEmpresa && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Editar Empresa</h2>
              <button onClick={() => setShowModal(false)} className={styles.closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Razão Social</label>
                  <input
                    type="text"
                    value={editingEmpresa.razao_social || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      razao_social: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Nome Fantasia</label>
                  <input
                    type="text"
                    value={editingEmpresa.nome_fantasia || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      nome_fantasia: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>CNPJ</label>
                  <input
                    type="text"
                    value={editingEmpresa.cnpj || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      cnpj: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={editingEmpresa.email || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      email: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={editingEmpresa.telefone || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      telefone: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Cidade</label>
                  <input
                    type="text"
                    value={editingEmpresa.cidade || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      cidade: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Estado</label>
                  <input
                    type="text"
                    value={editingEmpresa.estado || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      estado: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Ramo de Atividade</label>
                  <input
                    type="text"
                    value={editingEmpresa.ramo_atividade || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      ramo_atividade: e.target.value
                    })}
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowModal(false)} className={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={handleSave} className={styles.saveButton} disabled={isSaving}>
                {isSaving ? 'Salvando...' : (
                  <>
                    <Save size={18} />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
