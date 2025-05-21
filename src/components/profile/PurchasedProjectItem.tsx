"use client"

import type React from "react"
import { Heart, Check, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ReviewForm from "./ReviewForm"
import { cn } from "@/lib/utils"

interface PurchasedProjectItemProps {
  id: number
  sellerName: string
  projectName: string
  description: string
  imageUrl: string
  achievementRate: number
  daysLeft: number | null // null인 경우 판매 종료
  isCompleted: boolean
  projectId: number
  hasReview: boolean
}

export default function PurchasedProjectItem({
  id,
  sellerName,
  projectName,
  description,
  imageUrl,
  achievementRate,
  daysLeft,
  isCompleted,
  projectId,
  hasReview,
}: PurchasedProjectItemProps) {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)
  const router = useRouter()

  const handleProjectClick = () => {
    router.push(`/project/${projectId}`)
  }

  const handleReviewClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!hasReview) {
      setIsReviewFormOpen(true)
    }
  }

  // 달성률이 100%를 초과하더라도 게이지 바는 100%까지만 표시
  const progressWidth = Math.min(achievementRate, 100)

  return (
    <>
      <div className="mb-8">
        <div className="flex gap-6 relative">
          {/* 상품 이미지 */}
          <div className="relative w-60 h-60 flex-shrink-0">
            {/* 상품 이미지 클릭 시 상품 상세 페이지로 이동 */}
            <div className="w-full h-full cursor-pointer" onClick={handleProjectClick}>
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={projectName}
                className={`w-full h-full object-cover rounded-lg ${isCompleted ? "brightness-50" : ""}`}
              />
            </div>

            {/* 하트 아이콘 */}
            <button
              type="button"
              className="absolute bottom-3 right-3 bg-white p-1.5 rounded-full shadow-md"
              aria-label="좋아요"
            >
              <Heart className="h-5 w-5 text-sub-gray" />
            </button>

            {/* 판매 완료 오버레이 */}
            {isCompleted && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-white cursor-pointer"
                onClick={handleProjectClick}
              >
                <div className="bg-white rounded-full p-2 mb-2">
                  <Check className="h-8 w-8 text-sub-gray" />
                </div>
                <div className="text-xl font-bold">판매 종료</div>
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="flex-1 flex flex-col w-64">
            <div className="mb-1 text-sub-gray">{sellerName}</div>
            <h3 className="text-xl font-medium mb-1">{projectName}</h3>
            <p className="text-gray-700 mb-2 whitespace-pre-wrap break-words line-clamp-2">{description}</p>

            {/* 달성률 게이지 */}
            <div className="mt-auto">
              <div className="flex justify-between mb-1">
                <span className={`font-bold ${isCompleted ? "text-sub-gray" : "text-main-color"}`}>
                  {achievementRate}% 달성{isCompleted ? "" : "!"}
                </span>
              </div>

              <div className={`w-full h-2 rounded-full ${isCompleted ? "bg-sub-gray" : "bg-secondary-color"}`}>
                <div
                  className={`h-full rounded-full bg-main-color ${isCompleted ? "bg-sub-gray" : "bg-main-color"}`}
                  style={{ width: `${progressWidth}%` }}
                ></div>
              </div>

              {/* 남은 일수 또는 종료 메시지 */}
              <div className="text-right mt-1">
                {isCompleted ? (
                  <span className="text-sub-gray">종료되었어요.</span>
                ) : (
                  <span className="text-sub-gray">{daysLeft}일 남았어요.</span>
                )}
              </div>

              {/* 후기 작성 버튼 */}
              <div className="flex justify-end mt-4">
                <button
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full justify-center",
                    hasReview
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-main-color text-white hover:bg-secondary-color-dark",
                  )}
                  onClick={handleReviewClick}
                  disabled={hasReview}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{hasReview ? "후기 작성 완료" : "후기 작성"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 후기 작성 모달 */}
      {isReviewFormOpen && (
        <ReviewForm
          isOpen={isReviewFormOpen}
          onClose={() => setIsReviewFormOpen(false)}
          projectId={projectId}
          projectName={projectName}
          sellerName={sellerName}
        />
      )}
    </>
  )
}
