'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  Briefcase, 
  TrendingUp,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  User
} from 'lucide-react';
import styles from './index.module.css';

interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  cidade: string;
  estado: string;
  salario_min?: number;
  salario_max?: number;
  matchScore: number;
  matchDetails: {
    area: number;
    localizacao: number;
    salario: number;
    experiencia: number;
    habilidades: number;
  };
  empresas?: {
    id: string;
    nome_fantasia: string;
    logo_url?: string;
  };
  areas_vaga?: {
    id: number;
    nome: string;
  };
  tipos_contrato?: {
    id: number;
    nome: string;
  };
  created_at: string;
}

interface RecommendedJobsProps {
  limit?: number;
  showTitle?: boolean;
  className?: string;
}

export default function RecommendedJobs({ 
  limit = 6, 
  showTitle = true,
  className = '' 
}: RecommendedJobsProps) {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);

  const fetchRecommendedJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/vagas/recomendadas?limit=${limit}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar vagas');
      }
      
      setVagas(data.vagas || []);
      setHasProfile(data.hasProfile || false);
    } catch (err) {
      console.error('Erro ao buscar vagas recomendadas:', err);
      setError('Não foi possível carregar as vagas recomendadas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedJobs();
  }, [limit]);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'A combinar';
    if (min && max) {
      return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
    }
    if (min) return `A partir de R$ ${min.toLocaleString('pt-BR')}`;
    return `Até R$ ${max?.toLocaleString('pt-BR')}`;
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return '#059669'; // Verde
    if (score >= 60) return '#0284c7'; // Azul
    if (score >= 40) return '#d97706'; // Amarelo
    return '#6b7280'; // Cinza
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Excelente match';
    if (score >= 60) return 'Bom match';
    if (score >= 40) return 'Match razoável';
    return 'Vaga disponível';
  };

  if (loading) {
    return (
      <section className={`${styles.section} ${className}`}>
        <div className={styles.container}>
          {showTitle && (
            <div className={styles.header}>
              <div className={styles.titleWrapper}>
                <Sparkles className={styles.titleIcon} size={24} />
                <h2 className={styles.title}>Vagas para Você</h2>
              </div>
            </div>
          )}
          <div className={styles.loadingGrid}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonHeader} />
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonText} />
                <div className={styles.skeletonText} />
                <div className={styles.skeletonFooter} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${styles.section} ${className}`}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <AlertCircle size={48} />
            <p>{error}</p>
            <button onClick={fetchRecommendedJobs} className={styles.retryBtn}>
              <RefreshCw size={18} />
              Tentar novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (vagas.length === 0) {
    return (
      <section className={`${styles.section} ${className}`}>
        <div className={styles.container}>
          {showTitle && (
            <div className={styles.header}>
              <div className={styles.titleWrapper}>
                <Sparkles className={styles.titleIcon} size={24} />
                <h2 className={styles.title}>Vagas para Você</h2>
              </div>
            </div>
          )}
          <div className={styles.emptyState}>
            <Briefcase size={48} />
            <h3>Nenhuma vaga encontrada</h3>
            <p>Complete seu perfil para receber recomendações personalizadas</p>
            <Link href="/perfil" className={styles.completeProfileBtn}>
              <User size={18} />
              Completar perfil
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.section} ${className}`}>
      <div className={styles.container}>
        {showTitle && (
          <div className={styles.header}>
            <div className={styles.titleWrapper}>
              <Sparkles className={styles.titleIcon} size={24} />
              <h2 className={styles.title}>
                {hasProfile ? 'Vagas Recomendadas para Você' : 'Vagas em Destaque'}
              </h2>
            </div>
            <p className={styles.subtitle}>
              {hasProfile 
                ? 'Baseado no seu perfil e preferências' 
                : 'Faça login para ver recomendações personalizadas'}
            </p>
            <button onClick={fetchRecommendedJobs} className={styles.refreshBtn} title="Atualizar">
              <RefreshCw size={18} />
            </button>
          </div>
        )}

        {!hasProfile && (
          <div className={styles.profileBanner}>
            <User size={20} />
            <span>Complete seu perfil para receber recomendações personalizadas</span>
            <Link href="/perfil" className={styles.profileBannerLink}>
              Completar perfil
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        <div className={styles.grid}>
          {vagas.map((vaga) => (
            <Link 
              key={vaga.id} 
              href={`/vagas/${vaga.id}`}
              className={styles.card}
            >
              {/* Match Score Badge */}
              {hasProfile && vaga.matchScore > 0 && (
                <div 
                  className={styles.matchBadge}
                  style={{ backgroundColor: getMatchColor(vaga.matchScore) }}
                >
                  <TrendingUp size={14} />
                  <span>{vaga.matchScore}% match</span>
                </div>
              )}

              {/* Company Info */}
              <div className={styles.companyInfo}>
                {vaga.empresas?.logo_url ? (
                  <Image
                    src={vaga.empresas.logo_url}
                    alt={vaga.empresas.nome_fantasia || 'Empresa'}
                    width={48}
                    height={48}
                    className={styles.companyLogo}
                  />
                ) : (
                  <div className={styles.companyLogoPlaceholder}>
                    <Building2 size={24} />
                  </div>
                )}
                <div className={styles.companyDetails}>
                  <span className={styles.companyName}>
                    {vaga.empresas?.nome_fantasia || 'Empresa'}
                  </span>
                  <span className={styles.location}>
                    <MapPin size={14} />
                    {vaga.cidade}, {vaga.estado}
                  </span>
                </div>
              </div>

              {/* Job Title */}
              <h3 className={styles.jobTitle}>{vaga.titulo}</h3>

              {/* Job Details */}
              <div className={styles.jobDetails}>
                {vaga.areas_vaga && (
                  <span className={styles.tag}>
                    <Briefcase size={14} />
                    {vaga.areas_vaga.nome}
                  </span>
                )}
                {vaga.tipos_contrato && (
                  <span className={styles.tag}>
                    {vaga.tipos_contrato.nome}
                  </span>
                )}
              </div>

              {/* Salary */}
              <div className={styles.salary}>
                {formatSalary(vaga.salario_min, vaga.salario_max)}
              </div>

              {/* Match Details (for logged users) */}
              {hasProfile && vaga.matchScore > 0 && (
                <div className={styles.matchDetails}>
                  <span className={styles.matchLabel}>
                    {getMatchLabel(vaga.matchScore)}
                  </span>
                  <div className={styles.matchBar}>
                    <div 
                      className={styles.matchProgress}
                      style={{ 
                        width: `${vaga.matchScore}%`,
                        backgroundColor: getMatchColor(vaga.matchScore)
                      }}
                    />
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className={styles.cardFooter}>
                <span className={styles.viewBtn}>
                  Ver vaga
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Ver todas */}
        <div className={styles.viewAllWrapper}>
          <Link href="/vagas" className={styles.viewAllBtn}>
            Ver todas as vagas
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
