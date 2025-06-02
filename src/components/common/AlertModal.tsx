"use client"
import Modal from "./Modal"

interface AlertModalProps {
  isOpen: boolean
  message: string
  onClose: () => void
}

export default function AlertModal({ isOpen, message, onClose }: AlertModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="알림" size="sm" zIndex={60}>
        <Modal.Text>{message}</Modal.Text>
        <div className="mt-6 flex justify-end">
          <Modal.Button onClick={onClose}>확인</Modal.Button>
        </div>
    </Modal>
  )
}
