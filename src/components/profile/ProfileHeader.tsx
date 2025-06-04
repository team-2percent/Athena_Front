import { cn } from "@/lib/utils"
import Image from "next/image"

interface ProfileHeaderProps {
  nickname: string
  profileImage: string
  buttons?: React.ReactNode
}

export default function ProfileHeader({ nickname, profileImage, buttons }: ProfileHeaderProps) {
  return (
    <div className="flex justify-between items-start mx-auto mb-12 h-36" data-cy="profile-header">
      <div className="flex">
        {/* 프로필 이미지 */}
        <div className="w-36 h-36 rounded-full bg-gray-200 overflow-hidden mr-8 flex-shrink-0" data-cy="profile-image">
          <img
            src={profileImage || "/placeholder/profile-placeholder.png"}
            alt="프로필 이미지"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 프로필 텍스트 정보 */}
        <div className="flex flex-col justify-center h-36">
          <h1 className="text-3xl font-bold mb-4" data-cy="profile-nickname">{nickname}</h1>
        </div>
      </div>

      {/* 팔로우 / 프로필 편집 + 거래 내역 보기 버튼 */}
      <div className="flex flex-col justify-center items-center h-full">
        {buttons}
      </div>
    </div>
  )
}
