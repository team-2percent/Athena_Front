"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const desserts = [
  {
    id: 1,
    image: "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvODA0ZjQ3NmYtN2U3MS00ZDI5LTk2NDktYTVlMDcyYzIwZDRhL2JmNzVmMjkzLThjOGYtNDgyMS04YWYwLTEzYzQyZjE0YWIxMy5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ2NSwiaGVpZ2h0Ijo0NjUsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ==",
    alt: "전통 디저트 상자",
    title: "트러플 판매자",
    subtitle: "무슨무슨 트러플 초콜릿",
    badge: "10000% 달성!",
    description: "뭔가 뭔가 만들어서 어쩌구저쩌구 합니다 사려면 지금이 기회!",
  },
  {
    id: 2,
    image: "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvOTMwYTE2MzktODFiMS00YTUzLTkzYmQtMDk1NTRlZmMyMDQzL2I1ZjQwZjY0LWRhNDQtNGJmMC1hNmUxLWVhY2RmOTI4NzUzYS5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ2NSwiaGVpZ2h0Ijo0NjUsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ==",
    alt: "트러플 초콜릿",
    title: "트러플 판매자",
    subtitle: "무슨무슨 트러플 초콜릿",
    badge: "10000% 달성!",
    description: "뭔가 뭔가 만들어서 어쩌구저쩌구 합니다 사려면 지금이 기회!",
  },
  {
    id: 3,
    image: "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvNmM5M2ZhZjAtYzkzOC00ZjE2LTkzZTctZGM2ZTk5ZGM1ZTk4L2Q4YmYxNzBmLTY2NGItNDRlMS04NGU1LTNjYjUyZGY0YzVlYy5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ2NSwiaGVpZ2h0Ijo0NjUsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ==",
    alt: "특별 디저트",
    title: "트러플 판매자",
    subtitle: "무슨무슨 트러플 초콜릿",
    badge: "10000% 달성!",
    description: "뭔가 뭔가 만들어서 어쩌구저쩌구 합니다 사려면 지금이 기회!",
  },
  {
    id: 4,
    image: "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvNmM5M2ZhZjAtYzkzOC00ZjE2LTkzZTctZGM2ZTk5ZGM1ZTk4L2Q4YmYxNzBmLTY2NGItNDRlMS04NGU1LTNjYjUyZGY0YzVlYy5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ2NSwiaGVpZ2h0Ijo0NjUsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ==",
    alt: "특별 디저트",
    title: "트러플 판매자",
    subtitle: "무슨무슨 트러플 초콜릿",
    badge: "10000% 달성!",
    description: "뭔가 뭔가 만들어서 어쩌구저쩌구 합니다 사려면 지금이 기회!",
  },
  {
    id: 5,
    image: "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvNmM5M2ZhZjAtYzkzOC00ZjE2LTkzZTctZGM2ZTk5ZGM1ZTk4L2Q4YmYxNzBmLTY2NGItNDRlMS04NGU1LTNjYjUyZGY0YzVlYy5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ2NSwiaGVpZ2h0Ijo0NjUsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ==",
    alt: "특별 디저트",
    title: "트러플 판매자",
    subtitle: "무슨무슨 트러플 초콜릿",
    badge: "10000% 달성!",
    description: "뭔가 뭔가 만들어서 어쩌구저쩌구 합니다 사려면 지금이 기회!",
  },
]

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? desserts.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === desserts.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      goToNext()
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      goToPrevious()
    }
  }

  // Get the previous, current, and next indices with wrap-around
  const getPrevIndex = (index: number) => {
    return index === 0 ? desserts.length - 1 : index - 1
  }

  const getNextIndex = (index: number) => {
    return index === desserts.length - 1 ? 0 : index + 1
  }

  return (
    <div className="w-full relative py-10 overflow-hidden bg-secondary-color">
      <div
        ref={carouselRef}
        className="flex items-center justify-center gap-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Slide (Left Side) */}
        <div className="relative w-1/2 h-[350px] md:h-[400px] opacity-70 transform transition-all duration-300 rounded-xl overflow-hidden shrink-0">
          <img
            src={desserts[getPrevIndex(currentIndex)].image || "/placeholder.svg"}
            alt={desserts[getPrevIndex(currentIndex)].alt}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Current Slide (Center) */}
        <div className="relative w-1/2 h-[350px] md:h-[400px] z-10 transition-all duration-300 rounded-xl overflow-hidden shrink-0">
          <img
            src={desserts[currentIndex].image || "/placeholder.svg"}
            alt={desserts[currentIndex].alt}
            className="w-full h-full object-cover"
          />

          {desserts[currentIndex].title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
              <div className="space-y-1">
                <p className="text-sm font-medium">{desserts[currentIndex].title}</p>
                {desserts[currentIndex].subtitle && (
                  <h2 className="text-xl md:text-2xl font-bold">{desserts[currentIndex].subtitle}</h2>
                )}
                {desserts[currentIndex].badge && (
                  <span className="inline-block bg-[#fb6f92] text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    {desserts[currentIndex].badge}
                  </span>
                )}
                <p className="text-xs mt-1">{desserts[currentIndex].description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Next Slide (Right Side) */}
        <div className="relative w-1/2 h-[350px] md:h-[400px] opacity-70 transform transition-all duration-300 rounded-xl overflow-hidden shrink-0">
          <img
            src={desserts[getNextIndex(currentIndex)].image || "/placeholder.svg"}
            alt={desserts[getNextIndex(currentIndex)].alt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-20"
        aria-label="이전 이미지"
      >
        <ChevronLeft className="h-6 w-6 text-[#808080]" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-20"
        aria-label="다음 이미지"
      >
        <ChevronRight className="h-6 w-6 text-[#808080]" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {desserts.map((_, index) => (
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
