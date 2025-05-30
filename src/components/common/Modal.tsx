"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { X } from "lucide-react"
import clsx from "clsx"

// 버튼 타입 정의 추가
type ButtonVariant = "primary" | "secondary" | "danger" | "outline"

// 버튼 컴포넌트 추가
interface ModalButtonProps {
  onClick: () => void
  variant?: ButtonVariant
  children: ReactNode
  className?: string
  disabled?: boolean
}

// 텍스트 스타일 컴포넌트 추가
interface ModalTextProps {
  children: ReactNode
  variant?: "title" | "subtitle" | "body" | "caption"
  className?: string
}

// Modal 컴포넌트 내부에 다음 컴포넌트들을 추가합니다 (export default function Modal 위에 추가)
function ModalButton({ onClick, variant = "primary", children, className = "", disabled = false }: ModalButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors"

  const variantStyles = {
    primary: "bg-main-color text-white hover:bg-secondary-color-dark",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-main-color text-main-color hover:bg-secondary-color/10",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseStyles, variantStyles[variant], disabled && "opacity-50 cursor-not-allowed", className)}
    >
      {children}
    </button>
  )
}

function ModalText({ children, variant = "body", className = "" }: ModalTextProps) {
  const variantStyles = {
    title: "text-xl font-bold",
    subtitle: "text-lg font-medium",
    body: "text-base",
    caption: "text-sm text-gray-500",
  }

  return <div className={clsx(variantStyles[variant], className)}>{children}</div>
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  showCloseButton?: boolean
  size?: "sm" | "md" | "lg" | "xl" | "full"
  closeOnOutsideClick?: boolean
  closeOnEsc?: boolean
  className?: string
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  size = "md",
  closeOnOutsideClick = true,
  closeOnEsc = true,
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose, closeOnOutsideClick])

  // ESC 키 누르면 모달 닫기
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (closeOnEsc && event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose, closeOnEsc])

  // 모달 뒷배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden"
    }

    return () => {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  // 모달 크기에 따른 최대 너비 설정
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  }

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black/60 z-50" onClick={closeOnOutsideClick ? onClose : undefined} />

      {/* 모달 */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div
          ref={modalRef}
          className={clsx(
            "bg-white rounded-3xl w-full p-6 shadow-lg pointer-events-auto relative",
            sizeClasses[size],
            className,
          )}
        >
          {/* 헤더 (제목이 있는 경우에만 표시) */}
          {(title || showCloseButton) && (
            <div className="flex justify-between items-center mb-4">
              {title && <h2 className="text-xl font-bold">{title}</h2>}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="닫기"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>
          )}

          {/* 모달 내용 */}
          <div>{children}</div>
        </div>
      </div>
    </>
  )
}

// Modal 인터페이스에 static 속성 추가 (export default function Modal 아래에 추가)
// 파일 맨 마지막에 다음 코드 추가
Modal.Button = ModalButton
Modal.Text = ModalText

// 타입 정의를 위한 코드 추가
export type { ButtonVariant, ModalButtonProps, ModalTextProps }
