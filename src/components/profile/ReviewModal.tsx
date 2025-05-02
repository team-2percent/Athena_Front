"use client"

import { useRef, useEffect } from "react"
import { X, ThumbsUp } from "lucide-react"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  reviewContent: string
  reviewDate: string
  likes: number
}

export default function ReviewModal({ isOpen, onClose, reviewContent, reviewDate, likes }: ReviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // ESC 키 누르면 모달 닫기
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={modalRef} className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-500">{reviewDate}</div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-5 w-5" />
              <span>{likes}</span>
            </div>
            <button type="button" onClick={onClose}>
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="whitespace-pre-wrap break-words">{reviewContent}</div>
      </div>
    </div>
  )
}
