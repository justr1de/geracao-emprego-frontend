'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Settings, BellOff, BellRing } from 'lucide-react';
import { useAuthContext as useAuth } from '@/contexts/AuthContext';
import styles from './index.module.css';

export interface Notification {
  id: string;
  tipo: 'candidatura' | 'vaga' | 'entrevista' | 'sistema' | 'curso';
  titulo: string;
  mensagem: string;
  lida: boolean;
  criadaEm: string;
  link?: string;
  dados?: Record<string, unknown>;
}

interface NotificationCenterProps {
  className?: string;
}

export default function NotificationCenter({ className }: NotificationCenterProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Carregar notificações
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        // Dados de exemplo para demonstração
        setNotifications([
          {
            id: '1',
            tipo: 'candidatura',
            titulo: 'Nova candidatura recebida',
            mensagem: 'Maria Silva se candidatou para a vaga de Auxiliar Administrativo',
            lida: false,
            criadaEm: new Date().toISOString(),
            link: '/empresa/dashboard?tab=candidaturas',
          },
          {
            id: '2',
            tipo: 'entrevista',
            titulo: 'Entrevista agendada',
            mensagem: 'Sua entrevista para Vendedor foi agendada para 26/12 às 14h',
            lida: false,
            criadaEm: new Date(Date.now() - 3600000).toISOString(),
            link: '/minhas-candidaturas',
          },
          {
            id: '3',
            tipo: 'vaga',
            titulo: 'Vaga compatível encontrada',
            mensagem: 'Uma nova vaga de Atendente foi publicada em Porto Velho',
            lida: true,
            criadaEm: new Date(Date.now() - 86400000).toISOString(),
            link: '/vagas',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  // Verificar suporte a push notifications
  useEffect(() => {
    const checkPushSupport = async () => {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        const permission = Notification.permission;
        setPushEnabled(permission === 'granted');
      }
    };
    checkPushSupport();
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Marcar como lida
  const markAsRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, lida: true } : n))
    );
    
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
    
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  // Excluir notificação
  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
    }
  };

  // Solicitar permissão para push notifications
  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      alert('Seu navegador não suporta notificações push');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushEnabled(true);
        
        // Registrar service worker e subscription
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          });
          
          // Enviar subscription para o servidor
          await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription }),
          });
        }
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
    }
  };

  // Desabilitar push notifications
  const disablePush = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          await fetch('/api/notifications/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });
        }
      }
      setPushEnabled(false);
    } catch (error) {
      console.error('Erro ao desabilitar push:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.lida).length;

  const getNotificationIcon = (tipo: Notification['tipo']) => {
    const icons = {
      candidatura: '👤',
      vaga: '💼',
      entrevista: '📅',
      sistema: '⚙️',
      curso: '📚',
    };
    return icons[tipo] || '📢';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Agora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
    return date.toLocaleDateString('pt-BR');
  };

  if (!user) return null;

  return (
    <div className={`${styles.container} ${className || ''}`} ref={dropdownRef} data-tour="notifications">
      <button
        className={styles.bellButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificações"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3>Notificações</h3>
            <div className={styles.headerActions}>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} title="Marcar todas como lidas">
                  <CheckCheck size={18} />
                </button>
              )}
              <button onClick={() => setShowSettings(!showSettings)} title="Configurações">
                <Settings size={18} />
              </button>
            </div>
          </div>

          {showSettings ? (
            <div className={styles.settings}>
              <h4>Configurações de Notificação</h4>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <BellRing size={20} />
                  <div>
                    <strong>Notificações Push</strong>
                    <p>Receba alertas mesmo quando não estiver no site</p>
                  </div>
                </div>
                {pushEnabled ? (
                  <button className={styles.disableBtn} onClick={disablePush}>
                    <BellOff size={16} /> Desativar
                  </button>
                ) : (
                  <button className={styles.enableBtn} onClick={requestPushPermission}>
                    <BellRing size={16} /> Ativar
                  </button>
                )}
              </div>
              <p className={styles.settingNote}>
                As notificações push permitem que você seja avisado sobre novas vagas, 
                candidaturas e atualizações importantes em tempo real.
              </p>
            </div>
          ) : (
            <>
              {loading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className={styles.empty}>
                  <Bell size={32} />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className={styles.list}>
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`${styles.item} ${!notification.lida ? styles.unread : ''}`}
                    >
                      <div className={styles.itemIcon}>
                        {getNotificationIcon(notification.tipo)}
                      </div>
                      <div className={styles.itemContent}>
                        <a
                          href={notification.link || '#'}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <strong>{notification.titulo}</strong>
                          <p>{notification.mensagem}</p>
                        </a>
                        <span className={styles.itemTime}>
                          {formatDate(notification.criadaEm)}
                        </span>
                      </div>
                      <div className={styles.itemActions}>
                        {!notification.lida && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            title="Marcar como lida"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className={styles.footer}>
            <a href="/notificacoes">Ver todas as notificações</a>
          </div>
        </div>
      )}
    </div>
  );
}
