// Database types for Supabase
// These types represent the structure of the database tables

export interface User {
  user_id: string
  email: string
  password_hash: string
  user_role: number
  created_at: string
  updated_at: string
  is_active: boolean
  last_login: string | null
  email_verified_at: string | null
}

export interface TipoUsuario {
  id: number
  nome: string
}

export interface Candidato {
  user_id: string
  nome_completo: string
  cpf: string
  genero: string | null
  etnia: string | null
  telefone: string | null
  cep: string | null
  rua: string | null
  numero: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  email: string | null
}

export interface Empresa {
  id: string
  razao_social: string
  nome_fantasia: string | null
  cnpj: string
  ramo_atuacao_id: number | null
  porte_id: number | null
  descricao: string | null
  telefone_contato: string | null
  email_contato: string | null
  cep: string | null
  rua: string | null
  numero: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  site_url: string | null
  logo_url: string | null
  banner_url: string | null
  created_at: string
  updated_at: string
  user_id: string | null
}

export interface Vaga {
  id: string
  empresa_id: string
  titulo: string
  descricao: string | null
  requisitos: string | null
  beneficios: string | null
  salario_min: number | null
  salario_max: number | null
  tipo_contrato_id: number | null
  modelo_trabalho_id: number | null
  area_id: number | null
  cidade: string | null
  estado: string | null
  quantidade_vagas: number
  data_publicacao: string
  data_expiracao: string | null
  status: string
  created_at: string
  updated_at: string
  user_id_criador: string | null
}

export interface Candidatura {
  id: string
  vaga_id: string
  candidato_id: string
  data_candidatura: string
  status_candidatura_id: number
  feedback_empresa: string | null
}

export interface Curriculo {
  id: string
  candidato_id: string
  titulo_profissional: string | null
  resumo_profissional: string | null
  escolaridade_nivel_id: number | null
  modelo_trabalho_id: number | null
  tipo_contrato_id: number | null
  pretensao_salarial: number | null
  possui_cnh: boolean | null
  eh_pcd: boolean | null
  disponibilidade_viagens: boolean | null
  perfil_detalhado: Record<string, unknown> | null
  linkedin_url: string | null
  github_url: string | null
  portfolio_url: string | null
  created_at: string
  updated_at: string
}

export interface ExperienciaProfissional {
  id: string
  curriculo_id: string
  empresa: string
  cargo: string
  tipo_contrato_id: number | null
  ultimo_salario: number | null
  data_inicio: string
  data_fim: string | null
  descricao_atribuicoes: string | null
  created_at: string
  updated_at: string
}

export interface FormacaoAcademica {
  id: string
  curriculo_id: string
  instituicao: string
  nome_curso: string
  area_estudo: string | null
  nivel_escolaridade_id: number
  data_inicio: string | null
  data_fim: string | null
  created_at: string
  updated_at: string
}

export interface Curso {
  id: string
  nome_curso: string
  descricao_curso: string | null
  o_que_aprendera: string | null
  requisitos: string | null
  publico_alvo: string | null
  carga_horaria_horas: number | null
  area_id: number | null
  created_at: string
  updated_at: string
}

export interface OfertaCurso {
  id: string
  curso_id: string
  instituicao_id: string
  modalidade_id: number | null
  cidade: string | null
  estado: string | null
  vagas_disponiveis: number | null
  data_inicio: string | null
  data_fim: string | null
  link_inscricao: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface Edital {
  id: string
  numero_edital: string
  titulo: string
  descricao_completa: string | null
  data_inicio_inscricoes: string | null
  data_fim_inscricoes: string | null
  status_id: number
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

// Lookup tables
export interface AreaVaga {
  id: number
  nome: string
}

export interface Habilidade {
  id: number
  nome: string
}

export interface NivelEscolaridade {
  id: number
  nome: string
}

export interface ModeloTrabalho {
  id: number
  nome: string
}

export interface TipoContrato {
  id: number
  nome: string
}

export interface PorteEmpresa {
  id: number
  nome: string
}

export interface RamoAtuacao {
  id: number
  nome: string
}

export interface StatusCandidatura {
  id: number
  nome: string
}

export interface StatusEdital {
  id: number
  nome: string
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    nome_completo?: string
    tipo_usuario?: number
  }
}

export interface SignUpData {
  email: string
  password: string
  nome_completo: string
  cpf?: string
  telefone?: string
}

export interface SignInData {
  email: string
  password: string
}
