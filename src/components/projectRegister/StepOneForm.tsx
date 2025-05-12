"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Upload, ChevronDown, Check, Trash2 } from "lucide-react"
import DatePicker from "./DatePicker"

interface ImageFile {
  id: string
  file: File
  preview: string
}

interface StepOneFormProps {
  formData: {
    targetAmount: string
  }
  onUpdateFormData: (data: Partial<{ targetAmount: string }>) => void
  initialData?: {
    category?: string
    title?: string
    description?: string
    targetAmount?: string
    startDate?: Date
    endDate?: Date
    deliveryDate?: Date
    images?: ImageFile[]
  }
}

export default function StepOneForm({ formData, onUpdateFormData, initialData }: StepOneFormProps) {
  const [category, setCategory] = useState(initialData?.category || "책")
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [targetAmount, setTargetAmount] = useState(formData.targetAmount || initialData?.targetAmount || "")
  const [targetAmountError, setTargetAmountError] = useState("")
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date())
  const [endDate, setEndDate] = useState(
    initialData?.endDate || new Date(new Date().setDate(new Date().getDate() + 21)),
  ) // 기본값: 오늘로부터 21일 후
  const [deliveryDate, setDeliveryDate] = useState(
    initialData?.deliveryDate ||
      (() => {
        // 기본값: 펀딩 종료일 + 7일
        const date = new Date(endDate)
        date.setDate(date.getDate() + 7)
        return date
      }),
  )
  const [minDeliveryDate, setMinDeliveryDate] = useState(() => {
    // 최소 배송일: 펀딩 종료일 + 7일
    const date = new Date(endDate)
    date.setDate(date.getDate() + 7)
    return date
  })
  const [images, setImages] = useState<ImageFile[]>(initialData?.images || [])
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categoryOptions = ["책", "예술", "음악", "공예", "디자인"]

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory)
    setIsCategoryDropdownOpen(false)
  }

  // 숫자만 입력 가능하도록 처리
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")

    // 100억 제한 검사
    const numericValue = Number(value)
    if (numericValue > 10000000000) {
      setTargetAmountError("목표 금액은 최대 100억원까지 설정 가능합니다.")
      // 100억으로 제한
      setTargetAmount("10000000000")
      onUpdateFormData({ targetAmount: "10000000000" })
    } else {
      setTargetAmountError("")
      setTargetAmount(value)
      onUpdateFormData({ targetAmount: value })
    }
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

  // 이미지 미리보기 URL 정리
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 미리보기 URL 해제
      images.forEach((image) => URL.revokeObjectURL(image.preview))
    }
  }, [images])

  // 파일 처리 함수
  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const newImages: ImageFile[] = []

    // 최대 5개까지만 처리
    const remainingSlots = 5 - images.length
    const filesToProcess = Math.min(remainingSlots, files.length)

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i]

      // 이미지 파일인지 확인
      if (!file.type.startsWith("image/")) continue

      const id = `img-${Date.now()}-${i}`
      const preview = URL.createObjectURL(file)

      newImages.push({ id, file, preview })
    }

    setImages((prev) => [...prev, ...newImages])
  }

  // 드래그 앤 드롭 이벤트 핸들러
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current += 1
    if (dragCounter.current === 1) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current -= 1
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    const { files } = e.dataTransfer
    handleFiles(files)
  }

  // 파일 선택 버튼 클릭 핸들러
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // 파일 입력 변경 핸들러
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  // 이미지 삭제 핸들러
  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

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
          대표 이미지 <span className="text-sm text-gray-500 font-normal">(최대 5개까지 업로드 가능)</span>
        </label>
        <div className="w-full">
          <div className="rounded-3xl border border-gray-300 p-6">
            {/* 드래그 앤 드롭 영역 */}
            <div
              className={`border-2 border-dashed rounded-lg p-4 transition-colors relative ${
                isDragging ? "border-pink-400 bg-pink-50" : "border-gray-300"
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* 드래그 중일 때 오버레이 */}
              {isDragging && images.length < 5 && (
                <div className="absolute inset-0 bg-pink-50 bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
                  <p className="text-xl font-medium text-pink-600">여기에 이미지를 놓으세요</p>
                </div>
              )}

              {images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-1">이미지를 여기에 드래그하거나</p>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-6 py-3 text-gray-800 mt-2 hover:bg-gray-200"
                  >
                    <Upload className="h-5 w-5" />
                    파일 선택하기
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">업로드된 이미지 ({images.length}/5)</h3>
                    {images.length < 5 && (
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-gray-800 text-sm hover:bg-gray-200"
                      >
                        <Upload className="h-4 w-4" />
                        추가 업로드
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group" onDragEnter={(e) => e.stopPropagation()}>
                        <div className="h-40 w-full rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={image.preview || "/placeholder.svg"}
                            alt={`업로드 이미지 ${image.id}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image.id)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-70 hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">{image.file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 안내 텍스트 */}
            <div className="mt-4">
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>최대 5개까지 업로드 가능합니다.</li>
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

      {/* 목표 금액 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-bold">목표 금액</h3>
          <span className="text-sm text-gray-500 ml-4">* 최대 100억원까지 입력 가능합니다.</span>
        </div>

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
          <DatePicker selectedDate={endDate} onChange={setEndDate} position="top" minDate={startDate} />
          <span>까지</span>
        </div>
      </div>

      {/* 배송 예정일 - 새로 추가 */}
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-bold">배송 예정일</h3>
          <span className="text-sm text-gray-500 ml-4">* 펀딩 종료일의 7일째 되는 날부터 선택 가능합니다.</span>
        </div>
        <div className="flex items-center gap-4">
          <DatePicker selectedDate={deliveryDate} onChange={setDeliveryDate} position="top" minDate={minDeliveryDate} />
        </div>
      </div>
    </div>
  )
}
