import clsx from "clsx"

export default function SettlementTag({ status }: { status: "pending" | "completed" | "failed" }) {
    const design = {
        pending: "bg-pink-500",
        completed: "bg-gray-500",
        failed: "bg-red-500",
    }

    const message = {
        pending: "미정산",
        completed: "정산 완료",
        failed: "정산 실패",
    }
    return <div className={clsx("px-2 py-1 text-sm text-white rounded-full w-18 text-center", design[status])}>
        <span>{message[status]}</span>
    </div>
}