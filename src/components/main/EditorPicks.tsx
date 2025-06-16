"use client"

import { useState, useRef, useEffect } from "react"
import { MainProject } from "@/lib/projectInterface"
import { useRouter } from "next/navigation"
import ProjectGridItem from "../common/ProjectGridItem"
import gsap from "gsap"

export default function EditorPicks({ projects, isLoading }: {projects: MainProject[], isLoading: boolean}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null)
  const carouselAreaRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // 자동 스크롤 관련 useEffect를 이 아래로 이동
  useEffect(() => {
    // 자동 스크롤 함수
    const startAutoScroll = () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current)
      autoScrollRef.current = setInterval(() => {
        // Implement auto scroll logic here
      }, 5000)
    }
    startAutoScroll()
    const area = carouselAreaRef.current
    if (area) {
      area.addEventListener("mouseenter", () => {
        if (autoScrollRef.current) clearInterval(autoScrollRef.current)
      })
      area.addEventListener("mouseleave", startAutoScroll)
    }
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current)
      if (area) {
        area.removeEventListener("mouseenter", () => {})
        area.removeEventListener("mouseleave", () => {})
      }
    }
  }, [])

  // 프로젝트 호버 애니메이션
  useEffect(() => {
    if (!containerRef.current) return
    const cards = containerRef.current.querySelectorAll('.project-card-anim')
    cards.forEach((card, idx) => {
      if (hoveredIndex === null) {
        gsap.to(card, { scale: 0.92, zIndex: 1, duration: 0.3, ease: 'power2.out' })
      } else if (idx === hoveredIndex) {
        gsap.to(card, { scale: 1, zIndex: 2, duration: 0.3, ease: 'power2.out' })
      } else {
        gsap.to(card, { scale: 0.84, zIndex: 0, duration: 0.3, ease: 'power2.out' })
      }
    })
  }, [hoveredIndex, projects])

  // 무한 슬라이드용: 리스트 2배 복제
  const infiniteProjects = [...projects, ...projects]

  // gsap 무한 슬라이드 애니메이션
  useEffect(() => {
    if (!containerRef.current || projects.length === 0) return
    const container = containerRef.current
    let anim: gsap.core.Tween | null = null
    let totalWidth = 0
    // 렌더 후 실제 width 측정
    setTimeout(() => {
      totalWidth = container.scrollWidth / 2
      gsap.set(container, { x: 0 })
      anim = gsap.to(container, {
        x: -totalWidth,
        duration: 40,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % -totalWidth)
        }
      })
    }, 0)
    // 마우스 오버 시 일시정지, 아웃 시 재생
    const area = carouselAreaRef.current
    const pause = () => anim && anim.pause()
    const resume = () => anim && anim.resume()
    if (area) {
      area.addEventListener('mouseenter', pause)
      area.addEventListener('mouseleave', resume)
    }
    return () => {
      if (anim) anim.kill()
      if (area) {
        area.removeEventListener('mouseenter', pause)
        area.removeEventListener('mouseleave', resume)
      }
    }
  }, [projects])

  if (projects === null || projects.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto py-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center">
          
          {/* Title */}
          <h2 className="text-left font-bold mb-8 lg:mb-0 lg:min-w-[300px] pl-4 text-base sm:text-lg md:text-xl lg:text-3xl">
            <span className="block lg:hidden">
              에디터가 <span className="text-main-color">엄선한</span> 프로젝트를 확인해보세요
            </span>
            <span className="hidden lg:block">
              에디터가<br />
              <span className="text-main-color">엄선한</span> 프로젝트를<br />
              확인해보세요
            </span>
          </h2>

          {/* Carousel Container */}
          <div className="relative flex-1 w-full min-w-[min(100vw,900px)] overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-60 bg-gradient-to-r from-white to-transparent z-4" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-60 bg-gradient-to-l from-white to-transparent z-4" />
            <div className="flex w-fit gap-6">
              {[0,1,2,3,4,5].map(i => (
                <div
                  key={i}
                  className="flex flex-col items-start animate-pulse"
                  style={{ minWidth: '220px', width: 220, transform: 'scale(0.92)' }}
                >
                  <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3" />
                  <div className="h-3 w-1/3 bg-gray-100 rounded mb-2" />
                  <div className="h-3 w-full bg-gray-200 rounded mb-3" />
                  <div className="h-6 w-full bg-gray-100 rounded mb-2" />
                  <div className="h-3 w-1/4 bg-gray-200 rounded mb-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-12">
      <div className="flex flex-col lg:flex-row items-start lg:items-center">
        {/* Title */}
        <h2 className="text-left font-bold mb-8 lg:mb-0 lg:min-w-[300px] pl-4 text-base sm:text-lg md:text-xl lg:text-3xl">
          {/* 모바일: 한 줄, 작은 글씨 / 데스크탑: 3줄, 큰 글씨 */}
          <span className="block lg:hidden">
            에디터가 <span className="text-main-color">엄선한</span> 프로젝트를 확인해보세요
          </span>
          <span className="hidden lg:block">
            에디터가<br />
            <span className="text-main-color">엄선한</span> 프로젝트를<br />
            확인해보세요
          </span>
        </h2>

        {/* Carousel Container */}
        <div className="relative flex-1 w-full min-w-[min(100vw,900px)] overflow-hidden" ref={carouselAreaRef}>
          {/* 왼쪽 그라데이션 오버레이 */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-60 bg-gradient-to-r from-white to-transparent z-4" />
          {/* 오른쪽 그라데이션 오버레이 */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-60 bg-gradient-to-l from-white to-transparent z-4" />
          <div ref={containerRef} className="flex w-fit gap-6">
            {infiniteProjects.map((item: any, index: number) => (
              <div
                key={item.projectId + '-' + index}
                className="w-full project-card-anim transition-transform"
                onMouseEnter={() => setHoveredIndex(index % projects.length)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ willChange: 'transform', minWidth: '220px', maxWidth: '1fr', transform: 'scale(0.92)' }}
              >
                <ProjectGridItem
                  className="w-full"
                  id={item.projectId}
                  imageUrl={item.imageUrl}
                  sellerName={item.sellerName}
                  projectName={item.title}
                  achievementRate={item.achievementRate}
                  description={item.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
