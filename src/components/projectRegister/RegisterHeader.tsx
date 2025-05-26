"use client"

import { useProjectFormStore } from "@/stores/useProjectFormStore"
import { Check } from "lucide-react"

interface RegisterHeaderProps {
  currentStep: number
  onStepChange?: (step: number) => void
  title?: string
}

// 원형 게이지 컴포넌트
interface CircularProgressProps {
  progress: number // 0-100 사이의 값
  completed: number
  total: number
  stepName: string
  isActive: boolean
  onClick?: () => void
}

const CircularProgress = ({ progress, completed, total, stepName, isActive, onClick }: CircularProgressProps) => {
  // 크기를 줄임 (45 -> 40)
  const radius = 40
  const strokeWidth = 4
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (progress / 100) * circumference
  const isCompleted = completed === total && total > 0

  return (
    <div className={`flex items-center cursor-pointer ${isActive ? "opacity-100" : "opacity-50"}`} onClick={onClick}>
      {/* 원형 게이지 - 크기 줄임 (w-24 h-24 -> w-20 h-20) */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* 배경 원 */}
          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* 진행률 원 */}
          <circle
            stroke="#EC4899"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-300 ease-in-out"
          />
        </svg>

        {/* 중앙의 아이콘 (완료 시 체크마크, 미완료 시 점 3개) - 크기 줄임 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isCompleted ? (
            <Check className="w-6 h-6 text-pink-500" />
          ) : (
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* 텍스트 영역 - 여백 줄임 (ml-4 -> ml-2) */}
      <div className="ml-2">
        <div className="text-sm font-medium text-gray-700 mb-0.5">{stepName}</div>
        {/* 폰트 크기 줄임 (text-2xl -> text-xl) */}
        <div className="text-xl font-bold text-gray-900">
          {completed} / {total} 완료
        </div>
      </div>
    </div>
  )
}

export default function RegisterHeader({
  currentStep = 1,
  onStepChange,
  title = "상품 입력하기",
}: RegisterHeaderProps) {
  // Zustand 스토어에서 폼 데이터 가져오기
  const formData = useProjectFormStore()

  // 각 단계별 필수 항목 체크 함수
  const getStepProgress = (step: number) => {
    switch (step) {
      case 1: {
        // 1단계 필수 항목: 카테고리, 제목, 요약, 목표금액, 펀딩일정, 배송예정일
        // 대표 이미지는 1개라도 있으면 카운팅되지만 필수는 아님
        const requiredFields = [
          formData.categoryId,
          formData.title,
          formData.description,
          formData.targetAmount,
          formData.startDate,
          formData.endDate,
          formData.deliveryDate,
        ]

        let completed = requiredFields.filter((field) => {
          if (typeof field === "string") return field.trim() !== ""
          if (field instanceof Date) return true
          if (typeof field === "number") return field > 0
          return Boolean(field)
        }).length

        // 이미지가 1개라도 있으면 추가 카운팅 (필수는 아니지만 있으면 카운팅)
        if (formData.images && formData.images.length > 0) {
          completed += 1
        }

        return { completed, total: requiredFields.length + 1 } // 이미지 포함하여 총 8개
      }

      case 2: {
        // 2단계 필수 항목: 마크다운 내용만
        // (예산 계획과 프로젝트 일정은 필수가 아니므로 제외)
        const requiredFields = [formData.markdown]

        const completed = requiredFields.filter((field) => {
          if (typeof field === "string") return field.trim() !== ""
          return Boolean(field)
        }).length

        return { completed, total: requiredFields.length }
      }

      case 3: {
        // 3단계 필수 항목: 후원 상품 1개 이상, 플랫폼 플랜, 계좌 정보
        const hasValidSupportOption = formData.supportOptions.some(
          (option) =>
            option.name.trim() !== "" &&
            option.price.trim() !== "" &&
            option.description.trim() !== "" &&
            option.stock.trim() !== "",
        )

        const requiredFields = [hasValidSupportOption, formData.platformPlan, formData.bankAccountId]

        const completed = requiredFields.filter(Boolean).length

        return { completed, total: requiredFields.length }
      }

      default:
        return { completed: 0, total: 1 }
    }
  }

  // 단계 클릭 핸들러 - 모든 단계로 이동 가능하도록 수정
  const handleStepClick = (step: number) => {
    if (onStepChange) {
      onStepChange(step)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="w-full mb-8">
      {/* 제목과 스텝 인디케이터를 같은 가로선상에 배치 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        {/* 제목 */}
        <h1 className="text-4xl font-bold mb-8 md:mb-0">{title}</h1>

        {/* 단계별 원형 게이지 - 간격 조정 */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6 w-full md:w-auto">
          {[1, 2, 3].map((step) => {
            const stepNames = ["기본 정보", "상품 상세 설명", "후원 설정"]
            const { completed, total } = getStepProgress(step)
            const progress = total > 0 ? (completed / total) * 100 : 0

            return (
              <CircularProgress
                key={step}
                progress={progress}
                completed={completed}
                total={total}
                stepName={stepNames[step - 1]}
                isActive={step === currentStep}
                onClick={() => handleStepClick(step)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
