"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

// 인기 검색어 데이터
const popularSearches = [
  { id: 1, term: "타로" },
  { id: 2, term: "별자리" },
  { id: 3, term: "운세" },
  { id: 4, term: "사주" },
  { id: 5, term: "궁합" },
  { id: 6, term: "타로카드" },
  { id: 7, term: "점성술" },
  { id: 8, term: "신년운세" },
  { id: 9, term: "토정비결" },
  { id: 10, term: "사주팔자" },
]

export default function PopularSearch() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)

  // 현재 항목과 다음 항목
  const currentItem = popularSearches[currentIndex]
  const nextItem = popularSearches[nextIndex]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)

      // 애니메이션 완료 후 상태 업데이트
      const timer = setTimeout(() => {
        setCurrentIndex(nextIndex)
        setNextIndex((nextIndex + 1) % popularSearches.length)
        setIsAnimating(false)
      }, 500) // 애니메이션 지속 시간과 일치

      return () => clearTimeout(timer)
    }, 3000) // 3초마다 변경

    return () => clearInterval(interval)
  }, [nextIndex])

  const handleSearchClick = (term: string) => {
    console.log(`검색어 "${term}" 클릭됨`)
    // 여기에 검색 페이지로 이동하는 로직 추가
  }

  return (
    <div className="w-[200px] mx-auto">
      <div className="flex items-center">
        <div className="text-pink-400 font-medium mr-auto">인기 검색</div>
        <div className="flex items-center border-b border-gray-300 w-[120px]">
          <div className="relative overflow-hidden h-6 flex-grow">
            <div className="inner-wrapper relative w-full h-full">
              {/* 현재 항목 */}
              <button
                type="button"
                className={`flex items-center h-6 w-full text-left absolute top-0 left-0 transition-transform duration-500 ${
                  isAnimating ? "-translate-y-full" : "translate-y-0"
                }`}
                onClick={() => handleSearchClick(currentItem.term)}
              >
                <span className="text-pink-400 font-bold mr-2">{currentItem.id}</span>
                <span className="text-gray-800 truncate">{currentItem.term}</span>
              </button>

              {/* 다음 항목 */}
              <button
                type="button"
                className={`flex items-center h-6 w-full text-left absolute top-full left-0 transition-transform duration-500 ${
                  isAnimating ? "translate-y-full" : "translate-y-0"
                }`}
                onClick={() => handleSearchClick(nextItem.term)}
              >
                <span className="text-pink-400 font-bold mr-2">{nextItem.id}</span>
                <span className="text-gray-800 truncate">{nextItem.term}</span>
              </button>
            </div>
          </div>
          <button type="button" className="ml-1">
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
