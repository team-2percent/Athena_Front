"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, X, Eye, EyeOff, Plus, Trash2, MapPin } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import AddressModal from "@/components/profileEdit/AddressModal"

// 타입 정의
interface AccountInfo {
  id: string
  bankName: string
  accountNumber: string
  isDefault: boolean
  name: string
}

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

interface UrlInfo {
  id: string
  name: string
  url: string
}

export default function ProfileEditPage() {
  // 프로필 상태 관리
  const [profile, setProfile] = useState({
    name: "홍길동",
    password: "",
    newPassword: "",
    confirmPassword: "",
    isEditable: true,
  })

  // 수정 모드 상태
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false)

  // 계좌 정보 상태
  const [accounts, setAccounts] = useState<AccountInfo[]>([
    {
      id: "1",
      bankName: "국민은행",
      accountNumber: "123-456-789012",
      isDefault: true,
      name: "홍길동"
    },
  ])

  // 새 계좌 정보 폼
  const [newAccount, setNewAccount] = useState<Omit<AccountInfo, "id" | "isDefault">>({
    bankName: "",
    accountNumber: "",
    name: "",
  })

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

  // URL 정보 상태
  const [urls, setUrls] = useState<UrlInfo[]>([
    {
      id: "1",
      name: "웹사이트",
      url: "https://example.com",
    },
  ])

  // 새 URL 정보 폼
  const [newUrl, setNewUrl] = useState<Omit<UrlInfo, "id">>({
    name: "",
    url: "",
  })

  // 프로필 이미지 관련 상태
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 배송지 검색 모달 상태
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  // 비밀번호 표시 상태
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "checkbox") {
      setProfile({
        ...profile,
        [name]: (e.target as HTMLInputElement).checked,
      })
    } else {
      setProfile({
        ...profile,
        [name]: value,
      })
    }
  }

  // 프로필 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // 프로필 이미지 삭제 핸들러
  const handleRemoveImage = () => {
    setProfileImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // 새 계좌 정보 변경 핸들러
  const handleNewAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAccount({
      ...newAccount,
      [name]: value,
    })
  }

  // 계좌 추가 핸들러
  const handleAddAccount = () => {
    if (!newAccount.bankName || !newAccount.accountNumber) {
      alert("은행명과 계좌번호를 모두 입력해주세요.")
      return
    }

    const accountToAdd: AccountInfo = {
      id: Date.now().toString(),
      bankName: newAccount.bankName,
      accountNumber: newAccount.accountNumber,
      isDefault: accounts.length === 0,
      name: newAccount.name,
    }

    setAccounts([...accounts, accountToAdd])
    setNewAccount({ bankName: "", accountNumber: "", name: "" }) // 폼 초기화
  }

  // 계좌 정보 삭제 핸들러
  const handleRemoveAccount = (id: string) => {
    const updatedAccounts = accounts.filter((account) => account.id !== id)

    // 기본 계좌 설정 확인
    if (updatedAccounts.length > 0 && accounts.find((a) => a.id === id)?.isDefault) {
      updatedAccounts[0].isDefault = true
    }

    setAccounts(updatedAccounts)
  }

  // 기본 계좌 설정 핸들러
  const handleSetDefaultAccount = (id: string) => {
    setAccounts(
      accounts.map((account) => ({
        ...account,
        isDefault: account.id === id,
      })),
    )
  }

  // 배송지 추가 모달 열기 핸들러
  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true)
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

  // 새 URL 정보 변경 핸들러
  const handleNewUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUrl({
      ...newUrl,
      [name]: value,
    })
  }

  // URL 추가 핸들러
  const handleAddUrl = () => {
    if (!newUrl.name || !newUrl.url) {
      alert("URL 이름과 주소를 모두 입력해주세요.")
      return
    }

    // URL 형식 검증
    try {
      new URL(newUrl.url) // URL 형식 검증
    } catch (e) {
      alert("유효한 URL 형식이 아닙니다. http:// 또는 https://로 시작하는 URL을 입력해주세요.")
      return
    }

    const urlToAdd: UrlInfo = {
      id: Date.now().toString(),
      name: newUrl.name,
      url: newUrl.url,
    }

    setUrls([...urls, urlToAdd])
    setNewUrl({ name: "", url: "" }) // 폼 초기화
  }

  // URL 삭제 핸들러
  const handleRemoveUrl = (id: string) => {
    setUrls(urls.filter((url) => url.id !== id))
  }

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 비밀번호 확인 검증
    if (profile.password && profile.password !== profile.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    // 수정 모드 초기화
    setIsEditingBasicInfo(false)

    // 여기에 API 호출 로직 추가
    console.log("프로필 업데이트:", {
      ...profile,
      profileImage,
      accounts,
      addresses,
      urls,
    })
    alert("프로필이 성공적으로 업데이트되었습니다.")
  }

  // 모달 뒷배경 스크롤 방지
  useEffect(() => {
    if (isAddressModalOpen) {
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden"
    }

    return () => {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = ""
    }
  }, [isAddressModalOpen])

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">프로필 편집</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 프로필 이미지 섹션 */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 mb-4">
            {profileImage ? (
              <>
                <Image
                  src={profileImage || "/placeholder.svg"}
                  alt="프로필 이미지"
                  fill
                  className="rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <Camera className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profile-image"
          />
          <label htmlFor="profile-image" className="cursor-pointer text-pink-500 font-medium hover:text-pink-600">
            프로필 사진 {profileImage ? "변경" : "업로드"}
          </label>
        </div>

        {/* 기본 정보 섹션 */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-medium">기본 정보</h2>
            {!isEditingBasicInfo && (
              <button
                type="button"
                onClick={() => setIsEditingBasicInfo(true)}
                className="text-pink-500 hover:text-pink-600 text-sm font-medium"
              >
                수정
              </button>
            )}
          </div>

          {isEditingBasicInfo ? (
            // 수정 모드
            <>
              {/* 이름 필드 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>

              {/* 비밀번호 필드 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={profile.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="비밀번호"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 변경할 비밀번호 필드 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 변경
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={profile.newPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="새 비밀번호"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 비밀번호 확인 필드 */}
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="비밀번호 확인"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 수정 모드 버튼 */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingBasicInfo(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBasicInfo(false)}
                  className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm"
                >
                  저장
                </button>
              </div>
            </>
          ) : (
            // 보기 모드
            <div className="space-y-3 py-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">이름</span>
                <span className="text-sm font-medium">{profile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">비밀번호</span>
                <span className="text-sm">••••••••</span>
              </div>
            </div>
          )}
        </div>

        {/* 계좌 정보 섹션 */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-medium">계좌 정보</h2>
          </div>

          {/* 계좌 추가 폼 */}
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="text-sm font-medium mb-3">새 계좌 추가</h3>
            <div className="flex gap-4 flex-col">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  name="name"
                  value={newAccount.name}
                  onChange={handleNewAccountChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="이름"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">은행명</label>
                <input
                  type="text"
                  name="bankName"
                  value={newAccount.bankName}
                  onChange={handleNewAccountChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="은행명"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">계좌번호</label>
                <input
                  type="number"
                  name="accountNumber"
                  value={newAccount.accountNumber}
                  onChange={handleNewAccountChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="계좌번호"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddAccount}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> 계좌 추가
              </button>
            </div>
          </div>

          {/* 계좌 목록 */}
          <h3 className="text-sm font-medium mt-4">등록된 계좌 목록</h3>
          {accounts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">등록된 계좌가 없습니다.</p>
          ) : (
            <div className="space-y-3 mt-2">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`default-account-${account.id}`}
                      name="default-account"
                      checked={account.isDefault}
                      onChange={() => handleSetDefaultAccount(account.id)}
                      className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-300 mr-3"
                    />
                    <div>
                      <p className="font-medium">{account.bankName}</p>
                      <p className="text-sm text-gray-500">{account.accountNumber}</p>
                    </div>
                    {account.isDefault && (
                      <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full">기본</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAccount(account.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 배송지 정보 섹션 */}
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
          {addresses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">등록된 배송지가 없습니다.</p>
          ) : (
            <div className="space-y-4 mt-2">
              {addresses.map((address) => (
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
                          {address.isDefault && (
                            <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full">
                              기본
                            </span>
                          )}
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
          )}
        </div>

        {/* URL 정보 섹션 */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-medium">URL 정보</h2>
          </div>

          {/* URL 추가 폼 */}
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="text-sm font-medium mb-3">새 URL 추가</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  name="name"
                  value={newUrl.name}
                  onChange={handleNewUrlChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="URL 이름"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  name="url"
                  value={newUrl.url}
                  onChange={handleNewUrlChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> URL 추가
              </button>
            </div>
          </div>

          {/* URL 목록 */}
          <h3 className="text-sm font-medium mt-4">등록된 URL 목록</h3>
          {urls.length === 0 ? (
            <p className="text-gray-500 text-center py-4">등록된 URL이 없습니다.</p>
          ) : (
            <div className="space-y-3 mt-2">
              {urls.map((url) => (
                <div key={url.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{url.name}</p>
                    <a
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {url.url}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(url.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-center pt-4">
            <button
              className={cn(
                "px-6 py-3 rounded-full border-2 border-pink-300 text-pink-400 font-medium text-center transition-colors w-full",
                "hover:bg-pink-50 active:bg-pink-100",
                "focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2",
              )}
              type="submit"
            >
              프로필 저장
            </button>
        </div>
      </form>

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
