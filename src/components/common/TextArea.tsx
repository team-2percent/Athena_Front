import clsx from "clsx"

interface TextAreaProps {
  value: string
  className?: string
  placeholder?: string
  isError?: boolean
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export default function TextArea({ value, onChange, className, placeholder, isError = false }: TextAreaProps) {
    return (
        <textarea
                className={clsx(
                    "w-full px-3 py-2 text-sm focus:outline-none transition rounded border resize-none focus:border-main-color",
                    isError && "border-red-500",
                    className
                )}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
    )
}