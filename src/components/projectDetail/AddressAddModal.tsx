import Modal from "../common/Modal"
import { CancelButton, PrimaryButton, SecondaryButton } from "../common/Button"
import { X } from "lucide-react"
import AddressModal from "../profileEdit/AddressModal"

interface AddressAddModalProps {
  isOpen: boolean
  onClose: () => void
  newAddress: {
    address: string
    detailAddress: string
    zipcode: string
  }
  setNewAddress: (addr: { address: string; detailAddress: string; zipcode: string }) => void
  isAddressModalOpen: boolean
  setIsAddressModalOpen: (open: boolean) => void
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "address" | "detailAddress" | "zipcode"
  ) => void
  handleComplete: (data: any) => void
  saveNewAddress: () => void
}

const AddressAddModal = ({
  isOpen,
  onClose,
  newAddress,
  setNewAddress,
  isAddressModalOpen,
  setIsAddressModalOpen,
  handleInputChange,
  handleComplete,
  saveNewAddress,
}: AddressAddModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={false}
      className="rounded-2xl p-6 shadow-xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-bold">새 배송지 추가</h4>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-sub-gray mb-2">주소</label>
          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-border rounded-lg"
              placeholder="'찾기'를 눌러서 주소 입력"
              value={newAddress.address}
              readOnly
            />
            <SecondaryButton
              type="button"
              className="px-4 py-3 rounded-lg"
              onClick={() => setIsAddressModalOpen(true)}
            >
              찾기
            </SecondaryButton>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-sub-gray mb-2">상세 주소</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-border rounded-lg"
            placeholder="상세 주소 입력"
            value={newAddress.detailAddress}
            onChange={(e) => handleInputChange(e, "detailAddress")}
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <CancelButton
            type="button"
            className="px-6 py-3 rounded-lg"
            onClick={onClose}
          >
            취소
          </CancelButton>
          <PrimaryButton
            type="button"
            className="px-6 py-3 bg-main-color text-white rounded-lg"
            onClick={saveNewAddress}
          >
            저장
          </PrimaryButton>
        </div>
      </div>
      {/* 배송지 주소 검색 모달 */}
      {isAddressModalOpen && (
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onComplete={handleComplete}
          closeOnOutsideClick={false}
        />
      )}
    </Modal>
  )
}

export default AddressAddModal 