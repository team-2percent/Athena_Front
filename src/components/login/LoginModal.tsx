"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 로그인 로직 추후 구현
    console.log("Login attempt with:", { userId, password })
  }

  return (
    <>
      {/* Black overlay */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div
          className="bg-white rounded-3xl w-full max-w-md p-8 shadow-lg pointer-events-auto relative"
          style={{
            boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.08)",
            maxWidth: "450px",
          }}
        >
          {/* Close button */}
          <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold mb-8">로그인</h2>

          <form onSubmit={handleSubmit}>
            {/* ID Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="아이디 입력"
                className="w-full p-3 border-b border-gray-300 focus:border-gray-500 outline-none text-lg"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="mb-8">
              <input
                type="password"
                placeholder="비밀번호 입력"
                className="w-full p-3 border-b border-gray-300 focus:border-gray-500 outline-none text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Login Button */}
            <button type="submit" className="w-full py-4 bg-pink-200 text-pink-900 rounded-xl font-medium text-lg mb-8">
              로그인
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center mb-8">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-4 text-gray-400">아니면</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Kakao Login Button */}
          <button
            type="button"
            className="w-full py-4 bg-yellow-400 text-black rounded-xl font-medium text-lg mb-4 flex items-center justify-center"
          >
            <MessageCircle className="mr-2" size={20} />
            카카오 로그인
          </button>

          {/* Sign Up Button */}
          <button type="button" className="w-full py-4 bg-gray-200 text-gray-800 rounded-xl font-medium text-lg">
            회원가입
          </button>
        </div>
      </div>
    </>
  )
}
