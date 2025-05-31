"use client"

import { useEffect, useState } from "react"
import DatePicker from "@/components/projectRegister/DatePicker"
import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import ConfirmModal from "@/components/common/ConfirmModal"
import { useApi } from "@/hooks/useApi"
import TimePicker from "@/components/common/TimePicker"
import OverlaySpinner from "@/components/common/OverlaySpinner"
import { PrimaryButton } from "@/components/common/Button"
import { NumberInput, TextInput } from "@/components/common/Input"
import TextArea from "@/components/common/TextArea"
import { COUPON_CONTENT_MAX_LENGTH, COUPON_EVENT_END_TO_EXPIRE_MIN_HOUR, COUPON_EVENT_START_TO_END_MIN_HOUR, COUPON_NAME_MAX_LENGTH, COUPON_PRICE_MAX_NUMBER, COUPON_STOCK_MAX_NUMBER } from "@/lib/validationConstant"
import { couponAddSchema, couponContentSchema, couponExpireSchema, couponNameSchema, couponPeriodSchema, couponPriceSchema, couponStockSchema } from "@/lib/validationSchemas"
import InputInfo from "@/components/common/InputInfo"
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

    const [couponAddError, setCouponAddError] = useState({
        title: "",
        content: "",
        price: "",
        period: "",
        expire: "",
        stock: "",
    })
    
    const disabled: boolean = couponAddSchema.safeParse({
        title: couponName,
        content: couponDescription,
        price: couponPrice,
        period: {
            startAt: couponStartDateTime,
            endAt: couponEndDateTime,
        },
        expire: {
            endAt: couponEndDateTime,
            expiresAt: couponExpireDateTime,
        },
        stock: couponStock,
    }).error !== undefined

    // 유효성 검사 함수
    const validateTitle = (value: string) => {
        const result = couponNameSchema.safeParse(value)
        if (result.success) {
            setCouponAddError({ ...couponAddError, title: "" })
            return value
        }

        if (value.length > COUPON_NAME_MAX_LENGTH) {
            setCouponAddError({ ...couponAddError, title: result.error.issues[0].message })
            return value.slice(0, COUPON_NAME_MAX_LENGTH)
        }
        setCouponAddError({ ...couponAddError, title: result.error.issues[0].message })
        return value
    }

    const validateContent = (value: string) => {
        const result = couponContentSchema.safeParse(value)
        if (result.success) {
            setCouponAddError({ ...couponAddError, content: "" })
            return value
        }

        if (value.length > COUPON_CONTENT_MAX_LENGTH) {
            setCouponAddError({ ...couponAddError, content: result.error.issues[0].message })
            return value.slice(0, COUPON_CONTENT_MAX_LENGTH)
        }

        setCouponAddError({ ...couponAddError, content: result.error.issues[0].message })
        return value
    }

    const validatePrice = (value: string) => {
        const newValue = +value.replace(/^0+/, '')
        const result = couponPriceSchema.safeParse(newValue)
        if (result.success) {
            setCouponAddError({ ...couponAddError, price: "" })
            return newValue
        }

        if (newValue > COUPON_PRICE_MAX_NUMBER) {
            return COUPON_PRICE_MAX_NUMBER
        }

        setCouponAddError({ ...couponAddError, price: result.error.issues[0].message })
        return newValue
    }

    const validatePeriod = (startAt: Date, endAt: Date) => {
        const result = couponPeriodSchema.safeParse({
            startAt: startAt,
            endAt: endAt,
        })

        if (result.success) {
            setCouponAddError({ ...couponAddError, period: "" })
            return {
                startAt: startAt,
                endAt: endAt
            }
        }

        // 현재 시간과 같거나 이전이면 현재 시간 + 1시간으로 설정 (분은 00분으로)
        if (startAt <= new Date()) {
            const now = new Date()
            const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0)
            setCouponAddError({ ...couponAddError, period: result.error.issues[0].message })
            return {
                startAt: nextHour,
                endAt: endAt
            }
        }

        // 발급 기간 종료 시간이 발급 기간 시작 시간보다 크면 발급 기간 시작 시간을 1시간 증가
        if (endAt <= startAt) {
            const newEndAt = new Date(startAt)
            newEndAt.setHours(startAt.getHours() + COUPON_EVENT_START_TO_END_MIN_HOUR)
            return {
                startAt: startAt,
                endAt: newEndAt
            }
        }

        setCouponAddError({ ...couponAddError, period: result.error.issues[0].message })
        return {
            startAt: startAt,
            endAt: endAt
        }
    }

    const validateExpire = (endAt: Date, expiresAt: Date) => {
        const result = couponExpireSchema.safeParse({
            endAt: endAt,
            expiresAt: expiresAt,
        })

        if (result.success) {
            setCouponAddError({ ...couponAddError, expire: "" })
            return {
                endAt: endAt,
                expiresAt: expiresAt
            }
        }

        setCouponAddError({ ...couponAddError, expire: result.error.issues[0].message })

        // 발급 기간 종료 시간이 발급 기간 시작 시간보다 크면 발급 기간 시작 시간을 1시간 증가
        if (expiresAt <= endAt) {
            const newExpireDate = new Date(endAt)
            newExpireDate.setHours(endAt.getHours() + COUPON_EVENT_END_TO_EXPIRE_MIN_HOUR)
            return {
                endAt: endAt,
                expiresAt: newExpireDate
            }
        }

        return {
            endAt: endAt,
            expiresAt: expiresAt
        }
    }

    const validateStock = (value: string) => {
        const newValue = +value.replace(/^0+/, '')
        const result = couponStockSchema.safeParse(newValue)
        if (result.success) {
            setCouponAddError({ ...couponAddError, stock: "" })
            return newValue
        }

        if (newValue > COUPON_STOCK_MAX_NUMBER) {
            return COUPON_STOCK_MAX_NUMBER
        }

        setCouponAddError({ ...couponAddError, stock: result.error.issues[0].message })
        return newValue
    }

    // 핸들링
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

    const handleCouponNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = validateTitle(e.target.value)
        setCouponName(value)
    }

    const handleCouponDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = validateContent(e.target.value)
        setCouponDescription(value)
    }

    const handleCouponPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = validatePrice(e.target.value)
        setCouponPrice(value)
    }

    const handleCouponPeriodChange = (startAt: Date, endAt: Date) => {
        const { startAt: newStartAt, endAt: newEndAt } = validatePeriod(startAt, endAt)
        setCouponStartDateTime(newStartAt)
        setCouponEndDateTime(newEndAt)
    }

    const handleCouponExpireChange = (endAt: Date, expiresAt: Date) => {
        const { endAt: newEndAt, expiresAt: newExpiresAt } = validateExpire(endAt, expiresAt)
        setCouponEndDateTime(newEndAt)
        setCouponExpireDateTime(newExpiresAt)
    }

    const handleCouponStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = validateStock(e.target.value)
        setCouponStock(value)
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

    useEffect(() => {
        handleCouponPeriodChange(couponStartDateTime, couponEndDateTime)
    }, [couponStartDateTime, couponEndDateTime])

    useEffect(() => {
        handleCouponExpireChange(couponEndDateTime, couponExpireDateTime)
    }, [couponEndDateTime, couponExpireDateTime])

    return (
        <div className="flex flex-col mx-auto w-[var(--content-width)] py-8 gap-6">
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
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">쿠폰명</label>
                        <TextInput
                            placeholder="쿠폰명을 입력하세요"
                            value={couponName}
                            onChange={handleCouponNameChange}
                            isError={couponAddError.title !== ""}
                        />
                        <InputInfo errorMessage={couponAddError.title} showLength length={couponName.length} maxLength={COUPON_NAME_MAX_LENGTH} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">쿠폰 설명</label>
                        <TextArea
                            placeholder="쿠폰 설명을 입력하세요"
                            value={couponDescription}
                            onChange={handleCouponDescriptionChange}
                            isError={couponAddError.content !== ""}
                        />
                        <InputInfo errorMessage={couponAddError.content} showLength length={couponDescription.length} maxLength={COUPON_CONTENT_MAX_LENGTH} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">가격</label>
                        <div className="flex gap-4 items-center">
                            <NumberInput
                                className="w-32"
                                placeholder="가격을 입력하세요"
                                value={couponPrice.toString()}
                                onClick={handleClick}
                                onChange={handleCouponPriceChange}
                                isError={couponAddError.price !== ""}
                            />
                            <InputInfo errorMessage={couponAddError.price} />
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
                        <InputInfo errorMessage={couponAddError.period} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">만료 기간</label>
                        <div className="flex gap-4 items-center">
                            <DatePicker selectedDate={couponExpireDateTime} onChange={(date) => setCouponExpireDateTime(date)} minDate={couponEndDateTime}/>
                            <TimePicker selectedDateTime={couponExpireDateTime} onChange={handleCouponExpireDateTimeChange} minDateTime={couponEndDateTime}/>
                        </div>
                        <InputInfo errorMessage={couponAddError.expire} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">수량</label>
                        <div className="flex gap-4 items-center">
                            <NumberInput
                                className="w-32"
                                placeholder="수량을 입력하세요"
                                value={couponStock}
                                onClick={handleClick}
                                onChange={handleCouponStockChange}
                                isError={couponAddError.stock !== ""}
                            />
                            <InputInfo errorMessage={couponAddError.stock} />
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