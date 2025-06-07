"use client"

import Modal from "@/components/common/Modal"
import RealDaumPostcode from "react-daum-postcode"

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: any) => void
  closeOnOutsideClick?: boolean
}

// Cypress 환경 여부 판단
const isCypress = typeof window !== 'undefined' && window.Cypress;

function MockDaumPostcode({ onComplete }: { onComplete: (data: any) => void }) {
  return (
    <button
      data-cy="mock-postcode"
      onClick={() => onComplete({ address: '서울특별시 강남구 테헤란로 123', zonecode: '12345' })}
    >
      주소 선택 (Mock)
    </button>
  );
}

export default function AddressModal({ isOpen, onClose, onComplete, closeOnOutsideClick = false }: AddressModalProps) {

  // 조건부 컴포넌트 선택 (렌더 시점에 판단)
  const DaumPostcode = isCypress ? MockDaumPostcode : RealDaumPostcode;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="주소 검색" closeOnOutsideClick={closeOnOutsideClick} dataCy="address-search-modal">
      <DaumPostcode onComplete={onComplete} />
    </Modal>
  )
}
