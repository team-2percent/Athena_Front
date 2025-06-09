importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAwdB3JVvhAzeGj321_xQonikUiQKCFl8c",
    projectId: "athena-3b3a8",
    messagingSenderId: "185217939036",
    appId: "1:185217939036:web:66967b45af22cfca58d899",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png', // 필요에 따라 아이콘 경로 수정
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});