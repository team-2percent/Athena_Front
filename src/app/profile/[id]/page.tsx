"use client"

import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileContent from "@/components/profile/ProfileContent"

export default function ProfilePage() {
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

  return (
    <main className="min-h-screen bg-white">

      <div className="container mx-auto px-4">
        {/* 프로필 상단 영역 */}
        <ProfileHeader
          nickname={profileData.nickname}
          following={profileData.following}
          purchases={profileData.purchases}
          profileImage={profileData.profileImage}
          buttons={
            <button type="button" className="px-8 py-3 bg-pink-300 text-white rounded-lg flex items-center font-medium">
              팔로우 +
            </button>
          }
        />

        {/* 프로필 콘텐츠 영역 */}
        <ProfileContent introduction={profileData.introduction} links={profileData.links} />
      </div>
    </main>
  )
}
