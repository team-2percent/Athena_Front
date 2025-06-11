"use client"

import type React from "react"

import { useState } from "react"
import { useApi } from "@/hooks/useApi"
import Modal from "@/components/common/Modal"
import { PrimaryButton } from "../common/Button"
import { EmailInput, PasswordInput, TextInput } from "../common/Input"
import { EMAIL_MAX_LENGTH, NICKNAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, } from "@/lib/validationConstant"
import { emailSchema, nicknameSchema, passwordMatchSchema, newPasswordSchema, signupSchema, passwordSchema } from "@/lib/validationSchemas"
import InputInfo from "../common/InputInfo"
import { validate, getValidatedString } from "@/lib/validationUtil"

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

  const disabled = validate({
    nickname,
    email,
    password,
    passwordConfirm: confirmPassword,
    passwordMatch: { password, passwordConfirm: confirmPassword }
  }, signupSchema).error
  
  // 유효성 검사
  const [signupError, setSignupError] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // api 호출 에러
  const [errorMessage, setErrorMessage] = useState("")

  // 입력 핸들링
  const handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = validate(e.target.value, nicknameSchema)
    if (result.error) {
      setSignupError({ ...signupError, nickname: result.message })
    } else {
      setSignupError({ ...signupError, nickname: "" })
    }
    setNickname(getValidatedString(e.target.value, NICKNAME_MAX_LENGTH))
  }

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = validate(e.target.value, emailSchema)
    if (result.error) {
      setSignupError({ ...signupError, email: result.message })
    } else {
      setSignupError({ ...signupError, email: "" })
    }
    setEmail(getValidatedString(e.target.value, EMAIL_MAX_LENGTH))
  }

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = validate(e.target.value, newPasswordSchema)
    if (result.error) {
      setSignupError({ ...signupError, password: result.message })
    } else {
      setSignupError({ ...signupError, password: "" })
    }
    setPassword(getValidatedString(e.target.value, PASSWORD_MAX_LENGTH))
  }

  const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const matchResult = validate({ password, passwordConfirm: e.target.value }, passwordMatchSchema)
    if (matchResult.error) {
      setSignupError({ ...signupError, confirmPassword: matchResult.message })
    } else {
      setSignupError({ ...signupError, confirmPassword: "" })
    }
    setConfirmPassword(getValidatedString(e.target.value, PASSWORD_MAX_LENGTH))
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
    <Modal isOpen={isOpen} onClose={onClose} size="md" closeOnOutsideClick closeOnEsc title="회원가입" dataCy="signup-modal">
      <div className="px-4 pt-4">
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-2 flex flex-col gap-1 group">
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
              isError={!!signupError.nickname}
              dataCy="nickname-input"
            />
            <InputInfo errorMessage={signupError.nickname} errorMessageDataCy="nickname-error-message" />
          </div>

          {/* Email Input */}
          <div className="relative mb-2 flex flex-col gap-1 group">
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
              isError={!!signupError.email}
              dataCy="email-input"
            />
            <InputInfo errorMessage={signupError.email} errorMessageDataCy="email-error-message" />
          </div>

          {/* Password Input */}
          <div className="relative mb-2 flex flex-col gap-1 group">
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
              isError={!!signupError.password}
              dataCy="password-input"
            />
            <InputInfo errorMessage={signupError.password} errorMessageDataCy="password-error-message" />
          </div>

          {/* Confirm Password Input */}
          <div className="relative mb-6 flex flex-col gap-1 group">
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
              isError={!!signupError.confirmPassword}
              dataCy="confirm-password-input"
            />
            <InputInfo errorMessage={signupError.confirmPassword} errorMessageDataCy="confirm-password-error-message" />
          </div>

          {/* Signup Button */}
          <PrimaryButton
            type="submit"
            className="relative w-full py-4"
            disabled={disabled}
            dataCy="signup-button"
          >
            가입하기
          </PrimaryButton>
          <div className="h-[1.25rem] text-center">
            <span className="w-full text-red-500 text-xs" data-cy="signup-error-message">{errorMessage}</span>
          </div>
        </form>
      </div>
    </Modal>
  )
}