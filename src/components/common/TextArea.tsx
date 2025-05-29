import clsx from "clsx"
import { useState } from "react"

interface TextAreaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  showCharCount?: boolean
  minLength?: number
  maxLength?: number
  className?: string
  placeholder?: string
}

export default function TextArea({ value, onChange, showCharCount, maxLength, className, minLength, placeholder }: TextAreaProps) {
    const [validationError, setValidationError] = useState<string>("")
    const [isDirty, setIsDirty] = useState(false)
    const hasError = Boolean(isDirty && validationError)
    const charCount = typeof value === "string" ? value.length : 0

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setIsDirty(true)

        if (maxLength && e.target.value.length > maxLength) {
            setValidationError(`${maxLength}자 이내로 입력해주세요`)
            e.target.value = e.target.value.slice(0, maxLength)
        }

        else if (minLength && e.target.value.length < minLength) {
            setValidationError(`${minLength}자 이상 입력해주세요`)
        }

        else setValidationError("")
        onChange(e)
    }

  return (
    <div className="relative h-fit">
        <textarea
            className={clsx(
                "w-full px-3 py-2 text-sm focus:outline-none transition rounded border resize-none focus:border-main-color",
                hasError && "border-red-500",
                showCharCount && "pr-16",
                className
            )}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
        />
        {showCharCount && (
            <div className="absolute right-3 bottom-3 text-xs text-gray-500">
            {charCount}/{maxLength || "-"}
            </div>
        )}
        {hasError && (
            <p className="absolute text-xs text-red-500">
            {validationError}
            </p>
        )}
    </div>
  )
}