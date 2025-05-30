"use client"

import type React from "react"

import { useState } from "react"
import { useApi } from "@/hooks/useApi"
import Modal from "@/components/common/Modal"
import { PrimaryButton } from "../common/Button"
import { EmailInput, PasswordInput, TextInput } from "../common/Input"
import { EMAIL_MAX_LENGTH, NICKNAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, } from "@/lib/ValidationConstants"
import { emailSchema, nicknameSchema, passwordMatchSchema, newPasswordSchema, signupSchema, passwordSchema } from "@/lib/validationSchemas"
import InputInfo from "../common/InputInfo"

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

  const disabled = !signupSchema.safeParse({ nickname, email, password, passwordConfirm: confirmPassword }).success
  
  // 유효성 검사
  const [signupError, setSignupError] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // api 호출 에러
  const [errorMessage, setErrorMessage] = useState("")

  const validateNickname = (nickname: string) => {
    const result = nicknameSchema.safeParse(nickname)
    if (nickname.length > NICKNAME_MAX_LENGTH) {
      setNickname(nickname.slice(0, NICKNAME_MAX_LENGTH))
    }
    setSignupError({
      ...signupError,
      nickname: result.success ? "" : result.error.issues[0].message
    })
  }

  const validateEmail = (email: string) => {
    const result = emailSchema.safeParse(email)
    if (email.length > EMAIL_MAX_LENGTH) {
      setEmail(email.slice(0, EMAIL_MAX_LENGTH))
    }
    setSignupError({
      ...signupError,
      email: result.success ? "" : result.error.issues[0].message
    })
  }
  
  const validatePassword = (password: string) => {
    const result = newPasswordSchema.safeParse(password)
    if (password.length > PASSWORD_MAX_LENGTH) {
      setPassword(password.slice(0, PASSWORD_MAX_LENGTH))
    }
    setSignupError({
      ...signupError,
      password: result.success ? "" : result.error.issues[0].message
    })
  }
  
  const validateConfirmPassword = (confirmPassword: string) => {
    const result = passwordSchema.safeParse(confirmPassword)
    const matchResult = passwordMatchSchema.safeParse({ password, passwordConfirm: confirmPassword })
    if (confirmPassword.length > PASSWORD_MAX_LENGTH) {
      setConfirmPassword(confirmPassword.slice(0, PASSWORD_MAX_LENGTH))
    }
    setSignupError({
      ...signupError,
      confirmPassword: result.success && matchResult.success ? "" : result.error?.issues[0].message || matchResult.error?.issues[0].message || ""
    })
  }

  // 입력 핸들링
  const handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateNickname(e.target.value)
    if (e.target.value.length <= NICKNAME_MAX_LENGTH) {
      setNickname(e.target.value)
    }
  }

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateEmail(e.target.value)
    if (e.target.value.length <= EMAIL_MAX_LENGTH) {
      setEmail(e.target.value)
    }
  }

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    validatePassword(e.target.value)
    if (e.target.value.length <= PASSWORD_MAX_LENGTH) {
      setPassword(e.target.value)
    }
  }

  const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateConfirmPassword(e.target.value)
    if (e.target.value.length <= PASSWORD_MAX_LENGTH) {
      setConfirmPassword(e.target.value)
    }
  }

  // 회원가입 로직
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    apiCall("/api/user", "POST", { nickname, email, password }).then(({ error }: { data: any, error: string | null }) => {
      if (error) {
        setErrorMessage(error)
      } else {
        onClose()
      }
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" closeOnOutsideClick closeOnEsc title="회원가입">
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-6 flex flex-col gap-1 group">
            <label
              htmlFor="nickname"
              className="text-sm text-gray-500 group-focus-within:text-main-color"
            >
              닉네임
            </label>
            <TextInput
              designType="underline"
              value={nickname}
              onChange={handleChangeNickname}
            />
            <InputInfo errorMessage={signupError.nickname} />
          </div>

          {/* Email Input */}
          <div className="relative mb-6 flex flex-col gap-1 group">
            <label
              htmlFor="email"
              className="text-sm text-gray-500 group-focus-within:text-main-color"
            >
              이메일
            </label>
            <EmailInput
              designType="underline"
              value={email}
              onChange={handleChangeEmail}
            />
            <InputInfo errorMessage={signupError.email} />
          </div>

          {/* Password Input */}
          <div className="relative mb-6 flex flex-col gap-1 group">
            <label
              htmlFor="password"
              className="text-sm text-gray-500 group-focus-within:text-main-color"
            >
              비밀번호
            </label>
            <PasswordInput
              className="w-full"
              designType="underline"
              value={password}
              onChange={handleChangePassword}
            />
            <InputInfo errorMessage={signupError.password} />
          </div>

          {/* Confirm Password Input */}
          <div className="relative mb-10 flex flex-col gap-1 group">
            <label
              htmlFor="confirmPassword"
              className="text-sm text-gray-500 group-focus-within:text-main-color"
            >
              비밀번호 확인
            </label>
            <PasswordInput
              className="w-full"
              designType="underline"
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
            />
            <InputInfo errorMessage={signupError.confirmPassword} />
          </div>

          {/* Signup Button */}
          <PrimaryButton
            type="submit"
            className="relative w-full py-4 mb-1"
            disabled={disabled}
          >
            가입하기
          </PrimaryButton>
          {signupError && (
            <p className="absolute bottom-3 left-0 text-red-500 text-sm pt-1 w-full text-center">{errorMessage}</p>
          )}
        </form>
      </div>
    </Modal>
  )
}