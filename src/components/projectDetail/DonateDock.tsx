"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronUp, ChevronDown, Plus, Check, ChevronRight, X, Search } from "lucide-react"
import { useParams } from "next/navigation"
import { useApi } from "@/hooks/useApi"

// 1. 상단에 AlertModal import 추가
import AlertModal from "../common/AlertModal"
import { CancelButton, PrimaryButton } from "../common/Button"
import AddressAddModal from "./AddressAddModal"
import Modal from "../common/Modal"

interface AddressInfo {
  id: string
  address: string
  detailAddress: string
  zipcode: string
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

  // 2. 컴포넌트 내부에 AlertModal 상태 추가 (useState 선언 부분 근처에 추가)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [isAlertOpen, setIsAlertOpen] = useState(false)

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
  const [showAddressAddModal, setShowAddressAddModal] = useState(false)

  // 주문 요약 더보기 팝오버 상태 추가
  const [showOrderSummaryPopover, setShowOrderSummaryPopover] = useState(false)
  const [orderSummaryPopoverPosition, setOrderSummaryPopoverPosition] = useState({ top: 0, left: 0 })

  // 팝오버 위치 계산을 위한 상태
  // const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })

  // 결제 관련 상태 추가
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  // 2. 결제 완료 모달 상태 추가 (isProcessingPayment 상태 아래에 추가)
  const [showPaymentCompleteModal, setShowPaymentCompleteModal] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // 새 배송지 정보를 객체로 관리
  const [newAddress, setNewAddress] = useState<Omit<AddressInfo, "id" | "isDefault">>({
    address: "",
    detailAddress: "",
    zipcode: "",
  })

  // API 관련 상태 추가
  const { apiCall, isLoading: apiLoading } = useApi()
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([])

  // URL에서 프로젝트 ID 가져오기
  const { id: projectId } = useParams()

  // 컴포넌트 내부 상단에 추가
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 후원 가능 여부 확인 함수
  const canDonate = (projectData: ProjectData | null): boolean => {
    if (!projectData?.productResponses || projectData.productResponses.length === 0) {
      return false
    }

    // 모든 상품의 재고가 0인지 확인
    const hasAvailableStock = projectData.productResponses.some((product) => product.stock > 0)
    return hasAvailableStock
  }

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
      title: "옵션 없음",
      description: "이 상품은 옵션이 없습니다.",
      price: "0",
      remaining: 1,
      details: [],
    },
  ]

  // 배송지 데이터 - 더 많은 데이터 추가
  const [addresses, setAddresses] = useState<AddressInfo[]>([])

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data, error } = await apiCall<AddressInfo[]>("/api/delivery/delivery-info", "GET")

        if (error) {
          console.error("배송지 정보 불러오기 오류:", error)
          return
        }

        if (data) {
          setAddresses(data)
          // 기본 배송지가 있으면 선택
          const defaultAddress = data.find((addr) => addr.isDefault)
          if (defaultAddress) {
            setSelectedAddress(defaultAddress.id)
          } else if (data.length > 0) {
            // 기본 배송지가 없으면 첫 번째 배송지 선택
            setSelectedAddress(data[0].id)
          }
        }
      } catch (err) {
        console.error("배송지 정보 불러오기 오류:", err)
      }
    }

    if (isOpen && step === 2) {
      fetchAddresses()
    }
  }, [isOpen, step, apiCall, setSelectedAddress])

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

  // 5. 결제 창 메시지 수신 이벤트 리스너 추가 (useEffect 내부에 추가)
  // 독이 열리거나 닫힐 때 스크롤 제어를 위한 useEffect 아래에 추가
  useEffect(() => {
    // 결제 완료 후 메시지 수신을 위한 이벤트 리스너
    const handlePaymentMessage = async (event: MessageEvent) => {
      // 결제 관련 메시지인지 확인
      if (event.data && typeof event.data === "object" && event.data.type === "KAKAO_PAYMENT_SUCCESS") {
        // 결제가 성공적으로 완료됨
        setIsOpen(false)
        // 선택된 상품 초기화
        setSelectedOptions([])
        setQuantities({})
      }
    }

    window.addEventListener("message", handlePaymentMessage)

    return () => {
      window.removeEventListener("message", handlePaymentMessage)
    }
  }, [])

  // 팝오버 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAddressAddModal) {
        const popoverElement = document.getElementById("address-popover")
        if (popoverElement && !popoverElement.contains(event.target as Node)) {
          setShowAddressAddModal(false)
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
  }, [showAddressAddModal, showOrderSummaryPopover])

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

      // 주석을 풀면 수량 정보도 제거
      // const newQuantities = { ...quantities }
      // delete newQuantities[optionId]
      // setQuantities(newQuantities)

      // 펼쳐진 상품이 선택 해제되면 펼쳐진 상태도 초기화
      if (expandedProductId === optionId) {
        setExpandedProductId(null)
      }
    } else {
      // 선택되지 않은 상품이면 선택 추가
      setSelectedOptions([...selectedOptions, optionId])

      // 수량 정보에 추가 (기존 수량이 있으면 유지, 없으면 기본값 1)
      if (!quantities[optionId]) {
        setQuantities({
          ...quantities,
          [optionId]: { quantity: 1 },
        })
      }
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

  const addNewAddress = () => {
    // 모달 표시
    setShowAddressAddModal(true)

    // 입력 필드 초기화
    setNewAddress({
      address: "",
      detailAddress: "",
      zipcode: "",
    })
  }

  // 주문 요약 더보기 팝오버 표시 핸들러
  const toggleOrderSummaryPopover = () => {
    if (showOrderSummaryPopover) {
      setShowOrderSummaryPopover(false)
      return
    }

    // 모바일: ref 없이 바로 모달 오픈
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowOrderSummaryPopover(true)
      return
    }

    // 데스크톱: 기존대로 ref 위치 계산
    if (orderSummaryMoreRef.current) {
      const buttonRect = orderSummaryMoreRef.current.getBoundingClientRect()
      const offset = selectedOptions.length * 44 > 320 ? 320 : selectedOptions.length * 44
      setOrderSummaryPopoverPosition({
        top: buttonRect.top - offset - 80,
        left: buttonRect.right + 10,
      })
      setShowOrderSummaryPopover(true)
    }
  }

  const handleComplete = (data: any) => {
    setNewAddress({
      ...newAddress,
      address: data.address,
      zipcode: data.zonecode,
    })
    setIsAddressModalOpen(false)
  }

  // 새 배송지 저장 함수
  const saveNewAddress = () => {
    // 필수 입력값 검증
    if (!newAddress.address || !newAddress.detailAddress) {
      setAlertMessage("주소와 상세 주소를 모두 입력해주세요.")
      setIsAlertOpen(true)
      return
    }

    // 새 배송지 추가 API 호출
    apiCall("/api/delivery/delivery-info", "POST", {
      zipcode: newAddress.zipcode,
      address: newAddress.address,
      detailAddress: newAddress.detailAddress,
    }).then(({ data, error }) => {
      if (error) {
        setAlertMessage("배송지 추가에 실패했습니다.")
        setIsAlertOpen(true)
        return
      }

      // 배송지 목록 다시 불러오기
      apiCall<AddressInfo[]>("/api/delivery/delivery-info", "GET").then(({ data }) => {
        if (data) {
          setAddresses(data)
          // 새로 추가된 배송지가 있으면 선택
          if (data.length > 0) {
            setSelectedAddress(data[data.length - 1].id)
          }
        }
      })

      // 팝오버 닫기
      setShowAddressAddModal(false)
    })
  }

  // 배송지 추가 모달 열기 핸들러
  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true)
  }

  const goToNextStep = () => {
    // 4. 다음 단계로 진행 함수의 alert 호출 부분 수정
    // 선택된 상품이 없으면 다음 단계로 진행하지 않음
    if (selectedOptions.length === 0) {
      setAlertMessage("최소 1개 이상의 상품을 선택해주세요.")
      setIsAlertOpen(true)
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
      setAlertMessage("배송지를 선택해주세요.")
      setIsAlertOpen(true)
      return
    }

    if (!selectedPay) {
      setAlertMessage("결제 수단을 선택해주세요.")
      setIsAlertOpen(true)
      return
    }

    if (selectedOptions.length === 0) {
      setAlertMessage("최소 1개 이상의 상품을 선택해주세요.")
      setIsAlertOpen(true)
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
        "/api/order",
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
      // paymentData.next_redirect_pc_url 사용하는 부분 바로 위에 추가
      const popupWidth = 450
      const popupHeight = 700
      const left = window.screen.width / 2 - popupWidth / 2
      const top = window.screen.height / 2 - popupHeight / 2

      const paymentWindow = window.open(
        paymentData.next_redirect_pc_url,
        "KakaoPayment",
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`,
      )

      // 팝업 창이 차단되었는지 확인
      if (!paymentWindow || paymentWindow.closed || typeof paymentWindow.closed === "undefined") {
        setAlertMessage("팝업 창이 차단되었습니다. 팝업 차단을 해제해주세요.")
        setIsAlertOpen(true)
      }

      // 4. 독 닫기
      setIsOpen(false)
    } catch (error) {
      console.error("결제 처리 오류:", error)
      setPaymentError(error instanceof Error ? error.message : "결제 처리 중 오류가 발생했습니다.")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // 수량 직접 입력 핸들러를 수정하여 빈 값을 허용하도록 변경
  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>, optionId: string) => {
    e.stopPropagation()
    const value = e.target.value

    // 빈 문자열이면 그대로 허용
    if (value === "") {
      setQuantities({
        ...quantities,
        [optionId]: { quantity: 0 }, // 임시로 0 설정
      })
      return
    }

    const newValue = Number.parseInt(value, 10)
    const remaining = getProductRemaining(optionId)

    if (!isNaN(newValue)) {
      // 최소값은 1, 최대값은 남은 수량으로 제한
      const validValue = Math.min(newValue, remaining)

      setQuantities({
        ...quantities,
        [optionId]: { quantity: validValue },
      })
    }
  }

  // 포커스가 벗어날 때 기본값을 적용하는 함수 추가
  const handleQuantityInputBlur = (optionId: string) => {
    const currentQuantity = quantities[optionId]?.quantity || 0

    // 수량이 0이거나 없으면 기본값 1로 설정
    if (currentQuantity <= 0) {
      setQuantities({
        ...quantities,
        [optionId]: { quantity: 1 },
      })
    }
  }

  // 7. 결제 완료 모달 컴포넌트
  const PaymentCompleteModal = () => {
    if (!showPaymentCompleteModal) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <h3 className="mb-2 text-center text-2xl font-bold">결제 완료</h3>
          <p className="mb-6 text-center text-sub-gray">결제가 성공적으로 완료되었습니다.</p>

          <div className="flex justify-center">
            <button
              onClick={() => {
                setShowPaymentCompleteModal(false)
                setIsOpen(false)
              }}
              className="rounded-xl bg-main-color px-8 py-3 font-medium text-white hover:bg-secondary-color-dark"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 8. 결제 완료 모달 렌더링 추가 (return 문 내부 마지막에 추가)
  // 결제 완료 모달 렌더링 부분을 return 문 내부 마지막에 추가
  return (
    <>
      <AlertModal isOpen={isAlertOpen} message={alertMessage} onClose={() => setIsAlertOpen(false)} />
      {/* 고정된 후원하기 버튼 - 상품이 있고 재고가 있을 때만 표시 */}
      {canDonate(projectData) && (
        <div className="fixed bottom-0 left-0 z-4 w-full">
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
      )}

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
              <h2 className="text-lg md:text-2xl font-bold">후원하기</h2>
              <button onClick={toggleDock} className="rounded-full p-0.5 md:p-1 hover:bg-gray-100" aria-label="닫기">
                <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
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
                  <div className="space-y-4 md:space-y-6">
                    <h3 className="mb-2 text-base md:text-lg font-medium">상품 선택 (복수 선택 가능)</h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                      {/* 왼쪽 영역: 상품 카드 목록 */}
                      <div className="md:col-span-1">
                        <div className="h-[320px] md:h-[500px] overflow-y-auto pr-1 md:pr-2 pt-2 md:pt-4 space-y-3 md:space-y-6">
                          {projectOptions.map((option) => {
                            const isSelected = selectedOptions.includes(option.id)
                            return (
                              <div
                                key={option.id}
                                className={`relative flex cursor-pointer items-center rounded-lg md:rounded-xl border p-3 md:p-4 transition-all ${
                                  isSelected
                                    ? "border-2 border-main-color"
                                    : "border-gray-border hover:border-secondary-color-dark"
                                }`}
                                onClick={() => handleOptionSelect(option.id)}
                              >
                                {/* 데스크톱: n개 남음 배지 */}
                                <div className="hidden md:block absolute -right-2 -top-4">
                                  <div className="rounded-full border-2 border-main-color bg-white px-3 py-1 text-sm text-main-color shadow-sm">
                                    <span>{formatRemaining(option.remaining)}</span>
                                  </div>
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <div
                                      className={`mr-2 h-4 w-4 md:h-5 md:w-5 rounded-md flex items-center justify-center ${
                                        isSelected ? "bg-main-color" : "border border-gray-border"
                                      }`}
                                    >
                                      {isSelected && <Check className="h-3 w-3 md:h-4 md:w-4 text-white" />}
                                    </div>
                                    <h4 className={`text-base md:text-lg font-bold ${isSelected ? "text-main-color" : ""}`}>
                                      {option.title}
                                    </h4>
                                  </div>

                                  {/* 모바일: 남은 개수 */}
                                  <div className="block md:hidden mt-1">
                                    <span className="text-xs text-sub-gray">{formatRemaining(option.remaining)}</span>
                                  </div>

                                  {isSelected && (
                                    <div className="mt-2 flex items-center">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          decreaseQuantity(option.id)
                                        }}
                                        className="h-7 w-7 md:h-8 md:w-8 pb-1 rounded-full bg-gray-border flex items-center justify-center text-sub-gray"
                                      >
                                        -
                                      </button>
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={quantities[option.id]?.quantity || ""}
                                        onChange={(e) => handleQuantityInputChange(e, option.id)}
                                        onBlur={() => handleQuantityInputBlur(option.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="mx-1 md:mx-2 w-8 md:w-12 text-sm md:text-base text-center border border-gray-border rounded-md"
                                      />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          increaseQuantity(option.id)
                                        }}
                                        className="h-7 w-7 md:h-8 md:w-8 pb-1 rounded-full bg-gray-border flex items-center justify-center text-sub-gray"
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className={`text-base md:text-xl font-medium ${isSelected ? "text-main-color" : ""}`}>
                                  {option.price}원
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* 오른쪽 영역: 선택된 상품 세부 정보 */}
                      <div className="md:col-span-2 rounded-lg md:rounded-xl border border-gray-border mt-3 md:mt-4 flex flex-col h-[300px] md:h-[484px] hidden md:flex">
                        <div className="h-[260px] md:h-[430px] overflow-y-auto p-3 md:p-4 flex-grow">
                          {selectedOptions.length > 0 ? (
                            <>
                              <h4 className="mb-3 md:mb-4 text-base md:text-lg font-bold">
                                선택된 상품 ({selectedOptions.length}개)
                              </h4>

                              <div className="space-y-3 md:space-y-4">
                                {selectedOptions.map((optionId) => {
                                  const option = projectOptions.find((opt) => opt.id === optionId)
                                  if (!option) return null

                                  const quantity = quantities[optionId]?.quantity || 0
                                  const price = Number.parseInt(option.price.replace(/,/g, ""), 10)
                                  const itemTotal = price * quantity
                                  const isExpanded = expandedProductId === optionId

                                  return (
                                    <div key={optionId} className="border border-gray-border rounded-lg overflow-hidden">
                                      <div
                                        className="flex justify-between items-center p-3 md:p-4 cursor-pointer hover:bg-gray-50"
                                        onClick={(e) => toggleProductExpand(optionId, e)}
                                      >
                                        <div className="flex items-center">
                                          <ChevronRight
                                            className={`h-4 w-4 md:h-5 md:w-5 mr-2 text-sub-gray transition-transform ${
                                              isExpanded ? "rotate-90" : ""
                                            }`}
                                          />
                                          <h5 className="text-sm md:text-base font-medium">{option.title}</h5>
                                        </div>
                                        <span className="text-sm md:text-base">
                                          {quantity}개 × {option.price}원 = {itemTotal.toLocaleString()}원
                                        </span>
                                      </div>

                                      {isExpanded && (
                                        <div className="bg-gray-50 p-3 md:p-4 border-t border-gray-border">
                                          <div className="mb-3 md:mb-4">
                                            <p className="text-sm md:text-base text-sub-gray">{option.description}</p>
                                          </div>

                                          <h6 className="mb-2 text-sm md:text-base font-medium">구성</h6>
                                          {option.details && option.details.length > 0 ? (
                                            <ul className="space-y-1 md:space-y-2">
                                              {option.details.map((detail, index) => (
                                                <li key={index} className="flex items-start text-sm md:text-base">
                                                  <span className="mr-2 text-main-color">•</span>
                                                  <span>{detail}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          ) : (
                                            <p className="text-sm md:text-base text-sub-gray">구성 정보가 없습니다.</p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full py-8 md:py-12">
                              <p className="text-base md:text-lg text-sub-gray">상품을 선택해주세요</p>
                            </div>
                          )}
                        </div>

                        {/* 총 금액 영역 */}
                        <div className="border-t border-gray-border p-3 md:p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm md:text-base font-medium">합계</span>
                            <span className="text-base md:text-xl font-bold text-main-color">{getTotalPrice()}원</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 모바일: 선택한 상품 보기 버튼 */}
                    <div className="block md:hidden mt-4">
                      <button
                        className="w-full rounded-lg border border-main-color text-main-color py-2 text-sm font-medium"
                        onClick={toggleOrderSummaryPopover}
                        type="button"
                      >
                        선택한 상품 보기
                      </button>
                    </div>

                    {/* 다음 단계 버튼 */}
                    <div className="mt-6 md:mt-8 bg-white pb-6 md:pb-8">
                      <div className="flex justify-end">
                        <PrimaryButton
                          className={`w-full md:w-auto rounded-lg md:rounded-xl px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium ${
                            selectedOptions.length > 0
                              ? "bg-main-color text-white hover:bg-secondary-color-dark"
                              : "bg-gray-border text-sub-gray cursor-not-allowed"
                          }`}
                          onClick={goToNextStep}
                          disabled={selectedOptions.length === 0}
                        >
                          다음 단계
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                ) : (
                  // 2단계: 결제 및 배송지 정보
                  <div className="space-y-4 md:space-y-6">
                    {/* 결제 수단 */}
                    <div>
                      <h3 className="mb-3 md:mb-4 text-base md:text-lg font-medium">결제 수단</h3>
                      <div
                        className={`inline-block cursor-pointer rounded-lg md:rounded-xl border px-12 md:px-16 p-3 md:p-4 transition-all ${
                          selectedPay === "kakaopay"
                            ? "border-2 border-main-color"
                            : "border-gray-border hover:border-main-color"
                        }`}
                        onClick={() => handlePaySelect("kakaopay")}
                      >
                        <span className="text-sm md:text-base font-medium">카카오페이</span>
                      </div>
                    </div>

                    {/* 배송지 선택 */}
                    <div>
                      <h3 className="mb-3 md:mb-4 text-base md:text-lg font-medium">배송지 선택</h3>
                      <div className="relative">
                        <div className="flex overflow-x-auto pb-3 md:pb-4 space-x-3 md:space-x-4 scrollbar-hide">
                          {addresses.map((address) => (
                            <div
                              key={address.id}
                              className={`flex-shrink-0 w-48 md:w-60 cursor-pointer rounded-lg md:rounded-xl border p-3 md:p-4 transition-all ${
                                selectedAddress === address.id
                                  ? "border-2 border-main-color"
                                  : "border-gray-border hover:border-main-color"
                              }`}
                              onClick={() => handleAddressSelect(address.id)}
                            >
                              <div className="flex items-center justify-between mb-2 overflow-hidden">
                                <h4 className="text-sm md:text-base font-bold line-clamp-1 whitespace-pre-wrap break-words">
                                  {address.zipcode}
                                </h4>
                                {address.isDefault && (
                                  <span className="text-xs bg-gray-100 text-sub-gray px-2 py-0.5 md:py-1 rounded-full">
                                    기본 배송지
                                  </span>
                                )}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs md:text-sm line-clamp-2 text-sub-gray whitespace-pre-wrap break-words">
                                  {address.address} {address.detailAddress}
                                </p>
                              </div>
                            </div>
                          ))}

                          {/* 배송지 추가 버튼 */}
                          <div
                            className="flex-shrink-0 w-48 md:w-60 border border-dashed border-gray-border rounded-lg md:rounded-xl p-3 md:p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 relative"
                            onClick={() => addNewAddress()}
                          >
                            <div className="flex flex-col items-center text-sub-gray">
                              <Plus className="w-8 h-8 md:w-10 md:h-10 mb-1 md:mb-2" />
                              <span className="text-xs md:text-sm font-medium">배송지 추가</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 주문 요약 */}
                    <div className="rounded-lg md:rounded-xl border border-gray-border p-3 md:p-4">
                      <h3 className="mb-3 md:mb-4 text-base md:text-lg font-medium">주문 요약</h3>
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex mb-0 justify-between items-center">
                          <button
                            ref={orderSummaryMoreRef}
                            onClick={toggleOrderSummaryPopover}
                            className="text-sm md:text-base text-main-color hover:text-main-color font-medium flex items-center"
                          >
                            선택한 상품 {selectedOptions.length}개 보기
                            <ChevronRight
                              className={`ml-1 h-3 w-3 md:h-4 md:w-4 transition-transform ${
                                showOrderSummaryPopover ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        <div className="pt-2 flex justify-between text-sm md:text-base text-sub-gray">
                          <span>배송비</span>
                          <span>무료</span>
                        </div>
                      </div>

                      <div className="mt-3 md:mt-4 border-t border-gray-border pt-3 md:pt-4">
                        <div className="flex justify-between">
                          <span className="text-sm md:text-base font-medium">총 결제 금액</span>
                          <span className="text-base md:text-xl font-bold">{getTotalPrice()}원</span>
                        </div>
                      </div>
                    </div>

                    {/* 결제 오류 메시지 */}
                    {paymentError && (
                      <div className="rounded-lg md:rounded-xl bg-red-50 p-3 md:p-4 text-sm md:text-base text-red-500">
                        <p>{paymentError}</p>
                      </div>
                    )}

                    {/* 하단 결제 정보 및 버튼 */}
                    <div className="mt-6 md:mt-8 bg-white pb-6 md:pb-8">
                      <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4">
                        <PrimaryButton
                          className={`w-full md:w-auto rounded-lg md:rounded-xl bg-main-color px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium text-white hover:bg-secondary-color-dark ${
                            isProcessingPayment ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                          onClick={handlePayment}
                          disabled={isProcessingPayment}
                        >
                          {isProcessingPayment ? "처리 중..." : "후원하기"}
                        </PrimaryButton>
                        <CancelButton
                          className="w-full md:w-auto rounded-lg md:rounded-xl bg-cancel-background px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium text-white hover:bg-cancel-background-dark"
                          onClick={goToPreviousStep}
                          disabled={isProcessingPayment}
                        >
                          이전
                        </CancelButton>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 배송지 추가 모달 */}
      <AddressAddModal
        isOpen={showAddressAddModal}
        onClose={() => setShowAddressAddModal(false)}
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        isAddressModalOpen={isAddressModalOpen}
        setIsAddressModalOpen={setIsAddressModalOpen}
        handleInputChange={handleInputChange}
        handleComplete={handleComplete}
        saveNewAddress={saveNewAddress}
      />

      {/* 모바일: 주문 요약 모달 */}
      <Modal
        isOpen={isMobile && showOrderSummaryPopover}
        onClose={() => setShowOrderSummaryPopover(false)}
        title="전체 주문 항목"
        size="sm"
        className={isMobile ? 'block' : 'hidden'}
      >
        <div className="max-h-72 overflow-y-auto mb-4">
          <div className="space-y-2">
            {selectedOptions.map((optionId) => {
              const option = projectOptions.find((opt) => opt.id === optionId)
              if (!option) return null
              const quantity = quantities[optionId]?.quantity || 0
              const price = Number.parseInt(option.price.replace(/,/g, ''), 10)
              const itemTotal = price * quantity
              return (
                <div key={optionId} className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium truncate max-w-[60%]" title={option.title}>{option.title}</span>
                  <span className="flex flex-row items-center flex-shrink-0 min-w-[120px] justify-end text-right">
                    <span className="text-xs text-sub-gray mr-2">{quantity}개</span>
                    <span className="text-sm font-bold">{itemTotal.toLocaleString()}원</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="border-t border-gray-border pt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">합계</span>
            <span className="text-base font-bold text-main-color">{getTotalPrice()}원</span>
          </div>
        </div>
      </Modal>
      <div
        id="order-summary-popover"
        className={isMobile ? 'hidden' : 'md:fixed md:bg-white md:rounded-xl md:border md:border-gray-border md:p-4 md:shadow-lg md:z-40 md:w-80'}
        style={{
          top: `${orderSummaryPopoverPosition.top}px`,
          left: `${orderSummaryPopoverPosition.left}px`,
          display: !isMobile && showOrderSummaryPopover ? undefined : 'none',
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
              const price = Number.parseInt(option.price.replace(/,/g, ''), 10)
              const itemTotal = price * quantity
              return (
                <div key={optionId} className="flex justify-between items-center py-2">
                  <span className="text-base font-medium truncate max-w-[75%]" title={option.title}>{option.title}</span>
                  <span className="flex flex-row items-center flex-shrink-0 min-w-[120px] justify-end text-right">
                    <span className="text-sm text-sub-gray mr-2">{quantity}개</span>
                    <span className="text-base font-bold">{itemTotal.toLocaleString()}원</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-border">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">합계</span>
            <span className="text-lg font-bold text-main-color">{getTotalPrice()}원</span>
          </div>
        </div>
      </div>

      {/* 결제 완료 모달 */}
      <PaymentCompleteModal />
    </>
  )
}

export default DonateDock
