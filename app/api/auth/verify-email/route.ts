import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/verify-email
 * Verifica o token de confirmação de e-mail
 * 
 * Nota: O Supabase Auth geralmente lida com isso automaticamente via callback URL.
 * Esta rota é para casos onde precisamos verificar manualmente.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, type } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verifica o token OTP
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type || 'email'
    });

    if (error) {
      console.error('Erro ao verificar token:', error);
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      );
    }

    // Atualiza o status de verificação do usuário no banco
    if (data.user) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          email_verified: true,
          email_verified_at: new Date().toISOString()
        })
        .eq('id', data.user.id);

      if (updateError) {
        console.error('Erro ao atualizar status de verificação:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'E-mail verificado com sucesso',
      user: data.user
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
