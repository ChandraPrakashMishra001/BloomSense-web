// BloomSense Service Worker
// Version 1.0.2 - Cache Invalidation Bump
// Handles both PWA offline caching (via Workbox injected manifest)
// and Firebase Cloud Messaging background push notifications.

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Workbox will inject the pre-cache manifest here at build time
precacheAndRoute(self.__WB_MANIFEST);

// ── Runtime Caching ──────────────────────────────────────────────────────────

// Google Fonts
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({ cacheName: 'google-fonts-stylesheets' })
);
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 })
    ]
  })
);

// Unsplash images
registerRoute(
  ({ url }) => url.origin === 'https://images.unsplash.com',
  new StaleWhileRevalidate({
    cacheName: 'unsplash-images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 7 })
    ]
  })
);

// Weather API — prefer network, fall back to cache
registerRoute(
  ({ url }) => url.origin === 'https://api.open-meteo.com',
  new NetworkFirst({
    cacheName: 'weather-api',
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({ maxEntries: 5, maxAgeSeconds: 60 * 60 })
    ]
  })
);

// ── Firebase Cloud Messaging ─────────────────────────────────────────────────

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
