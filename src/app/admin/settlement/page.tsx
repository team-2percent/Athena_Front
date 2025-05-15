"use client"

import SettlementTag from "@/components/admin/SettlementTag"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi";
import { formatDateInAdmin } from "@/lib/utils";
import clsx from "clsx";
import { queryObjects } from "v8";

interface Settlement {
    settlementId: number,
    projectTitle: string,
    totalSales: number,
    platformFee: number,
    payOutAmount: number,
    sellerName: string,
    requestedAt: string,
    status: "PENDING" | "COMPLETED" | "FAILED"
}

interface Response {
    content: Settlement[],
    pageInfo: {
        currentPage: number,
        totalPages: number
    }
}

interface QueryParamsSettlementList {
    status: "ALL" |"PENDING" | "COMPLETED" | "FAILED",
    year: number,
    month: number,
    page: number
}

export default function SettlementPage() {
    const { apiCall } = useApi()
    const router = useRouter();

    const queryParamInitial: QueryParamsSettlementList = {
        status: "ALL",
        year: 0,
        month: 0,
        page: 0
    }

    const [settlementList, setSettlementList] = useState<any[]>([])
    const [totalPageCount, setTotalPageCount] = useState<number>(0)
    const [queryParams, setQueryParams] = useState<QueryParamsSettlementList>(queryParamInitial)
    const baseUri = "/api/admin/settlements"
    const queryParamUri = Object.entries(queryParams).filter(([key, value]) => value !== queryParamInitial[key as keyof QueryParamsSettlementList]).map(([key, value]) => `${key}=${value}`).join("&")
    const url = `${baseUri}${queryParamUri ? `?${queryParamUri}` : ""}`

    const leftPageDisabled = queryParams.page === 0
    const rightPageDisabled = queryParams.page === totalPageCount - 1

    const loadSettlementList = () => {
        apiCall<Response>(url, "GET").then(({ data }) => {
            if (!data) return
            setSettlementList(data.content)
            setTotalPageCount(data.pageInfo.totalPages)
        })
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQueryParams({
            ...queryParams,
            status: e.target.value as "ALL" | "PENDING" | "COMPLETED" | "FAILED"
        })
    }

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "0") {
            setQueryParams({
                ...queryParams,
                year: 0
            })
        } else {
            setQueryParams({
                ...queryParams,
                year: Number(e.target.value)
            })
        }
    }

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "0") {
            setQueryParams({
                ...queryParams,
                month: 0
            })
        } else {
            setQueryParams({
                ...queryParams,
                month: Number(e.target.value)
            })
        }
    }

    const handlePrevPage = () => {
        if (leftPageDisabled) return
        setQueryParams({
            ...queryParams,
            page: queryParams.page - 1
        })
    }
    
    const handleNextPage = () => {
        if (rightPageDisabled) return
        setQueryParams({
            ...queryParams,
            page: queryParams.page + 1
        })
    }
    

    useEffect(() => {
        loadSettlementList()
    }, [])

    useEffect(() => {
        loadSettlementList()
    }, [queryParams.status, queryParams.year, queryParams.month, queryParams.page])

    return (
        <div className="flex flex-col mx-auto w-full p-8 gap-6">
            <h3 className="text-xl font-medium mb-8">정산 내역</h3>
            <div className="flex gap-4">
                <div className="relative">
                    <select className="border rounded px-4 py-2" onChange={handleStatusChange}>
                        <option value="ALL">상태 전체</option>
                        <option value="PENDING">미정산</option>
                        <option value="COMPLETED">정산 완료</option>
                        <option value="FAILED">정산 실패</option>
                    </select>
                </div>
                <div className="relative">
                    <select className="border rounded px-4 py-2" onChange={handleYearChange}>
                        <option value={0}>년도 전체</option>
                        {Array.from({ length: new Date().getFullYear() - 2024 }, (_, i) => (
                            <option key={2025 + i} value={2025 + i}>{2025 + i}년</option>
                        ))}
                    </select>
                </div>
                {
                    queryParams.year !== 0 &&
                    <div className="relative">
                        <select className="border rounded px-4 py-2" onChange={handleMonthChange}>
                            <option value={0}>월 전체</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}월</option>
                            ))}
                        </select>
                    </div>
                }
            </div>

            <div className="w-full">
                <table className="w-full border-collapse text-center">
                    <thead>
                        <tr className="bg-gray-50 text-sm">
                            <th className="border-b p-4 text-left">프로젝트</th>
                            <th className="border-b p-4 w-[10%]">총 금액</th>
                            <th className="border-b p-4 w-[10%]">수수료</th>
                            <th className="border-b p-4 w-[10%]">지급 금액</th>
                            <th className="border-b p-4 w-[10%]">판매자</th>
                            <th className="border-b p-4 w-[15%]">정산날짜</th>
                            <th className="border-b p-4 w-[5%]">정산 상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {settlementList.map((settlement) => (
                            <tr key={settlement.settlementId} className="text-sm" onClick={() => router.push(`/admin/settlement/${settlement.settlementId}`)}>
                                <td className="border-b p-4 text-left">{settlement.projectTitle}</td>
                                <td className="border-b p-4">{settlement.totalSales}</td>
                                <td className="border-b p-4">{settlement.platformFee}</td>
                                <td className="border-b p-4">{settlement.payOutAmount}</td>
                                <td className="border-b p-4">{settlement.sellerName}</td>
                                <td className="border-b p-4">{formatDateInAdmin(settlement.requestedAt)}</td>
                                <td className="border-b p-4 flex justify-center"><SettlementTag status={settlement.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-2">
                <button className={clsx("px-3 py-2", leftPageDisabled ? "text-gray-300" : "text-main-color")} disabled={leftPageDisabled} onClick={handlePrevPage}>◀</button>
                <button className="px-3 py-2 text-main-color">{queryParams.page + 1}</button>
                <button className={clsx("px-3 py-2", rightPageDisabled ? "text-gray-300" : "text-main-color")} disabled={rightPageDisabled} onClick={handleNextPage}>▶</button>
            </div>
        </div>
    )
}