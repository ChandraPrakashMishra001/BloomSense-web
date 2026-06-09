// BloomSense Service Worker
// Version 1.0.2 - Cache Invalidation Bump
// Handles Firebase Cloud Messaging background push notifications exclusively.
// PWA Workbox offline caching has been completely removed to prioritize load speed.

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAiawVZrk5pifFBoDuJSibbvuw0Kv3Yvcc",
  authDomain: "bloomsense-9cf96.firebaseapp.com",
  projectId: "bloomsense-9cf96",
  storageBucket: "bloomsense-9cf96.firebasestorage.app",
  messagingSenderId: "113263280584",
  appId: "1:113263280584:web:1d976e9833b94d00a680fd",
});

const messaging = firebase.messaging();

// Handle background push messages (app not in foreground)
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'BloomSense Advisory', {
    body: body || 'You have a new crop advisory.',
    icon: icon || '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'bloomsense-advisory',
    renotify: true,
    data: { url: payload.data?.url || '/calendar' }
  });
});

// Clicking notification opens the calendar
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/calendar';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
