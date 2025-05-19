"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  totalPages: number
  initialPage?: number
  onPageChange?: (page: number) => void
}

export default function Pagination({ totalPages, initialPage = 1, onPageChange }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)

  // initialPage prop이 변경되면 currentPage 상태 업데이트
  useEffect(() => {
    setCurrentPage(initialPage)
  }, [initialPage])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    onPageChange?.(page)
  }

  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const result = []
    const maxPagesToShow = 4 // 가운데 표시되는 페이지 번호 개수

    if (totalPages <= maxPagesToShow) {
      // 전체 페이지가 4개 이하면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        result.push({ type: "page", value: i })
      }
    } else {
      // 현재 페이지 기준으로 앞뒤로 페이지 번호 계산
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
      let endPage = startPage + maxPagesToShow - 1

      // 끝 페이지가 총 페이지 수를 초과하는 경우 조정
      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      // 페이지 번호 추가
      for (let i = startPage; i <= endPage; i++) {
        result.push({ type: "page", value: i })
      }

      // 마지막 페이지 이전에 생략 부호 추가
      if (endPage < totalPages) {
        result.push({ type: "ellipsis" })
        result.push({ type: "page", value: totalPages })
      }
    }

    return result
  }

  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      {/* 첫 페이지로 이동 버튼 */}
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-full",
          currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-black hover:bg-gray-100",
        )}
        aria-label="첫 페이지로 이동"
      >
        <ChevronsLeft className="h-5 w-5" />
      </button>

      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-full",
          currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-black hover:bg-gray-100",
        )}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* 페이지 번호 */}
      {getPageNumbers().map((item, index) => {
        if (item.type === "ellipsis") {
          return (
            <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-black">
              ...
            </span>
          )
        }

        return (
          <button
            key={`page-${item.value}`}
            onClick={() => handlePageChange(item.value || 1)} // 오류 생길 수 있으니 잘 보고 고쳐주세여...
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full",
              currentPage === item.value ? "bg-[#FFB3C6] text-white font-medium" : "text-black hover:bg-gray-100",
            )}
          >
            {item.value}
          </button>
        )
      })}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-full",
          currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-black hover:bg-gray-100",
        )}
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* 마지막 페이지로 이동 버튼 */}
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-full",
          currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-black hover:bg-gray-100",
        )}
        aria-label="마지막 페이지로 이동"
      >
        <ChevronsRight className="h-5 w-5" />
      </button>
    </div>
  )
}
