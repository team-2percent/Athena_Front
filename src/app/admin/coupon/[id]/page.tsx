"use client"

import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react"
import CouponTag from "@/components/admin/CouponTag";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { CouponDetail } from "@/lib/CouponConstant";
import Spinner from "@/components/common/Spinner";
import { formatDateInAdmin } from "@/lib/utils";
import ServerErrorComponent from "@/components/common/ServerErrorComponent";
import { GhostButton } from "@/components/common/Button";

export default function ProjectApprovalDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isLoading, apiCall } = useApi();
    const [coupon, setCoupon] = useState<CouponDetail | null>(null);
    const [serverError, setServerError] = useState(false);
    const loadData = () => {
        apiCall<CouponDetail>(`/api/admin/${id}`, "GET").then(({ data, error, status }) => {
            setCoupon(data);
            if (error && status === 500) {
                setServerError(true);
            }
        })
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="flex flex-col mx-auto w-[var(--content-width)] py-8 gap-6">
            <div className="flex w-full">
            <GhostButton
                onClick={() => router.push("/admin/coupon")}
                className="flex gap-1 items-center"
                dataCy="back-to-list-button"
            >
                <ArrowLeftIcon className="w-4 h-4" />
                목록으로
            </GhostButton>
            </div>
            <div className="flex flex-col gap-6 mb-8">
            <h2 className="text-2xl font-medium border-b pb-2">쿠폰 정보</h2>
                {serverError && <ServerErrorComponent message="쿠폰 정보 조회에 실패했습니다." onRetry={loadData}/>}
                {isLoading ? <Spinner message="쿠폰 정보를 불러오고 있습니다."/> : coupon && <table>
                    <tbody data-cy="coupon-detail">
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">쿠폰명</td>
                            <td className="p-4" data-cy="coupon-name">{coupon.title}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">설명</td>
                            <td className="p-4" data-cy="coupon-description">{coupon.content}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">할인 금액</td>
                            <td className="p-4" data-cy="coupon-discount-amount">{coupon.price}원</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">발급 기간</td>
                            <td className="p-4" data-cy="coupon-issue-period">{formatDateInAdmin(coupon.startAt)} ~ {formatDateInAdmin(coupon.endAt)}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">만료일</td>
                            <td className="p-4" data-cy="coupon-expiration-date">{formatDateInAdmin(coupon.expireAt)}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">수량</td>
                            <td className="p-4" data-cy="coupon-quantity">{coupon.stock}</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-semibold w-[10%]">상태</td>
                            <td className="p-4" data-cy="coupon-status"><CouponTag status={coupon.status} /></td>
                        </tr>
                    </tbody>
                </table>}
            </div>
            
        </div>
    )
}