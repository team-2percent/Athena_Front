// src/components/common/TopToast.tsx - 컨셉 1: 우측 상단 슬라이드 탭
import { useEffect, useState } from 'react';
import { X, Bell } from 'lucide-react';

interface TopToastProps {
  title: string;
  body: string;
  duration?: number; // milliseconds
  onClose: () => void;
}

export default function TopToast({ title, body, duration = 5000, onClose }: TopToastProps) {
  const [isVisible, setIsVisible] = useState(false); // 초기 상태를 false로 변경하여 애니메이션 시작 준비
  const [isMounted, setIsMounted] = useState(false); // 마운트 상태 추적

  useEffect(() => {
    setIsMounted(true);
    const appearTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    const disappearTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(appearTimer);
      clearTimeout(disappearTimer);
    };
  }, [duration]);

  useEffect(() => {
    if (!isVisible && isMounted) {
      const animationEndTimer = setTimeout(() => {
        onClose();
      }, 300); // 애니메이션 지속 시간과 맞춤

      return () => clearTimeout(animationEndTimer);
    }
  }, [isVisible, isMounted, onClose]);

  const toastClasses = `
    fixed top-4 right-4 z-50 // 우측 상단 고정
    w-80 // 확장된 너비
    rounded-lg shadow-lg // 부드러운 그림자
    pointer-events-auto
    overflow-hidden
    bg-main-color // 배경을 main-color로 변경
    text-white // 글자색을 흰색으로 변경
    transition-all duration-300 ease-out // 트랜지션 설정
    ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} // 등장/퇴장 애니메이션 (우측에서 슬라이드)
    flex items-start // 세로 정렬
    p-4 // 패딩
  `;

  if (!isMounted && !isVisible) {
     return null;
  }

  return (
    <div className={toastClasses}>
      <div className="flex items-start w-full">
        {/* 알림 아이콘 */}
        <div className="flex-shrink-0 mt-1">
          <Bell className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        {/* 알림 내용 */}
        <div className="ml-3 flex-1">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-0.5 text-xs text-white/90">{body}</p>
        </div>
        {/* 닫기 버튼 */}
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            className="inline-flex text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            onClick={() => setIsVisible(false)}
          >
            <span className="sr-only">닫기</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}