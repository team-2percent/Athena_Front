"use client"

import { ThumbsUp } from "lucide-react"
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
        <div className="text-gray-500 mb-2">{reviewDate} 에 작성</div>
        <div className="whitespace-pre-wrap break-words">{reviewContent}</div>
      </div>
    </Modal>
  )
}
