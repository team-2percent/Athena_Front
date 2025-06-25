"use client"

import { useState, useEffect } from "react";

export default function CarouselSkeleton() {
    // 스켈레톤 높이만 동적으로 적용
  const [skeletonHeight, setSkeletonHeight] = useState(0); // 초기값 0
  useEffect(() => {
    const getHeight = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) return 165;
        if (window.innerWidth < 1024) return 240;
      }
      return 300;
    };
    setSkeletonHeight(getHeight());
    const handleResize = () => setSkeletonHeight(getHeight());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className="w-full bg-secondary-color flex flex-col items-center justify-center py-16 select-none" data-cy="premium-carousel-skeleton">
        <div
          className="relative w-full max-w-full mx-auto flex items-center justify-center overflow-hidden"
          style={{ height: skeletonHeight || undefined }}
        >
          <div className="flex items-center justify-center mx-auto w-full gap-2 sm:gap-4 lg:gap-8">
            {[0,1,2,3,4].map(i => (
              <div
                key={i}
                className="rounded-2xl bg-gray-200 animate-pulse flex-shrink-0 relative shadow-xl h-[165px] sm:h-[240px] lg:h-[300px]"
                style={{
                  width: '60%',
                  height: skeletonHeight || undefined,
                  aspectRatio: '16/12',
                }}
              />
            ))}
          </div>
        </div>
        {/* 인디케이터 스켈레톤 */}
        <div className="flex justify-center gap-2 mt-8">
          {[0,1,2,3,4].map(i => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"
              style={{
                width: i === 2 ? '24px' : '12px'  // 중앙 인디케이터는 더 길게
              }}
            />
          ))}
        </div>
      </div>
  )
}