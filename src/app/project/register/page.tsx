"use client"

import { useEffect } from "react"
import RegisterHeader from "@/components/projectRegister/RegisterHeader"
import StepButtons from "@/components/projectRegister/StepButtons"
import StepOneForm from "@/components/projectRegister/StepOneForm"
import StepTwoForm from "@/components/projectRegister/StepTwoForm"
import StepThreeForm from "@/components/projectRegister/StepThreeForm"
import { useRouter } from "next/navigation"
import { useProjectFormStore, fetchProjectId, submitProject } from "@/stores/useProjectFormStore"
import { useApi } from "@/hooks/useApi"
import { useImageUpload } from "@/hooks/useImageUpload"
import Spinner from "@/components/common/Spinner"

export default function ProjectRegister() {
  const router = useRouter()
  const { apiCall } = useApi()
  const { uploadImages } = useImageUpload()

  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    currentStep,
    targetAmount,
    supportOptions,
    isLoading,
    isSubmitting,
    error,
    setCurrentStep,
    updateFormData,
    resetForm,
  } = useProjectFormStore()
  

  // 페이지 로드 시 프로젝트 ID 가져오기
  useEffect(() => {
    fetchProjectId(apiCall)
  }, [apiCall])

  // 단계가 변경될 때 화면 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

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
      resetForm()
      router.push("/")
    }
  }

  // 등록 처리
  const handleSubmit = async () => {
    const success = await submitProject(apiCall, uploadImages)

    if (success) {
      // 성공 시 홈으로 이동
      alert("상품이 성공적으로 등록되었습니다.")
      resetForm()
      router.push("/my")
    }
  }

  return (
    <div className="container mx-auto px-4">
      <RegisterHeader currentStep={currentStep} onStepChange={setCurrentStep} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <strong className="font-bold">오류: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mt-8 mb-16">
        {/* 단계별 폼 컴포넌트 */}
        {currentStep === 1 && <StepOneForm onUpdateFormData={updateFormData} />}
        {currentStep === 2 && (
          <StepTwoForm targetAmount={targetAmount} onUpdateMarkdown={(markdown) => updateFormData({ markdown })} />
        )}
        {currentStep === 3 && <StepThreeForm initialData={{ supportOptions }} />}
      </div>

      {/* 단계별 버튼 */}
      <StepButtons
        currentStep={currentStep}
        onNext={handleNext}
        onPrev={handlePrev}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />

      {/* 로딩 인디케이터 */}
      {(isLoading || isSubmitting) && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 border rounded-lg shadow-lg text-center">
            <Spinner message="잠시만 기다려 주세요..." />
          </div>
        </div>
      )}

    </div>
  )
}
