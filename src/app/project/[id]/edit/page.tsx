"use client"

import { useState, useEffect } from "react"
import RegisterHeader from "@/components/projectRegister/RegisterHeader"
import StepButtons from "@/components/projectRegister/StepButtons"
import StepOneForm from "@/components/projectRegister/StepOneForm"
import StepTwoForm from "@/components/projectRegister/StepTwoForm"
import StepThreeForm from "@/components/projectRegister/StepThreeForm"
import { useRouter, usePathname } from "next/navigation"
import { useProjectFormStore, type Category } from "@/stores/useProjectFormStore"
import Spinner from "@/components/common/Spinner"
import { useApi } from "@/hooks/useApi"
import AlertModal from "@/components/common/AlertModal"
import useAuthStore from "@/stores/auth"

// 마크다운 이미지 정보를 저장하는 인터페이스
interface MarkdownImageInfo {
  id: string // 이미지 ID 또는 URL
  file?: File // 파일 객체 (새 이미지인 경우)
  url?: string // URL (기존 이미지인 경우)
  isUrl: boolean // URL 이미지인지 여부
  index: number // 마크다운에서의 순서
}

export default function ProductEdit() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { apiCall } = useApi()

  const [alertMessage, setAlertMessage] = useState("")
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  // Zustand 스토어에서 상태와 액션 가져오기
  const { currentStep, setCurrentStep, updateFormData, resetForm, setLoading, setProjectId } = useProjectFormStore()

  // 날짜를 UTC 기준 00:00:00으로 변환하는 헬퍼 함수
  const toUTCDateString = (date: Date | null): string => {
    if (!date) return ""

    // 선택된 날짜를 UTC 기준 00:00:00으로 설정
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0))

    return utcDate.toISOString()
  }

  // 카테고리 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiCall<Category[]>("/api/category", "GET")
        if (response.data) {
          setCategories(response.data)
        } else {
          console.error("카테고리 목록을 가져오는데 실패했습니다:", response.error)
        }
      } catch (error) {
        console.error("카테고리 API 호출 중 오류 발생:", error)
      }
    }

    fetchCategories()
  }, [apiCall])

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

        // 카테고리 목록이 로드될 때까지 대기
        if (categories.length === 0) {
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

        // 카테고리 처리 - 카테고리 이름으로 ID 찾기
        let categoryName = ""
        let categoryId = null

        if (data.category) {
          if (typeof data.category === "string") {
            // 카테고리가 문자열로 제공되는 경우
            categoryName = data.category
            const foundCategory = categories.find((cat) => cat.categoryName === data.category)
            categoryId = foundCategory?.id || null
          } else if (data.category.categoryName) {
            // 카테고리가 객체로 제공되는 경우
            categoryName = data.category.categoryName
            categoryId = data.category.id || null

            // ID가 없는 경우 이름으로 찾기
            if (!categoryId) {
              const foundCategory = categories.find((cat) => cat.categoryName === data.category.categoryName)
              categoryId = foundCategory?.id || null
            }
          }
        }

        console.log("카테고리 처리 결과:", { categoryName, categoryId, originalCategory: data.category })

        // 폼 데이터 업데이트
        updateFormData({
          targetAmount: data.goalAmount?.toString() || "",
          category: categoryName,
          categoryId: categoryId,
          title: data.title || "",
          description: data.description || "",
          startDate: data.startAt ? new Date(data.startAt) : null,
          endDate: data.endAt ? new Date(data.endAt) : null,
          deliveryDate: data.shippedAt ? new Date(data.shippedAt) : null,
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
  }, [updateFormData, setProjectId, pathname, resetForm, apiCall, categories])

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
    const success = await submitProjectEdit()

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

  // URL을 Blob으로 변환하는 함수
  const urlToBlob = async (url: string): Promise<Blob | null> => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
      }
      return await response.blob()
    } catch (error) {
      console.error("이미지 URL을 Blob으로 변환 중 오류:", error)
      return null
    }
  }

  // 마크다운에서 이미지 참조 정보를 추출하는 함수 (로컬 이미지와 URL 이미지 모두 처리)
  const extractImageReferences = (markdown: string): MarkdownImageInfo[] => {
    const imageInfos: MarkdownImageInfo[] = []
    let index = 0

    // 마크다운에서 이미지 참조 추출 (로컬/URL 구분 없이 순서대로)
    const imageRegex = /!\[.*?\]\(([^)]+)\)/g
    let match

    while ((match = imageRegex.exec(markdown)) !== null) {
      const src = match[1]
      if (src.startsWith("/markdown-image/")) {
      // 로컬 이미지
      const id = src.replace("/markdown-image/", "")
      imageInfos.push({
        id,
        isUrl: false,
        index: index++,
      })
      } else if (src.startsWith("http://") || src.startsWith("https://")) {
      // URL 이미지
      imageInfos.push({
        id: src,
        url: src,
        isUrl: true,
        index: index++,
      })
      }
      // 기타 형식은 무시
    }

    console.log("마크다운에서 추출한 이미지 참조:", imageInfos)
    return imageInfos
  }

  // 프로젝트 수정 함수
  const submitProjectEdit = async () => {
    const state = useProjectFormStore.getState()
    const userId = useAuthStore.getState().userId
    setLoading(true)

    try {
      if (!state.projectId) {
        setAlertMessage("프로젝트 ID가 없습니다.")
        setIsAlertOpen(true)
        setLoading(false)
        return false
      }

      // 프로젝트 데이터 준비
      const projectData = {
        categoryId: state.categoryId || 0,
        bankAccountId: state.bankAccountId || 0,
        title: state.title,
        description: state.description,
        goalAmount: Number.parseInt(state.targetAmount.replace(/,/g, ""), 10),
        contentMarkdown: state.markdown,
        startAt: toUTCDateString(state.startDate),
        endAt: toUTCDateString(state.endDate),
        shippedAt: toUTCDateString(state.deliveryDate),
        products: state.supportOptions.map((option) => ({
          name: option.name,
          description: option.description,
          price: Number.parseInt(option.price.replace(/,/g, ""), 10),
          stock: Number.parseInt(option.stock.replace(/,/g, ""), 10),
          options: option.composition ? option.composition.map((item) => item.content) : [],
        })),
      }

      console.log("프로젝트 수정 데이터:", projectData)

      // FormData 생성
      const formData = new FormData()
      formData.append("request", new Blob([JSON.stringify(projectData)], { type: "application/json" }))

      // 새 이미지 파일들 추가
      const newImages = state.images.filter((image) => image.file)
      for (const image of newImages) {
        if (image.file) {
          formData.append("files", image.file)
        }
      }

      // 기존 이미지 URL을 Blob으로 변환하여 추가
      const existingImages = state.images.filter((image) => image.isExisting && image.url)
      for (let i = 0; i < existingImages.length; i++) {
        const image = existingImages[i]
        if (image.url) {
          const blob = await urlToBlob(image.url)
          if (blob) {
            // URL에서 파일 이름과 확장자 추출
            const fileName = image.url.split("/").pop() || `image-${i}.jpg`
            const file = new File([blob], fileName, { type: blob.type || "image/jpeg" })
            formData.append("files", file)
          }
        }
      }

      // 마크다운에서 이미지 참조 정보 추출 (로컬 이미지와 URL 이미지 모두)
      const imageReferences = extractImageReferences(state.markdown)

      // 새로 추가된 마크다운 이미지 정보 로깅
      console.log("새로 추가된 마크다운 이미지:", state.markdownImages)

      // 마크다운 이미지 처리를 위한 배열 준비
      const markdownImageFiles: File[] = []

      // 마크다운에 참조된 순서대로 이미지 파일 추가
      for (const reference of imageReferences) {
        if (!reference.isUrl) {
          // 로컬 이미지 (새로 추가된 이미지)
          const matchingImage = state.markdownImages.find((img) => img.id === reference.id)
          if (matchingImage) {
            console.log(`마크다운 로컬 이미지 추가 (순서: ${reference.index}):`, reference.id)
            markdownImageFiles.push(matchingImage.file)
          }
        } else {
          // URL 이미지 (기존 이미지)
          console.log(`마크다운 URL 이미지 처리 (순서: ${reference.index}):`, reference.url)
          const blob = await urlToBlob(reference.url!)
          if (blob) {
            const fileName = reference.url!.split("/").pop() || `markdown-url-image-${reference.index}.jpg`
            const file = new File([blob], fileName, { type: blob.type || "image/jpeg" })
            markdownImageFiles.push(file)
          }
        }
      }

      // 마크다운에 참조되지 않은 나머지 이미지도 추가
      const referencedLocalIds = new Set(imageReferences.filter((ref) => !ref.isUrl).map((ref) => ref.id))
      const unreferencedImages = state.markdownImages.filter((img) => !referencedLocalIds.has(img.id))

      if (unreferencedImages.length > 0) {
        console.log(
          "마크다운에 참조되지 않은 이미지도 추가:",
          unreferencedImages.map((img) => img.id),
        )
        unreferencedImages.forEach((img) => {
          markdownImageFiles.push(img.file)
        })
      }

      // 정렬된 순서로 마크다운 이미지 파일들 추가
      markdownImageFiles.forEach((file, index) => {
        console.log(`최종 마크다운 이미지 파일 ${index + 1} 첨부:`, file.name)
        formData.append("markdownFiles", file)
      })

      // 프로젝트 수정 API 호출
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiBase}/api/project/${state.projectId}`, {
        method: "PUT",
        body: formData,
      }).then(async (res) => ({
        // data: await res.json(),
        error: res.ok ? null : "서버 오류",
        status: res.status,
      }))

      console.log(response.error)

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
