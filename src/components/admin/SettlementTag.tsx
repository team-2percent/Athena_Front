import clsx from "clsx"

export default function SettlementTag({ status }: { status: "PENDING" | "COMPLETED" | "FAILED" }) {
    const design = {
        PENDING: "bg-yellow-500",
        COMPLETED: "bg-gray-500",
        FAILED: "bg-red-500",
    }

    const message = {
        PENDING: "미정산",
        COMPLETED: "정산 완료",
        FAILED: "정산 실패",
    }
    return <div className={clsx("px-2 py-1 text-sm text-white rounded-full w-18 text-center", design[status])}>
        <span>{message[status]}</span>
    </div>
}