import { useRef, useState, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"

export interface DropdownOption {
  label: string
  value: string | number
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string | number
  onChange: (option: DropdownOption) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  designType?: "default" | "borderless"
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  disabled = false,
  className = "",
  designType = "default",
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const selected = options.find((opt) => opt.value === value)

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className={`flex w-full items-center justify-between rounded-full px-4 py-3 text-sm text-left bg-white ${
          designType === "borderless"
            ? "border-none shadow-none"
            : "border border-gray-300 focus:border-main-color"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
      >
        {selected ? (
          <span>{selected.label}</span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <ChevronDown className="h-5 w-5" />
      </button>
      {open && options.length > 0 && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl bg-white shadow-lg z-50 border border-gray-300">
          {options.map((opt) => (
            <div
              key={opt.value}
              className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-100"
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
            >
              <span className="text-sm">{opt.label}</span>
              {value === opt.value && <Check className="h-5 w-5 text-main-color" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 