# TODO - Implementação das Funcionalidades dos Cards

## Card 1: Cadastre-se Gratuitamente
- [x] Cadastro 100% gratuito (já existe em /cadastro)
- [x] Sem necessidade de currículo pronto (cadastro permite isso)
- [x] Acesso imediato às vagas (após cadastro)

## Card 2: Complete seu Currículo
- [x] Modelo de currículo guiado (existe em /perfil)
- [x] Dicas para destacar seu perfil (componente ProfileTips criado)
- [x] Visibilidade para empresas (currículos visíveis em /curriculos)

## Card 3: Encontre Vagas Ideais
- [x] Busca de vagas disponível (/vagas)
- [x] Filtros por salário (faixas salariais implementadas)
- [x] Filtros por benefícios (10 opções de benefícios)
- [x] Vagas em todo o estado de Rondônia (52 cidades)
- [x] Tags de filtros ativos com remoção individual

## Card 4: Candidate-se com 1 Clique
- [x] Candidatura instantânea (botão "Candidatar-se com 1 Clique")
- [x] Histórico de candidaturas (/minhas-candidaturas)
- [x] Notificações de visualização (banner e indicadores visuais)
- [x] Filtros por status na página de candidaturas
- [x] Botão de atualização para verificar novos status


---

# Fase 1 - Engajamento Imediato

## Sprint 1-2: Onboarding Guiado
- [x] Criar componente OnboardingTour com tooltips e highlights
- [x] Implementar passos do tour (busca, perfil, candidatura, notificações)
- [x] Detectar usuário novo vs. retornante
- [x] Opção de pular ou refazer o tour
- [x] Salvar preferência do usuário no localStorage/banco

## Sprint 3: Sistema de Recomendação de Vagas
- [x] Criar algoritmo de matching perfil-vaga
- [x] Implementar API /api/vagas/recomendadas
- [x] Criar seção "Vagas para Você" na home
- [x] Exibir score de compatibilidade nos cards
- [x] Integrar com página de vagas
