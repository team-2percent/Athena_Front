"use client"

import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import AddressModal from "./AddressModal"

interface AddressInfo {
    id: string
    name: string
    address: string
    detailAddress: string
    zipCode: string
    isDefault: boolean
}
  
interface AddressAddInfo {
    name: string
    address: string
    detailAddress: string
    zipCode: string
}

export default function AddressInfo() {
    // 배송지 검색 모달 상태
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

    // 배송지 정보 상태
    const [addresses, setAddresses] = useState<AddressInfo[]>([
        {
        id: "1",
        name: "집",
        address: "서울특별시 강남구 테헤란로 123",
        detailAddress: "456동 789호",
        zipCode: "06234",
        isDefault: true,
        },
    ])

    // 배송지 추가 모달 열기 핸들러
    const handleOpenAddressModal = () => {
        setIsAddressModalOpen(true)
    }
    
    // 배송지 삭제 핸들러
    const handleRemoveAddress = (id: string) => {
        const updatedAddresses = addresses.filter((address) => address.id !== id)

        // 기본 배송지 설정 확인
        if (updatedAddresses.length > 0 && addresses.find((a) => a.id === id)?.isDefault) {
        updatedAddresses[0].isDefault = true
        }

        setAddresses(updatedAddresses)
    }

    // 기본 배송지 설정 핸들러
    const handleSetDefaultAddress = (id: string) => {
        setAddresses(
        addresses.map((address) => ({
            ...address,
            isDefault: address.id === id,
        })),
        )
    }

    // 검색된 주소 추가 핸들러
    const handleAddSearchedAddress = (formData: AddressAddInfo) => {
        const newAddress: AddressInfo = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        detailAddress: formData.detailAddress,
        zipCode: formData.zipCode,
        isDefault: addresses.length === 0,
        }

        setAddresses([...addresses, newAddress])
        setIsAddressModalOpen(false)
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-lg font-medium">배송지 정보</h2>
            </div>

            {/* 배송지 추가 버튼 */}
            <div className="flex justify-center">
                <button
                type="button"
                onClick={handleOpenAddressModal}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm flex items-center"
                >
                <Plus className="w-4 h-4 mr-1" /> 배송지 추가
                </button>
            </div>

            {/* 배송지 목록 */}
            <h3 className="text-sm font-medium mt-4">등록된 배송지 목록</h3>
            {addresses.length === 0 ? 
                <p className="text-gray-500 text-center py-4">등록된 배송지가 없습니다.</p>
             : 
                <div className="space-y-4 mt-2">
                    {addresses.map(address => (
                        <div key={address.id} className="border rounded-md p-4 relative">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start">
                                    <input
                                        type="radio"
                                        id={`default-address-${address.id}`}
                                        name="default-address"
                                        checked={address.isDefault}
                                        onChange={() => handleSetDefaultAddress(address.id)}
                                        className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-300 mt-1 mr-3"
                                    />
                                    <div>
                                        <div className="flex items-center">
                                            <p className="font-medium">{address.name}</p>
                                        {address.isDefault && 
                                            <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full">기본</span>
                                        }
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                        [{address.zipCode}] {address.address}
                                        </p>
                                        {address.detailAddress && <p className="text-sm text-gray-500">{address.detailAddress}</p>}
                                    </div>
                                </div>
                                <button
                                type="button"
                                    onClick={() => handleRemoveAddress(address.id)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            }

      

            {/* 배송지 주소 모달 */}
            {isAddressModalOpen && 
                <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onAdd={handleAddSearchedAddress}
            />}
        </div>
    )
}