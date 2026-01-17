# Instruções para Aplicação de Row-Level Security (RLS)

Este documento guia a aplicação das políticas de segurança RLS no banco de dados Supabase do projeto **Geração Emprego**.

## ⚠️ Antes de Começar

1.  **Backup:** Certifique-se de que o backup dos dados foi realizado (já fizemos o backup do código, mas o banco está na nuvem).
2.  **Teste:** Recomenda-se aplicar primeiro em um ambiente de *staging* ou teste, se disponível.

## Passo a Passo

1.  Acesse o painel do Supabase: [https://supabase.com/dashboard/project/gdzoifnsbbrjhgqyincn](https://supabase.com/dashboard/project/gdzoifnsbbrjhgqyincn)
2.  Vá para a seção **SQL Editor** (ícone de terminal na barra lateral esquerda).
3.  Clique em **New Query**.
4.  Copie o conteúdo do arquivo `rls_policies.sql` (anexado).
5.  Cole no editor SQL do Supabase.
6.  Clique em **Run** (botão verde).

## O que vai acontecer?

Ao executar o script, o banco de dados passará a impor as seguintes regras:

*   **Candidatos:** Só poderão ver e editar seus próprios perfis.
*   **Empresas:** Só poderão ver e editar seus próprios dados e vagas.
*   **Vagas:** Vagas ativas continuarão públicas para todos (visitantes e candidatos).
*   **Candidaturas:**
    *   Candidatos veem apenas as suas.
    *   Empresas veem apenas as candidaturas recebidas para suas vagas.

## Verificação

Após aplicar, teste o sistema:
1.  Faça login como candidato e tente editar seu perfil.
2.  Faça login como empresa e verifique se consegue ver os candidatos aplicados.
3.  Acesse a lista de vagas sem estar logado (deve continuar visível).

Se notar qualquer bloqueio indevido (ex: lista de vagas vazia), você pode desabilitar o RLS temporariamente rodando:
```sql
ALTER TABLE public.vagas DISABLE ROW LEVEL SECURITY;
-- Repita para outras tabelas se necessário
```
