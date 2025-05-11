"use client"

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react"
import CouponTag from "@/components/admin/CouponTag";

export default function ProjectApprovalDetailPage() {
    const router = useRouter();

    // mock data
    const Coupon = {
        id: 1,
        code: 1001,
        name: "신규 가입 할인 쿠폰",
        description: "신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다",
        price: 3000,
        startDate: "2025-01-01",
        endDate: "2025-12-31", 
        expireDate: "2025-12-31",
        stock: 1000,
        status: "inprogress"
    }

    return (
        <div className="flex flex-col mx-auto w-full p-8 gap-6">
            <div className="flex w-full">
            <button className="text-sm text-gray-500 flex items-center gap-2" onClick={() => router.back()}>
                <ArrowLeftIcon className="w-4 h-4" />
                목록으로
            </button>
            </div>
            <div className="flex flex-col gap-6 mb-8">
                <h3 className="text-xl font-medium">쿠폰 정보</h3>
                <table>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">쿠폰 코드</td>
                            <td className="p-4">{Coupon.code}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">쿠폰명</td>
                            <td className="p-4">{Coupon.name}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">설명</td>
                            <td className="p-4">{Coupon.description}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">할인 금액</td>
                            <td className="p-4">{Coupon.price.toLocaleString()}원</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">발급 기간</td>
                            <td className="p-4">{Coupon.startDate} ~ {Coupon.endDate}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">만료일</td>
                            <td className="p-4">{Coupon.expireDate}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold w-[10%]">수량</td>
                            <td className="p-4">{Coupon.stock.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-semibold w-[10%]">상태</td>
                            <td className="p-4"><CouponTag status={Coupon.status as "inprogress" | "previous" | "completed" | "ended"} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}