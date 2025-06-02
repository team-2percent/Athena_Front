import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

let messaging: ReturnType<typeof getMessaging> | undefined = undefined;
if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
  messaging = getMessaging(firebaseApp);
}

export const getFCMToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("이 브라우저는 FCM을 지원하지 않습니다.");
      return null;
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    if (!vapidKey) throw new Error('VAPID 키가 설정되어 있지 않습니다.');
    if (!messaging) throw new Error('messaging 객체가 초기화되지 않았습니다.');
    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch (error) {
    console.error('FCM 토큰 발급 실패:', error);
    return null;
  }
};

export { firebaseApp, messaging }; 