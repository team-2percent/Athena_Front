"use client"

import { useState, useEffect } from "react"
import RegisterHeader from "@/components/projectRegister/RegisterHeader"
import StepButtons from "@/components/projectRegister/StepButtons"
import StepOneForm from "@/components/projectRegister/StepOneForm"
import StepTwoForm from "@/components/projectRegister/StepTwoForm"
import StepThreeForm from "@/components/projectRegister/StepThreeForm"
import { useRouter, usePathname } from "next/navigation"
import { useProjectFormStore } from "@/stores/useProjectFormStore"
import Spinner from "@/components/common/Spinner"
import { useApi } from "@/hooks/useApi"
import { useImageUpload } from "@/hooks/useImageUpload"
import AlertModal from "@/components/common/AlertModal"

export default function ProductEdit() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { apiCall } = useApi()
  const { uploadImages } = useImageUpload()

  const [alertMessage, setAlertMessage] = useState("")
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  // Zustand 스토어에서 상태와 액션 가져오기
  const { currentStep, setCurrentStep, updateFormData, resetForm, setLoading, setProjectId } = useProjectFormStore()

  // 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setIsLoading(true)

        // URL에서 프로젝트 ID 가져오기
        const id = pathname.split("/")[2] // URL에서 ID 추출 (/project/[id]/edit)

        if (!id) {
          console.error("프로젝트 ID를 찾을 수 없습니다.")
          setIsLoading(false)
          return
        }

        // API 호출로 프로젝트 데이터 가져오기
        const response = await apiCall<any>(`/api/project/${id}`, "GET")

        if (response.error) {
          console.error("프로젝트 데이터 로드 실패:", response.error)
          setIsLoading(false)
          return
        }

        const data = response.data

        if (!data) {
          console.error("프로젝트 데이터가 없습니다.")
          setIsLoading(false)
          return
        }

        console.log("API에서 받은 프로젝트 데이터:", data)

        // 프로젝트 ID 설정
        setProjectId(Number(id))

        // 이미지 처리 - API에서 받은 이미지 URL을 ImageFile 형식으로 변환
        const processedImages =
          data.imageUrls?.map((url: string, index: number) => ({
            id: `img-${index}`,
            preview: url,
            url: url,
            isExisting: true,
          })) || []

        // 후원 옵션 처리 - productResponses 사용
        const processedOptions =
          data.productResponses?.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            stock: product.stock.toString(),
            composition: product.options?.map((option: string, index: number) => ({
              id: index + 1,
              content: option,
            })),
          })) || []

        // 폼 데이터 업데이트
        updateFormData({
          targetAmount: data.goalAmount?.toString() || "",
          category: data.category?.categoryName || "",
          categoryId: data.category?.id || null,
          title: data.title || "",
          description: data.description || "",
          startDate: data.startAt ? new Date(data.startAt) : new Date(),
          endDate: data.endAt ? new Date(data.endAt) : new Date(),
          deliveryDate: data.shippedAt ? new Date(data.shippedAt) : new Date(),
          images: processedImages,
          markdown: data.markdown || "", // contentMarkdown 필드 사용
          supportOptions: processedOptions,
          platformPlan: data.planName || "BASIC",
        })

        setIsLoading(false)
      } catch (error) {
        console.error("데이터 로드 실패:", error)
        setIsLoading(false)
      }
    }

    loadProjectData()

    // 컴포넌트 언마운트 시 폼 데이터 초기화
    return () => {
      // 다른 페이지로 이동할 때만 초기화 (productEdit 내 이동은 제외)
      if (!pathname.includes("edit")) {
        resetForm()
      }
    }
  }, [updateFormData, setProjectId, pathname, resetForm, apiCall])

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

  // 수정 완료 처리
  const handleSubmit = async () => {
    // 상품 수정 로직 구현 (API 호출)
    const success = await submitProject(apiCall, uploadImages)

    if (success) {
      setAlertMessage("상품이 성공적으로 수정되었습니다.")
      setIsAlertOpen(true)
      resetForm()
      router.push("/my")
    }
  }

  // AlertModal 닫기 핸들러 추가
  const handleAlertClose = () => {
    setIsAlertOpen(false)
    // 알림 닫은 후 페이지 이동
    if (alertMessage.includes("성공적으로 수정")) {
      router.push("/my")
    }
  }

  // 프로젝트 제출 함수
  const submitProject = async (
    apiCall: <T>(url: string, method: string, body?: any) => Promise<any>,
    uploadImages: (imageGroupId: number, files: File[]) => Promise<any>,
  ) => {
    const state = useProjectFormStore.getState()
    setLoading(true)

    try {
      // 이미지 처리 - 기존 이미지(URL)와 새 이미지(File)를 함께 처리
      const imageData = state.images
        .map((img) => {
          // 기존 이미지는 URL을 그대로 전송
          if (img.url) {
            return { url: img.url }
          }
          // 새 이미지는 File 객체 전송
          else if (img.file) {
            return { file: img.file }
          }
          return null
        })
        .filter(Boolean)

      // 프로젝트 데이터 준비
      const projectData = {
        title: state.title,
        description: state.description,
        goalAmount: Number.parseInt(state.targetAmount.replace(/,/g, ""), 10),
        contentMarkdown: state.markdown,
        startAt: state.startDate.toISOString(),
        endAt: state.endDate.toISOString(),
        shippedAt: state.deliveryDate.toISOString(),
        categoryId: state.categoryId,
        bankAccountId: state.bankAccountId || 0, // 선택한 계좌 ID 사용
        images: imageData, // URL과 File 객체 모두 포함
        products: state.supportOptions.map((option) => ({
          id: option.id, // 기존 옵션의 ID 포함
          name: option.name,
          description: option.description,
          price: Number.parseInt(option.price.replace(/,/g, ""), 10),
          stock: Number.parseInt(option.stock.replace(/,/g, ""), 10),
          options: option.composition ? option.composition.map((item) => item.content) : [],
        })),
      }

      console.log("프로젝트 수정 데이터:", projectData)

      // 실제 API 호출
      const response = await apiCall(`/api/project/${state.projectId}`, "PUT", projectData)

      if (response.error) {
        console.error("프로젝트 수정 실패:", response.error)
        setAlertMessage(`프로젝트 수정 실패: ${response.error}`)
        setIsAlertOpen(true)
        setLoading(false)
        return false
      }

      setLoading(false)
      return true
    } catch (error) {
      console.error("프로젝트 수정 중 오류 발생:", error)
      setAlertMessage("프로젝트 수정 중 오류가 발생했습니다.")
      setIsAlertOpen(true)
      setLoading(false)
      return false
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Spinner message="상품 정보를 불러오는 중입니다..." />
      </div>
    )
  }

  return (
    <div className="container my-8 mx-auto px-4 w-[var(--content-width)]">
      <AlertModal isOpen={isAlertOpen} message={alertMessage} onClose={handleAlertClose} />
      <RegisterHeader currentStep={currentStep} onStepChange={setCurrentStep} title="상품 수정하기" />

      <div className="mt-8 mb-16">
        {/* 단계별 폼 컴포넌트 */}
        {currentStep === 1 && <StepOneForm onUpdateFormData={updateFormData} />}
        {currentStep === 2 && (
          <StepTwoForm onUpdateMarkdown={(markdown) => updateFormData({ markdown })} isEditMode={true} />
        )}
        {currentStep === 3 && <StepThreeForm isEditMode={true} />}
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
