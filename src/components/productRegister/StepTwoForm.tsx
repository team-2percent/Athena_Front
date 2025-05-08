"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, X } from "lucide-react"
import MarkdownEditor from "./MarkdownEditor"
import DatePicker from "./DatePicker"

// 예산 항목 타입
interface BudgetItem {
  id: number
  name: string
  amount: string
  isPercentage: boolean
  percentage?: string
  details?: string
}

// 프로젝트 일정 타입
interface ProjectSchedule {
  id: number
  startDate: Date
  endDate: Date
  details?: string
}

// 구성 항목 타입
interface CompositionItem {
  id: number
  content: string // 항목명을 content로 변경
}

// 후원 옵션 타입
interface SupportOption {
  id: number
  name: string
  price: string
  description: string
  stock: string
  composition?: CompositionItem[] // 구성 항목 추가
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
                  className={`text-sm ${focusedField === `item-content-${item.id}` ? "text-pink-500" : "text-pink-400"}`}
                >
                  구성 세부 내용
                </label>
                <input
                  id={`item-content-${item.id}`}
                  type="text"
                  value={item.content}
                  onChange={(e) => updateItem(item.id, e.target.value)}
                  placeholder="구성 세부 내용을 입력하세요"
                  className={`w-full p-2 border-b ${
                    focusedField === `item-content-${item.id}` ? "border-pink-500" : "border-gray-300"
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
          <button
            type="button"
            onClick={handleSave}
            className="bg-pink-300 text-[#8B1D3F] font-bold py-2 px-6 rounded-full"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}

// 날짜를 YYYY. MM. DD. 형식으로 포맷팅
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}. ${month}. ${day}.`
}

// 천 단위 콤마 포맷팅
const formatNumber = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Add a prop to receive the target amount from step 1
export default function StepTwoForm({ targetAmount = "" }: { targetAmount?: string }) {
  const [markdown, setMarkdown] = useState(
    "# 상품 상세 설명\n\n상품에 대한 자세한 설명을 작성해주세요.\n\n## 특징\n\n- 첫 번째 특징\n- 두 번째 특징\n- 세 번째 특징\n\n## 사용 방법\n\n1. 첫 번째 단계\n2. 두 번째 단계\n3. 세 번째 단계\n\n> 참고: 마크다운 문법을 사용하여 작성할 수 있습니다.",
  )
  // Use the targetAmount from props
  const [totalBudget, setTotalBudget] = useState(targetAmount || "0")
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [schedules, setSchedules] = useState<ProjectSchedule[]>([])
  const [budgetInputMethod, setBudgetInputMethod] = useState<"form" | "direct">("form")
  const [scheduleInputMethod, setScheduleInputMethod] = useState<"form" | "direct">("form")
  const [supportOptions, setSupportOptions] = useState<SupportOption[]>([])
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [compositionDialogOpen, setCompositionDialogOpen] = useState(false)
  const [currentOptionId, setCurrentOptionId] = useState<number | null>(null)

  // Add useEffect to update totalBudget when targetAmount changes
  useEffect(() => {
    setTotalBudget(targetAmount || "0")
  }, [targetAmount])

  // 예산 항목 추가
  const addBudgetItem = () => {
    const newId = budgetItems.length > 0 ? Math.max(...budgetItems.map((item) => item.id)) + 1 : 1
    setBudgetItems([...budgetItems, { id: newId, name: "", amount: "", isPercentage: false }])
  }

  // 예산 항목 삭제
  const removeBudgetItem = (id: number) => {
    setBudgetItems(budgetItems.filter((item) => item.id !== id))
  }

  // 일정 추가
  const addSchedule = () => {
    const newId = schedules.length > 0 ? Math.max(...schedules.map((schedule) => schedule.id)) + 1 : 1
    const today = new Date()
    const threeWeeksLater = new Date(today)
    threeWeeksLater.setDate(today.getDate() + 21)

    setSchedules([...schedules, { id: newId, startDate: today, endDate: threeWeeksLater }])
  }

  // 일정 삭제
  const removeSchedule = (id: number) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id))
  }

  // 후원 옵션 추가
  const addSupportOption = () => {
    const newId = supportOptions.length > 0 ? Math.max(...supportOptions.map((option) => option.id)) + 1 : 1
    setSupportOptions([...supportOptions, { id: newId, name: "", price: "", description: "", stock: "" }])
  }

  // 후원 옵션 필드 업데이트
  const updateSupportOption = (id: number, field: keyof SupportOption, value: string) => {
    setSupportOptions(supportOptions.map((option) => (option.id === id ? { ...option, [field]: value } : option)))
  }

  // 구성 다이얼로그 열기
  const openCompositionDialog = (optionId: number) => {
    setCurrentOptionId(optionId)
    setCompositionDialogOpen(true)
  }

  // 구성 저장
  const saveComposition = (composition: CompositionItem[]) => {
    if (currentOptionId !== null) {
      setSupportOptions(
        supportOptions.map((option) => (option.id === currentOptionId ? { ...option, composition } : option)),
      )
    }
  }

  // 예산 항목 이름 변경
  const handleBudgetNameChange = (id: number, name: string) => {
    setBudgetItems(budgetItems.map((item) => (item.id === id ? { ...item, name } : item)))
  }

  // 예산 항목 금액 변경
  const handleBudgetAmountChange = (id: number, amount: string) => {
    // 숫자만 입력 가능하도록 처리
    const numericValue = amount.replace(/[^0-9]/g, "")
    // 천 단위 콤마 포맷팅
    const formattedValue = numericValue ? formatNumber(numericValue) : ""

    // Calculate percentage based on total budget
    const totalNumeric = totalBudget.replace(/[^0-9]/g, "")
    let percentage = ""
    if (numericValue && totalNumeric) {
      const percentValue = Math.round((Number.parseInt(numericValue) / Number.parseInt(totalNumeric)) * 100)
      percentage = `${percentValue}%`
    }

    setBudgetItems(budgetItems.map((item) => (item.id === id ? { ...item, amount: formattedValue, percentage } : item)))
  }

  // 예산 항목 입력 방식 변경 (금액/비율)
  const handleBudgetTypeChange = (id: number, isPercentage: boolean) => {
    setBudgetItems(budgetItems.map((item) => (item.id === id ? { ...item, isPercentage } : item)))
  }

  // 예산 항목 비율 변경
  const handleBudgetPercentageChange = (id: number, percentage: string) => {
    // 숫자만 입력 가능하도록 처리
    const numericValue = percentage.replace(/[^0-9]/g, "")
    const percentageValue = numericValue ? `${numericValue}%` : ""

    // Calculate amount based on percentage
    const totalNumeric = totalBudget.replace(/[^0-9]/g, "")
    let amount = ""
    if (numericValue && totalNumeric) {
      const amountValue = Math.round((Number.parseInt(numericValue) / 100) * Number.parseInt(totalNumeric))
      amount = formatNumber(amountValue.toString())
    }

    setBudgetItems(
      budgetItems.map((item) => (item.id === id ? { ...item, percentage: percentageValue, amount } : item)),
    )
  }

  // 일정 시작일 변경
  const handleStartDateChange = (id: number, startDate: Date) => {
    setSchedules(schedules.map((schedule) => (schedule.id === id ? { ...schedule, startDate } : schedule)))
  }

  // 일정 종료일 변경
  const handleEndDateChange = (id: number, endDate: Date) => {
    setSchedules(schedules.map((schedule) => (schedule.id === id ? { ...schedule, endDate } : schedule)))
  }

  // 폼 데이터를 마크다운으로 변환
  const generateMarkdown = () => {
    let result = ""

    // 프로젝트 일정 마크다운 생성 - "자동 채우기 사용" 옵션일 때만 추가
    if (scheduleInputMethod === "form") {
      result += "## 프로젝트 일정\n\n"
      result += "| 단계 | 시작일 | 종료일 |\n"
      result += "|------|--------|--------|\n"
      schedules.forEach((schedule, index) => {
        result += `| ${index + 1} | ${formatDate(schedule.startDate)} | ${formatDate(schedule.endDate)} |\n`
      })
      result += "\n"
    }

    // 예산 계획 마크다운 생성 - "자동 채우기 사용" 옵션일 때만 추가
    if (budgetInputMethod === "form") {
      result += "## 예산 계획\n\n"
      result += `**설정한 목표 금액**: ${formatNumber(totalBudget)}원\n\n`
      result += "| 항목 | 금액 | 비율 |\n"
      result += "|------|------|------|\n"
      budgetItems.forEach((item) => {
        result += `| ${item.name} | ${item.amount}원 | ${item.percentage} |\n`
      })
      result += "\n"
    }

    // 기존 마크다운과 합치기
    return result + markdown
  }

  // 마크다운 업데이트
  const updateMarkdown = () => {
    setMarkdown(generateMarkdown())
  }

  // 총 예산 변경
  const handleTotalBudgetChange = (value: string) => {
    // 숫자만 입력 가능하도록 처리
    const numericValue = value.replace(/[^0-9]/g, "")
    // 천 단위 콤마 포맷팅
    setTotalBudget(numericValue ? formatNumber(numericValue) : "")
  }

  // 가격 입력 처리 (천 단위 콤마 포맷팅)
  const handlePriceChange = (id: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    const formattedValue = numericValue ? formatNumber(numericValue) : ""
    updateSupportOption(id, "price", formattedValue)
  }

  // 재고 입력 처리 (천 단위 콤마 포맷팅)
  const handleStockChange = (id: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    const formattedValue = numericValue ? formatNumber(numericValue) : ""
    updateSupportOption(id, "stock", formattedValue)
  }

  return (
    <div className="space-y-8">
      {/* 예산 계획 섹션 */}
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold mr-8">예산 계획</h2>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                checked={budgetInputMethod === "form"}
                onChange={() => setBudgetInputMethod("form")}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center ${budgetInputMethod === "form" ? "bg-pink-400 text-white" : "border border-gray-300"}`}
              >
                {budgetInputMethod === "form" && <span className="w-2 h-2 bg-white rounded-full"></span>}
              </span>
              <span className="ml-2">자동 채우기 사용</span>
            </label>

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                checked={budgetInputMethod === "direct"}
                onChange={() => setBudgetInputMethod("direct")}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center ${budgetInputMethod === "direct" ? "bg-pink-400 text-white" : "border border-gray-300"}`}
              >
                {budgetInputMethod === "direct" && <span className="w-2 h-2 bg-white rounded-full"></span>}
              </span>
              <span className="ml-2">직접 상세 설명에 입력</span>
            </label>
          </div>
        </div>

        {/* 설정한 목표 금액 - 가로 배치로 변경 */}
        <div className="mb-6 flex items-center">
          <span className="text-lg font-medium mr-4">설정한 목표 금액</span>
          <div className="flex items-center">
            <span className="font-bold text-xl">{formatNumber(totalBudget)}원</span>
            <span className="ml-4 text-gray-500">* 기본 정보의 목표 금액과 동일합니다.</span>
          </div>
        </div>

        {budgetInputMethod === "form" && (
          <>
            {/* 예산 항목 목록 */}
            <div className="space-y-4">
              {budgetItems.map((item, index) => (
                <div key={item.id} className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-2">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleBudgetNameChange(item.id, e.target.value)}
                      placeholder="항목명"
                      className="w-64 rounded-full border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
                    />

                    <div className="mx-4 h-6 w-px bg-gray-300"></div>

                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer mr-4">
                        <input
                          type="radio"
                          checked={!item.isPercentage}
                          onChange={() => handleBudgetTypeChange(item.id, false)}
                          className="sr-only"
                        />
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${!item.isPercentage ? "bg-pink-400 text-white" : "border border-gray-300"}`}
                        >
                          {!item.isPercentage && <span className="w-2 h-2 bg-white rounded-full"></span>}
                        </span>
                        <span className="ml-2">금액입력</span>
                      </label>

                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={item.isPercentage}
                          onChange={() => handleBudgetTypeChange(item.id, true)}
                          className="sr-only"
                        />
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${item.isPercentage ? "bg-pink-400 text-white" : "border border-gray-300"}`}
                        >
                          {item.isPercentage && <span className="w-2 h-2 bg-white rounded-full"></span>}
                        </span>
                        <span className="ml-2">비율입력</span>
                      </label>
                    </div>

                    <div className="ml-4 flex items-center">
                      {item.isPercentage ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={item.percentage?.replace("%", "") || ""}
                            onChange={(e) => handleBudgetPercentageChange(item.id, e.target.value)}
                            placeholder="0"
                            className="w-24 rounded-full border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none text-right"
                          />
                          <span className="ml-2">%</span>
                          <span className="ml-4 text-gray-500">({item.amount}원)</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={item.amount}
                            onChange={(e) => handleBudgetAmountChange(item.id, e.target.value)}
                            placeholder="0"
                            className="w-40 rounded-full border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none text-right"
                          />
                          <span className="ml-2">원</span>
                          <span className="ml-4 text-gray-500">(전체의 {item.percentage})</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeBudgetItem(item.id)}
                      className="ml-auto p-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="항목 삭제"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 예산 항목 추가 버튼 */}
            <div className="mt-4">
              <div
                className="border border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-gray-50 h-14"
                onClick={addBudgetItem}
              >
                <div className="flex items-center text-gray-500">
                  <Plus className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">예산 계획 추가</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 프로젝트 일정 섹션 */}
      <div className="flex flex-col mt-8">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold mr-8">프로젝트 일정</h2>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                checked={scheduleInputMethod === "form"}
                onChange={() => setScheduleInputMethod("form")}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center ${scheduleInputMethod === "form" ? "bg-pink-400 text-white" : "border border-gray-300"}`}
              >
                {scheduleInputMethod === "form" && <span className="w-2 h-2 bg-white rounded-full"></span>}
              </span>
              <span className="ml-2">자동 채우기 사용</span>
            </label>

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                checked={scheduleInputMethod === "direct"}
                onChange={() => setScheduleInputMethod("direct")}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center ${scheduleInputMethod === "direct" ? "bg-pink-400 text-white" : "border border-gray-300"}`}
              >
                {scheduleInputMethod === "direct" && <span className="w-2 h-2 bg-white rounded-full"></span>}
              </span>
              <span className="ml-2">직접 상세 설명에 입력</span>
            </label>
          </div>
        </div>

        {scheduleInputMethod === "form" && (
          <>
            {/* 일정 목록 */}
            <div className="space-y-4">
              {schedules.map((schedule, index) => (
                <div key={schedule.id} className="flex items-center">
                  <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-2">
                    {index + 1}
                  </span>

                  <DatePicker
                    selectedDate={schedule.startDate}
                    onChange={(date) => handleStartDateChange(schedule.id, date)}
                    position="top"
                  />

                  <span className="mx-2">부터</span>

                  <DatePicker
                    selectedDate={schedule.endDate}
                    onChange={(date) => handleEndDateChange(schedule.id, date)}
                    position="top"
                  />

                  <span className="mx-2">까지</span>

                  <button type="button" className="ml-4 text-pink-500 hover:text-pink-700">
                    내용 작성(편집) &gt;
                  </button>

                  <button
                    type="button"
                    onClick={() => removeSchedule(schedule.id)}
                    className="ml-auto p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="일정 삭제"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* 일정 추가 버튼 */}
            <div className="mt-4">
              <div
                className="border border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-gray-50 h-14"
                onClick={addSchedule}
              >
                <div className="flex items-center text-gray-500">
                  <Plus className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">일정 추가</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 마크다운에 적용 버튼 */}
      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={updateMarkdown}
          className="bg-pink-300 text-[#8B1D3F] font-bold py-3 px-8 rounded-full"
        >
          선택 내용 자동 채우기
        </button>
      </div>

      {/* 마크다운 에디터 */}
      <div className="flex flex-col mt-8">
        <h2 className="text-xl font-bold mb-4">상품 상세 설명</h2>
        <MarkdownEditor value={markdown} onChange={setMarkdown} />
      </div>

      {/* 후원 옵션 설정 */}
      <div className="flex flex-col mt-8">
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
                onClick={() => {
                  setSupportOptions(supportOptions.filter((o) => o.id !== option.id))
                }}
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
                    className={`text-sm ${focusedField === `option-name-${option.id}` ? "text-pink-500" : "text-pink-400"}`}
                  >
                    상품 이름
                  </label>
                  <input
                    id={`option-name-${option.id}`}
                    type="text"
                    value={option.name}
                    onChange={(e) => updateSupportOption(option.id, "name", e.target.value)}
                    placeholder="상품 이름을 지어주세요."
                    className={`w-full p-1 border-b ${
                      focusedField === `option-name-${option.id}` ? "border-pink-500" : "border-gray-300"
                    } focus:outline-none text-base`}
                    onFocus={() => setFocusedField(`option-name-${option.id}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                {/* 옵션 설명 */}
                <div>
                  <label
                    htmlFor={`option-desc-${option.id}`}
                    className={`text-sm ${focusedField === `option-desc-${option.id}` ? "text-pink-500" : "text-pink-400"}`}
                  >
                    상품 설명
                  </label>
                  <input
                    id={`option-desc-${option.id}`}
                    type="text"
                    value={option.description}
                    onChange={(e) => updateSupportOption(option.id, "description", e.target.value)}
                    placeholder="해당 옵션을 자세히 설명해 주세요."
                    className={`w-full p-1 border-b ${
                      focusedField === `option-desc-${option.id}` ? "border-pink-500" : "border-gray-300"
                    } focus:outline-none text-base`}
                    onFocus={() => setFocusedField(`option-desc-${option.id}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                {/* 구성 */}
                <div>
                  <label className="text-sm text-pink-400">구성</label>
                  <div className="mt-0.5">
                    <button
                      type="button"
                      onClick={() => openCompositionDialog(option.id)}
                      className="flex items-center text-pink-500 hover:text-pink-700"
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
                    className={`text-sm ${focusedField === `option-price-${option.id}` ? "text-pink-500" : "text-pink-400"}`}
                  >
                    가격
                  </label>
                  <div className="flex items-center border-b border-gray-300 focus-within:border-pink-500">
                    <input
                      id={`option-price-${option.id}`}
                      type="text"
                      value={option.price}
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
                    className={`text-sm ${focusedField === `option-stock-${option.id}` ? "text-pink-500" : "text-pink-400"}`}
                  >
                    수량
                  </label>
                  <div className="flex items-center border-b border-gray-300 focus-within:border-pink-500">
                    <input
                      id={`option-stock-${option.id}`}
                      type="text"
                      value={option.stock}
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
}
