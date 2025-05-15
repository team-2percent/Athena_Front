import { CouponStatus, CouponStatusColor, CouponStatusType } from "@/lib/CouponConstant"
import clsx from "clsx"

export default function CouponTag({ status }: { status: CouponStatusType }) {
    return <div className={clsx("px-2 py-1 text-sm text-white rounded-full w-18 text-center", CouponStatusColor[status])}>
        <span>{CouponStatus[status]}</span>
    </div>
}