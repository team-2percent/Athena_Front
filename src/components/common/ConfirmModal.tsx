"use client"

import Modal from "./Modal"

interface ConfirmModalProps {
  isOpen: boolean
  message: string
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmModal({ isOpen, message, onConfirm, onClose }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col gap-4 justify-center items-center">
        <p className="text-xl font-medium">{message}</p>
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-md bg-main-color text-white" onClick={onConfirm}>
            확인
          </button>
          <button className="px-4 py-2 rounded-md bg-cancel-background text-white" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </Modal>
  )
}
