"use client"

import SettlementTag from "@/components/admin/SettlementTag"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function SettlementPage() {

    const router = useRouter();

    const [settlementList, setSettlementList] = useState<any[]>([])
    const [state, setState] = useState<"all" |"pending" | "completed" | "failed">("all")
    const [year, setYear] = useState<number>(0)
    const [month, setMonth] = useState<number>(0)

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "0") {
            setYear(0)
            setMonth(0)
        } else {
            setYear(Number(e.target.value))
        }
    }

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "0") {
            setMonth(0)
        } else {
            setMonth(Number(e.target.value))
        }
    }

    useEffect(() => {
        setSettlementList([
            {
                id: 1,
                projectName: "프로젝트 1",
                totalAmount: 1000000,
                fee: 10000,
                status: "pending",
                seller: "판매자 1",
                settlementDate: "2023.06.01 15:00",
            },
            {
                id: 2,
                projectName: "프로젝트 2",
                totalAmount: 1000000,
                fee: 10000,
                status: "pending",
                seller: "판매자 2",
                settlementDate: "2023.06.01 15:00",
            },
            {
                id: 3,
                projectName: "프로젝트 3",
                totalAmount: 1000000,
                fee: 10000,
                status: "completed",
                seller: "판매자 3",
                settlementDate: "2023.05.01 15:00",
            },
        ])
    }, [])

    return (
        <div className="flex flex-col mx-auto w-full p-8 gap-6">
            <h3 className="text-xl font-medium mb-8">확인해야할 정산 내역이 {settlementList.length}건 있습니다.</h3>
            <div className="flex gap-4">
                <div className="relative">
                    <select className="border rounded px-4 py-2" onChange={(e) => setState(e.target.value as "all" | "pending" | "completed" | "failed")}>
                        <option value="all">상태 전체</option>
                        <option value="pending">미정산</option>
                        <option value="completed">정산 완료</option>
                        <option value="failed">정산 실패</option>
                    </select>
                </div>
                <div className="relative">
                    <select className="border rounded px-4 py-2" onChange={handleYearChange}>
                        <option value={0}>년도 전체</option>
                        {Array.from({ length: new Date().getFullYear() - 2024 }, (_, i) => (
                            <option key={2025 + i} value={2025 + i}>{2025 + i}년</option>
                        ))}
                    </select>
                </div>
                {
                    year !== 0 &&
                    <div className="relative">
                        <select className="border rounded px-4 py-2" onChange={handleMonthChange}>
                            <option value={0}>월 전체</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}월</option>
                            ))}
                        </select>
                    </div>
                }
            </div>

            <div className="w-full">
                <table className="w-full border-collapse text-center">
                    <thead>
                        <tr className="bg-gray-50 text-sm">
                            <th className="border-b p-4 text-left">프로젝트</th>
                            <th className="border-b p-4 w-[10%]">총 금액</th>
                            <th className="border-b p-4 w-[10%]">수수료</th>
                            <th className="border-b p-4 w-[10%]">지급 금액</th>
                            <th className="border-b p-4 w-[10%]">판매자</th>
                            <th className="border-b p-4 w-[15%]">정산날짜</th>
                            <th className="border-b p-4 w-[5%]">정산 상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {settlementList.map((settlement) => (
                            <tr key={settlement.id}className="text-sm" onClick={() => router.push(`/admin/settlement/${settlement.id}`)}>
                                <td className="border-b p-4 text-left">{settlement.projectName}</td>
                                <td className="border-b p-4">{settlement.totalAmount}</td>
                                <td className="border-b p-4">{settlement.fee}</td>
                                <td className="border-b p-4">{settlement.totalAmount - settlement.fee}</td>
                                <td className="border-b p-4">{settlement.seller}</td>
                                <td className="border-b p-4">{settlement.settlementDate}</td>
                                <td className="border-b p-4 flex justify-center"><SettlementTag status={settlement.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-2">
                <button className="px-3 py-2">◀</button>
                <button className="px-3 py-2 text-main-color">1</button>
                <button className="px-3 py-2">▶</button>
            </div>
        </div>
    )
}