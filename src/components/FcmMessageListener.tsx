// src/components/FcmMessageListener.tsx
"use client";

import { useEffect } from "react";
import { onMessage, getMessaging, isSupported } from "firebase/messaging";
import { firebaseApp } from "@/lib/firebase";
import useToastStore from "@/stores/useToastStore"; // 토스트 스토어 import
import TopToast from "@/components/common/TopToast";

interface NotificationPayload {
  title?: string;
  body?: string;
}

interface MessagePayload {
  notification?: NotificationPayload;
  data?: any;
}

export default function FCMMessageListener() {
  const { showToast, hideToast, isVisible, title, body } = useToastStore(); // 스토어 상태와 액션 가져오기

  useEffect(() => {
    async function setupMessaging() {
      const supported = await isSupported();
      if (!supported) {
        console.warn("이 브라우저는 FCM을 지원하지 않습니다.");
        return;
      }

      const messaging = getMessaging(firebaseApp);

      // 포그라운드 메시지 수신 시
      onMessage(messaging, (payload: MessagePayload) => {
        console.log("📨 포그라운드 메시지 수신:", payload);

        const notificationTitle = payload.notification?.title || "새 알림";
        const notificationBody = payload.notification?.body || "새 알림이 도착했습니다!";

        // 토스트 알림 표시
        showToast(notificationTitle, notificationBody);

        // 알림 소리 재생 (선택사항, 실제 파일 경로 필요)
        // const audio = new Audio('/path/to/notification-sound.mp3');
        // audio.play().catch(console.error);
      });
    }

    setupMessaging();
  }, [showToast]); // showToast를 의존성 배열에 추가

  return (
    <>
      {/* isVisible 상태에 따라 TopToast 렌더링 */}
      {isVisible && (
        <TopToast
          title={title}
          body={body}
          onClose={hideToast} // 토스트 닫기 시 hideToast 호출
        />
      )}
    </>
  );
}