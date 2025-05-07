"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import clsx from "clsx"

interface ListHeaderProps {
  type: "category" | "search" | "new" | "deadline"
  count: number
  searchWord?: string
  sort?: "new" | "deadline" | "recommend" | "view" | "achievement" | null
  onClickSort?: (sort: "deadline" | "recommend" | "view" | "achievement") => void
  category?: {
    id: number
    name: string
  }
  onClickCategory?: (id: number) => void
}

export default function ListHeader({ type, count, searchWord, sort, onClickSort, category, onClickCategory }: ListHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 현재 정렬 방식에 따른 텍스트 표시
  const getSortText = () => {
    console.log(sort);
    if (!sort) return null

    switch (sort) {
      case "new":
        return "최신순"
      case "deadline":
        return "마감순"
      case "recommend":
        return "추천순"
      case "view":
        return "조회순"
      case "achievement":
        return "달성률순"
      default:
        return null
    }
  }

  // 정렬 옵션 클릭 핸들러
  const handleSortClick = (sortOption: "deadline" | "recommend" | "view" | "achievement") => {
    if (onClickSort) {
      onClickSort(sortOption)
    }
    setIsOpen(false)
  }

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // type에 따른 드롭다운 메뉴 옵션 가져오기
  const getDropdownOptions = () => {
    switch (type) {
      case "deadline":
        return [
          { value: "deadline", label: "마감순" },
          { value: "recommend", label: "추천순" },
          { value: "view", label: "조회순" },
          { value: "achievement", label: "달성률순" },
        ]
      case "category":
        return [
          { value: "new", label: "최신순" },
          { value: "recommend", label: "추천순" },
          { value: "view", label: "조회순" },
          { value: "achievement", label: "달성률순" },
        ]
      case "search":
        return [
          { value: "new", label: "최신순" },
          { value: "recommend", label: "추천순" },
          { value: "view", label: "조회순" },
          { value: "achievement", label: "달성률순" },
        ]
      default:
        return []
    }
  }

  return (
    <div className="flex justify-between items-center w-full max-w-7xl mx-auto py-3 border-b border-gray-100 mb-8">
        {/* 상품 개수 표시 */}
        <div className="flex text-gray-500 font-normal">
                {type === "search" && searchWord && <p><span className="text-pink-400 font-normal">{searchWord}</span>와 연관된&nbsp;</p>}
                <p>
                <span className="text-pink-400 font-normal">{count.toLocaleString()}</span>개의 상품이 있습니다.
                </p>
        </div>

        {/* 필터 드롭다운 */}
        {sort && (
            <div className="relative">
            <button
                ref={buttonRef}
                className="flex items-center text-pink-400 font-normal"
                onClick={() => setIsOpen(!isOpen)}
            >
                {getSortText()} {isOpen ? <ChevronUp className="ml-1 h-5 w-5" /> : <ChevronDown className="ml-1 h-5 w-5" />}
            </button>

            {/* 드롭다운 메뉴 */}
            {isOpen && (
                <div
                ref={dropdownRef}
                className="fixed bg-white z-50 flex flex-col items-center space-y-3 py-3 px-4 rounded-xl"
                style={{
                    top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 8 : 0,
                    right: buttonRef.current ? window.innerWidth - buttonRef.current.getBoundingClientRect().right : 0,
                }}
                >
                {getDropdownOptions().map((option) => (
                    <button
                    key={option.value}
                    className={clsx("font-normal", sort === option.value ? "text-pink-400" : "text-gray-500")}
                    onClick={() => handleSortClick(option.value as "deadline" | "recommend" | "view" | "achievement")}
                    >
                    {option.label}
                    </button>
                ))}
                </div>
            )}
            </div>
        )}
    </div>
  )
}
