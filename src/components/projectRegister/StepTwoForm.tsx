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

// 일정 내용 다이얼로그 컴포넌트
interface ScheduleDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  details: string
  onSave: (details: string) => void
  scheduleIndex: number
}

const ScheduleDetailsDialog = ({ isOpen, onClose, details, onSave, scheduleIndex }: ScheduleDetailsDialogProps) => {
  const [content, setContent] = useState(details || "")
  const [focusedField, setFocusedField] = useState<boolean>(false)

  if (!isOpen) return null

  const handleSave = () => {
    onSave(content)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* 다이얼로그 */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">일정 {scheduleIndex + 1} 상세 내용</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <label
            htmlFor="schedule-details"
            className={`block text-sm mb-2 ${focusedField ? "text-secondary-color-dark" : "text-main-color"}`}
          >
            일정 상세 내용
          </label>
          <input
            id="schedule-details"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이 일정에 대한 상세 내용을 입력하세요"
            className={`w-full p-4 border rounded-xl ${
              focusedField ? "border-secondary-color-dark" : "border-gray-300"
            } focus:outline-none`}
            onFocus={() => setFocusedField(true)}
            onBlur={() => setFocusedField(false)}
          />
          <p className="text-sm text-gray-500 mt-2">* 간단하게 입력해주세요. 줄바꿈은 불가능합니다.</p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="bg-main-color text-white font-bold py-2 px-6 rounded-full"
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

interface StepTwoFormProps {
  targetAmount?: string
  initialData?: {
    markdown?: string
  }
}

// 1단계에서 입력한 목표 금액을 props로 받아서 사용
export default function StepTwoForm({ targetAmount = "", initialData }: StepTwoFormProps) {
  const [markdown, setMarkdown] = useState(
    initialData?.markdown ||
      "# 상품 상세 설명\n\n상품에 대한 자세한 설명을 작성해주세요.\n\n## 특징\n\n- 첫 번째 특징\n- 두 번째 특징\n- 세 번째 특징\n\n## 사용 방법\n\n1. 첫 번째 단계\n2. 두 번째 단계\n3. 세 번째 단계\n\n> 참고: 마크다운 문법을 사용하여 작성할 수 있습니다.",
  )
  // Use the targetAmount from props
  const [totalBudget, setTotalBudget] = useState(targetAmount || "0")
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [schedules, setSchedules] = useState<ProjectSchedule[]>([])
  const [budgetInputMethod, setBudgetInputMethod] = useState<"form" | "direct">("form")
  const [scheduleInputMethod, setScheduleInputMethod] = useState<"form" | "direct">("form")
  const [scheduleDetailsDialogOpen, setScheduleDetailsDialogOpen] = useState(false)
  const [currentScheduleId, setCurrentScheduleId] = useState<number | null>(null)

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

  // 일정 내용 편집 다이얼로그 열기
  const openScheduleDetailsDialog = (id: number) => {
    setCurrentScheduleId(id)
    setScheduleDetailsDialogOpen(true)
  }

  // 일정 내용 저장
  const saveScheduleDetails = (details: string) => {
    if (currentScheduleId !== null) {
      setSchedules(
        schedules.map((schedule) => (schedule.id === currentScheduleId ? { ...schedule, details } : schedule)),
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

  // 입력된 데이터를 마크다운으로 변환
  const generateMarkdown = () => {
    let result = ""

    // 프로젝트 일정 마크다운 생성 - "자동 채우기 사용" 옵션일 때만 추가
    if (scheduleInputMethod === "form") {
      result += "## 프로젝트 일정\n\n"
      result += "| 시작일 | 종료일 | 상세 내용 |\n"
      result += "|--------|--------|----------|\n"
      schedules.forEach((schedule) => {
        result += `| ${formatDate(schedule.startDate)} | ${formatDate(schedule.endDate)} | ${
          schedule.details || "-"
        } |\n`
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
                className={`w-5 h-5 rounded-full flex items-center justify-center ${budgetInputMethod === "form" ? "bg-main-color text-white" : "border border-gray-300"}`}
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
                className={`w-5 h-5 rounded-full flex items-center justify-center ${budgetInputMethod === "direct" ? "bg-main-color text-white" : "border border-gray-300"}`}
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
                      className="w-64 rounded-full border border-gray-300 px-4 py-3 focus:border-main-color focus:outline-none"
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
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${!item.isPercentage ? "bg-main-color text-white" : "border border-gray-300"}`}
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
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${item.isPercentage ? "bg-main-color text-white" : "border border-gray-300"}`}
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
                            className="w-24 rounded-full border border-gray-300 px-4 py-3 focus:border-main-color focus:outline-none text-right"
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
                            className="w-40 rounded-full border border-gray-300 px-4 py-3 focus:border-main-color focus:outline-none text-right"
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
                className={`w-5 h-5 rounded-full flex items-center justify-center ${scheduleInputMethod === "form" ? "bg-main-color text-white" : "border border-gray-300"}`}
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
                className={`w-5 h-5 rounded-full flex items-center justify-center ${scheduleInputMethod === "direct" ? "bg-main-color text-white" : "border border-gray-300"}`}
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

                  <button
                    type="button"
                    className="ml-4 text-main-color hover:text-secondary-color-dark"
                    onClick={() => openScheduleDetailsDialog(schedule.id)}
                  >
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
          className="bg-main-color hover:bg-secondary-color-dark text-white font-bold py-3 px-8 rounded-full"
        >
          선택 내용 자동 채우기
        </button>
      </div>

      {/* 마크다운 에디터 */}
      <div className="flex flex-col mt-8">
        <h2 className="text-xl font-bold mb-4">상품 상세 설명</h2>
        <MarkdownEditor value={markdown} onChange={setMarkdown} />
      </div>

      {/* 일정 내용 다이얼로그 */}
      {scheduleDetailsDialogOpen && currentScheduleId !== null && (
        <ScheduleDetailsDialog
          isOpen={scheduleDetailsDialogOpen}
          onClose={() => setScheduleDetailsDialogOpen(false)}
          details={schedules.find((schedule) => schedule.id === currentScheduleId)?.details || ""}
          onSave={saveScheduleDetails}
          scheduleIndex={schedules.findIndex((schedule) => schedule.id === currentScheduleId)}
        />
      )}

    </div>
  )
}
