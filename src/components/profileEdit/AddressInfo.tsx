"use client"

import { Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"
import AddressModal from "./AddressModal"
import clsx from "clsx"

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

    // 저장 가능 여부
    const [saveable, setSaveable] = useState(false)

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
        setSaveable(true);
    }

    // 기본 배송지 설정 핸들러
    const handleSetDefaultAddress = (id: string) => {
        setAddresses(
        addresses.map((address) => ({
            ...address,
            isDefault: address.id === id,
        })),
        )
        setSaveable(true);
    }

    // 주소 추가 핸들러
    const handleAddAddress = () => {
        if (!newAddress.name || !newAddress.address || !newAddress.detailAddress) {
            alert("배송지명, 주소, 상세주소를 모두 입력해주세요.")
            return
        }
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
    }

    const handleComplete = (data: any) => {
        setNewAddress({
            ...newAddress,
            address: data.address,
            zipCode: data.zonecode,
            detailAddress: "",
        })
        setIsAddressModalOpen(false)
    }

    const handleSave = () => {
        // 저장 api 호출
        setSaveable(false);
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
                            className="w-full flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={handleAddAddress}
                                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-1" /> 배송지 추가
                            </button>
                        </div>
                    </div>
            </div>

            <div className="flex flex-col flex-1 bg-white rounded-lg shadow py-6 px-10">
                {/* 배송지 목록 */}
                <h3 className="text-lg font-medium mb-6">등록된 배송지 목록</h3>
                <div className="flex-1 flex flex-col gap-4">
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
                                                className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-main-color mt-1 mr-3"
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
                <div className="flex gap-2 justify-end items-end flex-wrap mt-4">
                    <p className="text-sm font-medium text-gray-400">※ 저장하지 않고 페이지를 나갈 시 변경사항이 저장되지 않습니다.</p>
                    <button
                        disabled={!saveable}
                        className={clsx("text-white rounded-md text-sm px-4 py-2", saveable ? "bg-pink-500 hover:bg-pink-600": "bg-gray-300")}
                        onClick={handleSave}
                    >
                        저장
                    </button>
                </div>
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