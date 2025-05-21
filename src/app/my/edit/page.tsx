"use client"

import { useState } from "react"
import ProfileInfo from "@/components/profileEdit/ProfileInfo"
import AccountInfo from "@/components/profileEdit/AccountInfo"
import AddressInfo from "@/components/profileEdit/AddressInfo"
import Menu from "@/components/profileEdit/Menu"

const menus = [{
    id: 1,
    state: "profile",
    name: "프로필"
}, {
    id: 2,
    state: "account",
    name: "계좌"
}, {
    id: 3,
    state: "address",
    name: "배송지"
}]

export default function EditPage() {
    const [currentMenu, setCurrentMenu] = useState("profile")

    const onMenuChange = (menu: string) => {
        setCurrentMenu(menu)
    }

    const renderContent = () => {
        switch (currentMenu) {
            case "profile":
                return <ProfileInfo />
            case "account":
                return <AccountInfo />
            case "address":
                return <AddressInfo />
            default:
                return null      
        }
    }
    return <div className="w-full h-full mt-8">
        <Menu menus={menus} currentMenu={currentMenu} onMenuChange={onMenuChange} />
        <div className="w-full mx-auto max-w-6xl pt-10 h-full">
            {renderContent()}
        </div>
    </div>
}