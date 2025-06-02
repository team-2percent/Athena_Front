"use client"

import { useState } from "react"
import ProfileInfo from "@/components/profileEdit/ProfileInfo"
import AccountInfo from "@/components/profileEdit/AccountInfo"
import AddressInfo from "@/components/profileEdit/AddressInfo"
import MenuTab from "@/components/common/MenuTab"
import WithdrawInfo from "@/components/profileEdit/WithdrawInfo"

export default function EditPage() {
    const [activeTab, setActiveTab] = useState("프로필")

    const onMenuChange = (tab: string) => {
        setActiveTab(tab)
    }

    return <div className="h-full mt-8 w-[var(--content-width)] mx-auto">
        <MenuTab tabs={["프로필", "계좌", "배송지", "탈퇴하기"]} activeTab={activeTab} onClickTab={onMenuChange} className="border-b border-gray-border"/>
        <div className="w-full ax-w-6xl h-full relative min-h-[300px]">
            {/* 프로필 탭 */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "프로필" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="pt-10">
                    <ProfileInfo />
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