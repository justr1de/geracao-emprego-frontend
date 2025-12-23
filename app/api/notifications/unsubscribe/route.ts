import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST - Desativar subscription de push notification
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint é obrigatório' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('push_subscriptions')
      .update({
        ativo: false,
        atualizado_em: new Date().toISOString(),
      })
      .eq('endpoint', endpoint)
      .eq('user_id', user.id);

    if (error) {
      console.error('Erro ao desativar subscription:', error);
      return NextResponse.json(
        { error: 'Erro ao desativar subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
