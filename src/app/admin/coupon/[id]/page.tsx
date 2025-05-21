"use client"

import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react"
import CouponTag from "@/components/admin/CouponTag";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { CouponDetail } from "@/lib/CouponConstant";
import Spinner from "@/components/common/Spinner";
import { formatDateInAdmin } from "@/lib/utils";

export default function ProjectApprovalDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isLoading, apiCall } = useApi();
    const [coupon, setCoupon] = useState<CouponDetail | null>(null);
    const loadData = () => {
        apiCall<CouponDetail>(`/api/admin/${id}`, "GET").then(({ data, error }) => {
            setCoupon(data);
        })
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="flex flex-col mx-auto w-full p-8 gap-6">
            <div className="flex w-full">
            <button className="text-sm text-gray-500 flex items-center gap-2" onClick={() => router.push("/admin/coupon")}>
                <ArrowLeftIcon className="w-4 h-4" />
                목록으로
            </button>
            </div>
            <div className="flex flex-col gap-6 mb-8">
            <h2 className="text-2xl font-medium border-b pb-2">쿠폰 정보</h2>
                {isLoading ? <Spinner message="쿠폰 정보를 불러오고 있습니다."/> : coupon && <table>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">쿠폰명</td>
                            <td className="p-4">{coupon.title}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">설명</td>
                            <td className="p-4">{coupon.content}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">할인 금액</td>
                            <td className="p-4">{coupon.price}원</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">발급 기간</td>
                            <td className="p-4">{formatDateInAdmin(coupon.startAt)} ~ {formatDateInAdmin(coupon.endAt)}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">만료일</td>
                            <td className="p-4">{formatDateInAdmin(coupon.expiresAt)}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">수량</td>
                            <td className="p-4">{coupon.stock}</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-semibold w-[10%]">상태</td>
                            <td className="p-4"><CouponTag status={coupon.status} /></td>
                        </tr>
                    </tbody>
                </table>}
            </div>
            
        </div>
    )
}