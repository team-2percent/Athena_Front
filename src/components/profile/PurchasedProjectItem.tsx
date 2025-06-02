"use client"

import type React from "react"
import { Heart, Check, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ReviewForm from "./ReviewForm"
import { cn } from "@/lib/utils"
import { PrimaryButton } from "../common/Button"

interface PurchasedProjectItemProps {
  orderId: number
  sellerName: string
  productName: string
  projectName: string
  orderedAt: string
  endAt: string
  imageUrl: string
  achievementRate: number
  projectId: number
  hasCommented: boolean
}

export default function PurchasedProjectItem({
  orderId,
  sellerName,
  productName,
  projectName,
  orderedAt,
  endAt,
  imageUrl,
  achievementRate,
  projectId,
  hasCommented,
}: PurchasedProjectItemProps) {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)
  const router = useRouter()

  const daysLeft = endAt ? Math.max(0, Math.ceil((new Date(endAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : null
  const isCompleted = new Date(endAt) < new Date()

  const handleProjectClick = () => {
    router.push(`/project/${projectId}`)
  }

  const handleReviewClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!hasCommented) {
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
            <div className="mb-1 text-sub-gray">{sellerName} 님의 판매 상품</div>
            <h3 className="text-xl font-medium mb-1">{productName || "상품 이름"}</h3>
            <p className="text-gray-700 mb-2 whitespace-pre-wrap break-words line-clamp-2">{projectName} 에서 구매</p>

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
                <PrimaryButton
                  className="flex items-center gap-2 px-4 py-2 transition-colors w-full justify-center"
                  disabled={hasCommented}
                  onClick={handleReviewClick}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{hasCommented ? "후기 작성 완료" : "후기 작성"}</span>
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 후기 작성 모달 */}
      <ReviewForm
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        projectId={projectId}
        projectName={productName}
        sellerName={sellerName}
      />
    </>
  )
}
