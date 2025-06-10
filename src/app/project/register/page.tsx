"use client"

import { useEffect, useState } from "react"
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
import AlertModal from "@/components/common/AlertModal"

export default function ProjectRegister() {
  const router = useRouter()
  const { apiCall } = useApi()
  const { uploadImages } = useImageUpload()

  // 모바일 환경 감지
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // AlertModal 상태 추가
  const [alertMessage, setAlertMessage] = useState("")
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false) // 리디렉션 여부 상태 추가

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
    resetForm()
    router.push("/my")
  }

  // 등록 처리
  const handleSubmit = async () => {
    const success = await submitProject(apiCall, uploadImages)

    if (success) {
      // 성공 시 모달만 표시하고 리디렉션은 하지 않음
      setAlertMessage("상품이 성공적으로 등록되었습니다.")
      setIsAlertOpen(true)
      setShouldRedirect(true) // 리디렉션 플래그 설정
      resetForm()
    }
  }

  // AlertModal 닫기 핸들러 - 확인 버튼을 눌렀을 때 리디렉션
  const handleAlertClose = () => {
    setIsAlertOpen(false)

    // 성공 모달이었다면 마이페이지로 리디렉션
    if (shouldRedirect) {
      setShouldRedirect(false)
      router.push("/my")
    }
  }

  useEffect(() => {
    resetForm();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 경고 메시지(브라우저 표준에 따라 커스텀 메시지는 무시될 수 있음)
      e.preventDefault();
      e.returnValue = ""; // Chrome 등에서는 이 값이 있어야 경고가 뜸
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold text-main-color mb-4">모바일에서는 프로젝트 등록이 불가능합니다.</h2>
        <p className="text-gray-500 text-center">PC 환경에서 접속해 주세요.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto my-8 px-4">
      <AlertModal isOpen={isAlertOpen} message={alertMessage} onClose={handleAlertClose} />
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
