"use client"

import { useState } from "react"
import AccountInfo from "@/components/profileEdit/AccountInfo"
import AddressInfo from "@/components/profileEdit/AddressInfo"
import MenuTab from "@/components/common/MenuTab"
import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import UserInfo from "@/components/profileEdit/UserInfo"
import WithdrawInfo from "@/components/profileEdit/WithdrawInfo"
import { GhostButton } from "@/components/common/Button"

export default function EditPage() {
    const [activeTab, setActiveTab] = useState("프로필")
    const router = useRouter();

    const onMenuChange = (tab: string) => {
        setActiveTab(tab)
    }

    return <div className="h-full mt-8 w-[var(--content-width)] mx-auto">
        <div className="flex w-full mb-5">
          <GhostButton onClick={() => router.push("/my")} className="flex gap-1 items-center" data-cy="back-button">
              <ArrowLeftIcon className="w-4 h-4" />
              프로필로 돌아가기
          </GhostButton>
        </div>
        <MenuTab tabs={["프로필", "계좌", "배송지", "탈퇴하기"]} activeTab={activeTab} onClickTab={onMenuChange} className="border-b border-gray-border"/>
        <div className="w-full ax-w-6xl h-full relative min-h-[300px]">
            {/* 프로필 탭 */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "프로필" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="pt-10">
                    <UserInfo />
                </div>
            </div>
            {/* 계좌 탭 */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "계좌" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="pt-10">
                    <AccountInfo />
                </div>
            </div>
            {/* 배송지 탭 */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "배송지" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="pt-10">
                    <AddressInfo />
                </div>
            </div>
            {/* 탈퇴하기 탭 */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "탈퇴하기" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="pt-10">
                    <WithdrawInfo />
                </div>
            </div>
        </div>
    </div>
}