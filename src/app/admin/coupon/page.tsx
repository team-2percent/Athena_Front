"use client"

import DatePicker from "@/components/projectRegister/DatePicker"
import { useEffect, useState } from "react"
import CouponTag from "@/components/admin/CouponTag"
import { useRouter } from "next/navigation"

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
    const router = useRouter()
    const [status, getStatus] = useState<"all" | "previous" | "inprogress" | "completed" | "ended">("all")
    const [pageSize, getPageSize] = useState<number>(10)
    const [currentPage, getCurrentPage] = useState<number>(1)
    const [couponList, setCouponList] = useState<Coupon[]>([])

    useEffect(() => {
        setCouponList([
            {
                id: 1,
                code: 1001,
                name: "신규 가입 할인 쿠폰",
                description: "신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다신규 회원 전용 할인 쿠폰입니다",
                price: 3000,
                startDate: "2025-06-01",
                endDate: "2025-12-31", 
                expireDate: "2025-12-31",
                stock: 1000,
                status: "previous"
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
        <div className="flex flex-col mx-auto w-full p-8">
            <div className="flex justify-between items-center mb-8 border-b pb-2">
                <h2 className="text-2xl font-medium">쿠폰 목록</h2>
                <div className="flex gap-4">
                    <select className="border rounded px-4 py-2">
                    <option value="10">10개씩</option>
                        <option value="20">20개씩</option>
                        <option value="50">50개씩</option>
                    </select>
                    <select className="border rounded px-4 py-2">
                        <option value="all">전체</option>
                        <option value="previous">
                            발급 전
                        </option>
                        <option value="inprogress">
                            발급 중
                        </option>
                        <option value="completed">
                            발급 완료
                        </option>
                        <option value="ended">
                            종료
                        </option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <button
                    className="px-4 py-2 rounded-md text-main-color"
                    onClick={() => router.push("/admin/coupon/register")}
                >
                    + 쿠폰 등록
                </button>
            </div>

            <table className="w-full text-center">
                <thead>
                <tr className="border-b">
                    <th className="p-4 truncate max-w-0 text-left">이름</th>
                    <th className="p-4 w-[20%]">발급 기간</th>
                    <th className="p-4 w-[10%]">만료일</th>
                    <th className="p-4 w-[7%]">수량</th>
                    <th className="p-4 w-[10%]">상태</th>
                </tr>
                </thead>
                <tbody>
                {couponList.map((coupon) => (
                    <tr
                    key={coupon.id} 
                    className="border-b hover:bg-gray-50"
                    onClick={() => router.push(`/admin/coupon/${coupon.id}`)}
                    >
                    <td className="p-4 text-left">{coupon.name}</td>
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
                <button className="px-3 p-4 text-main-color">1</button>
                <button className="px-3 p-4">▶</button>
            </div>

            
        </div>
    )
}