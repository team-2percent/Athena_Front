import { RefreshCcw } from "lucide-react"

interface ServerErrorComponentProps {
    message: string
    onRetry: () => void
}

export default function ServerErrorComponent({ message, onRetry }: ServerErrorComponentProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 px-10 py-5 rounded-md">
            <p className="text-gray-500">{message}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={onRetry}>
                <RefreshCcw className="w-4 h-4" />
                다시 시도
            </button>
        </div>
    )
}