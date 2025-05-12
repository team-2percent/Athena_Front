"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerProps {
  selectedDate: Date
  onChange: (date: Date) => void
  position?: "top" | "bottom"
  minDate?: Date // 최소 선택 가능 날짜 추가
}

export default function DatePicker({ selectedDate, onChange, position = "top", minDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const datePickerRef = useRef<HTMLDivElement>(null)

  // 날짜를 YYYY년 MM월 DD일 형식으로 포맷팅
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}. ${month}. ${day}.`
  }

  // 월 이름 포맷팅 (예: 2025년 5월)
  const formatMonthYear = (date: Date): string => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return `${year}년 ${month}월`
  }

  // 이전 달로 이동
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // 다음 달로 이동
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // 날짜가 최소 날짜보다 이전인지 확인
  const isBeforeMinDate = (date: Date): boolean => {
    if (!minDate) return false
    return date < new Date(minDate.setHours(0, 0, 0, 0))
  }

  // 달력에 표시할 날짜 배열 생성
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // 현재 달의 첫 날과 마지막 날
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // 첫 날의 요일 (0: 일요일, 1: 월요일, ...)
    const firstDayOfWeek = firstDay.getDay()

    // 이전 달의 마지막 날
    const prevMonthLastDay = new Date(year, month, 0).getDate()

    const days = []

    // 이전 달의 날짜 추가
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      })
    }

    // 현재 달의 날짜 추가
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    // 다음 달의 날짜 추가 (6주 채우기)
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      })
    }

    return days
  }

  // 날짜 선택 처리
  const handleDateSelect = (date: Date) => {
    // 최소 날짜보다 이전인 경우 선택 불가
    if (isBeforeMinDate(date)) return

    onChange(date)
    setIsOpen(false)
  }

  // 날짜가 오늘인지 확인
  const isToday = (date: Date): boolean => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // 날짜가 선택된 날짜인지 확인
  const isSelected = (date: Date): boolean => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  // 외부 클릭 시 달력 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // 달력 열릴 때 현재 선택된 날짜의 월로 설정
  useEffect(() => {
    if (isOpen) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
    }
  }, [isOpen, selectedDate])

  // 최소 날짜가 변경되었을 때 선택된 날짜가 최소 날짜보다 이전이면 최소 날짜로 설정
  useEffect(() => {
    if (minDate && selectedDate < minDate) {
      onChange(new Date(minDate))
    }
  }, [minDate, selectedDate, onChange])

  return (
    <div className="relative" ref={datePickerRef}>
      <div className="relative">
        <input
          type="text"
          value={formatDate(selectedDate)}
          readOnly
          className="w-44 rounded-full border border-gray-300 px-4 py-3 pr-10 focus:border-main-color focus:outline-none cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        <Calendar className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      {isOpen && (
        <div
          className={`absolute ${
            position === "top" ? "bottom-full mb-2" : "top-full mt-2"
          } left-0 z-50 rounded-lg border border-gray-200 bg-white shadow-lg`}
          style={{ width: "320px" }}
        >
          <div className="p-4">
            {/* 달력 헤더 */}
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={prevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-lg font-medium">{formatMonthYear(currentMonth)}</div>
              <button
                type="button"
                onClick={nextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* 요일 헤더 - 한국어로 변경 */}
            <div className="mb-2 grid grid-cols-7 text-center">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div key={day} className="text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((day, index) => {
                const isDisabled = isBeforeMinDate(day.date)
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(day.date)}
                    disabled={isDisabled}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                      !day.isCurrentMonth
                        ? "text-gray-400"
                        : isSelected(day.date)
                          ? "bg-main-color text-white"
                          : isToday(day.date)
                            ? "border border-main-color text-main-color"
                            : isDisabled
                              ? "text-gray-300 cursor-not-allowed"
                              : "hover:bg-gray-100"
                    }`}
                  >
                    {day.date.getDate()}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
