"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MainProject } from "@/lib/projectInterface"
import { useRouter } from "next/navigation"
import gsap from "gsap"

export default function Carousel({ projects, isLoading }: { projects: MainProject[], isLoading: boolean }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null);

  // 반응형 카드 크기 (16:9 비율)
  const getCardSize = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        const width = 220;
        return { width, height: Math.round(width * 3 / 4), gap: 8 };
      }
      if (window.innerWidth < 1024) {
        const width = 320;
        return { width, height: Math.round(width * 3 / 4), gap: 16 };
      }
    }
    const width = 400;
    return { width, height: Math.round(width * 3 / 4), gap: 32 };
  };
  const [cardSize, setCardSize] = useState(getCardSize());
  useEffect(() => {
    const handleResize = () => setCardSize(getCardSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const { width: CARD_WIDTH, height: CARD_HEIGHT, gap: GAP } = cardSize;

  // 자동 슬라이드 인터벌 관리
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  // 가상 복제 슬라이드: [맨 왼쪽, 왼쪽, 중앙, 오른쪽, 맨 오른쪽]
  const getIndex = (idx: number) => (idx + projects.length) % projects.length;
  const visible = [
    getIndex(currentIndex - 2), // 맨 왼쪽
    getIndex(currentIndex - 1), // 왼쪽
    getIndex(currentIndex),     // 중앙
    getIndex(currentIndex + 1), // 오른쪽
    getIndex(currentIndex + 2), // 맨 오른쪽
  ];

  // 여러 칸 이동 지원 (한 칸씩 순차적으로 이동, duration 조절)
  const slideTo = (dir: number, onComplete?: () => void, duration = 0.5) => {
    if (isAnimating || dir === 0) return;
    setIsAnimating(true);
    const cardWidth = cardRef.current ? cardRef.current.offsetWidth : 0;
    const move = -(cardWidth + GAP) * dir;

    // 1. 상태 먼저 변경
    setCurrentIndex((prev) => getIndex(prev + dir));

    // 2. 컨테이너를 반대 방향으로 미리 이동
    gsap.set(containerRef.current, { x: -move });

    // 3. 애니메이션으로 x=0까지 이동
    gsap.to(containerRef.current, {
      x: 0,
      duration,
      ease: "power2.inOut",
      onComplete: () => {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }
    });
  };

  // 여러 칸 이동 시 한 칸씩 순차적으로 이동 (duration 조절)
  const slideMultiple = async (dir: number, count: number, duration = 0.05) => {
    for (let i = 0; i < count; i++) {
      await new Promise<void>((resolve) => {
        slideTo(dir, resolve, duration);
      });
    }
  };

  // 인디케이터 클릭 시 원하는 인덱스로 이동 (한 칸씩 순차 이동, 빠른 duration)
  const goToIndex = (idx: number) => {
    if (isAnimating || idx === currentIndex) return;
    const dir = idx - currentIndex;
    const altDir = dir > 0
      ? dir - projects.length
      : dir + projects.length;
    const moveDir = Math.abs(dir) < Math.abs(altDir) ? dir : altDir;
    slideMultiple(Math.sign(moveDir), Math.abs(moveDir), 0.05);
    resetAutoSlide();
  };

  // 자동 슬라이드 인터벌 리셋
  const resetAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      if (!isAnimating) slideTo(1);
    }, 7000);
  };

  // 자동 슬라이드 useEffect
  useEffect(() => {
    if (!projects || projects.length === 0) return;
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      if (!isAnimating) slideTo(1);
    }, 7000);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [CARD_WIDTH, GAP, projects]);

  if (!projects || projects.length === 0) {
    return (
      <div className="w-full bg-secondary-color flex flex-col items-center justify-center py-16 select-none">
        <div
          className="relative w-full max-w-full mx-auto flex items-center justify-center overflow-hidden"
          style={{ height: CARD_HEIGHT }}
        >
          <div className="flex items-center justify-center mx-auto gap-4 w-full">
            {[0,1,2,3,4].map(i => (
              <div
                key={i}
                className="rounded-2xl bg-gray-200 animate-pulse flex-shrink-0 relative shadow-xl"
                style={{
                  width: '60%',
                  height: CARD_HEIGHT,
                  aspectRatio: '16/12',
                  marginLeft: i === 0 ? 0 : 16,
                  marginRight: i === 4 ? 0 : 16,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-secondary-color flex flex-col items-center justify-center py-16 select-none">
      <div
        className="relative w-full max-w-full mx-auto flex items-center justify-center overflow-hidden"
        style={{ height: CARD_HEIGHT }}
      >
        {/* 좌/우 버튼을 absolute로 중앙 세로선 기준 좌/우에 고정 */}
        <button
          onClick={() => { slideTo(-1); resetAutoSlide(); }}
          className={cn(
            "bg-white/90 hover:bg-white text-main-color rounded-full p-2 md:p-3 shadow-lg z-4 transition-colors",
            "absolute left-4 top-1/2 -translate-y-1/2 md:left-[12vw]"
          )}
          aria-label="이전"
          disabled={isAnimating}
          style={{ zIndex: 4 }}
        >
          <ChevronLeft className="h-5 w-5 md:h-7 md:w-7" />
        </button>
        {/* 5장 flex로 배치, GSAP 애니메이션 적용 */}
        <div
          ref={containerRef}
          className="flex items-center justify-center mx-auto"
          style={{ gap: GAP, width: '100%', transition: 'gap 0.3s' }}
        >
          {visible.map((idx, i) => {
            const project = projects[idx];
            if (!project) return null;
            // i === 2가 중앙, i === 1/3이 양옆, i === 0/4가 바깥쪽
            let scale = 0.92, opacity = 0.7, zIndex = 1, boxShadow = '0 4px 16px 0 rgba(0,0,0,0.10)';
            if (i === 2) {
              scale = 1; opacity = 1; zIndex = 2; boxShadow = '0 8px 32px 0 rgba(0,0,0,0.18)';
            } else if (i === 1 || i === 3) {
              scale = 0.96; opacity = 0.85; zIndex = 1; boxShadow = '0 4px 16px 0 rgba(0,0,0,0.10)';
            }
            return (
              <div
                key={project.projectId + '-' + i}
                ref={i === 2 ? cardRef : undefined}
                className={cn(
                  "rounded-2xl overflow-hidden cursor-pointer bg-white transition-all duration-500 flex-shrink-0 relative",
                  "shadow-xl"
                )}
                style={{
                  width: '60%',
                  height: CARD_HEIGHT,
                  transform: `scale(${scale})`,
                  opacity,
                  zIndex,
                  boxShadow,
                  aspectRatio: '16/12',
                  transition: 'all 0.5s',
                }}
                onClick={() => router.push(`/project/${project.projectId}`)}
              >
                <img src={project.imageUrl || "/placeholder/project-placeholder.png"} alt={project.title} className="w-full h-full object-cover" style={{ aspectRatio: '16/12' }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{project.title}</p>
                    {project.description && <h2 className="text-xl md:text-2xl font-bold">{project.description}</h2>}
                    <span className="inline-block bg-[#fb6f92] text-white px-2 py-0.5 rounded-full text-xs font-medium">{project.achievementRate}% 달성</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => { slideTo(1); resetAutoSlide(); }}
          className={cn(
            "bg-white/90 hover:bg-white text-main-color rounded-full p-2 md:p-3 shadow-lg z-4 transition-colors",
            "absolute right-4 top-1/2 -translate-y-1/2 md:right-[12vw]"
          )}
          aria-label="다음"
          disabled={isAnimating}
          style={{ zIndex: 4 }}
        >
          <ChevronRight className="h-5 w-5 md:h-7 md:w-7" />
        </button>
      </div>
      {/* 인디케이터 */}
      <div className="flex justify-center gap-2 mt-8">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToIndex(idx)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              currentIndex === idx ? "bg-[#fb6f92] w-6" : "bg-[#808080]/30 hover:bg-[#808080]/50"
            )}
            aria-label={`${idx + 1}번 이미지로 이동`}
            disabled={isAnimating}
          />
        ))}
      </div>
    </div>
  )
}
