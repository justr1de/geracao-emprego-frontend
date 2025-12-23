/**
 * Serviço de Notificações
 * Gerencia notificações in-app, push notifications e integração com SMS/E-mail
 * 
 * Tipos de notificação:
 * - in_app: Notificações dentro do portal
 * - push: Push notifications (Web Push API)
 * - sms: SMS via Twilio/AWS
 * - email: E-mail via templates
 */

import { createClient } from '@/lib/supabase/server';
import { sendSMS, sendStatusNotification } from './sms';
import { sendStatusEmail, sendCandidaturaEmail, sendEntrevistaEmail } from './email';

export type NotificationType = 'in_app' | 'push' | 'sms' | 'email';
export type NotificationCategory = 
  | 'candidatura_recebida'
  | 'candidatura_visualizada'
  | 'candidatura_aprovada'
  | 'candidatura_reprovada'
  | 'entrevista_agendada'
  | 'nova_vaga'
  | 'vaga_expirando'
  | 'novo_candidato'
  | 'sistema';

export interface Notification {
  id?: string;
  user_id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  created_at?: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  categories: {
    [key in NotificationCategory]?: {
      email: boolean;
      sms: boolean;
      push: boolean;
      in_app: boolean;
    };
  };
}

// Configuração padrão de preferências
export const defaultPreferences: Omit<NotificationPreferences, 'user_id'> = {
  email_enabled: true,
  sms_enabled: true,
  push_enabled: true,
  categories: {
    candidatura_recebida: { email: true, sms: false, push: true, in_app: true },
    candidatura_visualizada: { email: false, sms: false, push: true, in_app: true },
    candidatura_aprovada: { email: true, sms: true, push: true, in_app: true },
    candidatura_reprovada: { email: true, sms: false, push: true, in_app: true },
    entrevista_agendada: { email: true, sms: true, push: true, in_app: true },
    nova_vaga: { email: false, sms: false, push: true, in_app: true },
    vaga_expirando: { email: true, sms: false, push: true, in_app: true },
    novo_candidato: { email: true, sms: false, push: true, in_app: true },
    sistema: { email: false, sms: false, push: false, in_app: true },
  },
};

// Criar notificação no banco de dados
export async function createNotification(
  notification: Omit<Notification, 'id' | 'created_at' | 'read'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        read: false,
      })
      .select('id')
      .single();
    
    if (error) throw error;
    
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Buscar notificações do usuário
export async function getUserNotifications(
  userId: string,
  limit = 20,
  unreadOnly = false
): Promise<Notification[]> {
  try {
    const supabase = await createClient();
    
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (unreadOnly) {
      query = query.eq('read', false);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return [];
  }
}

// Marcar notificação como lida
export async function markAsRead(notificationId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    return !error;
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    return false;
  }
}

// Marcar todas as notificações como lidas
export async function markAllAsRead(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    return !error;
  } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error);
    return false;
  }
}

// Contar notificações não lidas
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const supabase = await createClient();
    
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Erro ao contar notificações:', error);
    return 0;
  }
}

// ============================================
// Push Notifications (Web Push API)
// ============================================

export interface PushSubscription {
  user_id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  created_at?: string;
}

// Salvar subscription de push
export async function savePushSubscription(
  userId: string,
  subscription: PushSubscriptionJSON
): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      });
    
    return !error;
  } catch (error) {
    console.error('Erro ao salvar subscription:', error);
    return false;
  }
}

// Remover subscription de push
export async function removePushSubscription(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId);
    
    return !error;
  } catch (error) {
    console.error('Erro ao remover subscription:', error);
    return false;
  }
}

// Enviar push notification
export async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    // Buscar subscription do usuário
    const { data: subscription, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !subscription) {
      console.log('Usuário não tem subscription de push');
      return false;
    }
    
    // TODO: Implementar envio real de push notification
    // Requer configuração de VAPID keys e web-push library
    console.log(`[PUSH] Para: ${userId}`);
    console.log(`[PUSH] Título: ${title}`);
    console.log(`[PUSH] Mensagem: ${body}`);
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar push notification:', error);
    return false;
  }
}

// ============================================
// Funções de Alto Nível para Notificações
// ============================================

interface UserInfo {
  id: string;
  email: string;
  telefone?: string;
  nome: string;
}

// Notificar candidato sobre candidatura recebida
export async function notifyCandidaturaRecebida(
  candidato: UserInfo,
  vagaTitulo: string,
  empresaNome: string
): Promise<void> {
  // Notificação in-app
  await createNotification({
    user_id: candidato.id,
    type: 'in_app',
    category: 'candidatura_recebida',
    title: 'Candidatura Enviada!',
    message: `Sua candidatura para "${vagaTitulo}" na ${empresaNome} foi recebida.`,
    data: { vagaTitulo, empresaNome },
  });
  
  // E-mail
  await sendCandidaturaEmail(candidato.email, candidato.nome, vagaTitulo, empresaNome);
  
  // Push notification
  await sendPushNotification(
    candidato.id,
    'Candidatura Enviada!',
    `Sua candidatura para "${vagaTitulo}" foi recebida.`
  );
}

// Notificar candidato sobre aprovação
export async function notifyCandidaturaAprovada(
  candidato: UserInfo,
  vagaTitulo: string,
  empresaNome: string,
  mensagem?: string
): Promise<void> {
  // Notificação in-app
  await createNotification({
    user_id: candidato.id,
    type: 'in_app',
    category: 'candidatura_aprovada',
    title: '🎉 Parabéns! Você foi aprovado!',
    message: `Você foi aprovado para a vaga "${vagaTitulo}" na ${empresaNome}!`,
    data: { vagaTitulo, empresaNome, mensagem },
  });
  
  // E-mail
  await sendStatusEmail(candidato.email, candidato.nome, vagaTitulo, empresaNome, 'aprovado', mensagem);
  
  // SMS
  if (candidato.telefone) {
    await sendStatusNotification(candidato.telefone, vagaTitulo, 'aprovado');
  }
  
  // Push notification
  await sendPushNotification(
    candidato.id,
    '🎉 Parabéns!',
    `Você foi aprovado para "${vagaTitulo}"!`
  );
}

// Notificar candidato sobre entrevista agendada
export async function notifyEntrevistaAgendada(
  candidato: UserInfo,
  vagaTitulo: string,
  empresaNome: string,
  dataEntrevista: string,
  horaEntrevista: string,
  local: string,
  observacoes?: string
): Promise<void> {
  // Notificação in-app
  await createNotification({
    user_id: candidato.id,
    type: 'in_app',
    category: 'entrevista_agendada',
    title: '🎯 Entrevista Agendada!',
    message: `Você foi selecionado para entrevista: ${vagaTitulo} - ${dataEntrevista} às ${horaEntrevista}`,
    data: { vagaTitulo, empresaNome, dataEntrevista, horaEntrevista, local, observacoes },
  });
  
  // E-mail
  await sendEntrevistaEmail(
    candidato.email,
    candidato.nome,
    vagaTitulo,
    empresaNome,
    dataEntrevista,
    horaEntrevista,
    local,
    observacoes
  );
  
  // SMS
  if (candidato.telefone) {
    await sendStatusNotification(candidato.telefone, vagaTitulo, 'entrevista');
  }
  
  // Push notification
  await sendPushNotification(
    candidato.id,
    '🎯 Entrevista Agendada!',
    `${vagaTitulo} - ${dataEntrevista} às ${horaEntrevista}`
  );
}

// Notificar empresa sobre novo candidato
export async function notifyNovoCandidato(
  empresa: UserInfo,
  candidatoNome: string,
  vagaTitulo: string
): Promise<void> {
  // Notificação in-app
  await createNotification({
    user_id: empresa.id,
    type: 'in_app',
    category: 'novo_candidato',
    title: 'Novo Candidato!',
    message: `${candidatoNome} se candidatou para a vaga "${vagaTitulo}"`,
    data: { candidatoNome, vagaTitulo },
  });
  
  // Push notification
  await sendPushNotification(
    empresa.id,
    'Novo Candidato!',
    `${candidatoNome} se candidatou para "${vagaTitulo}"`
  );
}

export default {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  savePushSubscription,
  removePushSubscription,
  sendPushNotification,
  notifyCandidaturaRecebida,
  notifyCandidaturaAprovada,
  notifyEntrevistaAgendada,
  notifyNovoCandidato,
};
