"use client"

import { Plus, Search, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import AddressModal from "./AddressModal"
import { useApi } from "@/hooks/useApi"

import ConfirmModal from "../common/ConfirmModal"
import { GhostDangerButton, PrimaryButton } from "../common/Button"
import { TextInput } from "../common/Input"
import { ADDRESS_DETAIL_MAX_LENGTH } from "@/lib/validationConstant"
import { addressAddSchema, addressDetailSchema, addressSchema } from "@/lib/validationSchemas"
import InputInfo from "../common/InputInfo"
import useErrorToastStore from "@/stores/useErrorToastStore"
import { validate, getValidatedString } from "@/lib/validationUtil"
import { error } from "console"
import EmptyMessage from "../common/EmptyMessage"
import ServerErrorComponent from "../common/ServerErrorComponent"

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
    const { showErrorToast } = useErrorToastStore();
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

    const [error, setError] = useState<boolean>(false)

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
        setError(false)
        apiCall<AddressInfo[]>("/api/delivery/delivery-info", "GET").then(({ data, error, status }) => {
            if (data) setAddresses(data)
            else if (error && status === 500) setError(true)
        })
    }

    const deleteDelivery = () => {
        if (deleteId === null) return;
        apiCall(`/api/delivery/delivery-info/${deleteId}`, "DELETE").then(({ error, status }) => {
            if (!error) {
                loadData();
                setIsDeleteModalOpen(false)
            } else if (error && status === 500) {
                showErrorToast("배송지 삭제 실패", "다시 시도해주세요.")
            }
        })
    }

    const setDefaultDelivery = () => {
        if (defaultId === null) return;
        apiCall(`/api/delivery/state`, "PUT", {
            deliveryInfoId: defaultId
        }).then(({ error, status }) => {
            if (!error) {
                loadData();
                setIsDefaultModalOpen(false)
            } else if (status === 500) {
                showErrorToast("기본 배송지 변경 실패", "다시 시도해주세요.")
            }
        })
    }

    // 배송지 추가 모달 열기 핸들러
    const handleOpenAddressModal = () => {
        setIsAddressModalOpen(true)
    }

    const handleChangeDetailAddress = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const addressResult = validate(newAddress.address, addressSchema)
        const detailResult = validate(e.target.value, addressDetailSchema)
        setAddressAddError(prev => ({ ...prev, address: addressResult.message, detailAddress: detailResult.message }))
        setNewAddress(prev => ({
            ...prev,
            detailAddress: getValidatedString(e.target.value, ADDRESS_DETAIL_MAX_LENGTH),
        }))
    }

    // 주소 추가 핸들러
    const handleAddAddress = () => {
        apiCall("/api/delivery/delivery-info", "POST", {
            zipcode: newAddress.zipcode,
            address: newAddress.address,
            detailAddress: newAddress.detailAddress,
        }).then(({ error, status }) => {
            if (!error) {
                loadData()
                initNewAddress()
            } else if (error && status === 500) {
                showErrorToast("배송지 추가 실패", "다시 시도해주세요.")
            }
        })
    }

    const handleComplete = (data: any) => {
        setNewAddress(prev => ({
            ...prev,
            address: data.address,
            zipcode: data.zonecode,
            detailAddress: "",
        }))
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

    const renderAddressList = () => {
        if (error) return <ServerErrorComponent message="배송지 조회에 실패했습니다." onRetry={loadData} />
        if (addresses.length === 0) return <EmptyMessage message="등록된 배송지가 없습니다." />
        return (
            <div className="space-y-4 mt-2">
                {addresses.map(address => (
                    <div key={address.id} className="border rounded-md p-4 relative" data-cy="address-list-item">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start">
                                <div>
                                    <div className="flex items-center">
                                        <p className="font-medium" data-cy="address">{address.address}</p>
                                    {address.isDefault ? 
                                        <span
                                            className="ml-2 px-2 py-0.5 bg-pink-100 text-secondary-color-dark text-xs rounded-full"
                                            data-cy="default-address-badge"
                                        >기본</span>
                                        :
                                        <button
                                            className="border-box ml-2 px-2 py-0.5 text-xs text-main-color underline"
                                            onClick={() => handleClickSetDefaultButton(address.id)}
                                            data-cy="default-address-change-button"
                                        >기본 배송지로 설정</button>
                                    }
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1" data-cy="detail-address">
                                    [{address.zipcode}] {address.detailAddress && <span className="text-sm text-gray-500">{address.detailAddress}</span>}
                                    </p>
                                </div>
                            </div>
                            {!address.isDefault && 
                            <GhostDangerButton
                                onClick={() => handleClickDeleteButton(address.id)}
                                className="w-fit h-fit p-2 rounded-full"
                                dataCy="address-delete-button"
                            >
                                <Trash2 className="w-4 h-4" />
                            </GhostDangerButton>
                            }
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <div className="flex gap-4">
            <ConfirmModal
                isOpen={isDefaultModalOpen}
                message={"기본 배송지로 설정할까요?"}
                onConfirm={setDefaultDelivery}
                onClose={() => setIsDefaultModalOpen(false)}
                dataCy="default-address-confirm-modal"
                isLoading={isLoading}
            />
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                message={"배송지를 삭제할까요?"}
                onConfirm={deleteDelivery}
                onClose={() => setIsDeleteModalOpen(false)}
                dataCy="delete-address-confirm-modal"
                isLoading={isLoading}
            />
            <div className="flex-1 bg-white rounded-lg shadow py-6 px-10" data-cy="address-add-form">
                <h3 className="text-lg font-medium mb-6">배송지 추가</h3>
                    <div className="flex w-full my-3 gap-2 justify-between items-center my-4">
                        <div className="flex gap-2 items-center">
                            <label className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                                주소
                            </label>
                            <p className="block text-sm font-medium text-gray-700" data-cy="address-info">{ newAddress.address.length > 0 && `[${newAddress.zipcode}] ${newAddress.address}`}</p>
                            {addressAddError.address && <InputInfo errorMessage={addressAddError.address} errorMessageDataCy="address-error-message" />}
                        </div>
                        <PrimaryButton
                            type="button"
                            onClick={handleOpenAddressModal}
                            className="px-2 py-2"
                            dataCy="address-search-button"
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
                                dataCy="address-detail-input"
                            />
                            <InputInfo errorMessage={addressAddError.detailAddress} errorMessageDataCy="detail-address-error-message" />
                        </div>
                        <div className="mt-4 flex justify-end">
                            <PrimaryButton
                                type="button"
                                onClick={handleAddAddress}
                                className="flex items-center"
                                disabled={addButtonDisabled}
                                dataCy="address-add-button"
                                isLoading={isLoading}
                            >
                                배송지 추가
                            </PrimaryButton>
                        </div>
                    </div>
            </div>

            <div className="flex flex-col flex-1 bg-white rounded-lg shadow py-6 px-10" data-cy="address-list">
                {/* 배송지 목록 */}
                <h3 className="text-lg font-medium mb-6">등록된 배송지 목록</h3>
                <div className="flex-1 flex flex-col gap-4">
                    {renderAddressList()}
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