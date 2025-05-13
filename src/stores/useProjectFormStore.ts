import { create } from "zustand"

// 이미지 파일 타입
export interface ImageFile {
  id: string
  file: File
  preview: string
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

// 프로젝트 폼 상태 타입
interface ProjectFormState {
  // 프로젝트 기본 정보
  projectId: number | null
  currentStep: number

  // 1단계 폼 데이터
  targetAmount: string
  category: string
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
  category: "책",
  title: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 21)),
  deliveryDate: new Date(new Date().setDate(new Date().getDate() + 28)),
  images: [],

  markdown:
    "# 상품 상세 설명\n\n상품에 대한 자세한 설명을 작성해주세요.\n\n## 특징\n\n- 첫 번째 특징\n- 두 번째 특징\n- 세 번째 특징\n\n## 사용 방법\n\n1. 첫 번째 단계\n2. 두 번째 단계\n3. 세 번째 단계\n\n> 참고: 마크다운 문법을 사용하여 작성할 수 있습니다.",

  supportOptions: [],

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
          if (!newImageIds.has(img.id) && img.preview) {
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
      // 이미지 미리보기 URL 해제
      const currentImages = get().images
      currentImages.forEach((img) => {
        if (img.preview) {
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

// 프로젝트 제출 함수 (컴포넌트에서 호출)
export const submitProject = async (
  apiCall: <T>(url: string, method: string, body?: any) => Promise<ApiResponse<T>>,
  uploadImages: (imageGroupId: number, files: File[]) => Promise<{ success: boolean; error: string | null; data: any }>,
) => {
  const state = useProjectFormStore.getState()
  const { setError, setSubmitting } = state

  if (!state.projectId) {
    setError("프로젝트 ID가 없습니다. 페이지를 새로고침 해주세요.")
    return false
  }

  setSubmitting(true)
  setError(null)

  try {
    // 1. 이미지 업로드
    const imageFiles = state.images.map((img) => img.file)

    if (imageFiles.length > 0) {
      console.log("Uploading images with imageGroupId:", state.projectId)
      const uploadResponse = await uploadImages(state.projectId, imageFiles)

      if (!uploadResponse.success) {
        console.error("Image upload failed:", uploadResponse.error)
        setError("이미지 업로드에 실패했습니다.")
        setSubmitting(false)
        return false
      }

      console.log("Image upload response:", uploadResponse.data)
    }

    // 2. 프로젝트 정보 등록
    const projectData = {
      sellerId: 1, // 임시 값, 실제로는 로그인한 사용자 ID를 사용해야 함
      categoryId: 1, // 임시 값, 실제로는 선택한 카테고리 ID를 사용해야 함
      imageGroupId: state.projectId,
      title: state.title,
      description: state.description,
      goalAmount: Number.parseInt(state.targetAmount.replace(/,/g, ""), 10),
      contentMarkdown: state.markdown,
      startAt: state.startDate.toISOString(),
      endAt: state.endDate.toISOString(),
      shippedAt: state.deliveryDate.toISOString(),
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
