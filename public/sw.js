// Service Worker para Push Notifications - Geração Emprego

const CACHE_NAME = 'geracao-emprego-v1';

// Arquivos para cache offline
const urlsToCache = [
  '/',
  '/offline',
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar requisições para cache offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // Se offline e não tiver cache, mostrar página offline
        if (event.request.mode === 'navigate') {
          return caches.match('/offline');
        }
      })
  );
});

// Receber Push Notifications
self.addEventListener('push', (event) => {
  console.log('Push recebido:', event);

  let data = {
    titulo: 'Geração Emprego',
    mensagem: 'Você tem uma nova notificação',
    icone: '/logos/favicon.ico',
    badge: '/logos/badge-72x72.png',
    link: '/',
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.mensagem = event.data.text();
    }
  }

  const options = {
    body: data.mensagem,
    icon: data.icone,
    badge: data.badge,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id || '1',
      link: data.link,
    },
    actions: [
      {
        action: 'open',
        title: 'Ver',
        icon: '/icons/check.png',
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/close.png',
      },
    ],
    tag: data.tag || 'notification',
    renotify: true,
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.titulo, options)
  );
});

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const link = event.notification.data?.link || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se já tiver uma janela aberta, focar nela
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(link);
            return client.focus();
          }
        }
        // Se não tiver, abrir nova janela
        if (clients.openWindow) {
          return clients.openWindow(link);
        }
      })
  );
});

// Fechar notificação
self.addEventListener('notificationclose', (event) => {
  console.log('Notificação fechada:', event);
  
  // Opcional: enviar analytics de notificação fechada
  // fetch('/api/notifications/analytics', {
  //   method: 'POST',
  //   body: JSON.stringify({ action: 'closed', id: event.notification.data?.primaryKey }),
  // });
});

// Sincronização em background (para enviar dados quando voltar online)
self.addEventListener('sync', (event) => {
  console.log('Sync event:', event.tag);
  
  if (event.tag === 'sync-notifications') {
    event.waitUntil(
      // Sincronizar notificações pendentes
      fetch('/api/notifications/sync', { method: 'POST' })
    );
  }
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('Mensagem recebida:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
