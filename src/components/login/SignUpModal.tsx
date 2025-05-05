"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, CheckSquare, Square } from 'lucide-react'
import clsx from "clsx"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToMarketing, setAgreeToMarketing] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isPasswordMatch, setIsPasswordMatch] = useState(true)
  const [isPasswordValid, setIsPasswordValid] = useState(true)
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);

   // 이메일 유효성 검사
   const checkEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // 비밀번호 유효성 검사
  const checkPassword = () => {
    // 비밀번호 길이 검사 (최소 8자리)
    if (password.length < 8) {
      return false;
    }

    // 영문 대소문자, 숫자, 특수문자 포함 여부 검사
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(hasUppercase && hasLowercase && hasNumber && hasSpecialChar)) {
      return false;
    }

    // 10자리 이상 구성 여부 검사
    if (password.length < 10) {
      return false;
    } 

    return true;
  }

  // 회원가입 로직
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (false) {
      // 회원가입 로직 추후 구현
      console.log("Signup attempt with:", { name, email, password, confirmPassword, agreeToMarketing })
    } else {
      setIsError(true)
      setErrorMessage("이미 존재하는 이메일입니다.")
      // 외 다른 메세지는 백엔드와 협의
    }
  }

  // 이메일 양식 확인
  useEffect(() => {
    setIsEmailValid(checkEmail() || email === "")
  }, [email])

  // 비밀번호 양식 확인
  useEffect(() => {
    setIsPasswordValid(checkPassword() || password === "")
  }, [password])

  // 비밀번호 일치 확인
  useEffect(() => {
    setIsPasswordMatch(confirmPassword === password)
  }, [confirmPassword, password]);

  useEffect(() => {
    setIsError(false)
    setDisabled(email === "" || password === "" || confirmPassword === "" || name === "" || password !== confirmPassword);
  }, [name, email, confirmPassword, password])

  if (!isOpen) return null;

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
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold mb-8">회원가입</h2>

          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className={`text-sm ${focusedField === "name" ? "text-pink-500" : "text-pink-400"}`}
              >
                이름
              </label>
              <input
                id="name"
                type="text"
                className={`w-full p-2 border-b ${
                  focusedField === "name" ? "border-pink-500" : "border-gray-300"
                } focus:outline-none text-lg`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Email Input */}
            <div className="relative mb-6">
              <label
                htmlFor="email"
                className={`text-sm ${focusedField === "email" ? "text-pink-500" : "text-gray-500"}`}
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                className={
                  clsx("w-full p-2 border-b focus:outline-none text-lg",
                    focusedField === "email" ?
                    (isEmailValid ? "border-pink-500" : "border-red-500") : "border-gray-300")
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
            <div className="relative mb-6">
              <label
                htmlFor="password"
                className={`text-sm ${focusedField === "password" ? "text-pink-500" : "text-gray-500"}`}
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                className={
                  clsx("w-full p-2 border-b focus:outline-none text-lg",
                    focusedField === "password" ?
                    (isPasswordValid ? "border-pink-500" : "border-red-500") : "border-gray-300")
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
              {/* 패스워드 확인 문구 */}
              {!isPasswordValid && <p className="absolute bottom-0 translate-y-full text-red-500 text-xs pt-1">최소 8자리 이상, 영문 대소문자, 숫자, 특수문자를 섞어 구성해야 합니다.</p>}
            </div>

            {/* Confirm Password Input */}
            <div className="relative mb-10">
              <label
                htmlFor="confirmPassword"
                className={`text-sm ${focusedField === "confirmPassword" ? "text-pink-500" : "text-gray-500"}`}
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={
                  clsx("w-full p-2 border-b focus:outline-none text-lg",
                    focusedField === "confirmPassword" ?
                    (isPasswordMatch ? "border-pink-500" : "border-red-500") : "border-gray-300")
                }
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
              />
              {/* 패스워드 확인 문구 */}
              {!isPasswordMatch && <p className="absolute bottom-0 translate-y-full text-red-500 text-xs pt-1">비밀번호가 일치하지 않습니다.</p>}
            </div>

            {/* Marketing Consent Checkbox */}
            <div className="mb-8">
              <button
                type="button"
                className="flex items-start gap-2"
                onClick={() => setAgreeToMarketing(!agreeToMarketing)}
              >
                {agreeToMarketing ? (
                  <CheckSquare className="w-6 h-6 text-gray-800 flex-shrink-0" />
                ) : (
                  <Square className="w-6 h-6 text-gray-800 flex-shrink-0" />
                )}
                <span className="text-gray-800">광고성 정보 수신에 동의합니다.</span>
              </button>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className={clsx("relative w-full py-4 rounded-xl font-medium text-lg mb-1", disabled ? "text-gray-400 bg-gray-200 cursor-not-allowed" : "bg-pink-200 text-pink-900")}
            >
              가입하기
            </button>
            {isError && <p className="absolute bottom-3 left-0 text-red-500 text-sm pt-1 w-full text-center">{errorMessage}</p>}
          </form>
        </div>
      </div>
    </>
  )
}

