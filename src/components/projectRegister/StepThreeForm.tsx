"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Check, X, Trash2 } from "lucide-react"
import { useProjectFormStore } from "@/stores/useProjectFormStore"
import type { CompositionItem, SupportOption } from "@/stores/useProjectFormStore"
import { useApi } from "@/hooks/useApi"
import { PrimaryButton } from "../common/Button"
import PlanSelection from "./PlanSelection"
import AlertModal from "../common/AlertModal"

// 계좌 정보 타입 정의
interface BankAccount {
  id: number
  accountHolder: string // 예금주
  bankName: string // 은행명
  bankAccount: string // 계좌번호 (키 이름 변경됨)
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
  // 2. AddAccountModal 컴포넌트 내부에 AlertModal 상태 추가
  const [alertMessage, setAlertMessage] = useState("")
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  if (!isOpen) return null

  // 계좌번호 입력 처리 함수 추가
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setAccountNumber(value)
  }

  // 폼 제출 처리 함수 추가
  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ accountHolder, bankName, bankAccount: accountNumber })
      onClose()
    }
  }

  // 4. AddAccountModal 컴포넌트 return 문 내부 최상단에 AlertModal 컴포넌트 추가
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <AlertModal isOpen={isAlertOpen} message={alertMessage} onClose={() => setIsAlertOpen(false)} />
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
              className={`w-full p-2 border-b ${
                focusedField === "accountHolder" ? "border-secondary-color-dark" : "border-gray-300"
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
              className={`w-full p-2 border-b ${
                focusedField === "bankName" ? "border-secondary-color-dark" : "border-gray-300"
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
              className={`w-full p-2 border-b ${
                focusedField === "accountNumber" ? "border-secondary-color-dark" : "border-gray-300"
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
            className="bg-main-color hover:bg-secondary-color-dark text-white font-bold py-2 px-6 rounded-full"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  )

  // 3. validateForm 함수 내 alert 호출 부분 수정
  function validateForm() {
    const newErrors = {
      accountHolder: accountHolder.trim() === "",
      bankName: bankName.trim() === "",
      accountNumber: accountNumber.trim() === "",
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }
}

// 구성 다이얼로그 컴포넌트
interface CompositionDialogProps {
  isOpen: boolean
  onClose: () => void
  composition: CompositionItem[]
  onSave: (composition: CompositionItem[]) => void
}

const CompositionDialog = ({ isOpen, onClose, composition, onSave }: CompositionDialogProps) => {
  const [items, setItems] = useState<CompositionItem[]>(composition || [])
  const [focusedField, setFocusedField] = useState<string | null>(null)

  if (!isOpen) return null

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1
    setItems([...items, { id: newId, content: "" }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: number, content: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, content } : item)))
  }

  const handleSave = () => {
    onSave(items)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* 다이얼로그 */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">구성 항목 설정</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-end gap-4">
              <div className="flex-1">
                <label
                  htmlFor={`item-content-${item.id}`}
                  className={`text-sm ${focusedField === `item-content-${item.id}` ? "text-secondary-color-dark" : "text-main-color"}`}
                >
                  구성 세부 내용 (100자 이하)
                </label>
                <input
                  id={`item-content-${item.id}`}
                  type="text"
                  value={item.content}
                  onChange={(e) => {
                    // 100자 제한
                    if (e.target.value.length <= 100) {
                      updateItem(item.id, e.target.value)
                    }
                  }}
                  placeholder="구성 세부 내용을 입력하세요"
                  className={`w-full p-2 border-b ${
                    focusedField === `item-content-${item.id}` ? "border-secondary-color-dark" : "border-gray-300"
                  } focus:outline-none text-lg`}
                  onFocus={() => setFocusedField(`item-content-${item.id}`)}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors mb-2"
                aria-label="항목 삭제"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          {/* 항목 추가 버튼 */}
          <div
            className="border border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-gray-50 h-14"
            onClick={addItem}
          >
            <div className="flex items-center text-gray-500">
              <Plus className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">구성 항목 추가</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <PrimaryButton
            type="button"
            onClick={handleSave}
            className="bg-main-color text-white font-bold py-2 px-6 rounded-full"
          >
            저장
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

interface StepThreeFormProps {
  initialData?: {
    supportOptions?: SupportOption[]
  }
  isEditMode?: boolean
}

// StepThreeForm 함수 내부에서 return문 수정
// 기존 return문의 최상위 div 내부 맨 위에 PlanSelection 컴포넌트 추가
export default function StepThreeForm({ initialData, isEditMode = false }: StepThreeFormProps) {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { supportOptions, updateFormData, platformPlan } = useProjectFormStore()
  const { apiCall, isLoading } = useApi()

  // 계좌 관련 상태
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null)
  const [useAccountNextTime, setUseAccountNextTime] = useState(false)
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false)
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [accountsLoading, setAccountsLoading] = useState(false)
  const [accountError, setAccountError] = useState<string | null>(null)
  // 5. StepThreeForm 컴포넌트 내부에 AlertModal 상태 추가
  const [alertMessage, setAlertMessage] = useState("")
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  // 후원 상품 관련 상태
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [compositionDialogOpen, setCompositionDialogOpen] = useState(false)
  const [currentOptionId, setCurrentOptionId] = useState<number | null>(null)
  // 새 배송지 관련 상태 추가
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    detailAddress: "",
  })

  // 계좌 목록 조회 API 호출
  const fetchAccounts = async () => {
    setAccountsLoading(true)
    setAccountError(null)

    try {
      const response = await apiCall<BankAccount[]>("/api/bankAccount", "GET")

      if (response.error) {
        setAccountError(response.error)
      } else if (response.data) {
        setAccounts(response.data)

        // 기본 계좌 선택
        const defaultAccount = response.data.find((account) => account.isDefault)
        if (defaultAccount) {
          setSelectedAccountId(defaultAccount.id)
        } else if (response.data.length > 0) {
          setSelectedAccountId(response.data[0].id)
        }
      }
    } catch (error) {
      setAccountError("계좌 정보를 불러오는데 실패했습니다.")
      console.error("계좌 정보 조회 오류:", error)
    } finally {
      setAccountsLoading(false)
    }
  }

  // 컴포넌트 마운트 시 계좌 목록 조회
  useEffect(() => {
    fetchAccounts()
  }, [])

  // 계좌 추가 처리 - API 연동
  const handleAddAccount = async (account: Omit<BankAccount, "id" | "isDefault">) => {
    try {
      const response = await apiCall<BankAccount>("/api/bankAccount", "POST", {
        accountHolder: account.accountHolder,
        bankName: account.bankName,
        accountNumber: account.bankAccount,
      })

      if (response.error) {
        console.error("계좌 추가 오류:", response.error)
        return
      }

      if (response.data) {
        // API 응답으로 받은 새 계좌 정보를 목록에 추가
        setAccounts((prev) => [...prev, response.data as BankAccount])
        setSelectedAccountId(response.data.id) // 새로 추가한 계좌 선택
      }

      // 계좌 목록 새로고침
      fetchAccounts()
    } catch (error) {
      console.error("계좌 추가 오류:", error)
    }
  }

  // 계좌 삭제 처리 - API 연동
  const handleDeleteAccount = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지

    try {
      const response = await apiCall(`/api/bankAccount?bankAccountId=${id}`, "DELETE")

      if (response.error) {
        console.error("계좌 삭제 오류:", response.error)
        return
      }

      // 선택된 계좌를 삭제하는 경우 선택 상태 초기화
      if (selectedAccountId === id) {
        setSelectedAccountId(null)
        setUseAccountNextTime(false)
      }

      // 계좌 목록에서 삭제된 계좌 제거
      setAccounts(accounts.filter((account) => account.id !== id))
    } catch (error) {
      console.error("계좌 삭제 오류:", error)
    }
  }

  // 계좌 선택 처리
  const handleSelectAccount = (id: number) => {
    setSelectedAccountId(id)
  }

  // 후원 옵션 추가
  const addSupportOption = () => {
    const newId = supportOptions.length > 0 ? Math.max(...supportOptions.map((option) => option.id)) + 1 : 1
    const updatedOptions = [...supportOptions, { id: newId, name: "", price: "", description: "", stock: "" }]
    updateFormData({ supportOptions: updatedOptions })
  }

  // 후원 옵션 필드 업데이트
  const updateSupportOption = (id: number, field: keyof SupportOption, value: string) => {
    const updatedOptions = supportOptions.map((option) => (option.id === id ? { ...option, [field]: value } : option))
    updateFormData({ supportOptions: updatedOptions })
  }

  // 구성 다이얼로그 열기
  const openCompositionDialog = (optionId: number) => {
    setCurrentOptionId(optionId)
    setCompositionDialogOpen(true)
  }

  // 구성 저장
  const saveComposition = (composition: CompositionItem[]) => {
    if (currentOptionId !== null) {
      const updatedOptions = supportOptions.map((option) =>
        option.id === currentOptionId ? { ...option, composition } : option,
      )
      updateFormData({ supportOptions: updatedOptions })
    }
  }

  // 가격 입력 처리 (천 단위 콤마 포맷팅)
  const handlePriceChange = (id: number, value: string) => {
    let numericValue = value.replace(/[^0-9]/g, "")

    // 앞자리 0 제거 (단, "0" 하나만 있는 경우는 유지)
    if (numericValue.length > 1 && numericValue.startsWith("0")) {
      numericValue = numericValue.replace(/^0+/, "")
    }

    const numericNumber = Number(numericValue)

    // 10억 원 제한 - 초과 시 최댓값으로 설정
    if (numericNumber > 1000000000) {
      const formattedValue = formatNumber("1000000000")
      updateSupportOption(id, "price", formattedValue)
      return
    }

    const formattedValue = numericValue ? formatNumber(numericValue) : ""
    updateSupportOption(id, "price", formattedValue)
  }

  // 재고 입력 처리 (천 단위 콤마 포맷팅, 1만 개 제한)
  const handleStockChange = (id: number, value: string) => {
    let numericValue = value.replace(/[^0-9]/g, "")

    // 앞자리 0 제거 (단, "0" 하나만 있는 경우는 유지)
    if (numericValue.length > 1 && numericValue.startsWith("0")) {
      numericValue = numericValue.replace(/^0+/, "")
    }
    
    const numericNumber = Number(numericValue)

    // 1만 개 제한 - 초과 시 최댓값으로 설정
    if (numericNumber > 10000) {
      const formattedValue = formatNumber("10000")
      updateSupportOption(id, "stock", formattedValue)
      return
    }

    const formattedValue = numericValue ? formatNumber(numericValue) : ""
    updateSupportOption(id, "stock", formattedValue)
  }

  // 천 단위 콤마 포맷팅
  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // 후원 옵션 삭제
  const removeSupportOption = (id: number) => {
    const updatedOptions = supportOptions.filter((option) => option.id !== id)
    updateFormData({ supportOptions: updatedOptions })
  }

  // 선택된 계좌 ID가 변경될 때마다 Zustand 스토어에 저장하는 useEffect 추가
  useEffect(() => {
    if (selectedAccountId !== null) {
      updateFormData({ bankAccountId: selectedAccountId })
    }
  }, [selectedAccountId, updateFormData])

  // 7. StepThreeForm 컴포넌트 return 문 내부 최상단에 AlertModal 컴포넌트 추가
  return (
    <div className="space-y-8">
      <AlertModal isOpen={isAlertOpen} message={alertMessage} onClose={() => setIsAlertOpen(false)} />
      {/* 후원 상품 설정 */}
      <div className="flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-bold">후원 상품 설정</h2>
        </div>

        {/* 후원 옵션 카드 목록 - 각 옵션이 별도의 카드로 표시됨 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportOptions.map((option) => (
            <div
              key={option.id}
              className="border border-gray-300 rounded-3xl p-4 h-80 flex flex-col justify-between relative"
            >
              {/* 삭제 버튼 추가 */}
              <button
                type="button"
                onClick={() => removeSupportOption(option.id)}
                className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
                aria-label="옵션 삭제"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <div className="flex flex-col space-y-4">
                {/* 옵션 이름 */}
                <div>
                  <label
                    htmlFor={`option-name-${option.id}`}
                    className={`text-sm ${focusedField === `option-name-${option.id}` ? "text-secondary-color-dark" : "text-main-color"}`}
                  >
                    상품 이름 (25자 이하)
                  </label>
                  <input
                    id={`option-name-${option.id}`}
                    type="text"
                    value={option.name}
                    onChange={(e) => {
                      // 25자 제한
                      if (e.target.value.length <= 25) {
                        updateSupportOption(option.id, "name", e.target.value)
                      }
                    }}
                    placeholder="상품 이름을 지어주세요."
                    className={`w-full p-1 border-b ${
                      focusedField === `option-name-${option.id}` ? "border-secondary-color-dark" : "border-gray-300"
                    } focus:outline-none text-base`}
                    onFocus={() => setFocusedField(`option-name-${option.id}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                {/* 옵션 설명 */}
                <div>
                  <label
                    htmlFor={`option-desc-${option.id}`}
                    className={`text-sm ${focusedField === `option-desc-${option.id}` ? "text-secondary-color-dark" : "text-main-color"}`}
                  >
                    상품 설명 (50자 이하)
                  </label>
                  <input
                    id={`option-desc-${option.id}`}
                    type="text"
                    value={option.description}
                    onChange={(e) => {
                      // 50자 제한
                      if (e.target.value.length <= 50) {
                        updateSupportOption(option.id, "description", e.target.value)
                      }
                    }}
                    placeholder="해당 옵션을 자세히 설명해 주세요."
                    className={`w-full p-1 border-b ${
                      focusedField === `option-desc-${option.id}` ? "border-secondary-color-dark" : "border-gray-300"
                    } focus:outline-none text-base`}
                    onFocus={() => setFocusedField(`option-desc-${option.id}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                {/* 구성 */}
                <div>
                  <label className="text-sm text-main-color">구성</label>
                  <div className="mt-0.5">
                    <button
                      type="button"
                      onClick={() => openCompositionDialog(option.id)}
                      className="flex items-center text-main-color hover:text-secondary-color-dark"
                    >
                      <span>
                        구성 항목 추가/편집...
                        {option.composition && option.composition.length > 0 && (
                          <span className="ml-1 text-gray-500">({option.composition.length}개 추가됨)</span>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 가격과 재고를 한 줄에 표시 */}
              <div className="flex gap-4">
                {/* 가격 */}
                <div className="flex-1">
                  <label
                    htmlFor={`option-price-${option.id}`}
                    className={`text-sm ${focusedField === `option-price-${option.id}` ? "text-secondary-color-dark" : "text-main-color"}`}
                  >
                    가격 (10억 원 이하)
                  </label>
                  <div className="flex items-center border-b border-gray-300 focus-within:border-secondary-color-dark">
                    <input
                      id={`option-price-${option.id}`}
                      type="text"
                      value={formatNumber(option.price)}
                      onChange={(e) => handlePriceChange(option.id, e.target.value)}
                      placeholder="0"
                      className="w-full p-1 focus:outline-none text-base text-right"
                      onFocus={() => setFocusedField(`option-price-${option.id}`)}
                      onBlur={() => setFocusedField(null)}
                    />
                    <span className="text-gray-500 ml-1">원</span>
                  </div>
                </div>

                {/* 재고 */}
                <div className="flex-1">
                  <label
                    htmlFor={`option-stock-${option.id}`}
                    className={`text-sm ${focusedField === `option-stock-${option.id}` ? "text-secondary-color-dark" : "text-main-color"}`}
                  >
                    수량 (1만 개 이하)
                  </label>
                  <div className="flex items-center border-b border-gray-300 focus-within:border-secondary-color-dark">
                    <input
                      id={`option-stock-${option.id}`}
                      type="text"
                      value={formatNumber(option.stock)}
                      onChange={(e) => handleStockChange(option.id, e.target.value)}
                      placeholder="0"
                      className="w-full p-1 focus:outline-none text-base text-right"
                      onFocus={() => setFocusedField(`option-stock-${option.id}`)}
                      onBlur={() => setFocusedField(null)}
                    />
                    <span className="text-gray-500 ml-1">개</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 옵션 추가 버튼을 카드 형태로 */}
          <div
            className="border border-dashed border-gray-300 rounded-3xl p-4 h-80 flex items-center justify-center cursor-pointer hover:bg-gray-50"
            onClick={addSupportOption}
          >
            <div className="flex flex-col items-center text-gray-500">
              <Plus className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">상품 추가</span>
            </div>
          </div>
        </div>
      </div>

      {/* 플랜 선택 섹션 추가 */}
      {!isEditMode ? (
        <PlanSelection />
      ) : (
        <div className="mt-8 mb-4">
          <h3 className="text-xl font-bold mb-2">후원 플랜 선택</h3>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-800">{platformPlan} 플랜 적용 중 입니다.</p>
                <p className="text-sm text-gray-600 mt-1">프로젝트 수정 화면에서는 플랜 변경이 불가능합니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 후원 받을 계좌 정보 */}
      <div className="flex flex-col mt-8">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-bold">후원 받을 계좌 정보</h3>
          <span className="text-sm text-gray-500 ml-4">* 매달 1일에 정산됩니다.</span>
        </div>

        {/* 계좌 목록 */}
        <div className="space-y-3 mb-4">
          {accountsLoading ? (
            <div>계좌 정보를 불러오는 중...</div>
          ) : accountError ? (
            <div>{accountError}</div>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                onClick={() => handleSelectAccount(account.id)}
                className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                  selectedAccountId === account.id
                    ? "border-main-color bg-secondary-color"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* 라디오 버튼 추가 */}
                    <div className="flex items-center justify-center">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedAccountId === account.id ? "border-main-color" : "border-gray-300"
                        }`}
                      >
                        {selectedAccountId === account.id && <div className="w-3 h-3 rounded-full bg-main-color"></div>}
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-medium">{account.bankName}</div>
                      <div className="text-sm text-gray-600">
                        {account.bankAccount} ({account.accountHolder})
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
            ))
          )}
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
                  useAccountNextTime ? "bg-main-color border-main-color" : "border-gray-300"
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

      {/* 구성 다이얼로그 */}
      {compositionDialogOpen && (
        <CompositionDialog
          isOpen={compositionDialogOpen}
          onClose={() => setCompositionDialogOpen(false)}
          composition={
            currentOptionId !== null
              ? supportOptions.find((option) => option.id === currentOptionId)?.composition || []
              : []
          }
          onSave={saveComposition}
        />
      )}
    </div>
  )

  // 6. 새 배송지 저장 함수의 alert 호출 부분 수정
  function saveNewAddress() {
    // 필수 입력값 검증
    if (!newAddress.name || !newAddress.address || !newAddress.detailAddress) {
      setAlertMessage("배송지명, 주소, 상세 주소를 모두 입력해주세요.")
      setIsAlertOpen(true)
      return
    }
  }
}
