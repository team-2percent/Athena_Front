"use client"

import Image from "next/image"

interface FollowItemProps {
  id: number
  username: string
  purchaseCount: number
  profileImage: string
  onFollow: (id: number) => void
}

export default function FollowItem({ id, username, purchaseCount, profileImage, onFollow }: FollowItemProps) {
  return (
    <div className="pb-6 mx-8">
      <div className="flex items-center justify-between">
        {/* 프로필 이미지 */}
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mr-6">
            <Image
              src={profileImage || "/placeholder.svg"}
              alt={`${username}의 프로필 이미지`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 사용자 정보 */}
          <div>
            <h3 className="text-xl font-medium mb-1">{username}</h3>
            <p className="text-gray-600">구매 횟수 {purchaseCount}회</p>
          </div>
        </div>

        {/* 팔로우 버튼 */}
        <button
          type="button"
          onClick={() => onFollow(id)}
          className="px-6 py-3 bg-pink-300 text-white rounded-full font-medium hover:bg-pink-400 transition-colors"
        >
          팔로우 +
        </button>
      </div>
      <div className="mt-6 border-b border-gray-200"></div>
    </div>
  )
}
