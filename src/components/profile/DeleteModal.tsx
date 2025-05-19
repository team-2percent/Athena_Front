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
      <div className="p-6">
        {!deleteError && !deleteSuccess ? (
          <>
            <p className="text-center mb-6">정말로 이 {itemType}을 삭제하시겠습니까?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                취소
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </>
        ) : deleteError ? (
          <>
            <p className="text-center text-red-500 mb-6">{itemType} 삭제에 실패했습니다.</p>
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-main-color text-white rounded-lg hover:bg-secondary-color-dark transition-colors"
              >
                확인
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-center text-green-500 mb-6">{itemType}이 성공적으로 삭제되었습니다.</p>
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-main-color text-white rounded-lg hover:bg-secondary-color-dark transition-colors"
              >
                확인
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
