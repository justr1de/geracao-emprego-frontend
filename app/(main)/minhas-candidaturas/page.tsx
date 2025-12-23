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
  Trash2
} from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useCandidatura } from '@/hooks/useApi'
import styles from './page.module.css'

interface Candidatura {
  id: string
  created_at: string
  status_id: number
  carta_apresentacao?: string
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

const statusConfig: Record<number, { icon: React.ReactNode; color: string; label: string }> = {
  1: { icon: <Clock size={16} />, color: '#f59e0b', label: 'Pendente' },
  2: { icon: <Eye size={16} />, color: '#3b82f6', label: 'Visualizada' },
  3: { icon: <CheckCircle size={16} />, color: '#10b981', label: 'Aprovada' },
  4: { icon: <XCircle size={16} />, color: '#ef4444', label: 'Recusada' },
  5: { icon: <XCircle size={16} />, color: '#6b7280', label: 'Cancelada' },
}

export default function MinhasCandidaturasPage() {
  const { isAuthenticated, isCandidate, loading: authLoading } = useAuthContext()
  const { cancelar, loading: cancelLoading } = useCandidatura()
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && isAuthenticated && isCandidate) {
      fetchCandidaturas()
    }
  }, [authLoading, isAuthenticated, isCandidate])

  const fetchCandidaturas = async () => {
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
        <h1>Minhas Candidaturas</h1>
        <p className={styles.subtitle}>
          Acompanhe o status das suas candidaturas
        </p>
      </header>

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
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{candidaturas.length}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber} style={{ color: '#f59e0b' }}>
                {candidaturas.filter(c => c.status_id === 1).length}
              </span>
              <span className={styles.statLabel}>Pendentes</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber} style={{ color: '#10b981' }}>
                {candidaturas.filter(c => c.status_id === 3).length}
              </span>
              <span className={styles.statLabel}>Aprovadas</span>
            </div>
          </div>

          <div className={styles.candidaturasList}>
            {candidaturas.map((candidatura) => {
              const status = statusConfig[candidatura.status_id] || statusConfig[1]
              
              return (
                <div key={candidatura.id} className={styles.candidaturaCard}>
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
            })}
          </div>
        </>
      )}
    </div>
  )
}
