"use client"

import { useState, useEffect } from "react"
import RegisterHeader from "@/components/projectRegister/RegisterHeader"
import StepOneForm from "@/components/projectRegister/StepOneForm"
import StepTwoForm from "@/components/projectRegister/StepTwoForm"
import StepThreeForm from "@/components/projectRegister/StepThreeForm"
import { useRouter } from "next/navigation"
import Spinner from "@/components/common/Spinner"

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
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    targetAmount: "",
    category: "",
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    deliveryDate: new Date(),
    images: [] as { id: string; file: File; preview: string }[],
    markdown: "",
    supportOptions: [] as any[],
    teamName: "",
    teamIntro: "",
    teamImage: null as File | null,
    teamImagePreview: null as string | null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    const loadProductData = async () => {
      try {
        // 실제 구현에서는 API 호출
        // const response = await fetch(`/api/products/${productId}`);
        // const data = await response.json();

        // 목 데이터 사용
        const data = mockProductData

        // 이미지 URL을 File 객체로 변환 (실제 구현에서는 다른 방식 필요)
        const imagePromises = data.images.map(async (img) => {
          try {
            // 실제 구현에서는 URL에서 파일을 가져오는 로직 필요
            // 여기서는 간단히 처리
            return {
              id: img.id,
              file: new File([], img.name, { type: "image/jpeg" }),
              preview: img.url,
            }
          } catch (error) {
            console.error("이미지 로드 실패:", error)
            return null
          }
        })

        const loadedImages = (await Promise.all(imagePromises)).filter(Boolean)

        // 팀 이미지 처리 (실제 구현에서는 URL에서 파일 가져오기 필요)
        // 여기서는 미리보기 URL만 설정

        setFormData({
          targetAmount: data.targetAmount,
          category: data.category,
          title: data.title,
          description: data.description,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          deliveryDate: new Date(data.deliveryDate),
          images: loadedImages as any[],
          markdown: data.markdown,
          supportOptions: data.supportOptions,
          teamName: data.teamName,
          teamIntro: data.teamIntro,
          teamImage: null, // 실제 구현에서는 File 객체로 변환
          teamImagePreview: data.teamImage,
        })

        setIsLoading(false)
      } catch (error) {
        console.error("데이터 로드 실패:", error)
        setIsLoading(false)
      }
    }

    loadProductData()
  }, [])

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
    if (confirm("상품 수정을 취소하시겠습니까?")) {
      router.push("/my")
    }
  }

  // 수정 완료 처리
  const handleSubmit = () => {
    // 상품 수정 로직 구현 (실제로는 API 호출)
    console.log("수정할 데이터:", formData)
    alert("상품이 수정되었습니다.")
    router.push("/my")
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
        {currentStep === 1 && (
          <StepOneForm
            onUpdateFormData={updateFormData}
            formData={{ targetAmount: formData.targetAmount }}
            initialData={{
              category: formData.category,
              title: formData.title,
              description: formData.description,
              targetAmount: formData.targetAmount,
              startDate: formData.startDate,
              endDate: formData.endDate,
              deliveryDate: formData.deliveryDate,
              images: formData.images,
            }}
          />
        )}
        {currentStep === 2 && (
          <StepTwoForm
            targetAmount={formData.targetAmount}
            initialData={{
              markdown: formData.markdown,
              supportOptions: formData.supportOptions,
            }}
          />
        )}
        {currentStep === 3 && (
          <StepThreeForm
            initialData={{
              supportOptions: formData.supportOptions,
            }}
          />
        )}
      </div>

      {/* 단계별 버튼 */}
      <div className="flex justify-center gap-4 mt-10">
        {/* 왼쪽 버튼 (단계에 따라 다름) */}
        <button
          type="button"
          onClick={currentStep === 3 ? handleSubmit : handleNext}
          className="bg-main-color text-white font-bold py-4 px-12 rounded-full min-w-[200px]"
        >
          {currentStep === 3 ? "수정 완료" : "다음 단계로"}
        </button>

        {/* 오른쪽 버튼 (단계에 따라 다름) */}
        <button
          type="button"
          onClick={currentStep === 1 ? handleCancel : handlePrev}
          className="bg-gray-200 text-gray-700 font-bold py-4 px-12 rounded-full min-w-[200px]"
        >
          {currentStep === 1 ? "취소" : "이전 단계로"}
        </button>
      </div>
    </div>
  )
}
