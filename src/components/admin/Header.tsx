"use client"

import Image from "next/image"
import { LogOut, Menu, House } from "lucide-react"
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import useAuthStore from "@/stores/auth"
import { useApi } from "@/hooks/useApi"
import MenuTab from "../common/MenuTab";
import customLoader from "@/lib/customLoader";

const nameToPath: Record<string, string> = {
    "프로젝트 승인 관리": "approval",
    "쿠폰 관리": "coupon",
    "정산 관리": "settlement",
}

const pathToName = Object.fromEntries(
    Object.entries(nameToPath).map(([k, v]) => [v, k])
  ) as Record<string, keyof typeof nameToPath>;

export default function AdminHeader() {
    const pathname = usePathname().split("/")[2];
    const { logout } = useAuthStore();
    const { apiCall } = useApi();
    const router = useRouter();
    const [showAuthMenu, setShowAuthMenu] = useState(false);

    const handleLogout = () => {
        apiCall("/api/user/logout", "POST").then(() => {
            logout();
            router.push("/")
        })        
    }

    const handleTabClick = (tab: string) => {
        if (tab === "프로젝트 승인 관리") router.push("/admin/approval")
        else if (tab === "쿠폰 관리") router.push("/admin/coupon")
        else if (tab === "정산 관리") router.push("/admin/settlement")
    }

    return (
        <header className="w-full bg-white shadow-[0_4px_4px_-2px_rgba(0,0,0,0.1)] z-5" data-cy="admin-header">
            <div className="container mx-auto px-4 py-4">
                {/* 상단 헤더 영역 */}
                <div className="flex items-center justify-between">
                {/* 로고 */}
                <div className="flex items-center space-x-4">
                    <Image loader={customLoader} src="/src/athenna_logo.png" alt="Athenna 로고" width={40} height={40} className="object-cover w-10 h-10 overflow-hidden" />
                </div>

                {/* 관리자 이름 + 로그인 메뉴 */}
                <div className="flex items-center space-x-3 m-none">
                    <div className="relative flex items-center">
                        <button
                            type="button"
                            onClick={() => setShowAuthMenu(!showAuthMenu)}
                            className={clsx("text-gray-500 hover:bg-gray-200 rounded-lg p-1", showAuthMenu && "bg-gray-200")}
                            data-cy="admin-menu-button"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        { showAuthMenu && 
                        <div
                            className="absolute right-0 top-12 bg-white shadow-md rounded-md px-4 py-2 flex flex-col gap-2 z-50 transition-all duration-200"
                            data-cy="admin-menu"
                        >
                            <button
                                type="button"
                                onClick={() => router.push("/")}
                                className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap flex items-center gap-2 p-2 justify-center"
                                data-cy="userpage-button"
                            >
                                <House className="h-4 w-4" />
                                사용자 페이지
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap flex items-center gap-2 p-2 justify-center"
                                data-cy="logout-button"
                            >
                                <LogOut className="h-4 w-4" />
                                로그아웃
                            </button>
                        </div>}
                    </div>
                </div>
            </div>

            {/* 하단 네비게이션 탭 */}
            <div className="mt-4 flex justify-between items-center">
                <MenuTab
                    tabs={Object.keys(nameToPath)}
                    activeTab={pathToName[pathname]}
                    onClickTab={handleTabClick}
                />
            </div>
        </div>
        </header>
    )
}