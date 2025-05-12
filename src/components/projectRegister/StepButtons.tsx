"use client"

interface StepButtonsProps {
  currentStep: number
  onNext: () => void
  onPrev: () => void
  onCancel: () => void
  onSubmit: () => void
}

export default function StepButtons({ currentStep, onNext, onPrev, onCancel, onSubmit }: StepButtonsProps) {
  return (
    <div className="flex justify-center gap-4 mt-10">
      {/* 왼쪽 버튼 (단계에 따라 다름) */}
      <button
        type="button"
        onClick={currentStep === 3 ? onSubmit : onNext}
        className="bg-main-color text-white font-bold py-4 px-12 rounded-full min-w-[200px]"
      >
        {currentStep === 3 ? "등록" : "다음 단계로"}
      </button>

      {/* 오른쪽 버튼 (단계에 따라 다름) */}
      <button
        type="button"
        onClick={currentStep === 1 ? onCancel : onPrev}
        className="bg-gray-200 text-gray-700 font-bold py-4 px-12 rounded-full min-w-[200px]"
      >
        {currentStep === 1 ? "취소" : "이전 단계로"}
      </button>
    </div>
  )
}
