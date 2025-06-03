"use client"

import { useState, useRef, useEffect } from "react"
import { Share2, ChevronLeft, ChevronRight, X, Copy, Check } from "lucide-react"
import ProjectTabs from "./ProjectTabs"

// 상단에 useApi 훅 import 추가
import { useApi } from "@/hooks/useApi"
import { useParams } from "next/navigation"

import { OutlineButton, PrimaryButton } from "../common/Button"
import gsap from "gsap"

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
  const [prevImageIndex, setPrevImageIndex] = useState<number | null>(null)
  const [isSliding, setIsSliding] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>("right")
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const metadataContainerRef = useRef<HTMLDivElement>(null)

  // API 관련 상태 추가
  const { apiCall, isLoading: apiLoading } = useApi()
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // URL에서 프로젝트 ID 가져오기
  const { id: projectId } = useParams()

  // 후원 가능 여부 확인 함수
  const canDonate = (projectData: ProjectData | null): boolean => {
    if (!projectData?.productResponses || projectData.productResponses.length === 0) {
      return false
    }

    // 모든 상품의 재고가 0인지 확인
    const hasAvailableStock = projectData.productResponses.some((product) => product.stock > 0)
    return hasAvailableStock
  }

  const [showSharePopover, setShowSharePopover] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // 이미지 캐러셀에 사용할 이미지 DOM 배열을 위한 ref
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])

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

  const slideTo = (dir: 'left' | 'right') => {
    if (isSliding || images.length <= 1) return
    setIsSliding(true)
    setSlideDirection(dir)
    setPrevImageIndex(currentImageIndex)
    let nextIdx
    if (dir === 'right') {
      nextIdx = (currentImageIndex + 1) % images.length
    } else {
      nextIdx = (currentImageIndex - 1 + images.length) % images.length
    }
    setCurrentImageIndex(nextIdx)
  }

  const nextImage = () => slideTo('right')
  const prevImage = () => slideTo('left')

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

  // URL 복사 함수
  const copyToClipboard = async () => {
    try {
      const currentUrl = window.location.href
      await navigator.clipboard.writeText(currentUrl)
      setCopySuccess(true)
      setTimeout(() => {
        setCopySuccess(false)
        setShowSharePopover(false)
      }, 2000)
    } catch (err) {
      console.error("URL 복사 실패:", err)
      // fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopySuccess(true)
      setTimeout(() => {
        setCopySuccess(false)
        setShowSharePopover(false)
      }, 2000)
    }
  }

  // 팝오버 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showSharePopover && !target.closest(".relative")) {
        setShowSharePopover(false)
      }
    }

    if (showSharePopover) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSharePopover])

  // 슬라이드 애니메이션 useEffect
  useEffect(() => {
    if (prevImageIndex === null || prevImageIndex === currentImageIndex) return
    const prevImg = imageRefs.current[0]
    const currImg = imageRefs.current[1]
    if (!prevImg || !currImg) {
      setIsSliding(false)
      setPrevImageIndex(null)
      return
    }
    // 초기 위치 세팅
    gsap.set(prevImg, { xPercent: 0, zIndex: 1 })
    gsap.set(currImg, { xPercent: slideDirection === 'right' ? 100 : -100, zIndex: 2 })
    // 애니메이션
    gsap.to(prevImg, {
      xPercent: slideDirection === 'right' ? -100 : 100,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        setIsSliding(false)
        setPrevImageIndex(null)
      }
    })
    gsap.to(currImg, {
      xPercent: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    })
  }, [currentImageIndex, prevImageIndex, slideDirection])

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
                  {/* 두 장의 이미지만 렌더링: prev, current */}
                  {prevImageIndex !== null && prevImageIndex !== currentImageIndex && (
                    <img
                      key={prevImageIndex}
                      ref={el => { imageRefs.current[0] = el }}
                      src={images[prevImageIndex] || "/placeholder.svg"}
                      alt={projectData?.title || `프로젝트 이미지 ${prevImageIndex + 1}`}
                      className="absolute top-0 left-0 h-full w-full object-cover"
                      style={{ zIndex: 1 }}
                    />
                  )}
                  <img
                    key={currentImageIndex}
                    ref={el => { imageRefs.current[1] = el }}
                    src={images[currentImageIndex] || "/placeholder.svg"}
                    alt={projectData?.title || `프로젝트 이미지 ${currentImageIndex + 1}`}
                    className="absolute top-0 left-0 h-full w-full object-cover"
                    style={{ zIndex: 2 }}
                  />
                  {/* 좌우 버튼 */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-sub-gray shadow-md hover:bg-white z-4"
                        aria-label="이전 이미지"
                        disabled={isSliding}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-sub-gray shadow-md hover:bg-white z-4"
                        aria-label="다음 이미지"
                        disabled={isSliding}
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
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`cursor-pointer overflow-hidden rounded-xl transition-all duration-200 ${
                        currentImageIndex === idx ? "ring-4 ring-main-color" : "hover:ring-2 hover:ring-main-color"
                      }`}
                      onClick={() => !isSliding && setCurrentImageIndex(idx)}
                    >
                      <div className="relative h-20 w-20">
                        <img
                          src={img || "/placeholder.svg"}
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
          <div ref={metadataContainerRef} className="flex flex-col justify-center px-4 md:px-0 text-center md:text-left">
            <div>
              <h1 className="text-lg md:text-3xl font-bold mb-2 text-center md:text-left">{projectData?.title || "프로젝트 제목"}</h1>
              <h2 className="text-sm md:text-2xl text-sub-gray mb-6 break-words leading-tight text-center md:text-left">{projectData?.description || "프로젝트 설명"}</h2>

              <div className="mb-4">
                <p className="mb-1 text-base md:text-lg text-gray-700 text-center md:text-left">달성 금액</p>
                <div className="flex items-baseline justify-center md:justify-start">
                  <span className="text-2xl md:text-5xl font-bold text-main-color">
                    {projectData?.totalAmount?.toLocaleString() || "0"}원
                  </span>
                  {/* 데스크톱: 기존처럼 목표금액 옆에 표기 */}
                  <span className="ml-2 text-base md:text-xl text-sub-gray hidden md:inline">
                    / {projectData?.goalAmount?.toLocaleString() || "0"}원
                  </span>
                </div>
              </div>

              {/* 달성률 표기 */}
              {/* 데스크톱: 기존 한 줄 표기 */}
              <p className="text-base md:text-lg font-medium text-main-color hidden md:block mb-4 md:mb-6 text-left">
                목표 금액의 {calculateAchievementRate(projectData?.goalAmount || 0, projectData?.totalAmount || 0)}% 달성
              </p>
              {/* 모바일: 두 줄 표기 */}
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
              {/* 공유하기 버튼을 relative 컨테이너로 감싸기 */}
              <div className="relative w-full md:w-1/3">
                <OutlineButton
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 md:py-4 text-base md:text-xl text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowSharePopover(!showSharePopover)}
                >
                  <Share2 className="h-5 w-5 md:h-6 md:w-6" />
                  공유하기
                </OutlineButton>

                {/* 공유하기 팝오버 - 트랜지션 애니메이션 적용, 항상 렌더링 */}
                <div
                  className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 transition-all duration-75 ease-out
                    ${showSharePopover ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                  style={{transformOrigin: 'top left'}}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">프로젝트 공유하기</h3>
                    <button onClick={() => setShowSharePopover(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border text-sm text-gray-600">
                      <span className="flex-1 truncate">
                        {typeof window !== "undefined" ? window.location.href : ""}
                      </span>
                    </div>

                    <button
                      onClick={copyToClipboard}
                      className={`w-full flex items-center justify-center gap-2 text-white py-2 px-4 rounded-lg transition-colors
                        ${copySuccess ? 'bg-secondary-color-dark' : 'bg-main-color hover:bg-secondary-color-dark'}
                      `}
                      disabled={copySuccess}
                    >
                      {copySuccess ? (
                        <>
                          <Check className="h-4 w-4" />
                          복사 완료!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          URL 복사하기
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 후원하기 버튼 - 상품이 없거나 모든 재고가 0이면 비활성화 */}
              {canDonate(projectData) ? (
                <PrimaryButton
                  className="w-full md:w-2/3 rounded-xl bg-main-color px-4 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold text-white hover:bg-secondary-color-dark"
                  onClick={() => {
                    const event = new CustomEvent("toggleDonateDock")
                    window.dispatchEvent(event)
                  }}
                >
                  후원하기
                </PrimaryButton>
              ) : (
                <div className="w-full md:w-2/3 rounded-xl bg-gray-300 px-4 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold text-gray-500 cursor-not-allowed text-center">
                  후원 불가
                </div>
              )}
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
