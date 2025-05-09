"use client"

import { useState } from "react"
import Link from "next/link"
import ProfileTabs from "./ProfileTabs"
import ProjectItem from "./ProjectItem"
import FollowItem from "./FollowItem"
import ReviewItem from "./ReviewItem"
import { Percent } from "lucide-react"
import MyProjectList from "./MyProjectList"
import clsx from "clsx"

interface ProfileContentProps {
  introduction: string
  links: string[]
  isMy?: boolean
}

export default function ProfileContent({ introduction, links, isMy }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("소개")

  // 상품 데이터 (실제로는 API에서 가져올 데이터)
  const projects = [
    {
      id: 1,
      sellerName: "판매자 이름",
      projectName: "상품 이름",
      description:
        "상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개...",
      imageUrl: "/tteokbokki/tteokbokki.jpg",
      achievementRate: 10,
      daysLeft: 1,
      isCompleted: false,
      projectId: 201,
    },
    {
      id: 2,
      sellerName: "판매자 이름",
      projectName: "상품 이름",
      description:
        "상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개...",
      imageUrl: "/tteokbokki/tteokbokki.jpg",
      achievementRate: 10000,
      daysLeft: 20,
      isCompleted: false,
      projectId: 202,
    },
    {
      id: 3,
      sellerName: "판매자 이름",
      projectName: "상품 이름",
      description:
        "상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개...",
      imageUrl: "/tteokbokki/tteokbokki.jpg",
      achievementRate: 10000,
      daysLeft: null,
      isCompleted: true,
      projectId: 203,
    },
    {
      id: 4,
      sellerName: "판매자 이름",
      projectName: "상품 이름",
      description:
        "상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개...",
      imageUrl: "/tteokbokki/tteokbokki.jpg",
      achievementRate: 10000,
      daysLeft: null,
      isCompleted: true,
      projectId: 204,
    },
  ]

  // 팔로우/팔로잉 데이터 (실제로는 API에서 가져올 데이터)
  const followData = [
    {
      id: 2,
      username: "팔로워 이름",
      purchaseCount: 255,
      profileImage: "/abstract-profile.png",
    },
    {
      id: 3,
      username: "팔로워 이름",
      purchaseCount: 255,
      profileImage: "/abstract-profile.png",
    },
    {
      id: 4,
      username: "팔로워 이름",
      purchaseCount: 255,
      profileImage: "/abstract-profile.png",
    },
    {
      id: 5,
      username: "팔로워 이름",
      purchaseCount: 255,
      profileImage: "/abstract-profile.png",
    },
    {
      id: 6,
      username: "팔로워 이름",
      purchaseCount: 255,
      profileImage: "/abstract-profile.png",
    },
    {
      id: 7,
      username: "팔로워 이름",
      purchaseCount: 255,
      profileImage: "/abstract-profile.png",
    },
  ]

  const followingData = [
    {
      id: 12,
      username: "팔로워 이름",
      purchaseCount: 3000,
      profileImage: "/abstract-profile.png",
    },
    {
      id: 13,
      username: "팔로워 이름",
      purchaseCount: 3000,
      profileImage: "/abstract-profile.png",
    },
    {
      id: 14,
      username: "팔로워 이름",
      purchaseCount: 3000,
      profileImage: "/abstract-profile.png",
    },
    {
      id: 15,
      username: "팔로워 이름",
      purchaseCount: 3000,
      profileImage: "/abstract-profile.png",
    },
    {
      id: 16,
      username: "팔로워 이름",
      purchaseCount: 3000,
      profileImage: "/abstract-profile.png",
    },
    {
      id: 17,
      username: "팔로워 이름",
      purchaseCount: 3000,
      profileImage: "/abstract-profile.png",
    },
  ]

  // 후기 데이터 (실제로는 API에서 가져올 데이터)
  const reviews = [
    {
      id: 1,
      sellerName: "판매자 이름",
      projectName: "상품 이름",
      reviewDate: "2025. 04. 23.",
      reviewContent: "스마케어 맨날 이딴 거나 팔아재끼지말고\n게임이나 똑바로 만들어라 ㅡㅡ",
      projectImage: "/tteokbokki/tteokbokki.jpg",
      likes: 358,
      projectId: 101,
    },
    {
      id: 2,
      sellerName: "판매자 이름",
      projectName: "상품 이름",
      reviewDate: "2025. 04. 23.",
      reviewContent:
        "//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
      projectImage: "/tteokbokki/tteokbokki.jpg",
      likes: 358,
      projectId: 102,
    },
  ]

  // mock data: 쿠폰 데이터 추후 삭제
  const coupons = [
    {
      id: 1,
      amount: "1000000원",
      title: "~~~~ 쿠폰",
      description:
        "쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다.",
      validUntil: "2023-5-12",
      state: "UNUSED"
    },
    {
      id: 2,
      amount: "1000000원",
      title: "~~~~ 쿠폰",
      description:
        "쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다.",
      validUntil: "2023-5-12",
      state: "USED"
    },
    {
      id: 3,
      amount: "1000000원",
      title: "~~~~ 쿠폰",
      description:
        "쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다.",
      validUntil: "2023-5-12",
      state: "EXPIRED"
    },
    {
      id: 4,
      amount: "1000000원",
      title: "~~~~ 쿠폰",
      description:
        "쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다.",
      validUntil: "2023-5-12",
      state: "EXPIRED"
    },
  ]

  const couponStateMessage = (state: string, expiredDate: string) => {
    if (state === "UNUSED") {
      return `${expiredDate}까지 사용가능`
    } else if (state === "USED") {
      return "사용완료"
    } else if (state === "EXPIRED") {
      return `${expiredDate} 만료`
    }
  }

  // 팔로우 버튼 클릭 핸들러
  const handleFollow = (userId: number) => {
    console.log(`사용자 ${userId}를 팔로우합니다.`)
    // 실제로는 API 호출 등의 로직이 들어갈 것입니다.
  }

  const deleteProject = (id: number) => {
    console.log(`상품 ${id}를 삭제합니다.`)
    // 실제로는 API 호출 등의 로직이 들어갈 것입니다.
    // 삭제 후 다시 조회하여 setProjects 호출
  }

  return (
    <div className="mt-12">
      {/* 탭 메뉴 */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isMy={isMy} />

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

        {activeTab === "판매 상품" && (isMy ? (
          <MyProjectList projects={projects} deleteProject={deleteProject} />
        ) : (
          <div>
            {projects.map((project) => (
              <ProjectItem
                key={project.id}
                id={project.id}
                sellerName={project.sellerName}
                projectName={project.projectName}
                description={project.description}
                imageUrl={project.imageUrl}
                achievementRate={project.achievementRate}
                daysLeft={project.daysLeft}
                isCompleted={project.isCompleted}
                projectId={project.projectId}
              />
            ))}
          </div>
        ))}

        {activeTab === "후기" || activeTab === "내가 쓴 후기" && (
          <div>
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                id={review.id}
                sellerName={review.sellerName}
                projectName={review.projectName}
                reviewDate={review.reviewDate}
                reviewContent={review.reviewContent}
                projectImage={review.projectImage}
                likes={review.likes}
                projectId={review.projectId}
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

        {activeTab === "쿠폰" && <div className="flex flex-col gap-4">
          {coupons.map((coupon) => (
          <div className="rounded-2xl border border-gray-200 flex overflow-hidden" key={coupon.id}>
            {/* 왼쪽: 퍼센트 아이콘 */}
            <div className={clsx("relative min-w-[70px] h-[100px] flex items-center justify-center", coupon.state === "UNUSED" ? "bg-[#FF0040]" : "bg-[#B3B3B3]")}>
              <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full translate-x-1/2 translate-y-[-50%]"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full translate-x-1/2 translate-y-[50%]"></div>
              <Percent className="h-8 w-8 text-white" />
            </div>
      
            {/* 중앙: 쿠폰 제목 및 설명 */}
            <div className="flex-1 p-4 flex flex-col justify-center">
              <h3 className="text-lg font-bold">{coupon.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
            </div>
      
            {/* 구분선 */}
            <div className="w-0 border-l border-dashed border-gray-300 my-4"></div>
      
            {/* 오른쪽: 금액 및 유효기간 */}
            <div className="p-4 flex flex-col justify-center items-end min-w-[140px]">
              <p className={clsx("text-xl font-bold", coupon.state === "UNUSED" ? "text-[#FF0040]" : "text-[#B3B3B3]")}>{coupon.amount}</p>
              <p className="text-xs text-gray-500 mt-1">
                {couponStateMessage(coupon.state, coupon.validUntil)}
              </p>
            </div>
          </div>
        ))}
        </div>
        }
      </div>
    </div>
  )
}
