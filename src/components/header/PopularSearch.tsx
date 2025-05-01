"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface PopularSearchProps {
  onSearchChange: (word: string) => void
  onSearch: (word: string) => void
}

// mock data: 인기 검색어 데이터 추후 삭제
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

export default function PopularSearch({ onSearchChange, onSearch }: PopularSearchProps) {
  const [currentIndex, setCurrentIndex] = useState(0) // 현재 순위
  const [nextIndex, setNextIndex] = useState(1) // 다음 순위
  const [isAnimating, setIsAnimating] = useState(false) // 애니메이션 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // 드롭다운 열림 여부

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
      }, 500)

      return () => clearTimeout(timer)
    }, 3000) // 검색어 유지 시간 3초

    return () => clearInterval(interval)
  }, [nextIndex])

  // 검색어 클릭
  const handleSearchClick = (word: string) => {
    onSearchChange(word)
    onSearch(word);
  }

  // 드롭다운 열기/닫기
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

    // 드롭다운 내 검색어 클릭
  const handleDropdownItemClick = async (word: string) => {
    setIsDropdownOpen(false)
    onSearchChange(word)
    onSearch(word);
    console.log(`드롭다운에서 선택된 검색어: ${word}`)
  }

  return (
    <div className="w-[200px]">
      <div className="flex items-center">
        <div className="text-pink-400 font-medium mr-auto">인기 검색</div>
        <div className="relative flex items-center border-b border-gray-300 w-[120px]">
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
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              onClick={toggleDropdown}
            />
          </button>
          {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-[140px] bg-white border border-gray-200 rounded-xl shadow-lg z-10 h-fit">
                <div className="py-2">
                {popularSearches.map(item => (
                    <button
                    key={item.id}
                    type="button"
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50"
                    onClick={() => handleDropdownItemClick(item.term)}
                    >
                    <span className="text-pink-400 font-bold mr-4">{item.id}</span>
                    <span className="text-gray-800">{item.term}</span>
                    </button>
                ))}
                </div>
            </div>
            )}
        </div>
        
      </div>
      
    </div>
  )
}
