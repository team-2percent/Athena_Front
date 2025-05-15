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

// 목 데이터: 실제로는 API에서 가져올 데이터
const mockProductData = {
  category: "예술",
  title: "아름다운 수채화 작품 모음집",
  description: "다양한 풍경과 인물을 담은 수채화 작품 모음집입니다. 10년간의 작업물을 엄선했습니다.",
  targetAmount: "5000000",
  startDate: new Date("2025-06-01"),
  endDate: new Date("2025-07-01"),
  deliveryDate: new Date("2025-07-15"),
  // 대표 이미지는 실제 파일 객체가 아닌 URL만 제공 (실제 구현에서는 파일 객체로 변환 필요)
  images: [
    {
      id: "img-1",
      url: "/watercolor-painting-still-life.png",
      name: "수채화1.jpg",
    },
    {
      id: "img-2",
      url: "/watercolor-landscape.png",
      name: "풍경화.jpg",
    },
  ],
  // 마크다운 내용
  markdown:
    "# 수채화 작품 모음집\n\n10년간의 작업물 중 엄선한 작품들을 모았습니다.\n\n## 특징\n\n- 고급 수채화 용지 사용\n- 특수 코팅 처리로 변색 방지\n- 작가의 작업 노트 포함\n\n## 구성\n\n1. 풍경화 섹션 (10작품)\n2. 인물화 섹션 (8작품)\n3. 추상화 섹션 (7작품)\n\n> 참고: 한정판으로 제작됩니다.",
  // 후원 옵션
  supportOptions: [
    {
      id: 1,
      name: "얼리버드 패키지",
      price: "35000",
      description: "10% 할인된 가격으로 제공되는 얼리버드 특별 패키지",
      stock: "50",
      composition: [
        { id: 1, content: "수채화 작품집 1권" },
        { id: 2, content: "작가 친필 사인" },
      ],
    },
    {
      id: 2,
      name: "디럭스 패키지",
      price: "55000",
      description: "한정판 아트 프린트가 포함된 디럭스 패키지",
      stock: "30",
      composition: [
        { id: 1, content: "수채화 작품집 1권" },
        { id: 2, content: "작가 친필 사인" },
        { id: 3, content: "한정판 아트 프린트 2장" },
      ],
    },
  ],
  // 팀 정보
  teamName: "컬러풀 스튜디오",
  teamIntro:
    "10년 경력의 수채화 전문 작가 그룹입니다. 다양한 전시회와 출판 경험을 가지고 있으며, 수채화의 아름다움을 많은 사람들과 나누고자 합니다.",
  teamImage: "/art-studio-team.png",
}

export default function ProductEdit() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { apiCall } = useApi()
  const { uploadImages } = useImageUpload()

  // Zustand 스토어에서 상태와 액션 가져오기
  const { currentStep, setCurrentStep, updateFormData, resetForm, setLoading, setProjectId } = useProjectFormStore()

  // 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        // 실제 구현에서는 API 호출
        // const response = await fetch(`/api/products/${productId}`);
        // const data = await response.json();

        // 목 데이터 사용
        const data = mockProductData

        // 프로젝트 ID 설정 (실제 구현에서는 API 응답에서 가져옴)
        setProjectId(1) // 임시 ID

        // 이미지 처리 - 기존 이미지는 URL 형태로 저장
        const processedImages = data.images.map((img) => ({
          id: img.id,
          preview: img.url, // 미리보기로 URL 사용
          url: img.url, // 서버 URL 저장
          isExisting: true, // 기존 이미지 표시
        }))

        updateFormData({
          targetAmount: data.targetAmount,
          category: data.category,
          title: data.title,
          description: data.description,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          deliveryDate: new Date(data.deliveryDate),
          images: processedImages,
          markdown: data.markdown,
          supportOptions: data.supportOptions,
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
      if (!pathname.includes("productEdit")) {
        resetForm()
      }
    }
  }, [updateFormData, setProjectId, pathname, resetForm])

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
    if (confirm("상품 수정을 취소하시겠습니까?")) {
      resetForm()
      router.push("/my")
    }
  }

  // 수정 완료 처리
  const handleSubmit = async () => {
    // 상품 수정 로직 구현 (실제로는 API 호출)
    const success = await submitProject(apiCall, uploadImages)

    if (success) {
      alert("상품이 성공적으로 수정되었습니다.")
      resetForm()
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
        id: state.projectId,
        title: state.title,
        description: state.description,
        goalAmount: Number.parseInt(state.targetAmount.replace(/,/g, ""), 10),
        contentMarkdown: state.markdown,
        startAt: state.startDate.toISOString(),
        endAt: state.endDate.toISOString(),
        shippedAt: state.deliveryDate.toISOString(),
        images: imageData, // URL과 File 객체 모두 포함
        products: state.supportOptions.map((option) => ({
          name: option.name,
          description: option.description,
          price: Number.parseInt(option.price.replace(/,/g, ""), 10),
          stock: Number.parseInt(option.stock.replace(/,/g, ""), 10),
          options: option.composition ? option.composition.map((item) => item.content) : [],
        })),
      }

      console.log("Submitting updated project data:", projectData)

      // 실제 구현에서는 API 호출
      // const response = await apiCall(`/api/project/${state.projectId}`, "PUT", projectData)

      // 목 응답
      const mockResponse = { success: true }

      setLoading(false)
      return mockResponse.success
    } catch (error) {
      console.error("Error during submission:", error)
      alert("프로젝트 수정 중 오류가 발생했습니다.")
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
    <div className="container mx-auto px-4">
      <RegisterHeader currentStep={currentStep} onStepChange={setCurrentStep} title="상품 수정하기" />

      <div className="mt-8 mb-16">
        {/* 단계별 폼 컴포넌트 */}
        {currentStep === 1 && <StepOneForm onUpdateFormData={updateFormData} />}
        {currentStep === 2 && <StepTwoForm onUpdateMarkdown={(markdown) => updateFormData({ markdown })} />}
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
