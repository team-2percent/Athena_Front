"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import useAuthStore from "@/stores/auth"
import FollowItem from "../profile/FollowItem"

interface Review {
  id: number
  userName: string
  content: string
  createdAt: string
  likes?: number
  profileImage?: string
}

const ProjectTabs = () => {
  const isLoggedIn = useAuthStore((state: { isLoggedIn: boolean }) => state.isLoggedIn)
  const [activeTab, setActiveTab] = useState("소개")
  const [reviewText, setReviewText] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  const seller = {
    id: 101,
    username: "가작가",
    oneLinear: "어? 왜 지가 화를 내지?",
    profileImage: "/abstract-profile.png",
  }

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

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/comment/${projectId}`)

      if (!response.ok) {
        throw new Error("리뷰를 불러오는데 실패했습니다.")
      }

      const data = await response.json()

      // API 응답 데이터를 컴포넌트에서 사용하는 형식으로 변환
      const formattedReviews = data.map((review: any) => ({
        id: review.id,
        userName: review.userName,
        content: review.content,
        createdAt: review.createdAt,
        likes: 0, // 기본값 설정
        profileImage: "/abstract-profile.png", // 기본 프로필 이미지 설정
      }))

      setReviews(formattedReviews)
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
      console.error("리뷰 불러오기 오류:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reviewText.trim()) return

    // 실제 구현에서는 API를 통해 리뷰를 제출해야 함
    console.log("리뷰 제출:", reviewText)

    // 리뷰 제출 후 입력 필드 초기화 및 리뷰 목록 새로고침
    setReviewText("")
    fetchReviews()
  }

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ". ")
  }

  return (
    <div className="mt-12">
      {/* 탭 메뉴 */}
      <div className="border-b border-gray-border">
        <div className="flex space-x-8">
          {["소개", "프로젝트 정보", "후기"].map((tab) => (
            <button
              key={tab}
              className={`relative pb-3 text-xl font-medium ${activeTab === tab ? "text-main-color" : "text-sub-gray"}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 h-1 w-full bg-main-color"></span>}
            </button>
          ))}
        </div>
      </div>

      {/* API 호출에 따른 업데이트 및 표시 대책 마련 예정 */}
      {/* 탭 내용 */}
      <div className="mt-8">
        {activeTab === "소개" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">레시피 대충 소개</h2>

            <div className="space-y-4">
              <p className="text-sub-gray">(일본요리) 제일 쉬운 떡볶이</p>
              <p className="text-sub-gray">----------------------------</p>

              <p className="text-sub-gray">재료</p>
              <p className="text-sub-gray">----------------------------</p>

              <div className="space-y-2">
                <p className="text-sub-gray">고추장 3숟</p>
                <p className="text-sub-gray">설탕 3숟</p>
                <p className="text-sub-gray">쇠고기 다시다 0.5숟</p>
                <p className="text-sub-gray">다진마늘 1숟</p>
                <p className="text-sub-gray">대파 1뿌리</p>
              </div>

              <div className="space-y-2 pt-4">
                <p className="text-sub-gray">밀떡 250~300g</p>
                <p className="text-sub-gray">물 300~350g</p>
              </div>

              <div className="mt-6">
                <Image
                  src="/tteokbokki/tteokbokki.jpg"
                  alt="떡볶이 이미지"
                  width={600}
                  height={600}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "프로젝트 정보" && (
          // 프로젝트 기본 정보 영역
          <div>
            <h2 className="mb-6 text-3xl font-bold">프로젝트 기본 정보</h2>
            <hr className="border-gray-border mb-8" />

            <div className="space-y-6">
              <div className="flex">
                <div className="w-1/4 font-medium text-sub-gray">목표금액</div>
                <div className="w-3/4 font-medium">10,000,000원</div>
              </div>

              <div className="flex">
                <div className="w-1/4 font-medium text-sub-gray">펀딩 기간</div>
                <div className="w-3/4 font-medium">2025. 04. 25 ~ 2025. 05. 15 (15일 남음)</div>
              </div>

              <div className="flex">
                <div className="w-1/4 font-medium text-sub-gray">결제</div>
                <div className="w-3/4 font-medium">목표금액 달성 시 2025. 05. 15 결제 예정</div>
              </div>

              <div className="flex">
                <div className="w-1/4 font-medium text-sub-gray">예상 발송 시작일</div>
                <div className="w-3/4 font-medium">2025. 06. 13</div>
              </div>
            </div>

            {/* 판매자 정보 영역 */}
            <h2 className="mt-12 mb-6 text-3xl font-bold">판매자 정보</h2>
            <hr className="border-gray-border mb-6" />

            <FollowItem
              id={seller.id}
              username={seller.username}
              oneLinear={seller.oneLinear}
              profileImage={seller.profileImage}
              onFollow={handleFollow}
              isFollowing={false} // 팔로우 상태는 실제 데이터에 따라 설정해야 함
            />
          </div>
        )}

        {activeTab === "후기" && (
          <div className="space-y-6">
            {/* 리뷰 입력 영역 */}
            {isLoggedIn && (
              <form onSubmit={handleReviewSubmit} className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="뭐 말이라도 해보기..."
                    className="w-full rounded-xl border border-gray-border px-4 py-4 focus:border-main-color focus:outline-none"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-main-color px-8 py-4 font-medium text-white hover:bg-secondary-color-dark"
                >
                  리뷰 작성
                </button>
              </form>
            )}

            {/* 로딩 상태 표시 */}
            {isLoading && (
              <div className="flex justify-center py-8">
                <p className="text-sub-gray">리뷰를 불러오는 중...</p>
              </div>
            )}

            {/* 에러 메시지 표시 */}
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-red-500">
                <p>{error}</p>
                <button onClick={fetchReviews} className="mt-2 text-sm underline">
                  다시 시도
                </button>
              </div>
            )}

            {/* 리뷰 목록 */}
            {!isLoading && !error && (
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="rounded-3xl border border-gray-border p-6 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          {/* 리뷰 작성자 프로필 사진 */}
                          <div className="h-16 w-16 overflow-hidden rounded-full">
                            <Image
                              src={review.profileImage || "/placeholder.svg"}
                              alt={`${review.userName} 프로필`}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {/* 리뷰 작성자 이름, 게시 날짜, 내용 */}
                          <div>
                            <h3 className="text-xl font-bold">{review.userName}</h3>
                            <p className="text-sub-gray">{formatDate(review.createdAt)}</p>
                            <div className="mt-3 whitespace-pre-line">{review.content}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1">
                            <ThumbsUp className="h-6 w-6" />
                            <span className="text-lg">{review.likes || 0}</span>
                          </button>
                          <button>
                            <ThumbsDown className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center py-8">
                    <p className="text-sub-gray">아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectTabs
