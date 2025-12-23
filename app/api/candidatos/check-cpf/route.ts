import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/candidatos/check-cpf
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

    // Remove caracteres não numéricos
    const cleanedCPF = cpf.replace(/\D/g, '');

    if (cleanedCPF.length !== 11) {
      return NextResponse.json(
        { error: 'CPF deve conter 11 dígitos' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verifica se o CPF já existe na tabela de candidatos
    const { data, error } = await supabase
      .from('candidatos')
      .select('id')
      .eq('cpf', cleanedCPF)
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
      message: data ? 'CPF já cadastrado' : 'CPF disponível'
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
