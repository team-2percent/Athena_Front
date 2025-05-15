"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import ProfileTabs from "./ProfileTabs"
import ProjectItem from "./ProjectItem"
import PurchasedProjectItem from "./PurchasedProjectItem"
import FollowItem from "./FollowItem"
import ReviewItem from "./ReviewItem"
import { useApi } from "@/hooks/useApi"
import type { UserCoupon } from "@/lib/couponInterface"
import CouponList from "./CouponList"
import Spinner from "../common/Spinner"
import EmptyMessage from "../common/EmptyMessage"

interface ProfileContentProps {
  isMy?: boolean
  userId?: number
}

interface UserInfo {
  sellerIntroduction: string
  LinkUrl: string
}

interface MyProject {
  projectId: number
  title: string
  isCompleted: boolean
  createdAt: string
  sellerName?: string
  description?: string
  imageUrl?: string
  achievementRate?: number
  daysLeft?: number | null
}

interface MyProjectsResponse {
  content: MyProject[]
  nextCursorValue: string | null
  nextProjectId: number | null
}

interface MyOrder {
  orderId: number
  productId: number
  productTitle: string
  sellerNickname: string
  thumbnailUrl: string | null
  orderedAt: string
  achievementRate: number
  hasReview?: boolean
}

interface MyOrdersResponse {
  content: MyOrder[]
  nextCursorValue: string | null
  nextOrderId: number | null
}

interface MyCouponsResponse {
  content: UserCoupon[]
  nextCouponId: number | null
  total: number
}

interface MyReview {
  id: number
  userName: string
  content: string
  createdAt: string
  // 추가 필드 (UI에 필요한 데이터)
  projectName?: string
  projectImage?: string
  likes?: number
  projectId?: number
}

// ProfileContent 함수 선언부 수정
export default function ProfileContent({ isMy, userId }: ProfileContentProps) {
  const { isLoading, apiCall } = useApi()
  const [activeTab, setActiveTab] = useState("소개")
  const [userInfo, setUserInfo] = useState<UserInfo>({
    sellerIntroduction: "",
    LinkUrl: "",
  })

  // 판매 상품 무한 스크롤을 위한 상태
  const [myProjects, setMyProjects] = useState<MyProject[]>([])
  const [cursorValue, setCursorValue] = useState<string | null>(null)
  const [lastProjectId, setLastProjectId] = useState<number | null>(null)
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const projectsLoader = useRef(null)

  // 구매 상품 무한 스크롤을 위한 상태
  const [myOrders, setMyOrders] = useState<MyOrder[]>([])
  const [orderCursorValue, setOrderCursorValue] = useState<string | null>(null)
  const [lastOrderId, setLastOrderId] = useState<number | null>(null)
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const ordersLoader = useRef(null)

  // 쿠폰 무한 스크롤을 위한 상태
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([])
  const [nextCouponId, setNextCouponId] = useState<number | null>(null)
  const [totalCoupons, setTotalCoupons] = useState(0)
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false)
  const couponsLoader = useRef(null)

  // 후기 상태
  const [myReviews, setMyReviews] = useState<MyReview[]>([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)

  // 팔로우/팔로잉 데이터 (실제로는 API에서 가져올 데이터)
  const followData = [
    {
      id: 2,
      username: "팔로워 이름",
      oneLinear: "여행하며 세상을 배우는 중임.",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 3,
      username: "팔로워 이름",
      oneLinear: "요리로 행복 나누는 중",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 4,
      username: "팔로워 이름",
      oneLinear: "책 읽는 거 좋아해요.",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 5,
      username: "팔로워 이름",
      oneLinear: "음악으로 감정 표현함.",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 6,
      username: "팔로워 이름",
      oneLinear: "운동 중. 에너지 충전 완료.",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 7,
      username: "팔로워 이름",
      oneLinear: "사진 찍는 거 재밌어요.",
      profileImage: "/abstract-profile.png",
    },
  ]

  const followingData = [
    {
      id: 12,
      username: "팔로잉 이름",
      oneLinear: "커피 한 잔으로 하루 시작함.",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 13,
      username: "팔로잉 이름",
      oneLinear: "환경 보호 중이에요.",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 14,
      username: "팔로잉 이름",
      oneLinear: "기술로 세상 바꾸고 싶음.",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 15,
      username: "팔로잉 이름",
      oneLinear: "예술로 감동 주는 중",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 16,
      username: "팔로잉 이름",
      oneLinear: "동물 좋아해요.",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 17,
      username: "팔로잉 이름",
      oneLinear: "영화 보면서 꿈꾸는 중임.",
      profileImage: "/abstract-profile.png",
    },
  ]

  // 판매 상품 불러오기
  const loadMyProjects = async () => {
    if (isLoadingProjects) return

    setIsLoadingProjects(true)

    try {
      // 자신의 프로필이면 /api/my/projects, 다른 사용자의 프로필이면 /api/user/{userId}/projects
      const baseUrl = isMy ? "/api/my/projects" : `/api/user/${userId}/projects`
      const url = `${baseUrl}${cursorValue && lastProjectId ? `?cursorValue=${cursorValue}&lastProjectId=${lastProjectId}` : ""}`
      const response = await apiCall(url, "GET")

      // API 응답 구조에 맞게 데이터 처리
      const responseData = response.data as MyProjectsResponse

      if (responseData && responseData.content) {
        // 기존 프로젝트에 새로운 프로젝트 추가
        setMyProjects((prev) => [
          ...prev,
          ...responseData.content.map((project) => ({
            ...project,
            sellerName: isMy ? "내 상품" : "판매자",
            description: "상품 설명이 여기에 표시됩니다.",
            imageUrl: "/tteokbokki/tteokbokki.jpg", // 기본 이미지
            achievementRate: 100,
            daysLeft: project.isCompleted ? null : 30,
          })),
        ])

        // 다음 페이지 정보 설정
        setCursorValue(responseData.nextCursorValue)
        setLastProjectId(responseData.nextProjectId)
      }
    } catch (error) {
      console.error("판매 상품 조회에 실패했습니다.", error)
    } finally {
      setIsLoadingProjects(false)
    }
  }

  // 구매 상품 불러오기
  const loadMyOrders = async () => {
    if (isLoadingOrders) return

    setIsLoadingOrders(true)

    try {
      const url = `/api/my/orders${orderCursorValue && lastOrderId ? `?cursorValue=${orderCursorValue}&lastOrderId=${lastOrderId}` : ""}`
      const response = await apiCall(url, "GET")

      // API 응답 구조에 맞게 데이터 처리
      const responseData = response.data as MyOrdersResponse

      if (responseData && responseData.content) {
        // 기존 주문에 새로운 주문 추가
        setMyOrders((prev) => [
          ...prev,
          ...responseData.content.map((order) => ({
            ...order,
            // 임의로 후기 작성 여부 설정 (실제로는 API에서 제공해야 함)
            hasReview: Math.random() > 0.5,
          })),
        ])

        // 다음 페이지 정보 설정
        setOrderCursorValue(responseData.nextCursorValue)
        setLastOrderId(responseData.nextOrderId)
      }
    } catch (error) {
      console.error("구매 상품 조회에 실패했습니다.", error)
    } finally {
      setIsLoadingOrders(false)
    }
  }

  // 쿠폰 불러오기
  const loadUserCoupons = async () => {
    if (isLoadingCoupons) return

    setIsLoadingCoupons(true)

    try {
      const url = `/api/my/coupons${nextCouponId ? `?nextCouponId=${nextCouponId}` : ""}`
      const response = await apiCall(url, "GET")

      // API 응답 구조에 맞게 데이터 처리
      const responseData = response.data as MyCouponsResponse

      if (responseData && responseData.content) {
        // 기존 쿠폰에 새로운 쿠폰 추가
        setUserCoupons((prev) => [...prev, ...responseData.content])

        // 다음 페이지 정보 설정
        setNextCouponId(responseData.nextCouponId)
        setTotalCoupons(responseData.total)
      }
    } catch (error) {
      console.error("쿠폰 조회에 실패했습니다.", error)
    } finally {
      setIsLoadingCoupons(false)
    }
  }

  // 후기 불러오기
  const loadMyReviews = async () => {
    if (isLoadingReviews) return

    setIsLoadingReviews(true)

    try {
      const response = await apiCall("/api/my/comments", "GET")

      if (response && response.data) {
        // API 응답 데이터를 ReviewItem 컴포넌트에 맞게 변환
        const reviews = (response.data as MyReview[]).map((review) => ({
          ...review,
          // UI에 필요한 추가 필드 (실제로는 API에서 제공해야 함)
          projectName: "상품 이름", // 임시 데이터
          projectImage: "/tteokbokki/tteokbokki.jpg", // 임시 이미지
          likes: Math.floor(Math.random() * 500), // 임시 좋아요 수
          projectId: review.id, // 임시 프로젝트 ID
        }))

        setMyReviews(reviews)
      }
    } catch (error) {
      console.error("후기 조회에 실패했습니다.", error)
    } finally {
      setIsLoadingReviews(false)
    }
  }

  // 팔로우 버튼 클릭 핸들러
  const handleFollow = (userId: number) => {
    console.log(`사용자 ${userId}를 팔로우합니다.`)
    // 실제로는 API 호출 등의 로직이 들어갈 것입니다.
  }

  // 프로젝트 삭제 핸들러
  const deleteProject = (id: number) => {
    console.log(`상품 ${id}를 삭제합니다.`)
    // 실제로는 API 호출 등의 로직이 들어갈 것입니다.
    // 삭제 후 다시 조회하여 setProjects 호출
    setMyProjects((prev) => prev.filter((project) => project.projectId !== id))
  }

  // 구매 내역 삭제 핸들러
  const deletePurchase = (id: number) => {
    console.log(`구매 내역 ${id}를 삭제합니다.`)
    // 실제로는 API 호출 등의 로직이 들어갈 것입니다.
    // 삭제 후 다시 조회하여 setPurchasedProjects 호출
    setMyOrders((prev) => prev.filter((order) => order.orderId !== id))
  }

  // 유저 정보 가져오기
  const loadUserInfo = async () => {
    try {
      // 자신의 프로필이면 /api/my/info, 다른 사용자의 프로필이면 /api/user/{userId}/info
      const url = isMy ? "/api/my/info" : `/api/user/${userId}/info`
      const response = await apiCall(url, "GET")
      if (response && response.data) {
        setUserInfo(response.data as UserInfo)
      }
    } catch (error) {
      console.error("유저 정보를 가져오는데 실패했습니다.", error)
    }
  }

  // 탭 변경 시 데이터 초기화 및 로드
  useEffect(() => {
    if (activeTab === "판매 상품" && myProjects.length === 0) {
      setMyProjects([])
      setCursorValue(null)
      setLastProjectId(null)
      loadMyProjects()
    } else if (activeTab === "구매 상품" && myOrders.length === 0) {
      setMyOrders([])
      setOrderCursorValue(null)
      setLastOrderId(null)
      loadMyOrders()
    } else if (activeTab === "쿠폰" && userCoupons.length === 0) {
      setUserCoupons([])
      setNextCouponId(null)
      loadUserCoupons()
    } else if ((activeTab === "내가 쓴 후기" || activeTab === "후기") && myReviews.length === 0) {
      setMyReviews([])
      loadMyReviews()
    }
  }, [activeTab])

  // 판매 상품 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingProjects && cursorValue !== null && lastProjectId !== null) {
          loadMyProjects()
        }
      },
      { threshold: 0.3 },
    )

    if (projectsLoader.current) {
      observer.observe(projectsLoader.current)
    }

    return () => observer.disconnect()
  }, [isLoadingProjects, cursorValue, lastProjectId])

  // 구매 상품 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingOrders && orderCursorValue !== null && lastOrderId !== null) {
          loadMyOrders()
        }
      },
      { threshold: 0.3 },
    )

    if (ordersLoader.current) {
      observer.observe(ordersLoader.current)
    }

    return () => observer.disconnect()
  }, [isLoadingOrders, orderCursorValue, lastOrderId])

  // 쿠폰 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingCoupons && nextCouponId !== null) {
          loadUserCoupons()
        }
      },
      { threshold: 0.3 },
    )

    if (couponsLoader.current) {
      observer.observe(couponsLoader.current)
    }

    return () => observer.disconnect()
  }, [isLoadingCoupons, nextCouponId])

  // 컴포넌트 마운트 시 유저 정보 로드
  useEffect(() => {
    loadUserInfo()
  }, [userId, isMy])

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
      .replace(/\./g, ". ")
  }

  return (
    <div className="mt-12">
      {/* 탭 메뉴 */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isMy={isMy} />

      {/* 탭 내용 */}
      <div className="mx-auto max-w-6xl mt-8">
        {activeTab === "소개" && (
          <div className="mb-8">
            <p className="text-sub-gray mb-8 whitespace-pre-wrap break-words">{userInfo.sellerIntroduction}</p>

            {/* 링크 목록 */}
            <div className="flex flex-wrap gap-4">
              {userInfo.LinkUrl && (
                <Link
                  href={`https://${userInfo.LinkUrl}`}
                  target="_blank"
                  className="px-6 py-3 border border-main-color text-main-color rounded-full hover:bg-secondary-color transition-colors"
                >
                  {userInfo.LinkUrl}
                </Link>
              )}
            </div>
          </div>
        )}

        {activeTab === "판매 상품" && (
          <div>
            {myProjects.length === 0 && !isLoadingProjects ? (
              <EmptyMessage message="판매 중인 상품이 없습니다." />
            ) : (
              <>
                {myProjects.map((project) => (
                  <ProjectItem
                    key={project.projectId}
                    id={project.projectId}
                    sellerName={project.sellerName || "내 상품"}
                    projectName={project.title}
                    description={project.description || "상품 설명이 여기에 표시됩니다."}
                    imageUrl={project.imageUrl || "/tteokbokki/tteokbokki.jpg"}
                    achievementRate={project.achievementRate || 100}
                    daysLeft={project.daysLeft}
                    isCompleted={project.isCompleted}
                    projectId={project.projectId}
                    isMy={isMy}
                    onClickDelete={(e) => {
                      e.stopPropagation()
                      if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
                        deleteProject(project.projectId)
                      }
                    }}
                  />
                ))}

                {/* 무한 스크롤을 위한 로더 */}
                {cursorValue !== null && lastProjectId !== null && (
                  <div className="w-full py-10 flex justify-center items-center" ref={projectsLoader}>
                    {isLoadingProjects && <Spinner message="더 불러오는 중입니다..." />}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "구매 상품" && (
          <div>
            {myOrders.length === 0 && !isLoadingOrders ? (
              <EmptyMessage message="구매한 상품이 없습니다." />
            ) : (
              <>
                {myOrders.map((order) => (
                  <PurchasedProjectItem
                    key={order.orderId}
                    id={order.orderId}
                    sellerName={order.sellerNickname}
                    projectName={order.productTitle}
                    description="상품 설명이 여기에 표시됩니다."
                    imageUrl={order.thumbnailUrl || "/tteokbokki/tteokbokki.jpg"}
                    achievementRate={order.achievementRate}
                    daysLeft={null}
                    isCompleted={true}
                    projectId={order.productId}
                    hasReview={order.hasReview || false}
                    onDeletePurchase={deletePurchase}
                  />
                ))}

                {/* 무한 스크롤을 위한 로더 */}
                {orderCursorValue !== null && lastOrderId !== null && (
                  <div className="w-full py-10 flex justify-center items-center" ref={ordersLoader}>
                    {isLoadingOrders && <Spinner message="더 불러오는 중입니다..." />}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {(activeTab === "후기" || activeTab === "내가 쓴 후기") && (
          <div>
            {myReviews.length === 0 && !isLoadingReviews ? (
              <EmptyMessage message="작성한 후기가 없습니다." />
            ) : (
              <>
                {myReviews.map((review) => (
                  <ReviewItem
                    key={review.id}
                    id={review.id}
                    sellerName={review.userName}
                    projectName={review.projectName || "상품 이름"}
                    reviewDate={formatDate(review.createdAt)}
                    reviewContent={review.content}
                    projectImage={review.projectImage || "/tteokbokki/tteokbokki.jpg"}
                    likes={review.likes || 0}
                    projectId={review.projectId || review.id}
                  />
                ))}

                {isLoadingReviews && (
                  <div className="w-full py-10 flex justify-center items-center">
                    <Spinner message="후기를 불러오는 중입니다..." />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "팔로워" && (
          <div>
            {followData.map((user) => (
              <FollowItem
                key={user.id}
                id={user.id}
                username={user.username}
                oneLinear={user.oneLinear}
                profileImage={user.profileImage}
                onFollow={handleFollow}
                isFollowing={false}
              />
            ))}
          </div>
        )}

        {activeTab === "팔로잉" && (
          <div>
            {followingData.map((user) => (
              <FollowItem
                key={user.id}
                id={user.id}
                username={user.username}
                oneLinear={user.oneLinear}
                profileImage={user.profileImage}
                onFollow={handleFollow}
                isFollowing={true}
              />
            ))}
          </div>
        )}

        {activeTab === "쿠폰" && (
          <div>
            {userCoupons.length === 0 && !isLoadingCoupons ? (
              <EmptyMessage message="쿠폰이 없습니다." />
            ) : (
              <>
                <CouponList coupons={userCoupons} />

                {/* 무한 스크롤을 위한 로더 */}
                {nextCouponId !== null && (
                  <div className="w-full py-10 flex justify-center items-center" ref={couponsLoader}>
                    {isLoadingCoupons && <Spinner message="더 불러오는 중입니다..." />}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
