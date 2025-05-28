"use client"

import { useState } from "react"
import { useProjectFormStore } from "@/stores/useProjectFormStore"
import ConfirmModal from "@/components/common/ConfirmModal"
import ValidationModal from "./ValidationModal"
import { CancelButton, PrimaryButton } from "../common/Button"

interface StepButtonsProps {
  currentStep: number
  onNext: () => void
  onPrev: () => void
  onCancel: () => void
  onSubmit: () => void
}

export default function StepButtons({ currentStep, onNext, onPrev, onCancel, onSubmit }: StepButtonsProps) {
  const { isSubmitting } = useProjectFormStore()

  // 취소 확인 모달 상태 추가
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  // 검증 모달 상태 추가
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false)

  // 취소 버튼 클릭 핸들러
  const handleCancelClick = () => {
    setIsCancelModalOpen(true)
  }

  // 취소 확인 핸들러
  const handleConfirmCancel = () => {
    setIsCancelModalOpen(false)
    onCancel()
  }

  // 등록 버튼 클릭 핸들러
  const handleSubmitClick = () => {
    setIsValidationModalOpen(true)
  }

  // 등록 확인 핸들러
  const handleConfirmSubmit = () => {
    setIsValidationModalOpen(false)
    onSubmit()
  }

  return (
    <div className="flex justify-center gap-4 mt-10">
      {/* 취소 확인 모달 */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        message="상품 등록을 취소하시겠습니까?"
      />

      {/* 검증 모달 */}
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        onConfirm={handleConfirmSubmit}
      />

      {/* 왼쪽 버튼 (단계에 따라 다름) */}
      <PrimaryButton
        type="button"
        onClick={currentStep === 3 ? handleSubmitClick : onNext}
        className="bg-main-color text-white font-bold py-4 px-12 rounded-full min-w-[200px]"
      >
        {currentStep === 3 ? "등록" : "다음 단계로"}
      </PrimaryButton>

      {/* 오른쪽 버튼 (단계에 따라 다름) */}
      <CancelButton
        type="button"
        onClick={currentStep === 1 ? handleCancelClick : onPrev}
        className="bg-gray-200 text-gray-700 font-bold py-4 px-12 rounded-full min-w-[200px]"
      >
        {currentStep === 1 ? "취소" : "이전 단계로"}
      </CancelButton>
    </div>
  )
}
