'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

interface Estatisticas {
  candidatos: {
    total: number
    porCidade: { cidade: string; total: number }[]
    porGenero: { genero: string; total: number }[]
  }
  empresas: {
    total: number
    ativas: number
  }
  vagas: {
    total: number
    abertas: number
    porEmpresa: { empresa: string; total: number }[]
  }
}

export default function RelatoriosPage() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [periodoSelecionado, setPeriodoSelecionado] = useState('todos')

  useEffect(() => {
    fetchEstatisticas()
  }, [])

  const fetchEstatisticas = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/relatorios')
      if (!response.ok) throw new Error('Erro ao buscar estatísticas')
      const data = await response.json()
      setEstatisticas(data)
    } catch (err) {
      setError('Erro ao carregar estatísticas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando relatórios...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Relatórios e Estatísticas</h1>
          <p className={styles.subtitle}>Visão geral do sistema Geração Emprego</p>
        </div>
        <div className={styles.headerRight}>
          <select 
            className={styles.periodoSelect}
            value={periodoSelecionado}
            onChange={(e) => setPeriodoSelecionado(e.target.value)}
          >
            <option value="todos">Todos os períodos</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mês</option>
            <option value="ano">Último ano</option>
          </select>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className={styles.cardsGrid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>👥</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardValue}>{estatisticas?.candidatos.total || 0}</h3>
            <p className={styles.cardLabel}>Total de Candidatos</p>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardIcon}>🏢</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardValue}>{estatisticas?.empresas.total || 0}</h3>
            <p className={styles.cardLabel}>Empresas Cadastradas</p>
            <span className={styles.cardSubtext}>{estatisticas?.empresas.ativas || 0} ativas</span>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardIcon}>💼</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardValue}>{estatisticas?.vagas.total || 0}</h3>
            <p className={styles.cardLabel}>Vagas Publicadas</p>
            <span className={styles.cardSubtext}>{estatisticas?.vagas.abertas || 0} abertas</span>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardIcon}>📊</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardValue}>
              {estatisticas?.candidatos.total && estatisticas?.vagas.abertas 
                ? (estatisticas.candidatos.total / estatisticas.vagas.abertas).toFixed(1) 
                : 0}
            </h3>
            <p className={styles.cardLabel}>Candidatos por Vaga</p>
          </div>
        </div>
      </div>

      {/* Seção de Gráficos/Tabelas */}
      <div className={styles.chartsGrid}>
        {/* Candidatos por Cidade */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Candidatos por Cidade</h3>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cidade</th>
                  <th>Candidatos</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {estatisticas?.candidatos.porCidade.map((item, index) => (
                  <tr key={index}>
                    <td>{item.cidade}</td>
                    <td>{item.total}</td>
                    <td>
                      {estatisticas?.candidatos.total 
                        ? ((item.total / estatisticas.candidatos.total) * 100).toFixed(1) 
                        : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Candidatos por Gênero */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Candidatos por Gênero</h3>
          <div className={styles.generoStats}>
            {estatisticas?.candidatos.porGenero.map((item, index) => (
              <div key={index} className={styles.generoItem}>
                <div className={styles.generoIcon}>
                  {item.genero === 'M' ? '👨' : item.genero === 'F' ? '👩' : '👤'}
                </div>
                <div className={styles.generoInfo}>
                  <span className={styles.generoLabel}>
                    {item.genero === 'M' ? 'Masculino' : item.genero === 'F' ? 'Feminino' : 'Não informado'}
                  </span>
                  <span className={styles.generoValue}>{item.total}</span>
                </div>
                <div className={styles.generoBar}>
                  <div 
                    className={styles.generoBarFill} 
                    style={{ 
                      width: `${estatisticas?.candidatos.total 
                        ? (item.total / estatisticas.candidatos.total) * 100 
                        : 0}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vagas por Empresa */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Vagas por Empresa</h3>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Vagas</th>
                </tr>
              </thead>
              <tbody>
                {estatisticas?.vagas.porEmpresa.map((item, index) => (
                  <tr key={index}>
                    <td>{item.empresa}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Exportar Relatórios</h3>
          <div className={styles.exportButtons}>
            <button className={styles.exportBtn} onClick={() => alert('Funcionalidade em desenvolvimento')}>
              📄 Exportar Candidatos (CSV)
            </button>
            <button className={styles.exportBtn} onClick={() => alert('Funcionalidade em desenvolvimento')}>
              📄 Exportar Empresas (CSV)
            </button>
            <button className={styles.exportBtn} onClick={() => alert('Funcionalidade em desenvolvimento')}>
              📄 Exportar Vagas (CSV)
            </button>
            <button className={styles.exportBtn} onClick={() => alert('Funcionalidade em desenvolvimento')}>
              📊 Relatório Completo (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
