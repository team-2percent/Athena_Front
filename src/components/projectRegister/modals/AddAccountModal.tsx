import { useState } from "react"
import Modal from "../../common/Modal"

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
    const value = e.target.value.replace(/[^0-9]/g, "")
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
            예금주
          </label>
          <input
            id="accountHolder"
            type="text"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            placeholder="예금주 이름을 입력하세요"
            className={`w-full p-2 border-b ${focusedField === "accountHolder" ? "border-secondary-color-dark" : "border-gray-300"} ${errors.accountHolder ? "border-red-500" : ""} focus:outline-none text-lg`}
            onFocus={() => setFocusedField("accountHolder")}
            onBlur={() => setFocusedField(null)}
          />
          {errors.accountHolder && <p className="text-red-500 text-xs mt-1">예금주를 입력해주세요</p>}
        </div>
        {/* 은행명 */}
        <div>
          <label
            htmlFor="bankName"
            className={`text-sm ${focusedField === "bankName" ? "text-secondary-color-dark" : "text-main-color"}`}
          >
            은행명
          </label>
          <input
            id="bankName"
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="은행명을 입력하세요"
            className={`w-full p-2 border-b ${focusedField === "bankName" ? "border-secondary-color-dark" : "border-gray-300"} ${errors.bankName ? "border-red-500" : ""} focus:outline-none text-lg`}
            onFocus={() => setFocusedField("bankName")}
            onBlur={() => setFocusedField(null)}
          />
          {errors.bankName && <p className="text-red-500 text-xs mt-1">은행명을 입력해주세요</p>}
        </div>
        {/* 계좌번호 */}
        <div>
          <label
            htmlFor="accountNumber"
            className={`text-sm ${focusedField === "accountNumber" ? "text-secondary-color-dark" : "text-main-color"}`}
          >
            계좌번호
          </label>
          <input
            id="accountNumber"
            type="text"
            value={accountNumber}
            onChange={handleAccountNumberChange}
            placeholder="계좌번호를 입력하세요 ('-' 없이 숫자만)"
            className={`w-full p-2 border-b ${focusedField === "accountNumber" ? "border-secondary-color-dark" : "border-gray-300"} ${errors.accountNumber ? "border-red-500" : ""} focus:outline-none text-lg`}
            onFocus={() => setFocusedField("accountNumber")}
            onBlur={() => setFocusedField(null)}
          />
          {errors.accountNumber && <p className="text-red-500 text-xs mt-1">계좌번호를 입력해주세요</p>}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-main-color hover:bg-secondary-color-dark text-white font-bold py-2 px-6 rounded-full"
        >
          추가하기
        </button>
      </div>
    </Modal>
  )
} 