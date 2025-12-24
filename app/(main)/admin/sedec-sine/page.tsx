'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp,
  MapPin,
  PieChart,
  BarChart3,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import styles from './page.module.css';

interface RelatorioSEDEC {
  periodo: {
    inicio: string;
    fim: string;
    dias: string;
  };
  vagasPorMunicipio: Record<string, { total: number; ativas: number; encerradas: number }>;
  perfilDemografico: {
    porGenero: Record<string, number>;
    porEtnia: Record<string, number>;
    porCidade: Record<string, number>;
    porFaixaEtaria: Record<string, number>;
    pcd: number;
    totalCandidatos: number;
  };
  empregabilidade: {
    totalCandidaturas: number;
    candidaturasAceitas: number;
    taxaEmpregabilidade: number;
    candidaturasEmAnalise: number;
    candidaturasRejeitadas: number;
  };
  empresasParceiras: {
    total: number;
    porSetor: Record<string, { total: number; empresas: any[] }>;
  };
  estatisticasGerais: {
    totalVagas: number;
    vagasAbertas: number;
    vagasEncerradas: number;
    totalPosicoes: number;
    totalCandidatos: number;
    totalEmpresas: number;
  };
  evolucaoMensal: Array<{
    mes: string;
    vagas: number;
    candidatos: number;
    candidaturas: number;
  }>;
}

export default function SEDECSINEDashboard() {
  const [relatorio, setRelatorio] = useState<RelatorioSEDEC | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [periodo, setPeriodo] = useState('30');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadRelatorio();
  }, [periodo, dataInicio, dataFim]);

  const loadRelatorio = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (periodo) params.append('periodo', periodo);
      if (dataInicio) params.append('data_inicio', dataInicio);
      if (dataFim) params.append('data_fim', dataFim);

      const response = await fetch(`/api/admin/relatorios/sedec?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setRelatorio(data);
      }
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportarCSV = () => {
    if (!relatorio) return;

    let csv = 'Relatório SEDEC/SINE - Geração Emprego\n\n';
    
    // Estatísticas Gerais
    csv += 'ESTATÍSTICAS GERAIS\n';
    csv += `Total de Vagas,${relatorio.estatisticasGerais.totalVagas}\n`;
    csv += `Vagas Abertas,${relatorio.estatisticasGerais.vagasAbertas}\n`;
    csv += `Vagas Encerradas,${relatorio.estatisticasGerais.vagasEncerradas}\n`;
    csv += `Total de Posições,${relatorio.estatisticasGerais.totalPosicoes}\n`;
    csv += `Total de Candidatos,${relatorio.estatisticasGerais.totalCandidatos}\n`;
    csv += `Total de Empresas,${relatorio.estatisticasGerais.totalEmpresas}\n\n`;

    // Empregabilidade
    csv += 'EMPREGABILIDADE\n';
    csv += `Total de Candidaturas,${relatorio.empregabilidade.totalCandidaturas}\n`;
    csv += `Candidaturas Aceitas,${relatorio.empregabilidade.candidaturasAceitas}\n`;
    csv += `Taxa de Empregabilidade,${relatorio.empregabilidade.taxaEmpregabilidade}%\n\n`;

    // Vagas por Município
    csv += 'VAGAS POR MUNICÍPIO\n';
    csv += 'Município,Total,Ativas,Encerradas\n';
    Object.entries(relatorio.vagasPorMunicipio).forEach(([cidade, dados]) => {
      csv += `${cidade},${dados.total},${dados.ativas},${dados.encerradas}\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-sedec-sine-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportarPDF = () => {
    // Implementar exportação PDF
    alert('Exportação PDF será implementada em breve');
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Carregando relatórios...</p>
      </div>
    );
  }

  if (!relatorio) {
    return (
      <div className={styles.error}>
        <p>Erro ao carregar relatórios</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Dashboard SEDEC/SINE</h1>
          <p className={styles.pageSubtitle}>
            Relatórios e indicadores do programa Geração Emprego - Governo de Rondônia
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.filterButton} onClick={() => setShowFilters(!showFilters)}>
            <Filter size={18} />
            Filtros
          </button>
          <button className={styles.exportButton} onClick={exportarCSV}>
            <Download size={18} />
            Exportar CSV
          </button>
          <button className={styles.exportButton} onClick={exportarPDF}>
            <Download size={18} />
            Exportar PDF
          </button>
        </div>
      </header>

      {/* Filtros */}
      {showFilters && (
        <section className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              <Calendar size={16} />
              Período (dias)
            </label>
            <select
              className={styles.filterSelect}
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="180">Últimos 6 meses</option>
              <option value="365">Último ano</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Data Início</label>
            <input
              type="date"
              className={styles.filterInput}
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Data Fim</label>
            <input
              type="date"
              className={styles.filterInput}
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </section>
      )}

      {/* Cards de Estatísticas Principais */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard} style={{ '--stat-color': '#3b82f6' } as React.CSSProperties}>
          <div className={styles.statIcon}>
            <Briefcase size={28} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{relatorio.estatisticasGerais.totalVagas}</span>
            <span className={styles.statLabel}>Total de Vagas</span>
            <span className={styles.statSubLabel}>{relatorio.estatisticasGerais.vagasAbertas} abertas</span>
          </div>
        </div>

        <div className={styles.statCard} style={{ '--stat-color': '#22c55e' } as React.CSSProperties}>
          <div className={styles.statIcon}>
            <Users size={28} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{relatorio.estatisticasGerais.totalCandidatos}</span>
            <span className={styles.statLabel}>Total de Candidatos</span>
            <span className={styles.statSubLabel}>{relatorio.perfilDemografico.pcd} PCD</span>
          </div>
        </div>

        <div className={styles.statCard} style={{ '--stat-color': '#8b5cf6' } as React.CSSProperties}>
          <div className={styles.statIcon}>
            <Building2 size={28} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{relatorio.empresasParceiras.total}</span>
            <span className={styles.statLabel}>Empresas Parceiras</span>
            <span className={styles.statSubLabel}>
              {Object.keys(relatorio.empresasParceiras.porSetor).length} setores
            </span>
          </div>
        </div>

        <div className={styles.statCard} style={{ '--stat-color': '#f59e0b' } as React.CSSProperties}>
          <div className={styles.statIcon}>
            <TrendingUp size={28} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{relatorio.empregabilidade.taxaEmpregabilidade}%</span>
            <span className={styles.statLabel}>Taxa de Empregabilidade</span>
            <span className={styles.statSubLabel}>
              {relatorio.empregabilidade.candidaturasAceitas} contratações
            </span>
          </div>
        </div>
      </section>

      {/* Vagas por Município */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <MapPin size={24} />
          Vagas por Município
        </h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Município</th>
                <th>Total</th>
                <th>Ativas</th>
                <th>Encerradas</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(relatorio.vagasPorMunicipio)
                .sort(([, a], [, b]) => b.total - a.total)
                .slice(0, 10)
                .map(([cidade, dados]) => (
                  <tr key={cidade}>
                    <td>{cidade}</td>
                    <td>{dados.total}</td>
                    <td className={styles.statusAtiva}>{dados.ativas}</td>
                    <td className={styles.statusEncerrada}>{dados.encerradas}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Perfil Demográfico */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <PieChart size={24} />
          Perfil Demográfico dos Candidatos
        </h2>
        <div className={styles.demographicGrid}>
          <div className={styles.demographicCard}>
            <h3>Por Gênero</h3>
            <ul className={styles.demographicList}>
              {Object.entries(relatorio.perfilDemografico.porGenero).map(([genero, total]) => (
                <li key={genero}>
                  <span>{genero}</span>
                  <span className={styles.demographicValue}>{total}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.demographicCard}>
            <h3>Por Faixa Etária</h3>
            <ul className={styles.demographicList}>
              {Object.entries(relatorio.perfilDemografico.porFaixaEtaria).map(([faixa, total]) => (
                <li key={faixa}>
                  <span>{faixa} anos</span>
                  <span className={styles.demographicValue}>{total}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.demographicCard}>
            <h3>Por Etnia</h3>
            <ul className={styles.demographicList}>
              {Object.entries(relatorio.perfilDemografico.porEtnia).map(([etnia, total]) => (
                <li key={etnia}>
                  <span>{etnia}</span>
                  <span className={styles.demographicValue}>{total}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Empresas Parceiras por Setor */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Building2 size={24} />
          Empresas Parceiras por Setor
        </h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Setor</th>
                <th>Total de Empresas</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(relatorio.empresasParceiras.porSetor)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([setor, dados]) => (
                  <tr key={setor}>
                    <td>{setor}</td>
                    <td>{dados.total}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Evolução Mensal */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <BarChart3 size={24} />
          Evolução Mensal (Últimos 12 Meses)
        </h2>
        <div className={styles.chartContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mês</th>
                <th>Vagas</th>
                <th>Candidatos</th>
                <th>Candidaturas</th>
              </tr>
            </thead>
            <tbody>
              {relatorio.evolucaoMensal.map((mes) => (
                <tr key={mes.mes}>
                  <td>{mes.mes}</td>
                  <td>{mes.vagas}</td>
                  <td>{mes.candidatos}</td>
                  <td>{mes.candidaturas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rodapé */}
      <footer className={styles.footer}>
        <p>
          Relatório gerado em {new Date().toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <p className={styles.branding}>
          <strong>DATA-RO INTELIGÊNCIA TERRITORIAL</strong> | Governo do Estado de Rondônia
        </p>
      </footer>
    </div>
  );
}
