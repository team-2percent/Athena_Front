"use client"

import { useApi } from "@/hooks/useApi";
import { PasswordInput } from "../common/Input";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { PrimaryButton, CancelButton } from "../common/Button";
import { newPasswordSchema, passwordEditSchema, passwordMatchSchema, passwordSchema } from "@/lib/validationSchemas";
import InputInfo from "../common/InputInfo";
import { PASSWORD_MAX_LENGTH } from "@/lib/ValidationConstants";

interface PasswordInfoProps {
  onBack: () => void;
}

export default function PasswordInfo({ onBack }: PasswordInfoProps) {
    const { isLoading, apiCall } = useApi();
    // 비밀번호 관련 상태
    const [password, setPassword] = useState("")
    const [passwordConfirmed, setPasswordConfirmed] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
    const [successEditPassword, setSuccessEditPassword] = useState(false);
    const [passwordEditError, setPasswordEditError] = useState({
        password: "",
        newPassword: "",
        passwordConfirm: "",
    })

    const disabled = passwordEditSchema.safeParse({
        passwordConfirmed: passwordConfirmed,
        newPassword: newPassword,
        newPasswordConfirm: newPasswordConfirm,
    })

    const initPasswords = () => {
        setPassword("")
        setNewPassword("")
        setNewPasswordConfirm("")
        setPasswordConfirmed(false)
    }
    
    const validatePassword = () => {
        const result = passwordSchema.safeParse(password)
        if (password.length > PASSWORD_MAX_LENGTH) {
            setPassword(password.slice(0, PASSWORD_MAX_LENGTH))
        }
        setPasswordEditError({
            ...passwordEditError,
            password: result.success ? "" : result.error.issues[0].message,
        })
    }

    const validateNewPassword = () => {
        const result = newPasswordSchema.safeParse(newPassword)
        setPasswordEditError({
            ...passwordEditError,
            newPassword: result.success ? "" : result.error.issues[0].message,
        })
    }

    const validateConfirmPassword = () => {
        const result = passwordSchema.safeParse(newPasswordConfirm)
        const matchResult = passwordMatchSchema.safeParse({password: newPassword, passwordConfirm: newPasswordConfirm})
        setPasswordEditError({
            ...passwordEditError,
            passwordConfirm: result.success && matchResult.success ? "" : result.error?.issues[0].message || matchResult.error?.issues[0].message || "",
        })
    }

    // 비밀번호 입력 핸들러
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        validatePassword()
    }

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value)
        validateNewPassword()
    }

    const handleNewPasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPasswordConfirm(e.target.value)
        validateConfirmPassword()
    }

    // 비밀번호 확인 핸들러
    const handlePasswordConfirm = () => {
        // 백엔드 요청 추가
        apiCall("/api/my/checkPassword", "POST", {
            password: password
        }).then(({ data, error }) => {
            if (error || !data) {
                setPasswordConfirmError("비밀번호가 일치하지 않습니다.")
            } else if (error) {
                console.log(error)
            } else setPasswordConfirmed(true)
        })
    }

    // 새 비밀번호 적용 핸들러
    const handleNewPasswordApply = () => {
        // 백엔드 요청 추가
        apiCall("/api/my/updatePassword", "POST", {
            oldPassword: password,
            newPassword: newPassword
        }).then(({ error }) => {
            if (!error) {
                initPasswords();
                setSuccessEditPassword(true)
            }
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <div
                className="flex flex-col gap-6 bg-white rounded-lg shadow p-6"
            >
                <h3 className="text-lg font-medium">비밀번호 변경</h3>
                {/* 비밀번호 확인란 */}
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-sub-gray">비밀번호 확인</p>
                        <div className="flex gap-2 items-center">
                            <PasswordInput
                                value={password}
                                onChange={handlePasswordChange}
                                designType="outline-rect"
                            />
                            <div className="flex items-center">
                            {
                                passwordConfirmed ?
                                <Check className="w-4 h-4 text-green-500" />
                                :
                                <div className="flex gap-2 items-center">
                                    <PrimaryButton
                                        type="submit"
                                        onClick={handlePasswordConfirm}
                                        className="px-3 py-2"
                                    >확인</PrimaryButton>
                                    <span className="text-red-500 text-sm">{passwordConfirmError}</span>
                                </div>
                            }
                            </div>
                            <InputInfo errorMessage={passwordEditError.password} />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-sub-gray">새 비밀번호 입력</p>
                        <div className="flex gap-2 items-center">
                            <PasswordInput
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                designType="outline-rect"
                            />
                            <InputInfo errorMessage={passwordEditError.newPassword} />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-sub-gray">새 비밀번호 확인</p>
                        <div className="flex gap-2 items-center">
                            <PasswordInput
                                value={newPasswordConfirm}
                                onChange={handleNewPasswordConfirmChange}
                                designType="outline-rect"
                            />
                            <InputInfo errorMessage={passwordEditError.passwordConfirm} />
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 justify-end items-center">
                    {successEditPassword && <p className="text-sm text-sub-gray">비밀번호 변경이 완료되었습니다.</p>}
                    <PrimaryButton
                        className="w-fit"
                        onClick={handleNewPasswordApply}
                    >
                        저장
                    </PrimaryButton>
                    <CancelButton
                        className="w-fit"
                        onClick={onBack}
                    >
                        취소
                    </CancelButton>
                </div>
            </div>
        </div>
    )
}