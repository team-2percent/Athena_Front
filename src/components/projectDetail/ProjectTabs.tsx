"use client"

import type React from "react"

import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { useParams } from "next/navigation"
import FollowItem from "../profile/FollowItem"
import { useApi } from "@/hooks/useApi"
import MarkdownRenderer, { extractHeadings } from "../projectRegister/MarkdownRenderer"
import TableOfContents from "./TableOfContents"
import useAuthStore from "@/stores/auth"
import { formatDate, calculateDaysLeft } from "@/lib/utils"
import Image from "next/image"
import customLoader from "@/lib/customLoader"

interface Review {
  id: number
  userName: string
  content: string
  createdAt: string
  imageUrl?: string
}

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

interface ProjectTabsProps {
  projectData: ProjectData | null
  isLoading: boolean
  error: string | null
}

const ProjectTabs = ({ projectData, isLoading, error }: ProjectTabsProps) => {
  const isLoggedIn = useAuthStore((state: { isLoggedIn: boolean }) => state.isLoggedIn)
  const { apiCall, isLoading: apiLoading } = useApi()
  const [activeTab, setActiveTab] = useState("소개")
  const [reviewText, setReviewText] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsError, setReviewsError] = useState<string | null>(null)

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  // 판매자 정보는 projectData.sellerResponse에서만 가져옴

  const handleFollow = (id: number) => {
    // 팔로우 로직 구현 예정
    console.log(`판매자 ${id} 팔로우`)
  }

  const { id } = useParams()
  const projectId = id

  // 리뷰 데이터 가져오기
  useEffect(() => {
    if (activeTab === "후기") {
      fetchReviews()
    }
  }, [activeTab])

  // fetchReviews 함수
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true)
      setReviewsError(null)

      const { data, error, status } = await apiCall<Review[]>(`/api/comment/${projectId}`, "GET")

      console.log(data)

      if (error) {
        throw new Error(error)
      }

      if (data) {
        // API 응답 데이터를 컴포넌트에서 사용하는 형식으로 변환
        const formattedReviews = data.map((review: any) => ({
          id: review.id,
          userName: review.userName,
          content: review.content,
          createdAt: review.createdAt,
          imageUrl: review.imageUrl,
        }))

        setReviews(formattedReviews)
      }
    } catch (err) {
      setReviewsError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
      console.error("리뷰 불러오기 오류:", err)
    } finally {
      setReviewsLoading(false)
    }
  }

  // handleReviewSubmit 함수
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reviewText.trim()) return

    try {
      const { data, error, status } = await apiCall(
        `/api/comment/create?projectId=${projectId}&content=${encodeURIComponent(reviewText)}`,
        "POST",
      )

      if (error) {
        setReviewsError(error)
        return
      }

      console.log("리뷰 제출 성공:", data)

      // 리뷰 제출 후 입력 필드 초기화 및 리뷰 목록 새로고침
      setReviewText("")
      fetchReviews()
    } catch (err) {
      setReviewsError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
      console.error("리뷰 제출 오류:", err)
    }
  }

  // 기본 마크다운 콘텐츠 (API 데이터가 없을 경우 사용)
  const defaultMarkdown = `
  작성된 내용이 없습니다.
  `

  // 마크다운에서 헤딩 추출
  const headings = projectData?.markdown ? extractHeadings(projectData.markdown) : []

  const tabList = ["소개", "프로젝트 정보", "후기"]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const idx = tabList.indexOf(activeTab)
    const node = tabRefs.current[idx]
    if (node) {
      setUnderlineStyle({
        left: node.offsetLeft,
        width: node.offsetWidth,
      })
    }
  }, [activeTab, tabRefs.current.length])

  return (
    <div className="mt-12">
      {/* 로딩 상태 표시 */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <p className="text-sub-gray">프로젝트 정보를 불러오는 중...</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* 탭 메뉴 */}
          <div className="border-b border-gray-border relative">
            <div className="flex space-x-8 relative">
              {tabList.map((tab, idx) => (
                <button
                  key={tab}
                  ref={el => { tabRefs.current[idx] = el; }}
                  className={`relative pb-4 text-base md:text-xl font-medium ${activeTab === tab ? "text-main-color" : "text-sub-gray"}`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              ))}
              {/* 슬라이드 언더라인 */}
              <span
                className="absolute bottom-0 h-1 bg-main-color transition-all duration-300"
                style={{ left: underlineStyle.left, width: underlineStyle.width }}
              />
            </div>
          </div>

          {/* 탭 내용 */}
          <div className="mt-8 relative min-h-[300px]">
            {/* 소개 탭 */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "소개" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                {/* 소개글 영역 (좌측) */}
                <div className="lg:col-span-4 pb-32 md:pb-180">
                  <MarkdownRenderer content={projectData?.markdown || defaultMarkdown} />
                </div>
                {/* 목차 영역 (우측) */}
                <div className="lg:col-span-2 hidden md:block">
                  <TableOfContents headings={headings} />
                </div>
              </div>
            </div>
            {/* 프로젝트 정보 탭 */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "프로젝트 정보" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
              data-cy="project-info-tab"
            >
              <div>
                <h2 className="mb-4 md:mb-8 text-lg md:text-3xl font-bold">프로젝트 기본 정보</h2>
                <hr className="border-gray-border mb-4 md:mb-8" />
                <div className="space-y-6">
                  <div className="flex gap-4 md:gap-0">
                    <div className="w-1/3 md:w-1/4 text-xs md:text-base font-medium text-sub-gray">목표금액</div>
                    <div className="w-2/3 md:w-3/4 text-xs md:text-base font-medium">{projectData?.goalAmount?.toLocaleString() || "?"}원</div>
                  </div>
                  <div className="flex gap-4 md:gap-0">
                    <div className="w-1/3 md:w-1/4 text-xs md:text-base font-medium text-sub-gray">펀딩 기간</div>
                    <div className="w-2/3 md:w-3/4 text-xs md:text-base font-medium">
                      {/* 데스크톱: 기존 한 줄 */}
                      <span className="hidden md:block">
                        {projectData?.endAt ? (
                          <>
                            {formatDate(new Date(projectData?.startAt || ""))} ~ {formatDate(new Date(projectData.endAt))}
                            {" ("}
                            {(() => {
                              const daysLeft = calculateDaysLeft(projectData.endAt)
                              if (daysLeft < 0) return "종료"
                              if (daysLeft === 0) return "마감임박"
                              return `${daysLeft}일 남음`
                            })()}
                            {")"}
                          </>
                        ) : projectData?.startAt ? null : (
                          "알 수 없음"
                        )}
                      </span>
                      {/* 모바일: 두 줄 */}
                      <span className="block md:hidden">
                        {projectData?.endAt ? (
                          <>
                            {formatDate(new Date(projectData?.startAt || ""))} ~ {formatDate(new Date(projectData.endAt))}<br />
                            ({(() => {
                              const daysLeft = calculateDaysLeft(projectData.endAt)
                              if (daysLeft < 0) return "종료"
                              if (daysLeft === 0) return "마감임박"
                              return `${daysLeft}일 남음`
                            })()})
                          </>
                        ) : projectData?.startAt ? null : (
                          "알 수 없음"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 md:gap-0">
                    <div className="w-1/3 md:w-1/4 text-xs md:text-base font-medium text-sub-gray">결제</div>
                    <div className="w-2/3 md:w-3/4 text-xs md:text-base font-medium">
                      {/* 데스크톱: 기존 한 줄 */}
                      <span className="hidden md:block">
                        목표금액 달성 시 {formatDate(new Date(projectData?.endAt || ""))} 결제 예정
                      </span>
                      {/* 모바일: 두 줄 */}
                      <span className="block md:hidden">
                        목표금액 달성 시<br />
                        {formatDate(new Date(projectData?.endAt || ""))} 결제 예정
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 md:gap-0">
                    <div className="w-1/3 md:w-1/4 text-xs md:text-base font-medium text-sub-gray">예상 발송 시작일</div>
                    <div className="w-2/3 md:w-3/4 text-xs md:text-base font-medium">{formatDate(new Date(projectData?.shippedAt || ""))}</div>
                  </div>
                </div>
                {/* 판매자 정보 영역 */}
                <h2 className="mt-8 md:mt-16 mb-4 md:mb-8 text-lg md:text-3xl font-bold">판매자 정보</h2>
                <hr className="border-gray-border mb-4 md:mb-8" />
                {projectData?.sellerResponse ? (
                  <FollowItem
                    id={projectData.sellerResponse.id}
                    username={projectData.sellerResponse.nickname}
                    oneLinear={projectData.sellerResponse.sellerIntroduction || "판매자 소개가 없습니다."}
                    profileImage="/placeholder/profile-placeholder.png"
                    onFollow={handleFollow}
                    isFollowing={false}
                  />
                ) : (
                  <div className="py-4 text-sub-gray">판매자 정보를 불러올 수 없습니다.</div>
                )}
              </div>
            </div>
            {/* 후기 탭 */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "후기" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
              <div className="space-y-6">
                {/* 로딩 상태 표시 */}
                {reviewsLoading && (
                  <div className="flex justify-center py-8">
                    <p className="text-sub-gray">리뷰를 불러오는 중...</p>
                  </div>
                )}
                {/* 에러 메시지 표시 */}
                {reviewsError && (
                  <div className="rounded-xl bg-red-50 p-4 text-red-500">
                    <p>{reviewsError}</p>
                    <button onClick={fetchReviews} className="mt-2 text-sm underline">
                      다시 시도
                    </button>
                  </div>
                )}
                {/* 리뷰 목록 */}
                {!reviewsLoading && !reviewsError && (
                  <div className="space-y-3 md:space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="rounded-3xl border border-gray-border p-4 md:p-6 shadow-sm" data-cy="review-item">
                          <div className="flex items-center space-x-3 md:space-x-4">
                            {/* 리뷰 작성자 프로필 사진 */}
                            <div className="h-10 w-10 md:h-16 md:w-16 overflow-hidden rounded-full">
                              <Image
                                loader={customLoader}
                                src={review.imageUrl || "/placeholder.svg"}
                                alt={`${review.userName} 프로필`}
                                className="h-full w-full object-cover"
                                fill
                              />
                            </div>
                            {/* 이름/날짜 */}
                            <div className="flex flex-col justify-center">
                              <h3 className="text-base md:text-xl font-bold" data-cy="review-username">{review.userName}</h3>
                              <p className="text-xs md:text-base text-sub-gray" data-cy="review-date">{formatDate(new Date(review.createdAt))}</p>
                            </div>
                          </div>
                          {/* 리뷰 내용 */}
                          <div className="mt-2 md:mt-3 text-sm md:text-base whitespace-pre-line ml-0 md:ml-20" data-cy="review-content">{review.content}</div>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-center md:py-4">
                        {/* 데스크톱: 한 줄 */}
                        <p className="hidden md:block text-sm md:text-base text-sub-gray">
                          아직 리뷰가 없습니다. 프로젝트를 후원하고 리뷰를 작성해 보세요!
                        </p>
                        {/* 모바일: 두 줄 */}
                        <span className="block md:hidden text-center text-sm text-sub-gray">
                          아직 리뷰가 없습니다.<br />프로젝트를 후원하고 리뷰를 작성해 보세요!
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProjectTabs