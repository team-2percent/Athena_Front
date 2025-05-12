"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, Plus, Check, X, Trash2 } from "lucide-react"

// 계좌 정보 타입 정의
interface BankAccount {
  id: number
  accountHolder: string // 예금주
  bankName: string // 은행명
  accountNumber: string // 계좌번호
  isDefault?: boolean // 기본 계좌 여부
}

// 계좌 추가 모달 컴포넌트
interface AddAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (account: Omit<BankAccount, "id" | "isDefault">) => void
}

const AddAccountModal = ({ isOpen, onClose, onSave }: AddAccountModalProps) => {
  const [accountHolder, setAccountHolder] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    accountHolder: false,
    bankName: false,
    accountNumber: false,
  })

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors = {
      accountHolder: accountHolder.trim() === "",
      bankName: bankName.trim() === "",
      accountNumber: accountNumber.trim() === "",
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        accountHolder,
        bankName,
        accountNumber,
      })

      // 입력 필드 초기화
      setAccountHolder("")
      setBankName("")
      setAccountNumber("")
      setErrors({
        accountHolder: false,
        bankName: false,
        accountNumber: false,
      })

      onClose()
    }
  }

  // 계좌번호 입력 처리 함수 추가 (AddAccountModal 컴포넌트 내부)
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력 가능하도록 처리
    const value = e.target.value.replace(/[^0-9]/g, "")
    setAccountNumber(value)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* 모달 */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">계좌 추가</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* 예금주 */}
          <div>
            <label
              htmlFor="accountHolder"
              className={`text-sm ${focusedField === "accountHolder" ? "text-pink-500" : "text-pink-400"}`}
            >
              예금주
            </label>
            <input
              id="accountHolder"
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="예금주 이름을 입력하세요"
              className={`w-full p-2 border-b ${
                focusedField === "accountHolder" ? "border-pink-500" : "border-gray-300"
              } ${errors.accountHolder ? "border-red-500" : ""} focus:outline-none text-lg`}
              onFocus={() => setFocusedField("accountHolder")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.accountHolder && <p className="text-red-500 text-xs mt-1">예금주를 입력해주세요</p>}
          </div>

          {/* 은행명 */}
          <div>
            <label
              htmlFor="bankName"
              className={`text-sm ${focusedField === "bankName" ? "text-pink-500" : "text-pink-400"}`}
            >
              은행명
            </label>
            <input
              id="bankName"
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="은행명을 입력하세요"
              className={`w-full p-2 border-b ${
                focusedField === "bankName" ? "border-pink-500" : "border-gray-300"
              } ${errors.bankName ? "border-red-500" : ""} focus:outline-none text-lg`}
              onFocus={() => setFocusedField("bankName")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.bankName && <p className="text-red-500 text-xs mt-1">은행명을 입력해주세요</p>}
          </div>

          {/* 계좌번호 */}
          <div>
            <label
              htmlFor="accountNumber"
              className={`text-sm ${focusedField === "accountNumber" ? "text-pink-500" : "text-pink-400"}`}
            >
              계좌번호
            </label>
            <input
              id="accountNumber"
              type="text"
              value={accountNumber}
              onChange={handleAccountNumberChange}
              placeholder="계좌번호를 입력하세요 ('-' 없이 숫자만)"
              className={`w-full p-2 border-b ${
                focusedField === "accountNumber" ? "border-pink-500" : "border-gray-300"
              } ${errors.accountNumber ? "border-red-500" : ""} focus:outline-none text-lg`}
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
            className="bg-pink-300 text-[#8B1D3F] font-bold py-2 px-6 rounded-full"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  )
}

interface StepThreeFormProps {
  initialData?: {
    teamName?: string
    teamIntro?: string
    teamImagePreview?: string | null
  }
}

export default function StepThreeForm({ initialData }: StepThreeFormProps) {
  const [teamName, setTeamName] = useState(initialData?.teamName || "")
  const [teamIntro, setTeamIntro] = useState(initialData?.teamIntro || "")
  const [teamImage, setTeamImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.teamImagePreview || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 계좌 관련 상태
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null)
  const [useAccountNextTime, setUseAccountNextTime] = useState(false)
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false)

  // 샘플 계좌 목록 (실제로는 API에서 가져올 데이터)
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: 1,
      accountHolder: "홍길동",
      bankName: "신한은행",
      accountNumber: "110123456789",
      isDefault: true,
    },
    {
      id: 2,
      accountHolder: "김철수",
      bankName: "국민은행",
      accountNumber: "45612378910",
      isDefault: false,
    },
  ])

  // 초기 계좌 선택
  useEffect(() => {
    // 기본 계좌가 있으면 선택
    const defaultAccount = accounts.find((account) => account.isDefault)
    if (defaultAccount) {
      setSelectedAccountId(defaultAccount.id)
    } else if (accounts.length > 0) {
      // 기본 계좌가 없으면 첫 번째 계좌 선택
      setSelectedAccountId(accounts[0].id)
    }
  }, [])

  // 계좌 추가 처리
  const handleAddAccount = (account: Omit<BankAccount, "id" | "isDefault">) => {
    const newAccount: BankAccount = {
      ...account,
      id: accounts.length > 0 ? Math.max(...accounts.map((a) => a.id)) + 1 : 1,
      isDefault: false,
    }

    setAccounts([...accounts, newAccount])
    setSelectedAccountId(newAccount.id) // 새로 추가한 계좌 선택
  }

  // 계좌 선택 처리
  const handleSelectAccount = (id: number) => {
    setSelectedAccountId(id)
  }

  // 계좌 삭제 처리 (StepThreeForm 컴포넌트 내부)
  const handleDeleteAccount = (id: number, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지

    // 선택된 계좌를 삭제하는 경우 선택 상태 초기화
    if (selectedAccountId === id) {
      setSelectedAccountId(null)
      setUseAccountNextTime(false)
    }

    setAccounts(accounts.filter((account) => account.id !== id))
  }

  // 파일 선택 버튼 클릭 핸들러
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // 파일 입력 변경 핸들러
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith("image/")) return

    setTeamImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  // 이미지 삭제 핸들러
  const handleRemoveImage = () => {
    if (imagePreview && !initialData?.teamImagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setTeamImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-8">
      {/* 본인(팀) 이름 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <label htmlFor="teamName" className="text-xl font-bold mb-4">
          본인(팀) 이름
        </label>
        <div className="w-full">
          <input
            id="teamName"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="본인(팀) 이름을 입력해 주세요."
            className="w-full rounded-full border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 본인(팀) 소개 이미지 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <label htmlFor="teamImage" className="text-xl font-bold mb-4">
          본인(팀) 소개 이미지
        </label>
        <div className="w-full">
          <div className="rounded-3xl border border-gray-300 p-6">
            <div className="flex flex-col md:flex-row">
              {/* 이미지 미리보기 영역 */}
              <div className="h-60 w-full md:w-60 bg-gray-200 rounded-lg flex items-center justify-center mb-4 md:mb-0 md:mr-6 relative">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="팀 소개 이미지"
                      className="h-full w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </>
                ) : (
                  <div className="text-gray-400 text-center">
                    <Upload className="h-10 w-10 mx-auto mb-2" />
                    <p>이미지 없음</p>
                  </div>
                )}
              </div>

              {/* 업로드 버튼 및 안내 */}
              <div className="flex-1">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="flex items-center gap-2 rounded-full bg-gray-100 px-6 py-3 text-gray-800 mb-4"
                  disabled={!!imagePreview}
                >
                  <Upload className="h-5 w-5" />
                  {imagePreview ? "이미지 업로드 완료" : "업로드 하기"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>초상권, 저작권, 명예훼손 등의 우려가 있는 이미지는 사용을 삼가 주시기 바랍니다.</li>
                  <li>외부 이미지를 사용하실 경우, 반드시 작품 소개란에 출처를 기재해 주시기 바랍니다.</li>
                  <li>이미지 사용에 따른 법적 책임은 이용약관에 따라 작품 게시자 본인에게 있습니다.</li>
                  <li>규정 위반 신고가 접수될 경우, 운영자가 검토 후 기본 표지로 변경될 수 있음을 안내드립니다.</li>
                  <li>권장 이미지 사이즈는 720 × 1098 픽셀이며, jpg, jpeg, png 이미지 파일만 등록 가능합니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 본인(팀) 소개글 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <label htmlFor="teamIntro" className="text-xl font-bold mb-4">
          본인(팀) 소개글
        </label>
        <div className="w-full">
          <textarea
            id="teamIntro"
            value={teamIntro}
            onChange={(e) => setTeamIntro(e.target.value)}
            placeholder="간단하게 작성해 주세요."
            className="w-full rounded-3xl border border-gray-300 px-4 py-3 min-h-[200px] focus:border-pink-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 후원 받을 계좌 정보 */}
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-bold">후원 받을 계좌 정보</h3>
          <span className="text-sm text-gray-500 ml-4">* 매달 1일에 정산됩니다.</span>
        </div>

        {/* 계좌 목록 */}
        <div className="space-y-3 mb-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              onClick={() => handleSelectAccount(account.id)}
              className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                selectedAccountId === account.id ? "border-pink-400 bg-pink-50" : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* 라디오 버튼 추가 */}
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedAccountId === account.id ? "border-pink-400" : "border-gray-300"
                      }`}
                    >
                      {selectedAccountId === account.id && <div className="w-3 h-3 rounded-full bg-pink-400"></div>}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-medium">{account.bankName}</div>
                    <div className="text-sm text-gray-600">
                      {account.accountNumber} ({account.accountHolder})
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDeleteAccount(account.id, e)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
                  aria-label="계좌 삭제"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 계좌 추가 버튼 */}
        <div
          className="rounded-xl border border-dashed border-gray-300 p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 h-16 mb-4"
          onClick={() => setIsAddAccountModalOpen(true)}
        >
          <div className="flex items-center text-gray-500">
            <Plus className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">계좌 추가하기</span>
          </div>
        </div>

        {/* 다음에도 이 계좌 사용 체크박스 */}
        {selectedAccountId && (
          <div className="flex items-center mt-2">
            <button
              type="button"
              onClick={() => setUseAccountNextTime(!useAccountNextTime)}
              className="flex items-center"
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center mr-2 ${
                  useAccountNextTime ? "bg-pink-400 border-pink-400" : "border-gray-300"
                }`}
                style={{ borderRadius: "6px" }}
              >
                {useAccountNextTime && <Check className="h-3 w-3 text-white stroke-[2.5]" />}
              </div>
              <span className="text-sm text-gray-700">다음에도 이 계좌 사용</span>
            </button>
          </div>
        )}
      </div>

      {/* 계좌 추가 모달 */}
      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSave={handleAddAccount}
      />
    </div>
  )
}
