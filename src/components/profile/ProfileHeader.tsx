import { cn } from "@/lib/utils"
import Image from "next/image"

interface ProfileHeaderProps {
  nickname: string
  following: string
  purchases: string
  profileImage: string
  buttons?: React.ReactNode
}

export default function ProfileHeader({ nickname, following, purchases, profileImage, buttons }: ProfileHeaderProps) {
  return (
    <div className="flex justify-between items-start mx-auto max-w-6xl mb-12 h-36">
      <div className="flex">
        {/* 프로필 이미지 */}
        <div className="w-36 h-36 rounded-full bg-gray-200 overflow-hidden mr-8 flex-shrink-0">
          <Image
            src={profileImage || "/placeholder.svg"}
            alt="프로필 이미지"
            width={192}
            height={192}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 프로필 텍스트 정보 */}
        <div className="flex flex-col justify-center h-36">
          <h1 className="text-3xl font-bold mb-4">{nickname}</h1>

          <div className="flex space-x-16">
            <div>
              <div className="text-gray-600 mb-2">팔로잉</div>
              <div className="text-xl font-medium">{following}</div>
            </div>

            <div>
              <div className="text-gray-600 mb-2">구매 횟수</div>
              <div className="text-xl font-medium">{purchases}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 팔로우 / 프로필 편집 + 거래 내역 보기 버튼 */}
      <div className="flex flex-col justify-center items-center h-full">
        {buttons}
      </div>
    </div>
  )
}
