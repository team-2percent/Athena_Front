import ProjectTabs from "./ProjectTabs"
import ImageCarousel from "./client/ImageCarousel"
import SharePopover from "./client/SharePopover"
import DonateButton from "./client/DonateButton"
import { calculateDaysLeft, calculateAchievementRate } from "@/lib/utils"
import ErrorRetryWrapper from "./client/ErrorRetryWrapper"

// ProjectData 인터페이스 추가
interface ProjectData {
  id: number
  title: string
  description: string
  goalAmount: number
  totalAmount: number
  markdown: string
  startAt: string
  endAt: string
  shippedAt: string
  imageUrls: string[]
  sellerResponse: {
    id: number
    nickname: string
    sellerIntroduction: string
    linkUrl: string
  }
  productResponses: {
    id: number
    name: string
    description: string
    price: number
    stock: number
    options: string[]
  }[]
}

interface ProjectDetailProps {
  projectData: ProjectData | null
  isLoading: boolean
  error: string | null
}

const ProjectDetail = ({ projectData, isLoading, error }: ProjectDetailProps) => {
  // SSR에서 사용 가능한 순수 함수만 남김
  const canDonate = (projectData: ProjectData | null): boolean => {
    if (!projectData?.productResponses || projectData.productResponses.length === 0) {
      return false
    }
    const hasAvailableStock = projectData.productResponses.some((product) => product.stock > 0)
    return hasAvailableStock
  }

  const images = projectData?.imageUrls?.length ? projectData.imageUrls : []

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return require("@/lib/utils").formatDate(new Date(dateString))
  }

  return (
    <div className="mx-auto max-w-6xl pb-20">
      {/* 로딩 상태 표시 */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* 왼쪽: 이미지 캐러셀 스켈레톤 */}
          <div className="flex flex-col">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gray-200 animate-pulse flex items-center justify-center">
            </div>
            <div className="mt-4 flex justify-center gap-4">
              {[0,1,2,3,4].map(idx => (
                <div key={idx} className="h-20 w-20 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
          {/* 오른쪽: 메타데이터 스켈레톤 */}
          <div className="flex flex-col justify-center px-4 md:px-0">
            <div className="mb-4">
              <div className="h-8 w-2/3 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-6 w-1/2 bg-gray-100 rounded mb-6 animate-pulse" />
              <div className="h-8 w-1/3 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="h-6 w-1/4 bg-gray-100 rounded mb-6 animate-pulse" />
              <div className="h-8 w-1/2 bg-gray-200 rounded mb-8 animate-pulse" />
            </div>
            <div className="flex gap-2 mt-6">
              <div className="h-12 w-1/2 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-12 w-1/2 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* 에러 메시지 표시 */}
      {error && (
        <ErrorRetryWrapper message={error} />
      )}

      {/* 상품 정보 영역 */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* 왼쪽: 이미지 영역 */}
          <div className="flex flex-col">
            {/* 이미지 캐러셀 분리 */}
            <ImageCarousel images={images} title={projectData?.title || "프로젝트 이미지"} />
          </div>

          {/* 오른쪽: 메타데이터 영역 */}
          <div className="flex flex-col justify-center px-4 md:px-0 text-center md:text-left">
            <div>
              <h1 className="text-lg md:text-3xl font-bold mb-2 text-center md:text-left">{projectData?.title || "프로젝트 제목"}</h1>
              <h2 className="text-sm md:text-2xl text-sub-gray mb-6 break-words leading-tight text-center md:text-left">{projectData?.description || "프로젝트 설명"}</h2>

              <div className="mb-4">
                <p className="mb-1 text-base md:text-lg text-gray-700 text-center md:text-left">달성 금액</p>
                <div className="flex items-baseline justify-center md:justify-start">
                  <span className="text-2xl md:text-5xl font-bold text-main-color">
                    {projectData?.totalAmount?.toLocaleString() || "0"}원
                  </span>
                  <span className="ml-2 text-base md:text-xl text-sub-gray hidden md:inline">
                    / {projectData?.goalAmount?.toLocaleString() || "0"}원
                  </span>
                </div>
              </div>

              <p className="text-base md:text-lg font-medium text-main-color hidden md:block mb-4 md:mb-6 text-left">
                목표 금액의 {calculateAchievementRate(projectData?.goalAmount || 0, projectData?.totalAmount || 0)}% 달성
              </p>
              <div className="block md:hidden text-main-color text-base font-medium mb-4 text-center">
                <div>
                  목표금액({projectData?.goalAmount?.toLocaleString() || "0"}원)의
                </div>
                <div>
                  {calculateAchievementRate(projectData?.goalAmount || 0, projectData?.totalAmount || 0)}% 달성
                </div>
              </div>

              <div className="mb-6 md:mb-8">
                <p className="mb-1 md:mb-3 text-base md:text-lg text-gray-700 text-center md:text-left">펀딩 마감까지 남은 시간</p>
                <div className="flex items-baseline justify-center md:justify-start">
                  {!projectData?.endAt ? (
                    <span className="text-2xl md:text-5xl font-bold text-main-color">알 수 없음</span>
                  ) : (
                    (() => {
                      const daysLeft = calculateDaysLeft(projectData.endAt)
                      if (daysLeft > 0) {
                        return <span className="text-2xl md:text-5xl font-bold text-main-color">{daysLeft}일</span>
                      } else if (daysLeft === 0) {
                        return <span className="text-2xl md:text-5xl font-bold text-main-color">마감임박!</span>
                      } else {
                        return <span className="text-2xl md:text-5xl font-bold text-main-color">펀딩 종료</span>
                      }
                    })()
                  )}
                  <span className="ml-2 text-base md:text-xl text-sub-gray">/ {formatDate(projectData?.endAt || "")}</span>
                </div>
              </div>
            </div>

            {/* 공유하기, 후원하기 버튼 영역 */}
            <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:justify-end text-center md:text-right">
              <SharePopover />
              <DonateButton canDonate={canDonate(projectData)} />
            </div>
          </div>
        </div>
      )}

      {/* 탭 메뉴 및 소개 영역 추가 */}
      <ProjectTabs projectData={projectData} isLoading={isLoading} error={error} />
    </div>
  )
}

export default ProjectDetail
