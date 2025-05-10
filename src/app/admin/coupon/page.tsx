"use client"

import DatePicker from "@/components/projectRegister/DatePicker"
import clsx from "clsx"
import { useEffect, useState } from "react"

interface Coupon {
    id: number
    code: number
    name: string
    description: string
    price: number
    startDate: string
    endDate: string
    expireDate: string
    stock: number
    status: "previous" | "inprogress" | "completed" | "ended"
}

export default function CouponPage() {
    const [status, getStatus] = useState<"all" | "previous" | "inprogress" | "completed" | "ended">("all")
    const [pageSize, getPageSize] = useState<number>(10)
    const [currentPage, getCurrentPage] = useState<number>(1)
    const [couponList, setCouponList] = useState<Coupon[]>([])

    // 쿠폰 추가
    const [couponName, setCouponName] = useState<string>("")
    const [couponDescription, setCouponDescription] = useState<string>("")
    const [couponPrice, setCouponPrice] = useState<number>(0)
    const [couponStartDate, setCouponStartDate] = useState<Date>(new Date())
    const [couponEndDate, setCouponEndDate] = useState<Date>(new Date())
    const [couponExpireDate, setCouponExpireDate] = useState<Date>(new Date())
    const [couponStock, setCouponStock] = useState<number>(0)

    const handleAddCoupon = () => {
        // 쿠폰 등록 추가
        resetForm()
        // 쿠폰 다시 불러오기
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

    useEffect(() => {
        setCouponList([
            {
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
            },
            {
                id: 2,
                code: 1002,
                name: "봄맞이 특별 할인",
                description: "봄 시즌 한정 할인 쿠폰",
                price: 5000,
                startDate: "2025-03-01",
                endDate: "2025-05-31",
                expireDate: "2025-05-31",
                stock: 500,
                status: "inprogress"
            },
            {
                id: 3,
                code: 1003,
                name: "여름 휴가 시즌 할인",
                description: "여름 휴가철 특별 할인",
                price: 10000,
                startDate: "2025-07-01",
                endDate: "2025-08-31",
                expireDate: "2025-08-31",
                stock: 300,
                status: "previous"
            },
            {
                id: 4,
                code: 1004,
                name: "추석 명절 할인",
                description: "추석 맞이 특별 할인",
                price: 7000,
                startDate: "2025-09-15",
                endDate: "2025-09-30",
                expireDate: "2025-09-30",
                stock: 0,
                status: "ended"
            },
            {
                id: 5,
                code: 1005,
                name: "크리스마스 특별 할인",
                description: "연말 시즌 특별 할인",
                price: 15000,
                startDate: "2025-12-20",
                endDate: "2025-12-25",
                expireDate: "2025-12-25",
                stock: 200,
                status: "completed"
            },
            {
                id: 6,
                code: 1006,
                name: "첫 구매 감사 쿠폰",
                description: "첫 구매 고객 전용 쿠폰",
                price: 2000,
                startDate: "2025-01-01",
                endDate: "2025-12-31",
                expireDate: "2025-12-31",
                stock: 800,
                status: "inprogress"
            },
            {
                id: 7,
                code: 1007,
                name: "VIP 전용 할인",
                description: "VIP 회원 전용 특별 할인",
                price: 20000,
                startDate: "2025-06-01",
                endDate: "2025-06-30",
                expireDate: "2025-06-30",
                stock: 100,
                status: "completed"
            },
            {
                id: 8,
                code: 1008,
                name: "주말 특가 할인",
                description: "주말 한정 특별 할인",
                price: 5000,
                startDate: "2025-04-01",
                endDate: "2025-04-30",
                expireDate: "2025-04-30",
                stock: 400,
                status: "inprogress"
            },
            {
                id: 9,
                code: 1009,
                name: "출석체크 이벤트 쿠폰",
                description: "매일 출석체크 보상 쿠폰",
                price: 1000,
                startDate: "2025-01-01",
                endDate: "2025-12-31",
                expireDate: "2025-12-31",
                stock: 1500,
                status: "inprogress"
            },
            {
                id: 10,
                code: 1010,
                name: "친구 초대 이벤트 쿠폰",
                description: "친구 초대시 지급되는 쿠폰",
                price: 3000,
                startDate: "2025-05-01",
                endDate: "2025-05-31",
                expireDate: "2025-05-31",
                stock: 600,
                status: "previous"
            }
        ])
    }, [])

    return (
        <div className="flex flex-col mx-auto max-w-6xl w-full p-8">
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-medium">쿠폰 등록</h3>
                </div>
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
                        <button className="px-8 p-4 rounded-md bg-pink-100 text-pink-600">
                            등록
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-16">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-medium">쿠폰 목록</h3>
                    <div className="flex gap-4">
                        <select className="border rounded px-4 p-4">
                            <option selected>10개씩</option>
                            <option>20개씩</option>
                            <option>50개씩</option>
                        </select>
                        <select className="border rounded px-4 p-4">
                            <option selected>
                                <CouponTag status="previous" />
                            </option>
                            <option>
                                <CouponTag status="inprogress" />
                            </option>
                            <option>
                                <CouponTag status="completed" />
                            </option>
                            <option>
                                <CouponTag status="ended" />
                            </option>
                        </select>
                    </div>
                </div>

                <table className="w-full text-center">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 truncate max-w-0">이름</th>
                      <th className="p-4 w-[25%]">발급 기간</th>
                      <th className="p-4 w-[15%]">만료일</th>
                      <th className="p-4 w-[10%]">수량</th>
                      <th className="p-4 w-[10%]">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couponList.map((coupon) => (
                      <tr key={coupon.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{coupon.name}</td>
                        <td className="p-4">{coupon.startDate} ~ {coupon.endDate}</td>
                        <td className="p-4">{coupon.expireDate}</td>
                        <td className="p-4">{coupon.stock}</td>
                        <td className="p-4 flex justify-center"><CouponTag status={coupon.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-center gap-2 mt-8">
                    <button className="px-3 p-4">◀</button>
                    <button className="px-3 p-4 text-pink-500">1</button>
                    <button className="px-3 p-4">▶</button>
                </div>
            </div>
        </div>
    )
}

const CouponTag = ({ status }: { status: "previous" | "inprogress" | "completed" | "ended" }) => {
    const design = {
        previous: "bg-yellow-500",
        inprogress: "bg-green-500",
        completed: "bg-blue-500",
        ended: "bg-gray-500",
    }

    const message = {
        previous: "발급 전",
        inprogress: "발급 중",
        completed: "발급 완료",
        ended: "종료",
    }
    return <div className={clsx("px-2 py-1 text-sm text-white rounded-full w-18 text-center", design[status])}>
        <span>{message[status]}</span>
    </div>
}