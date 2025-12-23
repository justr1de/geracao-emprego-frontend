// @ts-nocheck
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Users,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react';
import styles from './page.module.css';

interface Candidato {
  id: string;
  user_id: string;
  nome_completo: string;
  cpf: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  genero: string;
  cidade: string;
  estado: string;
  bairro: string;
  cep: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminCandidatosPage() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingCandidato, setEditingCandidato] = useState<Candidato | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCandidatos = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      });

      const response = await fetch(`/api/admin/candidatos?${params}`);
      const data = await response.json();

      if (response.ok) {
        setCandidatos(data.candidatos);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao buscar candidatos' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCandidatos();
  }, [fetchCandidatos]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCandidatos();
  };

  const handleEdit = (candidato: Candidato) => {
    setEditingCandidato({ ...candidato });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingCandidato) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/candidatos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCandidato)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Candidato atualizado com sucesso!' });
        setShowModal(false);
        fetchCandidatos();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao atualizar candidato' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar este candidato?')) return;

    try {
      const response = await fetch(`/api/admin/candidatos?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Candidato desativado com sucesso!' });
        fetchCandidatos();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao desativar candidato' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return '-';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/admin/dashboard" className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </Link>
          <div className={styles.titleSection}>
            <Users size={28} className={styles.titleIcon} />
            <div>
              <h1 className={styles.title}>Gerenciar Candidatos</h1>
              <p className={styles.subtitle}>{total} candidatos cadastrados</p>
            </div>
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className={styles.closeMessage}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInputWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nome, CPF, e-mail ou telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className={styles.searchButton}>
            Buscar
          </button>
        </form>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : candidatos.length === 0 ? (
          <div className={styles.empty}>
            <Users size={48} />
            <p>Nenhum candidato encontrado</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>Status</th>
                <th>Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {candidatos.map((candidato) => (
                <tr key={candidato.id}>
                  <td className={styles.nameCell}>
                    <span className={styles.name}>{candidato.nome_completo || '-'}</span>
                  </td>
                  <td>{formatCPF(candidato.cpf)}</td>
                  <td>{candidato.email || '-'}</td>
                  <td>{candidato.telefone || '-'}</td>
                  <td>{candidato.cidade ? `${candidato.cidade}/${candidato.estado}` : '-'}</td>
                  <td>
                    <span className={`${styles.status} ${candidato.is_active !== false ? styles.active : styles.inactive}`}>
                      {candidato.is_active !== false ? (
                        <><UserCheck size={14} /> Ativo</>
                      ) : (
                        <><UserX size={14} /> Inativo</>
                      )}
                    </span>
                  </td>
                  <td>{formatDate(candidato.created_at)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEdit(candidato)}
                        className={styles.editButton}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(candidato.id)}
                        className={styles.deleteButton}
                        title="Desativar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={styles.pageButton}
          >
            <ChevronLeft size={18} />
            Anterior
          </button>
          <span className={styles.pageInfo}>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={styles.pageButton}
          >
            Próxima
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingCandidato && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Editar Candidato</h2>
              <button onClick={() => setShowModal(false)} className={styles.closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Nome Completo</label>
                  <input
                    type="text"
                    value={editingCandidato.nome_completo || ''}
                    onChange={(e) => setEditingCandidato({
                      ...editingCandidato,
                      nome_completo: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>CPF</label>
                  <input
                    type="text"
                    value={editingCandidato.cpf || ''}
                    onChange={(e) => setEditingCandidato({
                      ...editingCandidato,
                      cpf: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={editingCandidato.email || ''}
                    onChange={(e) => setEditingCandidato({
                      ...editingCandidato,
                      email: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={editingCandidato.telefone || ''}
                    onChange={(e) => setEditingCandidato({
                      ...editingCandidato,
                      telefone: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Data de Nascimento</label>
                  <input
                    type="date"
                    value={editingCandidato.data_nascimento?.split('T')[0] || ''}
                    onChange={(e) => setEditingCandidato({
                      ...editingCandidato,
                      data_nascimento: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Gênero</label>
                  <select
                    value={editingCandidato.genero || ''}
                    onChange={(e) => setEditingCandidato({
                      ...editingCandidato,
                      genero: e.target.value
                    })}
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                    <option value="prefiro_nao_informar">Prefiro não informar</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Cidade</label>
                  <input
                    type="text"
                    value={editingCandidato.cidade || ''}
                    onChange={(e) => setEditingCandidato({
                      ...editingCandidato,
                      cidade: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Estado</label>
                  <input
                    type="text"
                    value={editingCandidato.estado || ''}
                    onChange={(e) => setEditingCandidato({
                      ...editingCandidato,
                      estado: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Bairro</label>
                  <input
                    type="text"
                    value={editingCandidato.bairro || ''}
                    onChange={(e) => setEditingCandidato({
                      ...editingCandidato,
                      bairro: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>CEP</label>
                  <input
                    type="text"
                    value={editingCandidato.cep || ''}
                    onChange={(e) => setEditingCandidato({
                      ...editingCandidato,
                      cep: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select
                    value={editingCandidato.is_active !== false ? 'true' : 'false'}
                    onChange={(e) => setEditingCandidato({
                      ...editingCandidato,
                      is_active: e.target.value === 'true'
                    })}
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowModal(false)} className={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={handleSave} className={styles.saveButton} disabled={isSaving}>
                {isSaving ? 'Salvando...' : (
                  <>
                    <Save size={18} />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
