"use client"

import type React from "react"

import { useState, useEffect } from "react"
import clsx from "clsx"
import { useApi } from "@/hooks/useApi"
import Modal from "@/components/common/Modal"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const { apiCall } = useApi()
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  // const [agreeToMarketing, setAgreeToMarketing] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isPasswordMatch, setIsPasswordMatch] = useState(true)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [disabled, setDisabled] = useState(true)

  // 이메일, 비밀번호 유효성 검사
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)

  // 회원가입 로직
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    apiCall("/api/user", "POST", { nickname, email, password }).then(({ data }: { data: any }) => {
      console.log(data)
      onClose()
    })
  }

  // 비밀번호 일치 확인
  useEffect(() => {
    setIsPasswordMatch(confirmPassword === password)
  }, [confirmPassword, password])

  useEffect(() => {
    setIsError(false)
    setDisabled(
      email === "" || password === "" || confirmPassword === "" || nickname === "" || password !== confirmPassword,
    )
  }, [nickname, email, confirmPassword, password])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" closeOnOutsideClick closeOnEsc title="회원가입">
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-6">
            <label
              htmlFor="nickname"
              className={`text-sm ${focusedField === "nickname" ? "text-main-color" : "text-main-color"}`}
            >
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              className={`w-full p-2 border-b ${
                focusedField === "nickname" ? "border-main-color" : "border-gray-300"
              } focus:outline-none text-lg`}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onFocus={() => setFocusedField("nickname")}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* Email Input */}
          <div className="relative mb-6">
            <label
              htmlFor="email"
              className={`text-sm ${focusedField === "email" ? "text-main-color" : "text-gray-500"}`}
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              className={clsx(
                "w-full p-2 border-b focus:outline-none text-lg",
                focusedField === "email" ? (isEmailValid ? "border-main-color" : "border-red-500") : "border-gray-300",
              )}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
            {/* 이메일 확인 문구 */}
            {email !== "" && !isEmailValid && (
              <p className="absolute bottom-0 translate-y-full text-red-500 text-xs pt-1">이메일 형식이 아닙니다.</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative mb-6">
            <label
              htmlFor="password"
              className={`text-sm ${focusedField === "password" ? "text-main-color" : "text-gray-500"}`}
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className={clsx(
                "w-full p-2 border-b focus:outline-none text-lg",
                focusedField === "password"
                  ? isPasswordValid
                    ? "border-main-color"
                    : "border-red-500"
                  : "border-gray-300",
              )}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
            {/* 패스워드 확인 문구 */}
            {password !== "" && !isPasswordValid && (
              <p className="absolute bottom-0 translate-y-full text-red-500 text-xs pt-1">
                최소 8자리 이상, 영문 대소문자, 숫자, 특수문자를 섞어 구성해야 합니다.
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative mb-10">
            <label
              htmlFor="confirmPassword"
              className={`text-sm ${focusedField === "confirmPassword" ? "text-main-color" : "text-gray-500"}`}
            >
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={clsx(
                "w-full p-2 border-b focus:outline-none text-lg",
                focusedField === "confirmPassword"
                  ? isPasswordMatch
                    ? "border-main-color"
                    : "border-red-500"
                  : "border-gray-300",
              )}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
            />
            {/* 패스워드 확인 문구 */}
            {!isPasswordMatch && (
              <p className="absolute bottom-0 translate-y-full text-red-500 text-xs pt-1">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className={clsx(
              "relative w-full py-4 rounded-xl font-medium text-lg mb-1",
              disabled ? "text-gray-400 bg-gray-200 cursor-not-allowed" : "bg-main-color text-white",
            )}
          >
            가입하기
          </button>
          {isError && (
            <p className="absolute bottom-3 left-0 text-red-500 text-sm pt-1 w-full text-center">{errorMessage}</p>
          )}
        </form>
      </div>
    </Modal>
  )
}
