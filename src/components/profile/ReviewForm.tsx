"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { X } from "lucide-react"

interface ReviewFormProps {
  isOpen: boolean
  onClose: () => void
  projectId: number
  projectName: string
  sellerName: string
}

export default function ReviewForm({ isOpen, onClose, projectId, projectName, sellerName }: ReviewFormProps) {
  const [reviewContent, setReviewContent] = useState("")
  const modalRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  // 모달 뒷배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden"
      // 텍스트 영역에 포커스
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }

    return () => {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!reviewContent.trim()) {
      alert("후기 내용을 입력해주세요.")
      return
    }

    // 여기서 후기 제출 API 호출
    console.log("후기 제출:", {
      projectId,
      content: reviewContent,
    })

    // 성공 시 모달 닫기
    alert("후기가 등록되었습니다.")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={modalRef} className="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">후기 작성</h2>
          <button type="button" onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="font-medium">{projectName}</p>
          <p className="text-sub-gray text-sm">{sellerName}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              ref={textareaRef}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:border-none focus:outline-none focus:ring-2 focus:ring-main-color"
              placeholder="상품에 대한 후기를 작성해주세요."
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-main-color text-white rounded-lg hover:bg-secondary-color-dark transition-colors"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
