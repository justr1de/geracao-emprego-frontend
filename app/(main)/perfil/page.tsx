'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Shield, Award, ThumbsUp, ThumbsDown, User, Briefcase, GraduationCap, Star, Bell, Lock, FileText } from 'lucide-react';
import { useAuthContext as useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';

interface Experiencia {
  id: string;
  cargo: string;
  empresa: string;
  dataInicio: string;
  dataFim: string;
  atual: boolean;
  descricao: string;
}

interface Formacao {
  id: string;
  curso: string;
  instituicao: string;
  nivel: string;
  dataInicio: string;
  dataConclusao: string;
  emAndamento: boolean;
}

interface Habilidade {
  id: string;
  nome: string;
  nivel: 'basico' | 'intermediario' | 'avancado';
}

interface Certificado {
  id: string;
  nome: string;
  instituicao: string;
  dataEmissao: string;
  cargaHoraria: string;
  arquivo: string | null;
  arquivoNome: string | null;
}

interface PerfilData {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  genero: string;
  foto: string | null;
  curriculo: string | null;
  curriculoNome: string | null;
  sobre: string;
  pretensaoSalarial: string;
  disponibilidade: string;
  cidade: string;
  estado: string;
  experiencias: Experiencia[];
  formacoes: Formacao[];
  habilidades: Habilidade[];
  certificados: Certificado[];
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dados';
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const curriculoInputRef = useRef<HTMLInputElement>(null);
  
  const [perfil, setPerfil] = useState<PerfilData>({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    genero: '',
    foto: null,
    curriculo: null,
    curriculoNome: null,
    sobre: '',
    pretensaoSalarial: '',
    disponibilidade: 'imediata',
    cidade: '',
    estado: 'RO',
    experiencias: [],
    formacoes: [],
    habilidades: [],
    certificados: [],
  });

  // Carregar dados do perfil
  useEffect(() => {
    const loadPerfil = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/candidatos/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setPerfil(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      loadPerfil();
    }
  }, [user, authLoading]);

  // Salvar perfil
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/candidatos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfil),
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Perfil salvo com sucesso!' });
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar perfil. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  };

  // Upload de foto
  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'A foto deve ter no máximo 2MB' });
      return;
    }
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage({ type: 'error', text: 'Formato inválido. Use JPG, PNG ou WebP' });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPerfil(prev => ({ ...prev, foto: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Upload de currículo
  const handleCurriculoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'O currículo deve ter no máximo 5MB' });
      return;
    }
    
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setMessage({ type: 'error', text: 'Formato inválido. Use PDF ou Word' });
      return;
    }
    
    setPerfil(prev => ({ ...prev, curriculoNome: file.name }));
    setMessage({ type: 'success', text: 'Currículo carregado com sucesso!' });
  };

  // Funções para experiências
  const addExperiencia = () => {
    setPerfil(prev => ({
      ...prev,
      experiencias: [...prev.experiencias, {
        id: `exp-${Date.now()}`,
        cargo: '',
        empresa: '',
        dataInicio: '',
        dataFim: '',
        atual: false,
        descricao: '',
      }],
    }));
  };

  const removeExperiencia = (id: string) => {
    setPerfil(prev => ({
      ...prev,
      experiencias: prev.experiencias.filter(exp => exp.id !== id),
    }));
  };

  const updateExperiencia = (id: string, field: keyof Experiencia, value: string | boolean) => {
    setPerfil(prev => ({
      ...prev,
      experiencias: prev.experiencias.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  // Funções para formações
  const addFormacao = () => {
    setPerfil(prev => ({
      ...prev,
      formacoes: [...prev.formacoes, {
        id: `form-${Date.now()}`,
        curso: '',
        instituicao: '',
        nivel: 'medio',
        dataInicio: '',
        dataConclusao: '',
        emAndamento: false,
      }],
    }));
  };

  const removeFormacao = (id: string) => {
    setPerfil(prev => ({
      ...prev,
      formacoes: prev.formacoes.filter(form => form.id !== id),
    }));
  };

  const updateFormacao = (id: string, field: keyof Formacao, value: string | boolean) => {
    setPerfil(prev => ({
      ...prev,
      formacoes: prev.formacoes.map(form =>
        form.id === id ? { ...form, [field]: value } : form
      ),
    }));
  };

  // Funções para habilidades
  const addHabilidade = (nome?: string) => {
    if (nome && perfil.habilidades.find(h => h.nome === nome)) return;
    setPerfil(prev => ({
      ...prev,
      habilidades: [...prev.habilidades, {
        id: `hab-${Date.now()}`,
        nome: nome || '',
        nivel: 'intermediario',
      }],
    }));
  };

  const removeHabilidade = (id: string) => {
    setPerfil(prev => ({
      ...prev,
      habilidades: prev.habilidades.filter(hab => hab.id !== id),
    }));
  };

  const updateHabilidade = (id: string, field: keyof Habilidade, value: string) => {
    setPerfil(prev => ({
      ...prev,
      habilidades: prev.habilidades.map(hab =>
        hab.id === id ? { ...hab, [field]: value } : hab
      ),
    }));
  };

  // Funções para certificados
  const addCertificado = () => {
    setPerfil(prev => ({
      ...prev,
      certificados: [...prev.certificados, {
        id: `cert-${Date.now()}`,
        nome: '',
        instituicao: '',
        dataEmissao: '',
        cargaHoraria: '',
        arquivo: null,
        arquivoNome: null,
      }],
    }));
  };

  const removeCertificado = (id: string) => {
    setPerfil(prev => ({
      ...prev,
      certificados: prev.certificados.filter(cert => cert.id !== id),
    }));
  };

  const updateCertificado = (id: string, field: keyof Certificado, value: string | null) => {
    setPerfil(prev => ({
      ...prev,
      certificados: prev.certificados.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  };

  const handleCertificadoUpload = async (id: string, file: File) => {
    // Validar tipo de arquivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Tipo de arquivo não permitido. Use PDF, JPG ou PNG.' });
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Arquivo muito grande. Máximo 5MB.' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo', 'certificado');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateCertificado(id, 'arquivo', data.url);
        updateCertificado(id, 'arquivoNome', file.name);
        setMessage({ type: 'success', text: 'Certificado enviado com sucesso!' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao enviar certificado.' });
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setMessage({ type: 'error', text: 'Erro ao enviar certificado.' });
    }
  };

  // Calcular completude do perfil
  const calculateCompletude = (): number => {
    let total = 0;
    let preenchido = 0;
    
    const camposBasicos = ['nome', 'sobrenome', 'email', 'telefone', 'cidade', 'sobre'];
    total += camposBasicos.length * 4;
    camposBasicos.forEach(campo => {
      if (perfil[campo as keyof PerfilData]) preenchido += 4;
    });
    
    total += 20;
    if (perfil.curriculoNome) preenchido += 20;
    
    total += 20;
    if (perfil.experiencias.length > 0) preenchido += 20;
    
    total += 10;
    if (perfil.formacoes.length > 0) preenchido += 10;
    
    total += 10;
    if (perfil.habilidades.length >= 3) preenchido += 10;
    else if (perfil.habilidades.length > 0) preenchido += 5;
    
    return Math.round((preenchido / total) * 100);
  };

  if (authLoading || loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.notLogged}>
        <User size={48} />
        <h2>Acesso Restrito</h2>
        <p>Você precisa estar logado para acessar seu perfil.</p>
        <Link href="/login" className={styles.loginButton}>
          Fazer Login
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header do Perfil */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <div 
            className={styles.avatar}
            onClick={() => fotoInputRef.current?.click()}
            style={{ cursor: 'pointer' }}
          >
            {perfil.foto ? (
              <Image src={perfil.foto} alt="Foto" width={100} height={100} />
            ) : (
              <span>{perfil.nome?.[0] || 'U'}{perfil.sobrenome?.[0] || ''}</span>
            )}
          </div>
          <input
            ref={fotoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFotoUpload}
            style={{ display: 'none' }}
          />
          <div className={styles.badges}>
            <div className={styles.badge} title="Perfil Verificado">
              <Shield size={16} />
              <span>Verificado</span>
            </div>
          </div>
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>{perfil.nome} {perfil.sobrenome}</h1>
          <p className={styles.profileLocation}>{perfil.cidade}, {perfil.estado}</p>
          <div className={styles.completude}>
            <span>Perfil {calculateCompletude()}% completo</span>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: `${calculateCompletude()}%` }}></div>
            </div>
          </div>
        </div>
        <div className={styles.curriculoSection}>
          <FileText size={24} />
          {perfil.curriculoNome ? (
            <div>
              <p className={styles.curriculoNome}>{perfil.curriculoNome}</p>
              <button onClick={() => curriculoInputRef.current?.click()}>Substituir</button>
            </div>
          ) : (
            <button onClick={() => curriculoInputRef.current?.click()}>
              Enviar Currículo
            </button>
          )}
          <input
            ref={curriculoInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleCurriculoUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {/* Tabs de navegação */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'dados' ? styles.active : ''}`}
          onClick={() => setActiveTab('dados')}
        >
          <User size={18} /> Dados Pessoais
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'experiencia' ? styles.active : ''}`}
          onClick={() => setActiveTab('experiencia')}
        >
          <Briefcase size={18} /> Experiência
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'formacao' ? styles.active : ''}`}
          onClick={() => setActiveTab('formacao')}
        >
          <GraduationCap size={18} /> Formação
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'habilidades' ? styles.active : ''}`}
          onClick={() => setActiveTab('habilidades')}
        >
          <Star size={18} /> Habilidades
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'certificados' ? styles.active : ''}`}
          onClick={() => setActiveTab('certificados')}
        >
          <Award size={18} /> Certificados
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'security' ? styles.active : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Lock size={18} /> Segurança
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'notifications' ? styles.active : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={18} /> Notificações
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      <div className={styles.content}>
        {/* Tab Dados Pessoais */}
        {activeTab === 'dados' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações Pessoais</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Nome</label>
                <input
                  type="text"
                  value={perfil.nome}
                  onChange={(e) => setPerfil(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Sobrenome</label>
                <input
                  type="text"
                  value={perfil.sobrenome}
                  onChange={(e) => setPerfil(prev => ({ ...prev, sobrenome: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label>E-mail</label>
                <input
                  type="email"
                  value={perfil.email}
                  onChange={(e) => setPerfil(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Telefone</label>
                <input
                  type="tel"
                  value={perfil.telefone}
                  onChange={(e) => setPerfil(prev => ({ ...prev, telefone: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label>CPF</label>
                <input type="text" value={perfil.cpf} disabled className={styles.disabled} />
              </div>
              <div className={styles.formGroup}>
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  value={perfil.dataNascimento}
                  onChange={(e) => setPerfil(prev => ({ ...prev, dataNascimento: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Cidade</label>
                <input
                  type="text"
                  value={perfil.cidade}
                  onChange={(e) => setPerfil(prev => ({ ...prev, cidade: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Estado</label>
                <select
                  value={perfil.estado}
                  onChange={(e) => setPerfil(prev => ({ ...prev, estado: e.target.value }))}
                >
                  <option value="RO">Rondônia</option>
                  <option value="AC">Acre</option>
                  <option value="AM">Amazonas</option>
                  <option value="MT">Mato Grosso</option>
                </select>
              </div>
            </div>
            <div className={styles.formGroup + ' ' + styles.fullWidth}>
              <label>Sobre mim</label>
              <textarea
                value={perfil.sobre}
                onChange={(e) => setPerfil(prev => ({ ...prev, sobre: e.target.value }))}
                placeholder="Conte um pouco sobre você..."
                rows={4}
              />
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Pretensão Salarial</label>
                <input
                  type="text"
                  value={perfil.pretensaoSalarial}
                  onChange={(e) => setPerfil(prev => ({ ...prev, pretensaoSalarial: e.target.value }))}
                  placeholder="Ex: R$ 2.000,00"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Disponibilidade</label>
                <select
                  value={perfil.disponibilidade}
                  onChange={(e) => setPerfil(prev => ({ ...prev, disponibilidade: e.target.value }))}
                >
                  <option value="imediata">Imediata</option>
                  <option value="15dias">15 dias</option>
                  <option value="30dias">30 dias</option>
                  <option value="negociar">A negociar</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab Experiência */}
        {activeTab === 'experiencia' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Experiências Profissionais</h2>
              <button className={styles.addButton} onClick={addExperiencia}>
                + Adicionar
              </button>
            </div>
            {perfil.experiencias.length === 0 ? (
              <div className={styles.emptyState}>
                <Briefcase size={48} />
                <p>Nenhuma experiência cadastrada</p>
                <button onClick={addExperiencia}>Adicionar primeira experiência</button>
              </div>
            ) : (
              perfil.experiencias.map((exp) => (
                <div key={exp.id} className={styles.itemCard}>
                  <button className={styles.removeBtn} onClick={() => removeExperiencia(exp.id)}>✕</button>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Cargo</label>
                      <input
                        type="text"
                        value={exp.cargo}
                        onChange={(e) => updateExperiencia(exp.id, 'cargo', e.target.value)}
                        placeholder="Ex: Auxiliar Administrativo"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Empresa</label>
                      <input
                        type="text"
                        value={exp.empresa}
                        onChange={(e) => updateExperiencia(exp.id, 'empresa', e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Início</label>
                      <input
                        type="month"
                        value={exp.dataInicio}
                        onChange={(e) => updateExperiencia(exp.id, 'dataInicio', e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Término</label>
                      <input
                        type="month"
                        value={exp.dataFim}
                        onChange={(e) => updateExperiencia(exp.id, 'dataFim', e.target.value)}
                        disabled={exp.atual}
                      />
                    </div>
                  </div>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={exp.atual}
                      onChange={(e) => updateExperiencia(exp.id, 'atual', e.target.checked)}
                    />
                    Trabalho atual
                  </label>
                  <div className={styles.formGroup}>
                    <label>Descrição</label>
                    <textarea
                      value={exp.descricao}
                      onChange={(e) => updateExperiencia(exp.id, 'descricao', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Formação */}
        {activeTab === 'formacao' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Formação Acadêmica</h2>
              <button className={styles.addButton} onClick={addFormacao}>
                + Adicionar
              </button>
            </div>
            {perfil.formacoes.length === 0 ? (
              <div className={styles.emptyState}>
                <GraduationCap size={48} />
                <p>Nenhuma formação cadastrada</p>
                <button onClick={addFormacao}>Adicionar primeira formação</button>
              </div>
            ) : (
              perfil.formacoes.map((form) => (
                <div key={form.id} className={styles.itemCard}>
                  <button className={styles.removeBtn} onClick={() => removeFormacao(form.id)}>✕</button>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Curso</label>
                      <input
                        type="text"
                        value={form.curso}
                        onChange={(e) => updateFormacao(form.id, 'curso', e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Instituição</label>
                      <input
                        type="text"
                        value={form.instituicao}
                        onChange={(e) => updateFormacao(form.id, 'instituicao', e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Nível</label>
                      <select
                        value={form.nivel}
                        onChange={(e) => updateFormacao(form.id, 'nivel', e.target.value)}
                      >
                        <option value="fundamental">Fundamental</option>
                        <option value="medio">Médio</option>
                        <option value="tecnico">Técnico</option>
                        <option value="superior">Superior</option>
                        <option value="pos">Pós-Graduação</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Conclusão</label>
                      <input
                        type="number"
                        value={form.dataConclusao}
                        onChange={(e) => updateFormacao(form.id, 'dataConclusao', e.target.value)}
                        disabled={form.emAndamento}
                        placeholder="2025"
                      />
                    </div>
                  </div>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={form.emAndamento}
                      onChange={(e) => updateFormacao(form.id, 'emAndamento', e.target.checked)}
                    />
                    Em andamento
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Habilidades */}
        {activeTab === 'habilidades' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Habilidades</h2>
              <button className={styles.addButton} onClick={() => addHabilidade()}>
                + Adicionar
              </button>
            </div>
            <div className={styles.habilidadesGrid}>
              {perfil.habilidades.map((hab) => (
                <div key={hab.id} className={styles.habilidadeCard}>
                  <button className={styles.removeBtn} onClick={() => removeHabilidade(hab.id)}>✕</button>
                  <input
                    type="text"
                    value={hab.nome}
                    onChange={(e) => updateHabilidade(hab.id, 'nome', e.target.value)}
                    placeholder="Nome da habilidade"
                  />
                  <select
                    value={hab.nivel}
                    onChange={(e) => updateHabilidade(hab.id, 'nivel', e.target.value)}
                  >
                    <option value="basico">Básico</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              ))}
            </div>
            <div className={styles.sugestoes}>
              <h4>Sugestões:</h4>
              <div className={styles.tags}>
                {['Pacote Office', 'Atendimento ao Cliente', 'Trabalho em Equipe', 'Comunicação', 'Organização', 'Proatividade', 'Informática', 'Vendas'].map((s) => (
                  <button key={s} onClick={() => addHabilidade(s)} className={styles.tagBtn}>
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Certificados */}
        {activeTab === 'certificados' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Meus Certificados</h2>
              <button onClick={addCertificado} className={styles.addBtn}>
                + Adicionar Certificado
              </button>
            </div>
            <p className={styles.sectionDescription}>
              Adicione certificados de cursos, oficinas, eventos ou qualquer capacitação que possa melhorar suas chances de conseguir um emprego.
            </p>

            {perfil.certificados.length === 0 ? (
              <div className={styles.emptyState}>
                <Award size={48} className={styles.emptyIcon} />
                <p>Você ainda não adicionou nenhum certificado.</p>
                <p className={styles.emptyHint}>Certificados de cursos e capacitações aumentam suas chances de ser contratado!</p>
                <button onClick={addCertificado} className={styles.addBtnLarge}>
                  Adicionar meu primeiro certificado
                </button>
              </div>
            ) : (
              <div className={styles.certificadosList}>
                {perfil.certificados.map((cert, index) => (
                  <div key={cert.id} className={styles.certificadoCard}>
                    <div className={styles.certificadoHeader}>
                      <span className={styles.certificadoNumber}>Certificado {index + 1}</span>
                      <button
                        onClick={() => removeCertificado(cert.id)}
                        className={styles.removeBtn}
                        title="Remover certificado"
                      >
                        ×
                      </button>
                    </div>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Nome do Curso/Evento *</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={cert.nome}
                          onChange={(e) => updateCertificado(cert.id, 'nome', e.target.value)}
                          placeholder="Ex: Curso de Excel Avançado"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Instituição Emissora *</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={cert.instituicao}
                          onChange={(e) => updateCertificado(cert.id, 'instituicao', e.target.value)}
                          placeholder="Ex: SENAI, SEBRAE, etc."
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Data de Emissão *</label>
                        <input
                          type="date"
                          className={styles.input}
                          value={cert.dataEmissao}
                          onChange={(e) => updateCertificado(cert.id, 'dataEmissao', e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Carga Horária</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={cert.cargaHoraria}
                          onChange={(e) => updateCertificado(cert.id, 'cargaHoraria', e.target.value)}
                          placeholder="Ex: 40 horas"
                        />
                      </div>
                    </div>
                    <div className={styles.uploadSection}>
                      <label className={styles.label}>Arquivo do Certificado (PDF ou Imagem)</label>
                      {cert.arquivoNome ? (
                        <div className={styles.uploadedFile}>
                          <FileText size={20} />
                          <span>{cert.arquivoNome}</span>
                          <a href={cert.arquivo || '#'} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
                            Visualizar
                          </a>
                          <button
                            onClick={() => {
                              updateCertificado(cert.id, 'arquivo', null);
                              updateCertificado(cert.id, 'arquivoNome', null);
                            }}
                            className={styles.removeFileBtn}
                          >
                            Remover
                          </button>
                        </div>
                      ) : (
                        <div className={styles.uploadArea}>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCertificadoUpload(cert.id, file);
                            }}
                            className={styles.fileInput}
                            id={`cert-file-${cert.id}`}
                          />
                          <label htmlFor={`cert-file-${cert.id}`} className={styles.uploadLabel}>
                            <FileText size={24} />
                            <span>Clique para enviar ou arraste o arquivo</span>
                            <span className={styles.uploadHint}>PDF, JPG ou PNG (máx. 5MB)</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Segurança */}
        {activeTab === 'security' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Histórico de Segurança</h2>
            <div className={styles.securityTable}>
              <div className={styles.tableHeader}>
                <span>Data/Hora</span>
                <span>IP</span>
                <span>Dispositivo</span>
                <span>Local</span>
              </div>
              {[
                { date: '23/12/2025 14:35', ip: '192.168.1.100', device: 'Chrome - Windows', location: 'Porto Velho, RO' },
                { date: '22/12/2025 09:12', ip: '192.168.1.100', device: 'Chrome - Windows', location: 'Porto Velho, RO' },
              ].map((log, i) => (
                <div key={i} className={styles.tableRow}>
                  <span>{log.date}</span>
                  <span className={styles.mono}>{log.ip}</span>
                  <span>{log.device}</span>
                  <span>{log.location}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Notificações */}
        {activeTab === 'notifications' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Preferências de Notificação</h2>
            <div className={styles.notificationSettings}>
              <label className={styles.notificationOption}>
                <input type="checkbox" defaultChecked />
                <div>
                  <strong>E-mail</strong>
                  <p>Receber notificações por e-mail</p>
                </div>
              </label>
              <label className={styles.notificationOption}>
                <input type="checkbox" defaultChecked />
                <div>
                  <strong>SMS/WhatsApp</strong>
                  <p>Receber notificações por SMS ou WhatsApp</p>
                </div>
              </label>
              <label className={styles.notificationOption}>
                <input type="checkbox" defaultChecked />
                <div>
                  <strong>Push</strong>
                  <p>Receber notificações push no navegador</p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Botão Salvar */}
      <div className={styles.actions}>
        <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <Suspense fallback={<div className={styles.loading}><div className={styles.spinner}></div><p>Carregando...</p></div>}>
      <ProfileContent />
    </Suspense>
  );
}
