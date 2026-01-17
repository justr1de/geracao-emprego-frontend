import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { rateLimiters } from "@/lib/ratelimit";

export async function middleware(request: NextRequest) {
  // 1. Rate Limiting Logic
  if (rateLimiters.default) {
    const ip = request.ip ?? "127.0.0.1";
    const path = request.nextUrl.pathname;

    let limiter = rateLimiters.default;

    // Define limites específicos baseados na rota
    if (path.startsWith("/api/auth") || path.startsWith("/login") || path.startsWith("/register")) {
      limiter = rateLimiters.auth!;
    } else if (path.startsWith("/api")) {
      limiter = rateLimiters.api!;
    }

    try {
      const { success, limit, remaining, reset } = await limiter.limit(ip);

      if (!success) {
        return new NextResponse(
          JSON.stringify({
            error: "Too Many Requests",
            message: "Muitas requisições. Por favor, tente novamente mais tarde.",
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
      
      // Se passou no rate limit, continua para a sessão do Supabase
      // Nota: Headers de rate limit poderiam ser adicionados na resposta final, 
      // mas updateSession retorna uma resposta nova.
    } catch (error) {
      console.error("Erro no Rate Limiting:", error);
      // Fail-open: continua em caso de erro no Redis
    }
  }

  // 2. Supabase Session Logic
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
