"use client"

import { useState } from "react"
import DatePicker from "@/components/projectRegister/DatePicker"
import clsx from "clsx"
import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
export default function CouponRegisterPage() {
    const router = useRouter();
    // 쿠폰 추가
    const [couponName, setCouponName] = useState<string>("")
    const [couponDescription, setCouponDescription] = useState<string>("")
    const [couponPrice, setCouponPrice] = useState<number>(0)
    const [couponStartDate, setCouponStartDate] = useState<Date>(new Date())
    const [couponEndDate, setCouponEndDate] = useState<Date>(new Date())
    const [couponExpireDate, setCouponExpireDate] = useState<Date>(new Date())
    const [couponStock, setCouponStock] = useState<number>(0)

    const disabled = couponName === "" || couponDescription === "" || couponPrice === 0 || couponStartDate === null || couponEndDate === null || couponExpireDate === null || couponStock === 0

    const handleAddCoupon = () => {
        // 쿠폰 등록 추가
    }
    // 폼 초기화 함수
    const resetForm = () => {
        setCouponName("")
        setCouponDescription("")
        setCouponPrice(0)
        setCouponStartDate(new Date())
        setCouponEndDate(new Date()) 
        setCouponExpireDate(new Date())
        setCouponStock(0)
    }

    return (
        <div className="flex flex-col mx-auto w-full p-8 gap-6">
                <div className="flex w-full">
                <button className="text-sm text-gray-500 flex items-center gap-2" onClick={() => router.push("/admin/coupon")}>
                    <ArrowLeftIcon className="w-4 h-4" />
                    목록으로
                </button>
                </div>
                <h2 className="text-2xl font-medium border-b pb-2">쿠폰 등록</h2>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">쿠폰명</label>
                        <input 
                            type="text"
                            placeholder="쿠폰명을 입력하세요"
                            className="w-full p-3 border rounded-md"
                            value={couponName}
                            onChange={(e) => setCouponName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">쿠폰 설명</label>
                        <textarea 
                            placeholder="쿠폰명을 입력하세요"
                            className="w-full p-3 border rounded-md resize-none"
                            value={couponDescription}
                            onChange={(e) => setCouponDescription(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">가격</label>
                        <input 
                            type="text"
                            placeholder="가격을 입력하세요"
                            className="w-full p-3 border rounded-md"
                            value={couponPrice}
                            onChange={(e) => setCouponPrice(Number(e.target.value))}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">발급 기간</label>
                        <div className="flex gap-4 items-center">
                            <DatePicker selectedDate={couponStartDate} onChange={(date) => setCouponStartDate(date)} />
                            <span>~</span>
                            <DatePicker selectedDate={couponEndDate} onChange={(date) => setCouponEndDate(date)} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">만료 기간</label>
                        <div className="flex gap-4 items-center">
                            <DatePicker selectedDate={couponExpireDate} onChange={(date) => setCouponExpireDate(date)} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">수량</label>
                        <div className="flex gap-4 items-center">
                            <input 
                                type="number"
                                className="p-3 border rounded-md"
                                value={couponStock}
                                onChange={(e) => setCouponStock(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            className={clsx("px-8 p-4 rounded-md", disabled ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-pink-100 text-pink-600")}
                            disabled={disabled}
                            onClick={handleAddCoupon}
                        >
                            등록
                        </button>
                    </div>
                </div>
            </div>
    )
}