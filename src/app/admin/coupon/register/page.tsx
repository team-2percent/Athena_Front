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
import useErrorToastStore from "@/stores/useErrorToastStore"
import { getValidatedDateHour, getValidatedNumber, getValidatedString, validate } from "@/lib/validationUtil"
export default function CouponRegisterPage() {
    const router = useRouter();
    const { apiCall } = useApi();
    const { showErrorToast } = useErrorToastStore()
    const [isLoading, setIsLoading] = useState<boolean>(false) // 쿠폰 등록 중 로딩 상태
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    // 쿠폰 추가
    const [couponName, setCouponName] = useState<string>("")
    const [couponDescription, setCouponDescription] = useState<string>("")
    const [couponPrice, setCouponPrice] = useState<number>(0)
    
    // 초기 시간 설정
    const now = new Date()
    const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0)
    const endHour = new Date(nextHour)
    endHour.setHours(nextHour.getHours() + COUPON_EVENT_START_TO_END_MIN_HOUR)
    const expireHour = new Date(endHour)
    expireHour.setHours(endHour.getHours() + COUPON_EVENT_END_TO_EXPIRE_MIN_HOUR)
    
    const [couponStartDateTime, setCouponStartDateTime] = useState<Date>(nextHour)
    const [couponEndDateTime, setCouponEndDateTime] = useState<Date>(endHour)
    const [couponExpireDateTime, setCouponExpireDateTime] = useState<Date>(expireHour)
    const [couponStock, setCouponStock] = useState<number>(0)

    const [couponAddError, setCouponAddError] = useState({
        title: "",
        content: "",
        price: "",
        period: "",
        expire: "",
        stock: "",
    })
    
    const disabled: boolean = validate({
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
    }, couponAddSchema).error

    const handleAddCoupon = () => {
        // 쿠폰 등록 추가
        setIsModalOpen(false);
        setIsLoading(true)
        apiCall("/api/coupon/create", "POST", {
            title: couponName,
            content: couponDescription,
            price: couponPrice,
            startAt: new Date(couponStartDateTime.getTime() - (9 * 60 * 60 * 1000)).toISOString(),
            endAt: new Date(couponEndDateTime.getTime() - (9 * 60 * 60 * 1000)).toISOString(),
            expiresAt: new Date(couponExpireDateTime.getTime() - (9 * 60 * 60 * 1000)).toISOString(),
            stock: couponStock,
        }).then(({ error, status }) => {
            if (error && status === 500) {
                showErrorToast("쿠폰 등록 실패", "다시 시도해 주세요.")
            } else if (!error) {
                router.push('/admin/coupon')
            }
        })
    }

    const handleModalOpen = () => {
        setIsModalOpen(true)
    }

    const handleCouponNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const result = validate(e.target.value, couponNameSchema)
        const value = getValidatedString(e.target.value, COUPON_NAME_MAX_LENGTH)
        if (result.error) {
            setCouponAddError({ ...couponAddError, title: result.message })
        } else {
            setCouponAddError({ ...couponAddError, title: "" })
        }
        setCouponName(value)
    }

    const handleCouponDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const result = validate(e.target.value, couponContentSchema)
        const value = getValidatedString(e.target.value, COUPON_CONTENT_MAX_LENGTH)
        if (result.error) {
            setCouponAddError({ ...couponAddError, content: result.message })
        } else {
            setCouponAddError({ ...couponAddError, content: "" })
        }
        setCouponDescription(value)
    }

    const handleCouponPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = +e.target.value.replace(/^0+/, '')
        const result = validate(price, couponPriceSchema)
        const value = getValidatedNumber(price, COUPON_PRICE_MAX_NUMBER)
        if (result.error) {
            setCouponAddError({ ...couponAddError, price: result.message })
        } else {
            setCouponAddError({ ...couponAddError, price: "" })
        }
        setCouponPrice(value)
    }

    const setPeriodError = (startAt: Date, endAt: Date) => {
        const result = validate({
            startAt: startAt,
            endAt: endAt,
        }, couponPeriodSchema)
        if (result.error) {
            setCouponAddError({ ...couponAddError, period: result.message })
        } else {
            setCouponAddError({ ...couponAddError, period: "" })
        }
    }

    const handleCouponPeriodChange = (startAt: Date) => {
        setCouponEndDateTime(getValidatedDateHour(couponEndDateTime, startAt, COUPON_EVENT_START_TO_END_MIN_HOUR))
        setCouponExpireDateTime(getValidatedDateHour(couponExpireDateTime, couponEndDateTime, COUPON_EVENT_END_TO_EXPIRE_MIN_HOUR))
    }

    const setExpireError = (endAt: Date, expiresAt: Date) => {
        const result = validate({
            endAt: endAt,
            expiresAt: expiresAt,
        }, couponExpireSchema)
        if (result.error) {
            setCouponAddError({ ...couponAddError, expire: result.message })
        } else {
            setCouponAddError({ ...couponAddError, expire: "" })
        }
    }

    const handleCouponExpireChange = (endAt: Date) => {
        const result = validate({
            endAt: endAt,
            expiresAt: couponExpireDateTime,
        }, couponExpireSchema)
        if (result.error) {
            setCouponAddError({ ...couponAddError, expire: result.message })
        } else {
            setCouponAddError({ ...couponAddError, expire: "" })
        }

        setCouponExpireDateTime(getValidatedDateHour(couponExpireDateTime, endAt, COUPON_EVENT_END_TO_EXPIRE_MIN_HOUR))
    }

    const handleCouponStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const stock = +e.target.value.replace(/^0+/, '')
        const result = validate(stock, couponStockSchema)
        const value = getValidatedNumber(stock, COUPON_STOCK_MAX_NUMBER)
        if (result.error) {
            setCouponAddError({ ...couponAddError, stock: result.message })
        } else {
            setCouponAddError({ ...couponAddError, stock: "" })
        }
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
        handleCouponPeriodChange(couponStartDateTime)
        setPeriodError(couponStartDateTime, couponEndDateTime)
    }, [couponStartDateTime])

    useEffect(() => {
        handleCouponExpireChange(couponEndDateTime)
        setExpireError(couponEndDateTime, couponExpireDateTime)
    }, [couponEndDateTime])

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
                            designType="outline-round"
                            value={couponName}
                            onChange={handleCouponNameChange}
                            isError={couponAddError.title !== ""}
                            dataCy="coupon-name-input"
                        />
                        <InputInfo errorMessage={couponAddError.title} showLength length={couponName.length} maxLength={COUPON_NAME_MAX_LENGTH} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">쿠폰 설명</label>
                        <TextArea
                            placeholder="쿠폰 설명을 입력하세요"
                            value={couponDescription}
                            className="rounded-lg border-gray-300"
                            onChange={handleCouponDescriptionChange}
                            isError={couponAddError.content !== ""}
                            dataCy="coupon-description-input"
                        />
                        <InputInfo errorMessage={couponAddError.content} showLength length={couponDescription.length} maxLength={COUPON_CONTENT_MAX_LENGTH} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-sub-gray">가격</label>
                        <div className="flex gap-4 items-center">
                            <NumberInput
                                className="w-32"
                                placeholder="가격을 입력하세요"
                                designType="outline-round"
                                value={couponPrice.toString()}
                                onClick={handleClick}
                                onChange={handleCouponPriceChange}
                                isError={couponAddError.price !== ""}
                                dataCy="coupon-price-input"
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
                                designType="outline-round"
                                value={couponStock}
                                onClick={handleClick}
                                onChange={handleCouponStockChange}
                                isError={couponAddError.stock !== ""}
                                dataCy="coupon-stock-input"
                            />
                            <InputInfo errorMessage={couponAddError.stock} />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <PrimaryButton
                            disabled={disabled}
                            onClick={handleModalOpen}
                            dataCy="coupon-submit-button"
                        >
                            등록
                        </PrimaryButton>
                    </div>
                </div>
                <ConfirmModal
                    isOpen={isModalOpen}
                    message="쿠폰을 등록하시겠습니까?"
                    onConfirm={handleAddCoupon}
                    onClose={() => setIsModalOpen(false)}
                    dataCy="coupon-confirm-modal"
                />
            </div>
    )
}