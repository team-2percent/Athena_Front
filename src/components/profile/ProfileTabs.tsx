"use client"

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isMy?: boolean
}

export default function ProfileTabs({ activeTab, onTabChange, isMy }: ProfileTabsProps) {
  const tabs = isMy ?["소개", "쿠폰", "판매 상품", "내가 쓴 후기", "팔로워", "팔로잉"] : ["소개", "판매 상품", "후기", "팔로워", "팔로잉"]

  return (
    <div className="border-b mx-auto max-w-6xl border-gray-200">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`relative pb-3 text-xl font-medium ${activeTab === tab ? "text-pink-500" : "text-gray-800"}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-0 h-1 w-full bg-pink-500"></span>}
          </button>
        ))}
      </div>
    </div>
  )
}
