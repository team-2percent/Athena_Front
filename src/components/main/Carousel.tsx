"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MainProject } from "@/lib/projectInterface"
import { useRouter } from "next/navigation"

export default function Carousel({ projects, isLoading }: {projects: MainProject[], isLoading: boolean}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 자동 슬라이드 시작 함수
  const startAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current)
    }

    autoplayTimerRef.current = setInterval(() => {
      goToNext()
    }, 5000)
  }

  // 자동 슬라이드 중지 함수
  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current)
      autoplayTimerRef.current = null
    }
  }

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev + projects.length - 1) % projects.length )
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % projects.length);
  }
  // Get the previous, current, and next indices with wrap-around
  const getPrevIndex = (index: number) => {
    return (index + projects.length - 1) % projects.length
  }

  const getNextIndex = (index: number) => {
    return (index + 1) % projects.length
  }

  const moveToProjectPage = (projectId: number) => {
    router.push(`/project/${projectId}`)
  }

  useEffect(() => {
    startAutoplay()
    
    return () => {
      stopAutoplay()
    }
  }, [projects])

  if (projects === null || projects.length === 0) {
    return <div>로딩 중입니다.</div> // 로딩 표시 필요
  }

  return (
    <div className="w-full relative py-10 overflow-hidden bg-secondary-color">
      <div
        ref={carouselRef}
        className="flex items-center justify-center gap-4 overflow-hidden"
      >
        {/* Previous Slide (Left Side) */}
        {
          projects[getPrevIndex(currentIndex)] && 
          <div className="relative w-1/2 h-[350px] md:h-[400px] opacity-70 transform transition-all duration-300 rounded-xl overflow-hidden shrink-0">
            <img
              src={projects[getPrevIndex(currentIndex)].imageUrl || "/placeholder.svg"}
              alt={projects[getPrevIndex(currentIndex)].title}
              className="w-full h-full object-cover"
            />
          </div>
        }

        {/* Current Slide (Center) */}
        {projects[currentIndex] && <div
          className="relative w-1/2 h-[350px] md:h-[400px] transition-all duration-300 rounded-xl overflow-hidden shrink-0"
          onClick={() => moveToProjectPage(projects[currentIndex].projectId)}
        >
          <img
            src={projects[currentIndex].imageUrl || "/placeholder.svg"}
            alt={projects[currentIndex].title}
            className="w-full h-full object-cover"
          />

          {projects[currentIndex].title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
              <div className="space-y-1">
                <p className="text-sm font-medium">{projects[currentIndex].title}</p>
                {projects[currentIndex].description && (
                  <h2 className="text-xl md:text-2xl font-bold">{projects[currentIndex].description}</h2>
                )}
                <span className="inline-block bg-[#fb6f92] text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    {projects[currentIndex].achievementRate * 100} % 달성
                  </span>
                <p className="text-xs mt-1">{projects[currentIndex].description}</p>
              </div>
            </div>
          )}
        </div>}

        {/* Next Slide (Right Side) */}
        {
          projects[getNextIndex(currentIndex)] && 
          <div className="relative w-1/2 h-[350px] md:h-[400px] opacity-70 transform transition-all duration-300 rounded-xl overflow-hidden shrink-0">
            <img
              src={projects[getNextIndex(currentIndex)].imageUrl || "/placeholder.svg"}
              alt={projects[getNextIndex(currentIndex)].title}
              className="w-full h-full object-cover"
            />
          </div>
        }
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="이전 이미지"
      >
        <ChevronLeft className="h-6 w-6 text-[#808080]" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="다음 이미지"
      >
        <ChevronRight className="h-6 w-6 text-[#808080]" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentIndex === index ? "bg-[#fb6f92] w-4" : "bg-[#808080]/30",
            )}
            aria-label={`${index + 1}번 이미지로 이동`}
          />
        ))}
      </div>
    </div>
  )
}
