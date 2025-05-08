"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, ChevronDown, Check } from "lucide-react"
import DatePicker from "./DatePicker"

interface StepOneFormProps {
  formData: {
    targetAmount: string
  }
  onUpdateFormData: (data: Partial<{ targetAmount: string }>) => void
}

export default function StepOneForm({ formData, onUpdateFormData }: StepOneFormProps) {
  const [category, setCategory] = useState("책")
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [targetAmount, setTargetAmount] = useState(formData.targetAmount || "")
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 21))) // 기본값: 오늘로부터 21일 후
  const [deliveryDate, setDeliveryDate] = useState(() => {
    // 기본값: 펀딩 종료일 + 7일
    const date = new Date(endDate)
    date.setDate(date.getDate() + 7)
    return date
  })
  const [minDeliveryDate, setMinDeliveryDate] = useState(() => {
    // 최소 배송일: 펀딩 종료일 + 7일
    const date = new Date(endDate)
    date.setDate(date.getDate() + 7)
    return date
  })

  const categoryOptions = ["책", "예술", "음악", "공예", "디자인"]

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory)
    setIsCategoryDropdownOpen(false)
  }

  // 숫자만 입력 가능하도록 처리
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setTargetAmount(value)
    onUpdateFormData({ targetAmount: value })
  }

  // 천 단위 콤마 포맷팅
  const formatAmount = (amount: string) => {
    if (!amount) return ""
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // 펀딩 종료일이 변경될 때 최소 배송일 업데이트
  useEffect(() => {
    const newMinDeliveryDate = new Date(endDate)
    newMinDeliveryDate.setDate(newMinDeliveryDate.getDate() + 7)
    setMinDeliveryDate(newMinDeliveryDate)

    // 현재 배송일이 새로운 최소 배송일보다 이전이면 최소 배송일로 설정
    if (deliveryDate < newMinDeliveryDate) {
      setDeliveryDate(newMinDeliveryDate)
    }
  }, [endDate, deliveryDate])

  // Initialize form data from props
  useEffect(() => {
    if (formData.targetAmount && !targetAmount) {
      setTargetAmount(formData.targetAmount)
    }
  }, [formData])

  return (
    <div className="space-y-8">
      {/* 카테고리 선택 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <label htmlFor="category" className="text-xl font-bold mb-4">
          카테고리 선택
        </label>
        <div className="w-full max-w-md">
          <div className="relative">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-full border border-gray-300 px-4 py-3 text-left text-gray-700 focus:outline-none"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <span>{category}</span>
              <ChevronDown className="h-5 w-5" />
            </button>
            {isCategoryDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                {categoryOptions.map((option) => (
                  <div
                    key={option}
                    className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-100"
                    onClick={() => handleCategorySelect(option)}
                  >
                    <span>{option}</span>
                    {category === option && <Check className="h-5 w-5 text-pink-500" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 상품 제목 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <label htmlFor="title" className="text-xl font-bold mb-4">
          상품 제목
        </label>
        <div className="w-full">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="상품명을 입력해 주세요."
            className="w-full rounded-full border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 상품 요약 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <label htmlFor="description" className="text-xl font-bold mb-4">
          상품 요약
        </label>
        <div className="w-full">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="상품에 대한 간략한 설명을 입력하세요"
            className="w-full rounded-3xl border border-gray-300 px-4 py-3 min-h-[150px] focus:border-pink-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 대표 이미지 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <label htmlFor="image" className="text-xl font-bold mb-4">
          대표 이미지
        </label>
        <div className="w-full">
          <div className="rounded-3xl border border-gray-300 p-6">
            <div className="flex flex-col md:flex-row">
              {/* 이미지 미리보기 영역 */}
              <div className="h-60 w-full md:w-60 bg-gray-200 rounded-lg flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                {/* 실제 이미지 업로드 기능은 아직 구현하지 않음 */}
              </div>

              {/* 업로드 버튼 및 안내 */}
              <div className="flex-1">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full bg-gray-100 px-6 py-3 text-gray-800 mb-4"
                >
                  <Upload className="h-5 w-5" />
                  업로드 하기
                </button>

                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>최대 20000개까지 업로드 가능합니다.</li>
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

      {/* 목표 금액 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <label htmlFor="targetAmount" className="text-xl font-bold mb-4">
          목표 금액
        </label>
        <div className="w-full max-w-md flex items-center">
          <input
            id="targetAmount"
            type="text"
            value={formatAmount(targetAmount)}
            onChange={handleAmountChange}
            placeholder="0"
            className="w-full rounded-full border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none text-right"
          />
          <span className="ml-2 text-lg">원</span>
        </div>
      </div>

      {/* 펀딩 일정 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <label htmlFor="fundingPeriod" className="text-xl font-bold mb-4">
          펀딩 일정
        </label>
        <div className="flex items-center gap-4">
          <DatePicker selectedDate={startDate} onChange={setStartDate} position="top" />
          <span>부터</span>
          <DatePicker selectedDate={endDate} onChange={setEndDate} position="top" />
          <span>까지</span>
        </div>
      </div>

      {/* 배송 예정일 - 새로 추가 */}
      <div className="flex flex-col">
        <label htmlFor="deliveryDate" className="text-xl font-bold mb-4">
          배송 예정일
        </label>
        <div className="flex items-center gap-4">
          <DatePicker selectedDate={deliveryDate} onChange={setDeliveryDate} position="top" minDate={minDeliveryDate} />
          <span className="text-gray-500 text-sm">* 펀딩 종료일의 7일째 되는 날부터 선택 가능합니다.</span>
        </div>
      </div>
    </div>
  )
}
