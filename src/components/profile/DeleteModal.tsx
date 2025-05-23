"use client"
import Modal from "@/components/common/Modal"

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  deleteError: boolean
  deleteSuccess: boolean
  itemType?: string
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  deleteError,
  deleteSuccess,
  itemType = "상품",
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${itemType} 삭제`} size="sm">
      <div className="">
        {!deleteError && !deleteSuccess ? (
          <>
            <Modal.Text variant="body" className="mb-6">
              정말로 이 {itemType}을 삭제하시겠습니까?
            </Modal.Text>
            <div className="flex justify-end gap-4">
              <Modal.Button variant="secondary" onClick={onClose}>
                취소
              </Modal.Button>
              <Modal.Button variant="danger" onClick={onConfirm}>
                삭제
              </Modal.Button>
            </div>
          </>
        ) : deleteError ? (
          <>
            <Modal.Text variant="body" className="text-center mb-6">
              {itemType} 삭제에 실패했습니다.
            </Modal.Text>
            <div className="flex justify-end">
              <Modal.Button variant="primary" onClick={onClose}>
                확인
              </Modal.Button>
            </div>
          </>
        ) : (
          <>
            <Modal.Text variant="body" className="mb-6">
              {itemType}이 성공적으로 삭제되었습니다.
            </Modal.Text>
            <div className="flex justify-end">
              <Modal.Button variant="primary" onClick={onClose}>
                확인
              </Modal.Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
