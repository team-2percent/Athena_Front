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
        <Modal.Button variant="outline" onClick={onClose}>
          닫기
        </Modal.Button>
      </div>
    </Modal>
  )
}
