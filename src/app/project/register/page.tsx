"use client"

import { useState, useEffect } from "react"
import RegisterHeader from "@/components/projectRegister/RegisterHeader"
import StepButtons from "@/components/projectRegister/StepButtons"
import StepOneForm from "@/components/projectRegister/StepOneForm"
import StepTwoForm from "@/components/projectRegister/StepTwoForm"
import StepThreeForm from "@/components/projectRegister/StepThreeForm"
import { useRouter } from "next/navigation"

export default function ProjectRegister() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    targetAmount: "",
  })
  const router = useRouter()

  // 단계가 변경될 때 화면 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

  // Update form data
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data })
  }

  // 다음 단계로 이동
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      // 화면을 맨 위로 스크롤
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // 이전 단계로 이동
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      // 화면을 맨 위로 스크롤
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // 취소 처리
  const handleCancel = () => {
    // 취소 시 홈으로 이동하거나 다른 처리
    if (confirm("상품 등록을 취소하시겠습니까?")) {
      router.push("/")
    }
  }

  // 등록 처리
  const handleSubmit = () => {
    // 상품 등록 로직 구현
    alert("상품이 등록되었습니다.")
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4">
      <RegisterHeader currentStep={currentStep} onStepChange={setCurrentStep} />

      <div className="mt-8 mb-16">
        {/* 단계별 폼 컴포넌트 */}
        {currentStep === 1 && <StepOneForm onUpdateFormData={updateFormData} formData={formData} />}
        {currentStep === 2 && <StepTwoForm targetAmount={formData.targetAmount} />}
        {currentStep === 3 && <StepThreeForm />}
      </div>

      {/* 단계별 버튼 */}
      <StepButtons
        currentStep={currentStep}
        onNext={handleNext}
        onPrev={handlePrev}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
