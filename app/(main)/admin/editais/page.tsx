'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

interface Edital {
  id: string
  numero_edital: string
  titulo: string
  descricao_completa: string
  data_inicio_inscricoes: string
  data_fim_inscricoes: string
  status_id: number
  created_at: string
}

export default function EditaisAdminPage() {
  const [editais, setEditais] = useState<Edital[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [editingEdital, setEditingEdital] = useState<Edital | null>(null)
  const [formData, setFormData] = useState({
    numero_edital: '',
    titulo: '',
    descricao_completa: '',
    data_inicio_inscricoes: '',
    data_fim_inscricoes: '',
    status_id: 1
  })

  useEffect(() => {
    fetchEditais()
  }, [page, search])

  const fetchEditais = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      })
      
      const response = await fetch(`/api/admin/editais?${params}`)
      if (!response.ok) throw new Error('Erro ao buscar editais')
      
      const data = await response.json()
      setEditais(data.editais || [])
      setTotalPages(data.totalPages || 1)
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Erro ao buscar editais:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchEditais()
  }

  const openCreateModal = () => {
    setEditingEdital(null)
    setFormData({
      numero_edital: '',
      titulo: '',
      descricao_completa: '',
      data_inicio_inscricoes: '',
      data_fim_inscricoes: '',
      status_id: 1
    })
    setShowModal(true)
  }

  const openEditModal = (edital: Edital) => {
    setEditingEdital(edital)
    setFormData({
      numero_edital: edital.numero_edital || '',
      titulo: edital.titulo || '',
      descricao_completa: edital.descricao_completa || '',
      data_inicio_inscricoes: edital.data_inicio_inscricoes?.split('T')[0] || '',
      data_fim_inscricoes: edital.data_fim_inscricoes?.split('T')[0] || '',
      status_id: edital.status_id || 1
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      const method = editingEdital ? 'PUT' : 'POST'
      const body = editingEdital 
        ? { ...formData, id: editingEdital.id }
        : formData

      const response = await fetch('/api/admin/editais', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Erro ao salvar edital')

      setShowModal(false)
      fetchEditais()
      alert(editingEdital ? 'Edital atualizado com sucesso!' : 'Edital criado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar edital:', error)
      alert('Erro ao salvar edital')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este edital?')) return

    try {
      const response = await fetch(`/api/admin/editais?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao excluir edital')

      fetchEditais()
      alert('Edital excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir edital:', error)
      alert('Erro ao excluir edital')
    }
  }

  const getStatusLabel = (statusId: number) => {
    const statusMap: { [key: number]: { label: string; class: string } } = {
      1: { label: 'Aberto', class: styles.statusAberto },
      2: { label: 'Em Andamento', class: styles.statusAndamento },
      3: { label: 'Encerrado', class: styles.statusEncerrado }
    }
    return statusMap[statusId] || { label: 'Desconhecido', class: '' }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>📋 Gerenciar Editais</h1>
          <p className={styles.subtitle}>{total} editais cadastrados</p>
        </div>
        <button className={styles.addButton} onClick={openCreateModal}>
          + Novo Edital
        </button>
      </div>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Buscar por título ou número..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Buscar</button>
      </form>

      {loading ? (
        <div className={styles.loading}>Carregando editais...</div>
      ) : editais.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhum edital encontrado.</p>
          <p>Clique em "Novo Edital" para adicionar o primeiro edital.</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Título</th>
                  <th>Período de Inscrições</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {editais.map((edital) => {
                  const status = getStatusLabel(edital.status_id)
                  return (
                    <tr key={edital.id}>
                      <td className={styles.numeroEdital}>{edital.numero_edital}</td>
                      <td>
                        <div className={styles.editalTitulo}>{edital.titulo}</div>
                      </td>
                      <td>
                        {formatDate(edital.data_inicio_inscricoes)} - {formatDate(edital.data_fim_inscricoes)}
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.editButton}
                            onClick={() => openEditModal(edital)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(edital.id)}
                            title="Excluir"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Próxima
            </button>
          </div>
        </>
      )}

      {/* Modal de Criar/Editar */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingEdital ? 'Editar Edital' : 'Novo Edital'}</h2>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Número do Edital *</label>
                  <input
                    type="text"
                    value={formData.numero_edital}
                    onChange={(e) => setFormData({ ...formData, numero_edital: e.target.value })}
                    placeholder="Ex: 001/2024"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Status *</label>
                  <select
                    value={formData.status_id}
                    onChange={(e) => setFormData({ ...formData, status_id: parseInt(e.target.value) })}
                  >
                    <option value={1}>Aberto</option>
                    <option value={2}>Em Andamento</option>
                    <option value={3}>Encerrado</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Título *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Início das Inscrições *</label>
                  <input
                    type="date"
                    value={formData.data_inicio_inscricoes}
                    onChange={(e) => setFormData({ ...formData, data_inicio_inscricoes: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Fim das Inscrições *</label>
                  <input
                    type="date"
                    value={formData.data_fim_inscricoes}
                    onChange={(e) => setFormData({ ...formData, data_fim_inscricoes: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Descrição Completa</label>
                <textarea
                  value={formData.descricao_completa}
                  onChange={(e) => setFormData({ ...formData, descricao_completa: e.target.value })}
                  rows={5}
                  placeholder="Descreva os detalhes do edital..."
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className={styles.saveButton} onClick={handleSave}>
                {editingEdital ? 'Salvar Alterações' : 'Criar Edital'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
