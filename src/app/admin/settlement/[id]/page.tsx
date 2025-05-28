"use client"

import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import SettlementTag from "@/components/admin/SettlementTag"
import { useApi } from "@/hooks/useApi"
import { useParams } from "next/navigation";
import OverlaySpinner from "@/components/common/OverlaySpinner"
import { formatDateInAdmin } from "@/lib/utils"
import { SecondaryButton } from "@/components/common/Button"
import Pagination from "@/components/common/Pagination"

interface SettlementInfo {
    "projectTitle": string,
    "sellerNickname": string,
    "userId": number,
    "targetAmount": number,
    "totalSales": number,
    "payOutAmount": number,
    "platformFeeTotal": number,
    "pgFeeTotal": number,
    "vatTotal": number,
    "planName": string
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
    "pgFee": number,
    "vat": number,
    "payoutAmount": number
}

interface SettlementProductTotalSummary {
    "totalQuantity": number,
    "totalPrice": number,
    "platformFee": number,
    "pgFee": number,
    "vat": number,
    "payoutAmount": number
}

interface SettlementProductSummary {
    "items": SettlementProductSummaryItem[],
    "total": SettlementProductTotalSummary
}

interface SettlementHistoryItem {
    "productName": string,
    "quantity": number,
    "totalPrice": number,
    "platformFee": number,
    "pgFee": number,
    "vat": number,
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
    const [productSummaryTotal, setProductSummaryTotal] = useState<SettlementProductTotalSummary | null>(null)
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
        apiCall<SettlementInfo>(`/api/admin/settlement/${id}/info`, "GET").then(({ data }) => {
            setInfo(data)
        })
        apiCall<SettlementProductSummary>(`/api/admin/settlement/${id}/product-summary`, "GET").then(({ data }) => {
            if (data) {
                setProductSummary(data.items)
                setProductSummaryTotal(data.total)
            }
        })
        apiCall<SettlementHistory>(`/api/admin/settlement/${id}/history`, "GET").then(({ data }) => {
            if (data) {
                setHistory(data.content)
                setTotalPageCount(data.pageInfo.totalPages)
            }
        })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const render = () => {
        if (isLoading) return <OverlaySpinner message="정산 정보를 불러오고 있습니다." />
        if (!info || !productSummary || !productSummaryTotal || !history) return null

        return (
            <div>
                {/* 프로젝트 기본 정보 */}
            <div className="flex flex-col gap-6 py-6">
                <h2 className="text-2xl font-medium border-b pb-2">프로젝트 기본 정보</h2>
                <table className="w-full border-collapse text-left">
                    <tbody>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">프로젝트명</td>
                            <td className="p-2">{info.projectTitle}</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">목표 금액</td>
                            <td className="p-2">{info.targetAmount} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">펀딩 기간</td>
                            <td className="p-2">{formatDateInAdmin(info.fundingStartDate)} ~ {formatDateInAdmin(info.fundingEndDate)}</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">요금제</td>
                            <td className="p-2">{info.planName}</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">총 판매 금액</td>
                            <td className="p-2">{info.totalSales} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">플랫폼 수수료</td>
                            <td className="p-2">{info.platformFeeTotal} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">PG 수수료</td>
                            <td className="p-2">{info.pgFeeTotal} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">부가세</td>
                            <td className="p-2">{info.vatTotal} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">정산 금액</td>
                            <td className="p-2">{(info.payOutAmount)} 원</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">총 판매 개수</td>
                            <td className="p-2">{info.totalCount} 개</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">구매자</td>
                            <td className="p-2">{info.totalCount} 명</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">정산 일자</td>
                            <td className="p-2">{info.settledAt ? info.settledAt : "-"}</td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">정산 상태</td>
                            <td className="p-2"><SettlementTag status={info.status} /></td>
                        </tr>
                        <tr>
                            <td className="p-2 w-[15%] font-semibold">정산 계좌 정보</td>
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
            <div className="flex flex-col gap-6 py-6">
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
                        <SecondaryButton
                            className="ml-auto"
                            onClick={() => router.push(`/profile/${info.userId}`)}
                        >프로필보기</SecondaryButton>
                        <p className="text-sm text-gray-500">* 기존 프로필 페이지로 이동합니다.</p>
                    </div>
                </div>
            </div>
            {/* 프로젝트 상품 별 정보 */}
            <div className="flex flex-col gap-6 py-6">
                <h2 className="text-2xl font-medium border-b pb-2">프로젝트 상품 별 정보</h2>
                <table className="w-full border-collapse text-center">
                    <tbody>
                        <tr className="bg-gray-50 text-sm">
                            <th className="border-b p-4">상품</th>
                            <th className="border-b p-4">판매 개수</th>
                            <th className="border-b p-4">총 금액</th>
                            <th className="border-b p-4">정산 금액</th>
                            <th className="border-b p-4">플랫폼 수수료</th>
                            <th className="border-b p-4">PG 수수료</th>
                            <th className="border-b p-4">부가세</th>
                        </tr>
                        <tr className="text-sm">
                            <td className="border-b p-4">전체</td>
                            <td className="border-b p-4">{productSummaryTotal.totalQuantity}</td>
                            <td className="border-b p-4">{productSummaryTotal.totalPrice}</td>
                            <td className="border-b p-4">{productSummaryTotal.payoutAmount}</td>
                            <td className="border-b p-4">{productSummaryTotal.platformFee}</td>
                            <td className="border-b p-4">{productSummaryTotal.pgFee}</td>
                            <td className="border-b p-4">{productSummaryTotal.vat}</td>
                        </tr>
                        {productSummary.map((product, idx) => (
                            <tr key={product.productName + idx.toString} className="text-sm">
                                <td className="border-b p-4">{product.productName}</td>
                                <td className="border-b p-4">{product.totalQuantity}</td>
                                <td className="border-b p-4">{product.totalPrice}</td>
                                <td className="border-b p-4">{product.payoutAmount}</td>
                                <td className="border-b p-4">{product.platformFee}</td>
                                <td className="border-b p-4">{productSummaryTotal.pgFee}</td>
                                <td className="border-b p-4">{productSummaryTotal.vat}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* 정산 기록 */}
            <div className="flex flex-col gap-6 py-6">
                <h2 className="text-2xl font-medium border-b pb-2">정산 기록</h2>
                <table className="w-full border-collapse text-center">
                    <tbody>
                        <tr className="bg-gray-50 text-sm">
                            <th className="border-b p-4">상품</th>
                            <th className="border-b p-4">판매 개수</th>
                            <th className="border-b p-4">총 금액</th>
                            <th className="border-b p-4">플랫폼 수수료</th>
                            <th className="border-b p-4">PG 수수료</th>
                            <th className="border-b p-4">부가세</th>
                            <th className="border-b p-4">정산 금액</th>
                            <th className="border-b p-4">정산 일자</th>
                        </tr>
                        {history.map((item, idx) => (
                            <tr key={item.productName + idx.toString()} className="text-sm">
                                <td className="border-b p-4">{item.productName}</td>
                                <td className="border-b p-4">{item.quantity}</td>
                                <td className="border-b p-4">{item.totalPrice}</td>
                                <td className="border-b p-4">{item.platformFee}</td>
                                <td className="border-b p-4">{item.pgFee}</td>
                                <td className="border-b p-4">{item.vat}</td>
                                <td className="border-b p-4">{item.amount}</td>
                                <td className="border-b p-4">{formatDateInAdmin(item.orderedAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination totalPages={totalPageCount} currentPage={currentPage} onPageChange={handlePageChange}/>
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
        <div className="flex flex-col mx-auto w-[var(--content-width)] py-8 gap-6">
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