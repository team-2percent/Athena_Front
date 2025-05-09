"use client"

import { Plus, Search, Trash2 } from "lucide-react"
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

    const [newAddress, setNewAddress] = useState<Omit<AddressInfo, "id" | "isDefault">>({
        name: "",
        address: "",
        detailAddress: "",
        zipCode: "",
    })

    const isSaveDisabled = newAddress.name.length === 0 || newAddress.address.length === 0 || newAddress.detailAddress.length === 0;

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

    // 주소 추가 핸들러
    const handleAddAddress = () => {
        setAddresses([...addresses, 
            {
                id: Date.now().toString(),
                name: newAddress.name,
                address: newAddress.address,
                detailAddress: newAddress.detailAddress,
                zipCode: newAddress.zipCode,
                isDefault: addresses.length === 0,
                }
        ])
        setIsAddressModalOpen(false)
    }

    const handleComplete = (data: any) => {
        setNewAddress({
            ...newAddress,
            address: data.address,
            zipCode: data.zonecode,
        })
    }

    return (
        <div className="flex gap-4">
            <div className="flex-1 bg-white rounded-lg shadow py-6 px-10">
                <h3 className="text-lg font-medium mb-6">배송지 추가</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            배송지명
                        </label>
                        <input
                            type="text"
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({
                                ...newAddress,
                                name: e.target.value,
                            })}
                            className="w-full flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                        />
                    </div>
                    
                    <div className="flex w-full my-3 gap-2 justify-between items-center my-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            주소
                        </label>
                        <p className="block text-sm font-medium text-gray-700">{ newAddress.address.length > 0 && `[${newAddress.zipCode}] ${newAddress.address}`}</p>
                        <button
                            type="button"
                            onClick={handleOpenAddressModal}
                            className="bg-pink-500 text-white px-2 py-2 rounded-md hover:bg-pink-600"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            상세주소
                        </label>
                        <input
                            type="text"
                            value={newAddress.detailAddress}
                            onChange={(e) => setNewAddress({
                                ...newAddress,
                                detailAddress: e.target.value,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                disabled={isSaveDisabled}
                                onClick={handleAddAddress}
                                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-1" /> 배송지 추가
                            </button>
                        </div>
                    </div>
            </div>

            <div className="flex-1 bg-white rounded-lg shadow py-6 px-10">
                

                {/* 배송지 목록 */}
                <h3 className="text-lg font-medium mb-6">등록된 배송지 목록</h3>
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
            </div>
            {/* 배송지 주소 모달 */}
            {isAddressModalOpen && 
                <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onComplete={handleComplete}
            />}
        </div>
    )
}