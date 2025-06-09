"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi"
import useAuthStore from "@/stores/auth"
import Modal from "@/components/common/Modal"
import { PrimaryButton, SecondaryButton } from "../common/Button"
import { EmailInput, PasswordInput } from "../common/Input"
import { emailSchema, loginSchema, passwordSchema } from "@/lib/validationSchemas"
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from "@/lib/validationConstant"
import InputInfo from "../common/InputInfo"
import { getFCMToken } from '@/lib/firebase'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  moveToSignupModal: () => void
}

export default function LoginModal({ isOpen, onClose, moveToSignupModal }: LoginModalProps) {
  const { apiCall } = useApi()
  const { login, setFcmToken } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("")
  const [loginError, setLoginError] = useState({
    email: "",
    password: ""
  })

  const disabled: boolean = !loginSchema.safeParse({ email, password }).success

  const validateEmail = (email: string) => {
    const result = emailSchema.safeParse(email)
    setLoginError({ 
      ...loginError,
      email: result.success ? "" : result.error.issues[0].message
    })
  }

  const validatePassword = (password: string) => {
    const result = passwordSchema.safeParse(password) 
    setLoginError({
      ...loginError,
      password: result.success ? "" : result.error.issues[0].message
    })
  }

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= EMAIL_MAX_LENGTH) {
      setEmail(e.target.value)
    }

    validateEmail(e.target.value)
  }

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= PASSWORD_MAX_LENGTH) {
      setPassword(e.target.value)
    }

    validatePassword(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await apiCall<any>("/api/user/login", "POST", { email, password })
    if (error) {
      setErrorMessage("로그인에 실패했습니다.")
      return;
    }
    if (data.accessToken && data.userId) {
      try { // Firebase 연결 try-catch 처리
        login(data.accessToken, data.userId);
      
        // FCM 토큰 발급 및 등록
        const token = await getFCMToken();
        if (token) {
          setFcmToken(token);
          await apiCall('/api/fcm/register', 'POST', {
            userId: data.userId,
            token: token,
          });
        }
        
        onClose();
      } catch (error) {
        console.error('로그인 후 FCM 등록 중 오류 발생:', error);
        // 필요하다면 사용자에게 알리거나 fallback 처리
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" closeOnOutsideClick closeOnEsc title="로그인" dataCy="login-modal">
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="relative mb-4">
            <EmailInput
              className="w-full"
              placeholder="이메일 입력"
              value={email}
              onChange={handleChangeEmail}
              isError={loginError.email !== ""}
              dataCy="email-input"
            />
            <InputInfo errorMessage={loginError.email} errorMessageDataCy="email-error-message" />
          </div>

          {/* Password Input */}
          <div className="relative mb-8">
            <PasswordInput
              className="w-full"
              placeholder="비밀번호 입력"
              value={password}
              onChange={handleChangePassword}
              isError={loginError.password !== ""}
              dataCy="password-input"
            />
            <InputInfo errorMessage={loginError.password} errorMessageDataCy="password-error-message" />
          </div>

          {/* Login Button */}
          <PrimaryButton
            type="submit"
            disabled={disabled}
            className="w-full py-4"
            size="lg"
            dataCy="login-button"
          >로그인</PrimaryButton>
          <div className="h-[1.25rem] text-center mb-2">
            <span className="w-full text-red-500 text-xs">{errorMessage}</span>
          </div>
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
