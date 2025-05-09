"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
const uris: Record<string, string> = {
    "프로젝트 승인 관리": "approval",
    "쿠폰 관리": "coupon",
    "정산 관리": "settlement",
}

export default function AdminHeader() {
    const pathname = usePathname().split("/")[1];
    const router = useRouter();
    const [showAuthMenu, setShowAuthMenu] = useState(false);

    const handleTabClick = (tab: string) => {
        if (tab === "프로젝트 승인 관리") router.push("/approval")
        else if (tab === "쿠폰 관리") router.push("/coupon")
        else if (tab === "정산 관리") router.push("/settlement")
    }

    return (
        <header className="w-full bg-white shadow-[0_4px_4px_-2px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto px-4 py-4">
                {/* 상단 헤더 영역 */}
                <div className="flex items-center justify-between">
                {/* 로고 */}
                <div className="flex items-center space-x-4">
                    <Link href="/" className="flex items-center">
                    <Image src="/src/athenna_logo.png" alt="Athenna 로고" width={40} height={40} className="h-10 w-auto" />
                    </Link>
                </div>

                {/* 검색창 및 우측 아이콘 및 프로필 */}
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium whitespace-nowrap">대충사는사람</span>
                        <button type="button" onClick={() => setShowAuthMenu(!showAuthMenu)}>
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                    { showAuthMenu && <div></div>}
                </div>
            </div>

            {/* 하단 네비게이션 탭 */}
            <div className="mt-4 flex justify-between items-center">
            <nav className="flex space-x-8">
                {
                    Object.keys(uris).map((tab) => (
                        <button
                            type="button"
                            key={tab}
                            className={`relative pb-1 text-base font-medium ${
                                pathname === uris[tab] ? "text-pink-500" : "text-gray-800"
                            }`}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab}
                            {pathname === uris[tab] && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-pink-500" />}
                        </button>
                    ))
                }
            </nav>
            </div>
        </div>
        </header>
    )
}