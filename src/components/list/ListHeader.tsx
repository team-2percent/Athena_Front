"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import clsx from "clsx"
import { listType, sortName } from "@/lib/listConstant"
import Dropdown, { DropdownOption } from "@/components/common/Dropdown"

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
          <div className="min-w-[100px]">
            <Dropdown
              options={type !== "new" ? listType[type].sort.map((option) => ({ label: sortName[option as keyof typeof sortName], value: option })) : []}
              value={sort}
              onChange={(opt) => handleSortClick(opt.value as string)}
              placeholder="정렬 순서"
              className="text-main-color"
              designType="borderless"
            />
          </div>
        )}
    </div>
  )
}
