"use client"
import { useApi } from "@/hooks/useApi"
import clsx from "clsx"
import { Percent } from "lucide-react"
import { useEffect, useState } from "react"
import { CouponEvent } from "@/lib/couponInterface"
import EmptyMessage from "../common/EmptyMessage"
import Spinner from "../common/Spinner"

interface CouponProps {
  isOpen: boolean
  onClose: () => void
}

export default function CouponModal({ isOpen, onClose }: CouponProps) {
  if (!isOpen) return null
  const { apiCall, isLoading } = useApi();
  const [coupons, setCoupons] = useState<CouponEvent[]>([]);

  const handleGetCoupon = (couponId: number) => {
    apiCall("/api/userCoupon", "POST", { couponId }).then(() => {
      loadCoupons()
    })
  }

  const loadCoupons = () => {
    apiCall("/api/couponEvent/getActives", "GET").then(({ data }) => {
      if (data) {
        setCoupons(data as CouponEvent[])
      }
    });
  }

  const renderCoupons = () => {
    if (isLoading) {
      return <Spinner message="쿠폰 목록을 불러오고 있습니다."/>
    } else if (coupons.length === 0) {
      return <EmptyMessage message="발급 가능한 쿠폰이 없습니다." />
    } else {
      return coupons.map((coupon) => (
        <div key={coupon.id} className="rounded-xl border p-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className={clsx("flex h-10 w-10 items-center justify-center rounded-md text-white", coupon.userIssued ? "bg-disabled-background" : "bg-main-color")}>
                <Percent className="h-5 w-5" />
              </div>
              <div>
                <div className={clsx("text-lg font-bold", coupon.userIssued ? "text-disabled-color" : "text-main-color")}>{coupon.price} 원</div>
                <div className="text-sm font-medium">{coupon.title}</div>
              </div>
              </div>
              <p className="mt-1 text-xs text-sub-gray">{coupon.content}</p>
              <p className="mt-0.5 text-xs text-sub-gray">{new Date(coupon.expires).toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'}).replace(/\//g, '.').replace(',', '') + ' 만료'}</p>
            </div>
            <div className="flex flex-col items-end">
              <button
                  type="button"
                  className={clsx("rounded-full w-fit px-4 py-1.5 text-sm font-medium", coupon.userIssued ? "bg-disabled-background text-disabled-color" : "bg-main-color text-white")}
                  onClick={() => handleGetCoupon(coupon.id)}
              >
                {coupon.userIssued ? "발급완료" : "발급받기"}
              </button>
              <div className="mt-1 text-xs text-sub-gray">
                {coupon.stock}개 남음
              </div>
            </div>
          </div>
        </div>
      ))
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 클릭 시 닫음 */}
      <button type="button" className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* 모달 */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-left text-2xl font-bold">할인 쿠폰</h2>

        <div className="space-y-3">
          {renderCoupons()}
        </div>

        <div className="mt-4 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-full px-6 py-2 text-sm font-medium text-main-color border border-main-color hover:bg-secondary-color">
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
