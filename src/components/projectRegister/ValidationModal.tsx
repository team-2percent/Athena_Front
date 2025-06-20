"use client"

import { Check, X, AlertCircle } from "lucide-react"
import { useProjectFormStore } from "@/stores/useProjectFormStore"
import { CancelButton, PrimaryButton } from "../common/Button"
import gsap from "gsap"
import { useRef, useEffect } from "react"
import Modal from "../common/Modal"

interface ValidationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

interface ValidationItem {
  label: string
  isValid: boolean
  step: number
}

export default function ValidationModal({ isOpen, onClose, onConfirm }: ValidationModalProps) {
  const {
    categoryId,
    title,
    description,
    images,
    targetAmount,
    startDate,
    endDate,
    deliveryDate,
    markdown,
    supportOptions,
    platformPlan,
    bankAccountId,
  } = useProjectFormStore()

  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      )
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out", delay: 0.05 }
      )
    }
  }, [isOpen])

  // 각 항목의 유효성 검사
  const validationItems: ValidationItem[] = [
    // 1단계 항목들
    {
      label: "카테고리 선택",
      isValid: categoryId !== null && categoryId > 0,
      step: 1,
    },
    {
      label: "상품 제목",
      isValid: title.trim().length >= 2 && title.trim().length <= 25,
      step: 1,
    },
    {
      label: "상품 요약",
      isValid: description.trim().length >= 10 && description.trim().length <= 50,
      step: 1,
    },
    {
      label: "목표 금액",
      isValid: targetAmount.trim() !== "" && Number.parseInt(targetAmount.replace(/,/g, ""), 10) > 0,
      step: 1,
    },
    {
      label: "펀딩 시작일",
      isValid: startDate !== null,
      step: 1,
    },
    {
      label: "펀딩 종료일",
      isValid: endDate !== null,
      step: 1,
    },
    {
      label: "배송 예정일",
      isValid: deliveryDate !== null,
      step: 1,
    },
    {
      label: "대표 이미지",
      isValid: images.length > 0,
      step: 1,
    },
    // 2단계 항목들
    {
      label: "상품 상세 설명",
      isValid: markdown.trim().length > 0,
      step: 2,
    },
    // 3단계 항목들
    {
      label: "후원 상품 설정",
      isValid:
        supportOptions.length > 0 &&
        supportOptions.every(
          (option) =>
            option.name.trim() !== "" &&
            option.description.trim() !== "" &&
            option.price.trim() !== "" &&
            option.stock.trim() !== "" &&
            Number.parseInt(option.price.replace(/,/g, ""), 10) > 0 &&
            Number.parseInt(option.stock.replace(/,/g, ""), 10) > 0,
        ),
      step: 3,
    },
    {
      label: "플랜 선택",
      isValid: platformPlan !== null,
      step: 3,
    },
    {
      label: "계좌 정보",
      isValid: bankAccountId !== null && bankAccountId > 0,
      step: 3,
    },
  ]

  // 선택사항 항목들
  const optionalItems: ValidationItem[] = [
    // 현재 선택사항 없음 (대표 이미지가 필수로 이동)
  ]

  const validCount = validationItems.filter((item) => item.isValid).length
  const totalCount = validationItems.length
  const allValid = validCount === totalCount

  const validOptionalCount = optionalItems.filter((item) => item.isValid).length
  const totalOptionalCount = optionalItems.length

  // 단계별로 그룹화
  const step1Items = validationItems.filter((item) => item.step === 1)
  const step2Items = validationItems.filter((item) => item.step === 2)
  const step3Items = validationItems.filter((item) => item.step === 3)
  const step1OptionalItems = optionalItems.filter((item) => item.step === 1)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="프로젝트 등록 확인"
      size="lg"
      showCloseButton={true}
      closeOnOutsideClick={true}
      className="max-w-lg p-6 max-h-[80vh] overflow-y-auto"
      dataCy="validation-modal"
    >
      {/* 전체 진행률 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">필수 항목 완료</span>
          <span className="text-sm font-medium">
            {validCount}/{totalCount}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${allValid ? "bg-green-500" : "bg-main-color"}`}
            style={{ width: `${(validCount / totalCount) * 100}%` }}
          />
        </div>
        {!allValid && (
          <div className="flex items-center mt-2 text-amber-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span className="text-xs">미완료 항목이 있습니다. 모든 필수 항목을 완료해주세요.</span>
          </div>
        )}
      </div>

      {/* 1단계 항목들 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-main-color">기본 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {step1Items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-center py-2 px-2 rounded-lg border text-xs text-gray-700 break-keep gap-2 transition-colors
                ${item.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
              `}
            >
              <span className="flex-1 text-center">{item.label}</span>
              {item.isValid ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
            </div>
          ))}
        </div>
        {/* 선택사항 */}
        {optionalItems.length > 0 && (
          <div className="border-t pt-2 mt-3">
            <h4 className="text-sm font-medium text-gray-600 mb-2">선택사항</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {step1OptionalItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center py-2 px-2 rounded-lg border text-xs text-gray-600 break-keep gap-2 transition-colors
                    ${item.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
                  `}
                >
                  <span className="flex-1 text-center">{item.label}</span>
                  {item.isValid ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2단계 항목들 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-main-color">상세 설명</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {step2Items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-center py-2 px-2 rounded-lg border text-xs text-gray-700 break-keep gap-2 transition-colors
                ${item.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
              `}
            >
              <span className="flex-1 text-center">{item.label}</span>
              {item.isValid ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3단계 항목들 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-main-color">후원 설정</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {step3Items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-center py-2 px-2 rounded-lg border text-xs text-gray-700 break-keep gap-2 transition-colors
                ${item.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
              `}
            >
              <span className="flex-1 text-center">{item.label}</span>
              {item.isValid ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-3 mt-6">
        <CancelButton
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-full hover:bg-gray-300 transition-colors"
        >
          취소
        </CancelButton>
        <PrimaryButton
          type="button"
          onClick={onConfirm}
          disabled={!allValid}
          className={`flex-1 font-medium py-3 px-4 rounded-full transition-colors ${
            allValid
              ? "bg-main-color text-white hover:bg-secondary-color-dark"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {allValid ? "등록하기" : "미완료 항목 있음"}
        </PrimaryButton>
      </div>

      {!allValid && (
        <p className="text-xs text-gray-500 text-center mt-2">* 모든 필수 항목을 완료한 후 등록할 수 있습니다.</p>
      )}
    </Modal>
  )
}
