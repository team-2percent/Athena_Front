"use client"

import { useEffect, useState } from "react"
import CouponTag from "@/components/admin/CouponTag"
import { useRouter } from "next/navigation"
import { CouponListItem, CouponListResponse, CouponStatus, CouponStatusType } from "@/lib/CouponConstant"
import { useApi } from "@/hooks/useApi"
import Spinner from "@/components/common/Spinner"
import { formatDateInAdmin } from "@/lib/utils"
import Pagination from "@/components/common/Pagination"

export default function CouponPage() {
    const router = useRouter()
    const { isLoading, apiCall } = useApi();
    const [status, setStatus] = useState<CouponStatusType>("ALL")
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [couponList, setCouponList] = useState<CouponListItem[]>([])
    const [totalElements, setTotalElements] = useState<number>(0)
    const [totalPageCount, setTotalPageCount] = useState<number>(1)

    const url = `/api/coupon?size=${pageSize}&page=${currentPage}${status !== "ALL" ? `&status=${status}` : ""}`
    const loadCouponList = () => {
        apiCall<CouponListResponse>(url, "GET").then(({ data }) => {
            console.log(data);
            if (data?.data) {
                setCouponList(data.data);
                setTotalElements(data.page.totalElements);  
                setTotalPageCount(data.page.totalPages);
                setCurrentPage(data.page.number);
            }
        })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(parseInt(e.target.value));
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value as CouponStatusType);
    }

    useEffect(() => {
        loadCouponList();
    }, [])

    useEffect(() => {
        setCurrentPage(0);
    }, [status, pageSize])

    useEffect(() => {
        loadCouponList();
    }, [currentPage])

    return (
        <div className="flex flex-col mx-auto w-full p-8">
            <div className="flex justify-between items-center mb-8 border-b pb-2">
                <h2 className="text-2xl font-medium">쿠폰 목록</h2>
                <div className="flex gap-4">
                    <select className="border rounded px-4 py-2" onChange={handlePageSizeChange}>
                        <option value="10">10개씩</option>
                        <option value="20">20개씩</option>
                        <option value="50">50개씩</option>
                    </select>
                    <select className="border rounded px-4 py-2" onChange={handleStatusChange}>
                        {
                            Object.entries(CouponStatus).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))
                        }
                    </select>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <button
                    className="px-4 py-2 rounded-md text-main-color"
                    onClick={() => router.push("/admin/coupon/register")}
                >
                    + 쿠폰 등록
                </button>
            </div>

            <table className="w-full text-center">
                <thead>
                <tr className="border-b">
                    <th className="p-4 truncate max-w-0 text-left">이름</th>
                    <th className="p-4 w-[10%]">할인 금액</th>
                    <th className="p-4 w-[30%]">발급 기간</th>
                    <th className="p-4 w-[10%]">만료일</th>
                    <th className="p-4 w-[7%]">수량</th>
                    <th className="p-4 w-[10%]">상태</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan={6} className="p-4">
                            <Spinner message="쿠폰 목록을 불러오고 있습니다."/>
                        </td>
                    </tr>
                ) : (
                    couponList.map((coupon) => (
                        <tr
                        key={coupon.id} 
                        className="border-b hover:bg-gray-50"
                        onClick={() => router.push(`/admin/coupon/${coupon.id}`)}
                        >
                        <td className="p-4 text-left">{coupon.title}</td>
                        <td className="p-4">{coupon.price} 원</td>
                        <td className="p-4">
                            {formatDateInAdmin(coupon.startAt)} ~ {formatDateInAdmin(coupon.endAt)}
                        </td>
                        <td className="p-4">
                            {formatDateInAdmin(coupon.expiresAt)}
                        </td>
                        <td className="p-4">{coupon.stock}</td>
                        <td className="p-4 flex justify-center"><CouponTag status={coupon.status} /></td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
            <Pagination totalPages={totalPageCount} currentPage={currentPage} onPageChange={handlePageChange}/>
        </div>
    )
}