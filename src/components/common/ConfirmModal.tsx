import { useEffect } from "react"

interface ConfirmModalProps {
    isOpen: boolean
    message: string
    onConfirm: () => void
    onClose: () => void
}

export default function ConfirmModal({ isOpen, message, onConfirm, onClose }: ConfirmModalProps) {

    // 모달 뒷배경 스크롤 방지
    useEffect(() => {
        if (isOpen) {
        // 모달이 열릴 때 body 스크롤 방지
        document.body.style.overflow = "hidden"
        }

        return () => {
        // 모달이 닫힐 때 body 스크롤 복원
        document.body.style.overflow = ""
        }
    }, [isOpen])

    return (
        <>
            {/* Black overlay */}
            <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div
                    className="bg-white rounded-3xl w-full max-w-md p-8 shadow-lg pointer-events-auto relative"
                    style={{
                        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.08)",
                        maxWidth: "450px",
                    }}
                >
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <p className="text-xl font-medium">{message}</p>
                        <div className="flex gap-4">
                            <button className="px-4 py-2 rounded-md bg-pink-100 text-pink-600" onClick={onConfirm}>확인</button>
                            <button className="px-4 py-2 rounded-md bg-gray-100 text-sub-gray" onClick={onClose}>취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}