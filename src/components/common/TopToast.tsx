"use client"

import { useEffect, useState } from 'react';
import { X, Bell } from 'lucide-react';
import clsx from 'clsx';

interface TopToastProps {
  title: string;
  body: string;
  duration?: number; // milliseconds
  onClose: () => void;
  className?: string;
  dataCy?: string;
  icon?: React.ReactNode;
}

export default function TopToast({ title, body, duration = 5000, onClose, className, dataCy, icon }: TopToastProps) {
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
    fixed top-4 right-4 z-50 // 우측 상단 고정, top/right 여백도 늘림
    w-88 // 너비 확장 (기존 w-80 → w-96)
    rounded-xl shadow-2xl // 더 둥글고 그림자 강조
    pointer-events-auto
    overflow-hidden
    bg-main-color // 배경을 main-color로 변경
    text-white // 글자색을 흰색으로 변경
    transition-all duration-300 ease-out // 트랜지션 설정
    ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} // 등장/퇴장 애니메이션 (우측에서 슬라이드)
    flex items-start // 세로 정렬
    p-4 // 패딩 증가 (기존 p-4 → p-6)
  `;

  if (!isMounted && !isVisible) {
     return null;
  }

  return (
    <div className={clsx(toastClasses, className)} data-cy={dataCy}>
      <div className="flex items-center w-full">
        {/* 알림 아이콘 */}
        <div className="flex-shrink-0 flex items-center h-full">
          {icon || <Bell className="h-8 w-8 text-white" aria-hidden="true" />}
        </div>
        {/* 알림 내용 */}
        <div className="ml-4 flex-1">
          <p className="text-base font-bold text-white" data-cy="top-toast-title">{title}</p>
          <p className="mt-1 text-sm text-white/90" data-cy="top-toast-body">{body}</p>
        </div>
        {/* 닫기 버튼 */}
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            className="inline-flex text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            onClick={() => setIsVisible(false)}
          >
            <span className="sr-only">닫기</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}