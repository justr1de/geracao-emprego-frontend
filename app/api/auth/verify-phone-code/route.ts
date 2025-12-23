import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/verify-phone-code
 * Verifica o código de verificação do telefone
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Telefone e código são obrigatórios' },
        { status: 400 }
      );
    }

    // Remove caracteres não numéricos
    const cleanedPhone = phone.replace(/\D/g, '');
    const cleanedCode = code.replace(/\D/g, '');

    if (cleanedCode.length !== 6) {
      return NextResponse.json(
        { error: 'Código deve ter 6 dígitos' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Busca o código mais recente não verificado para este telefone
    const { data: verificationRecord, error: fetchError } = await supabase
      .from('phone_verification_codes')
      .select('*')
      .eq('phone', cleanedPhone)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !verificationRecord) {
      return NextResponse.json(
        { error: 'Código expirado ou não encontrado. Solicite um novo código.' },
        { status: 400 }
      );
    }

    // Verifica se excedeu o número máximo de tentativas
    if (verificationRecord.attempts >= verificationRecord.max_attempts) {
      // Invalida o código
      await supabase
        .from('phone_verification_codes')
        .update({ verified: true }) // Marca como usado para não permitir mais tentativas
        .eq('id', verificationRecord.id);

      return NextResponse.json(
        { error: 'Número máximo de tentativas excedido. Solicite um novo código.' },
        { status: 400 }
      );
    }

    // Incrementa o contador de tentativas
    await supabase
      .from('phone_verification_codes')
      .update({ attempts: verificationRecord.attempts + 1 })
      .eq('id', verificationRecord.id);

    // Verifica se o código está correto
    if (verificationRecord.code !== cleanedCode) {
      const remainingAttempts = verificationRecord.max_attempts - verificationRecord.attempts - 1;
      
      return NextResponse.json(
        { 
          error: 'Código incorreto',
          remainingAttempts
        },
        { status: 400 }
      );
    }

    // Código correto - marca como verificado
    const { error: updateError } = await supabase
      .from('phone_verification_codes')
      .update({ 
        verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', verificationRecord.id);

    if (updateError) {
      console.error('Erro ao atualizar verificação:', updateError);
      return NextResponse.json(
        { error: 'Erro ao processar verificação' },
        { status: 500 }
      );
    }

    // Gera um token de verificação para uso no cadastro
    // Este token pode ser usado para confirmar que o telefone foi verificado
    const verificationToken = Buffer.from(
      JSON.stringify({
        phone: cleanedPhone,
        verified_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
      })
    ).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Telefone verificado com sucesso',
      verificationToken
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
