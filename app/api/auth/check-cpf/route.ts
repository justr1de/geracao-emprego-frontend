import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/auth/check-cpf
 * Verifica se um CPF já está cadastrado no sistema
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cpf = searchParams.get('cpf');

    if (!cpf) {
      return NextResponse.json(
        { error: 'CPF é obrigatório' },
        { status: 400 }
      );
    }

    // Remove formatação do CPF (pontos e traços)
    const cpfLimpo = cpf.replace(/\D/g, '');

    // Validação básica do CPF (11 dígitos)
    if (cpfLimpo.length !== 11) {
      return NextResponse.json(
        { error: 'CPF inválido' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verifica se o CPF já existe na tabela de candidatos
    const { data, error } = await supabase
      .from('candidatos')
      .select('id')
      .eq('cpf', cpfLimpo)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar CPF:', error);
      return NextResponse.json(
        { error: 'Erro ao verificar CPF' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exists: !!data,
      message: data ? 'CPF já cadastrado no sistema' : 'CPF disponível para cadastro'
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
