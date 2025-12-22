'use client';

import { Shield, Brain, Database, AlertTriangle, MapPin, CheckCircle } from 'lucide-react';
import styles from './index.module.css';

export default function AdminDashboard() {
  return (
    <section className={styles.section} id="gestor">
      <div className={styles.container}>
        <h2 className={styles.title}>
          <Shield className={styles.titleIcon} />
          Área do Gestor
        </h2>

        <div className={styles.grid}>
          {/* Security Panel */}
          <div className={styles.panel} style={{ borderColor: '#ef4444' }}>
            <div className={styles.panelHeader} style={{ background: '#ef4444' }}>
              <Shield className={styles.panelIcon} />
              <h3 className={styles.panelTitle}>Segurança</h3>
            </div>
            <div className={styles.panelBody}>
              <div className={styles.feature}>
                <MapPin className={styles.featureIcon} />
                <div>
                  <h4 className={styles.featureTitle}>Logs de Auditoria</h4>
                  <p className={styles.featureText}>Rastreamento de IP e Localização</p>
                </div>
              </div>
              <div className={styles.feature}>
                <AlertTriangle className={styles.featureIcon} />
                <div>
                  <h4 className={styles.featureTitle}>Validação</h4>
                  <p className={styles.featureText}>Alertas de perfis falsos</p>
                </div>
              </div>
              <button className={styles.panelButton}>Ver Relatórios</button>
            </div>
          </div>

          {/* AI Panel */}
          <div className={styles.panel} style={{ borderColor: '#8b5cf6' }}>
            <div className={styles.panelHeader} style={{ background: '#8b5cf6' }}>
              <Brain className={styles.panelIcon} />
              <h3 className={styles.panelTitle}>IA Privada</h3>
            </div>
            <div className={styles.panelBody}>
              <div className={styles.feature}>
                <Brain className={styles.featureIcon} />
                <div>
                  <h4 className={styles.featureTitle}>Relatórios Preditivos</h4>
                  <p className={styles.featureText}>Análise de tendências</p>
                </div>
              </div>
              <div className={styles.feature}>
                <Database className={styles.featureIcon} />
                <div>
                  <h4 className={styles.featureTitle}>Análise de Mercado</h4>
                  <p className={styles.featureText}>Insights baseados em dados</p>
                </div>
              </div>
              <button className={styles.panelButton}>Gerar Análises</button>
            </div>
          </div>

          {/* Data Management Panel */}
          <div className={styles.panel} style={{ borderColor: '#1e40af' }}>
            <div className={styles.panelHeader} style={{ background: '#1e40af' }}>
              <Database className={styles.panelIcon} />
              <h3 className={styles.panelTitle}>Gestão de Dados</h3>
            </div>
            <div className={styles.panelBody}>
              <div className={styles.alert}>
                <AlertTriangle className={styles.alertIcon} />
                <span>3 vagas expirando hoje</span>
              </div>
              <div className={styles.feature}>
                <CheckCircle className={styles.featureIcon} />
                <div>
                  <h4 className={styles.featureTitle}>CAGED / RAIS</h4>
                  <p className={styles.featureText}>Status: Sincronizado</p>
                </div>
              </div>
              <button className={styles.panelButton}>Gerenciar</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
