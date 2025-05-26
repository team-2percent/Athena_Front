"use client"

import type React from "react"

import { useEffect, useState } from "react"
import clsx from "clsx"
import { useApi } from "@/hooks/useApi"
import useAuthStore from "@/stores/auth"
import Modal from "@/components/common/Modal"
import { Button, PrimaryButton, SecondaryButton } from "../common/Button"

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

    apiCall("/api/user/login", "POST", { email, password }).then(({ data, error }: { data: any, error: string | null }) => {
      if (error) {
        setErrorMessage("로그인에 실패했습니다.")
        return;
      }
      if (data.accessToken && data.userId) {
        login(data.accessToken, data.userId)
        window.location.reload()
      }
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
          <PrimaryButton
            type="submit"
            disabled={disabled}
            className="w-full py-4 mb-8"
            size="lg"
          >로그인</PrimaryButton>
          <span className="absolute bottom-2 left-0 w-full text-center text-red-500 text-sm">{errorMessage}</span>
        </form>

        {/* Divider */}
        <div className="flex items-center mb-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-4 text-gray-400">계정이 없다면?</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Sign Up Button */}
        <SecondaryButton
          type="submit"
          onClick={moveToSignupModal}
          className="w-full py-4"
          size="lg"
        >회원가입</SecondaryButton>
      </div>
    </Modal>
  )
}
