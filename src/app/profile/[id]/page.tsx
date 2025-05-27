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

  if (id && +id === userId) {
    redirect("/my")
  }

  // 유저 정보 가져오기
  const loadUserInfo = () => {
    apiCall<UserResponse>(`/api/user/${id}`, "GET").then(({ data }) => {
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
    loadUserInfo();
  }, [])

  return (
    <main className="min-h-screen bg-white w-[var(--content-width)]">
      <div className="container my-8">
        {/* 프로필 상단 영역 */}
        <ProfileHeader
          nickname={userProfile.nickname}
          profileImage={userProfile.imageUrl}
        />

        {/* 프로필 콘텐츠 영역 */}
        <ProfileContent
          isMy={false}
          sellerDescription={userInfo.sellerDescription}
          linkUrl={userInfo.linkUrl}
        />
      </div>
    </main>
  )
}
