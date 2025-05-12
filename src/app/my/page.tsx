"use client"

import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileContent from "@/components/profile/ProfileContent"
import useAuthStore from "@/stores/auth"
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const isLoggedIn = useAuthStore((state: { isLoggedIn: boolean }) => state.isLoggedIn);
    if (!isLoggedIn) {
        redirect("/")
    }

    const router = useRouter();
    const [isOpenViewTransaction, setIsOpenViewTransaction] = useState(false);
  // 프로필 데이터 (실제로는 API에서 가져올 데이터)
  const profileData = {
    nickname: "사용자 닉네임",
    following: "-",
    purchases: "-",
    profileImage: "/abstract-profile.png",
    introduction:
      "////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
    links: ["www.links.com", "www.links.com", "www.links.com", "www.links.com", "www.links.com", "www.links.com"],
  }

  const handleClickEditProfile = () => {
    router.push("/my/edit")
  }

  const handleClickViewTransaction = () => {
    setIsOpenViewTransaction(true);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* 거래내역 모달 추가 필요*/}

      <div className="container mx-auto px-4">
        {/* 프로필 상단 영역 */}
        <ProfileHeader
          nickname={profileData.nickname}
          following={profileData.following}
          purchases={profileData.purchases}
          profileImage={profileData.profileImage}
          buttons={
            <div  className="flex flex-col gap-2">
            <button
              className={cn(
                "px-8 py-3 rounded-lg border-2 border-main-color text-main-color font-medium text-center transition-colors",
                "hover:bg-secondary-color active:bg-secondary-color",
                "focus:outline-none focus:ring-2 focus:ring-main-color focus:ring-offset-2"
              )}
              onClick={handleClickEditProfile}
            >
              프로필 편집
            </button>
            <button
              className={cn(
                "px-8 py-3 rounded-lg border-2 border-main-color text-main-color font-medium text-center transition-colors",
                "hover:bg-secondary-color active:bg-secondary-color",
                "focus:outline-none focus:ring-2 focus:ring-main-color focus:ring-offset-2",
              )}
              onClick={handleClickViewTransaction}
            >
              거래 내역 보기
            </button>
          </div>
          }
        />

        {/* 프로필 콘텐츠 영역 */}
        <ProfileContent introduction={profileData.introduction} links={profileData.links} isMy={true} />
      </div>
    </main>
  )
}
