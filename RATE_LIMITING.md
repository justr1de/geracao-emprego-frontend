# Implementação de Rate Limiting (Upstash)

Este projeto utiliza o **Upstash Redis** e **@upstash/ratelimit** para proteger as rotas da aplicação contra ataques de força bruta e uso excessivo.

## Configuração Necessária

Para que o Rate Limiting funcione em produção (Vercel), você precisa adicionar as seguintes variáveis de ambiente no painel do projeto:

1.  **UPSTASH_REDIS_REST_URL**: URL de conexão do seu banco Redis no Upstash.
2.  **UPSTASH_REDIS_REST_TOKEN**: Token de autenticação do seu banco Redis no Upstash.

> **Nota:** Se essas variáveis não estiverem definidas, o sistema funcionará em modo "fail-open", ou seja, sem limites de requisição.

## Limites Definidos

Os limites estão configurados em `lib/ratelimit.ts` e aplicados via `middleware.ts`:

| Tipo | Rota | Limite | Janela de Tempo |
|------|------|--------|-----------------|
| **Auth** | `/api/auth/*`, `/login`, `/register` | 5 reqs | 60 segundos |
| **API** | `/api/*` (exceto auth) | 100 reqs | 60 segundos |
| **Padrão** | Outras rotas | 20 reqs | 10 segundos |

## Como Testar

1.  Configure as variáveis de ambiente no seu `.env.local`.
2.  Tente fazer login com credenciais erradas mais de 5 vezes em 1 minuto.
3.  Você deverá receber um erro `429 Too Many Requests`.
