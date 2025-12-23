import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/auth/check-cnpj
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

    // Remove formatação do CNPJ (pontos, barras e traços)
    const cnpjLimpo = cnpj.replace(/\D/g, '');

    // Validação básica do CNPJ (14 dígitos)
    if (cnpjLimpo.length !== 14) {
      return NextResponse.json(
        { error: 'CNPJ inválido' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verifica se o CNPJ já existe na tabela de empresas
    const { data, error } = await supabase
      .from('empresas')
      .select('id')
      .eq('cnpj', cnpjLimpo)
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
      message: data ? 'CNPJ já cadastrado no sistema' : 'CNPJ disponível para cadastro'
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
