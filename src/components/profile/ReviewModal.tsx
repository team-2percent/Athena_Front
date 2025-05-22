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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnOutsideClick closeOnEsc>
      <div className="p-2">
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-500">{reviewDate}</div>
        </div>

        <div className="whitespace-pre-wrap break-words">{reviewContent}</div>
      </div>
    </Modal>
  )
}
