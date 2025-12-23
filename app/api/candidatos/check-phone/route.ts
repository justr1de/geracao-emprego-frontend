import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/candidatos/check-phone
 * Verifica se um telefone já está cadastrado no sistema
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get('phone');
    const userType = searchParams.get('type') || 'candidato'; // 'candidato' ou 'empresa'

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
        { error: 'Telefone deve conter 10 ou 11 dígitos' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verifica na tabela apropriada baseado no tipo de usuário
    const table = userType === 'empresa' ? 'empresas' : 'candidatos';
    const phoneField = userType === 'empresa' ? 'telefone' : 'telefone';

    const { data, error } = await supabase
      .from(table)
      .select('id')
      .eq(phoneField, cleanedPhone)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar telefone:', error);
      return NextResponse.json(
        { error: 'Erro ao verificar telefone' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exists: !!data,
      message: data ? 'Telefone já cadastrado' : 'Telefone disponível'
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
