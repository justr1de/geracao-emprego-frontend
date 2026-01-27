# Cronograma de Desenvolvimento - Portal Geração Emprego

## Visão Geral

Este documento apresenta o cronograma de desenvolvimento de alto nível para implementação das funcionalidades de Prioridade Alta e Média do portal Geração Emprego. O cronograma está organizado em sprints de 2 semanas, com marcos de entrega definidos.

**Período Total Estimado:** 16 semanas (4 meses)
**Metodologia:** Scrum com sprints de 2 semanas
**Equipe Sugerida:** 2 desenvolvedores full-stack, 1 designer UI/UX

---

## Fase 1: Engajamento Imediato (Semanas 1-6)

### Sprint 1-2: Onboarding Guiado
**Período:** Semanas 1-4

| Tarefa | Descrição | Complexidade | Dependências |
|--------|-----------|--------------|--------------|
| Design do fluxo de onboarding | Wireframes e protótipos do tour interativo | Média | Nenhuma |
| Componente de tour interativo | Biblioteca de tooltips e highlights | Alta | Design aprovado |
| Integração com perfil do usuário | Detectar usuário novo vs. retornante | Baixa | Componente pronto |
| Testes de usabilidade | Validar fluxo com usuários reais | Média | Integração completa |

**Entregáveis:**
- Componente `OnboardingTour` funcional
- 5-7 passos de tour cobrindo: busca de vagas, perfil, candidatura, notificações
- Opção de pular ou refazer o tour

**Marco:** Tour interativo disponível para novos usuários

---

### Sprint 3: Sistema de Recomendação de Vagas
**Período:** Semanas 5-6

| Tarefa | Descrição | Complexidade | Dependências |
|--------|-----------|--------------|--------------|
| Algoritmo de matching | Calcular compatibilidade perfil-vaga | Alta | Perfil completo |
| API de recomendações | Endpoint para buscar vagas recomendadas | Média | Algoritmo pronto |
| Seção "Vagas para Você" | Componente na home e página de vagas | Média | API pronta |
| Score de compatibilidade | Exibir % de match em cada vaga | Baixa | Algoritmo pronto |

**Critérios de Match:**
- Área de atuação (peso 30%)
- Localização/cidade (peso 25%)
- Faixa salarial pretendida (peso 20%)
- Experiência requerida (peso 15%)
- Habilidades (peso 10%)

**Entregáveis:**
- Algoritmo de recomendação funcional
- Seção "Vagas Recomendadas" na home
- Badge de compatibilidade nos cards de vagas

**Marco:** Sistema de recomendação em produção

---

## Fase 2: Alertas e Gamificação (Semanas 7-10)

### Sprint 4: Alertas de Vagas
**Período:** Semanas 7-8

| Tarefa | Descrição | Complexidade | Dependências |
|--------|-----------|--------------|--------------|
| Configuração de alertas | Interface para definir critérios de alerta | Média | Nenhuma |
| Job scheduler | Cron job para verificar novas vagas | Alta | Critérios salvos |
| Sistema de e-mail | Templates e envio de alertas por e-mail | Média | Job scheduler |
| Push notifications | Alertas em tempo real no navegador | Alta | Service worker |

**Tipos de Alerta:**
- Nova vaga na área de atuação
- Vaga em cidade específica
- Vaga com salário acima de X
- Vaga em empresa específica

**Entregáveis:**
- Página de configuração de alertas
- E-mails automáticos de novas vagas
- Push notifications funcionais

**Marco:** Sistema de alertas automatizado

---

### Sprint 5: Gamificação do Perfil
**Período:** Semanas 9-10

| Tarefa | Descrição | Complexidade | Dependências |
|--------|-----------|--------------|--------------|
| Sistema de níveis | Definir níveis e XP necessário | Baixa | Nenhuma |
| Conquistas/badges | Criar sistema de conquistas | Média | Sistema de níveis |
| Barra de progresso | Visualização do progresso do perfil | Baixa | Conquistas |
| Recompensas | Benefícios por completar perfil | Média | Sistema completo |

**Níveis do Perfil:**
1. **Iniciante** (0-20%): Dados básicos preenchidos
2. **Aprendiz** (21-40%): Foto e resumo adicionados
3. **Profissional** (41-60%): Experiências cadastradas
4. **Especialista** (61-80%): Formação e habilidades completas
5. **Mestre** (81-100%): Perfil 100% completo

**Conquistas Sugeridas:**
- 🎯 "Primeiro Passo" - Completar cadastro
- 📸 "Cara Nova" - Adicionar foto de perfil
- 📝 "Contador de Histórias" - Escrever resumo profissional
- 💼 "Experiente" - Adicionar 3+ experiências
- 🎓 "Estudioso" - Adicionar formação acadêmica
- 🏆 "Perfil Completo" - Atingir 100%

**Entregáveis:**
- Sistema de níveis e XP
- 10+ conquistas desbloqueáveis
- Página de conquistas do usuário

**Marco:** Gamificação do perfil em produção

---

## Fase 3: Experiência do Usuário (Semanas 11-14)

### Sprint 6: Dashboard do Candidato
**Período:** Semanas 11-12

| Tarefa | Descrição | Complexidade | Dependências |
|--------|-----------|--------------|--------------|
| Design do dashboard | Layout e componentes do painel | Média | Nenhuma |
| Widgets de estatísticas | Candidaturas, visualizações, etc. | Média | Design aprovado |
| Ações rápidas | Botões de acesso rápido | Baixa | Widgets prontos |
| Gráficos de atividade | Histórico de atividades do usuário | Alta | Dados coletados |

**Widgets do Dashboard:**
- Resumo do perfil com % de completude
- Candidaturas recentes (últimas 5)
- Vagas recomendadas (top 3)
- Notificações não lidas
- Gráfico de candidaturas por mês
- Próximas entrevistas agendadas

**Entregáveis:**
- Dashboard completo para candidatos
- Widgets interativos
- Gráficos de atividade

**Marco:** Dashboard do candidato disponível

---

### Sprint 7: Vagas Favoritas e Histórico
**Período:** Semanas 13-14

| Tarefa | Descrição | Complexidade | Dependências |
|--------|-----------|--------------|--------------|
| Botão de favoritar | Adicionar/remover favoritos | Baixa | Nenhuma |
| Página de favoritos | Listar vagas salvas | Média | Botão funcional |
| Histórico de visualizações | Rastrear vagas visualizadas | Média | Nenhuma |
| Comparador de vagas | Comparar até 3 vagas | Alta | Favoritos prontos |

**Funcionalidades:**
- Coração/estrela para favoritar vagas
- Página "Minhas Vagas Salvas"
- Seção "Visualizadas Recentemente"
- Modal de comparação lado a lado

**Entregáveis:**
- Sistema de favoritos completo
- Histórico de visualizações
- Comparador de vagas funcional

**Marco:** Funcionalidades de favoritos e histórico em produção

---

## Fase 4: Comunicação (Semanas 15-16)

### Sprint 8: Chat e Feedback
**Período:** Semanas 15-16

| Tarefa | Descrição | Complexidade | Dependências |
|--------|-----------|--------------|--------------|
| Sistema de mensagens | Infraestrutura de chat | Alta | Nenhuma |
| Interface de chat | UI para troca de mensagens | Média | Sistema pronto |
| Notificações de mensagem | Alertas de novas mensagens | Média | Chat funcional |
| Sistema de feedback | Empresas enviam feedback | Média | Nenhuma |

**Funcionalidades do Chat:**
- Mensagens em tempo real (WebSocket)
- Histórico de conversas
- Indicador de leitura
- Notificações de novas mensagens

**Sistema de Feedback:**
- Templates de feedback para empresas
- Feedback visível para candidatos
- Estatísticas de feedback recebido

**Entregáveis:**
- Chat empresa-candidato funcional
- Sistema de feedback implementado

**Marco:** Sistema de comunicação em produção

---

## Resumo do Cronograma

| Fase | Sprint | Período | Funcionalidade Principal | Marco |
|------|--------|---------|--------------------------|-------|
| 1 | 1-2 | Sem 1-4 | Onboarding Guiado | Tour interativo |
| 1 | 3 | Sem 5-6 | Vagas Recomendadas | Sistema de match |
| 2 | 4 | Sem 7-8 | Alertas de Vagas | Notificações automáticas |
| 2 | 5 | Sem 9-10 | Gamificação | Níveis e conquistas |
| 3 | 6 | Sem 11-12 | Dashboard | Painel do candidato |
| 3 | 7 | Sem 13-14 | Favoritos/Histórico | Vagas salvas |
| 4 | 8 | Sem 15-16 | Chat/Feedback | Comunicação direta |

---

## Dependências Técnicas

### Infraestrutura Necessária

| Componente | Descrição | Prioridade |
|------------|-----------|------------|
| Redis/Cache | Cache para recomendações e sessões | Alta |
| WebSocket Server | Comunicação em tempo real (chat) | Média |
| Job Queue | Processamento de alertas e e-mails | Alta |
| Service Worker | Push notifications | Média |

### Integrações Externas

| Serviço | Uso | Sprint |
|---------|-----|--------|
| SendGrid/Resend | Envio de e-mails | Sprint 4 |
| Web Push API | Notificações push | Sprint 4 |
| Analytics | Métricas de engajamento | Todos |

---

## Métricas de Sucesso

### KPIs por Funcionalidade

| Funcionalidade | Métrica | Meta |
|----------------|---------|------|
| Onboarding | Taxa de conclusão do tour | > 70% |
| Recomendações | CTR em vagas recomendadas | > 15% |
| Alertas | Taxa de abertura de e-mails | > 25% |
| Gamificação | Perfis 100% completos | +50% |
| Dashboard | Tempo médio na página | > 3 min |
| Favoritos | Vagas salvas por usuário | > 5 |
| Chat | Mensagens enviadas/mês | > 1000 |

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Atraso no algoritmo de match | Média | Alto | Começar com versão simplificada |
| Problemas com WebSocket | Baixa | Médio | Fallback para polling |
| Baixa adoção de notificações | Média | Médio | Incentivar com benefícios |
| Complexidade do chat | Alta | Alto | MVP com funcionalidades básicas |

---

## Próximos Passos

1. **Validar cronograma** com stakeholders
2. **Priorizar MVP** de cada funcionalidade
3. **Definir equipe** e responsabilidades
4. **Configurar ambiente** de desenvolvimento
5. **Iniciar Sprint 1** - Onboarding Guiado

---

*Documento criado em: 27/01/2026*
*Última atualização: 27/01/2026*
*Versão: 1.0*
