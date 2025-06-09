"use client"

import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileContent from "@/components/profile/ProfileContent"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useApi } from "@/hooks/useApi"
import useAuthStore from "@/stores/auth"
import { SecondaryButton } from "@/components/common/Button"
import { UserInfo, UserProfile, UserResponse } from "@/lib/userInterface"

export default function ProfilePage() {
  const router = useRouter()
  const { apiCall, isLoading } = useApi()
  const userId = useAuthStore((state) => state.userId)
  const [isReady, setIsReady] = useState(false)

  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: "",
    nickname: "",
    imageUrl: ""
  })
  const [userInfo, setUserInfo] = useState<UserInfo>({
    sellerDescription: "",
    linkUrl: "",
  })

  // 유저 정보 가져오기
  const loadUserInfo = () => {
    apiCall<UserResponse>(`/api/user/${userId}`, "GET").then(({ data }) => {
      if (data) {
        setUserProfile({
          email: data.email,
          nickname: data.nickname,
          imageUrl: data.imageUrl
        })
        setUserInfo({
          sellerDescription: data.sellerDescription,
          linkUrl: data.linkUrl
        })
      }
    })
  }

  useEffect(() => {
    if (userId !== null) {
      setIsReady(true);
    }
  }, [userId]);

  useEffect(() => {
    if (isReady) {
      loadUserInfo()
    }
  }, [isReady, userId])

  const handleClickEditProfile = () => {
    router.push("/my/edit")
  }

  return (
    <main className="min-h-screen bg-white w-[var(--content-width)]">
      <div className="container my-8">
        {/* 프로필 상단 영역 */}
        <ProfileHeader
          nickname={userProfile.nickname}
          profileImage={userProfile.imageUrl}
          buttons={
            <div className="flex flex-col gap-2">
              <SecondaryButton
                onClick={handleClickEditProfile}
                className="px-8 py-3"
                dataCy="edit-profile-button"
              >
                프로필 편집
              </SecondaryButton>
            </div>
          }
        />

        {/* 프로필 콘텐츠 영역 */}
        <ProfileContent
          isMy={true}
          sellerDescription={userInfo.sellerDescription}
          linkUrl={userInfo.linkUrl}
        />
      </div>
    </main>
  )
}
