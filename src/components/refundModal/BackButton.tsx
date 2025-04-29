"use client"

import { ChevronLeft } from "lucide-react"

interface BackButtonProps {
  onClick?: () => void
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <button type="button" className="flex items-center text-pink-400 font-medium text-lg mb-4" onClick={onClick}>
      <ChevronLeft className="h-5 w-5" />
      뒤로 가기
    </button>
  )
}
