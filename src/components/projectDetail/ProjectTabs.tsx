"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import FollowItem from "../profile/FollowItem"

const ProjectTabs = () => {
  const [activeTab, setActiveTab] = useState("소개")
  const [commentText, setCommentText] = useState("")

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

  // API 호출에 따른 업데이트 예정
  // 후기 데이터
  const reviews = [
    {
      id: 1,
      user: "대충투자자자",
      date: "2025. 04. 23.",
      content: "스마게야 맨날 이딴 거나 팔아제끼지말고\n게임이나 똑바로 만들어라 ——",
      likes: 358,
      profileImage: "/abstract-profile.png",
    },
    {
      id: 2,
      user: "대충투자자자",
      date: "2025. 04. 23.",
      content: "스마게야 맨날 이딴 거나 팔아제끼지말고\n게임이나 똑바로 만들어라 ——",
      likes: 358,
      profileImage: "/abstract-profile.png",
    },
    {
      id: 3,
      user: "대충투자자자",
      date: "2025. 04. 23.",
      content: "스마게야 맨날 이딴 거나 팔아제끼지말고\n게임이나 똑바로 만들어라 ——",
      likes: 358,
      profileImage: "/abstract-profile.png",
    },
  ]

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 후기 제출 로직 구현
    console.log("후기 제출:", commentText)
    setCommentText("")
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
              onFollow={handleFollow} isFollowing={false}            />
          </div>
        )}

        {activeTab === "후기" && (
          <div className="space-y-6">
            {/* 후기 목록 */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-3xl border border-gray-border p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      {/* 후기 단 유저의 프로필 사진 */}
                      <div className="h-16 w-16 overflow-hidden rounded-full">
                        <Image
                          src={review.profileImage || "/placeholder.svg"}
                          alt={`${review.user} 프로필`}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* 후기 단 유저의 이름, 게시 날짜, 내용 */}
                      <div>
                        <h3 className="text-xl font-bold">{review.user}</h3>
                        <p className="text-sub-gray">{review.date}</p>
                        <div className="mt-3 whitespace-pre-line">{review.content}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1">
                        <ThumbsUp className="h-6 w-6" /> {/* 좋아요 아이콘 */}
                        <span className="text-lg">{review.likes}</span>
                      </button>
                      <button>
                        <ThumbsDown className="h-6 w-6" /> {/* 싫어요 아이콘 */}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectTabs
