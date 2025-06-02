"use client"

import Modal from "@/components/common/Modal"
import DaumPostcode from "react-daum-postcode"

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: any) => void
  closeOnOutsideClick?: boolean
}

export default function AddressModal({ isOpen, onClose, onComplete, closeOnOutsideClick = false }: AddressModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="주소 검색" closeOnOutsideClick={closeOnOutsideClick}>
      <DaumPostcode onComplete={onComplete} />
    </Modal>
  )
}
