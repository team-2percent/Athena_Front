"use client"

interface RegisterHeaderProps {
  currentStep: number
  onStepChange?: (step: number) => void
}

export default function RegisterHeader({ currentStep = 1, onStepChange }: RegisterHeaderProps) {
  // 현재 단계에 따라 다른 제목 표시
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "기본 정보"
      case 2:
        return "상품 상세 설명"
      case 3:
        return "본인(팀) 소개"
      default:
        return "기본 정보"
    }
  }

  // 단계 표시기 클릭 시 해당 단계로 이동
  const handleStepClick = (step: number) => {
    if (onStepChange && step <= currentStep) {
      onStepChange(step)
      // 화면을 맨 위로 스크롤
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="w-full mb-8">
      {/* 제목 */}
      <h1 className="text-4xl font-bold mb-8">상품 입력하기</h1>

      <div className="flex justify-between items-center">
        {/* 단계별 제목 버튼 */}
        <div className="flex">
          <button className="bg-pink-300 text-white font-medium py-3 px-8 rounded-full">{getStepTitle()}</button>
        </div>

        {/* 단계 표시기 */}
        <div className="flex items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                onClick={() => handleStepClick(step)}
                className={`flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold ${
                  step <= currentStep ? "bg-pink-400 text-white cursor-pointer" : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>

              {/* 연결선 (마지막 단계 제외) - 이전 단계와 현재 단계 사이의 연결선도 활성화 */}
              {step < 3 && <div className={`w-12 h-1 ${step < currentStep ? "bg-pink-400" : "bg-gray-200"}`}></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
