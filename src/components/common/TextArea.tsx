import clsx from "clsx"

interface TextAreaProps {
  value: string
  className?: string
  placeholder?: string
  isError?: boolean
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  dataCy?: string
}

export default function TextArea({ value, onChange, className, placeholder, isError = false, dataCy }: TextAreaProps) {
    return (
        <textarea
            className={clsx(
                "w-full px-3 py-2 text-sm focus:outline-none transition rounded border resize-none focus:border-main-color",
                isError && "border-red-500 focus:border-red-500",
                className
            )}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            data-cy={dataCy}
        />
    )
}