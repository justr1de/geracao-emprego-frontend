import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/auth/check-email
 * Verifica se um e-mail já está cadastrado no sistema
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'E-mail é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verifica se o e-mail já existe na tabela de usuários
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar e-mail:', error);
      return NextResponse.json(
        { error: 'Erro ao verificar e-mail' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exists: !!data,
      message: data ? 'E-mail já cadastrado' : 'E-mail disponível'
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
