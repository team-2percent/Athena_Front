"use client"

import { useEffect, useState } from "react"
import DatePicker from "@/components/projectRegister/DatePicker"
import clsx from "clsx"
import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import ConfirmModal from "@/components/common/ConfirmModal"
import { useApi } from "@/hooks/useApi"
import TimePicker from "@/components/common/TimePicker"
import OverlaySpinner from "@/components/common/OverlaySpinner"
import { PrimaryButton } from "@/components/common/Button"
export default function CouponRegisterPage() {
    const router = useRouter();
    const { apiCall } = useApi();
    const [isLoading, setIsLoading] = useState<boolean>(false) // 쿠폰 등록 중 로딩 상태
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    // 쿠폰 추가
    const [couponName, setCouponName] = useState<string>("")
    const [couponDescription, setCouponDescription] = useState<string>("")
    const [couponPrice, setCouponPrice] = useState<number>(0)
    const [couponStartDateTime, setCouponStartDateTime] = useState<Date>(new Date())
    const [couponEndDateTime, setCouponEndDateTime] = useState<Date>(new Date())
    const [couponExpireDateTime, setCouponExpireDateTime] = useState<Date>(new Date())
    const [couponStock, setCouponStock] = useState<number>(0)

    const couponPriceLimit = 10000000000
    const couponStockLimit = 10000000000

    const [couponPriceError, setCouponPriceError] = useState<boolean>(false);
    const [couponStockError, setCouponStockError] = useState<boolean>(false);
    
    const disabled = couponName === "" || couponDescription === "" || couponPrice === 0 || couponStartDateTime === null || couponEndDateTime === null || couponExpireDateTime === null || couponStock === 0

    const handleAddCoupon = () => {
        // 쿠폰 등록 추가
        setIsModalOpen(false);
        setIsLoading(true)
        apiCall("/api/coupon/create", "POST", {
            title: couponName,
            content: couponDescription,
            price: couponPrice,
            startAt: couponStartDateTime.toISOString(),
            endAt: couponEndDateTime.toISOString(),
            expiresAt: couponExpireDateTime.toISOString(),
            stock: couponStock,
        }).then(() => {
            router.push('/admin/coupon')
        })
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

    const handleCouponStartDateTimeChange = (hour: number) => {
        setCouponStartDateTime(new Date(couponStartDateTime.setHours(hour)))
    }

    const handleCouponEndDateTimeChange = (hour: number) => {
        setCouponEndDateTime(new Date(couponEndDateTime.setHours(hour)))
    }

    const handleCouponExpireDateTimeChange = (hour: number) => {
        setCouponExpireDateTime(new Date(couponExpireDateTime.setHours(hour)))
    }

    // 발급 기간 시작 시간이 발급 기간 종료 시간보다 크면 발급 기간 종료 시간을 1시간 증가
    useEffect(() => {
        if (couponStartDateTime >= couponEndDateTime) {
            const newEndDate = new Date(couponStartDateTime)
            newEndDate.setHours(couponStartDateTime.getHours() + 1)
            setCouponEndDateTime(newEndDate)
        }
    }, [couponStartDateTime])

    // 발급 기간 종료 시간이 만료 기간 시작 시간보다 크면 만료 기간 시작 시간을 1시간 증가
    useEffect(() => {
        if (couponEndDateTime >= couponExpireDateTime) {
            const newExpireDate = new Date(couponEndDateTime)
            newExpireDate.setHours(couponEndDateTime.getHours() + 1)
            setCouponExpireDateTime(newExpireDate)
        }
    }, [couponEndDateTime])

    return (
        <div className="flex flex-col mx-auto w-full p-8 gap-6">
            {
                isLoading && <OverlaySpinner message="쿠폰 등록 중입니다." />
            }
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
                            <DatePicker selectedDate={couponStartDateTime} onChange={(date) => setCouponStartDateTime(date)}/>
                            <TimePicker selectedDateTime={couponStartDateTime} onChange={handleCouponStartDateTimeChange}/>
                            <span>~</span>
                            <DatePicker selectedDate={couponEndDateTime} onChange={(date) => setCouponEndDateTime(date)}  minDate={couponStartDateTime}/>
                            <TimePicker selectedDateTime={couponEndDateTime} onChange={handleCouponEndDateTimeChange} minDateTime={couponStartDateTime}/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">만료 기간</label>
                        <div className="flex gap-4 items-center">
                            <DatePicker selectedDate={couponExpireDateTime} onChange={(date) => setCouponExpireDateTime(date)} minDate={couponEndDateTime}/>
                            <TimePicker selectedDateTime={couponExpireDateTime} onChange={handleCouponExpireDateTimeChange} minDateTime={couponEndDateTime}/>
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
                        <PrimaryButton
                            disabled={disabled}
                            onClick={handleModalOpen}
                        >
                            등록
                        </PrimaryButton>
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