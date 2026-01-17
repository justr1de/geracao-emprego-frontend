import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Verifica se as variáveis de ambiente estão definidas
// Em produção (Vercel), essas variáveis devem ser configuradas no painel do projeto
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Cria uma instância do Redis apenas se as credenciais existirem
const redis = (redisUrl && redisToken) 
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

// Configurações de limites para diferentes tipos de rotas
export const rateLimiters = {
  // Limite padrão: 20 requisições por 10 segundos
  default: redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit/default",
  }) : null,
  
  // Limite estrito para autenticação: 5 tentativas por 60 segundos
  auth: redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
    prefix: "@upstash/ratelimit/auth",
  }) : null,
  
  // Limite para APIs públicas: 100 requisições por 60 segundos
  api: redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "60 s"),
    analytics: true,
    prefix: "@upstash/ratelimit/api",
  }) : null,
};

export default rateLimiters;
