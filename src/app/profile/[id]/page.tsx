"use client"

import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileContent from "@/components/profile/ProfileContent"
import { useState, useEffect } from "react"
import { useApi } from "@/hooks/useApi"
import { redirect, useParams } from "next/navigation"
import useAuthStore from "@/stores/auth"
import { UserInfo, UserProfile, UserResponse } from "@/lib/userInterface"

export default function ProfilePage() {
  // URL에서 프로젝트 ID 가져오기
  const { id } = useParams()
  const userId = useAuthStore(s => s.userId)
  const { apiCall, isLoading } = useApi()
  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: "",
    nickname: "",
    imageUrl: ""
  })
  const [userInfo, setUserInfo] = useState<UserInfo>({
    sellerDescription: "",
    linkUrl: "",
  })

  // 추가: 소개 로딩/에러 상태
  const [isIntroLoading, setIsIntroLoading] = useState(true)
  const [introError, setIntroError] = useState(false)

  if (id && +id === userId) {
    redirect("/my")
  }

  // 유저 정보 가져오기
  const loadUserInfo = () => {
    setIsIntroLoading(true)
    setIntroError(false)
    apiCall<UserResponse>(`/api/user/${id}`, "GET").then(({ data, error }) => {
      if (error) {
        setIntroError(true)
      } else if (data) {
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
      setIsIntroLoading(false)
    })
  }

  useEffect(() => {
    loadUserInfo();
  }, [])

  return (
    <main className="min-h-screen bg-white w-[var(--content-width)]">
      <div className="container my-8">
        {/* 프로필 상단 영역 */}
        <ProfileHeader
          nickname={userProfile.nickname}
          profileImage={userProfile.imageUrl}
          isLoading={isIntroLoading}
          error={introError}
          onRetry={loadUserInfo}
        />

        {/* 프로필 콘텐츠 영역 */}
        <ProfileContent
          isMy={false}
          userId={Number(id)}
          sellerDescription={userInfo.sellerDescription}
          linkUrl={userInfo.linkUrl}
          isIntroLoading={isIntroLoading}
          introError={introError}
        />
      </div>
    </main>
  )
}
