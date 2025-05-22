"use client"

import Modal from "@/components/common/Modal"
import CouponList from "./CouponList"

interface CouponProps {
  isOpen: boolean
  onClose: () => void
}

export default function CouponModal({ isOpen, onClose }: CouponProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="할인 쿠폰" size="lg">
      <div className="space-y-3 max-h-120 overflow-y-auto">
        <CouponList />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-6 py-2 text-sm font-medium text-main-color border border-main-color hover:bg-secondary-color"
        >
          닫기
        </button>
      </div>
    </Modal>
  )
}
