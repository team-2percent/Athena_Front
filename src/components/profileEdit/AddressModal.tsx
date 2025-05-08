"use client"

import { useState } from "react";
import DaumPostcode from "react-daum-postcode";

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: any) => void;
}
export default function AddressModal({ isOpen, onClose, onAdd }: AddressModalProps) {
    if (!isOpen) return null;

    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    const handleComplete = (data: any) => {
        setAddress(data.address);
        setZipCode(data.zonecode);
        setIsPostcodeOpen(false);
    }

    const isSaveDisabled = name.length === 0 ||address.length === 0 || detailAddress.length === 0;
    
    return (
        <>
            {/* Black overlay */}
            <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div
                    className="bg-white rounded-3xl w-full max-w-md p-8 shadow-lg pointer-events-auto relative"
                    style={{
                        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.08)",
                        maxWidth: "450px",
                    }}
                >
                    {isPostcodeOpen ? (
                        <DaumPostcode onComplete={handleComplete} />
                    ) : (
                        <div>
                            <h2 className="text-2xl font-bold mb-8">배송지 추가</h2>
                            <label className="block font-medium text-gray-700 mb-1">
                                배송지명
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                            />
                            <div className="flex w-full my-3 gap-2 justify-between items-center my-4">
                                <label className="block font-medium text-gray-700">
                                    주소
                                </label>
                                <p className="block text-sm font-medium text-gray-700">{ address.length > 0 && `[${zipCode}] ${address}`}</p>
                                <button
                                    type="button"
                                    onClick={() => setIsPostcodeOpen(true)}
                                    className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
                                >
                                    검색
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                
                            
                            
                            <label className="block font-medium text-gray-700 mb-1">
                                상세주소
                            </label>
                            <input
                                type="text"
                                value={detailAddress}
                                onChange={(e) => setDetailAddress(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                            />
                            <div className="flex w-full my-3 gap-2 justify-center items-center my-4">
                                <button
                                    disabled={isSaveDisabled}
                                    onClick={() => onAdd({ name, address, detailAddress, zipCode})}
                                    className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm"
                                >저장</button>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                                >취소</button>
                            </div>
                            </div>
                        </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

