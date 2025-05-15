"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ProfileTabs from "./ProfileTabs"
import ProjectItem from "./ProjectItem"
import PurchasedProjectItem from "./PurchasedProjectItem"
import FollowItem from "./FollowItem"
import ReviewItem from "./ReviewItem"
import { Percent } from "lucide-react"
import MyProjectList from "./MyProjectList"
import clsx from "clsx"
import { useApi } from "@/hooks/useApi"
import { UserCoupon } from "@/lib/couponInterface"
import CouponList from "./CouponList"
import Spinner from "../common/Spinner"
import EmptyMessage from "../common/EmptyMessage"

interface ProfileContentProps {
  introduction: string
  links: string[]
  isMy?: boolean
}

export default function ProfileContent({ introduction, links, isMy }: ProfileContentProps) {
  const { isLoading, apiCall } = useApi();
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [activeTab, setActiveTab] = useState("소개")

  // 상품 데이터 (실제로는 API에서 가져올 데이터)
  const projects = [
    {
      id: 1,
      sellerName: "판매자 이름",
      projectName: "상품 이름",
      description:
        "상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개asdu9fhaiuosdhfgiadsghf78ays78fgyas78opdftya78sdfytg78asftgo8a67sdtgfo7a8stgfo78atfo687asdtgf78aetof78l6astgd78ftsdl78ftgsad7o8fgtla78sdft78loaetyfg7l8astglf87aso78ftasw78gsd7fasoyfo7l",
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

  // 구매한 상품 데이터 (실제로는 API에서 가져올 데이터)
  const purchasedProjects = [
    {
      id: 101,
      sellerName: "판매자 이름",
      projectName: "구매한 상품 1",
      description:
        "상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개...",
      imageUrl: "/tteokbokki/tteokbokki.jpg",
      achievementRate: 100,
      daysLeft: null,
      isCompleted: true,
      projectId: 301,
      hasReview: false,
    },
    {
      id: 102,
      sellerName: "판매자 이름",
      projectName: "구매한 상품 2",
      description:
        "상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개 상품 소개...",
      imageUrl: "/tteokbokki/tteokbokki.jpg",
      achievementRate: 100,
      daysLeft: null,
      isCompleted: true,
      projectId: 302,
      hasReview: true,
    },
  ]

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
  }

  // 구매 내역 삭제 핸들러
  const deletePurchase = (id: number) => {
    console.log(`구매 내역 ${id}를 삭제합니다.`)
    // 실제로는 API 호출 등의 로직이 들어갈 것입니다.
    // 삭제 후 다시 조회하여 setPurchasedProjects 호출
  }

  const loadUserCoupon = () => {
    apiCall("/api/userCoupon", "GET").then(({ data }) => setUserCoupons(data as UserCoupon[]))
  }

  const renderCouponList = () => {
    if (isLoading) {
      return <Spinner message="쿠폰 목록을 불러오고 있습니다." />
    } else if (userCoupons.length === 0) {
      return <EmptyMessage message="쿠폰이 없습니다." />
    } else {
      return <CouponList coupons={userCoupons} />
    }
  }

  useEffect(() => {
    loadUserCoupon()
  }, []);
    
  return (
    <div className="mt-12">
      {/* 탭 메뉴 */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isMy={isMy} />

      {/* 탭 내용 */}
      <div className="mx-auto max-w-6xl mt-8">
        {activeTab === "소개" && (
          <div className="mb-8">
            <p className="text-sub-gray mb-8 whitespace-pre-wrap break-words">{introduction}</p>

            {/* 링크 목록 */}
            <div className="flex flex-wrap gap-4">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={`https://${link}`}
                  target="_blank"
                  className="px-6 py-3 border border-main-color text-main-color rounded-full hover:bg-secondary-color transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === "판매 상품" &&
          (isMy ? (
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

        {activeTab === "구매 상품" && (
          <div>
            {purchasedProjects.map((project) => (
              <PurchasedProjectItem
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
                hasReview={project.hasReview}
                onDeletePurchase={deletePurchase}
              />
            ))}
          </div>
        )}

        {(activeTab === "후기" || activeTab === "내가 쓴 후기") && (
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
                isFollowing={false}              />
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

        {activeTab === "쿠폰" && 
            renderCouponList()
        }
      </div>
    </div>
  )
}
