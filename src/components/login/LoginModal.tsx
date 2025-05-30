"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi"
import useAuthStore from "@/stores/auth"
import Modal from "@/components/common/Modal"
import { PrimaryButton, SecondaryButton } from "../common/Button"
import { EmailInput, PasswordInput } from "../common/Input"
import { loginSchema } from "@/lib/validationSchemas"
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from "@/lib/ValidationConstants"
import InputInfo from "../common/InputInfo"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  moveToSignupModal: () => void
}

export default function LoginModal({ isOpen, onClose, moveToSignupModal }: LoginModalProps) {
  const { apiCall } = useApi()
  const { login } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("")
  const [loginError, setLoginError] = useState({
    email: "",
    password: ""
  })

  const disabled: boolean = loginError.email !== "" || loginError.password !== ""

  const validateEmail = (email: string) => {
    const result = loginSchema.shape.email.safeParse(email)
    setLoginError({ 
      ...loginError,
      email: result.success ? "" : result.error.issues[0].message
    })
  }

  const validatePassword = (password: string) => {
    const result = loginSchema.shape.password.safeParse(password) 
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" closeOnOutsideClick closeOnEsc title="로그인">
      <div className="p-4">
        <form className="relative" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="relative mb-4">
            <EmailInput
              className="w-full"
              placeholder="이메일 입력"
              value={email}
              onChange={handleChangeEmail}
              isError={loginError.email !== ""}
            />
            <InputInfo errorMessage={loginError.email} />
          </div>

          {/* Password Input */}
          <div className="relative mb-8">
            <PasswordInput
              className="w-full"
              placeholder="비밀번호 입력"
              value={password}
              onChange={handleChangePassword}
              isError={loginError.password !== ""}
            />
            <InputInfo errorMessage={loginError.password} />
          </div>

          {/* Login Button */}
          <PrimaryButton
            type="submit"
            disabled={disabled}
            className="w-full py-4 mb-8"
            size="lg"
          >로그인</PrimaryButton>
          <span className="absolute -bottom-2 left-0 w-full text-center text-red-500 text-sm">{errorMessage}</span>
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
