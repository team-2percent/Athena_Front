import { create } from "zustand"

// 이미지 파일 타입 확장 - URL 형태의 이미지도 처리할 수 있도록
export interface ImageFile {
  id: string
  file?: File // 새로 업로드하는 이미지의 경우 File 객체
  preview: string // 미리보기 URL (File 객체의 경우 createObjectURL, 기존 이미지의 경우 서버 URL)
  url?: string // 서버에 이미 저장된 이미지의 URL (기존 이미지인 경우에만 존재)
  isExisting?: boolean // 기존 이미지인지 여부
}

// 구성 항목 타입
export interface CompositionItem {
  id: number
  content: string
}

// 후원 옵션 타입
export interface SupportOption {
  id: number
  name: string
  price: string
  description: string
  stock: string
  composition?: CompositionItem[]
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

// planType 타입을 planName으로 변경하고 값을 대문자로 수정
export type PlatformPlan = "BASIC" | "PRO" | "PREMIUM"

// 카테고리 타입 추가
export interface Category {
  id: number
  categoryName: string
}

// 프로젝트 폼 상태 타입
interface ProjectFormState {
  // 프로젝트 기본 정보
  projectId: number | null
  currentStep: number

  // 1단계 폼 데이터
  targetAmount: string
  category: string
  categoryId: number | null // 카테고리 ID 추가
  title: string
  description: string
  startDate: Date
  endDate: Date
  deliveryDate: Date
  images: ImageFile[]

  // 2단계 폼 데이터
  markdown: string

  // 3단계 폼 데이터
  supportOptions: SupportOption[]
  platformPlan: PlatformPlan // planName에서 platformPlan으로 변경
  bankAccountId: number | null // 선택된 계좌 ID 추가

  // 로딩 및 에러 상태
  isLoading: boolean
  isSubmitting: boolean
  error: string | null

  // 액션
  setCurrentStep: (step: number) => void
  updateFormData: (
    data: Partial<
      Omit<
        ProjectFormState,
        "setCurrentStep" | "updateFormData" | "resetForm" | "setProjectId" | "setError" | "setLoading" | "setSubmitting"
      >
    >,
  ) => void
  resetForm: () => void
  setProjectId: (id: number) => void
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
  setSubmitting: (isSubmitting: boolean) => void
}

// 초기 상태
const initialState = {
  projectId: null,
  currentStep: 1,

  targetAmount: "",
  category: "",
  categoryId: null,
  title: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 21)),
  deliveryDate: new Date(new Date().setDate(new Date().getDate() + 28)),
  images: [],

  markdown:
    "# 상품 상세 설명\n\n상품에 대한 자세한 설명을 작성해주세요.\n\n## 특징\n\n- 첫 번째 특징\n- 두 번째 특징\n- 세 번째 특징\n\n## 사용 방법\n\n1. 첫 번째 단계\n2. 두 번째 단계\n3. 세 번째 단계\n\n> 참고: 마크다운 문법을 사용하여 작성할 수 있습니다.",

  supportOptions: [],
  platformPlan: "BASIC" as PlatformPlan, // planName에서 platformPlan으로 변경

  bankAccountId: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
}

// Zustand 스토어 생성
export const useProjectFormStore = create<ProjectFormState>()((set, get) => ({
  ...initialState,

  // 현재 단계 설정
  setCurrentStep: (step) => set({ currentStep: step }),

  // 폼 데이터 업데이트
  updateFormData: (data) => {
    // 이미지 데이터가 있는 경우 기존 이미지의 미리보기 URL 해제
    if (data.images) {
      const currentImages = get().images
      // 새 이미지 목록에 없는 기존 이미지의 미리보기 URL 해제
      const newImageIds = new Set(data.images.map((img) => img.id))
      currentImages.forEach((img) => {
        // File 객체로부터 생성된 미리보기 URL만 해제 (서버 URL은 해제하지 않음)
        if (!newImageIds.has(img.id) && img.preview && !img.isExisting) {
          try {
            URL.revokeObjectURL(img.preview)
          } catch (e) {
            console.error("Failed to revoke object URL:", e)
          }
        }
      })
    }

    set((state) => ({ ...state, ...data }))
  },

  // 폼 초기화
  resetForm: () => {
    // 이미지 미리보기 URL 해제 (File 객체로부터 생성된 URL만)
    const currentImages = get().images
    currentImages.forEach((img) => {
      if (img.preview && !img.isExisting) {
        try {
          URL.revokeObjectURL(img.preview)
        } catch (e) {
          console.error("Failed to revoke object URL:", e)
        }
      }
    })

    set(initialState)
  },

  // 프로젝트 ID 설정
  setProjectId: (id) => set({ projectId: id }),

  // 에러 설정
  setError: (error) => set({ error }),

  // 로딩 상태 설정
  setLoading: (isLoading) => set({ isLoading }),

  // 제출 상태 설정
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
}))

// 프로젝트 ID 가져오기 함수 (컴포넌트에서 호출)
export const fetchProjectId = async (
  apiCall: <T>(url: string, method: string, body?: any) => Promise<ApiResponse<T>>,
) => {
  const { setProjectId, setError, setLoading } = useProjectFormStore.getState()

  setLoading(true)
  setError(null)

  try {
    const response = await apiCall<{ id: number }>("/api/project", "GET")

    if (response.error) {
      console.error("Error fetching project ID:", response.error)
      setError("프로젝트 ID를 가져오는데 실패했습니다.")
      setLoading(false)
      return
    }

    if (response.data) {
      console.log("Received project ID:", response.data)
      setProjectId(Number(response.data))
    }
  } catch (err) {
    console.error("Failed to fetch project ID:", err)
    setError("프로젝트 ID를 가져오는데 실패했습니다.")
  } finally {
    setLoading(false)
  }
}

import useAuthStore from "@/stores/auth"

// 프로젝트 제출 함수 (컴포넌트에서 호출)
export const submitProject = async (
  apiCall: <T>(url: string, method: string, body?: any) => Promise<ApiResponse<T>>,
  uploadImages: (imageGroupId: number, files: File[]) => Promise<{ success: boolean; error: string | null; data: any }>,
) => {
  const state = useProjectFormStore.getState()
  const { setError, setSubmitting } = state

  // useAuthStore에서 userId 가져오기
  const userId = useAuthStore.getState().userId

  if (!state.projectId) {
    setError("프로젝트 ID가 없습니다. 페이지를 새로고침 해주세요.")
    return false
  }

  setSubmitting(true)
  setError(null)

  try {
    // 이미지 처리 - 새 이미지(File)를 먼저 업로드
    const newImages = state.images.filter((img) => img.file && !img.isExisting)
    const imageFiles = newImages.map((img) => img.file).filter(Boolean) as File[]

    // 새 이미지가 있는 경우 먼저 업로드
    let uploadedImageUrls: string[] = []
    if (imageFiles.length > 0) {
      console.log("Uploading images first...", imageFiles.length)
      const uploadResult = await uploadImages(state.projectId, imageFiles)

      if (!uploadResult.success) {
        console.error("Image upload failed:", uploadResult.error)
        setError("이미지 업로드에 실패했습니다: " + uploadResult.error)
        setSubmitting(false)
        return false
      }

      // 업로드된 이미지 URL 저장
      uploadedImageUrls = uploadResult.data.urls || []
      console.log("Images uploaded successfully:", uploadedImageUrls)
    }

    // 이미지 데이터 준비 - 기존 이미지 URL과 새로 업로드된 이미지 URL 합치기
    const existingImageUrls = state.images.filter((img) => img.url && img.isExisting).map((img) => img.url) as string[]

    const allImageUrls = [...existingImageUrls, ...uploadedImageUrls]

    // 프로젝트 정보 등록
    const projectData = {
      sellerId: userId || 0, // 로그인한 사용자 ID 사용
      categoryId: state.categoryId || 0, // 선택한 카테고리 ID 사용
      bankAccountId: state.bankAccountId || 0, // 선택한 계좌 ID 사용
      imageGroupId: state.projectId,
      title: state.title,
      description: state.description,
      goalAmount: Number.parseInt(state.targetAmount.replace(/,/g, ""), 10),
      contentMarkdown: state.markdown,
      startAt: state.startDate.toISOString(),
      endAt: state.endDate.toISOString(),
      shippedAt: state.deliveryDate.toISOString(),
      imageUrls: allImageUrls, // 모든 이미지 URL 배열로 전송
      platformPlan: state.platformPlan, // planName에서 platformPlan으로 변경
      products: state.supportOptions.map((option) => ({
        name: option.name,
        description: option.description,
        price: Number.parseInt(option.price.replace(/,/g, ""), 10),
        stock: Number.parseInt(option.stock.replace(/,/g, ""), 10),
        options: option.composition ? option.composition.map((item) => item.content) : [],
      })),
    }

    console.log("Submitting project data:", projectData)

    const response = await apiCall("/api/project", "POST", projectData)

    if (response.error) {
      console.error("Project submission failed:", response.error)
      setError("프로젝트 등록에 실패했습니다.")
      setSubmitting(false)
      return false
    }

    console.log("Project submission response:", response.data)
    setSubmitting(false)
    return true
  } catch (err) {
    console.error("Error during submission:", err)
    setError("프로젝트 등록 중 오류가 발생했습니다.")
    setSubmitting(false)
    return false
  }
}
