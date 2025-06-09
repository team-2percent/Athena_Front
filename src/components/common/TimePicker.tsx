"use client"

import { useState, useRef, useEffect } from "react"
import { Clock } from "lucide-react"
import clsx from "clsx"

interface TimePickerProps {
  selectedDateTime: Date
  onChange: (hour: number) => void
  minDateTime?: Date
}

export default function TimePicker({ selectedDateTime, onChange, minDateTime }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const timePickerRef = useRef<HTMLDivElement>(null)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))

  const handleTimeSelect = (hour: string) => {
    const koreaHour = Number.parseInt(hour)
    onChange(koreaHour)
  }

  const isBeforeMinTime = (hour: string) => {
    if (!minDateTime) return false

    // 한국 시간 기준으로 비교
    const koreaSelectedDate = new Date(selectedDateTime.getTime() + 9 * 60 * 60 * 1000)
    const koreaMinDate = new Date(minDateTime.getTime() + 9 * 60 * 60 * 1000)

    return koreaSelectedDate.getUTCDate() === koreaMinDate.getUTCDate() && +hour <= koreaMinDate.getUTCHours()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={timePickerRef}>
      <div
        className="flex rounded-full border border-gray-300 px-4 py-3 pl-10 focus:border-main-color focus:outline-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Clock className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <span>
          {new Date(selectedDateTime.getTime() + 9 * 60 * 60 * 1000).getUTCHours().toString().padStart(2, "0")}:00
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border rounded-lg shadow-lg w-32 p-4">
          <div className="flex flex-col items-center max-h-[200px] overflow-y-auto overflow-x-hidden scrollbar-hide">
            {hours.map((hour) => (
              <button
                key={hour}
                disabled={isBeforeMinTime(hour)}
                className={clsx(
                  "w-fit p-2 text-sm rounded-md transition-all duration-200",
                  "hover:bg-gray-100 focus:outline-none",
                  new Date(selectedDateTime.getTime() + 9 * 60 * 60 * 1000).getUTCHours() === +hour
                    ? "bg-main-color text-white scale-110"
                    : "",
                  isBeforeMinTime(hour) ? "text-gray-300" : "",
                )}
                onClick={() => handleTimeSelect(hour)}
              >
                {hour}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
