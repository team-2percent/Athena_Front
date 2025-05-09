"use client"

import { useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: any) => void;
}
export default function AddressModal({ isOpen, onClose, onComplete }: AddressModalProps) {
    if (!isOpen) return null;

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

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div
                    className="h-fit bg-white rounded-3xl w-full max-w-md p-8 shadow-lg pointer-events-auto relative"
                    style={{
                        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.08)",
                        maxWidth: "450px",
                    }}
                >
                    <DaumPostcode onComplete={onComplete} />
                </div>
            </div>
        </>
    )
}

