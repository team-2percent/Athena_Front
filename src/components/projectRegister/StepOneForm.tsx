"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Upload, ChevronDown, Check, Trash2 } from "lucide-react"
import DatePicker from "./DatePicker"
import { useApi } from "@/hooks/useApi"

import { useProjectFormStore, type ImageFile, type Category } from "@/stores/useProjectFormStore"
import { VALIDATION_MESSAGES } from "@/lib/validationMessages"
import { TextInput } from "@/components/common/Input"
import TextArea from "@/components/common/TextArea"

interface StepOneFormProps {
  onUpdateFormData: (data: Partial<any>) => void
  formData?: any
  initialData?: any
}

export default function StepOneForm({ onUpdateFormData }: StepOneFormProps) {
  // API 호출 훅 사용
  const { apiCall, isLoading: apiLoading } = useApi()

  // Zustand 스토어에서 상태 가져오기
  const {
    targetAmount,
    category,
    categoryId,
    title,
    description,
    startDate,
    endDate,
    deliveryDate,
    images,
    validationErrors,
    validateStepOne,
  } = useProjectFormStore()

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 각 필드의 터치 상태 관리 (최초 입력 전까지는 에러 표시하지 않음)
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({})

  // 최소 펀딩 시작일: 오늘로부터 8일째 되는 날 (한국 시간 기준)
  const getMinStartDate = () => {
    const today = new Date()
    const minStartDate = new Date(today)
    minStartDate.setDate(today.getDate() + 7) // 오늘 + 7일
    return minStartDate
  }

  // 최소 배송일 계산 (종료일 + 7일)
  const getMinDeliveryDate = () => {
    if (!endDate) return getMinStartDate() // 종료일이 없으면 시작일 기준
    const minDeliveryDate = new Date(endDate)
    minDeliveryDate.setDate(endDate.getDate() + 7)
    return minDeliveryDate
  }

  // 카테고리 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true)
      try {
        const response = await apiCall<Category[]>("/api/category", "GET")
        if (response.data) {
          setCategories(response.data)
        } else {
          console.error("카테고리 목록을 가져오는데 실패했습니다:", response.error)
        }
      } catch (error) {
        console.error("카테고리 API 호출 중 오류 발생:", error)
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [apiCall])

  // 폼 데이터 변경 시 유효성 검사 실행
  useEffect(() => {
    validateStepOne()
  }, [targetAmount, categoryId, title, description, startDate, endDate, deliveryDate, images, validateStepOne])

  // 필드 터치 처리
  const handleFieldTouch = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }))
  }

  const handleCategorySelect = (selectedCategory: Category) => {
    setIsCategoryDropdownOpen(false)
    handleFieldTouch("categoryId")
    onUpdateFormData({
      category: selectedCategory.categoryName,
      categoryId: selectedCategory.id,
    })
  }

  // 숫자만 입력 가능하도록 처리
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "")

    // 앞자리 0 제거 (단, "0" 하나만 있는 경우는 유지)
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "")
    }

    handleFieldTouch("targetAmount")

    // 10억 제한: 10억 초과 입력 시 10억으로 강제 세팅(에러 메시지는 zod가 담당)
    const numericValue = Number(value)
    if (numericValue > 1000000000) {
      setForceTargetAmountMaxError(true)
      onUpdateFormData({ targetAmount: "1000000000" })
    } else {
      setForceTargetAmountMaxError(false)
      onUpdateFormData({ targetAmount: value })
    }
  }

  // 천 단위 콤마 포맷팅
  const formatAmount = (amount: string) => {
    if (!amount) return ""
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // 시작일 변경 핸들러
  const handleStartDateChange = (date: Date) => {
    handleFieldTouch("startDate")
    onUpdateFormData({ startDate: date })

    // 종료일이 시작일보다 이전이면 시작일 + 30일로 설정
    if (!endDate || endDate <= date) {
      const newEndDate = new Date(date)
      newEndDate.setDate(newEndDate.getDate() + 30)
      onUpdateFormData({ endDate: newEndDate })
    }
  }

  // 종료일 변경 핸들러
  const handleEndDateChange = (date: Date) => {
    handleFieldTouch("endDate")
    onUpdateFormData({ endDate: date })

    // 배송일이 종료일 + 7일보다 이전이면 종료일 + 7일로 설정
    const minDeliveryDate = new Date(date)
    minDeliveryDate.setDate(date.getDate() + 7)

    if (!deliveryDate || deliveryDate < minDeliveryDate) {
      onUpdateFormData({ deliveryDate: minDeliveryDate })
    }
  }

  // 배송일 변경 핸들러
  const handleDeliveryDateChange = (date: Date) => {
    handleFieldTouch("deliveryDate")
    onUpdateFormData({ deliveryDate: date })
  }

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

      newImages.push({
        id,
        file,
        preview,
        isExisting: false,
      })
    }

    const updatedImages = [...images, ...newImages]
    handleFieldTouch("images")
    onUpdateFormData({ images: updatedImages })
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
    const imageToRemove = images.find((img) => img.id === id)
    const updatedImages = images.filter((img) => img.id !== id)
    onUpdateFormData({ images: updatedImages })

    // File 객체로부터 생성된 미리보기 URL만 해제
    if (imageToRemove && imageToRemove.preview && !imageToRemove.isExisting) {
      URL.revokeObjectURL(imageToRemove.preview)
    }
  }

  // 이미지 파일명 또는 URL에서 표시 이름 추출
  const getImageDisplayName = (image: ImageFile) => {
    if (image.file) {
      return image.file.name
    }
    if (image.url) {
      // URL에서 파일명 추출
      const urlParts = image.url.split("/")
      return urlParts[urlParts.length - 1]
    }
    return "이미지"
  }

  // 에러 메시지 가져오기 함수 (터치된 필드만 에러 표시)
  const getErrorMessage = (fieldName: string) => {
    if (!touchedFields[fieldName]) return ""
    return validationErrors[fieldName]?.[0] || ""
  }

  // 필드 스타일 결정 함수 (터치된 필드만 에러 스타일 적용)
  const getFieldStyle = (fieldName: string) => {
    if (!touchedFields[fieldName]) return "border-gray-300 focus:border-main-color"
    return getErrorMessage(fieldName)
      ? "border-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-main-color"
  }

  const [forceTitleMaxError, setForceTitleMaxError] = useState(false)
  const [forceDescriptionMaxError, setForceDescriptionMaxError] = useState(false)
  const [forceTargetAmountMaxError, setForceTargetAmountMaxError] = useState(false)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFieldTouch("title")
    if (e.target.value.length > 25) {
      setForceTitleMaxError(true)
      onUpdateFormData({ title: e.target.value.slice(0, 25) })
    } else {
      setForceTitleMaxError(false)
      onUpdateFormData({ title: e.target.value })
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleFieldTouch("description")
    if (e.target.value.length > 50) {
      setForceDescriptionMaxError(true)
      onUpdateFormData({ description: e.target.value.slice(0, 50) })
    } else {
      setForceDescriptionMaxError(false)
      onUpdateFormData({ description: e.target.value })
    }
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
              className={`flex w-full items-center justify-between rounded-full border px-4 py-3 text-left focus:outline-none ${getFieldStyle(
                "categoryId",
              )} ${getErrorMessage("categoryId") ? "text-red-700" : "text-gray-700"}`}
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              disabled={categoriesLoading}
            >
              {categoriesLoading ? (
                <span className="text-gray-400">카테고리 로딩 중...</span>
              ) : category ? (
                <span>{category}</span>
              ) : (
                <span className="text-gray-400">카테고리를 선택해주세요</span>
              )}
              <ChevronDown className="h-5 w-5" />
            </button>
            {isCategoryDropdownOpen && categories.length > 0 && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-100"
                    onClick={() => handleCategorySelect(cat)}
                  >
                    <span>{cat.categoryName}</span>
                    {category === cat.categoryName && <Check className="h-5 w-5 text-main-color" />}
                  </div>
                ))}
              </div>
            )}
          </div>
          {getErrorMessage("categoryId") && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage("categoryId")}</p>
          )}
        </div>
      </div>

      {/* 프로젝트 제목 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <label htmlFor="title" className="text-xl font-bold mb-4">
          프로젝트 제목
          <span className="text-sm text-gray-500 ml-2">(25자 이하)</span>
        </label>
        <div className="w-full">
          <TextInput
            id="title"
            value={title}
            designType="outline-rect"
            onChange={handleTitleChange}
            placeholder="프로젝트 이름을 지어주세요"
            className={getFieldStyle("title") + " w-full px-4 py-3"}
            isError={!!getErrorMessage("title") || !!forceTitleMaxError}
          />
          <div className="flex justify-between items-center mt-2">
            {(getErrorMessage("title") || forceTitleMaxError) && (
              <p className="text-red-500 text-sm">{getErrorMessage("title") || VALIDATION_MESSAGES.TITLE_MAX}</p>
            )}
            <p className="text-gray-400 text-sm ml-auto">{title.length}/25</p>
          </div>
        </div>
      </div>

      {/* 프로젝트 요약 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <label htmlFor="description" className="text-xl font-bold mb-4">
          프로젝트 요약
          <span className="text-sm text-gray-500 ml-2">(10자 이상 50자 이하)</span>
        </label>
        <div className="w-full">
          <TextArea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="프로젝트에 대한 간략한 설명을 입력하세요"
            className={getFieldStyle("description") + " w-full px-4 py-3 min-h-[150px]"}
            isError={!!getErrorMessage("description") || !!forceDescriptionMaxError}
          />
          <div className="flex justify-between items-center mt-1">
            {(getErrorMessage("description") || forceDescriptionMaxError) && (
              <p className="text-red-500 text-sm">{getErrorMessage("description") || VALIDATION_MESSAGES.DESCRIPTION_MAX}</p>
            )}
            <p className="text-gray-400 text-sm ml-auto">{description.length}/50</p>
          </div>
        </div>
      </div>

      {/* 대표 이미지 - 세로 배치로 변경 (필수 표시 추가) */}
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-bold">
            대표 이미지
          </h3>
        </div>
        <div className="w-full">
          <div className={`rounded-3xl border p-6 ${getFieldStyle("images")}`}>
            {/* 드래그 앤 드롭 영역 */}
            <div
              className={`border-2 border-dashed rounded-lg p-4 transition-colors relative ${
                isDragging ? "border-main-color bg-secondary-color" : "border-gray-300"
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* 드래그 중일 때 오버레이 */}
              {isDragging && images.length < 5 && (
                <div className="absolute inset-0 bg-secondary-color bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
                  <p className="text-xl font-medium text-secondary-color-dark">여기에 이미지를 놓으세요</p>
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
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {getImageDisplayName(image)}
                          {image.isExisting && <span className="ml-1 text-blue-500">(기존)</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 안내 텍스트 */}
            <div className="mt-4">
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>첫 번째에 있는 이미지가 대표 썸네일이 됩니다.</li>
                <li>최대 5개까지 업로드 가능합니다.</li>
                <li>JPEG 파일만 업로드 가능합니다.</li>
                <li>초상권, 저작권, 명예훼손 등의 우려가 있는 이미지는 사용을 삼가 주시기 바랍니다.</li>
                <li>이미지 사용에 따른 법적 책임은 게시자 본인에게 있습니다.</li>
              </ul>
            </div>
          </div>
          {getErrorMessage("images") && <p className="text-red-500 text-sm mt-2">{getErrorMessage("images")}</p>}
        </div>
      </div>

      {/* 목표 금액 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-bold">
            목표 금액
          </h3>
          <span className="text-sm text-gray-500 ml-4">* 최대 10억 원까지 입력 가능합니다.</span>
        </div>

        <div className="w-full max-w-md flex items-center">
          <TextInput
            id="targetAmount"
            designType="outline-rect"
            value={formatAmount(targetAmount)}
            onChange={handleAmountChange}
            placeholder="0"
            className={getFieldStyle("targetAmount") + " w-full px-4 py-3 text-right"}
            isError={!!getErrorMessage("targetAmount") || !!forceTargetAmountMaxError}
            align="right"
          />
          <span className="ml-2 text-lg">원</span>
        </div>
        {(getErrorMessage("targetAmount") || forceTargetAmountMaxError) && (
          <p className="text-red-500 text-sm mt-2">{getErrorMessage("targetAmount") || VALIDATION_MESSAGES.TARGET_AMOUNT_MAX}</p>
        )}
      </div>

      {/* 펀딩 일정 - 세로 배치로 변경 */}
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-bold">
            펀딩 일정
          </h3>
          <span className="text-sm text-gray-500 ml-4">* 펀딩 시작일은 오늘의 일주일 뒤부터 선택 가능합니다.</span>
        </div>
        <div className="flex items-center gap-4">
          <DatePicker
            selectedDate={startDate}
            onChange={handleStartDateChange}
            position="top"
            minDate={getMinStartDate()}
            dataCy="datepicker-start"
          />
          <span>부터</span>
          <DatePicker
            selectedDate={endDate}
            onChange={handleEndDateChange}
            position="top"
            minDate={startDate || getMinStartDate()}
            dataCy="datepicker-end"
          />
          <span>까지</span>
        </div>
        {(getErrorMessage("startDate") || getErrorMessage("endDate")) && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage("startDate") || getErrorMessage("endDate")}</p>
        )}
      </div>

      {/* 배송 예정일 - 새로 추가 */}
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-bold">
            배송 예정일
          </h3>
          <span className="text-sm text-gray-500 ml-4">* 펀딩 종료일의 일주일 뒤부터 선택 가능합니다.</span>
        </div>
        <div className="flex items-center gap-4">
          <DatePicker
            selectedDate={deliveryDate}
            onChange={handleDeliveryDateChange}
            position="top"
            minDate={getMinDeliveryDate()}
            dataCy="datepicker-delivery"
          />
        </div>
        {getErrorMessage("deliveryDate") && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage("deliveryDate")}</p>
        )}
      </div>
    </div>
  )
}
