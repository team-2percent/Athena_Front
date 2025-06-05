"use client"

import { UserCoupon } from "@/lib/couponInterface";
import clsx from "clsx";
import { Percent } from "lucide-react";

export default function CouponList({ coupons }: { coupons: UserCoupon[] }) {

    const couponStateMessage = (state: string, expiredDate: string) => {
        const expiredDateString = new Date(expiredDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        if (state === "UNUSED") {
          return `${expiredDateString}까지 사용가능`
        } else if (state === "USED") {
          return "사용완료"
        } else if (state === "EXPIRED") {
          return `${expiredDateString} 만료`
        }
    }

    return (
        <div className="flex flex-col gap-3 sm:gap-4">
          {coupons.map((coupon) => (
          <div className="rounded-xl sm:rounded-2xl border border-gray-border flex overflow-hidden min-h-[72px] sm:min-h-[100px]" key={coupon.id}  data-cy="coupon-list">
            {/* 왼쪽: 퍼센트 아이콘 */}
            <div className={clsx("relative min-w-[48px] sm:min-w-[70px] flex items-stretch", coupon.status === "UNUSED" ? "bg-main-color" : "bg-disabled-background")}> 
              <div className="flex flex-col justify-center h-full w-full">
                <div className="relative flex items-center justify-center h-[72px] sm:h-[100px] w-[48px] sm:w-[70px]">
                  <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full translate-x-1/2 translate-y-[-50%]"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full translate-x-1/2 translate-y-[50%]"></div>
                  <Percent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
            </div>
      
            {/* 중앙: 쿠폰 제목 및 설명 */}
            <div className="flex-1 p-2 sm:p-4 flex flex-col justify-center">
              <h3 className="text-base sm:text-lg font-bold"  data-cy="coupon-title">{coupon.title}</h3>
              <p className="text-xs sm:text-sm text-sub-gray mt-1" data-cy="coupon-content">{coupon.content}</p>
            </div>
      
            {/* 구분선 */}
            <div className="w-0 border-l border-dashed border-gray-border my-2 sm:my-4"></div>
      
            {/* 오른쪽: 금액 및 유효기간 */}
            <div className="p-2 sm:p-4 flex flex-col justify-center items-end w-28 sm:w-60">
              <p className={clsx("text-base sm:text-xl font-bold", coupon.status === "UNUSED" ? "text-main-color" : "text-disabled-text")} data-cy="coupon-price">{coupon.price} 원</p>
              <p className="text-[10px] sm:text-xs text-sub-gray mt-1 text-right w-full" data-cy="coupon-status">
                {couponStateMessage(coupon.status, coupon.expires)}
              </p>
            </div>
          </div>
        ))}
        </div>
    )
}