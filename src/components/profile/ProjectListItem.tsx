"use client"

import type React from "react"
import { Heart, Check, Pencil, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { PrimaryButton, SecondaryButton } from "../common/Button"

interface ProjectItemProps {
  id: number
  sellerName: string
  projectName: string
  description: string
  imageUrl: string
  achievementRate: number
  daysLeft: number | null | undefined // null인 경우 판매 종료
  createdAt: string
  endAt: string
  isCompleted: boolean
  projectId: number
  isMy?: boolean
  onClickDelete?: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void
}

export default function ProjectItem({
  id,
  sellerName,
  projectName,
  description,
  createdAt,
  endAt,
  imageUrl,
  achievementRate,
  isCompleted,
  projectId,
  isMy,
  onClickDelete,
}: ProjectItemProps) {
  // 달성률이 100%를 초과하더라도 게이지 바는 100%까지만 표시
  const progressWidth = Math.min(achievementRate, 100)
  const router = useRouter()

  const daysLeft = Math.floor(
    (new Date(endAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  const handleProjectClick = () => {
    router.push(`/project/${projectId}`)
  }

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    router.push(`/project/${projectId}/edit`) // 특정 상품 수정 페이지로 이동
  }

  return (
    <div className="mb-6 sm:mb-8" data-cy="project-item">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 relative">
        {/* 상품 이미지 */}
        <div className="relative w-full h-40 sm:w-60 sm:h-60 flex-shrink-0">
          {/* 상품 이미지 클릭 시 상품 상세 페이지로 이동 */}
          <div className="w-full h-full cursor-pointer" onClick={handleProjectClick} data-cy="project-image">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={projectName}
              className={`w-full h-full object-cover rounded-lg ${isCompleted ? "brightness-50" : ""}`}
            />
          </div>

          {/* 판매 완료 오버레이 */}
          {isCompleted || (daysLeft < 0) && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-white cursor-pointer"
              onClick={handleProjectClick}
            >
              <div className="bg-white rounded-full p-2 mb-2">
                <Check className="h-6 w-6 sm:h-8 sm:w-8 text-sub-gray" />
              </div>
              <div className="text-lg sm:text-xl font-bold">판매 종료</div>
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 flex flex-col w-full sm:w-64">
          <div className="mb-1 text-sub-gray text-sm sm:text-base" data-cy="project-seller-name">{sellerName}</div>
          <h3 className="text-base sm:text-xl font-medium mb-1" data-cy="project-name">{projectName}</h3>
          <p className="text-gray-700 mb-2 text-xs sm:text-base" data-cy="project-created-at">{createdAt} 에 생성됨</p>

          {/* 달성률 게이지 */}
          <div className="mt-auto">
            <div className="flex justify-between mb-1">
              <span className={`font-bold ${isCompleted ? "text-sub-gray" : "text-main-color"} text-sm sm:text-base`} data-cy="project-achievement-rate">
                {achievementRate}% 달성{isCompleted ? "" : "!"}
              </span>
            </div>

            <div className={`w-full h-1.5 sm:h-2 rounded-full ${isCompleted || (daysLeft < 0) ? "bg-sub-gray" : "bg-secondary-color"}`}> 
              <div
                className={`h-full rounded-full bg-main-color ${isCompleted || (daysLeft < 0) ? "bg-sub-gray" : "bg-main-color"}`}
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>

            {/* 남은 일수 또는 종료 메시지 */}
            <div className="text-right mt-1 text-xs sm:text-base" data-cy="project-days-left">
              {isCompleted || (daysLeft < 0) ? (
                <span className="text-sub-gray" data-cy="project-end-message">종료되었어요.</span>
              ) : (
                <span className="text-sub-gray" data-cy="project-days-left">{daysLeft}일 남았어요.</span>
              )}
            </div>

            {/* 수정 및 삭제 버튼 - 아래로 이동 */}
            {isMy && (
              <div className="flex gap-2 sm:gap-4 mt-3 sm:mt-4 justify-end">
                <PrimaryButton
                  className="flex w-full items-center justify-center gap-2 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base"
                  onClick={handleEditClick}
                  dataCy="edit-button"
                >
                  <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>수정</span>
                </PrimaryButton>
                <SecondaryButton
                  className="flex w-full items-center justify-center gap-2 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base"
                  onClick={(e) => onClickDelete?.(e, id)}
                  dataCy="delete-button"
                >
                  <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>삭제</span>
                </SecondaryButton>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
