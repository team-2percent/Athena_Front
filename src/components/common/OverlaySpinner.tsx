"use client"

import Spinner from "./Spinner"

interface Props {
    message: string
}

export default function OverlaySpinner({ message }: Props) {
    return (
        <div className="fixed inset-0 bg-white/20 flex items-center justify-center z-50">
            <Spinner message={message} />
        </div>
    )
}
