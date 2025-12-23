import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST - Registrar subscription de push notification
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
    const { subscription } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Subscription inválida' },
        { status: 400 }
      );
    }

    // Verificar se já existe uma subscription com este endpoint
    const { data: existing } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', subscription.endpoint)
      .single();

    if (existing) {
      // Atualizar subscription existente
      const { error } = await supabase
        .from('push_subscriptions')
        .update({
          user_id: user.id,
          subscription: subscription,
          ativo: true,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Erro ao atualizar subscription:', error);
        return NextResponse.json(
          { error: 'Erro ao atualizar subscription' },
          { status: 500 }
        );
      }
    } else {
      // Criar nova subscription
      const { error } = await supabase
        .from('push_subscriptions')
        .insert({
          user_id: user.id,
          endpoint: subscription.endpoint,
          subscription: subscription,
          ativo: true,
          criado_em: new Date().toISOString(),
        });

      if (error) {
        console.error('Erro ao criar subscription:', error);
        return NextResponse.json(
          { error: 'Erro ao criar subscription' },
          { status: 500 }
        );
      }
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
