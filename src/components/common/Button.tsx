import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

// 버튼 변형(variant) 타입 정의
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "cancel"
  | "primary-disabled"
  | "secondary-disabled"
  | "outline"
  | "danger"
  | "ghost"
  | "ghostDanger"

// 버튼 크기(size) 타입 정의
export type ButtonSize = "sm" | "md" | "lg"

// 버튼 너비(width) 타입 정의
export type ButtonWidth = "auto" | "full"

// 버튼 컴포넌트 Props 타입 정의
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  width?: ButtonWidth
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  className?: string
  dataCy?: string
}

// 기본 버튼 컴포넌트
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  width = "auto",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  dataCy,
  ...props
}: ButtonProps) => {
  // disabled 상태에 따라 variant 조정
  let finalVariant = variant
  if (disabled) {
    if (variant === "primary") finalVariant = "primary-disabled"
    else if (variant === "secondary") finalVariant = "secondary-disabled"
    // 다른 variant는 그대로 유지 (cancel, outline, ghost 등)
  }

  // variant에 따른 스타일 클래스
  const variantClasses = {
    primary: "bg-primary hover:bg-primary-hover text-white border-transparent",
    secondary: "box-border bg-secondary border border-secondary-foreground text-secondary-foreground hover:bg-secondary-hover",
    cancel: "bg-error hover:bg-error-hover/50 text-white border-transparent",
    "primary-disabled": "bg-primary-disabled text-primary-disabled-foreground cursor-not-allowed border-transparent",
    "secondary-disabled": "bg-secondary-disabled text-secondary-disabled-foreground cursor-not-allowed border-transparent",
    outline: "bg-transparent hover:bg-background text-text border-border",
    ghost: "bg-transparent hover:bg-gray-50 text-gray-400 border-transparent",
    ghostDanger: "bg-transparent hover:bg-red-50 text-gray-400 hover:text-red-500 border-transparent",
    danger: "bg-red-500 text-white hover:bg-red-600",

  }

  // size에 따른 스타일 클래스
  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 rounded",
    md: "text-sm px-4 py-2 rounded-md",
    lg: "text-base px-6 py-3 rounded-lg",
  }

  // width에 따른 스타일 클래스
  const widthClasses = {
    auto: "w-auto",
    full: "w-full",
  }

  // 최종 클래스 이름 생성
  const buttonClasses = cn(
    "font-medium border transition-colors duration-200 whitespace-nowrap",
    variantClasses[finalVariant as keyof typeof variantClasses],
    sizeClasses[size],
    widthClasses[width],
    isLoading && "opacity-70 cursor-not-allowed",
    className,
  )

  return (
    <button className={buttonClasses} disabled={disabled || isLoading} data-cy={dataCy} {...props}>
      {isLoading && (
        <svg
          className="animate-spin mx-auto h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {!isLoading && children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  )
}

// Primary 버튼
export const PrimaryButton = (props: Omit<ButtonProps, "variant">) => {
  return <Button variant="primary" {...props} />
}

// Secondary 버튼
export const SecondaryButton = (props: Omit<ButtonProps, "variant">) => {
  return <Button variant="secondary" {...props} />
}

// Cancel 버튼
export const CancelButton = (props: Omit<ButtonProps, "variant">) => {
  return <Button variant="cancel" {...props} />
}

// Outline 버튼
export const OutlineButton = (props: Omit<ButtonProps, "variant">) => {
  return <Button variant="outline" {...props} />
}

// Ghost 버튼
export const GhostButton = (props: Omit<ButtonProps, "variant">) => {
  return <Button variant="ghost" {...props} />
}

// GhostDanger 버튼
export const GhostDangerButton = (props: Omit<ButtonProps, "variant">) => {
  return <Button variant="ghostDanger" {...props} />
}

// Danger 버튼
export const DangerButton = (props: Omit<ButtonProps, "variant">) => {
  return <Button variant="danger" {...props} />
}

// Primary Disabled 버튼
export const PrimaryDisabledButton = (props: Omit<ButtonProps, "variant" | "disabled">) => {
  return <Button variant="primary-disabled" disabled {...props} />
}

// Secondary Disabled 버튼
export const SecondaryDisabledButton = (props: Omit<ButtonProps, "variant" | "disabled">) => {
  return <Button variant="secondary-disabled" disabled {...props} />
}
