'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function ConfiguracoesAdminPage() {
  const [activeTab, setActiveTab] = useState('geral')
  const [saving, setSaving] = useState(false)

  // Estados das configurações
  const [configGeral, setConfigGeral] = useState({
    nomeSistema: 'Geração Emprego',
    emailContato: 'suporte@geracaoemprego.ro.gov.br',
    telefoneContato: '(69) 3211-0000',
    endereco: 'Av. Farquar, 2986 - Pedrinhas, Porto Velho - RO'
  })

  const [configVagas, setConfigVagas] = useState({
    vagasPorPagina: 10,
    diasExpiracaoVaga: 30,
    aprovarAutomaticamente: false,
    notificarNovasVagas: true
  })

  const [configCandidatos, setConfigCandidatos] = useState({
    verificacaoSMS: true,
    verificacaoEmail: true,
    limiteCandidaturasDia: 10,
    notificarNovasCandidaturas: true
  })

  const [configEmpresas, setConfigEmpresas] = useState({
    aprovarAutomaticamente: false,
    verificarCNPJ: true,
    limiteVagasGratuitas: 5,
    notificarNovasEmpresas: true
  })

  const handleSave = async () => {
    setSaving(true)
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert('Configurações salvas com sucesso!')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>⚙️ Configurações do Sistema</h1>
          <p className={styles.subtitle}>Gerencie as configurações gerais da plataforma</p>
        </div>
        <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'geral' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('geral')}
        >
          Geral
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'vagas' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('vagas')}
        >
          Vagas
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'candidatos' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('candidatos')}
        >
          Candidatos
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'empresas' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('empresas')}
        >
          Empresas
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      <div className={styles.tabContent}>
        {/* Tab Geral */}
        {activeTab === 'geral' && (
          <div className={styles.configSection}>
            <h2 className={styles.sectionTitle}>Informações Gerais</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Nome do Sistema</label>
                <input
                  type="text"
                  value={configGeral.nomeSistema}
                  onChange={(e) => setConfigGeral({ ...configGeral, nomeSistema: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>E-mail de Contato</label>
                <input
                  type="email"
                  value={configGeral.emailContato}
                  onChange={(e) => setConfigGeral({ ...configGeral, emailContato: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Telefone de Contato</label>
                <input
                  type="text"
                  value={configGeral.telefoneContato}
                  onChange={(e) => setConfigGeral({ ...configGeral, telefoneContato: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Endereço</label>
                <input
                  type="text"
                  value={configGeral.endereco}
                  onChange={(e) => setConfigGeral({ ...configGeral, endereco: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab Vagas */}
        {activeTab === 'vagas' && (
          <div className={styles.configSection}>
            <h2 className={styles.sectionTitle}>Configurações de Vagas</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Vagas por Página</label>
                <input
                  type="number"
                  value={configVagas.vagasPorPagina}
                  onChange={(e) => setConfigVagas({ ...configVagas, vagasPorPagina: parseInt(e.target.value) })}
                  min="5"
                  max="50"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Dias para Expiração da Vaga</label>
                <input
                  type="number"
                  value={configVagas.diasExpiracaoVaga}
                  onChange={(e) => setConfigVagas({ ...configVagas, diasExpiracaoVaga: parseInt(e.target.value) })}
                  min="7"
                  max="90"
                />
              </div>
            </div>
            <div className={styles.toggleGroup}>
              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Aprovar Vagas Automaticamente</span>
                  <span className={styles.toggleDesc}>Novas vagas serão publicadas sem revisão</span>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={configVagas.aprovarAutomaticamente}
                    onChange={(e) => setConfigVagas({ ...configVagas, aprovarAutomaticamente: e.target.checked })}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Notificar Novas Vagas</span>
                  <span className={styles.toggleDesc}>Enviar notificação quando novas vagas forem publicadas</span>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={configVagas.notificarNovasVagas}
                    onChange={(e) => setConfigVagas({ ...configVagas, notificarNovasVagas: e.target.checked })}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab Candidatos */}
        {activeTab === 'candidatos' && (
          <div className={styles.configSection}>
            <h2 className={styles.sectionTitle}>Configurações de Candidatos</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Limite de Candidaturas por Dia</label>
                <input
                  type="number"
                  value={configCandidatos.limiteCandidaturasDia}
                  onChange={(e) => setConfigCandidatos({ ...configCandidatos, limiteCandidaturasDia: parseInt(e.target.value) })}
                  min="1"
                  max="50"
                />
              </div>
            </div>
            <div className={styles.toggleGroup}>
              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Verificação por SMS</span>
                  <span className={styles.toggleDesc}>Exigir verificação de telefone no cadastro</span>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={configCandidatos.verificacaoSMS}
                    onChange={(e) => setConfigCandidatos({ ...configCandidatos, verificacaoSMS: e.target.checked })}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Verificação por E-mail</span>
                  <span className={styles.toggleDesc}>Exigir verificação de e-mail no cadastro</span>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={configCandidatos.verificacaoEmail}
                    onChange={(e) => setConfigCandidatos({ ...configCandidatos, verificacaoEmail: e.target.checked })}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Notificar Novas Candidaturas</span>
                  <span className={styles.toggleDesc}>Enviar e-mail para empresas quando receberem candidaturas</span>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={configCandidatos.notificarNovasCandidaturas}
                    onChange={(e) => setConfigCandidatos({ ...configCandidatos, notificarNovasCandidaturas: e.target.checked })}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab Empresas */}
        {activeTab === 'empresas' && (
          <div className={styles.configSection}>
            <h2 className={styles.sectionTitle}>Configurações de Empresas</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Limite de Vagas Gratuitas</label>
                <input
                  type="number"
                  value={configEmpresas.limiteVagasGratuitas}
                  onChange={(e) => setConfigEmpresas({ ...configEmpresas, limiteVagasGratuitas: parseInt(e.target.value) })}
                  min="1"
                  max="20"
                />
              </div>
            </div>
            <div className={styles.toggleGroup}>
              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Aprovar Empresas Automaticamente</span>
                  <span className={styles.toggleDesc}>Novas empresas serão ativadas sem revisão</span>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={configEmpresas.aprovarAutomaticamente}
                    onChange={(e) => setConfigEmpresas({ ...configEmpresas, aprovarAutomaticamente: e.target.checked })}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Verificar CNPJ</span>
                  <span className={styles.toggleDesc}>Validar CNPJ na Receita Federal</span>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={configEmpresas.verificarCNPJ}
                    onChange={(e) => setConfigEmpresas({ ...configEmpresas, verificarCNPJ: e.target.checked })}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Notificar Novas Empresas</span>
                  <span className={styles.toggleDesc}>Enviar notificação quando novas empresas se cadastrarem</span>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={configEmpresas.notificarNovasEmpresas}
                    onChange={(e) => setConfigEmpresas({ ...configEmpresas, notificarNovasEmpresas: e.target.checked })}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
