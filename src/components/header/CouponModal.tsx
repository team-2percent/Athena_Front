"use client"
import CouponList from "./CouponList"

interface CouponProps {
  isOpen: boolean
  onClose: () => void
}

export default function CouponModal({ isOpen, onClose }: CouponProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 클릭 시 닫음 */}
      <button type="button" className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* 모달 */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-left text-2xl font-bold">할인 쿠폰</h2>

        <div className="space-y-3">
          <CouponList />
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
