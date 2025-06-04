"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { X } from "lucide-react"
import clsx from "clsx"
import gsap from "gsap"
import ReactDOM from "react-dom"

// 버튼 타입 정의 추가
type ButtonVariant = "primary" | "secondary" | "danger" | "outline"

// 버튼 컴포넌트 추가
interface ModalButtonProps {
  onClick: () => void
  variant?: ButtonVariant
  children: ReactNode
  className?: string
  disabled?: boolean
  dataCy?: string
}

// 텍스트 스타일 컴포넌트 추가
interface ModalTextProps {
  children: ReactNode
  variant?: "title" | "subtitle" | "body" | "caption"
  className?: string
}

// Modal 컴포넌트 내부에 다음 컴포넌트들을 추가합니다 (export default function Modal 위에 추가)
function ModalButton({ onClick, variant = "primary", children, className = "", disabled = false, dataCy }: ModalButtonProps) {
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
      data-cy={dataCy}
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
  zIndex?: number | string
  dataCy?: string
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
  zIndex = 50,  
  dataCy,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(isOpen)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 모달 mount/unmount 관리
  useEffect(() => {
    if (isOpen) {
      setVisible(true)
    } else if (visible) {
      // 퇴장 애니메이션 실행 후 unmount
      if (modalRef.current && overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.12,
          ease: "power2.in",
        })
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            closeTimeoutRef.current = setTimeout(() => setVisible(false), 0)
          },
        })
      } else {
        setVisible(false)
      }
    }
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [isOpen])

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
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // 모달 등장 애니메이션
  useEffect(() => {
    if (visible && isOpen && modalRef.current && overlayRef.current) {
      // 초기값 강제 세팅 (깜빡임 방지)
      gsap.set(overlayRef.current, { opacity: 0 })
      gsap.set(modalRef.current, { opacity: 0, scale: 0.95 })
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.12, ease: "power2.out" }
      )
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.15, ease: "power2.out", delay: 0.03 }
      )
    }
  }, [visible, isOpen])

  if (!visible) return null

  // 모달 크기에 따른 최대 너비 설정
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  }

  const modalContent = (
    <>
      {/* 배경 오버레이 */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60"
        style={{ zIndex: typeof zIndex === "number" ? zIndex : undefined }}
        onClick={e => {
          e.stopPropagation();
          if (closeOnOutsideClick) onClose();
        }}
      />

      {/* 모달 */}
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: typeof zIndex === "number" ? zIndex : undefined }}
        onMouseDown={e => e.stopPropagation()}
        data-cy={dataCy}
      >
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
                  data-cy="modal-close-button"
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

  return ReactDOM.createPortal(modalContent, typeof window !== "undefined" ? document.body : ({} as HTMLElement))
}

// Modal 인터페이스에 static 속성 추가 (export default function Modal 아래에 추가)
// 파일 맨 마지막에 다음 코드 추가
Modal.Button = ModalButton
Modal.Text = ModalText

// 타입 정의를 위한 코드 추가
export type { ButtonVariant, ModalButtonProps, ModalTextProps }
