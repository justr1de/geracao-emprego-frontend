import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/send-confirmation
 * Envia e-mail de confirmação para ativação da conta
 * 
 * O Supabase Auth já possui funcionalidade nativa de confirmação de e-mail.
 * Esta rota é usada para reenviar o e-mail de confirmação.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'E-mail é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Usa o Supabase Auth para reenviar o e-mail de confirmação
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.toLowerCase(),
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://geracao-emprego-dev.vercel.app'}/auth/callback?type=email_confirmation`
      }
    });

    if (error) {
      console.error('Erro ao enviar e-mail de confirmação:', error);
      
      // Verifica se o erro é porque o usuário já confirmou
      if (error.message.includes('already confirmed')) {
        return NextResponse.json(
          { error: 'Este e-mail já foi confirmado' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Erro ao enviar e-mail de confirmação' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'E-mail de confirmação enviado com sucesso'
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
