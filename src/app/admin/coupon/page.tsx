"use client"

import { useEffect, useState } from "react"
import CouponTag from "@/components/admin/CouponTag"
import { useRouter } from "next/navigation"
import { CouponListItem, CouponListResponse, CouponStatus, CouponStatusType } from "@/lib/CouponConstant"
import { useApi } from "@/hooks/useApi"
import Spinner from "@/components/common/Spinner"
import { formatDateInAdmin } from "@/lib/utils"
import Pagination from "@/components/common/Pagination"
import EmptyMessage from "@/components/common/EmptyMessage"
import { PrimaryButton } from "@/components/common/Button"
import ServerErrorComponent from "@/components/common/ServerErrorComponent"

export default function CouponPage() {
    const router = useRouter()
    const { isLoading, apiCall } = useApi();
    const [status, setStatus] = useState<CouponStatusType>("ALL")
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [couponList, setCouponList] = useState<CouponListItem[]>([])
    const [totalPageCount, setTotalPageCount] = useState<number>(0)
    const [serverError, setServerError] = useState(false);
    const isEmpty = totalPageCount === 0 && !isLoading && !serverError;
    const url = `/api/admin/${status !== "ALL" ? "couponByStatus" : "couponList"}?size=${pageSize}&page=${currentPage}${status !== "ALL" ? `&status=${status}` : ""}`
    const loadCouponList = () => {
        apiCall<CouponListResponse>(url, "GET").then(({ data, error, status }) => {
            if (data) {
                setCouponList(data.content);
                setTotalPageCount(data.page.totalPages);
                setCurrentPage(data.page.number);
            }
            if (error && status === 500) {
                setCouponList([]);
                setServerError(true)
                return
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
        loadCouponList();
    }, [status, pageSize])

    useEffect(() => {
        loadCouponList();
    }, [currentPage])

    return (
        <div className="flex flex-col mx-auto w-[var(--content-width)] py-8">
            <div className="flex justify-between items-center mb-8 border-b pb-2">
                <h2 className="text-2xl font-medium">쿠폰 목록</h2>
                <div className="flex gap-4">
                    <select
                        className="border rounded px-4 py-2"
                        onChange={handlePageSizeChange}
                        data-cy="page-size-select"
                    >
                        <option value="10">10개씩</option>
                        <option value="20">20개씩</option>
                        <option value="50">50개씩</option>
                    </select>
                    <select
                        className="border rounded px-4 py-2"
                        onChange={handleStatusChange}
                        data-cy="status-select"
                    >
                        {
                            Object.entries(CouponStatus).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))
                        }
                    </select>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <PrimaryButton
                    onClick={() => router.push("/admin/coupon/register")}
                    dataCy="coupon-register-button"
                >
                    + 쿠폰 등록
                </PrimaryButton>
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
                <tbody data-cy="coupon-list">
                {
                    couponList.map((coupon) => (
                        <tr
                        key={coupon.id} 
                        className="border-b hover:bg-gray-50"
                        onClick={() => router.push(`/admin/coupon/${coupon.id}`)}
                        data-cy="coupon-list-item"
                        >
                        <td className="p-4 text-left" data-cy="coupon-name">{coupon.title}</td>
                        <td className="p-4" data-cy="coupon-price">{coupon.price} 원</td>
                        <td className="p-4" data-cy="coupon-period">
                            {formatDateInAdmin(coupon.startAt)} ~ {formatDateInAdmin(coupon.endAt)}
                        </td>
                        <td className="p-4" data-cy="coupon-expiration-date">
                            {formatDateInAdmin(coupon.expireAt)}
                        </td>
                        <td className="p-4" data-cy="coupon-amount">{coupon.stock}</td>
                        <td className="p-4 flex justify-center" data-cy="coupon-status"><CouponTag status={coupon.status} /></td>
                        </tr>
                    ))  
                }
                </tbody>
            </table>
            {isEmpty && <EmptyMessage message="쿠폰이 없습니다." />}
            {serverError && <ServerErrorComponent message="쿠폰 목록 조회에 실패했습니다." onRetry={loadCouponList}/>}
            <Pagination totalPages={totalPageCount} currentPage={currentPage} onPageChange={handlePageChange}/>
        </div>
    )
}