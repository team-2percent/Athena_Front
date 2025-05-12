"use client"

import { useState } from "react"
import DatePicker from "@/components/projectRegister/DatePicker"
import clsx from "clsx"
import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import ConfirmModal from "@/components/common/ConfirmModal"
export default function CouponRegisterPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    // 쿠폰 추가
    const [couponName, setCouponName] = useState<string>("")
    const [couponDescription, setCouponDescription] = useState<string>("")
    const [couponPrice, setCouponPrice] = useState<number>(0)
    const [couponStartDate, setCouponStartDate] = useState<Date>(new Date())
    const [couponEndDate, setCouponEndDate] = useState<Date>(new Date())
    const [couponExpireDate, setCouponExpireDate] = useState<Date>(new Date())
    const [couponStock, setCouponStock] = useState<number>(0)

    const couponPriceLimit = 10000000000
    const couponStockLimit = 10000000000

    const [couponPriceError, setCouponPriceError] = useState<boolean>(false);
    const [couponStockError, setCouponStockError] = useState<boolean>(false);

    const disabled = couponName === "" || couponDescription === "" || couponPrice === 0 || couponStartDate === null || couponEndDate === null || couponExpireDate === null || couponStock === 0

    const handleAddCoupon = () => {
        // 쿠폰 등록 추가
        router.push('/admin/coupon')
    }

    const handleModalOpen = () => {
        setIsModalOpen(true)
    }

    const convertInputToNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.startsWith("0")) {
            e.target.value = e.target.value.replace("0", "")
        }
        const value = e.target.value.replace(/[^0-9]/g, "")
        e.target.value = value
        return Number(e.target.value)
    }

    const handleCouponPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCouponPriceError(false)
        const value = convertInputToNumber(e)
        if (Number(value) > couponPriceLimit) {
            setCouponPriceError(true)
            setCouponPrice(couponPriceLimit)
        } else {
            setCouponPrice(Number(value))
        }
    }

    const handleCouponStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCouponStockError(false)
        const value = convertInputToNumber(e)
        if (Number(value) > couponStockLimit) {
            setCouponStock(couponStockLimit)
            setCouponStockError(true)
        } else {
            setCouponStock(Number(value))
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        e.currentTarget.select();
      };

    return (
        <div className="flex flex-col mx-auto w-full p-8 gap-6">
            {}
                <div className="flex w-full">
                <button className="text-sm text-gray-500 flex items-center gap-2" onClick={() => router.push("/admin/coupon")}>
                    <ArrowLeftIcon className="w-4 h-4" />
                    목록으로
                </button>
                </div>
                <h2 className="text-2xl font-medium border-b pb-2">쿠폰 등록</h2>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">쿠폰명</label>
                        <input 
                            type="text"
                            placeholder="쿠폰명을 입력하세요"
                            className="w-full p-3 border rounded-md"
                            value={couponName}
                            onChange={(e) => setCouponName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">쿠폰 설명</label>
                        <textarea 
                            placeholder="쿠폰 설명을 입력하세요"
                            className="w-full p-3 border rounded-md resize-none"
                            value={couponDescription}
                            onChange={(e) => setCouponDescription(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">가격</label>
                        <div className="flex gap-4 items-center">
                            <input 
                                type="text"
                                placeholder="가격을 입력하세요"
                                className="p-3 border rounded-md"
                                value={couponPrice}
                                onClick={handleClick}
                                onChange={handleCouponPriceChange}
                            />
                            {couponPriceError && <p className="text-red-500 text-sm">가격은 최대 100억원까지 설정 가능합니다.</p>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">발급 기간</label>
                        <div className="flex gap-4 items-center">
                            <DatePicker selectedDate={couponStartDate} onChange={(date) => setCouponStartDate(date)}/>
                            <span>~</span>
                            <DatePicker selectedDate={couponEndDate} onChange={(date) => setCouponEndDate(date)}  minDate={couponStartDate}/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">만료 기간</label>
                        <div className="flex gap-4 items-center">
                            <DatePicker selectedDate={couponExpireDate} onChange={(date) => setCouponExpireDate(date)} minDate={couponEndDate}/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">수량</label>
                        <div className="flex gap-4 items-center">
                            <input 
                                type="text"
                                className="p-3 border rounded-md"
                                value={couponStock}
                                onClick={handleClick}
                                onChange={handleCouponStockChange}
                            />
                            {couponStockError && <p className="text-red-500 text-sm">수량은 최대 100억개까지 설정 가능합니다.</p>}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            className={clsx("px-8 p-4 rounded-md", disabled ? "bg-gray-100 text-sub-gray cursor-not-allowed" : "bg-main-color text-white hover:bg-secondary-color-dark")}
                            disabled={disabled}
                            onClick={handleModalOpen}
                        >
                            등록
                        </button>
                    </div>
                </div>
                {
                    isModalOpen &&
                    <ConfirmModal
                        isOpen={isModalOpen}
                        message="쿠폰을 등록하시겠습니까?"
                        onConfirm={handleAddCoupon}
                        onClose={() => setIsModalOpen(false)}
                    />
                }
            </div>
    )
}