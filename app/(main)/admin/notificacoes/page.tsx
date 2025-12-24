'use client'

import { useState } from 'react'
import styles from './page.module.css'

interface Notificacao {
  id: string
  titulo: string
  mensagem: string
  tipo: 'info' | 'sucesso' | 'alerta' | 'erro'
  destinatarios: 'todos' | 'candidatos' | 'empresas'
  data_envio: string
  lidas: number
  total: number
}

export default function NotificacoesAdminPage() {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    mensagem: '',
    tipo: 'info' as const,
    destinatarios: 'todos' as const
  })

  // Dados mockados para demonstração
  const notificacoesRecentes: Notificacao[] = [
    {
      id: '1',
      titulo: 'Bem-vindo ao Geração Emprego!',
      mensagem: 'Sua conta foi criada com sucesso. Complete seu perfil para aumentar suas chances.',
      tipo: 'sucesso',
      destinatarios: 'candidatos',
      data_envio: '2024-12-23T10:00:00',
      lidas: 45,
      total: 50
    },
    {
      id: '2',
      titulo: 'Novas vagas disponíveis',
      mensagem: '15 novas vagas foram publicadas em Porto Velho. Confira!',
      tipo: 'info',
      destinatarios: 'candidatos',
      data_envio: '2024-12-22T14:30:00',
      lidas: 38,
      total: 50
    },
    {
      id: '3',
      titulo: 'Atualização de sistema',
      mensagem: 'O sistema passará por manutenção no dia 25/12 das 00h às 06h.',
      tipo: 'alerta',
      destinatarios: 'todos',
      data_envio: '2024-12-21T09:00:00',
      lidas: 52,
      total: 56
    }
  ]

  const handleSendNotification = () => {
    alert(`Notificação enviada!\n\nTítulo: ${formData.titulo}\nDestinatários: ${formData.destinatarios}`)
    setShowModal(false)
    setFormData({
      titulo: '',
      mensagem: '',
      tipo: 'info',
      destinatarios: 'todos'
    })
  }

  const getTipoClass = (tipo: string) => {
    const classes: { [key: string]: string } = {
      info: styles.tipoInfo,
      sucesso: styles.tipoSucesso,
      alerta: styles.tipoAlerta,
      erro: styles.tipoErro
    }
    return classes[tipo] || styles.tipoInfo
  }

  const getDestinatariosLabel = (dest: string) => {
    const labels: { [key: string]: string } = {
      todos: 'Todos os usuários',
      candidatos: 'Candidatos',
      empresas: 'Empresas'
    }
    return labels[dest] || dest
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>🔔 Central de Notificações</h1>
          <p className={styles.subtitle}>Envie notificações para os usuários do sistema</p>
        </div>
        <button className={styles.addButton} onClick={() => setShowModal(true)}>
          + Nova Notificação
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📨</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>156</span>
            <span className={styles.statLabel}>Notificações Enviadas</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>89%</span>
            <span className={styles.statLabel}>Taxa de Leitura</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>56</span>
            <span className={styles.statLabel}>Usuários Ativos</span>
          </div>
        </div>
      </div>

      {/* Notificações Recentes */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Notificações Recentes</h2>
        <div className={styles.notificacoesList}>
          {notificacoesRecentes.map((notif) => (
            <div key={notif.id} className={styles.notificacaoCard}>
              <div className={styles.notificacaoHeader}>
                <span className={`${styles.tipoBadge} ${getTipoClass(notif.tipo)}`}>
                  {notif.tipo.toUpperCase()}
                </span>
                <span className={styles.destinatarios}>
                  {getDestinatariosLabel(notif.destinatarios)}
                </span>
                <span className={styles.data}>
                  {new Date(notif.data_envio).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h3 className={styles.notificacaoTitulo}>{notif.titulo}</h3>
              <p className={styles.notificacaoMensagem}>{notif.mensagem}</p>
              <div className={styles.notificacaoFooter}>
                <span className={styles.leituras}>
                  📖 {notif.lidas}/{notif.total} leituras ({Math.round((notif.lidas / notif.total) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Nova Notificação */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Nova Notificação</h2>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Título da Notificação *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Novas vagas disponíveis"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Tipo *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                  >
                    <option value="info">Informação</option>
                    <option value="sucesso">Sucesso</option>
                    <option value="alerta">Alerta</option>
                    <option value="erro">Erro</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Destinatários *</label>
                  <select
                    value={formData.destinatarios}
                    onChange={(e) => setFormData({ ...formData, destinatarios: e.target.value as any })}
                  >
                    <option value="todos">Todos os usuários</option>
                    <option value="candidatos">Apenas Candidatos</option>
                    <option value="empresas">Apenas Empresas</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Mensagem *</label>
                <textarea
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  rows={4}
                  placeholder="Digite a mensagem da notificação..."
                  required
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className={styles.saveButton} onClick={handleSendNotification}>
                Enviar Notificação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
