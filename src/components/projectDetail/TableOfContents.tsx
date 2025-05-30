"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight } from "lucide-react"

interface Heading {
  level: number
  text: string
  id: string
}

interface TableOfContentsProps {
  headings: Heading[]
}

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("")
  const [scrollProgress, setScrollProgress] = useState(0)
  const navRef = useRef<HTMLElement>(null)

  // 스크롤 위치에 따른 활성 섹션 감지 및 진행률 계산
  useEffect(() => {
    const handleScroll = () => {
      const headerOffset = 120 // 헤더 높이 + 여유 공간

      // 현재 화면 상단에 가장 가까운 헤딩 찾기
      let currentActiveId = ""
      let minDistance = Number.POSITIVE_INFINITY

      headings.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const distanceFromTop = Math.abs(rect.top - headerOffset)

          // 헤딩이 화면 상단 근처에 있고, 가장 가까운 것을 찾기
          if (rect.top <= headerOffset + 50 && distanceFromTop < minDistance) {
            minDistance = distanceFromTop
            currentActiveId = id
          }
        }
      })

      // 만약 화면 상단에 헤딩이 없다면, 화면 위에 지나간 헤딩 중 가장 최근 것을 선택
      if (!currentActiveId) {
        for (let i = headings.length - 1; i >= 0; i--) {
          const { id } = headings[i]
          const element = document.getElementById(id)
          if (element) {
            const rect = element.getBoundingClientRect()
            if (rect.top < headerOffset) {
              currentActiveId = id
              break
            }
          }
        }
      }

      setActiveId(currentActiveId)

      // 스크롤 진행률 계산 (전체 문서 기준)
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      const maxScroll = documentHeight - windowHeight
      const progress = maxScroll > 0 ? Math.min((scrollTop / maxScroll) * 100, 100) : 0

      setScrollProgress(progress)
    }

    // 초기 실행
    handleScroll()

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [headings])

  // 활성 항목이 변경될 때 목차에서 해당 항목이 보이도록 스크롤
  useEffect(() => {
    if (activeId && navRef.current) {
      const activeButton = navRef.current.querySelector(`button[data-id="${activeId}"]`) as HTMLElement
      if (activeButton) {
        const navContainer = navRef.current
        const containerRect = navContainer.getBoundingClientRect()
        const buttonRect = activeButton.getBoundingClientRect()

        // 버튼이 컨테이너 영역을 벗어났는지 확인
        const isAbove = buttonRect.top < containerRect.top
        const isBelow = buttonRect.bottom > containerRect.bottom

        if (isAbove || isBelow) {
          // 버튼을 컨테이너 중앙에 위치시키도록 스크롤
          const buttonOffsetTop = activeButton.offsetTop
          const containerHeight = navContainer.clientHeight
          const buttonHeight = activeButton.clientHeight
          const scrollTo = buttonOffsetTop - containerHeight / 2 + buttonHeight / 2

          navContainer.scrollTo({
            top: scrollTo,
            behavior: "smooth",
          })
        }
      }
    }
  }, [activeId])

  // 목차 항목 클릭 시 스크롤 이동
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // 헤더 높이를 고려하여 약간 위로 스크롤
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <div className="sticky top-24 h-fit">
      <div className="bg-white border border-[var(--color-gray-border)] rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <ChevronRight className="h-5 w-5 text-[var(--color-main-color)]" />
          목차
        </h3>

        <nav
          ref={navRef}
          className="space-y-1 max-h-[64vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {headings.map(({ level, text, id }) => (
            <button
              key={id}
              data-id={id} // 활성 항목 찾기를 위한 데이터 속성
              onClick={() => scrollToHeading(id)}
              title={text} // 전체 텍스트를 툴팁으로 표시
              className={`
                block w-full text-left py-2 px-1 text-sm transition-all duration-75 truncate
                ${level === 1 ? "font-semibold" : level === 2 ? "font-medium ml-3" : "ml-6"}
                ${
                  activeId === id
                    ? "text-[var(--color-main-color)] border-b-2 border-[var(--color-main-color)] font-bold"
                    : "text-[var(--color-sub-gray)] hover:text-foreground"
                }
              `}
            >
              <span className="line-clamp-1 truncate">{text}</span>
            </button>
          ))}
        </nav>

        {/* 진행률 표시 (스크롤 기준) */}
        <div className="mt-6 pt-4 border-t border-[var(--color-gray-border)]">
          <div className="flex items-center justify-between text-xs text-[var(--color-sub-gray)] mb-2">
            <span>읽기 진행률</span>
            <span>{Math.round(scrollProgress)}%</span>
          </div>
          <div className="w-full bg-[var(--color-gray-border)] rounded-full h-1.5">
            <div
              className="bg-[var(--color-main-color)] h-1.5 rounded-full transition-all duration-75"
              style={{
                width: `${scrollProgress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableOfContents
