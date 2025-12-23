import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/empresas/check-cnpj
 * Verifica se um CNPJ já está cadastrado no sistema
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cnpj = searchParams.get('cnpj');

    if (!cnpj) {
      return NextResponse.json(
        { error: 'CNPJ é obrigatório' },
        { status: 400 }
      );
    }

    // Remove caracteres não numéricos
    const cleanedCNPJ = cnpj.replace(/\D/g, '');

    if (cleanedCNPJ.length !== 14) {
      return NextResponse.json(
        { error: 'CNPJ deve conter 14 dígitos' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verifica se o CNPJ já existe na tabela de empresas
    const { data, error } = await supabase
      .from('empresas')
      .select('id')
      .eq('cnpj', cleanedCNPJ)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar CNPJ:', error);
      return NextResponse.json(
        { error: 'Erro ao verificar CNPJ' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exists: !!data,
      message: data ? 'CNPJ já cadastrado' : 'CNPJ disponível'
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
