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
  Briefcase,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Pause,
  Building2,
  MapPin,
  DollarSign
} from 'lucide-react';
import styles from './page.module.css';

interface Vaga {
  id: string;
  empresa_id: string;
  titulo: string;
  descricao: string;
  requisitos: string;
  beneficios: string;
  salario_min: number;
  salario_max: number;
  tipo_contrato: string;
  modalidade: string;
  cidade: string;
  estado: string;
  quantidade_vagas: number;
  status: string;
  created_at: string;
  updated_at: string;
  empresas?: {
    id: string;
    razao_social: string;
    nome_fantasia: string;
  };
}

export default function AdminVagasPage() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingVaga, setEditingVaga] = useState<Vaga | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchVagas = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`/api/admin/vagas?${params}`);
      const data = await response.json();

      if (response.ok) {
        setVagas(data.vagas);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao buscar vagas' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchVagas();
  }, [fetchVagas]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchVagas();
  };

  const handleEdit = (vaga: Vaga) => {
    setEditingVaga({ ...vaga });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingVaga) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/vagas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingVaga)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Vaga atualizada com sucesso!' });
        setShowModal(false);
        fetchVagas();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao atualizar vaga' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar esta vaga?')) return;

    try {
      const response = await fetch(`/api/admin/vagas?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Vaga desativada com sucesso!' });
        fetchVagas();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao desativar vaga' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatSalary = (min: number, max: number) => {
    if (!min && !max) return 'A combinar';
    if (min && max) {
      return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
    }
    if (min) return `R$ ${min.toLocaleString('pt-BR')}`;
    return `Até R$ ${max.toLocaleString('pt-BR')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberta':
        return <CheckCircle2 size={14} />;
      case 'pausada':
        return <Pause size={14} />;
      case 'encerrada':
      case 'inativa':
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'aberta':
        return styles.statusOpen;
      case 'pausada':
        return styles.statusPaused;
      case 'encerrada':
      case 'inativa':
        return styles.statusClosed;
      default:
        return styles.statusPending;
    }
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
            <Briefcase size={28} className={styles.titleIcon} />
            <div>
              <h1 className={styles.title}>Gerenciar Vagas</h1>
              <p className={styles.subtitle}>{total} vagas cadastradas</p>
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

      {/* Search and Filters */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInputWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por título, descrição ou cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={styles.filterSelect}
          >
            <option value="">Todos os status</option>
            <option value="aberta">Abertas</option>
            <option value="pausada">Pausadas</option>
            <option value="encerrada">Encerradas</option>
            <option value="inativa">Inativas</option>
          </select>
          <button type="submit" className={styles.searchButton}>
            Buscar
          </button>
        </form>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : vagas.length === 0 ? (
          <div className={styles.empty}>
            <Briefcase size={48} />
            <p>Nenhuma vaga encontrada</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Vaga</th>
                <th>Empresa</th>
                <th>Localização</th>
                <th>Salário</th>
                <th>Vagas</th>
                <th>Status</th>
                <th>Publicação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vagas.map((vaga) => (
                <tr key={vaga.id}>
                  <td className={styles.nameCell}>
                    <span className={styles.name}>{vaga.titulo || '-'}</span>
                    <span className={styles.subtitle}>{vaga.tipo_contrato} • {vaga.modalidade}</span>
                  </td>
                  <td>
                    <div className={styles.empresaCell}>
                      <Building2 size={14} />
                      <span>{vaga.empresas?.nome_fantasia || vaga.empresas?.razao_social || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.locationCell}>
                      <MapPin size={14} />
                      <span>{vaga.cidade ? `${vaga.cidade}/${vaga.estado}` : '-'}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.salaryCell}>
                      <DollarSign size={14} />
                      <span>{formatSalary(vaga.salario_min, vaga.salario_max)}</span>
                    </div>
                  </td>
                  <td>{vaga.quantidade_vagas || 1}</td>
                  <td>
                    <span className={`${styles.status} ${getStatusClass(vaga.status)}`}>
                      {getStatusIcon(vaga.status)}
                      {vaga.status || 'pendente'}
                    </span>
                  </td>
                  <td>{formatDate(vaga.created_at)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEdit(vaga)}
                        className={styles.editButton}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(vaga.id)}
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
      {showModal && editingVaga && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Editar Vaga</h2>
              <button onClick={() => setShowModal(false)} className={styles.closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Título da Vaga</label>
                  <input
                    type="text"
                    value={editingVaga.titulo || ''}
                    onChange={(e) => setEditingVaga({
                      ...editingVaga,
                      titulo: e.target.value
                    })}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Descrição</label>
                  <textarea
                    value={editingVaga.descricao || ''}
                    onChange={(e) => setEditingVaga({
                      ...editingVaga,
                      descricao: e.target.value
                    })}
                    rows={4}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Requisitos</label>
                  <textarea
                    value={editingVaga.requisitos || ''}
                    onChange={(e) => setEditingVaga({
                      ...editingVaga,
                      requisitos: e.target.value
                    })}
                    rows={3}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Benefícios</label>
                  <textarea
                    value={editingVaga.beneficios || ''}
                    onChange={(e) => setEditingVaga({
                      ...editingVaga,
                      beneficios: e.target.value
                    })}
                    rows={3}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Salário Mínimo</label>
                  <input
                    type="number"
                    value={editingVaga.salario_min || ''}
                    onChange={(e) => setEditingVaga({
                      ...editingVaga,
                      salario_min: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Salário Máximo</label>
                  <input
                    type="number"
                    value={editingVaga.salario_max || ''}
                    onChange={(e) => setEditingVaga({
                      ...editingVaga,
                      salario_max: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Tipo de Contrato</label>
                  <select
                    value={editingVaga.tipo_contrato || ''}
                    onChange={(e) => setEditingVaga({
                      ...editingVaga,
                      tipo_contrato: e.target.value
                    })}
                  >
                    <option value="">Selecione</option>
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                    <option value="Estágio">Estágio</option>
                    <option value="Temporário">Temporário</option>
                    <option value="Freelancer">Freelancer</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Modalidade</label>
                  <select
                    value={editingVaga.modalidade || ''}
                    onChange={(e) => setEditingVaga({
                      ...editingVaga,
                      modalidade: e.target.value
                    })}
                  >
                    <option value="">Selecione</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Cidade</label>
                  <input
                    type="text"
                    value={editingVaga.cidade || ''}
                    onChange={(e) => setEditingVaga({
                      ...editingVaga,
                      cidade: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Estado</label>
                  <input
                    type="text"
                    value={editingVaga.estado || ''}
                    onChange={(e) => setEditingVaga({
                      ...editingVaga,
                      estado: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Quantidade de Vagas</label>
                  <input
                    type="number"
                    value={editingVaga.quantidade_vagas || 1}
                    onChange={(e) => setEditingVaga({
                      ...editingVaga,
                      quantidade_vagas: parseInt(e.target.value) || 1
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select
                    value={editingVaga.status || ''}
                    onChange={(e) => setEditingVaga({
                      ...editingVaga,
                      status: e.target.value
                    })}
                  >
                    <option value="aberta">Aberta</option>
                    <option value="pausada">Pausada</option>
                    <option value="encerrada">Encerrada</option>
                    <option value="inativa">Inativa</option>
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
