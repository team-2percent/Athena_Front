"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown, Plus } from "lucide-react"
import AddressModal from "../profileEdit/AddressModal"

interface AddressInfo {
  id: string
  name: string
  address: string
  detailAddress: string
  zipCode: string
  isDefault: boolean
}

interface ProductOption {
  id: string
  title: string
  description: string
  price: string
  remaining: string
  isSelected?: boolean
  details?: string[]
  color?: string
}

const DonateDock = () => {
  // 현재 단계 (1: 상품 선택, 2: 결제 및 배송지 정보)
  const [step, setStep] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>("option2")
  const [selectedPay, setSelectedPay] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<string | null>("1")
  const [quantity, setQuantity] = useState(1)

  // 배송지 검색 모달 상태
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  // 상태 관리 부분에 팝오버 관련 상태 추가
  const [showAddressPopover, setShowAddressPopover] = useState(false)

  // 팝오버 위치 계산을 위한 상태
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })

  // 새 배송지 정보를 객체로 관리
  const [newAddress, setNewAddress] = useState<Omit<AddressInfo, "id" | "isDefault">>({
    name: "",
    address: "",
    detailAddress: "",
    zipCode: "",
  })

  // 상품 옵션 데이터 - 더 많은 데이터 추가
  const productOptions: ProductOption[] = [
    {
      id: "option1",
      title: "마음만 받을게요",
      description: "돈통 ㄱㅅ",
      price: "1,000",
      remaining: "2억 개 남음",
      details: [],
    },
    {
      id: "option2",
      title: "피자 아닌 떡볶이",
      description: "떡볶이 하나 (색상 선택 가능)\n맵기 정도 (순한, 조금매운, 매운 선택 가능)",
      price: "5,000",
      remaining: "2억 개 남음",
      color: "pink",
      details: [
        "떡볶이 하나 (색상 선택 가능)",
        "맵기 정도 (순한, 조금매운, 매운 선택 가능)",
        "배송비 무료",
        "예상 배송일: 2025년 6월 13일",
      ],
    },
    {
      id: "option3",
      title: "비밀스런 피자",
      description: "강 잡숴보셈 ㄹㅇ",
      price: "100,000",
      remaining: "2억 개 남음",
      details: ["피자 1판", "비밀 소스 포함", "배송비 무료", "예상 배송일: 2025년 6월 13일"],
    },
    {
      id: "option4",
      title: "프리미엄 세트",
      description: "떡볶이와 피자를 한번에 즐길 수 있는 프리미엄 세트",
      price: "150,000",
      remaining: "100개 남음",
      details: ["떡볶이 1인분", "피자 1판", "특별 소스 세트", "배송비 무료", "예상 배송일: 2025년 6월 10일"],
    },
    {
      id: "option5",
      title: "한정판 굿즈",
      description: "게살피자 캐릭터 피규어와 스티커 세트",
      price: "30,000",
      remaining: "50개 남음",
      details: ["캐릭터 피규어 1개", "스티커 세트 1개", "배송비 무료", "예상 배송일: 2025년 6월 20일"],
    },
    {
      id: "option6",
      title: "디지털 아트북",
      description: "게살피자 제작 과정을 담은 디지털 아트북",
      price: "15,000",
      remaining: "무제한",
      details: ["디지털 아트북 PDF", "메이킹 영상 포함", "즉시 이메일 발송"],
    },
    {
      id: "option7",
      title: "VIP 패키지",
      description: "모든 혜택을 한번에 누릴 수 있는 VIP 패키지",
      price: "300,000",
      remaining: "10개 남음",
      color: "pink",
      details: [
        "떡볶이 세트",
        "피자 2판",
        "한정판 굿즈 세트",
        "디지털 아트북",
        "개발자 사인",
        "배송비 무료",
        "예상 배송일: 2025년 6월 5일",
      ],
    },
    {
      id: "option8",
      title: "응원 메시지",
      description: "개발자에게 응원 메시지를 보낼 수 있습니다",
      price: "3,000",
      remaining: "무제한",
      details: ["응원 메시지 전달", "감사 이메일 회신"],
    },
  ]

  // 배송지 데이터 - 더 많은 데이터 추가
  const [addresses, setAddresses] = useState<AddressInfo[]>([
    {
      id: "1",
      name: "집",
      address: "서울시 강남구 테헤란로 123",
      detailAddress: "101호",
      zipCode: "06133",
      isDefault: true,
    },
    {
      id: "2",
      name: "회사",
      address: "서울시 서초구 서초대로 456",
      detailAddress: "20층",
      zipCode: "06611",
      isDefault: false,
    },
    {
      id: "3",
      name: "부모님",
      address: "경기도 고양시 일산동구 중앙로 789",
      detailAddress: "3층",
      zipCode: "10401",
      isDefault: false,
    },
    {
      id: "4",
      name: "친구집",
      address: "서울시 마포구 홍대입구로 101",
      detailAddress: "502호",
      zipCode: "04066",
      isDefault: false,
    },
    {
      id: "5",
      name: "별장",
      address: "강원도 평창군 대관령면 올림픽로 555",
      detailAddress: "별채",
      zipCode: "25342",
      isDefault: false,
    },
    {
      id: "6",
      name: "투자사무실",
      address: "서울시 영등포구 여의도동 63로 50",
      detailAddress: "15층",
      zipCode: "07345",
      isDefault: false,
    },
  ])

  useEffect(() => {
    // 후원하기 버튼 클릭 이벤트 리스너 등록
    const handleToggleDock = () => {
      setIsOpen(true)
      setStep(1) // 독이 열릴 때 항상 1단계부터 시작
    }

    window.addEventListener("toggleDonateDock", handleToggleDock)

    return () => {
      window.removeEventListener("toggleDonateDock", handleToggleDock)
    }
  }, [])

  // 팝오버 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAddressPopover) {
        const popoverElement = document.getElementById("address-popover")
        if (popoverElement && !popoverElement.contains(event.target as Node)) {
          setShowAddressPopover(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showAddressPopover])

  const toggleDock = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setStep(1) // 독이 열릴 때 항상 1단계부터 시작
    }
  }

  const handleOptionSelect = (optionId: string) => {
    // 선택된 옵션이 변경되면 수량을 1로 초기화
    if (selectedOption !== optionId) {
      setQuantity(1)
    }
    setSelectedOption(optionId)
  }

  const handlePaySelect = (pay: string) => {
    setSelectedPay(pay)
  }

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddress(addressId)
  }

  // 입력 필드 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Omit<AddressInfo, "id" | "isDefault">,
  ) => {
    setNewAddress({
      ...newAddress,
      [field]: e.target.value,
    })
  }

  const addNewAddress = (e: React.MouseEvent) => {
    // 클릭한 버튼의 위치 정보 가져오기
    const buttonRect = e.currentTarget.getBoundingClientRect()

    // 팝오버 위치 계산 (버튼 왼쪽, 상단 정렬)
    setPopoverPosition({
      top: buttonRect.top,
      left: buttonRect.left - 320, // 팝오버 너비(300px) + 여백(20px)
    })

    // 팝오버 표시
    setShowAddressPopover(true)

    // 입력 필드 초기화
    setNewAddress({
      name: "",
      address: "",
      detailAddress: "",
      zipCode: "",
    })
  }

  const handleComplete = (data: any) => {
    setNewAddress({
      ...newAddress,
      address: data.address,
      zipCode: data.zonecode,
    })
    setIsAddressModalOpen(false)
  }

  // 새 배송지 저장 함수
  const saveNewAddress = () => {
    // 필수 입력값 검증
    if (!newAddress.name || !newAddress.address || !newAddress.detailAddress) {
      alert("배송지명, 주소, 상세 주소를 모두 입력해주세요.")
      return
    }

    // 새 배송지 추가
    const addressToAdd = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    }

    setAddresses([...addresses, addressToAdd])

    // 새로 추가된 배송지 선택
    setSelectedAddress(addressToAdd.id)

    // 팝오버 닫기
    setShowAddressPopover(false)
  }

  // 배송지 추가 모달 열기 핸들러
  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true)
  }

  const goToNextStep = () => {
    setStep(2)
  }

  const goToPreviousStep = () => {
    setStep(1)
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  // 선택된 상품 정보 가져오기
  const selectedProductOption = productOptions.find((option) => option.id === selectedOption) || productOptions[0]

  // 총 가격 계산
  const getTotalPrice = () => {
    if (!selectedOption) return "0"
    const option = productOptions.find((opt) => opt.id === selectedOption)
    if (!option) return "0"

    // 콤마 제거 후 숫자로 변환
    const price = Number.parseInt(option.price.replace(/,/g, ""), 10)
    const total = price * quantity

    // 천 단위 콤마 추가
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <>
      {/* 고정된 후원하기 버튼 */}
      <div className="fixed bottom-0 left-0 z-20 w-full">
        <div className="mx-auto max-w-6xl px-4">
          <button
            onClick={toggleDock}
            className="mx-auto flex w-40 items-center justify-center rounded-t-xl bg-white py-3 shadow-lg"
            aria-label="후원하기"
          >
            <ChevronUp className="mr-2 h-6 w-6 text-gray-700" />
            <span className="text-lg font-medium text-gray-800">후원하기</span>
          </button>
        </div>
      </div>

      {/* 후원하기 Dock */}
      <div
        className={`fixed bottom-0 left-0 z-30 w-full transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-t-3xl border border-gray-200 bg-white p-6 pb-0 shadow-lg">
            {/* Dock 헤더 - 항상 동일한 레이아웃 */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">후원하기</h2>
              <button onClick={toggleDock} className="rounded-full p-1 hover:bg-gray-100" aria-label="닫기">
                <ChevronDown className="h-6 w-6" />
              </button>
            </div>

            {/* 단계별 내용 */}
            {step === 1 ? (
              // 1단계: 상품 선택
              <div className="space-y-6">
                <h3 className="mb-2 text-lg font-medium">상품 선택</h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* 왼쪽 영역: 상품 카드 목록 (1/3 너비) - 스크롤 가능하도록 수정 */}
                  <div className="md:col-span-1">
                    <div className="h-[500px] overflow-y-auto pr-2 pt-4 space-y-6">
                      {productOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`relative flex cursor-pointer items-center rounded-xl border p-4 transition-all ${
                            selectedOption === option.id
                              ? "border-2 border-pink-400"
                              : "border-gray-200 hover:border-pink-200"
                          }`}
                          onClick={() => handleOptionSelect(option.id)}
                        >
                          <div className="absolute -right-2 -top-4">
                            <div className="rounded-full border-2 border-pink-400 bg-white px-3 py-1 text-sm text-pink-500 shadow-sm">
                              <span>{option.remaining}</span>
                            </div>
                          </div>

                          <div className="flex-1">
                            <h4 className={`text-lg font-bold ${selectedOption === option.id ? "text-pink-500" : ""}`}>
                              {option.title}
                            </h4>

                            {selectedOption === option.id && (
                              <div className="mt-2 flex items-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    decreaseQuantity()
                                  }}
                                  className="h-8 w-8 pb-1 rounded-full bg-gray-200 flex items-center justify-center text-gray-700"
                                >
                                  -
                                </button>
                                <span className="mx-4 text-lg">{quantity}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    increaseQuantity()
                                  }}
                                  className="h-8 w-8 pb-1 rounded-full bg-gray-200 flex items-center justify-center text-gray-700"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>

                          <div className={`text-xl font-medium ${selectedOption === option.id ? "text-pink-500" : ""}`}>
                            {option.price}원
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 오른쪽 영역: 선택된 상품 세부 정보 (2/3 너비) */}
                  <div className="md:col-span-2 rounded-xl border border-gray-200 mt-4 p-4">
                    <h4 className="mb-4 text-lg font-bold">상품 상세 정보</h4>

                    {/* 상세 설명 */}
                    <div className="mb-6">
                      <p className="text-gray-700">
                        {selectedProductOption.description || "선택한 상품에 대한 상세 설명이 없습니다."}
                      </p>
                    </div>

                    {/* 구성 */}
                    <h5 className="mb-2 font-medium">구성</h5>
                    {selectedProductOption.details && selectedProductOption.details.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedProductOption.details.map((detail, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-pink-500">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">선택한 상품에 대한 구성 정보가 없습니다.</p>
                    )}

                    <div className="mt-8 border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="font-medium">총 금액:</span>
                        <span className="text-xl font-bold">{getTotalPrice()}원</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 다음 단계 버튼 */}
                <div className="mt-8 bg-white pb-8">
                  <div className="flex justify-end">
                    <button
                      className="rounded-xl bg-pink-200 px-8 py-3 font-medium text-pink-800 hover:bg-pink-300"
                      onClick={goToNextStep}
                    >
                      다음 단계
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // 2단계: 결제 및 배송지 정보
              <div className="space-y-6">
                {/* 결제 수단 */}
                <div>
                  <h3 className="mb-4 text-lg font-medium">결제 수단</h3>
                  <div
                    className={`inline-block cursor-pointer rounded-xl border px-16 p-4 transition-all ${
                      selectedPay === "kakaopay" ? "border-2 border-pink-400" : "border-gray-200 hover:border-pink-200"
                    }`}
                    onClick={() => handlePaySelect("kakaopay")}
                  >
                    <span className="font-medium">카카오페이</span>
                  </div>
                </div>

                {/* 배송지 선택 - 가로 스크롤로 변경 */}
                <div>
                  <h3 className="mb-4 text-lg font-medium">배송지 선택</h3>

                  <div className="relative">
                    <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`flex-shrink-0 w-60 cursor-pointer rounded-xl border p-4 transition-all ${
                            selectedAddress === address.id
                              ? "border-2 border-pink-400"
                              : "border-gray-200 hover:border-pink-200"
                          }`}
                          onClick={() => handleAddressSelect(address.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold">{address.name}</h4>
                            {address.isDefault && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                기본 배송지
                              </span>
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="line-clamp-2 text-gray-600 whitespace-pre-wrap break-words">[{address.zipCode}] {address.address} {address.detailAddress}</p>
                          </div>
                        </div>
                      ))}

                      {/* 배송지 추가 버튼 */}
                      <div
                        className="flex-shrink-0 w-60 border border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 relative"
                        onClick={(e) => {
                          e.stopPropagation()
                          addNewAddress(e)
                        }}
                      >
                        <div className="flex flex-col items-center text-gray-500">
                          <Plus className="w-10 h-10 mb-2" />
                          <span className="text-sm font-medium">배송지 추가</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 주문 요약 */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <h3 className="mb-4 text-lg font-medium">주문 요약</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{selectedProductOption.title}</span>
                      <span>{quantity}개</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>상품 금액</span>
                      <span>{selectedProductOption.price}원</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>배송비</span>
                      <span>무료</span>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="font-medium">총 결제 금액</span>
                      <span className="text-xl font-bold">{getTotalPrice()}원</span>
                    </div>
                  </div>
                </div>

                {/* 하단 결제 정보 및 버튼 */}
                <div className="mt-8 bg-white pb-8">
                  {/* 버튼 영역 */}
                  <div className="flex justify-end space-x-4">
                    <button
                      className="rounded-xl bg-pink-200 px-8 py-3 font-medium text-pink-800 hover:bg-pink-300"
                      onClick={toggleDock}
                    >
                      후원하기
                    </button>
                    <button
                      className="rounded-xl bg-gray-200 px-8 py-3 font-medium text-gray-800 hover:bg-gray-300"
                      onClick={goToPreviousStep}
                    >
                      이전
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 배송지 추가 팝오버 - 컴포넌트 최상위 레벨로 이동 */}
      {showAddressPopover && (
        <div
          id="address-popover"
          className="fixed bg-white rounded-xl border border-gray-200 p-4 shadow-lg z-40 w-80"
          style={{
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
          }}
        >
          <h4 className="text-lg font-medium mb-4">새 배송지 추가</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">배송지명</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="배송지명 입력"
                value={newAddress.name}
                onChange={(e) => handleInputChange(e, "name")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="'찾기'를 눌러서 주소 입력"
                  value={newAddress.address}
                  readOnly
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-200 rounded-lg text-sm"
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  찾기
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상세 주소</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="상세 주소 입력"
                value={newAddress.detailAddress}
                onChange={(e) => handleInputChange(e, "detailAddress")}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
                onClick={() => setShowAddressPopover(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-pink-200 text-pink-800 rounded-lg text-sm"
                onClick={saveNewAddress}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 배송지 주소 모달 */}
      {isAddressModalOpen && (
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onComplete={handleComplete}
        />
      )}
    </>
  )
}

export default DonateDock
