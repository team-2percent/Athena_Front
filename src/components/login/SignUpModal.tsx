"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, CheckSquare, Square } from 'lucide-react'
import clsx from "clsx"
import { useApi } from "@/hooks/useApi" 

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
    if (password.length < 8) {
      return false;
    } 

    return true;
  }

  // 회원가입 로직
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    apiCall("/api/user", "POST", { nickname, email, password }).then(({ data }: { data: any }) => {
      console.log(data)
      onClose()
    })
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
    setDisabled(email === "" || password === "" || confirmPassword === "" || nickname === "" || password !== confirmPassword);
  }, [nickname, email, confirmPassword, password])

  if (!isOpen) return null;

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
            <h2 className="text-2xl font-bold">회원가입</h2>
            {/* Close button */}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

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
                className={
                  clsx("w-full p-2 border-b focus:outline-none text-lg",
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
                className={
                  clsx("w-full p-2 border-b focus:outline-none text-lg",
                    focusedField === "password" ?
                    (isPasswordValid ? "border-main-color" : "border-red-500") : "border-gray-300")
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
                className={`text-sm ${focusedField === "confirmPassword" ? "text-main-color" : "text-gray-500"}`}
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={
                  clsx("w-full p-2 border-b focus:outline-none text-lg",
                    focusedField === "confirmPassword" ?
                    (isPasswordMatch ? "border-main-color" : "border-red-500") : "border-gray-300")
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
            {/* <div className="mb-8">
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
            </div> */}

            {/* Signup Button */}
            <button
              type="submit"
              className={clsx("relative w-full py-4 rounded-xl font-medium text-lg mb-1", disabled ? "text-gray-400 bg-gray-200 cursor-not-allowed" : "bg-main-color text-white")}
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

