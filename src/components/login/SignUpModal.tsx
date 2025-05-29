"use client"

import type React from "react"

import { useState, useEffect } from "react"
import clsx from "clsx"
import { useApi } from "@/hooks/useApi"
import Modal from "@/components/common/Modal"
import { PrimaryButton } from "../common/Button"
import { EmailInput, PasswordInput, TextInput } from "../common/Input"
import { EMAIL_MAX_LENGTH, EMAIL_MIN_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/ValidationConstants"

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
            <TextInput
              designType="underline"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={NAME_MAX_LENGTH}
              minLength={NAME_MIN_LENGTH}
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
            <EmailInput
              designType="underline"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={EMAIL_MAX_LENGTH}
              minLength={EMAIL_MIN_LENGTH}
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
            <PasswordInput
              designType="underline"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={PASSWORD_MAX_LENGTH}
              minLength={PASSWORD_MIN_LENGTH}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative mb-10">
            <label
              htmlFor="confirmPassword"
              className={`text-sm ${focusedField === "confirmPassword" ? "text-main-color" : "text-gray-500"}`}
            >
              비밀번호 확인
            </label>
            <PasswordInput
              designType="underline"
              placeholder="비밀번호"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              maxLength={PASSWORD_MAX_LENGTH}
              minLength={PASSWORD_MIN_LENGTH}
              validationRules={[
                {
                  validate: () => confirmPassword === password,
                  errorMessage: "비밀번호가 일치하지 않습니다.",
                },
              ]}
            />
            {/* 패스워드 확인 문구 */}
            {!isPasswordMatch && (
              <p className="absolute bottom-0 translate-y-full text-red-500 text-xs pt-1">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* Signup Button */}
          <PrimaryButton
            type="submit"
            className="relative w-full py-4 mb-1"
            disabled={disabled}
          >
            가입하기
          </PrimaryButton>
          {isError && (
            <p className="absolute bottom-3 left-0 text-red-500 text-sm pt-1 w-full text-center">{errorMessage}</p>
          )}
        </form>
      </div>
    </Modal>
  )
}
