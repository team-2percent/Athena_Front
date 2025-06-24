import { useState } from "react"
import Modal from "../../common/Modal"
import { TextInput } from "@/components/common/Input"
import { PrimaryButton } from "@/components/common/Button"

interface AddAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (account: { accountHolder: string; bankName: string; bankAccount: string }) => void
}

export default function AddAccountModal({ isOpen, onClose, onSave }: AddAccountModalProps) {
  const [accountHolder, setAccountHolder] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    accountHolder: false,
    bankName: false,
    accountNumber: false,
  })

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "")
    if (value.length > 50) value = value.slice(0, 50)
    setAccountNumber(value)
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ accountHolder, bankName, bankAccount: accountNumber })
      onClose()
    }
  }

  function validateForm() {
    const newErrors = {
      accountHolder: accountHolder.trim() === "",
      bankName: bankName.trim() === "",
      accountNumber: accountNumber.trim() === "",
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="계좌 추가"
      size="md"
      className="max-w-md"
      zIndex={100}
      dataCy="add-account-modal"
    >
      <div className="space-y-4">
        {/* 예금주 */}
        <div>
          <label
            htmlFor="accountHolder"
            className={`text-sm ${focusedField === "accountHolder" ? "text-secondary-color-dark" : "text-main-color"}`}
          >
            예금주 (50자 이하)
          </label>
          <TextInput
            id="accountHolder"
            value={accountHolder}
            onChange={(e) => {
              if (e.target.value.length <= 50) setAccountHolder(e.target.value)
            }}
            placeholder="예금주 이름을 입력하세요"
            className={`w-full p-2 text-lg ${errors.accountHolder ? "border-b border-red-500" : "border-b border-gray-300"}`}
            designType="underline"
          />
          {errors.accountHolder && <p className="text-red-500 text-xs mt-1">예금주를 입력해주세요</p>}
        </div>
        {/* 은행명 */}
        <div>
          <label
            htmlFor="bankName"
            className={`text-sm ${focusedField === "bankName" ? "text-secondary-color-dark" : "text-main-color"}`}
          >
            은행명 (50자 이하)
          </label>
          <TextInput
            id="bankName"
            value={bankName}
            onChange={(e) => {
              if (e.target.value.length <= 50) setBankName(e.target.value)
            }}
            placeholder="은행명을 입력하세요"
            className={`w-full p-2 text-lg ${errors.bankName ? "border-b border-red-500" : "border-b border-gray-300"}`}
            designType="underline"
          />
          {errors.bankName && <p className="text-red-500 text-xs mt-1">은행명을 입력해주세요</p>}
        </div>
        {/* 계좌번호 */}
        <div>
          <label
            htmlFor="accountNumber"
            className={`text-sm ${focusedField === "accountNumber" ? "text-secondary-color-dark" : "text-main-color"}`}
          >
            계좌번호 (50자 이하)
          </label>
          <TextInput
            id="accountNumber"
            value={accountNumber}
            onChange={handleAccountNumberChange}
            placeholder="계좌번호를 입력하세요 ('-' 없이 숫자만)"
            className={`w-full p-2 text-lg ${errors.accountNumber ? "border-b border-red-500" : "border-b border-gray-300"}`}
            designType="underline"
          />
          {errors.accountNumber && <p className="text-red-500 text-xs mt-1">계좌번호를 입력해주세요</p>}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <PrimaryButton  
          onClick={handleSubmit}
          className="py-2 px-6 rounded-full"
        >
          추가하기
        </PrimaryButton>
      </div>
    </Modal>
  )
} 