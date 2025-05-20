"use client"

import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import SettlementTag from "@/components/admin/SettlementTag"
import Image from "next/image"
import { useApi } from "@/hooks/useApi"
import { useParams } from "next/navigation";
import OverlaySpinner from "@/components/common/OverlaySpinner"
import clsx from "clsx"

interface SettlementInfo {
    "projectTitle": string,
    "sellerNickname": string,
    "userId": number,
    "targetAmount": number,
    "totalSales": number,
    "payoutAmount": number,
    "platformFee": number,
    "platformPlan": number
    "totalCount": number,
    "settledAt": string | null,
    "status": "COMPLETED" | "PENDING" | "FAILED",
    "bankAccount": {
      "bankName": string,
      "accountNumber": string
    },
    "fundingStartDate": string,
    "fundingEndDate": string
}

interface SettlementProductSummaryItem {
    "productName": string,
    "totalQuantity": number,
    "totalPrice": number,
    "platformFee": number,
    "payoutAmount": number
}

interface SettlementProductSummary {
    "items": SettlementProductSummaryItem[],
    "total": {
        "totalQuantity": number,
        "totalPrice": number,
        "platformFee": number,
        "payoutAmount": number
    }
}

interface SettlementHistoryItem {
    "productName": string,
    "quantity": number,
    "totalPrice": number,
    "fee": number,
    "amount": number,
    "orderedAt": string
}

interface SettlementHistory {
    "content": SettlementHistoryItem[],
    "pageInfo": {
        "currentPage": number,
        "totalPages": number
    }
}


export default function SettlementDetailPage() {
    const { id } = useParams();
    const router = useRouter()
    const { isLoading, apiCall } = useApi();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState(0);
    const [info, setInfo] = useState<SettlementInfo | null>(null)
    const [productSummary, setProductSummary] = useState<SettlementProductSummaryItem[] | null>(null)
    const [productSummaryTotal, setProductSummaryTotal] = useState<{
        "totalQuantity": number,
        "totalPrice": number,
        "platformFee": number,
        "payoutAmount": number
    } | null>(null)
    const [history, setHistory] = useState<SettlementHistoryItem[] | null>(null)

    const leftPageDisabled = currentPage === 0
    const rightPageDisabled = currentPage === totalPageCount - 1

    const handlePrevPage = () => {
        if (leftPageDisabled) return
        setCurrentPage(currentPage - 1)
    }
    
    const handleNextPage = () => {
        if (rightPageDisabled) return
        setCurrentPage(currentPage + 1)
    }

    const loadSettlement = () => {
        apiCall<SettlementInfo>(`/api/admin/settlements/${id}/info`, "GET").then(({ data }) => {
            setInfo(data)
        })
        apiCall<SettlementProductSummary>(`/api/admin/settlements/${id}/product-summary`, "GET").then(({ data }) => {
            if (data) {
                setProductSummary(data.items)
                setProductSummaryTotal(data.total)
            }
        })
        apiCall<SettlementHistory>(`/api/admin/settlements/${id}/histories`, "GET").then(({ data }) => {
            if (data) {
                setHistory(data.content)
                setTotalPageCount(data.pageInfo.totalPages)
            }
        })
        setIsModalOpen(false)
        router.push("/admin/settlement")
    }

    const render = () => {
        if (isLoading) return <OverlaySpinner message="정산 정보를 불러오고 있습니다." />
        if (!info || !productSummary || !productSummaryTotal || !history) return null

        return (
            <div>
                {/* 프로젝트 기본 정보 */}

            <div className="flex flex-col gap-6 p-6">
                <h2 className="text-2xl font-medium border-b pb-2">프로젝트 기본 정보</h2>
                <table className="w-full border-collapse text-left">
                    <tbody>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">프로젝트명</td>
                            <td className="p-2">{info.projectTitle}</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">목표 금액</td>
                            <td className="p-2">{info.targetAmount.toLocaleString()} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">펀딩 기간</td>
                            <td className="p-2">{info.fundingStartDate} ~ {info.fundingEndDate}</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">요금제</td>
                            <td className="p-2">{info.fundingStartDate} ~ {info.platformPlan}</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">총 판매 금액</td>
                            <td className="p-2">{info.totalSales.toLocaleString()} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">수수료</td>
                            <td className="p-2">{info.platformFee.toLocaleString()} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">지급 금액</td>
                            <td className="p-2">{(info.totalSales - info.platformFee).toLocaleString()} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">총 판매 개수</td>
                            <td className="p-2">{info.totalCount} 개</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">구매자</td>
                            <td className="p-2">{info.totalCount} 명</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">정산 일자</td>
                            <td className="p-2">{info.settledAt ? info.settledAt : "-"}</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">정산 상태</td>
                            <td className="p-2"><SettlementTag status={info.status} /></td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[10%] font-semibold">정산 계좌 정보</td>
                            <td className="p-2">
                                <div className="flex gap-2">
                                    <span>{info.bankAccount.bankName} {info.bankAccount.accountNumber}</span>
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
                            <img
                                src="/abstract-profile.png"
                                alt="프로필 이미지"
                                width={64}
                                height={64}
                                className="h-full w-full object-cover"
                            />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-xl font-medium">{info.sellerNickname}</span>
                            <span className="text-sm text-gray-500">판매자 소개</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <button
                            className="ml-auto px-4 py-2 text-sm border rounded-md"
                            onClick={() => router.push(`/profile/${info.userId}`)}
                        >프로필보기</button>
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
                            <td className="border-b p-4">{productSummaryTotal.totalQuantity}</td>
                            <td className="border-b p-4">{productSummaryTotal.totalPrice.toLocaleString()}</td>
                            <td className="border-b p-4">{productSummaryTotal.payoutAmount.toLocaleString()}</td>
                            <td className="border-b p-4">{productSummaryTotal.platformFee.toLocaleString()}</td>
                        </tr>
                        {productSummary.map((product) => (
                            <tr key={product.productName} className="text-sm">
                                <td className="border-b p-4">{product.productName}</td>
                                <td className="border-b p-4">{product.totalQuantity.toLocaleString()}</td>
                                <td className="border-b p-4">{product.totalPrice.toLocaleString()}</td>
                                <td className="border-b p-4">{product.payoutAmount.toLocaleString()}</td>
                                <td className="border-b p-4">{product.platformFee.toLocaleString()}</td>
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
                        {history.map((item) => (
                            <tr key={item.productName} className="text-sm">
                                <td className="border-b p-4">{item.productName}</td>
                                <td className="border-b p-4">{item.quantity.toLocaleString()}</td>
                                <td className="border-b p-4">{item.totalPrice.toLocaleString()}</td>
                                <td className="border-b p-4">{item.fee.toLocaleString()}</td>
                                <td className="border-b p-4">{item.amount.toLocaleString()}</td>
                                <td className="border-b p-4">{item.orderedAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2">
                    <button className={clsx("px-3 py-2", leftPageDisabled ? "text-gray-300" : "text-main-color")} disabled={leftPageDisabled} onClick={handlePrevPage}>◀</button>
                    <button className="px-3 py-2 text-main-color">{currentPage + 1}</button>
                    <button className={clsx("px-3 py-2", rightPageDisabled ? "text-gray-300" : "text-main-color")} disabled={rightPageDisabled} onClick={handleNextPage}>▶</button>
                </div>
            </div>
            </div>
        )

    }

    useEffect(() => {
        loadSettlement()
    }, [])

    useEffect(() => {
        loadSettlement()
    }, [currentPage])

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
            {render()}
        </div>
    )
}