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
  Building2,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import styles from './page.module.css';

interface Empresa {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  bairro: string;
  cep: string;
  endereco: string;
  numero: string;
  ramo_atividade: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminEmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchEmpresas = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      });

      const response = await fetch(`/api/admin/empresas?${params}`);
      const data = await response.json();

      if (response.ok) {
        setEmpresas(data.empresas);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao buscar empresas' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchEmpresas();
  };

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresa({ ...empresa });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingEmpresa) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/empresas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEmpresa)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Empresa atualizada com sucesso!' });
        setShowModal(false);
        fetchEmpresas();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao atualizar empresa' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar esta empresa?')) return;

    try {
      const response = await fetch(`/api/admin/empresas?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Empresa desativada com sucesso!' });
        fetchEmpresas();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao desativar empresa' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return '-';
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
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
            <Building2 size={28} className={styles.titleIcon} />
            <div>
              <h1 className={styles.title}>Gerenciar Empresas</h1>
              <p className={styles.subtitle}>{total} empresas cadastradas</p>
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
              placeholder="Buscar por razão social, nome fantasia, CNPJ ou e-mail..."
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
        ) : empresas.length === 0 ? (
          <div className={styles.empty}>
            <Building2 size={48} />
            <p>Nenhuma empresa encontrada</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>CNPJ</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>Status</th>
                <th>Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.id}>
                  <td className={styles.nameCell}>
                    <span className={styles.name}>{empresa.nome_fantasia || empresa.razao_social || '-'}</span>
                    {empresa.nome_fantasia && empresa.razao_social && (
                      <span className={styles.razaoSocial}>{empresa.razao_social}</span>
                    )}
                  </td>
                  <td>{formatCNPJ(empresa.cnpj)}</td>
                  <td>{empresa.email || '-'}</td>
                  <td>{empresa.telefone || '-'}</td>
                  <td>{empresa.cidade ? `${empresa.cidade}/${empresa.estado}` : '-'}</td>
                  <td>
                    <span className={`${styles.status} ${empresa.is_active !== false ? styles.active : styles.inactive}`}>
                      {empresa.is_active !== false ? (
                        <><CheckCircle2 size={14} /> Ativa</>
                      ) : (
                        <><XCircle size={14} /> Inativa</>
                      )}
                    </span>
                  </td>
                  <td>{formatDate(empresa.created_at)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEdit(empresa)}
                        className={styles.editButton}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(empresa.id)}
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
      {showModal && editingEmpresa && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Editar Empresa</h2>
              <button onClick={() => setShowModal(false)} className={styles.closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Razão Social</label>
                  <input
                    type="text"
                    value={editingEmpresa.razao_social || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      razao_social: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Nome Fantasia</label>
                  <input
                    type="text"
                    value={editingEmpresa.nome_fantasia || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      nome_fantasia: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>CNPJ</label>
                  <input
                    type="text"
                    value={editingEmpresa.cnpj || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      cnpj: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={editingEmpresa.email || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      email: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={editingEmpresa.telefone || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      telefone: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Ramo de Atividade</label>
                  <input
                    type="text"
                    value={editingEmpresa.ramo_atividade || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      ramo_atividade: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>CEP</label>
                  <input
                    type="text"
                    value={editingEmpresa.cep || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      cep: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Endereço</label>
                  <input
                    type="text"
                    value={editingEmpresa.endereco || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      endereco: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Número</label>
                  <input
                    type="text"
                    value={editingEmpresa.numero || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      numero: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Bairro</label>
                  <input
                    type="text"
                    value={editingEmpresa.bairro || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      bairro: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Cidade</label>
                  <input
                    type="text"
                    value={editingEmpresa.cidade || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      cidade: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Estado</label>
                  <input
                    type="text"
                    value={editingEmpresa.estado || ''}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      estado: e.target.value
                    })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select
                    value={editingEmpresa.is_active !== false ? 'true' : 'false'}
                    onChange={(e) => setEditingEmpresa({
                      ...editingEmpresa,
                      is_active: e.target.value === 'true'
                    })}
                  >
                    <option value="true">Ativa</option>
                    <option value="false">Inativa</option>
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
