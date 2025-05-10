import clsx from "clsx"

export default function CouponTag({ status }: { status: "previous" | "inprogress" | "completed" | "ended" }) {
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