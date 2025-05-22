"use client"

import { useState, useRef, useEffect } from "react"
import { Share2, ChevronLeft, ChevronRight } from "lucide-react"
import ProjectTabs from "./ProjectTabs"

// 상단에 useApi 훅 import 추가
import { useApi } from "@/hooks/useApi"
import { useParams } from "next/navigation"

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

const ProjectDetail = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [visibleImages, setVisibleImages] = useState<number[]>([])
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const metadataContainerRef = useRef<HTMLDivElement>(null)

  // API 관련 상태 추가
  const { apiCall, isLoading: apiLoading } = useApi()
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // URL에서 프로젝트 ID 가져오기
  const { id: projectId } = useParams()

  // 프로젝트 데이터 가져오기
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await apiCall<ProjectData>(`/api/project/${projectId}`, "GET")

        if (error) {
          throw new Error(error)
        }

        if (data) {
          console.log(data)
          setProjectData(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "프로젝트 정보를 불러오는 중 오류가 발생했습니다.")
        console.error("프로젝트 정보 불러오기 오류:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      fetchProjectData()
    }
  }, [projectId, apiCall])

  // 사용할 이미지 배열 결정
  const images = projectData?.imageUrls?.length ? projectData.imageUrls : []

  // 이미지 목록에 표시할 이미지 인덱스 계산
  useEffect(() => {
    updateVisibleImages(currentImageIndex)
  }, [currentImageIndex, images.length])

  // 현재 이미지 인덱스를 기준으로 표시할 이미지 목록 업데이트
  const updateVisibleImages = (currentIdx: number) => {
    const totalImages = images.length
    const visibleCount = Math.min(5, totalImages) // 이미지가 5개 미만이면 실제 이미지 개수만큼만 표시

    if (totalImages <= 5) {
      // 이미지가 5개 이하면 모든 이미지 표시
      setVisibleImages(Array.from({ length: totalImages }, (_, i) => i))
      return
    }

    // 이미지가 5개 초과일 때만 슬라이딩 윈도우 적용
    let startIdx = currentIdx - Math.floor(visibleCount / 2)

    // 경계 조건 처리
    if (startIdx < 0) {
      // 시작 인덱스가 0보다 작으면 0부터 시작
      startIdx = 0
    } else if (startIdx + visibleCount > totalImages) {
      // 끝 인덱스가 총 이미지 수를 초과하면 조정
      startIdx = totalImages - visibleCount
    }

    // 표시할 이미지 인덱스 배열 생성
    const newVisibleImages = Array.from({ length: visibleCount }, (_, i) => startIdx + i)
    setVisibleImages(newVisibleImages)
  }

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % images.length
    setCurrentImageIndex(newIndex)
  }

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length
    setCurrentImageIndex(newIndex)
  }

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ". ")
  }

  // 남은 일수 계산 함수
  const calculateDaysLeft = (endDate: string) => {
    if (!endDate) return 0
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // 달성률 계산 함수
  const calculateAchievementRate = (goal: number, current: number) => {
    if (!goal || goal === 0) return 0
    return Math.floor((current / goal) * 100)
  }

  return (
    <div className="mx-auto max-w-6xl pb-20">
      {/* 로딩 상태 표시 */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <p className="text-sub-gray text-lg">프로젝트 정보를 불러오는 중...</p>
        </div>
      )}

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-500 my-4">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-sm underline">
            다시 시도
          </button>
        </div>
      )}

      {/* 상품 정보 영역 */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* 왼쪽: 이미지 영역 */}
          <div className="flex flex-col">
            {/* 이미지 표시 영역 (캐러셀) */}
            <div ref={imageContainerRef} className="relative aspect-square w-full overflow-hidden rounded-3xl">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex] || "/placeholder.svg"}
                    alt={projectData?.title || "프로젝트 이미지"}
                    className="h-full w-full object-cover"
                  />

                  {/* 이미지가 2개 이상일 때만 캐러셀 좌우 버튼 표시 */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-sub-gray shadow-md hover:bg-white"
                        aria-label="이전 이미지"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-sub-gray shadow-md hover:bg-white"
                        aria-label="다음 이미지"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-500 text-xl font-medium">이미지 없음</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 이미지 목록 */}
            {images.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-center gap-4">
                  {visibleImages.map((idx) => (
                    <div
                      key={idx}
                      className={`cursor-pointer overflow-hidden rounded-xl transition-all duration-200 ${
                        currentImageIndex === idx ? "ring-4 ring-main-color" : "hover:ring-2 hover:ring-main-color"
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <div className="relative h-20 w-20">
                        <img
                          src={images[idx] || "/placeholder.svg"}
                          alt={`프로젝트 이미지 ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 메타데이터 영역 */}
          <div ref={metadataContainerRef} className="flex flex-col justify-center">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{projectData?.title || "프로젝트 제목"}</h1>
              <h2 className="mb-6 text-2xl text-sub-gray">{projectData?.description || "프로젝트 설명"}</h2>

              <div className="mb-4">
                <p className="mb-3 text-gray-700">달성 금액</p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-main-color">
                    {projectData?.totalAmount?.toLocaleString() || "0"}
                  </span>
                  <span className="ml-2 text-xl text-sub-gray">
                    / {projectData?.goalAmount?.toLocaleString() || "0"} 원
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-lg font-medium text-main-color">
                  목표 금액의 {calculateAchievementRate(projectData?.goalAmount || 0, projectData?.totalAmount || 0)}%
                  달성
                </p>
              </div>

              <div className="mb-8">
                <p className="mb-3 text-gray-700">펀딩 마감까지 남은 시간</p>
                <div className="flex items-baseline">
                  {!projectData?.endAt ? (
                    <span className="text-5xl font-bold text-main-color">알 수 없음</span>
                  ) : (() => {
                    const daysLeft = calculateDaysLeft(projectData.endAt)
                    if (daysLeft > 0) {
                      return <span className="text-5xl font-bold text-main-color">{daysLeft}일</span>
                    } else if (daysLeft === 0) {
                      return <span className="text-5xl font-bold text-main-color">마감임박!</span>
                    } else {
                      return <span className="text-5xl font-bold text-main-color">펀딩 종료</span>
                    }
                  })()}
                  <span className="ml-2 text-xl text-sub-gray">/ {formatDate(projectData?.endAt || "")}</span>
                </div>
              </div>
            </div>

            {/* 공유하기, 후원하기 버튼 영역 */}
            <div className="mt-8 flex items-center justify-end space-x-4">
              <button className="w-1/3 flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-4 text-xl text-gray-700 hover:bg-gray-50">
                <Share2 className="h-6 w-6"/>
                공유하기
              </button>

              {/* 후원하기 버튼 */}
              <button
                className="w-2/3 rounded-xl bg-main-color px-8 py-4 text-center text-xl font-bold text-white hover:bg-secondary-color-dark"
                onClick={() => {
                  const event = new CustomEvent("toggleDonateDock")
                  window.dispatchEvent(event)
                }}
              >
                후원하기
              </button>
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
