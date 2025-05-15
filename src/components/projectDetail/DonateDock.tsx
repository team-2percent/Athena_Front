"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronUp, ChevronDown, Plus, Check, ChevronRight, X } from "lucide-react"
import AddressModal from "../profileEdit/AddressModal"
import { useParams } from "next/navigation"
import { useApi } from "@/hooks/useApi"

interface AddressInfo {
  id: string
  name: string
  address: string
  detailAddress: string
  zipCode: string
  isDefault: boolean
}

// API에서 가져오는 상품 정보 인터페이스
interface ProductResponse {
  id: number
  name: string
  description: string
  price: number
  stock: number
  options: string[]
}

// 프로젝트 데이터 인터페이스
interface ProjectData {
  id: number
  title: string
  description: string
  goalAmount: number
  totalAmount: number
  convertedMarkdown: string
  startAt: string
  endAt: string
  shippedAt: string
  imageUrls: string[]
  sellerResponse: {
    id: number
    sellerIntroduction: string
    linkUrl: string
  }
  productResponses: ProductResponse[]
}

// 컴포넌트에서 사용하는 상품 옵션 인터페이스
interface ProjectOption {
  id: string
  title: string
  description: string
  price: string
  remaining: number
  isSelected?: boolean
  details?: string[]
  color?: string
}

// 선택된 상품 정보 인터페이스
interface SelectedProduct {
  quantity: number
}

// 주문 생성 요청 인터페이스
interface CreateOrderRequest {
  deliveryInfoId: number
  projectId: number
  orderItems: {
    productId: number
    quantity: number
  }[]
}

// 주문 생성 응답 인터페이스
interface CreateOrderResponse {
  orderId: number
  totalPrice: number
  orderedAt: string
  items: {
    productId: number
    productName: string
    quantity: number
    price: number
  }[]
}

// 결제 준비 응답 인터페이스
interface PaymentReadyResponse {
  next_redirect_pc_url: string
  tid: string
}

const DonateDock = () => {
  // 현재 단계 (1: 상품 선택, 2: 결제 및 배송지 정보)
  const [step, setStep] = useState(1)
  const [isOpen, setIsOpen] = useState(false)

  // 단일 선택에서 복수 선택으로 변경
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  // 상품별 수량 관리를 위한 객체 맵으로 변경
  const [quantities, setQuantities] = useState<Record<string, SelectedProduct>>({})

  // 현재 펼쳐진 상품 ID 추적을 위한 상태 추가
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null)

  const [selectedPay, setSelectedPay] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<string | null>("1")

  // 배송지 검색 모달 상태
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  // 상태 관리 부분에 팝오버 관련 상태 추가
  const [showAddressPopover, setShowAddressPopover] = useState(false)

  // 주문 요약 더보기 팝오버 상태 추가
  const [showOrderSummaryPopover, setShowOrderSummaryPopover] = useState(false)
  const [orderSummaryPopoverPosition, setOrderSummaryPopoverPosition] = useState({ top: 0, left: 0 })

  // 팝오버 위치 계산을 위한 상태
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })

  // 결제 관련 상태 추가
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // 새 배송지 정보를 객체로 관리
  const [newAddress, setNewAddress] = useState<Omit<AddressInfo, "id" | "isDefault">>({
    name: "",
    address: "",
    detailAddress: "",
    zipCode: "",
  })

  // API 관련 상태 추가
  const { apiCall, isLoading: apiLoading } = useApi()
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([])

  // URL에서 프로젝트 ID 가져오기
  const { id: projectId } = useParams()

  // 프로젝트 데이터 가져오기
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await apiCall<ProjectData>(`/api/project/${projectId}`, "GET")

        if (error) {
          throw new Error(error)
        }

        if (data) {
          setProjectData(data)

          // 상품 옵션 데이터 변환
          if (data.productResponses && data.productResponses.length > 0) {
            const options = data.productResponses.map((product) => ({
              id: `option${product.id}`,
              title: product.name,
              description: product.description,
              price: product.price.toLocaleString(),
              remaining: product.stock,
              details: product.options || [],
              color: product.id % 2 === 0 ? "pink" : undefined, // 예시로 짝수 ID에 색상 추가
            }))
            setProjectOptions(options)
          } else {
            // 기본 상품 옵션 설정
            setProjectOptions(defaultProjectOptions)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "프로젝트 정보를 불러오는 중 오류가 발생했습니다.")
        console.error("프로젝트 정보 불러오기 오류:", err)
        // 오류 발생 시 기본 상품 옵션 설정
        setProjectOptions(defaultProjectOptions)
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      fetchProjectData()
    } else {
      // 프로젝트 ID가 없는 경우 기본 상품 옵션 설정
      setProjectOptions(defaultProjectOptions)
      setIsLoading(false)
    }
  }, [projectId, apiCall])

  // 주문 요약 더보기 버튼 참조
  const orderSummaryMoreRef = useRef<HTMLButtonElement>(null)

  // 기본 상품 옵션 데이터 - API 데이터가 없을 때 사용
  const defaultProjectOptions: ProjectOption[] = [
    {
      id: "option1",
      title: "마음만 받을게요",
      description: "돈통 ㄱㅅ",
      price: "1,000",
      remaining: 999999, // 무제한에 가까운 큰 숫자
      details: [],
    },
    {
      id: "option2",
      title: "피자 아닌 떡볶이",
      description: "떡볶이 하나 (색상 선택 가능)\n맵기 정도 (순한, 조금매운, 매운 선택 가능)",
      price: "5,000",
      remaining: 200000000, // 2억
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
      remaining: 200000000, // 2억
      details: ["피자 1판", "비밀 소스 포함", "배송비 무료", "예상 배송일: 2025년 6월 13일"],
    },
    {
      id: "option4",
      title: "프리미엄 세트",
      description: "떡볶이와 피자를 한번에 즐길 수 있는 프리미엄 세트",
      price: "150,000",
      remaining: 100, // 100개
      details: ["떡볶이 1인분", "피자 1판", "특별 소스 세트", "배송비 무료", "예상 배송일: 2025년 6월 10일"],
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

  // useEffect 훅에서 스크롤 방지 로직 추가
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

  // 독이 열리거나 닫힐 때 스크롤 제어를 위한 useEffect 추가
  useEffect(() => {
    if (isOpen) {
      // 독이 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden"
    } else {
      // 독이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = ""
    }

    return () => {
      // 컴포넌트 언마운트 시 body 스크롤 복원
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // 팝오버 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAddressPopover) {
        const popoverElement = document.getElementById("address-popover")
        if (popoverElement && !popoverElement.contains(event.target as Node)) {
          setShowAddressPopover(false)
        }
      }

      if (showOrderSummaryPopover) {
        const popoverElement = document.getElementById("order-summary-popover")
        if (popoverElement && !popoverElement.contains(event.target as Node)) {
          setShowOrderSummaryPopover(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showAddressPopover, showOrderSummaryPopover])

  // 선택된 상품의 남은 수량 가져오기
  const getProductRemaining = (optionId: string): number => {
    const option = projectOptions.find((opt) => opt.id === optionId)
    return option ? option.remaining : 0
  }

  // 남은 수량 표시 형식 포맷팅 함수
  const formatRemaining = (remaining: number): string => {
    if (remaining >= 1000) {
      return "999+개 남음"
    }
    return `${remaining}개 남음`
  }

  const toggleDock = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setStep(1) // 독이 열릴 때 항상 1단계부터 시작
    }
  }

  // 상품 선택 핸들러 수정 - 토글 방식으로 변경
  const handleOptionSelect = (optionId: string) => {
    // 이미 선택된 상품인지 확인
    const isSelected = selectedOptions.includes(optionId)

    if (isSelected) {
      // 이미 선택된 상품이면 선택 해제
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId))

      // 수량 정보에서도 제거
      const newQuantities = { ...quantities }
      delete newQuantities[optionId]
      setQuantities(newQuantities)

      // 펼쳐진 상품이 선택 해제되면 펼쳐진 상태도 초기화
      if (expandedProductId === optionId) {
        setExpandedProductId(null)
      }
    } else {
      // 선택되지 않은 상품이면 선택 추가
      setSelectedOptions([...selectedOptions, optionId])

      // 수량 정보에 추가 (기본값 1)
      setQuantities({
        ...quantities,
        [optionId]: { quantity: 1 },
      })
    }
  }

  // 상품 펼침/접힘 토글 핸들러 추가
  const toggleProductExpand = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지

    if (expandedProductId === optionId) {
      // 이미 펼쳐진 상품이면 접기
      setExpandedProductId(null)
    } else {
      // 다른 상품이면 해당 상품만 펼치기
      setExpandedProductId(optionId)
    }
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

  // 주문 요약 더보기 팝오버 표시 핸들러
  const toggleOrderSummaryPopover = () => {
    if (showOrderSummaryPopover) {
      setShowOrderSummaryPopover(false)
      return
    }

    if (orderSummaryMoreRef.current) {
      const buttonRect = orderSummaryMoreRef.current.getBoundingClientRect()
      const offset = selectedOptions.length * 44 > 320 ? 320 : selectedOptions.length * 44

      // 팝오버 위치 계산 (버튼 오른쪽 위에 위치하도록 변경)
      setOrderSummaryPopoverPosition({
        top: buttonRect.top - offset - 80, // 버튼보다 위에 위치
        left: buttonRect.right + 10, // 버튼 오른쪽에 여백을 두고 위치
      })

      setShowOrderSummaryPopover(true)
    }
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
    // 선택된 상품이 없으면 다음 단계로 진행하지 않음
    if (selectedOptions.length === 0) {
      alert("최소 1개 이상의 상품을 선택해주세요.")
      return
    }
    setStep(2)
  }

  const goToPreviousStep = () => {
    setStep(1)
  }

  // 수량 증가 함수 수정 - 특정 상품의 수량만 변경
  const increaseQuantity = (optionId: string) => {
    const remaining = getProductRemaining(optionId)
    const currentQuantity = quantities[optionId]?.quantity || 0

    if (currentQuantity < remaining) {
      setQuantities({
        ...quantities,
        [optionId]: { quantity: currentQuantity + 1 },
      })
    }
  }

  // 수량 감소 함수 수정 - 특정 상품의 수량만 변경
  const decreaseQuantity = (optionId: string) => {
    const currentQuantity = quantities[optionId]?.quantity || 0

    if (currentQuantity > 1) {
      setQuantities({
        ...quantities,
        [optionId]: { quantity: currentQuantity - 1 },
      })
    }
  }

  // 총 가격 계산 함수 수정 - 모든 선택된 상품의 가격 합산
  const getTotalPrice = () => {
    if (selectedOptions.length === 0) return "0"

    let total = 0

    selectedOptions.forEach((optionId) => {
      const option = projectOptions.find((opt) => opt.id === optionId)
      if (option) {
        const price = Number.parseInt(option.price.replace(/,/g, ""), 10)
        const quantity = quantities[optionId]?.quantity || 0
        total += price * quantity
      }
    })

    // 천 단위 콤마 추가
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // 독 외부 영역 클릭 시 닫기 함수 수정
  const handleOverlayClick = (e: React.MouseEvent) => {
    // 독 자체를 클릭했을 때 닫히도록 함
    setIsOpen(false)
  }

  // 독 내용물 클릭 시 이벤트 전파 중단 함수 추가
  const handleContentClick = (e: React.MouseEvent) => {
    // 내용물 클릭 시 이벤트 전파를 중단하여 독이 닫히지 않도록 함
    e.stopPropagation()
  }

  // 결제 처리 함수
  const handlePayment = async () => {
    // 필수 입력값 검증
    if (!selectedAddress) {
      alert("배송지를 선택해주세요.")
      return
    }

    if (!selectedPay) {
      alert("결제 수단을 선택해주세요.")
      return
    }

    if (selectedOptions.length === 0) {
      alert("최소 1개 이상의 상품을 선택해주세요.")
      return
    }

    try {
      setIsProcessingPayment(true)
      setPaymentError(null)

      // 1. 주문 생성 API 호출
      const orderItems = selectedOptions.map((optionId) => ({
        productId: Number.parseInt(optionId.replace("option", "")), // 'option1' -> 1
        quantity: quantities[optionId]?.quantity || 1,
      }))

      const orderRequest: CreateOrderRequest = {
        deliveryInfoId: Number.parseInt(selectedAddress),
        projectId: Number.parseInt(projectId as string),
        orderItems,
      }

      console.log("주문 요청:", orderRequest)

      const { data: orderData, error: orderError } = await apiCall<CreateOrderResponse>(
        "/api/orders",
        "POST",
        orderRequest,
      )

      if (orderError || !orderData) {
        throw new Error(orderError || "주문 생성에 실패했습니다.")
      }

      console.log("주문 생성 성공:", orderData)

      // 2. 결제 준비 API 호출
      const { data: paymentData, error: paymentError } = await apiCall<PaymentReadyResponse>(
        `/api/payment/ready/${orderData.orderId}`,
        "POST",
      )

      if (paymentError || !paymentData) {
        throw new Error(paymentError || "결제 준비에 실패했습니다.")
      }

      console.log("결제 준비 성공:", paymentData)

      // 3. 결제 페이지로 이동
      window.open(paymentData.next_redirect_pc_url, "_blank")

      // 4. 독 닫기
      setIsOpen(false)
    } catch (error) {
      console.error("결제 처리 오류:", error)
      setPaymentError(error instanceof Error ? error.message : "결제 처리 중 오류가 발생했습니다.")
    } finally {
      setIsProcessingPayment(false)
    }
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
            <ChevronUp className="mr-2 h-6 w-6 text-sub-gray" />
            <span className="text-lg font-medium text-gray-800">후원하기</span>
          </button>
        </div>
      </div>

      {/* 독이 열려있을 때만 오버레이 표시 */}
      {isOpen && <div className="fixed inset-0 z-25" onClick={handleOverlayClick} aria-hidden="true" />}

      {/* 후원하기 Dock */}
      <div
        className={`fixed bottom-0 left-0 z-30 w-full transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={handleOverlayClick}
      >
        <div className="mx-auto max-w-6xl px-4" onClick={handleContentClick}>
          <div className="rounded-t-3xl border border-gray-border bg-white p-6 pb-0 shadow-lg">
            {/* Dock 헤더 - 항상 동일한 레이아웃 */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">후원하기</h2>
              <button onClick={toggleDock} className="rounded-full p-1 hover:bg-gray-100" aria-label="닫기">
                <ChevronDown className="h-6 w-6" />
              </button>
            </div>

            {/* 로딩 상태 표시 */}
            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <p className="text-sub-gray text-lg">상품 정보를 불러오는 중...</p>
              </div>
            )}

            {/* 에러 메시지 표시 */}
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-red-500 my-4">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-2 text-sm underline">
                  다시 시도
                </button>
              </div>
            )}

            {/* 단계별 내용 */}
            {!isLoading && !error && (
              <>
                {step === 1 ? (
                  // 1단계: 상품 선택
                  <div className="space-y-6">
                    <h3 className="mb-2 text-lg font-medium">상품 선택 (복수 선택 가능)</h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      {/* 왼쪽 영역: 상품 카드 목록 (1/3 너비) - 스크롤 가능하도록 수정 */}
                      <div className="md:col-span-1">
                        <div className="h-[500px] overflow-y-auto pr-2 pt-4 space-y-6">
                          {projectOptions.map((option) => {
                            const isSelected = selectedOptions.includes(option.id)
                            return (
                              <div
                                key={option.id}
                                className={`relative flex cursor-pointer items-center rounded-xl border p-4 transition-all ${
                                  isSelected
                                    ? "border-2 border-main-color"
                                    : "border-gray-border hover:border-secondary-color-dark"
                                }`}
                                onClick={() => handleOptionSelect(option.id)}
                              >
                                <div className="absolute -right-2 -top-4">
                                  <div className="rounded-full border-2 border-main-color bg-white px-3 py-1 text-sm text-main-color shadow-sm">
                                    <span>{formatRemaining(option.remaining)}</span>
                                  </div>
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <div
                                      className={`mr-2 h-5 w-5 rounded-md flex items-center justify-center ${
                                        isSelected ? "bg-main-color" : "border border-gray-border"
                                      }`}
                                    >
                                      {isSelected && <Check className="h-4 w-4 text-white" />}
                                    </div>
                                    <h4 className={`text-lg font-bold ${isSelected ? "text-main-color" : ""}`}>
                                      {option.title}
                                    </h4>
                                  </div>

                                  {isSelected && (
                                    <div className="mt-2 flex items-center">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          decreaseQuantity(option.id)
                                        }}
                                        className="h-8 w-8 pb-1 rounded-full bg-gray-border flex items-center justify-center text-sub-gray"
                                      >
                                        -
                                      </button>
                                      <span className="mx-4 text-lg">{quantities[option.id]?.quantity || 0}</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          increaseQuantity(option.id)
                                        }}
                                        className="h-8 w-8 pb-1 rounded-full bg-gray-border flex items-center justify-center text-sub-gray"
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className={`text-xl font-medium ${isSelected ? "text-main-color" : ""}`}>
                                  {option.price}원
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* 오른쪽 영역: 선택된 상품 세부 정보 (2/3 너비) */}
                      <div className="md:col-span-2 rounded-xl border border-gray-border mt-4 flex flex-col h-[484px]">
                        {/* 스크롤 영역 - 선택된 상품 목록만 포함 */}
                        <div className="h-[430px] overflow-y-auto p-4 flex-grow">
                          {selectedOptions.length > 0 ? (
                            <>
                              <h4 className="mb-4 text-lg font-bold">선택된 상품 ({selectedOptions.length}개)</h4>

                              <div className="space-y-4">
                                {selectedOptions.map((optionId) => {
                                  const option = projectOptions.find((opt) => opt.id === optionId)
                                  if (!option) return null

                                  const quantity = quantities[optionId]?.quantity || 0
                                  const price = Number.parseInt(option.price.replace(/,/g, ""), 10)
                                  const itemTotal = price * quantity
                                  const isExpanded = expandedProductId === optionId

                                  return (
                                    <div
                                      key={optionId}
                                      className="border border-gray-border rounded-lg overflow-hidden"
                                    >
                                      {/* 상품 헤더 - 클릭 시 펼침/접힘 */}
                                      <div
                                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                                        onClick={(e) => toggleProductExpand(optionId, e)}
                                      >
                                        <div className="flex items-center">
                                          <ChevronRight
                                            className={`h-5 w-5 mr-2 text-sub-gray transition-transform ${
                                              isExpanded ? "rotate-90" : ""
                                            }`}
                                          />
                                          <h5 className="font-medium">{option.title}</h5>
                                        </div>
                                        <span>
                                          {quantity}개 × {option.price}원 = {itemTotal.toLocaleString()}원
                                        </span>
                                      </div>

                                      {/* 펼쳐진 상태일 때만 구성 정보 표시 */}
                                      {isExpanded && (
                                        <div className="bg-gray-50 p-4 border-t border-gray-border">
                                          <div className="mb-4">
                                            <p className="text-sub-gray">{option.description}</p>
                                          </div>

                                          <h6 className="mb-2 font-medium">구성</h6>
                                          {option.details && option.details.length > 0 ? (
                                            <ul className="space-y-2">
                                              {option.details.map((detail, index) => (
                                                <li key={index} className="flex items-start">
                                                  <span className="mr-2 text-main-color">•</span>
                                                  <span>{detail}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          ) : (
                                            <p className="text-sub-gray">구성 정보가 없습니다.</p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full py-12">
                              <p className="text-sub-gray text-lg">상품을 선택해주세요</p>
                            </div>
                          )}
                        </div>

                        {/* 총 금액 영역 - 하단에 고정 */}
                        <div className="border-t border-gray-border p-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">합계</span>
                            <span className="text-xl font-bold text-main-color">{getTotalPrice()}원</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 다음 단계 버튼 */}
                    <div className="mt-8 bg-white pb-8">
                      <div className="flex justify-end">
                        <button
                          className={`rounded-xl px-8 py-3 font-medium ${
                            selectedOptions.length > 0
                              ? "bg-main-color text-white hover:bg-secondary-color-dark"
                              : "bg-gray-border text-sub-gray cursor-not-allowed"
                          }`}
                          onClick={goToNextStep}
                          disabled={selectedOptions.length === 0}
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
                          selectedPay === "kakaopay"
                            ? "border-2 border-main-color"
                            : "border-gray-border hover:border-main-color"
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
                                  ? "border-2 border-main-color"
                                  : "border-gray-border hover:border-main-color"
                              }`}
                              onClick={() => handleAddressSelect(address.id)}
                            >
                              <div className="flex items-center justify-between mb-2 overflow-hidden">
                                <h4 className="font-bold line-clamp-1 whitespace-pre-wrap break-words">
                                  {address.name}
                                </h4>
                                {address.isDefault && (
                                  <span className="text-xs bg-gray-100 text-sub-gray px-2 py-1 rounded-full">
                                    기본 배송지
                                  </span>
                                )}
                              </div>
                              <div className="overflow-hidden">
                                <p className="line-clamp-2 text-sub-gray whitespace-pre-wrap break-words">
                                  [{address.zipCode}] {address.address} {address.detailAddress}
                                </p>
                              </div>
                            </div>
                          ))}

                          {/* 배송지 추가 버튼 */}
                          <div
                            className="flex-shrink-0 w-60 border border-dashed border-gray-border rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 relative"
                            onClick={(e) => {
                              e.stopPropagation()
                              addNewAddress(e)
                            }}
                          >
                            <div className="flex flex-col items-center text-sub-gray">
                              <Plus className="w-10 h-10 mb-2" />
                              <span className="text-sm font-medium">배송지 추가</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 주문 요약 */}
                    <div className="rounded-xl border border-gray-border p-4">
                      <h3 className="mb-4 text-lg font-medium">주문 요약</h3>

                      <div className="space-y-4">
                        {/* 총 선택 상품 개수만 표시 */}
                        <div className="flex mb-0 justify-between items-center">
                          <button
                            ref={orderSummaryMoreRef}
                            onClick={toggleOrderSummaryPopover}
                            className="text-main-color hover:text-main-color font-medium flex items-center"
                          >
                            선택한 상품 {selectedOptions.length}개 보기
                            <ChevronRight
                              className={`ml-1 h-4 w-4 transition-transform ${
                                showOrderSummaryPopover ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        <div className="pt-2 flex justify-between text-sub-gray">
                          <span>배송비</span>
                          <span>무료</span>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-gray-border pt-4">
                        <div className="flex justify-between">
                          <span className="font-medium">총 결제 금액</span>
                          <span className="text-xl font-bold">{getTotalPrice()}원</span>
                        </div>
                      </div>
                    </div>

                    {/* 결제 오류 메시지 표시 */}
                    {paymentError && (
                      <div className="rounded-xl bg-red-50 p-4 text-red-500">
                        <p>{paymentError}</p>
                      </div>
                    )}

                    {/* 하단 결제 정보 및 버튼 */}
                    <div className="mt-8 bg-white pb-8">
                      {/* 버튼 영역 */}
                      <div className="flex justify-end space-x-4">
                        <button
                          className={`rounded-xl bg-main-color px-8 py-3 font-medium text-white hover:bg-secondary-color-dark ${
                            isProcessingPayment ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                          onClick={handlePayment}
                          disabled={isProcessingPayment}
                        >
                          {isProcessingPayment ? "처리 중..." : "후원하기"}
                        </button>
                        <button
                          className="rounded-xl bg-cancel-background px-8 py-3 font-medium text-white hover:bg-cancel-background-dark"
                          onClick={goToPreviousStep}
                          disabled={isProcessingPayment}
                        >
                          이전
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 배송지 추가 팝오버 */}
      {showAddressPopover && (
        <div
          id="address-popover"
          className="fixed bg-white rounded-xl border border-gray-border p-4 shadow-lg z-40 w-80"
          style={{
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
          }}
        >
          <h4 className="text-lg font-medium mb-4">새 배송지 추가</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sub-gray mb-1">배송지명</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-border rounded-lg"
                placeholder="배송지명 입력"
                value={newAddress.name}
                onChange={(e) => handleInputChange(e, "name")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sub-gray mb-1">주소</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-border rounded-lg"
                  placeholder="'찾기'를 눌러서 주소 입력"
                  value={newAddress.address}
                  readOnly
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-border rounded-lg text-sm"
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  찾기
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sub-gray mb-1">상세 주소</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-border rounded-lg"
                placeholder="상세 주소 입력"
                value={newAddress.detailAddress}
                onChange={(e) => handleInputChange(e, "detailAddress")}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-border rounded-lg text-sm"
                onClick={() => setShowAddressPopover(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-main-color text-white rounded-lg text-sm"
                onClick={saveNewAddress}
              >
                저장
              </button>
            </div>
          </div>
          {/* 배송지 주소 모달 */}
          {isAddressModalOpen && (
            <AddressModal
              isOpen={isAddressModalOpen}
              onClose={() => setIsAddressModalOpen(false)}
              onComplete={handleComplete}
            />
          )}
        </div>
      )}

      {/* 주문 요약 더보기 팝오버 */}
      {showOrderSummaryPopover && (
        <div
          id="order-summary-popover"
          className="fixed bg-white rounded-xl border border-gray-border p-4 shadow-lg z-40 w-80"
          style={{
            top: `${orderSummaryPopoverPosition.top}px`,
            left: `${orderSummaryPopoverPosition.left}px`,
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-medium">전체 주문 항목</h4>
            <button onClick={() => setShowOrderSummaryPopover(false)} className="text-sub-gray hover:text-sub-gray">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            <div className="space-y-1">
              {selectedOptions.map((optionId) => {
                const option = projectOptions.find((opt) => opt.id === optionId)
                if (!option) return null

                const quantity = quantities[optionId]?.quantity || 0
                const price = Number.parseInt(option.price.replace(/,/g, ""), 10)
                const itemTotal = price * quantity

                return (
                  <div key={optionId} className="flex justify-between items-center py-2">
                    <div>
                      <span className="font-medium">{option.title}</span>
                      <span className="text-sub-gray ml-2">{quantity}개</span>
                    </div>
                    <span>{itemTotal.toLocaleString()}원</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-border">
            <div className="flex justify-between items-center">
              <span className="font-medium">합계</span>
              <span className="text-lg font-bold text-main-color">{getTotalPrice()}원</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DonateDock
