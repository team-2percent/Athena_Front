"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import clsx from "clsx"
import { listType, sortName } from "@/lib/listConstant"

interface ListHeaderProps {
  type: "category" | "search" | "new" | "deadline"
  count: number
  searchWord?: string
  sort?: string | null
  onClickSort?: (sort: string) => void
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

  // 정렬 옵션 클릭 핸들러
  const handleSortClick = (sortOption: string) => {
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

  return (
    <div className="flex justify-between items-center w-full py-3 border-b border-gray-100 mb-8" data-cy="list-header">
        {/* 상품 개수 표시 */}
        <div className="flex text-gray-500 font-normal" data-cy="list-header-info">
                {type === "search" && searchWord && <p><span className="text-main-color font-normal" data-cy="list-header-search-word">{searchWord}</span>와 연관된&nbsp;</p>}
                <p>
                <span className="text-main-color font-normal" data-cy="list-header-count">{count}</span>개의 상품이 있습니다.
                </p>
        </div>

        {/* 필터 드롭다운 */}
        {sort && (
            <div className="relative">
            <button
                ref={buttonRef}
                className="flex items-center text-main-color font-normal"
                onClick={() => setIsOpen(!isOpen)}
                data-cy="list-header-sort-button"
            >
                {sortName[sort as keyof typeof sortName]} {isOpen ? <ChevronUp className="ml-1 h-5 w-5" /> : <ChevronDown className="ml-1 h-5 w-5" />}
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
                {type !== "new" && listType[type].sort.map((option) => (
                    <button
                    key={option}
                    className={clsx("font-normal", sort === option ? "text-main-color" : "text-gray-500")}
                    onClick={() => handleSortClick(option as "deadline" | "recommend" | "view" | "achievement")}
                    data-cy={`list-header-sort-${option}`}
                    >
                    {sortName[option as keyof typeof sortName]}
                    </button>
                ))}
                </div>
            )}
            </div>
        )}
    </div>
  )
}
