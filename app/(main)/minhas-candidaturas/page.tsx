'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Eye,
  Trash2,
  Bell,
  BellRing,
  Filter,
  RefreshCw
} from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useCandidatura } from '@/hooks/useApi'
import styles from './page.module.css'

interface Candidatura {
  id: string
  created_at: string
  updated_at?: string
  status_id: number
  carta_apresentacao?: string
  visualizada_em?: string
  vagas: {
    id: string
    titulo: string
    cidade: string
    estado: string
    empresas: {
      id: string
      nome_fantasia: string
      logo_url?: string
    }
  }
  status_candidatura: {
    id: number
    nome: string
  }
}

const statusConfig: Record<number, { icon: React.ReactNode; color: string; label: string; description: string }> = {
  1: { 
    icon: <Clock size={16} />, 
    color: '#f59e0b', 
    label: 'Pendente',
    description: 'Aguardando análise da empresa'
  },
  2: { 
    icon: <Eye size={16} />, 
    color: '#3b82f6', 
    label: 'Visualizada',
    description: 'A empresa visualizou seu currículo'
  },
  3: { 
    icon: <CheckCircle size={16} />, 
    color: '#10b981', 
    label: 'Aprovada',
    description: 'Parabéns! Você foi selecionado'
  },
  4: { 
    icon: <XCircle size={16} />, 
    color: '#ef4444', 
    label: 'Recusada',
    description: 'Não selecionado para esta vaga'
  },
  5: { 
    icon: <XCircle size={16} />, 
    color: '#6b7280', 
    label: 'Cancelada',
    description: 'Candidatura cancelada por você'
  },
}

type FilterStatus = 'all' | 1 | 2 | 3 | 4 | 5

export default function MinhasCandidaturasPage() {
  const { isAuthenticated, isCandidate, loading: authLoading } = useAuthContext()
  const { cancelar, loading: cancelLoading } = useCandidatura()
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [showNotificationBanner, setShowNotificationBanner] = useState(false)

  useEffect(() => {
    if (!authLoading && isAuthenticated && isCandidate) {
      fetchCandidaturas()
    }
  }, [authLoading, isAuthenticated, isCandidate])

  // Verificar se há candidaturas visualizadas recentemente
  useEffect(() => {
    const visualizadas = candidaturas.filter(c => c.status_id === 2)
    if (visualizadas.length > 0) {
      setShowNotificationBanner(true)
    }
  }, [candidaturas])

  const fetchCandidaturas = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    }
    
    try {
      const response = await fetch('/api/candidaturas')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar candidaturas')
      }

      setCandidaturas(data.candidaturas || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleCancelar = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta candidatura?')) {
      return
    }

    setCancelingId(id)
    const result = await cancelar(id)
    
    if (result.success) {
      // Atualizar lista localmente
      setCandidaturas(prev => 
        prev.map(c => c.id === id ? { ...c, status_id: 5, status_candidatura: { id: 5, nome: 'Cancelada' } } : c)
      )
    }
    setCancelingId(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filtrar candidaturas
  const filteredCandidaturas = filterStatus === 'all' 
    ? candidaturas 
    : candidaturas.filter(c => c.status_id === filterStatus)

  // Contagem por status
  const statusCounts = {
    all: candidaturas.length,
    pending: candidaturas.filter(c => c.status_id === 1).length,
    viewed: candidaturas.filter(c => c.status_id === 2).length,
    approved: candidaturas.filter(c => c.status_id === 3).length,
    rejected: candidaturas.filter(c => c.status_id === 4).length,
  }

  if (authLoading || loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={48} className={styles.spinner} />
        <p>Carregando suas candidaturas...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <AlertCircle size={48} />
          <h2>Acesso Restrito</h2>
          <p>Você precisa estar logado para ver suas candidaturas.</p>
          <Link href="/login" className={styles.loginButton}>
            Fazer Login
          </Link>
        </div>
      </div>
    )
  }

  if (!isCandidate) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <AlertCircle size={48} />
          <h2>Área Exclusiva para Candidatos</h2>
          <p>Esta página é exclusiva para candidatos.</p>
          <Link href="/" className={styles.homeButton}>
            Voltar ao Início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/vagas" className={styles.backLink}>
          <ArrowLeft size={20} />
          <span>Voltar para Vagas</span>
        </Link>
        <div className={styles.headerContent}>
          <div>
            <h1>Minhas Candidaturas</h1>
            <p className={styles.subtitle}>
              Acompanhe o status das suas candidaturas em tempo real
            </p>
          </div>
          <button 
            className={styles.refreshButton}
            onClick={() => fetchCandidaturas(true)}
            disabled={refreshing}
            title="Atualizar lista"
          >
            <RefreshCw size={18} className={refreshing ? styles.spinning : ''} />
          </button>
        </div>
      </header>

      {/* Banner de notificação para candidaturas visualizadas */}
      {showNotificationBanner && statusCounts.viewed > 0 && (
        <div className={styles.notificationBanner}>
          <BellRing size={20} />
          <div className={styles.notificationContent}>
            <strong>Boa notícia!</strong>
            <span>
              {statusCounts.viewed} {statusCounts.viewed === 1 ? 'empresa visualizou' : 'empresas visualizaram'} seu currículo
            </span>
          </div>
          <button 
            className={styles.notificationClose}
            onClick={() => setShowNotificationBanner(false)}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {candidaturas.length === 0 ? (
        <div className={styles.emptyState}>
          <Briefcase size={48} />
          <h2>Nenhuma candidatura ainda</h2>
          <p>Você ainda não se candidatou a nenhuma vaga.</p>
          <Link href="/vagas" className={styles.vagasButton}>
            Explorar Vagas
          </Link>
        </div>
      ) : (
        <>
          {/* Estatísticas */}
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{statusCounts.all}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber} style={{ color: '#f59e0b' }}>
                {statusCounts.pending}
              </span>
              <span className={styles.statLabel}>Pendentes</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber} style={{ color: '#3b82f6' }}>
                {statusCounts.viewed}
              </span>
              <span className={styles.statLabel}>Visualizadas</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber} style={{ color: '#10b981' }}>
                {statusCounts.approved}
              </span>
              <span className={styles.statLabel}>Aprovadas</span>
            </div>
          </div>

          {/* Filtros */}
          <div className={styles.filterBar}>
            <Filter size={16} />
            <span className={styles.filterLabel}>Filtrar por status:</span>
            <div className={styles.filterButtons}>
              <button 
                className={`${styles.filterBtn} ${filterStatus === 'all' ? styles.active : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                Todas ({statusCounts.all})
              </button>
              <button 
                className={`${styles.filterBtn} ${filterStatus === 1 ? styles.active : ''}`}
                onClick={() => setFilterStatus(1)}
              >
                Pendentes ({statusCounts.pending})
              </button>
              <button 
                className={`${styles.filterBtn} ${filterStatus === 2 ? styles.active : ''}`}
                onClick={() => setFilterStatus(2)}
              >
                Visualizadas ({statusCounts.viewed})
              </button>
              <button 
                className={`${styles.filterBtn} ${filterStatus === 3 ? styles.active : ''}`}
                onClick={() => setFilterStatus(3)}
              >
                Aprovadas ({statusCounts.approved})
              </button>
            </div>
          </div>

          {/* Lista de candidaturas */}
          <div className={styles.candidaturasList}>
            {filteredCandidaturas.length === 0 ? (
              <div className={styles.noResults}>
                <p>Nenhuma candidatura encontrada com este filtro.</p>
              </div>
            ) : (
              filteredCandidaturas.map((candidatura) => {
                const status = statusConfig[candidatura.status_id] || statusConfig[1]
                const isNew = candidatura.status_id === 2 && candidatura.updated_at && 
                  (new Date().getTime() - new Date(candidatura.updated_at).getTime()) < 24 * 60 * 60 * 1000
                
                return (
                  <div key={candidatura.id} className={`${styles.candidaturaCard} ${isNew ? styles.newCard : ''}`}>
                    {isNew && (
                      <div className={styles.newBadge}>
                        <Bell size={12} />
                        Nova atualização
                      </div>
                    )}
                    
                    <div className={styles.cardHeader}>
                      <div className={styles.empresaInfo}>
                        {candidatura.vagas.empresas.logo_url ? (
                          <Image
                            src={candidatura.vagas.empresas.logo_url}
                            alt={candidatura.vagas.empresas.nome_fantasia}
                            width={48}
                            height={48}
                            className={styles.empresaLogo}
                          />
                        ) : (
                          <div className={styles.empresaLogoPlaceholder}>
                            <Building2 size={24} />
                          </div>
                        )}
                        <div>
                          <h3 className={styles.vagaTitulo}>{candidatura.vagas.titulo}</h3>
                          <p className={styles.empresaNome}>{candidatura.vagas.empresas.nome_fantasia}</p>
                        </div>
                      </div>
                      <div 
                        className={styles.statusBadge}
                        style={{ backgroundColor: `${status.color}20`, color: status.color }}
                        title={status.description}
                      >
                        {status.icon}
                        <span>{status.label}</span>
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.infoRow}>
                        <MapPin size={16} />
                        <span>{candidatura.vagas.cidade}, {candidatura.vagas.estado}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <Calendar size={16} />
                        <span>Candidatura enviada em {formatDate(candidatura.created_at)}</span>
                      </div>
                      {candidatura.status_id === 2 && candidatura.updated_at && (
                        <div className={styles.infoRow} style={{ color: '#3b82f6' }}>
                          <Eye size={16} />
                          <span>Visualizada em {formatDateTime(candidatura.updated_at)}</span>
                        </div>
                      )}
                      <p className={styles.statusDescription}>{status.description}</p>
                    </div>

                    <div className={styles.cardActions}>
                      <Link 
                        href={`/vagas?id=${candidatura.vagas.id}`}
                        className={styles.viewButton}
                      >
                        <Eye size={16} />
                        Ver Vaga
                      </Link>
                      {candidatura.status_id === 1 && (
                        <button 
                          className={styles.cancelButton}
                          onClick={() => handleCancelar(candidatura.id)}
                          disabled={cancelingId === candidatura.id}
                        >
                          {cancelingId === candidatura.id ? (
                            <Loader2 size={16} className={styles.spinner} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Dica de notificações */}
          <div className={styles.notificationTip}>
            <Bell size={16} />
            <p>
              <strong>Dica:</strong> Ative as notificações do navegador para receber alertas quando empresas visualizarem seu currículo.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
