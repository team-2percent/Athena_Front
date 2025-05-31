"use client"

import { Plus, Search, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import AddressModal from "./AddressModal"
import { useApi } from "@/hooks/useApi"

import ConfirmModal from "../common/ConfirmModal"
import AlertModal from "../common/AlertModal"
import { PrimaryButton } from "../common/Button"
import { TextInput } from "../common/Input"
import { ADDRESS_DETAIL_MAX_LENGTH, ADDRESS_DETAIL_MIN_LENGTH } from "@/lib/validationConstant"
import { addressAddSchema, addressDetailSchema, addressSchema } from "@/lib/validationSchemas"
import InputInfo from "../common/InputInfo"

interface AddressInfo {
    id: number
    name?: string
    address: string
    detailAddress: string
    zipcode: string
    isDefault: boolean
}

export default function AddressInfo() {
    const { isLoading, apiCall } = useApi();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDefaultModalOpen, setIsDefaultModalOpen] = useState(false); 
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [defaultId, setDefaultId] = useState<number | null>(null);

    // 배송지 정보 상태
    const [addresses, setAddresses] = useState<AddressInfo[]>([])

    const [addressAddError, setAddressAddError] = useState({
        address: "",
        detailAddress: "",
    })

    // 새 배송지
    const [newAddress, setNewAddress] = useState({
        address: '',
        detailAddress: '',
        zipcode: ''
    })

    const addButtonDisabled = addressAddSchema.safeParse(newAddress).error !== undefined;

    const initNewAddress = () => {
        setNewAddress({
            address: '',
            detailAddress: '',
            zipcode: ''
        })
        setAddressAddError({
            address: "",
            detailAddress: "",
        })
    }

    const loadData = () => {
        apiCall<AddressInfo[]>("/api/delivery/delivery-info", "GET").then(({ data }) => {
            if (data) setAddresses(data)
        })
    }

    const deleteDelivery = () => {
        if (deleteId === null) return;
        apiCall(`/api/delivery/delivery-info/${deleteId}`, "DELETE").then(({ error }) => {
            if (!error) {
                loadData();
                setIsDeleteModalOpen(false)
            } else {
                console.log("삭제 실패")
            }
        })
    }

    const setDefaultDelivery = () => {
        if (defaultId === null) return;
        apiCall(`/api/delivery/state`, "PUT", {
            deliveryInfoId: defaultId
        }).then(({ error }) => {
            if (!error) {
                loadData();
                setIsDefaultModalOpen(false)
            } else {
                console.log("기본 배송지 설정 실패")
            }
        })
    }

    // 배송지 추가 모달 열기 핸들러
    const handleOpenAddressModal = () => {
        setIsAddressModalOpen(true)
    }

    const validateAddress = () => {
        const result = addressSchema.safeParse(newAddress.address)
        return result.error ? result.error.issues[0].message : "";
    }

    const validateDetailAddress = (detailAddress: string) => {
        const result = addressDetailSchema.safeParse(detailAddress)
        if (result.success) {
            return {
                value: detailAddress,
                error: ""
            }
        } else if (detailAddress.length > ADDRESS_DETAIL_MAX_LENGTH) {
            return {
                value: detailAddress.slice(0, ADDRESS_DETAIL_MAX_LENGTH),
                error: result.error?.issues[0].message
            }
        } 
        return {
            value: "",
            error: result.error?.issues[0].message || ""
        }
    }

    const handleChangeDetailAddress = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const addressError = validateAddress();
        const { value, error } = validateDetailAddress(e.target.value)
        setNewAddress({
            ...newAddress,
            detailAddress: value,
        })
        setAddressAddError({
            ...addressAddError,
            address: addressError,
            detailAddress: error
        })
    }

    // 주소 추가 핸들러
    const handleAddAddress = () => {
        apiCall("/api/delivery/delivery-info", "POST", {
            zipcode: newAddress.zipcode,
            address: newAddress.address,
            detailAddress: newAddress.detailAddress,
        }).then(({ error }) => {
            if (!error) {
                loadData()
                initNewAddress()
            } else {
                console.log("배송지 추가 실패")
            }
        })
    }

    const handleComplete = (data: any) => {
        setNewAddress({
            ...newAddress,
            address: data.address,
            zipcode: data.zonecode,
            detailAddress: "",
        })
        setIsAddressModalOpen(false)
    }

    // 삭제 버튼 핸들러
    const handleClickDeleteButton = (accountId: number) => {
        setDeleteId(accountId)
        setIsDeleteModalOpen(true)
    }

    // 기본 설정 버튼 핸들러
    const handleClickSetDefaultButton = (accountId: number) => {
        setDefaultId(accountId)
        setIsDefaultModalOpen(true)
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <div className="flex gap-4">
            <ConfirmModal isOpen={isDefaultModalOpen} message={"기본 계좌로 설정할까요?"} onConfirm={setDefaultDelivery} onClose={() => setIsDefaultModalOpen(false)} />
            <ConfirmModal isOpen={isDeleteModalOpen} message={"계좌를 삭제할까요?"} onConfirm={deleteDelivery} onClose={() => setIsDeleteModalOpen(false)} />
            <div className="flex-1 bg-white rounded-lg shadow py-6 px-10">
                <h3 className="text-lg font-medium mb-6">배송지 추가</h3>
                    <div className="flex w-full my-3 gap-2 justify-between items-center my-4">
                        <div className="flex gap-2 items-center">
                            <label className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">
                                주소
                            </label>
                            <p className="block text-sm font-medium text-gray-700">{ newAddress.address.length > 0 && `[${newAddress.zipcode}] ${newAddress.address}`}</p>
                            <InputInfo errorMessage={addressAddError.address} />
                        </div>
                        <PrimaryButton
                            type="button"
                            onClick={handleOpenAddressModal}
                            className="px-2 py-2"
                        >
                            <Search className="w-4 h-4" />
                        </PrimaryButton>
                        
                    </div>
                    
                    
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            상세주소
                        </label>
                        <div>
                            <TextInput
                                value={newAddress.detailAddress}
                                onChange={handleChangeDetailAddress}
                                className="w-full"
                                isError={addressAddError.detailAddress !== ""}
                            />
                            <InputInfo errorMessage={addressAddError.detailAddress} />
                        </div>
                        <div className="mt-4 flex justify-end">
                            <PrimaryButton
                                type="button"
                                onClick={handleAddAddress}
                                className="flex items-center"
                                disabled={addButtonDisabled}
                            >
                                <Plus className="w-4 h-4 mr-1" /> 배송지 추가
                            </PrimaryButton>
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
                                            <div>
                                                <div className="flex items-center">
                                                    <p className="font-medium">{address.address}</p>
                                                {address.isDefault ? 
                                                    <span className="ml-2 px-2 py-0.5 bg-pink-100 text-secondary-color-dark text-xs rounded-full">기본</span>
                                                    :
                                                    <button
                                                        className="border-box ml-2 px-2 py-0.5 text-xs text-main-color underline"
                                                        onClick={() => handleClickSetDefaultButton(address.id)}
                                                    >기본 계좌로 설정</button>
                                                }
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                [{address.zipcode}] {address.detailAddress && <p className="text-sm text-gray-500">{address.detailAddress}</p>}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                        type="button"
                                            onClick={() => handleClickDeleteButton(address.id)}
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