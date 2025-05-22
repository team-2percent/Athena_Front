"use client"

import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileContent from "@/components/profile/ProfileContent"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useApi } from "@/hooks/useApi"
import { useParams } from "next/navigation"

interface UserProfile {
  id: number
  email: string
  nickname: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { apiCall, isLoading } = useApi()
  const [isOpenViewTransaction, setIsOpenViewTransaction] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 9,
    email: "",
    nickname: "사용자 닉네임", // 기본값
  })

  // URL에서 프로젝트 ID 가져오기
  const { id: userId } = useParams()

  // 프로필 데이터 (실제로는 API에서 가져올 데이터)
  const profileData = {
    following: "-",
    purchases: "-",
    profileImage: "/abstract-profile.png",
  }

  useEffect(() => {
    // 유저 프로필 정보 가져오기
    const fetchUserProfile = async () => {
      try {
        const response = await apiCall(`/api/user/${userId}`, "GET")
        if (response && response.data) {
          setUserProfile(response.data as UserProfile)
        }
      } catch (error) {
        console.error("프로필 정보를 가져오는데 실패했습니다.", error)
      }
    }

    fetchUserProfile()
  }, [])

  const handleClickEditProfile = () => {
    router.push("/my/edit")
  }

  const handleClickViewTransaction = () => {
    setIsOpenViewTransaction(true)
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container my-8 mx-auto px-4">
        {/* 프로필 상단 영역 */}
        <ProfileHeader
          nickname={userProfile.nickname}
          profileImage={profileData.profileImage}
          buttons={
            <div className="flex flex-col gap-2">
              <button
                className={cn(
                  "px-8 py-3 rounded-lg border-2 border-main-color text-main-color font-medium text-center transition-colors",
                  "hover:bg-secondary-color active:bg-secondary-color",
                  "focus:outline-none focus:ring-2 focus:ring-main-color focus:ring-offset-2",
                )}
                onClick={handleClickEditProfile}
              >
                프로필 편집
              </button>
            </div>
          }
        />

        {/* 프로필 콘텐츠 영역 */}
        <ProfileContent isMy={false} />
      </div>
    </main>
  )
}
