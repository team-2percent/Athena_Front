'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
          .then(registration => {
            console.log('Service Worker 등록 성공:', registration);
          })
          .catch(err => {
            console.error('Service Worker 등록 실패:', err);
          });
      });
    }
  }, []);
  return null;
} 