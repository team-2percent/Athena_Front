"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import clsx from "clsx"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [disabled, setDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isEmailValid, setIsEmailValid] = useState(true)
  if (!isOpen) return null

  const checkEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 로그인 로직 추후 구현
    if (false) {
      console.log("Login attempt with:", { email, password })
    } else {
      setErrorMessage("이메일과 비밀번호를 확인해주세요.")
    }
    
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
    <>
      {/* Black overlay */}
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div
          className="bg-white rounded-3xl w-full max-w-md p-8 shadow-lg pointer-events-auto relative"
          style={{
            boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.08)",
            maxWidth: "450px",
          }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">로그인</h2>
            {/* Close button */}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form className="relative" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative mb-4">
              <input
                type="email"
                placeholder="이메일 입력"
                className={
                  clsx("w-full p-3 border-b focus:outline-none text-lg",
                    focusedField === "email" ?
                    (isEmailValid ? "border-main-color" : "border-red-500") : "border-gray-300")
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
              {/* 이메일 확인 문구 */}
              {!isEmailValid && <p className="absolute bottom-0 translate-y-full text-red-500 text-xs pt-1">이메일 형식이 아닙니다.</p>}
            </div>

            {/* Password Input */}
            <div className="relative mb-8">
              <input
                type="password"
                placeholder="비밀번호 입력"
                className={
                  clsx("w-full p-3 border-b focus:outline-none text-lg",
                    focusedField === "password" ? "border-main-color" : "border-gray-300")
                }
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
              className={clsx("w-full py-4 rounded-xl font-medium text-lg mb-8", disabled ? "text-gray-400 bg-gray-200 cursor-not-allowed" : "bg-main-color text-white")}
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
          <button type="button" className="w-full py-4 bg-gray-200 text-gray-800 rounded-xl font-medium text-lg">
            회원가입
          </button>
        </div>
      </div>
    </>
  )
}
