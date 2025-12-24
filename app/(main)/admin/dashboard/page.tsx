// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  BarChart3, 
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import styles from './page.module.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCandidatos: 0,
    totalEmpresas: 0,
    totalVagas: 0,
    totalCursos: 0,
    candidatosAtivos: 0,
    vagasAbertas: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/admin/relatorios');
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalCandidatos: data.candidatos?.total || 0,
            totalEmpresas: data.empresas?.total || 0,
            totalVagas: data.vagas?.total || 0,
            totalCursos: 8,
            candidatosAtivos: data.candidatos?.total || 0,
            vagasAbertas: data.vagas?.abertas || 0,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const statsCards = [
    { 
      icon: Users, 
      label: 'Total de Candidatos', 
      value: stats.totalCandidatos,
      subLabel: `${stats.candidatosAtivos} ativos`,
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)'
    },
    { 
      icon: Building2, 
      label: 'Empresas Cadastradas', 
      value: stats.totalEmpresas,
      subLabel: 'Parceiras',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    { 
      icon: Briefcase, 
      label: 'Vagas Publicadas', 
      value: stats.totalVagas,
      subLabel: `${stats.vagasAbertas} abertas`,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    { 
      icon: GraduationCap, 
      label: 'Cursos Disponíveis', 
      value: stats.totalCursos,
      subLabel: 'Em parceria',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
  ];

  return (
    <div className={styles.dashboardContent}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Dashboard Administrativo</h1>
          <p className={styles.pageSubtitle}>Visão geral do sistema Geração Emprego</p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.adminInfo}>
            <UserCheck size={18} />
            <span>Administrador</span>
          </span>
        </div>
      </header>

      {/* Stats Grid */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {statsCards.map((stat) => (
            <div 
              key={stat.label} 
              className={styles.statCard}
              style={{ '--stat-color': stat.color, '--stat-bg': stat.bgColor } as React.CSSProperties}
            >
              <div className={styles.statIcon}>
                <stat.icon size={28} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  {isLoading ? '...' : stat.value.toLocaleString('pt-BR')}
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statSubLabel}>{stat.subLabel}</span>
              </div>
              <div className={styles.statTrend}>
                <TrendingUp size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
        <div className={styles.actionsGrid}>
          <Link href="/admin/candidatos" className={styles.actionCard}>
            <Users size={24} />
            <span>Gerenciar Candidatos</span>
          </Link>
          <Link href="/admin/empresas" className={styles.actionCard}>
            <Building2 size={24} />
            <span>Gerenciar Empresas</span>
          </Link>
          <Link href="/admin/vagas" className={styles.actionCard}>
            <Briefcase size={24} />
            <span>Gerenciar Vagas</span>
          </Link>
          <Link href="/admin/relatorios" className={styles.actionCard}>
            <BarChart3 size={24} />
            <span>Ver Relatórios</span>
          </Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section className={styles.recentActivity}>
        <h2 className={styles.sectionTitle}>Atividade Recente</h2>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
              <UserCheck size={18} />
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>Novo candidato cadastrado</p>
              <span className={styles.activityTime}>Há 5 minutos</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <Briefcase size={18} />
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>Nova vaga publicada por Empresa Teste</p>
              <span className={styles.activityTime}>Há 15 minutos</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon} style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <Building2 size={18} />
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>Nova empresa cadastrada</p>
              <span className={styles.activityTime}>Há 1 hora</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
