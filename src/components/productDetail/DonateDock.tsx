"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown, Check } from "lucide-react"

const DonateDock = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState("option2")
  const [selectedPay, setSelectedPay] = useState("None")
  const [selectedColor, setSelectedColor] = useState("녹색 (브로콜리 맛)")
  const [selectedSpiciness, setSelectedSpiciness] = useState("조금 매운 맛")
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false)
  const [isSpicinessDropdownOpen, setIsSpicinessDropdownOpen] = useState(false)

  // 색상 및 매운맛 옵션
  // 추후 API에 따라 동적으로 변경될 수 있음
  const colorOptions = ["녹색 (브로콜리 맛)", "빨간색 (고추장 맛)", "노란색 (치즈 맛)"]
  const spicinessOptions = ["순한 맛", "조금 매운 맛", "매운 맛"]

  useEffect(() => {
    // 후원하기 버튼 클릭 이벤트 리스너 등록
    const handleToggleDock = () => {
      setIsOpen(true)
    }

    window.addEventListener("toggleDonateDock", handleToggleDock)

    // 드롭다운 외부 클릭 시 닫기
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".color-dropdown") && isColorDropdownOpen) {
        setIsColorDropdownOpen(false)
      }
      if (!target.closest(".spiciness-dropdown") && isSpicinessDropdownOpen) {
        setIsSpicinessDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("toggleDonateDock", handleToggleDock)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isColorDropdownOpen, isSpicinessDropdownOpen])

  const toggleDock = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
  }

  const handlePaySelect = (pay: string) => {
    setSelectedPay(pay)
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    setIsColorDropdownOpen(false)
  }

  const handleSpicinessSelect = (spiciness: string) => {
    setSelectedSpiciness(spiciness)
    setIsSpicinessDropdownOpen(false)
  }

  // 가격 옵션
  // 추후 API에 따라 동적으로 변경될 수 있음
  const getPrice = () => {
    switch (selectedOption) {
      case "option1":
        return "1,000"
      case "option2":
        return "5,000"
      case "option3":
        return "100,000"
      default:
        return "5,000"
    }
  }

  return (
    <>
      {/* 후원하기 버튼 하단에 고정 */}
      <div className="fixed bottom-0 left-0 z-40 w-full">
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

      {/* 후원하기 Dock 내부 로직 */}
      <div
        className={`fixed bottom-0 left-0 z-50 w-full transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-t-3xl border border-gray-200 bg-white p-6 pb-0 shadow-lg">
            {/* Dock 헤더 */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">후원하기</h2>
              <button onClick={toggleDock} className="rounded-full p-1 hover:bg-gray-100" aria-label="닫기">
                <ChevronDown className="h-6 w-6" />
              </button>
            </div>

            {/* Dock 내용 */}
            <div className="space-y-6">
              {/* 상품 선택 */}
              <div>
                <h3 className="mb-4 text-lg font-medium">상품 선택</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                  {/* 추후 API에 따른 반복문으로 확장 가능한 형태로 구현 */}
                  {/* 옵션 1 */}
                  <div
                    className={`relative flex h-48 cursor-pointer flex-col rounded-xl border p-4 transition-all ${
                      selectedOption === "option1"
                        ? "border-2 border-pink-400" // 선택된 옵션
                        : "border-gray-200 hover:border-pink-200" // 선택되지 않을 시 표시. 호버링 시의 색상도 정의.
                    }`}
                    onClick={() => handleOptionSelect("option1")}
                  >
                    {/* 옵션 카드 상단 오른쪽에 위치한 배지 */}
                    <div className="absolute -right-2 -top-3"> {/* 배지 위치는 카드 위치에 의존 */}
                      <div className="rounded-full border-2 border-pink-400 bg-white px-3 py-1 text-sm text-pink-500 shadow-sm">
                        <span>2억 개 남음</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1 text-lg font-bold">마음만 받을게요</h4>  {/* 옵션 카드 제목 */}
                      <p className="text-sm text-gray-500">진짜 아무것도 필요없을 진짜임 ㅇㅇ</p>  {/* 옵션 카드 세부 내용 */}
                    </div>
                    <div className="text-right text-xl font-medium">1,000원</div>  {/* 옵션 카드 가격 */}
                  </div>

                  {/* 옵션 2 */}
                  <div
                    className={`relative flex h-48 cursor-pointer flex-col rounded-xl border p-4 transition-all ${
                      selectedOption === "option2"
                        ? "border-2 border-pink-400"
                        : "border-gray-200 hover:border-pink-200"
                    }`}
                    onClick={() => handleOptionSelect("option2")}
                  >
                    <div className="absolute -right-2 -top-3">
                      <div className="rounded-full border-2 border-pink-400 bg-white px-3 py-1 text-sm text-pink-500 shadow-sm">
                        <span>2억 개 남음</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1 text-lg font-bold text-pink-500">피자 아닌 떡볶이</h4>
                      <div className="space-y-0.5 text-sm text-pink-400">
                        <p>떡볶이 하나 (색상 선택 가능)</p>
                        <p>맵기 정도 (순한, 조금매운, 매운 선택 가능)</p>
                      </div>
                    </div>
                    <div className="text-right text-xl font-medium text-pink-500">5,000원</div>
                  </div>

                  {/* 옵션 3 */}
                  <div
                    className={`relative flex h-48 cursor-pointer flex-col rounded-xl border p-4 transition-all ${
                      selectedOption === "option3"
                        ? "border-2 border-pink-400"
                        : "border-gray-200 hover:border-pink-200"
                    }`}
                    onClick={() => handleOptionSelect("option3")}
                  >
                    <div className="absolute -right-2 -top-3">
                      <div className="rounded-full border-2 border-pink-400 bg-white px-3 py-1 text-sm text-pink-500 shadow-sm">
                        <span>2억 개 남음</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1 text-lg font-bold">비밀스런 피자</h4>
                      <p className="text-sm text-gray-500">강 잡숴보셈 ㄹㅇ</p>
                    </div>
                    <div className="text-right text-xl font-medium">100,000원</div>
                  </div>
                </div>
              </div>

              {/* 추가 옵션 */}
              {/* 추후 API에 따른 반복문으로 확장 가능한 형태로 구현 */}
              <div>
                <h3 className="mb-4 text-lg font-medium">추가 옵션</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* 색상 선택 - 커스텀 드롭다운 */}
                  <div>
                    <label className="mb-2 block text-sm text-gray-600">색상 선택</label>
                    <div className="relative color-dropdown">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl bg-gray-100 px-4 py-3 text-left text-gray-700 focus:outline-none"
                        onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                      >
                        <span>{selectedColor}</span>
                        <ChevronDown className="h-5 w-5" />
                      </button>
                      {isColorDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                          {colorOptions.map((color) => (
                            <div
                              key={color}
                              className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-100"
                              onClick={() => handleColorSelect(color)}
                            >
                              <span>{color}</span>
                              {selectedColor === color && <Check className="h-5 w-5 text-pink-500" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 맵기 정도 - 커스텀 드롭다운 */}
                  <div>
                    <label className="mb-2 block text-sm text-gray-600">맵기 정도</label>
                    <div className="relative spiciness-dropdown">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl bg-gray-100 px-4 py-3 text-left text-gray-700 focus:outline-none"
                        onClick={() => setIsSpicinessDropdownOpen(!isSpicinessDropdownOpen)}
                      >
                        <span>{selectedSpiciness}</span>
                        <ChevronDown className="h-5 w-5" />
                      </button>
                      {isSpicinessDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                          {spicinessOptions.map((spiciness) => (
                            <div
                              key={spiciness}
                              className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-100"
                              onClick={() => handleSpicinessSelect(spiciness)}
                            >
                              <span>{spiciness}</span>
                              {selectedSpiciness === spiciness && <Check className="h-5 w-5 text-pink-500" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 결제 수단 */}
              <div>
                <h3 className="mb-4 text-lg font-medium">결제 수단</h3>
                <button
                  className={`flex w-1/4 items-center justify-center rounded-full border bg-white px-4 py-3 text-black ${
                    selectedPay === "kakaopay"
                      ? "border-pink-400"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                  onClick={() => handlePaySelect("kakaopay")}
                >
                  <span className="font-medium">카카오페이</span>
                </button>
              </div>

              {/* 하단 결제 정보 및 버튼 */}
              <div className="mt-8 bg-white pb-8">
                {/* 총 가격 표시 - 오른쪽 정렬 */}
                <div className="mb-4 text-right">
                  <div className="text-3xl font-bold">{getPrice()}원</div>
                </div>

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
                    onClick={toggleDock}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DonateDock
