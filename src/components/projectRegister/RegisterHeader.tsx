"use client"

import { useProjectFormStore } from "@/stores/useProjectFormStore"
import { Check } from "lucide-react"
import { z } from "zod"

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
  requiredCompleted: number
  requiredTotal: number
  stepName: string
  isActive: boolean
  onClick?: () => void
}

const CircularProgress = ({
  progress,
  completed,
  total,
  requiredCompleted,
  requiredTotal,
  stepName,
  isActive,
  onClick,
}: CircularProgressProps) => {
  // 크기를 줄임 (45 -> 40)
  const radius = 40
  const strokeWidth = 4
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (progress / 100) * circumference
  // 필수 항목만 완료되면 체크마크 표시
  const isCompleted = requiredCompleted === requiredTotal && requiredTotal > 0

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
            stroke="#F67E9C"
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

        {/* 중앙의 아이콘 (필수 항목 완료 시 체크마크, 미완료 시 점 3개) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isCompleted ? (
            <Check className="w-6 h-6 text-main-color" />
          ) : (
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-main-color rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-main-color rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-main-color rounded-full"></div>
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
  title = "프로젝트 입력하기",
}: RegisterHeaderProps) {
  // Zustand 스토어에서 폼 데이터 가져오기
  const formData = useProjectFormStore()

  // 각 단계별 필수 항목 체크 함수 - 필수/선택 항목 구분
  const getStepProgress = (step: number) => {
    switch (step) {
      case 1: {
        // 1단계 필수 항목: 카테고리, 제목, 설명, 목표금액, 시작일, 종료일, 배송일, 대표 이미지 (8개)
        const requiredFields = [
          { key: "categoryId", value: formData.categoryId, schema: z.number().min(1) },
          { key: "title", value: formData.title, schema: z.string().min(1).max(25) },
          { key: "description", value: formData.description, schema: z.string().min(10).max(50) },
          {
            key: "targetAmount",
            value: formData.targetAmount,
            schema: z
              .string()
              .min(1)
              .refine((val) => {
                const numericValue = Number(val.replace(/,/g, ""))
                return !isNaN(numericValue) && numericValue > 0 && numericValue <= 1000000000
              }),
          },
          {
            key: "startDate",
            value: formData.startDate,
            schema: z
              .date()
              .nullable()
              .refine((date) => {
                if (!date) return false
                const today = new Date()
                const minStartDate = new Date(today)
                minStartDate.setDate(today.getDate() + 7)
                const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                const minDateOnly = new Date(
                  minStartDate.getFullYear(),
                  minStartDate.getMonth(),
                  minStartDate.getDate(),
                )
                return dateOnly >= minDateOnly
              }),
          },
          {
            key: "endDate",
            value: formData.endDate,
            schema: z
              .date()
              .nullable()
              .refine((date) => {
                if (!date || !formData.startDate) return false
                return date >= formData.startDate
              }),
          },
          {
            key: "deliveryDate",
            value: formData.deliveryDate,
            schema: z
              .date()
              .nullable()
              .refine((date) => {
                if (!date || !formData.endDate) return false
                const minDeliveryDate = new Date(formData.endDate)
                minDeliveryDate.setDate(formData.endDate.getDate() + 7)
                const deliveryDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                const minDateOnly = new Date(
                  minDeliveryDate.getFullYear(),
                  minDeliveryDate.getMonth(),
                  minDeliveryDate.getDate(),
                )
                return deliveryDateOnly >= minDateOnly
              }),
          },
          {
            key: "images",
            value: formData.images,
            schema: z.array(z.any()).min(1),
          },
        ]

        let requiredCompleted = 0
        requiredFields.forEach((field) => {
          try {
            field.schema.parse(field.value)
            requiredCompleted++
          } catch (e) {
            // 유효성 검사 실패 시 카운팅하지 않음
          }
        })

        // 전체 완료 항목 = 필수 항목 완료 개수
        let totalCompleted = requiredCompleted

        return {
          completed: totalCompleted,
          total: requiredFields.length, // 8개
          requiredCompleted,
          requiredTotal: requiredFields.length, // 8개
        }
      }

      case 2: {
        // 2단계 필수 항목: 마크다운 내용 (1개)
        const hasValidMarkdown = formData.markdown && formData.markdown.trim() !== "" && formData.markdown.length >= 10

        return {
          completed: hasValidMarkdown ? 1 : 0,
          total: 1,
          requiredCompleted: hasValidMarkdown ? 1 : 0,
          requiredTotal: 1,
        }
      }

      case 3: {
        // 3단계 필수 항목: 후원상품, 플랫폼플랜, 계좌정보 (3개)
        let requiredCompleted = 0
        const requiredTotal = 3

        // 후원 상품 검사 (필수)
        const hasValidSupportOption = formData.supportOptions.some((option) => {
          try {
            const nameValid = option.name.trim() !== "" && option.name.length <= 25
            const priceValid = (() => {
              const numericValue = Number(option.price.replace(/,/g, ""))
              return !isNaN(numericValue) && numericValue > 0 && numericValue <= 1000000000
            })()
            const stockValid = (() => {
              const numericValue = Number(option.stock.replace(/,/g, ""))
              return !isNaN(numericValue) && numericValue >= 1 && numericValue <= 10000
            })()
            const descriptionValid = option.description.length <= 50

            return nameValid && priceValid && stockValid && descriptionValid
          } catch (e) {
            return false
          }
        })

        if (hasValidSupportOption) requiredCompleted++

        // 플랫폼 플랜 검사 (필수)
        if (formData.platformPlan && ["BASIC", "PRO", "PREMIUM"].includes(formData.platformPlan)) {
          requiredCompleted++
        }

        // 계좌 정보 검사 (필수)
        if (formData.bankAccountId && formData.bankAccountId > 0) {
          requiredCompleted++
        }

        return {
          completed: requiredCompleted,
          total: requiredTotal,
          requiredCompleted,
          requiredTotal,
        }
      }

      default:
        return {
          completed: 0,
          total: 1,
          requiredCompleted: 0,
          requiredTotal: 1,
        }
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
            const { completed, total, requiredCompleted, requiredTotal } = getStepProgress(step)
            const progress = total > 0 ? (completed / total) * 100 : 0

            return (
              <CircularProgress
                key={step}
                progress={progress}
                completed={completed}
                total={total}
                requiredCompleted={requiredCompleted}
                requiredTotal={requiredTotal}
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
