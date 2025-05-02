"use client"

import { useState } from "react"
import Link from "next/link"
import ProfileTabs from "./ProfileTabs"
import ProductItem from "./ProductItem"
import FollowItem from "./FollowItem"
import ReviewItem from "./ReviewItem"

interface ProfileContentProps {
  introduction: string
  links: string[]
}

export default function ProfileContent({ introduction, links }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("소개")

  // 상품 데이터 (실제로는 API에서 가져올 데이터)
  const products = [
    {
      id: 1,
      sellerName: "판매자 이름",
      productName: "상품 이름",
      description:
        "상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개...",
      imageUrl: "/placeholder.svg?height=192&width=256",
      achievementRate: 10,
      daysLeft: 1,
      isCompleted: false,
    },
    {
      id: 2,
      sellerName: "판매자 이름",
      productName: "상품 이름",
      description:
        "상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개...",
      imageUrl: "/placeholder.svg?height=192&width=256",
      achievementRate: 10000,
      daysLeft: 20,
      isCompleted: false,
    },
    {
      id: 3,
      sellerName: "판매자 이름",
      productName: "상품 이름",
      description:
        "상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개...",
      imageUrl: "/placeholder.svg?height=192&width=256",
      achievementRate: 10000,
      daysLeft: null,
      isCompleted: true,
    },
    {
      id: 4,
      sellerName: "판매자 이름",
      productName: "상품 이름",
      description:
        "상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개...",
      imageUrl: "/placeholder.svg?height=192&width=256",
      achievementRate: 10000,
      daysLeft: null,
      isCompleted: true,
    },
  ]

  // 팔로우/팔로잉 데이터 (실제로는 API에서 가져올 데이터)
  const followData = [
    {
      id: 1,
      username: "팔로워 이름",
      purchaseCount: 255,
      profileImage: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      username: "팔로워 이름",
      purchaseCount: 255,
      profileImage: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      username: "팔로워 이름",
      purchaseCount: 255,
      profileImage: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      username: "팔로워 이름",
      purchaseCount: 255,
      profileImage: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 5,
      username: "팔로워 이름",
      purchaseCount: 255,
      profileImage: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 6,
      username: "팔로워 이름",
      purchaseCount: 255,
      profileImage: "/placeholder.svg?height=80&width=80",
    },
  ]

  const followingData = [
    {
      id: 1,
      username: "팔로워 이름",
      purchaseCount: 3000,
      profileImage: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      username: "팔로워 이름",
      purchaseCount: 3000,
      profileImage: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      username: "팔로워 이름",
      purchaseCount: 3000,
      profileImage: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      username: "팔로워 이름",
      purchaseCount: 3000,
      profileImage: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 5,
      username: "팔로워 이름",
      purchaseCount: 3000,
      profileImage: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 6,
      username: "팔로워 이름",
      purchaseCount: 3000,
      profileImage: "/placeholder.svg?height=80&width=80",
    },
  ]

  // 후기 데이터 (실제로는 API에서 가져올 데이터)
  const reviews = [
    {
      id: 1,
      sellerName: "판매자 이름",
      productName: "상품 이름",
      reviewDate: "2025. 04. 23.",
      reviewContent: "스마케어 맨날 이딴 거나 팔아재끼지말고\n게임이나 똑바로 만들어라 ㅡㅡ",
      productImage: "/placeholder.svg?height=192&width=256",
      likes: 358,
    },
    {
      id: 2,
      sellerName: "판매자 이름",
      productName: "상품 이름",
      reviewDate: "2025. 04. 23.",
      reviewContent:
        "//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
      productImage: "/placeholder.svg?height=192&width=256",
      likes: 358,
    },
  ]

  // 팔로우 버튼 클릭 핸들러
  const handleFollow = (userId: number) => {
    console.log(`사용자 ${userId}를 팔로우합니다.`)
    // 실제로는 API 호출 등의 로직이 들어갈 것입니다.
  }

  return (
    <div className="mt-12">
      {/* 탭 메뉴 */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 탭 내용 */}
      <div className="mx-auto max-w-6xl mt-8">
        {activeTab === "소개" && (
          <div className="mb-8">
            <p className="text-gray-700 mb-8 whitespace-pre-wrap break-words">{introduction}</p>

            {/* 링크 목록 */}
            <div className="flex flex-wrap gap-4">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={`https://${link}`}
                  target="_blank"
                  className="px-6 py-3 bg-pink-50 text-pink-400 rounded-full hover:bg-pink-100 transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === "판매 상품" && (
          <div>
            {products.map((product) => (
              <ProductItem
                key={product.id}
                id={product.id}
                sellerName={product.sellerName}
                productName={product.productName}
                description={product.description}
                imageUrl={product.imageUrl}
                achievementRate={product.achievementRate}
                daysLeft={product.daysLeft}
                isCompleted={product.isCompleted}
              />
            ))}
          </div>
        )}

        {activeTab === "후기" && (
          <div>
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                id={review.id}
                sellerName={review.sellerName}
                productName={review.productName}
                reviewDate={review.reviewDate}
                reviewContent={review.reviewContent}
                productImage={review.productImage}
                likes={review.likes}
              />
            ))}
          </div>
        )}

        {activeTab === "팔로우" && (
          <div>
            {followData.map((user) => (
              <FollowItem
                key={user.id}
                id={user.id}
                username={user.username}
                purchaseCount={user.purchaseCount}
                profileImage={user.profileImage}
                onFollow={handleFollow}
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
                purchaseCount={user.purchaseCount}
                profileImage={user.profileImage}
                onFollow={handleFollow}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
