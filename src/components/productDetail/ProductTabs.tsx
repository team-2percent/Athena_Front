"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown } from "lucide-react"

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("소개")
  const [commentText, setCommentText] = useState("")

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  // API 호출에 따른 업데이트 예정
  // 댓글 데이터
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
    // 댓글 제출 로직 구현
    console.log("댓글 제출:", commentText)
    setCommentText("")
  }

  return (
    <div className="mt-12">
      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {["소개", "프로젝트 정보", "후기"].map((tab) => (
            <button
              key={tab}
              className={`relative pb-3 text-xl font-medium ${activeTab === tab ? "text-pink-500" : "text-gray-800"}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 h-1 w-full bg-pink-500"></span>}
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
              <p className="text-gray-800">(일본요리) 제일 쉬운 떡볶이</p>
              <p className="text-gray-500">----------------------------</p>

              <p className="text-gray-800">재료</p>
              <p className="text-gray-500">----------------------------</p>

              <div className="space-y-2">
                <p className="text-gray-800">고추장 3숟</p>
                <p className="text-gray-800">설탕 3숟</p>
                <p className="text-gray-800">쇠고기 다시다 0.5숟</p>
                <p className="text-gray-800">다진마늘 1숟</p>
                <p className="text-gray-800">대파 1뿌리</p>
              </div>

              <div className="space-y-2 pt-4">
                <p className="text-gray-800">밀떡 250~300g</p>
                <p className="text-gray-800">물 300~350g</p>
              </div>

              <div className="mt-6">
                <Image src="/tteokbokki/tteokbokki.jpg" alt="떡볶이 이미지" width={600} height={600} className="rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "프로젝트 정보" && (

          // 프로젝트 기본 정보 영역
          <div>
            <h2 className="mb-6 text-3xl font-bold">프로젝트 기본 정보</h2>
            <hr className="border-gray-200 mb-8" />

            <div className="space-y-6">
              <div className="flex">
                <div className="w-1/4 font-medium text-gray-700">목표금액</div>
                <div className="w-3/4 font-medium">10,000,000원</div>
              </div>

              <div className="flex">
                <div className="w-1/4 font-medium text-gray-700">펀딩 기간</div>
                <div className="w-3/4 font-medium">2025. 04. 25 ~ 2025. 05. 15 (15일 남음)</div>
              </div>

              <div className="flex">
                <div className="w-1/4 font-medium text-gray-700">결제</div>
                <div className="w-3/4 font-medium">목표금액 달성 시 2025. 05. 15 결제 예정</div>
              </div>

              <div className="flex">
                <div className="w-1/4 font-medium text-gray-700">예상 발송 시작일</div>
                <div className="w-3/4 font-medium">2025. 06. 13</div>
              </div>
            </div>

            {/* 판매자 정보 영역 */}
            <h2 className="mt-12 mb-6 text-3xl font-bold">판매자 정보</h2>
            <hr className="border-gray-200 mb-8" />

            <div className="rounded-3xl border border-gray-200 p-8">
              <div className="flex items-center justify-between">

                {/* 카드 좌측 부분: 프로필 사진, 이름, 소개 */}
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 overflow-hidden rounded-full">
                    <Image
                      src="/abstract-profile.png"
                      alt="판매자 프로필"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">가작가</h3>
                    <p className="text-gray-600">오? 왜 지가 화를 내지?</p>
                  </div>
                </div>

                {/* 카드 우측 부분: 팔로우 수와 버튼들 */}
                <div className="flex flex-col items-end justify-center space-y-2">
                  <span className="text-xl text-gray-500">3.4k 팔로우</span>
                  <div className="flex space-x-4">
                    <button className="rounded-xl bg-gray-200 px-8 py-3 font-medium text-gray-800 hover:bg-gray-300">
                      프로필 보기
                    </button>
                    <button className="rounded-xl bg-pink-200 px-8 py-3 font-medium text-pink-800 hover:bg-pink-300">
                      팔로우하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "후기" && (
          <div className="space-y-6">
            {/* 댓글 입력 영역 */}
            <form onSubmit={handleCommentSubmit} className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="뭐 말이라도 해보기..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-4 focus:border-pink-300 focus:outline-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-pink-200 px-8 py-4 font-medium text-pink-800 hover:bg-pink-300"
              >
                댓글 달기
              </button>
            </form>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-3xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">

                      {/* 댓글 단 유저의 프로필 사진 */}
                      <div className="h-16 w-16 overflow-hidden rounded-full">
                        <Image
                          src={review.profileImage || "/placeholder.svg"}
                          alt={`${review.user} 프로필`}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* 댓글 단 유저의 이름, 게시 날짜, 내용 */}
                      <div>
                        <h3 className="text-xl font-bold">{review.user}</h3>
                        <p className="text-gray-500">{review.date}</p>
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

export default ProductTabs
