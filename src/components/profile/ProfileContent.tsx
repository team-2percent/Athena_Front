"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import ProjectListItem from "./ProjectListItem"
import PurchasedProjectItem from "./PurchasedProjectItem"
import ReviewItem from "./ReviewItem"
import { useApi } from "@/hooks/useApi"
import type { UserCoupon } from "@/lib/couponInterface"
import CouponList from "./CouponList"
import Spinner from "../common/Spinner"
import EmptyMessage from "../common/EmptyMessage"
import DeleteModal from "./DeleteModal"
import MenuTab from "../common/MenuTab"

interface ProfileContentProps {
  isMy?: boolean
  userId?: number
  sellerDescription: string,
  linkUrl: string
}

interface MyProject {
  projectId: number
  title: string
  isCompleted: boolean
  createdAt: string
  endAt: string
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
  productId: number
  productName: string
  orderId: number
  orderedAt: string
  projectId: number
  projectName: string
  sellerName: string
  thumbnailUrl: string | null
  endAt: string
  achievementRate: number
  hasCommented?: boolean
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
  projectName?: string
  imageUrl?: string
  projectId?: number
}

// ProfileContent 함수 선언부 수정
export default function ProfileContent({ isMy, userId, sellerDescription, linkUrl }: ProfileContentProps) {
  const { isLoading, apiCall } = useApi()
  const [activeTab, setActiveTab] = useState("소개")
  

  // 판매 상품 무한 스크롤을 위한 상태
  const [myProjects, setMyProjects] = useState<MyProject[]>([])
  const [sellCursorValue, setSellCursorValue] = useState<string | null>(null)
  const [nextProjectId, setNextProjectId] = useState<number | null>(null)
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

  // 삭제 모달 상태
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [deleteError, setDeleteError] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 판매 상품 불러오기
  const loadMyProjects = async () => {
    if (isLoadingProjects) return

    setIsLoadingProjects(true)

    try {
      // 자신의 프로필이면 /api/my/projects, 다른 사용자의 프로필이면 /api/user/{userId}/projects
      const baseUrl = isMy ? "/api/my/project" : `/api/user/${userId}/project`
      const url = `${baseUrl}${sellCursorValue && nextProjectId ? `?nextCursorValue=${sellCursorValue}&nextProjectId=${nextProjectId}` : ""}`
      const response = await apiCall(url, "GET")

      // API 응답 구조에 맞게 데이터 처리
      const responseData = response.data as MyProjectsResponse
      console.log("판매 상품 데이터:", responseData)

      if (responseData && responseData.content) {
        // 기존 프로젝트에 새로운 프로젝트 추가
        setMyProjects((prev) => [...prev, ...responseData.content])

        // 다음 페이지 정보 설정
        setSellCursorValue(responseData.nextCursorValue)
        setNextProjectId(responseData.nextProjectId)
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
      const url = `/api/my/order${orderCursorValue && lastOrderId ? `?nextCursorValue=${orderCursorValue}&nextOrderId=${lastOrderId}` : ""}`
      const response = await apiCall(url, "GET")

      // API 응답 구조에 맞게 데이터 처리
      const responseData = response.data as MyOrdersResponse
      console.log("구매 상품 데이터:", responseData)

      if (responseData && responseData.content) {
        // 기존 주문에 새로운 주문 추가
        setMyOrders((prev) => [...prev, ...responseData.content])

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

  const loadMyOrdersAfterWriteReview = async () => {
    if (isLoadingOrders) return

    setIsLoadingOrders(true)

    try {
      const url = `/api/my/order`
      const response = await apiCall(url, "GET")

      // API 응답 구조에 맞게 데이터 처리
      const responseData = response.data as MyOrdersResponse
      console.log("구매 상품 데이터:", responseData)

      if (responseData && responseData.content) {
        // 완전히 처음부터 불러오기
        setMyOrders(() => [...responseData.content])

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
      const url = `/api/my/coupon${nextCouponId ? `?cursorId=${nextCouponId}` : ""}`
      const response = await apiCall(url, "GET")

      // API 응답 구조에 맞게 데이터 처리
      const responseData = response.data as MyCouponsResponse
      console.log("쿠폰 데이터:", responseData)

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
      const response = await apiCall("/api/my/comment", "GET")

      if (response && response.data) {
        console.log("후기 데이터:", response.data)
        setMyReviews(response.data as MyReview[])
      }
    } catch (error) {
      console.error("후기 조회에 실패했습니다.", error)
    } finally {
      setIsLoadingReviews(false)
    }
  }

  // 삭제 모달 관련 핸들러
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation()
    setIsOpenDeleteModal(true)
    setDeleteId(id)
    setDeleteError(false)
    setDeleteSuccess(false)
  }

  const handleCloseDeleteModal = () => {
    setIsOpenDeleteModal(false)
    setDeleteError(false)
    setDeleteSuccess(false)
  }

  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      setIsDeleting(true)
      try {
        // 판매 상품 삭제
        await apiCall(`/api/project/${deleteId}`, "DELETE")
        setMyProjects((prev) => prev.filter((project) => project.projectId !== deleteId))
        setDeleteSuccess(true)
        setIsDeleting(false)
      } catch (error) {
        console.error("상품 삭제에 실패했습니다.", error)
        setDeleteError(true)
        setIsDeleting(false)
      }
    }
  }

  const onClickTab = (tab: string) => {
    setActiveTab(tab)
  }

  // 탭 변경 시 데이터 초기화 및 로드
  useEffect(() => {
    if (activeTab === "판매 상품" && myProjects.length === 0) {
      setMyProjects([])
      setSellCursorValue(null)
      setNextProjectId(null)
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
        if (entries[0].isIntersecting && !isLoadingProjects && sellCursorValue !== null && nextProjectId !== null) {
          loadMyProjects()
        }
      },
      { threshold: 0.3 },
    )

    if (projectsLoader.current) {
      observer.observe(projectsLoader.current)
    }

    return () => observer.disconnect()
  }, [isLoadingProjects, sellCursorValue, nextProjectId])

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
      {/* 삭제 확인 모달 */}
      {isOpenDeleteModal && (
        <DeleteModal
          isOpen={isOpenDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          deleteError={deleteError}
          deleteSuccess={deleteSuccess}
          itemType="상품"
          isDeleting={isDeleting}
        />
      )}

      {/* 탭 메뉴 */}
      <MenuTab
        size="lg"
        tabs={isMy ? ["소개", "쿠폰", "판매 상품", "구매 상품", "내가 쓴 후기"] : ["소개", "판매 상품", "후기"]}
        activeTab={activeTab}
        onClickTab={onClickTab}
        className="border-b border-gray-border mx-auto"
      />

      {/* 탭 내용 */}
      <div className="mx-auto mt-8 min-h-[300px]">
        {/* 소개 탭 */}
        <div className={activeTab === "소개" ? "block" : "hidden"}>
          <div className="mb-8">
            <p className="text-sub-gray mb-8 whitespace-pre-wrap break-words" data-cy="profile-seller-description">{sellerDescription || "소개글이 없습니다."}</p>
            {/* 링크 목록 */}
            <div className="flex flex-wrap gap-3 sm:gap-4" data-cy="profile-link-list">
              {linkUrl && linkUrl.split(",").map(url => (
                <Link
                  href={`${url}`}
                  target="_blank"
                  data-cy="profile-link"
                  className="px-3 py-2 sm:px-6 sm:py-3 border border-main-color text-main-color rounded-full hover:bg-secondary-color transition-colors text-sm sm:text-base border-[1px] sm:border-2"
                >
                  {url}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* 판매 상품 탭 */}
        <div className={activeTab === "판매 상품" ? "block" : "hidden"}>
          {myProjects.length === 0 && !isLoadingProjects ? (
            <EmptyMessage message="판매 중인 상품이 없습니다." />
          ) : (
            <>
              {myProjects.map((project) => (
                <ProjectListItem
                  key={project.projectId}
                  id={project.projectId}
                  sellerName={project.sellerName || "내 프로젝트"}
                  projectName={project.title}
                  description={project.description || "프로젝트 설명이 여기에 표시됩니다."}
                  createdAt={formatDate(project.createdAt)}
                  endAt={formatDate(project.endAt)}
                  imageUrl={project.imageUrl || "https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg"}
                  achievementRate={project.achievementRate || 0}
                  daysLeft={project.daysLeft}
                  isCompleted={project.isCompleted}
                  projectId={project.projectId}
                  isMy={isMy}
                  onClickDelete={(e) => handleDeleteClick(e, project.projectId)}
                />
              ))}
              {/* 무한 스크롤을 위한 로더 */}
              {sellCursorValue !== null && nextProjectId !== null && (
                <div className="w-full py-10 flex justify-center items-center" ref={projectsLoader} data-cy="scroll-loader">
                  {isLoadingProjects && <Spinner message="더 불러오는 중입니다..." />}
                </div>
              )}
            </>
          )}
        </div>
        {/* 구매 상품 탭 */}
        <div className={activeTab === "구매 상품" ? "block" : "hidden"}>
          {myOrders.length === 0 && !isLoadingOrders ? (
            <EmptyMessage message="구매한 상품이 없습니다." />
          ) : (
            <>
              {myOrders.map((order) => (
                <PurchasedProjectItem
                  key={`${order.orderId}${order.projectId}${order.productId}`}
                  orderId={order.orderId}
                  sellerName={order.sellerName}
                  productName={order.productName}
                  projectName={order.projectName}
                  orderedAt={formatDate(order.orderedAt)}
                  endAt={formatDate(order.endAt)}
                  imageUrl={
                    order.thumbnailUrl || "https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg"
                  }
                  achievementRate={order.achievementRate}
                  projectId={order.projectId}
                  hasCommented={order.hasCommented || false}
                  loadOrders={loadMyOrdersAfterWriteReview}
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
        {/* 후기/내가 쓴 후기 탭 */}
        <div className={(activeTab === "후기" || activeTab === "내가 쓴 후기") ? "block" : "hidden"}>
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
                  imageUrl={review.imageUrl || "https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg"}
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
        {/* 쿠폰 탭 */}
        <div className={activeTab === "쿠폰" ? "block" : "hidden"}>
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
      </div>
    </div>
  )
}
