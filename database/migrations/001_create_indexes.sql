-- =====================================================
-- SCRIPT DE INDEXAÇÃO ESTRATÉGICA - GERAÇÃO EMPREGO
-- =====================================================
-- Este script cria índices otimizados para melhorar a
-- performance das consultas com 200.000+ candidatos
-- e 1.000+ empresas.
-- =====================================================
-- Data: 29/12/2025
-- Autor: DATA-RO Inteligência Territorial
-- =====================================================

-- =====================================================
-- 1. ÍNDICES PARA TABELA CANDIDATOS
-- =====================================================

-- Índice para busca por CPF (validação e login)
CREATE INDEX IF NOT EXISTS idx_candidatos_cpf 
ON public.candidatos (cpf);

-- Índice para busca por email
CREATE INDEX IF NOT EXISTS idx_candidatos_email 
ON public.candidatos (email);

-- Índice para busca por telefone
CREATE INDEX IF NOT EXISTS idx_candidatos_telefone 
ON public.candidatos (telefone);

-- Índice para filtro por cidade (muito usado em matching)
CREATE INDEX IF NOT EXISTS idx_candidatos_cidade 
ON public.candidatos (cidade);

-- Índice para filtro por estado
CREATE INDEX IF NOT EXISTS idx_candidatos_estado 
ON public.candidatos (estado);

-- Índice composto para filtros combinados de localização
CREATE INDEX IF NOT EXISTS idx_candidatos_cidade_estado 
ON public.candidatos (cidade, estado);

-- Índice para filtro de PCD
CREATE INDEX IF NOT EXISTS idx_candidatos_eh_pcd 
ON public.candidatos (eh_pcd) WHERE eh_pcd = true;

-- Índice para filtro de CNH
CREATE INDEX IF NOT EXISTS idx_candidatos_possui_cnh 
ON public.candidatos (possui_cnh) WHERE possui_cnh = true;

-- Índice para filtro de veículo próprio
CREATE INDEX IF NOT EXISTS idx_candidatos_veiculo_proprio 
ON public.candidatos (veiculo_proprio) WHERE veiculo_proprio = true;

-- Índice GIN para busca textual no nome (full-text search)
CREATE INDEX IF NOT EXISTS idx_candidatos_nome_gin 
ON public.candidatos USING gin (to_tsvector('portuguese', nome_completo));

-- Índice para ordenação por nome
CREATE INDEX IF NOT EXISTS idx_candidatos_nome_completo 
ON public.candidatos (nome_completo);

-- =====================================================
-- 2. ÍNDICES PARA TABELA EMPRESAS
-- =====================================================

-- Índice para busca por CNPJ (validação e login)
CREATE INDEX IF NOT EXISTS idx_empresas_cnpj 
ON public.empresas (cnpj);

-- Índice para busca por email
CREATE INDEX IF NOT EXISTS idx_empresas_email_contato 
ON public.empresas (email_contato);

-- Índice para filtro por cidade
CREATE INDEX IF NOT EXISTS idx_empresas_cidade 
ON public.empresas (cidade);

-- Índice para filtro por estado
CREATE INDEX IF NOT EXISTS idx_empresas_estado 
ON public.empresas (estado);

-- Índice para filtro por ramo de atuação
CREATE INDEX IF NOT EXISTS idx_empresas_ramo_atuacao_id 
ON public.empresas (ramo_atuacao_id);

-- Índice composto para filtros combinados
CREATE INDEX IF NOT EXISTS idx_empresas_cidade_ramo 
ON public.empresas (cidade, ramo_atuacao_id);

-- Índice para filtro de empresas ativas
CREATE INDEX IF NOT EXISTS idx_empresas_is_active 
ON public.empresas (is_active) WHERE is_active = true;

-- Índice para relacionamento com user_id
CREATE INDEX IF NOT EXISTS idx_empresas_user_id 
ON public.empresas (user_id);

-- Índice para ordenação por data de criação
CREATE INDEX IF NOT EXISTS idx_empresas_created_at 
ON public.empresas (created_at DESC);

-- Índice GIN para busca textual na razão social
CREATE INDEX IF NOT EXISTS idx_empresas_razao_social_gin 
ON public.empresas USING gin (to_tsvector('portuguese', razao_social));

-- Índice GIN para busca textual no nome fantasia
CREATE INDEX IF NOT EXISTS idx_empresas_nome_fantasia_gin 
ON public.empresas USING gin (to_tsvector('portuguese', nome_fantasia));

-- =====================================================
-- 3. ÍNDICES PARA TABELA VAGAS
-- =====================================================

-- Índice para relacionamento com empresa (JOIN frequente)
CREATE INDEX IF NOT EXISTS idx_vagas_empresa_id 
ON public.vagas (empresa_id);

-- Índice para filtro por status
CREATE INDEX IF NOT EXISTS idx_vagas_status_id 
ON public.vagas (status_id);

-- Índice composto para empresa + status (consulta muito comum)
CREATE INDEX IF NOT EXISTS idx_vagas_empresa_status 
ON public.vagas (empresa_id, status_id);

-- Índice para filtro por área
CREATE INDEX IF NOT EXISTS idx_vagas_area_id 
ON public.vagas (area_id);

-- Índice para filtro de vagas PCD
CREATE INDEX IF NOT EXISTS idx_vagas_vaga_pcd 
ON public.vagas (vaga_pcd) WHERE vaga_pcd = true;

-- Índice para ordenação por data de criação
CREATE INDEX IF NOT EXISTS idx_vagas_created_at 
ON public.vagas (created_at DESC);

-- Índice composto para listagem de vagas abertas ordenadas
CREATE INDEX IF NOT EXISTS idx_vagas_status_created 
ON public.vagas (status_id, created_at DESC);

-- Índice GIN para busca textual no cargo
CREATE INDEX IF NOT EXISTS idx_vagas_cargo_gin 
ON public.vagas USING gin (to_tsvector('portuguese', cargo));

-- Índice GIN para busca textual na descrição
CREATE INDEX IF NOT EXISTS idx_vagas_descricao_gin 
ON public.vagas USING gin (to_tsvector('portuguese', descricao));

-- =====================================================
-- 4. ÍNDICES PARA TABELA CANDIDATURAS
-- =====================================================

-- Índice para relacionamento com candidato
CREATE INDEX IF NOT EXISTS idx_candidaturas_candidato_id 
ON public.candidaturas (candidato_id);

-- Índice para relacionamento com vaga
CREATE INDEX IF NOT EXISTS idx_candidaturas_vaga_id 
ON public.candidaturas (vaga_id);

-- Índice composto para verificar se candidato já aplicou para vaga
CREATE INDEX IF NOT EXISTS idx_candidaturas_candidato_vaga 
ON public.candidaturas (candidato_id, vaga_id);

-- Índice para filtro por status
CREATE INDEX IF NOT EXISTS idx_candidaturas_status_id 
ON public.candidaturas (status_id);

-- Índice para ordenação por data
CREATE INDEX IF NOT EXISTS idx_candidaturas_created_at 
ON public.candidaturas (created_at DESC);

-- Índice composto para listagem de candidaturas por candidato ordenadas
CREATE INDEX IF NOT EXISTS idx_candidaturas_candidato_created 
ON public.candidaturas (candidato_id, created_at DESC);

-- =====================================================
-- 5. ÍNDICES PARA TABELA NOTIFICAÇÕES
-- =====================================================

-- Índice para filtro por usuário
CREATE INDEX IF NOT EXISTS idx_notificacoes_user_id 
ON public.notificacoes (user_id);

-- Índice para filtro de não lidas
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida 
ON public.notificacoes (lida) WHERE lida = false;

-- Índice composto para listagem de notificações do usuário
CREATE INDEX IF NOT EXISTS idx_notificacoes_user_created 
ON public.notificacoes (user_id, created_at DESC);

-- Índice composto para notificações não lidas do usuário
CREATE INDEX IF NOT EXISTS idx_notificacoes_user_lida 
ON public.notificacoes (user_id, lida) WHERE lida = false;

-- =====================================================
-- 6. ÍNDICES PARA TABELAS DE PERFIL DO CANDIDATO
-- =====================================================

-- Currículos
CREATE INDEX IF NOT EXISTS idx_curriculos_candidato_id 
ON public.curriculos (candidato_id);

-- Experiências Profissionais
CREATE INDEX IF NOT EXISTS idx_experiencias_candidato_id 
ON public.experiencias_profissionais (candidato_id);

-- Formações Acadêmicas
CREATE INDEX IF NOT EXISTS idx_formacoes_candidato_id 
ON public.formacoes_academicas (candidato_id);

-- Habilidades do Candidato
CREATE INDEX IF NOT EXISTS idx_candidato_habilidades_candidato_id 
ON public.candidato_habilidades (candidato_id);

-- Idiomas do Candidato
CREATE INDEX IF NOT EXISTS idx_candidato_idiomas_candidato_id 
ON public.candidato_idiomas (candidato_id);

-- Cursos Complementares
CREATE INDEX IF NOT EXISTS idx_cursos_complementares_candidato_id 
ON public.cursos_complementares (candidato_id);

-- Preferências de Emprego
CREATE INDEX IF NOT EXISTS idx_preferencias_emprego_candidato_id 
ON public.preferencias_emprego (candidato_id);

-- Áreas de Interesse
CREATE INDEX IF NOT EXISTS idx_candidato_areas_interesse_candidato_id 
ON public.candidato_areas_interesse (candidato_id);

-- Zonas de Interesse
CREATE INDEX IF NOT EXISTS idx_candidato_zonas_interesse_candidato_id 
ON public.candidato_zonas_interesse (candidato_id);

-- =====================================================
-- 7. ÍNDICES PARA TABELA CURSOS
-- =====================================================

-- Índice para filtro por área
CREATE INDEX IF NOT EXISTS idx_cursos_area_id 
ON public.cursos (area_id);

-- Índice GIN para busca textual no título
CREATE INDEX IF NOT EXISTS idx_cursos_titulo_gin 
ON public.cursos USING gin (to_tsvector('portuguese', titulo));

-- =====================================================
-- 8. ÍNDICES PARA TABELA EDITAIS
-- =====================================================

-- Índice para ordenação por data de criação
CREATE INDEX IF NOT EXISTS idx_editais_created_at 
ON public.editais (created_at DESC);

-- Índice GIN para busca textual no título
CREATE INDEX IF NOT EXISTS idx_editais_titulo_gin 
ON public.editais USING gin (to_tsvector('portuguese', titulo));

-- =====================================================
-- 9. ÍNDICES PARA TABELA USERS
-- =====================================================

-- Índice para busca por email
CREATE INDEX IF NOT EXISTS idx_users_email 
ON public.users (email);

-- =====================================================
-- 10. ÍNDICES PARA TABELAS AUXILIARES
-- =====================================================

-- Phone Verification Codes
CREATE INDEX IF NOT EXISTS idx_phone_codes_phone 
ON public.phone_verification_codes (phone);

CREATE INDEX IF NOT EXISTS idx_phone_codes_expires 
ON public.phone_verification_codes (expires_at);

-- Push Subscriptions
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id 
ON public.push_subscriptions (user_id);

-- =====================================================
-- COMENTÁRIOS SOBRE OS ÍNDICES
-- =====================================================
COMMENT ON INDEX idx_candidatos_cpf IS 'Acelera validação de CPF no login e cadastro';
COMMENT ON INDEX idx_candidatos_cidade IS 'Acelera filtros de matching por localização';
COMMENT ON INDEX idx_vagas_empresa_status IS 'Acelera listagem de vagas por empresa com filtro de status';
COMMENT ON INDEX idx_candidaturas_candidato_vaga IS 'Acelera verificação de candidatura duplicada';
COMMENT ON INDEX idx_notificacoes_user_lida IS 'Acelera contagem de notificações não lidas';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
