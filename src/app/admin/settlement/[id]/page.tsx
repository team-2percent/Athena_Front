"use client"

import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import SettlementTag from "@/components/admin/SettlementTag"
import Image from "next/image"
import ConfirmModal from "@/components/common/ConfirmModal"

export default function SettlementDetailPage() {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [settlement, setSettlement] = useState<any>({
        id: 1,
        projectName: "프로젝트 1",
        accountNumber: "1234567890",
        totalAmount: 1000000,
        fee: 10000,
        status: "pending",
        seller: "판매자 1",
        settlementDate: "2023.06.01 15:00",
        bank: "신한은행",
        accountHolder: "홍길동",
        goalAmount: 1000000,
        startDate: "2023.06.01 15:00",
        endDate: "2023.06.01 15:00",
        totalSold: 100,
        buyerCount: 10,
        products: [
            {
                id: 1,
                name: "상품1",
                soldCount: 4500,
                totalAmount: 250000000,
                fee: 2500000,
                settlementAmount: 247500000
            },
            {
                id: 2,
                name: "상품2",
                soldCount: 3000,
                totalAmount: 30000000,
                fee: 300000,
                settlementAmount: 29700000
            },
            {
                id: 3,
                name: "상품3",
                soldCount: 1500,
                totalAmount: 20000000,
                fee: 200000,
                settlementAmount: 19800000
            }
        ]
    })

    interface Project {
        id: number;
        name: string;
        soldCount: number;
        totalAmount: number;
        fee: number;
        settlementAmount: number;
    }

    const handleConfirmSettlement = () => {
        // api 요청
        setIsModalOpen(false)
    }

    return (
        <div className="flex flex-col mx-auto w-full p-8 gap-6">
            <div className="flex w-full">
                <button 
                    className="text-sm text-gray-500 flex items-center gap-2" 
                    onClick={() => router.push("/admin/settlement")}
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    목록으로
                </button>
            </div>
            {/* 프로젝트 기본 정보 */}
            <div className="flex flex-col gap-6 p-6">
                <h2 className="text-2xl font-medium border-b pb-2">프로젝트 기본 정보</h2>
                <table className="w-full border-collapse text-left">
                    <tbody>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">프로젝트명</td>
                            <td className="p-2">{settlement.projectName}</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">목표 금액</td>
                            <td className="p-2">{settlement.goalAmount.toLocaleString()} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">펀딩 기간</td>
                            <td className="p-2">{settlement.startDate} ~ {settlement.endDate}</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">총 판매 금액</td>
                            <td className="p-2">{settlement.totalAmount.toLocaleString()} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">수수료</td>
                            <td className="p-2">{settlement.fee.toLocaleString()} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">지급 금액</td>
                            <td className="p-2">{(settlement.totalAmount - settlement.fee).toLocaleString()} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">총 판매 개수</td>
                            <td className="p-2">{settlement.totalSold} 개</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">구매자</td>
                            <td className="p-2">{settlement.buyerCount} 명</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">정산 일자</td>
                            <td className="p-2">{settlement.settlementDate}</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">정산 상태</td>
                            <td className="p-2"><SettlementTag status={settlement.status} /></td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">정산 계좌 정보</td>
                            <td className="p-2">
                                <div className="flex gap-2">
                                    <span>{settlement.bank} {settlement.accountNumber} {settlement.accountHolder}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* 판매자 정보 */}
            <div className="flex flex-col gap-6 p-6">
                <h2 className="text-2xl font-medium border-b pb-2">판매자 정보</h2>
                <div className="flex items-center mt-4 justify-between">
                    <div className="flex items-center gap-4">
                        <button className="h-16 w-16 overflow-hidden rounded-full">
                            <Image
                                src="/abstract-profile.png"
                                alt="프로필 이미지"
                                width={64}
                                height={64}
                                className="h-full w-full object-cover"
                            />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-xl font-medium">기적가</span>
                            <span className="text-sm text-gray-500">판매자 소개</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <button className="ml-auto px-4 py-2 text-sm border rounded-md">프로필보기</button>
                        <p className="text-sm text-gray-500">* 기존 프로필 페이지로 이동합니다.</p>
                    </div>
                </div>
            </div>
            {/* 프로젝트 상품 별 정보 */}
            <div className="flex flex-col gap-6 p-6">
                <h2 className="text-2xl font-medium border-b pb-2">프로젝트 상품 별 정보</h2>
                <table className="w-full border-collapse text-center">
                    <tbody>
                        <tr className="bg-gray-50 text-sm">
                            <th className="border-b p-4">상품</th>
                            <th className="border-b p-4">판매 개수</th>
                            <th className="border-b p-4">총 금액</th>
                            <th className="border-b p-4">지급 금액</th>
                            <th className="border-b p-4">수수료</th>
                        </tr>
                        <tr className="text-sm">
                            <td className="border-b p-4">전체</td>
                            <td className="border-b p-4">{settlement.products.reduce((acc: number, cur: Project) => acc + cur.soldCount, 0).toLocaleString()}</td>
                            <td className="border-b p-4">{settlement.products.reduce((acc: number, cur: Project) => acc + cur.totalAmount, 0).toLocaleString()}</td>
                            <td className="border-b p-4">{settlement.products.reduce((acc: number, cur: Project) => acc + cur.settlementAmount, 0).toLocaleString()}</td>
                            <td className="border-b p-4">{settlement.products.reduce((acc: number, cur: Project) => acc + cur.fee, 0).toLocaleString()}</td>
                        </tr>
                        {settlement.products.map((product: Project) => (
                            <tr key={product.id} className="text-sm">
                                <td className="border-b p-4">{product.name}</td>
                                <td className="border-b p-4">{product.soldCount.toLocaleString()}</td>
                                <td className="border-b p-4">{product.totalAmount.toLocaleString()}</td>
                                <td className="border-b p-4">{product.settlementAmount.toLocaleString()}</td>
                                <td className="border-b p-4">{product.fee.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* 정산 기록 */}
            <div className="flex flex-col gap-6 p-6">
                <h2 className="text-2xl font-medium border-b pb-2">정산 기록</h2>
                <table className="w-full border-collapse text-center">
                    <tbody>
                        <tr className="bg-gray-50 text-sm">
                            <th className="border-b p-4">상품</th>
                            <th className="border-b p-4">판매 개수</th>
                            <th className="border-b p-4">총 금액</th>
                            <th className="border-b p-4">수수료</th>
                            <th className="border-b p-4">지급 금액</th>
                            <th className="border-b p-4">정산 일자</th>
                        </tr>
                        {[
                            {
                                id: 1,
                                name: "상품1",
                                count: 4500,
                                totalAmount: 250000000,
                                fee: 50000000,
                                settlementAmount: 50000000,
                                date: "2025.04.14"
                            },
                            {
                                id: 2,
                                name: "상품2", 
                                count: 4500,
                                totalAmount: 250000000,
                                fee: 50000000,
                                settlementAmount: 50000000,
                                date: "2025.04.14"
                            },
                            {
                                id: 3,
                                name: "상품3",
                                count: 4500,
                                totalAmount: 250000000,
                                fee: 50000000,
                                settlementAmount: 50000000,
                                date: "2025.04.14"
                            }
                        ].map((item) => (
                            <tr key={item.id} className="text-sm">
                                <td className="border-b p-4">{item.name}</td>
                                <td className="border-b p-4">{item.count.toLocaleString()}</td>
                                <td className="border-b p-4">{item.totalAmount.toLocaleString()}</td>
                                <td className="border-b p-4">{item.fee.toLocaleString()}</td>
                                <td className="border-b p-4">{item.settlementAmount.toLocaleString()}</td>
                                <td className="border-b p-4">{item.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end">
                <button
                    className="px-8 p-4 rounded-md bg-pink-100 text-pink-600"
                    onClick={() => setIsModalOpen(true)}
                >
                    정산 완료
                </button>
            </div>
            {
                isModalOpen &&
                <ConfirmModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    message="정산을 완료하시겠습니까?"
                    onConfirm={handleConfirmSettlement}
                />
            }
        </div>
    )
}