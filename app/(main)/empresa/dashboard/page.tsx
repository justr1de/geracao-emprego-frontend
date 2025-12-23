'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Building2, 
  Briefcase, 
  Users, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  Filter
} from 'lucide-react';
import { useAuthContext as useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';

interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  requisitos: string[];
  salario: string;
  tipo: 'clt' | 'pj' | 'estagio' | 'temporario';
  modalidade: 'presencial' | 'remoto' | 'hibrido';
  cidade: string;
  estado: string;
  status: 'ativa' | 'pausada' | 'encerrada';
  candidaturas: number;
  visualizacoes: number;
  criadaEm: string;
  expiraEm: string;
}

interface Candidatura {
  id: string;
  vagaId: string;
  vagaTitulo: string;
  candidato: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    foto: string | null;
    cidade: string;
    estado: string;
  };
  status: 'pendente' | 'em_analise' | 'entrevista' | 'aprovado' | 'reprovado';
  dataAplicacao: string;
  curriculoUrl: string | null;
}

interface EmpresaStats {
  vagasAtivas: number;
  totalCandidaturas: number;
  candidaturasPendentes: number;
  entrevistasAgendadas: number;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<EmpresaStats>({
    vagasAtivas: 0,
    totalCandidaturas: 0,
    candidaturasPendentes: 0,
    entrevistasAgendadas: 0,
  });
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [selectedVaga, setSelectedVaga] = useState<string | null>(null);
  const [expandedCandidatura, setExpandedCandidatura] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Simular carregamento de dados
        // TODO: Substituir por chamadas reais à API
        setStats({
          vagasAtivas: 5,
          totalCandidaturas: 47,
          candidaturasPendentes: 12,
          entrevistasAgendadas: 3,
        });

        setVagas([
          {
            id: '1',
            titulo: 'Auxiliar Administrativo',
            descricao: 'Vaga para auxiliar administrativo com experiência em rotinas de escritório.',
            requisitos: ['Ensino médio completo', 'Pacote Office', 'Boa comunicação'],
            salario: 'R$ 1.800,00',
            tipo: 'clt',
            modalidade: 'presencial',
            cidade: 'Porto Velho',
            estado: 'RO',
            status: 'ativa',
            candidaturas: 15,
            visualizacoes: 234,
            criadaEm: '2025-12-15',
            expiraEm: '2025-01-15',
          },
          {
            id: '2',
            titulo: 'Vendedor(a)',
            descricao: 'Vendedor para loja de varejo com experiência em atendimento ao cliente.',
            requisitos: ['Experiência em vendas', 'Disponibilidade de horário'],
            salario: 'R$ 1.500,00 + comissão',
            tipo: 'clt',
            modalidade: 'presencial',
            cidade: 'Porto Velho',
            estado: 'RO',
            status: 'ativa',
            candidaturas: 22,
            visualizacoes: 456,
            criadaEm: '2025-12-10',
            expiraEm: '2025-01-10',
          },
        ]);

        setCandidaturas([
          {
            id: 'c1',
            vagaId: '1',
            vagaTitulo: 'Auxiliar Administrativo',
            candidato: {
              id: 'u1',
              nome: 'Maria Silva',
              email: 'maria.silva@email.com',
              telefone: '(69) 99999-1234',
              foto: null,
              cidade: 'Porto Velho',
              estado: 'RO',
            },
            status: 'pendente',
            dataAplicacao: '2025-12-20',
            curriculoUrl: null,
          },
          {
            id: 'c2',
            vagaId: '1',
            vagaTitulo: 'Auxiliar Administrativo',
            candidato: {
              id: 'u2',
              nome: 'João Santos',
              email: 'joao.santos@email.com',
              telefone: '(69) 99999-5678',
              foto: null,
              cidade: 'Porto Velho',
              estado: 'RO',
            },
            status: 'em_analise',
            dataAplicacao: '2025-12-19',
            curriculoUrl: null,
          },
          {
            id: 'c3',
            vagaId: '2',
            vagaTitulo: 'Vendedor(a)',
            candidato: {
              id: 'u3',
              nome: 'Ana Costa',
              email: 'ana.costa@email.com',
              telefone: '(69) 99999-9012',
              foto: null,
              cidade: 'Porto Velho',
              estado: 'RO',
            },
            status: 'entrevista',
            dataAplicacao: '2025-12-18',
            curriculoUrl: null,
          },
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadData();
    }
  }, [user, authLoading]);

  // Atualizar status da candidatura
  const updateCandidaturaStatus = async (candidaturaId: string, newStatus: Candidatura['status']) => {
    setCandidaturas(prev =>
      prev.map(c => (c.id === candidaturaId ? { ...c, status: newStatus } : c))
    );
    // TODO: Chamar API e enviar notificação
  };

  // Filtrar candidaturas
  const filteredCandidaturas = candidaturas.filter(c => {
    const matchesSearch = 
      c.candidato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vagaTitulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;
    const matchesVaga = !selectedVaga || c.vagaId === selectedVaga;
    return matchesSearch && matchesStatus && matchesVaga;
  });

  const getStatusBadge = (status: Candidatura['status']) => {
    const statusConfig = {
      pendente: { label: 'Pendente', color: '#f59e0b', bg: '#fef3c7' },
      em_analise: { label: 'Em Análise', color: '#3b82f6', bg: '#dbeafe' },
      entrevista: { label: 'Entrevista', color: '#8b5cf6', bg: '#ede9fe' },
      aprovado: { label: 'Aprovado', color: '#22c55e', bg: '#dcfce7' },
      reprovado: { label: 'Reprovado', color: '#ef4444', bg: '#fee2e2' },
    };
    const config = statusConfig[status];
    return (
      <span
        className={styles.statusBadge}
        style={{ color: config.color, backgroundColor: config.bg }}
      >
        {config.label}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.notLogged}>
        <Building2 size={48} />
        <h2>Acesso Restrito</h2>
        <p>Você precisa estar logado como empresa para acessar o dashboard.</p>
        <Link href="/login" className={styles.loginButton}>
          Fazer Login
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Dashboard da Empresa</h1>
          <p>Gerencie suas vagas e candidaturas</p>
        </div>
        <Link href="/empresa/vagas/nova" className={styles.newVagaButton}>
          <Plus size={20} />
          Nova Vaga
        </Link>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#dcfce7' }}>
            <Briefcase size={24} color="#22c55e" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.vagasAtivas}</span>
            <span className={styles.statLabel}>Vagas Ativas</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#dbeafe' }}>
            <Users size={24} color="#3b82f6" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalCandidaturas}</span>
            <span className={styles.statLabel}>Total Candidaturas</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fef3c7' }}>
            <Clock size={24} color="#f59e0b" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.candidaturasPendentes}</span>
            <span className={styles.statLabel}>Pendentes</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#ede9fe' }}>
            <Calendar size={24} color="#8b5cf6" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.entrevistasAgendadas}</span>
            <span className={styles.statLabel}>Entrevistas</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'vagas' ? styles.active : ''}`}
          onClick={() => setActiveTab('vagas')}
        >
          Minhas Vagas
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'candidaturas' ? styles.active : ''}`}
          onClick={() => setActiveTab('candidaturas')}
        >
          Candidaturas
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Tab Visão Geral */}
        {activeTab === 'overview' && (
          <div className={styles.overviewGrid}>
            <div className={styles.section}>
              <h2>Vagas Recentes</h2>
              {vagas.slice(0, 3).map(vaga => (
                <div key={vaga.id} className={styles.vagaCard}>
                  <div className={styles.vagaHeader}>
                    <h3>{vaga.titulo}</h3>
                    <span className={`${styles.vagaStatus} ${styles[vaga.status]}`}>
                      {vaga.status === 'ativa' ? 'Ativa' : vaga.status === 'pausada' ? 'Pausada' : 'Encerrada'}
                    </span>
                  </div>
                  <div className={styles.vagaStats}>
                    <span><Eye size={16} /> {vaga.visualizacoes} visualizações</span>
                    <span><Users size={16} /> {vaga.candidaturas} candidaturas</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.section}>
              <h2>Candidaturas Pendentes</h2>
              {candidaturas.filter(c => c.status === 'pendente').slice(0, 5).map(candidatura => (
                <div key={candidatura.id} className={styles.candidaturaCard}>
                  <div className={styles.candidatoInfo}>
                    <div className={styles.candidatoAvatar}>
                      {candidatura.candidato.nome[0]}
                    </div>
                    <div>
                      <h4>{candidatura.candidato.nome}</h4>
                      <p>{candidatura.vagaTitulo}</p>
                    </div>
                  </div>
                  <div className={styles.candidaturaActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => updateCandidaturaStatus(candidatura.id, 'em_analise')}
                      title="Analisar"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Minhas Vagas */}
        {activeTab === 'vagas' && (
          <div className={styles.vagasSection}>
            {vagas.map(vaga => (
              <div key={vaga.id} className={styles.vagaFullCard}>
                <div className={styles.vagaFullHeader}>
                  <div>
                    <h3>{vaga.titulo}</h3>
                    <p className={styles.vagaLocation}>{vaga.cidade}, {vaga.estado} • {vaga.modalidade}</p>
                  </div>
                  <div className={styles.vagaActions}>
                    <button className={styles.editBtn} title="Editar">
                      <Edit size={18} />
                    </button>
                    <button className={styles.deleteBtn} title="Excluir">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className={styles.vagaDesc}>{vaga.descricao}</p>
                <div className={styles.vagaDetails}>
                  <span><strong>Salário:</strong> {vaga.salario}</span>
                  <span><strong>Tipo:</strong> {vaga.tipo.toUpperCase()}</span>
                  <span><strong>Expira em:</strong> {new Date(vaga.expiraEm).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className={styles.vagaFooter}>
                  <div className={styles.vagaMetrics}>
                    <span><Eye size={16} /> {vaga.visualizacoes}</span>
                    <span><Users size={16} /> {vaga.candidaturas}</span>
                  </div>
                  <span className={`${styles.vagaStatus} ${styles[vaga.status]}`}>
                    {vaga.status === 'ativa' ? 'Ativa' : vaga.status === 'pausada' ? 'Pausada' : 'Encerrada'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Candidaturas */}
        {activeTab === 'candidaturas' && (
          <div className={styles.candidaturasSection}>
            <div className={styles.filters}>
              <div className={styles.searchBox}>
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar candidato ou vaga..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="todos">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="em_analise">Em Análise</option>
                <option value="entrevista">Entrevista</option>
                <option value="aprovado">Aprovado</option>
                <option value="reprovado">Reprovado</option>
              </select>
              <select
                value={selectedVaga || ''}
                onChange={(e) => setSelectedVaga(e.target.value || null)}
                className={styles.filterSelect}
              >
                <option value="">Todas as vagas</option>
                {vagas.map(v => (
                  <option key={v.id} value={v.id}>{v.titulo}</option>
                ))}
              </select>
            </div>

            <div className={styles.candidaturasList}>
              {filteredCandidaturas.map(candidatura => (
                <div key={candidatura.id} className={styles.candidaturaFullCard}>
                  <div
                    className={styles.candidaturaHeader}
                    onClick={() => setExpandedCandidatura(
                      expandedCandidatura === candidatura.id ? null : candidatura.id
                    )}
                  >
                    <div className={styles.candidatoInfo}>
                      <div className={styles.candidatoAvatar}>
                        {candidatura.candidato.nome[0]}
                      </div>
                      <div>
                        <h4>{candidatura.candidato.nome}</h4>
                        <p>{candidatura.vagaTitulo}</p>
                        <span className={styles.dataAplicacao}>
                          Aplicou em {new Date(candidatura.dataAplicacao).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className={styles.candidaturaRight}>
                      {getStatusBadge(candidatura.status)}
                      {expandedCandidatura === candidatura.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>

                  {expandedCandidatura === candidatura.id && (
                    <div className={styles.candidaturaExpanded}>
                      <div className={styles.candidatoDetails}>
                        <div className={styles.contactInfo}>
                          <span><Mail size={16} /> {candidatura.candidato.email}</span>
                          <span><Phone size={16} /> {candidatura.candidato.telefone}</span>
                          <span>{candidatura.candidato.cidade}, {candidatura.candidato.estado}</span>
                        </div>
                        {candidatura.curriculoUrl && (
                          <a href={candidatura.curriculoUrl} className={styles.curriculoLink} target="_blank">
                            <FileText size={16} /> Ver Currículo
                          </a>
                        )}
                      </div>
                      <div className={styles.statusActions}>
                        <span>Alterar status:</span>
                        <div className={styles.statusButtons}>
                          <button
                            className={`${styles.statusBtn} ${candidatura.status === 'em_analise' ? styles.active : ''}`}
                            onClick={() => updateCandidaturaStatus(candidatura.id, 'em_analise')}
                          >
                            Em Análise
                          </button>
                          <button
                            className={`${styles.statusBtn} ${candidatura.status === 'entrevista' ? styles.active : ''}`}
                            onClick={() => updateCandidaturaStatus(candidatura.id, 'entrevista')}
                          >
                            Entrevista
                          </button>
                          <button
                            className={`${styles.statusBtn} ${styles.approve} ${candidatura.status === 'aprovado' ? styles.active : ''}`}
                            onClick={() => updateCandidaturaStatus(candidatura.id, 'aprovado')}
                          >
                            <CheckCircle size={16} /> Aprovar
                          </button>
                          <button
                            className={`${styles.statusBtn} ${styles.reject} ${candidatura.status === 'reprovado' ? styles.active : ''}`}
                            onClick={() => updateCandidaturaStatus(candidatura.id, 'reprovado')}
                          >
                            <XCircle size={16} /> Reprovar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredCandidaturas.length === 0 && (
                <div className={styles.emptyState}>
                  <Users size={48} />
                  <p>Nenhuma candidatura encontrada</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmpresaDashboardPage() {
  return (
    <Suspense fallback={<div className={styles.loading}><div className={styles.spinner}></div><p>Carregando...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}
