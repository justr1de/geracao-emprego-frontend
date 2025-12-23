import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Listar notificações do usuário
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unread') === 'true';

    let query = supabase
      .from('notificacoes')
      .select('*')
      .eq('user_id', user.id)
      .order('criada_em', { ascending: false })
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq('lida', false);
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error('Erro ao buscar notificações:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar notificações' },
        { status: 500 }
      );
    }

    // Contar não lidas
    const { count: unreadCount } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('lida', false);

    return NextResponse.json({
      notifications: notifications || [],
      unreadCount: unreadCount || 0,
    });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar nova notificação (uso interno/admin)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { userId, tipo, titulo, mensagem, link, dados } = body;

    if (!userId || !tipo || !titulo || !mensagem) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: userId, tipo, titulo, mensagem' },
        { status: 400 }
      );
    }

    const { data: notification, error } = await supabase
      .from('notificacoes')
      .insert({
        user_id: userId,
        tipo,
        titulo,
        mensagem,
        link,
        dados,
        lida: false,
        criada_em: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar notificação:', error);
      return NextResponse.json(
        { error: 'Erro ao criar notificação' },
        { status: 500 }
      );
    }

    // Verificar se o usuário tem push subscription e enviar push notification
    const { data: subscription } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', userId)
      .eq('ativo', true)
      .single();

    if (subscription) {
      // TODO: Implementar envio de push notification via web-push
      // await sendPushNotification(subscription.subscription, { titulo, mensagem, link });
    }

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
