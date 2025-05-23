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
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="확인">
      <div className="flex flex-col gap-4">
        <Modal.Text variant="body">{message}</Modal.Text>
        <div className="flex gap-4 justify-end">
          <Modal.Button variant="secondary" onClick={onClose}>
            취소
          </Modal.Button>
          <Modal.Button variant="primary" onClick={onConfirm}>
            확인
          </Modal.Button>
        </div>
      </div>
    </Modal>
  )
}
