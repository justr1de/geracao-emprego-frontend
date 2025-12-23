import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Gera um código de 6 dígitos aleatório
 */
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /api/auth/send-phone-code
 * Envia código de verificação via SMS ou WhatsApp
 * 
 * Para produção, integrar com:
 * - Twilio (SMS e WhatsApp)
 * - AWS SNS (SMS)
 * - Vonage/Nexmo (SMS e WhatsApp)
 * - MessageBird (SMS e WhatsApp)
 * - Evolution API (WhatsApp - self-hosted)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, method = 'whatsapp' } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Telefone é obrigatório' },
        { status: 400 }
      );
    }

    // Remove caracteres não numéricos
    const cleanedPhone = phone.replace(/\D/g, '');

    if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
      return NextResponse.json(
        { error: 'Telefone inválido' },
        { status: 400 }
      );
    }

    // Valida método
    if (!['sms', 'whatsapp'].includes(method)) {
      return NextResponse.json(
        { error: 'Método de envio inválido' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Verifica se há códigos recentes não expirados para este telefone
    const { data: existingCodes, error: checkError } = await supabase
      .from('phone_verification_codes')
      .select('*')
      .eq('phone', cleanedPhone)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (checkError) {
      console.error('Erro ao verificar códigos existentes:', checkError);
    }

    // Se há um código recente (menos de 1 minuto), não envia novo
    if (existingCodes && existingCodes.length > 0) {
      const lastCode = existingCodes[0];
      const createdAt = new Date(lastCode.created_at);
      const now = new Date();
      const diffSeconds = (now.getTime() - createdAt.getTime()) / 1000;

      if (diffSeconds < 60) {
        return NextResponse.json(
          { 
            error: 'Aguarde 1 minuto antes de solicitar um novo código',
            waitSeconds: Math.ceil(60 - diffSeconds)
          },
          { status: 429 }
        );
      }
    }

    // Gera novo código
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

    // Salva o código no banco
    const { error: insertError } = await supabase
      .from('phone_verification_codes')
      .insert({
        phone: cleanedPhone,
        code,
        method,
        expires_at: expiresAt.toISOString()
      });

    if (insertError) {
      console.error('Erro ao salvar código:', insertError);
      return NextResponse.json(
        { error: 'Erro ao gerar código de verificação' },
        { status: 500 }
      );
    }

    // TODO: Integrar com serviço de SMS/WhatsApp
    // Por enquanto, apenas logamos o código (remover em produção!)
    console.log(`[DEV] Código de verificação para ${cleanedPhone}: ${code}`);

    // Em produção, descomentar e configurar o serviço apropriado:
    /*
    if (method === 'whatsapp') {
      // Integração com WhatsApp Business API ou Evolution API
      await sendWhatsAppMessage(cleanedPhone, `Seu código de verificação Geração Emprego é: ${code}. Válido por 5 minutos.`);
    } else {
      // Integração com Twilio, AWS SNS, etc.
      await sendSMS(cleanedPhone, `Geração Emprego: Seu código de verificação é ${code}. Válido por 5 minutos.`);
    }
    */

    return NextResponse.json({
      success: true,
      message: method === 'whatsapp' 
        ? 'Código enviado via WhatsApp' 
        : 'Código enviado via SMS',
      expiresIn: 300, // 5 minutos em segundos
      // Em desenvolvimento, retornamos o código para facilitar testes
      // REMOVER EM PRODUÇÃO!
      ...(process.env.NODE_ENV === 'development' && { devCode: code })
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
