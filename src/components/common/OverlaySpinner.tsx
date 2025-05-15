"use client"

import { useEffect } from "react"
import Spinner from "./Spinner"

interface Props {
    message: string
}



export default function OverlaySpinner({ message }: Props) {
    // 모달 뒷배경 스크롤 방지
    useEffect(() => {
        document.body.style.overflow = "hidden"

        return () => {
        // 모달이 닫힐 때 body 스크롤 복원
        document.body.style.overflow = ""
        }
    }, [])

    return (
        <div className="fixed inset-0 bg-white/20 flex items-center justify-center z-50">
            <Spinner message={message} />
        </div>
    )
}
