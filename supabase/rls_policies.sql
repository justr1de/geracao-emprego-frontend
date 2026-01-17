-- =============================================================================
-- MIGRAÇÃO DE SEGURANÇA: ROW-LEVEL SECURITY (RLS) - GERAÇÃO EMPREGO
-- Data: 15/01/2026
-- Objetivo: Proteger dados sensíveis garantindo que usuários acessem apenas o permitido.
-- =============================================================================

-- 1. Habilitar RLS nas tabelas principais
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- POLÍTICAS PARA A TABELA: CANDIDATOS
-- =============================================================================

-- Permite que o candidato veja e edite apenas seu próprio perfil
CREATE POLICY "Candidatos podem ver seu próprio perfil"
ON public.candidatos
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Candidatos podem atualizar seu próprio perfil"
ON public.candidatos
FOR UPDATE
USING (auth.uid() = user_id);

-- Permite que empresas vejam perfis de candidatos que se aplicaram às suas vagas
-- (Esta política assume que existe uma relação verificável via candidaturas)
CREATE POLICY "Empresas podem ver candidatos que se aplicaram"
ON public.candidatos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.candidaturas c
    JOIN public.vagas v ON c.vaga_id = v.id
    WHERE c.candidato_id = public.candidatos.id
    AND v.empresa_id = (SELECT id FROM public.empresas WHERE user_id = auth.uid())
  )
);

-- =============================================================================
-- POLÍTICAS PARA A TABELA: EMPRESAS
-- =============================================================================

-- Permite que a empresa veja e edite apenas seus próprios dados
CREATE POLICY "Empresas podem ver seus próprios dados"
ON public.empresas
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Empresas podem atualizar seus próprios dados"
ON public.empresas
FOR UPDATE
USING (auth.uid() = user_id);

-- Permite leitura pública de dados básicos da empresa (necessário para exibir vagas)
-- Restringe campos sensíveis se necessário, mas RLS atua na linha inteira.
-- Para maior segurança, recomenda-se usar Views para dados públicos ou separar tabelas.
CREATE POLICY "Dados públicos de empresas visíveis para todos"
ON public.empresas
FOR SELECT
USING (true); -- Ajuste conforme necessidade de privacidade (ex: apenas empresas com vagas ativas)

-- =============================================================================
-- POLÍTICAS PARA A TABELA: VAGAS
-- =============================================================================

-- Vagas ativas são públicas para leitura
CREATE POLICY "Vagas ativas são públicas"
ON public.vagas
FOR SELECT
USING (status = 'ativa'); -- Assumindo coluna 'status'

-- Empresas podem gerenciar (CRUD) apenas suas próprias vagas
CREATE POLICY "Empresas gerenciam suas próprias vagas"
ON public.vagas
FOR ALL
USING (empresa_id = (SELECT id FROM public.empresas WHERE user_id = auth.uid()));

-- =============================================================================
-- POLÍTICAS PARA A TABELA: CANDIDATURAS
-- =============================================================================

-- Candidatos veem apenas suas próprias candidaturas
CREATE POLICY "Candidatos veem suas candidaturas"
ON public.candidaturas
FOR SELECT
USING (candidato_id = (SELECT id FROM public.candidatos WHERE user_id = auth.uid()));

-- Candidatos podem criar candidaturas
CREATE POLICY "Candidatos podem se candidatar"
ON public.candidaturas
FOR INSERT
WITH CHECK (candidato_id = (SELECT id FROM public.candidatos WHERE user_id = auth.uid()));

-- Empresas veem candidaturas para suas vagas
CREATE POLICY "Empresas veem candidaturas recebidas"
ON public.candidaturas
FOR SELECT
USING (
  vaga_id IN (
    SELECT id FROM public.vagas 
    WHERE empresa_id = (SELECT id FROM public.empresas WHERE user_id = auth.uid())
  )
);

-- =============================================================================
-- POLÍTICAS PARA ADMINISTRADORES (Superusuários)
-- =============================================================================
-- Se houver uma role de admin no auth.users ou tabela de admins:

-- Exemplo genérico para permitir acesso total a admins (ajuste conforme sua lógica de roles)
-- CREATE POLICY "Admins têm acesso total a candidatos"
-- ON public.candidatos
-- FOR ALL
-- USING (
--   EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
-- );
