"use client"

import { RefreshCcw } from "lucide-react"
import { PrimaryButton } from "@/components/common/Button"

interface ServerErrorComponentProps {
    message: string
    onRetry?: (...args: any[]) => void
}

export default function ServerErrorComponent({ message, onRetry }: ServerErrorComponentProps) {
    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        } else {
            window.location.reload();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-2 px-10 py-5 rounded-md" data-cy="server-error-card">
            <p className="text-gray-500" data-cy="server-error-message">{message}</p>
            <PrimaryButton 
                className="w-fit h-fit flex gap-1 items-center"
                onClick={handleRetry}
                dataCy="retry-button"
            >
                <RefreshCcw className="w-4 h-4" />
                다시 시도
            </PrimaryButton>
        </div>
    )
}