import { CircleAlert } from "lucide-react"
import TopToast from "./TopToast"
import useErrorToastStore from "@/stores/useErrorToastStore"

interface ErrorTopToastProps {
    title: string
    body: string
    duration?: number
}

export default function ErrorTopToast({ title, body, duration = 5000}: ErrorTopToastProps) {
    const { hideErrorToast } = useErrorToastStore()

    return (
        <TopToast
            title={title}
            body={body}
            duration={duration}
            onClose={hideErrorToast}
            className="bg-red-500 z-100"
            dataCy="error-top-toast"
            icon={<CircleAlert className="h-8 w-8 text-white" aria-hidden="true" />}
        />
    )
}