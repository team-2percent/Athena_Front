"use client"
import Modal from "@/components/common/Modal"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  reviewContent: string
  reviewDate: string
}

export default function ReviewModal({ isOpen, onClose, reviewContent, reviewDate }: ReviewModalProps) {
  return (
    <Modal title="후기 상세 보기" isOpen={isOpen} onClose={onClose} size="lg" closeOnOutsideClick closeOnEsc>
      <div className="p-2">
        <Modal.Text variant="caption" className="mb-2">
          {reviewDate} 에 작성
        </Modal.Text>
        <Modal.Text variant="body" className="whitespace-pre-wrap break-words">
          {reviewContent}
        </Modal.Text>
      </div>
    </Modal>
  )
}
