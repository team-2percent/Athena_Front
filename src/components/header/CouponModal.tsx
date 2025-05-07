"use client"
import clsx from "clsx"
import { Percent } from "lucide-react"

interface CouponProps {
  isOpen: boolean
  onClose: () => void
}

export default function CouponModal({ isOpen, onClose }: CouponProps) {
  if (!isOpen) return null

  // mock data: 쿠폰 데이터 추후 삭제
  const coupons = [
    {
      id: 1,
      amount: "1000000원",
      title: "~~~~ 쿠폰",
      description:
        "쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다.",
      validUntil: "2023-5-12까지 사용가능",
      received: false,
    },
    {
      id: 2,
      amount: "1000000원",
      title: "~~~~ 쿠폰",
      description:
        "쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다.",
      validUntil: "2023-5-12까지 사용가능",
      received: false,
    },
    {
      id: 3,
      amount: "1000000원",
      title: "~~~~ 쿠폰",
      description:
        "쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다.",
      validUntil: "2023-5-12까지 사용가능",
      received: true,
    },
    {
      id: 4,
      amount: "1000000원",
      title: "~~~~ 쿠폰",
      description:
        "쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다. 쿠폰 설명입니다.",
      validUntil: "2023-5-12까지 사용가능",
      received: true,
    },
  ]

  const handleGetCoupon = (couponId: number) => {
    // 쿠폰 발급 로직 추후 추가
    console.log(`쿠폰 ${couponId} 발급됨`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 클릭 시 닫음 */}
      <button type="button" className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* 모달 */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-left text-2xl font-bold">할인 쿠폰</h2>

        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={clsx("flex h-10 w-10 items-center justify-center rounded-md text-white", coupon.received ? "bg-[#B3B3B3]" : "bg-[#FF0040]")}>
                    <Percent className="h-5 w-5" />
                  </div>
                  <div>
                    <div className={clsx("text-lg font-bold", coupon.received ? "text-[#B3B3B3]" : "text-[#FF0040]")}>{coupon.amount}</div>
                    <div className="text-sm font-medium">{coupon.title}</div>
                  </div>
                </div>
                <button
                    type="button"
                    className={clsx("rounded-full px-4 py-1.5 text-sm font-medium", coupon.received ? "bg-[#B3B3B3]" : "bg-[#FF0040] text-white")}
                    onClick={() => handleGetCoupon(coupon.id)}
                >
                  {coupon.received ? "발급완료" : "발급받기"}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-600">{coupon.description}</p>
              <p className="mt-0.5 text-xs text-gray-500">{coupon.validUntil}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-full bg-pink-200 px-6 py-2 text-sm font-medium text-pink-800">
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
