'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

interface Curso {
  id: string
  nome_curso: string
  descricao_curso: string
  o_que_aprendera: string
  requisitos: string
  publico_alvo: string
  carga_horaria_horas: number
  area_id: number
  area_nome: string
  created_at: string
}

interface Area {
  id: number
  nome: string
}

export default function CursosAdminPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null)
  const [formData, setFormData] = useState({
    nome_curso: '',
    descricao_curso: '',
    o_que_aprendera: '',
    requisitos: '',
    publico_alvo: '',
    carga_horaria_horas: 0,
    area_id: 1
  })

  useEffect(() => {
    fetchCursos()
    fetchAreas()
  }, [page, search])

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/areas')
      if (response.ok) {
        const data = await response.json()
        setAreas(data)
      }
    } catch (error) {
      // Usar áreas padrão se a API não existir
      setAreas([
        { id: 1, nome: 'Administrativo / Financeiro' },
        { id: 2, nome: 'Tecnologia' },
        { id: 3, nome: 'Vendas / Comercial' },
        { id: 4, nome: 'Saúde' },
        { id: 5, nome: 'Operacional / Industrial' },
        { id: 6, nome: 'Recursos Humanos' },
        { id: 7, nome: 'Educação' },
        { id: 8, nome: 'Direito' }
      ])
    }
  }

  const fetchCursos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      })
      
      const response = await fetch(`/api/admin/cursos?${params}`)
      if (!response.ok) throw new Error('Erro ao buscar cursos')
      
      const data = await response.json()
      setCursos(data.cursos || [])
      setTotalPages(data.totalPages || 1)
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Erro ao buscar cursos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchCursos()
  }

  const openCreateModal = () => {
    setEditingCurso(null)
    setFormData({
      nome_curso: '',
      descricao_curso: '',
      o_que_aprendera: '',
      requisitos: '',
      publico_alvo: '',
      carga_horaria_horas: 0,
      area_id: 1
    })
    setShowModal(true)
  }

  const openEditModal = (curso: Curso) => {
    setEditingCurso(curso)
    setFormData({
      nome_curso: curso.nome_curso,
      descricao_curso: curso.descricao_curso || '',
      o_que_aprendera: curso.o_que_aprendera || '',
      requisitos: curso.requisitos || '',
      publico_alvo: curso.publico_alvo || '',
      carga_horaria_horas: curso.carga_horaria_horas || 0,
      area_id: curso.area_id || 1
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      const method = editingCurso ? 'PUT' : 'POST'
      const body = editingCurso 
        ? { ...formData, id: editingCurso.id }
        : formData

      const response = await fetch('/api/admin/cursos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Erro ao salvar curso')

      setShowModal(false)
      fetchCursos()
      alert(editingCurso ? 'Curso atualizado com sucesso!' : 'Curso criado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar curso:', error)
      alert('Erro ao salvar curso')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return

    try {
      const response = await fetch(`/api/admin/cursos?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao excluir curso')

      fetchCursos()
      alert('Curso excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir curso:', error)
      alert('Erro ao excluir curso')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>📚 Gerenciar Cursos</h1>
          <p className={styles.subtitle}>{total} cursos cadastrados</p>
        </div>
        <button className={styles.addButton} onClick={openCreateModal}>
          + Novo Curso
        </button>
      </div>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Buscar</button>
      </form>

      {loading ? (
        <div className={styles.loading}>Carregando cursos...</div>
      ) : cursos.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhum curso encontrado.</p>
          <p>Clique em "Novo Curso" para adicionar o primeiro curso.</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome do Curso</th>
                  <th>Área</th>
                  <th>Carga Horária</th>
                  <th>Público Alvo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((curso) => (
                  <tr key={curso.id}>
                    <td>
                      <div className={styles.cursoNome}>{curso.nome_curso}</div>
                      <div className={styles.cursoDescricao}>
                        {curso.descricao_curso?.substring(0, 100)}
                        {curso.descricao_curso?.length > 100 ? '...' : ''}
                      </div>
                    </td>
                    <td>
                      <span className={styles.areaBadge}>{curso.area_nome}</span>
                    </td>
                    <td>{curso.carga_horaria_horas}h</td>
                    <td>{curso.publico_alvo?.substring(0, 50) || '-'}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editButton}
                          onClick={() => openEditModal(curso)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(curso.id)}
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
              <h2>{editingCurso ? 'Editar Curso' : 'Novo Curso'}</h2>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Nome do Curso *</label>
                <input
                  type="text"
                  value={formData.nome_curso}
                  onChange={(e) => setFormData({ ...formData, nome_curso: e.target.value })}
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Área *</label>
                  <select
                    value={formData.area_id}
                    onChange={(e) => setFormData({ ...formData, area_id: parseInt(e.target.value) })}
                  >
                    {areas.map(area => (
                      <option key={area.id} value={area.id}>{area.nome}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Carga Horária (horas) *</label>
                  <input
                    type="number"
                    value={formData.carga_horaria_horas}
                    onChange={(e) => setFormData({ ...formData, carga_horaria_horas: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Descrição do Curso</label>
                <textarea
                  value={formData.descricao_curso}
                  onChange={(e) => setFormData({ ...formData, descricao_curso: e.target.value })}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label>O que você vai aprender</label>
                <textarea
                  value={formData.o_que_aprendera}
                  onChange={(e) => setFormData({ ...formData, o_que_aprendera: e.target.value })}
                  rows={3}
                  placeholder="Liste os principais tópicos do curso..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Requisitos</label>
                <textarea
                  value={formData.requisitos}
                  onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                  rows={2}
                  placeholder="Pré-requisitos para o curso..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Público Alvo</label>
                <textarea
                  value={formData.publico_alvo}
                  onChange={(e) => setFormData({ ...formData, publico_alvo: e.target.value })}
                  rows={2}
                  placeholder="Para quem é este curso..."
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className={styles.saveButton} onClick={handleSave}>
                {editingCurso ? 'Salvar Alterações' : 'Criar Curso'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
