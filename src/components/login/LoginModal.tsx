"use client"

import type React from "react"

import { useEffect, useState } from "react"
import clsx from "clsx"
import { useApi } from "@/hooks/useApi"
import useAuthStore from "@/stores/auth"
import Modal from "@/components/common/Modal"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  moveToSignupModal: () => void
}

export default function LoginModal({ isOpen, onClose, moveToSignupModal }: LoginModalProps) {
  const { apiCall } = useApi()
  const { login } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [disabled, setDisabled] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isEmailValid, setIsEmailValid] = useState(true)

  const checkEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    apiCall("/api/user/login", "POST", { email, password }).then(({ data }: { data: any }) => {
      if (data.accessToken && data.userId) {
        login(data.accessToken, data.userId)
      }
      onClose()
    })
  }

  useEffect(() => {
    setIsEmailValid(checkEmail() || email === "")
  }, [email])

  useEffect(() => {
    if (email && password) {
      setErrorMessage("")
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [email, password])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" closeOnOutsideClick closeOnEsc title="로그인">
      <div className="p-4">
        <form className="relative" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="relative mb-4">
            <input
              type="email"
              placeholder="이메일 입력"
              className={clsx(
                "w-full p-3 border-b focus:outline-none text-lg",
                focusedField === "email" ? (isEmailValid ? "border-main-color" : "border-red-500") : "border-gray-300",
              )}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
            {/* 이메일 확인 문구 */}
            {!isEmailValid && (
              <p className="absolute bottom-0 translate-y-full text-red-500 text-xs pt-1">이메일 형식이 아닙니다.</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative mb-8">
            <input
              type="password"
              placeholder="비밀번호 입력"
              className={clsx(
                "w-full p-3 border-b focus:outline-none text-lg",
                focusedField === "password" ? "border-main-color" : "border-gray-300",
              )}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={disabled}
            className={clsx(
              "w-full py-4 rounded-xl font-medium text-lg mb-8",
              disabled ? "text-gray-400 bg-gray-200 cursor-not-allowed" : "bg-main-color text-white",
            )}
          >
            로그인
          </button>
          <span className="absolute bottom-2 left-0 w-full text-center text-red-500 text-sm">{errorMessage}</span>
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
          className="w-full py-4 bg-[#FEE500] text-[rgba(0, 0, 0, 0.85)] rounded-xl font-medium text-lg mb-4 flex items-center justify-center"
        >
          <img src="/kakao.svg" width={24} height={24} alt="카카오 로그인" className="mr-2" />
          카카오 로그인
        </button>

        {/* Sign Up Button */}
        <button
          type="button"
          onClick={moveToSignupModal}
          className="w-full py-4 bg-gray-200 text-gray-800 rounded-xl font-medium text-lg"
        >
          회원가입
        </button>
      </div>
    </Modal>
  )
}
