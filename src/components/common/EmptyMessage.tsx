import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  message: string
  className?: string
}

export default function EmptyMessage({
  message,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`} data-cy="empty-message-card">
      <SearchX className="h-20 w-20 text-[#999999] mb-4" strokeWidth={2} />
      <h3 className="mt-2 text-xl font-medium text-[#999999] dark:text-gray-100" data-cy="empty-message">{message}</h3>
    </div>
  )
}
