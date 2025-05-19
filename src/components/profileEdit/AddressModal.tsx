"use client"

import Modal from "@/components/common/Modal"
import DaumPostcode from "react-daum-postcode"

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: any) => void
}

export default function AddressModal({ isOpen, onClose, onComplete }: AddressModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false}>
      <DaumPostcode onComplete={onComplete} />
    </Modal>
  )
}
