import clsx from "clsx"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { z } from "zod"

interface InputProps {
  id?: string
  name?: string
  className?: string
  type: "text" | "number" | "password" | "email"
  designType?: "outline-rect" | "outline-round" | "underline"
  align?: "left" | "center" | "right"
  value: string | number
  placeholder?: string
  isError?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void
  dataCy?: string
  readOnly?: boolean
}

export function Input({
  id,
  name,
  className,
  type,
  designType = "outline-rect",
  value,
  align = "left",
  placeholder,
  isError = false,
  onChange,
  onKeyDown,
  onClick,
  dataCy,
  readOnly = false,
}: InputProps) {
  const design = designType === "outline-rect" ? "rounded border" : designType === "outline-round" ? "rounded-full border" : "border-b"
  
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={(e) => {
        if (onKeyDown && e.key === "Enter") onKeyDown(e)
      }}
      onClick={onClick}
      placeholder={placeholder}
      className={clsx(
        "px-3 py-2 text-sm border-gray-300 focus:outline-none transition",
        design,
        isError && "border-red-500 focus:border-red-500",
        align === "center" && "text-center",
        align === "right" && "text-right",
        !readOnly && "cursor-pointer focus:border-main-color",
        className
      )}
      data-cy={dataCy}
      readOnly={readOnly}
    />
  )
}

// 클릭 시 모두 선택(주로 NumberInput에서 사용)
const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
  e.currentTarget.select();
};

// components
export const TextInput = ({
  showCharCount,
  ...props
}: Omit<InputProps, "type"> & { showCharCount?: boolean }) => (
  <Input {...props} type="text" />
)

export const NumberInput = (props: Omit<InputProps, "type">) => (
  <Input {...props} type="number" onClick={handleClick} />
)

export const PasswordInput = ({
  className,
  value,
  onChange,
  onKeyDown,
  placeholder,
  designType = "underline",
  isError = false,
  dataCy,
  readOnly = false,
}: Omit<InputProps, "type">) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={clsx("pr-10", className)}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        designType={designType}
        isError={isError}
        dataCy={dataCy}
        readOnly={readOnly}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
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
  onKeyDown,
  placeholder,
  designType = "underline",
  isError = false,
  dataCy,
  readOnly = false,
}: Omit<InputProps, "type">) => {
  return (
    <Input
      type="email"
      className={className}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      designType={designType}
      isError={isError}
      dataCy={dataCy}
      readOnly={readOnly}
    />
  )
}
