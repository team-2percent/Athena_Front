"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Trash2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  deleteError: boolean
  deleteSuccess: boolean
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  deleteError,
  deleteSuccess,
}: DeleteModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  const getContent = () => {
    if (deleteError) {
      return <DeleteErrorModal onClose={onClose} />
    } else if (deleteSuccess) {
      return <DeleteSuccessModal onClose={onClose} />
    } else {
      return <DeleteConfirmModal onClose={onClose} onConfirm={() => onConfirm?.()} />
    }
  }

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0",
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "w-80 bg-white rounded-lg shadow-lg transform transition-transform duration-200",
          isOpen ? "scale-100" : "scale-95",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex flex-col items-center text-center">
            {
                getContent()
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const DeleteConfirmModal = ({onClose, onConfirm}: {onClose: () => void, onConfirm: () => void}) => <>
    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
    <Trash2 className="w-6 h-6 text-red-500" />
    </div>
    <h3 className="text-lg font-medium mb-4">삭제하시겠습니까?</h3>
    <div className="flex gap-3 w-full">
    <button
        className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        onClick={onClose}
    >
        취소
    </button>
    <button
        className="flex-1 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        onClick={onConfirm}
    >
        삭제
    </button>
    </div>
</>

const DeleteErrorModal = ({onClose}: {onClose: () => void}) => <>
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <XCircle className="w-8 h-8 text-gray-500" />
    </div>
    <h3 className="text-lg font-medium mb-4">삭제할 수 없는 상품입니다.</h3>
    <button
        className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        onClick={onClose}
    >
        닫기
    </button>
</>

const DeleteSuccessModal = ({onClose}: {onClose: () => void}) => <> 
    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle className="w-6 h-6 text-green-500" />
    </div>
    <h3 className="text-lg font-medium mb-4">삭제되었습니다.</h3>
    <button
        className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        onClick={onClose}
    >
        닫기
    </button>
</>