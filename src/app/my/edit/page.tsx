"use client"

import { useState } from "react"
import ProfileInfo from "@/components/profileEdit/ProfileInfo"
import AccountInfo from "@/components/profileEdit/AccountInfo"
import AddressInfo from "@/components/profileEdit/AddressInfo"
import MenuTab from "@/components/common/MenuTab"
import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EditPage() {
    const [activeTab, setActiveTab] = useState("프로필")
    const router = useRouter();

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
            default:
                return null      
        }
    }
    return <div className="h-full mt-8 w-[var(--content-width)] mx-auto">
        <div className="flex w-full mb-5">
            <button className="text-sm text-gray-500 flex items-center gap-2" onClick={() => router.push("/my")}>
                <ArrowLeftIcon className="w-4 h-4" />
                프로필로 돌아가기
            </button>
        </div>
        <MenuTab tabs={["프로필", "계좌", "배송지"]} activeTab={activeTab} onClickTab={onMenuChange} className="border-b border-gray-border"/>
        <div className="w-full ax-w-6xl pt-10 h-full">
            {renderContent()}
        </div>
    </div>
}