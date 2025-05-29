import clsx from "clsx"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface InputProps {
  className?: string
  type: "text" | "number" | "password" | "email"
  designType?: "outline" | "underline"
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  minLength? : number
  maxLength? : number
  maxNumber? : number
  minNumber? : number
  showCharCount?: boolean
}

export function Input({
  className,
  type,
  designType = "outline",
  value,
  onChange,
  onEnter,
  placeholder,
  minLength,
  maxLength,
  maxNumber,
  minNumber,
  showCharCount,
}: InputProps) {
  const [validationError, setValidationError] = useState<string>("")
  const [isDirty, setIsDirty] = useState(false)
  const hasError = Boolean(isDirty && validationError)
  const design = designType === "outline" ? "rounded border" : "border-b"
  const charCount = typeof value === "string" ? value.length : 0

  console.log(validationError, hasError)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)

    if (type === "text") {
      handleTextChange(e)
    } else if (type === "number") {
      handleNumberChange(e)
    } else if (type === "password") {
      handlePasswordChange(e)
    } else if (type === "email") {
      handleEmailChange(e)
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) {
      setValidationError(`${maxLength}자 이내로 입력해주세요`)
      return
    }

    if (minLength && newValue.length < minLength) {
      setValidationError(`${minLength}자 이상 입력해주세요`)
    }

    onChange(e)
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    if (maxNumber && newValue > maxNumber) {
      setValidationError(`${maxNumber} 이하로 입력해주세요`)
      return
    }

    if (minNumber && newValue < minNumber) {
      setValidationError(`${minNumber} 이상으로 입력해주세요`)
    }

    onChange(e)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) {
      return
    }

    if (
      !((minLength === undefined || minLength && newValue.length >= minLength) &&
      /[A-Z]/.test(newValue) &&
      /[a-z]/.test(newValue) &&
      /\d/.test(newValue) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(newValue))
    ) {
      setValidationError(`비밀번호는 ${minLength}자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다`)
    }

    onChange(e)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) {
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
      setValidationError("올바른 이메일 형식이 아닙니다")
    }

    onChange(e)
  }

  return (
    <div className="w-full relative">
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (onEnter && e.key === "Enter") onEnter(e)
        }}
        placeholder={placeholder}
        maxLength={maxLength}
        className={clsx(
          "px-3 py-2 text-sm focus:outline-none transition w-full focus:border-main-color",
          design,
          hasError && "border-red-500",
          showCharCount && "pr-16",
          className
        )}
      />
      {showCharCount && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
          {charCount}/{maxLength || "-"}
        </div>
      )}
      {hasError && (
        <p className="absolute mt-1 ml-1 text-xs text-red-500">
          {validationError}
        </p>
      )}
    </div>
  )
}

export const TextInput = ({
  showCharCount,
  ...props
}: Omit<InputProps, "type"> & { showCharCount?: boolean }) => (
  <Input {...props} type="text" showCharCount={showCharCount} />
)

export const NumberInput = (props: Omit<InputProps, "type">) => (
  <Input {...props} type="number" />
)

export const PasswordInput = ({
  className,
  value,
  onChange,
  onEnter,
  placeholder,
  minLength,
  maxLength,
  designType = "underline",
}: Omit<InputProps, "type">) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative w-full">
      <Input
        type={visible ? "text" : "password"}
        className={clsx("pr-10", className)}
        value={value}
        onChange={onChange}
        onEnter={onEnter}
        placeholder={placeholder}
        designType={designType}
        minLength={minLength}
        maxLength={maxLength}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

export const EmailInput = ({
  className,
  value,
  onChange,
  onEnter,
  minLength,
  maxLength,
  placeholder = "이메일을 입력해주세요",
  designType = "underline",
}: Omit<InputProps, "type">) => {
  return (
    <Input
      type="email"
      className={className}
      value={value}
      onChange={onChange}
      onEnter={onEnter}
      placeholder={placeholder}
      designType={designType}
      minLength={minLength}
      maxLength={maxLength}
    />
  )
}
