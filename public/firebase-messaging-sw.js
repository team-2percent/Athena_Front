importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

// firebase.initializeApp({
//   apiKey: self.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: self.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: self.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: self.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: self.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: self.NEXT_PUBLIC_FIREBASE_APP_ID,
// });

firebase.initializeApp({
    apiKey: "AIzaSyAwdB3JVvhAzeGj321_xQonikUiQKCFl8c",
    authDomain: "athena-3b3a8.firebaseapp.com",
    projectId: "athena-3b3a8",
    storageBucket: "athena-3b3a8.firebasestorage.app",
    messagingSenderId: "185217939036",
    appId: "1:185217939036:web:66967b45af22cfca58d899",
    measurementId: "G-0HFP7DDL34",
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