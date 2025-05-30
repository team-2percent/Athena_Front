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

    const renderContent = () => {
        switch (activeTab) {
            case "프로필":
                return <ProfileInfo />
            case "계좌":
                return <AccountInfo />
            case "배송지":
                return <AddressInfo />
            case "탈퇴하기":
                return <WithdrawInfo />
            default:
                return null      
        }
    }
    return <div className="h-full mt-8 w-[var(--content-width)] mx-auto">
        <MenuTab tabs={["프로필", "계좌", "배송지", "탈퇴하기"]} activeTab={activeTab} onClickTab={onMenuChange} className="border-b border-gray-border"/>
        <div className="w-full ax-w-6xl pt-10 h-full">
            {renderContent()}
        </div>
    </div>
}